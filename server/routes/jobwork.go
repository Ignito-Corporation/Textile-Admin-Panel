// jobwork.go
package routes

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"textile-admin-panel/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ---------- Domain structs (per-product tracking) ----------

// JobWorkOrderProduct - per-product counters and metadata
type JobWorkOrderProduct struct {
	ProductID        primitive.ObjectID  `bson:"product_id" json:"product_id"`
	ProductName      string              `bson:"product_name" json:"product_name"`
	Unit             string              `bson:"unit" json:"unit"`
	ExpectedQty      float64             `bson:"expected_qty" json:"expected_qty"`
	RemainingQty     float64             `bson:"remaining_qty" json:"remaining_qty"` // Added this field
	OutKnittingQty   float64             `bson:"out_knitting_qty" json:"out_knitting_qty"`
	InKnittingQty    float64             `bson:"in_knitting_qty" json:"in_knitting_qty"`
	OutDyeingQty     float64             `bson:"out_dyeing_qty" json:"out_dyeing_qty"`
	InDyeingQty      float64             `bson:"in_dyeing_qty" json:"in_dyeing_qty"`
	CurrentStage     string              `bson:"current_stage" json:"current_stage"`
	FinalProductID   *primitive.ObjectID `bson:"final_product_id,omitempty" json:"final_product_id,omitempty"`
	FinalProductName string              `bson:"final_product_name,omitempty" json:"final_product_name,omitempty"`
}

// JobWorkOrder - parent job work order for a PO (may contain many products)
type JobWorkOrder struct {
	ID             primitive.ObjectID    `bson:"_id,omitempty" json:"id,omitempty"`
	POID           *primitive.ObjectID   `bson:"po_id,omitempty" json:"po_id,omitempty"`
	PurchaseBillID *primitive.ObjectID   `bson:"purchase_bill_id,omitempty" json:"purchase_bill_id,omitempty"`
	PONumber       string                `bson:"po_number,omitempty" json:"po_number,omitempty"`
	Products       []JobWorkOrderProduct `bson:"products" json:"products"`
	CreatedAt      time.Time             `bson:"created_at" json:"created_at"`
	IsComplete     bool                  `bson:"is_complete" json:"is_complete"`
	Notes          string                `bson:"notes,omitempty" json:"notes,omitempty"`
}

// SubProduct - product line in suborders (OUT/IN)
type SubProduct struct {
	ProductID   primitive.ObjectID `bson:"product_id" json:"product_id"`
	ProductName string             `bson:"product_name" json:"product_name"`
	Unit        string             `bson:"unit" json:"unit"`
	LotNo       string             `bson:"lot_no,omitempty" json:"lot_no,omitempty"`
	Shade       string             `bson:"shade,omitempty" json:"shade,omitempty"`
	Quantity    float64            `bson:"quantity" json:"quantity"`
	// optional: final_name for dyeing IN entries
	FinalName string `bson:"final_name,omitempty" json:"final_name,omitempty"`
}

// JobWorkSubOrder - an OUT or IN voucher for a process
type JobWorkSubOrder struct {
	ID              primitive.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	ParentJobWorkID primitive.ObjectID  `bson:"parent_jobwork_id" json:"parent_jobwork_id"`
	VoucherNumber   string              `bson:"voucher_number" json:"voucher_number"`
	EntryType       string              `bson:"entry_type" json:"entry_type"` // "OUT" | "IN"
	Process         string              `bson:"process" json:"process"`       // "Knitting" | "Dyeing"
	IssuedDate      time.Time           `bson:"issued_date" json:"issued_date"`
	VendorID        *primitive.ObjectID `bson:"vendor_id,omitempty" json:"vendor_id,omitempty"`
	VendorName      string              `bson:"vendor_name" json:"vendor_name"`
	FpoNumber       string              `bson:"fpo_number,omitempty" json:"fpo_number,omitempty"`
	Products        []SubProduct        `bson:"products" json:"products"`
	SourceVoucher   string              `bson:"source_voucher,omitempty" json:"source_voucher,omitempty"`
	Override        bool                `bson:"override,omitempty" json:"override,omitempty"`       // allow over-issue/receive
	AuditNotes      string              `bson:"audit_notes,omitempty" json:"audit_notes,omitempty"` // reason
	IsIn            bool                `bson:"is_in" json:"is_in"`
	CreatedAt       time.Time           `bson:"created_at" json:"created_at"`
	CreatedBy       string              `bson:"created_by,omitempty" json:"created_by,omitempty"`
	Remarks         string              `bson:"remarks,omitempty" json:"remarks,omitempty"`
}

// ---------- Helpers & Constants ----------

var (
	jobWorkOrdersColl    = func() *mongo.Collection { return db.Database.Collection("job_work_orders") }
	jobWorkSubordersColl = func() *mongo.Collection { return db.Database.Collection("job_work_suborders") }
	stocksColl           = func() *mongo.Collection { return db.Database.Collection("stocks") }
)

func nowUTC() time.Time { return time.Now().UTC() }

// find product index in parent products slice; returns -1 if not found
func findProductIndex(products []JobWorkOrderProduct, pid primitive.ObjectID) int {
	for i := range products {
		if products[i].ProductID == pid {
			return i
		}
	}
	return -1
}

// ---------- Create JobWork Order ----------
func CreateJobWorkOrder(c *gin.Context) {
	var payload struct {
		POID           string `json:"po_id"`
		PurchaseBillID string `json:"purchase_bill_id,omitempty"`
		PONumber       string `json:"po_number,omitempty"`
		Products       []struct {
			ProductID   string  `json:"product_id"`
			ProductName string  `json:"product_name"`
			Unit        string  `json:"unit"`
			ExpectedQty float64 `json:"expected_qty"`
		} `json:"products"`
		Notes string `json:"notes,omitempty"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}

	var poID *primitive.ObjectID
	if payload.POID != "" {
		oid, err := primitive.ObjectIDFromHex(payload.POID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid po_id"})
			return
		}
		poID = &oid
	}

	var billID *primitive.ObjectID
	if payload.PurchaseBillID != "" {
		oid, err := primitive.ObjectIDFromHex(payload.PurchaseBillID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid purchase_bill_id"})
			return
		}
		billID = &oid
	}

	if len(payload.Products) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "products required"})
		return
	}

	var products []JobWorkOrderProduct
	for _, p := range payload.Products {
		pid, err := primitive.ObjectIDFromHex(p.ProductID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product id", "product_id": p.ProductID})
			return
		}
		products = append(products, JobWorkOrderProduct{
			ProductID:      pid,
			ProductName:    p.ProductName,
			Unit:           p.Unit,
			ExpectedQty:    p.ExpectedQty,
			OutKnittingQty: 0,
			InKnittingQty:  0,
			OutDyeingQty:   0,
			InDyeingQty:    0,
			CurrentStage:   "Pending",
		})
	}

	order := JobWorkOrder{
		POID:           poID,
		PurchaseBillID: billID,
		PONumber:       payload.PONumber,
		Products:       products,
		CreatedAt:      nowUTC(),
		IsComplete:     false,
		Notes:          payload.Notes,
	}

	res, err := jobWorkOrdersColl().InsertOne(context.Background(), order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create jobwork order", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "jobwork order created", "order_id": res.InsertedID})
}

// ---------- Create SubOrder (OUT or IN) ----------
// Validations:
// - For OUT: ensure qty <= remaining to issue for that product (unless override)
// - For IN: ensure cumulative IN <= cumulative OUT issued (unless override) -- per-process
// All writes are done in a transaction: insert suborder + update parent product counters + do transitions + create stock if required.
func CreateJobWorkSubOrder(c *gin.Context) {
	var payload struct {
		ParentJobWorkID string       `json:"parent_jobwork_id"`
		VoucherNumber   string       `json:"voucher_number,omitempty"`
		EntryType       string       `json:"entry_type"` // OUT | IN
		Process         string       `json:"process"`    // Knitting | Dyeing
		IssuedDate      *time.Time   `json:"issued_date,omitempty"`
		VendorID        string       `json:"vendor_id,omitempty"`
		VendorName      string       `json:"vendor_name,omitempty"`
		FpoNumber       string       `json:"fpo_number,omitempty"`
		Products        []SubProduct `json:"products"`
		SourceVoucher   string       `json:"source_voucher,omitempty"`
		Override        bool         `json:"override,omitempty"`
		AuditNotes      string       `json:"audit_notes,omitempty"`
		CreatedBy       string       `json:"created_by,omitempty"`
		Remarks         string       `json:"remarks,omitempty"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}

	parentID, err := primitive.ObjectIDFromHex(payload.ParentJobWorkID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid parent_jobwork_id"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client := db.Database.Client()
	session, err := client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start db session", "details": err.Error()})
		return
	}
	defer session.EndSession(ctx)

	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		var parent JobWorkOrder
		if err := jobWorkOrdersColl().FindOne(sessCtx, bson.M{"_id": parentID}).Decode(&parent); err != nil {
			return nil, errors.New("parent jobwork not found")
		}

		type prodChange struct {
			ProdIdx int
			Inc     bson.M
			Set     bson.M
		}
		var changes []prodChange
		var convertProducts []SubProduct

		for _, sp := range payload.Products {
			pid := sp.ProductID
			if err != nil {
				return nil, fmt.Errorf("invalid product_id format: %s", sp.ProductID)
			}

			idx := -1
			for i, p := range parent.Products {
				if p.ProductID == pid {
					idx = i
					break
				}
			}
			if idx < 0 {
				return nil, fmt.Errorf("product %s not found in parent jobwork", pid.Hex())
			}

			pp := parent.Products[idx]
			q := sp.Quantity

			inc := bson.M{}
			set := bson.M{}

			switch payload.Process {
			case "Knitting":
				if payload.EntryType == "OUT" {
					inc["products.$[p].out_knitting_qty"] = q
					set["products.$[p].remaining_qty"] = pp.ExpectedQty - pp.OutKnittingQty - q
					if pp.CurrentStage == "Pending" {
						set["products.$[p].current_stage"] = "Knitting"
					}
				} else {
					inc["products.$[p].in_knitting_qty"] = q
					set["products.$[p].remaining_qty"] = pp.OutKnittingQty - (pp.InKnittingQty + q)
					if pp.InKnittingQty+q >= pp.ExpectedQty {
						set["products.$[p].current_stage"] = "Dyeing"
					}
				}
			case "Dyeing":
				if payload.EntryType == "OUT" {
					inc["products.$[p].out_dyeing_qty"] = q
					set["products.$[p].remaining_qty"] = pp.InKnittingQty - pp.OutDyeingQty - q
				} else {
					inc["products.$[p].in_dyeing_qty"] = q
					set["products.$[p].remaining_qty"] = pp.OutDyeingQty - (pp.InDyeingQty + q)
					if pp.InDyeingQty+q >= pp.ExpectedQty || pp.InDyeingQty+q >= pp.OutDyeingQty {
						set["products.$[p].current_stage"] = "Completed"
						if sp.FinalName != "" {
							set["products.$[p].final_product_name"] = sp.FinalName
						}
						convertProducts = append(convertProducts, sp)
					}
				}
			}

			changes = append(changes, prodChange{
				ProdIdx: idx,
				Inc:     inc,
				Set:     set,
			})
		}

		voucher := payload.VoucherNumber
		if voucher == "" {
			voucher = fmt.Sprintf("%s-%d", payload.EntryType, time.Now().UnixNano())
		}

		var vendorOid *primitive.ObjectID
		if payload.VendorID != "" {
			if oid, err := primitive.ObjectIDFromHex(payload.VendorID); err == nil {
				vendorOid = &oid
			}
		}

		issuedDate := nowUTC()
		if payload.IssuedDate != nil {
			issuedDate = *payload.IssuedDate
		}

		sub := JobWorkSubOrder{
			ParentJobWorkID: parentID,
			VoucherNumber:   voucher,
			EntryType:       payload.EntryType,
			Process:         payload.Process,
			IssuedDate:      issuedDate,
			VendorID:        vendorOid,
			VendorName:      payload.VendorName,
			FpoNumber:       payload.FpoNumber,
			Products:        payload.Products,
			SourceVoucher:   payload.SourceVoucher,
			Override:        payload.Override,
			AuditNotes:      payload.AuditNotes,
			IsIn:            payload.EntryType == "IN",
			CreatedAt:       nowUTC(),
			CreatedBy:       payload.CreatedBy,
			Remarks:         payload.Remarks,
		}

		if _, err := jobWorkSubordersColl().InsertOne(sessCtx, sub); err != nil {
			return nil, fmt.Errorf("failed to insert suborder: %w", err)
		}

		for _, ch := range changes {
			update := bson.M{}
			if len(ch.Inc) > 0 {
				update["$inc"] = ch.Inc
			}
			if len(ch.Set) > 0 {
				update["$set"] = ch.Set
			}

			arrayFilter := options.Update().SetArrayFilters(options.ArrayFilters{
				Filters: []interface{}{bson.M{"p.product_id": parent.Products[ch.ProdIdx].ProductID}},
			})

			if _, err := jobWorkOrdersColl().UpdateOne(sessCtx, bson.M{"_id": parentID}, update, arrayFilter); err != nil {
				return nil, fmt.Errorf("failed to update parent counters: %w", err)
			}
		}

		if err := jobWorkOrdersColl().FindOne(sessCtx, bson.M{"_id": parentID}).Decode(&parent); err != nil {
			return nil, fmt.Errorf("failed to re-read parent: %w", err)
		}

		allCompleted := true
		for _, p := range parent.Products {
			if p.CurrentStage != "Completed" {
				allCompleted = false
				break
			}
		}
		if allCompleted && !parent.IsComplete {
			if _, err := jobWorkOrdersColl().UpdateOne(sessCtx, bson.M{"_id": parentID}, bson.M{"$set": bson.M{"is_complete": true}}); err != nil {
				return nil, fmt.Errorf("failed to mark parent complete: %w", err)
			}
		}

		for _, cp := range convertProducts {
			pid := cp.ProductID
			stockDoc := bson.M{
				"product_id":         pid,
				"source_jobwork_id":  parentID,
				"source_voucher":     voucher,
				"lot_no":             cp.LotNo,
				"qty":                cp.Quantity,
				"unit":               cp.Unit,
				"received_at":        nowUTC(),
				"remarks":            "Converted from jobwork (dyeing IN)",
				"final_product_name": cp.FinalName,
			}
			if _, err := stocksColl().InsertOne(sessCtx, stockDoc); err != nil {
				return nil, fmt.Errorf("failed to create stock doc: %w", err)
			}
		}

		return nil, nil
	}

	if _, err := session.WithTransaction(ctx, callback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to create suborder", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Suborder created", "voucher_number": payload.VoucherNumber})
}

// ---------- Get SubOrder by voucher ----------
func GetJobWorkSubOrderByVoucher(c *gin.Context) {
	voucher := c.Param("voucher")
	if voucher == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "voucher required"})
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var sub JobWorkSubOrder
	if err := jobWorkSubordersColl().FindOne(ctx, bson.M{"voucher_number": voucher}).Decode(&sub); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "voucher not found", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sub)
}

// ---------- Get JobWork Order ----------
func GetJobWorkOrder(c *gin.Context) {
	id := c.Param("id")
	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()

	var oid primitive.ObjectID
	var err error
	// allow either hex id or po_number
	if primitive.IsValidObjectID(id) {
		oid, err = primitive.ObjectIDFromHex(id)
		if err == nil {
			var order JobWorkOrder
			err = jobWorkOrdersColl().FindOne(ctx, bson.M{"_id": oid}).Decode(&order)
			if err == nil {
				c.JSON(http.StatusOK, order)
				return
			}
		}
	}
	// fallback to search by po_number
	var order JobWorkOrder
	if err := jobWorkOrdersColl().FindOne(ctx, bson.M{"po_number": id}).Decode(&order); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "jobwork order not found"})
		return
	}
	c.JSON(http.StatusOK, order)
}

// ---------- List SubOrders ----------
func ListJobWorkSubOrders(c *gin.Context) {
	parentID := c.Query("parent_id")
	process := c.Query("process")
	entryType := c.Query("entry_type")

	filter := bson.M{}
	if parentID != "" {
		oid, err := primitive.ObjectIDFromHex(parentID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid parent_id"})
			return
		}
		filter["parent_jobwork_id"] = oid
	}
	if process != "" {
		filter["process"] = process
	}
	if entryType != "" {
		filter["entry_type"] = entryType
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cursor, err := jobWorkSubordersColl().Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)
	var out []JobWorkSubOrder
	if err := cursor.All(ctx, &out); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode failed", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ---------- Get Completed Final Products (jobwork orders where is_complete true) ----------
func GetCompletedFinalProducts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cursor, err := jobWorkOrdersColl().Find(ctx, bson.M{"is_complete": true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)
	var out []JobWorkOrder
	if err := cursor.All(ctx, &out); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode failed", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ---------- Get Out Products (open OUT suborders) ----------
func GetOutProducts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	filter := bson.M{"entry_type": "OUT"}
	cursor, err := jobWorkSubordersColl().Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)
	var out []JobWorkSubOrder
	if err := cursor.All(ctx, &out); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode failed", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, out)
}

// GetAvailableKnitting returns purchase bill products that still have qty left to send for knitting
func GetAvailableKnitting(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	purchaseBillColl := db.Database.Collection("purchase_bills")

	// Get PO number from path parameter
	poNumber := c.Param("po_number")
	if poNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PO number is required"})
		return
	}

	// Exact match (case insensitive) for PO number
	filter := bson.M{
		"vendor.ponumber": bson.M{
			"$regex": primitive.Regex{Pattern: "^" + regexp.QuoteMeta(poNumber) + "$", Options: "i"},
		},
	}

	// Find matching purchase bills
	var bills []PurchaseBill
	cursor, err := purchaseBillColl.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch purchase bills", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &bills); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode bills", "details": err.Error()})
		return
	}

	if len(bills) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No bills found with the given PO number"})
		return
	}

	// Prepare response - we'll take the first matching bill (assuming PO numbers are unique)
	bill := bills[0]

	response := gin.H{
		"vendor_id":   bill.Vendor.VendorID,
		"vendor_name": bill.Vendor.VendorName,
		"po_number":   bill.Vendor.PONumber,
		"products":    bill.Products,
	}

	c.JSON(http.StatusOK, response)
}

// GetAvailableDying returns knitted products that still have qty left to send for dying
// GetAvailableDying returns knitted products that are available for dying based on the PO number
func GetAvailableDying(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get PO number from path parameter
	poNumber := c.Param("po_number")
	if poNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PO number is required"})
		return
	}

	// Step 1: Find the job work order by PO number to get in_knitting_qty (max qty available for dying)
	var jobWorkOrder JobWorkOrder
	err := jobWorkOrdersColl().FindOne(ctx, bson.M{"po_number": poNumber}).Decode(&jobWorkOrder)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Job work order not found for the given PO number"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch job work order", "details": err.Error()})
		return
	}

	// Step 2: Find all knitting IN suborders for this job work order
	filter := bson.M{
		"parent_jobwork_id": jobWorkOrder.ID,
		"process":           "Knitting",
		"is_in":             true,
	}

	cursor, err := jobWorkSubordersColl().Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch knitting suborders", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var knittingSubOrders []JobWorkSubOrder
	if err := cursor.All(ctx, &knittingSubOrders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode knitting suborders", "details": err.Error()})
		return
	}

	// Step 3: Combine quantities from all knitting IN suborders
	type ProductSummary struct {
		ProductID   primitive.ObjectID
		ProductName string
		Unit        string
		TotalQty    float64
		VendorID    *primitive.ObjectID
		VendorName  string
		LotNo       string
		Shade       string
	}

	productMap := make(map[primitive.ObjectID]ProductSummary)

	for _, subOrder := range knittingSubOrders {
		for _, product := range subOrder.Products {
			if summary, exists := productMap[product.ProductID]; exists {
				summary.TotalQty += product.Quantity
				productMap[product.ProductID] = summary
			} else {
				productMap[product.ProductID] = ProductSummary{
					ProductID:   product.ProductID,
					ProductName: product.ProductName,
					Unit:        product.Unit,
					TotalQty:    product.Quantity,
					VendorID:    subOrder.VendorID,
					VendorName:  subOrder.VendorName,
					LotNo:       product.LotNo,
					Shade:       product.Shade,
				}
			}
		}
	}

	// Step 4: Prepare response with parent ID and combined product information
	type Response struct {
		ParentJobWorkID primitive.ObjectID  `json:"parent_jobwork_id"`
		VendorID        *primitive.ObjectID `json:"vendor_id,omitempty"`
		VendorName      string              `json:"vendor_name"`
		Products        []struct {
			ProductID    primitive.ObjectID `json:"product_id"`
			ProductName  string             `json:"product_name"`
			Unit         string             `json:"unit"`
			AvailableQty float64            `json:"available_qty"`
			LotNo        string             `json:"lot_no,omitempty"`
			Shade        string             `json:"shade,omitempty"`
			MaxQty       float64            `json:"max_qty"` // from in_knitting_qty in parent
		} `json:"products"`
	}

	var response Response
	response.ParentJobWorkID = jobWorkOrder.ID
	response.Products = make([]struct {
		ProductID    primitive.ObjectID `json:"product_id"`
		ProductName  string             `json:"product_name"`
		Unit         string             `json:"unit"`
		AvailableQty float64            `json:"available_qty"`
		LotNo        string             `json:"lot_no,omitempty"`
		Shade        string             `json:"shade,omitempty"`
		MaxQty       float64            `json:"max_qty"`
	}, 0)

	// Get vendor info from the first suborder (assuming same vendor for all)
	if len(knittingSubOrders) > 0 {
		response.VendorID = knittingSubOrders[0].VendorID
		response.VendorName = knittingSubOrders[0].VendorName
	}

	// Find max qty (in_knitting_qty) from parent order for each product
	for productID, summary := range productMap {
		// Find the product in the parent order to get in_knitting_qty
		var maxQty float64
		for _, product := range jobWorkOrder.Products {
			if product.ProductID == productID {
				maxQty = product.InKnittingQty
				break
			}
		}

		response.Products = append(response.Products, struct {
			ProductID    primitive.ObjectID `json:"product_id"`
			ProductName  string             `json:"product_name"`
			Unit         string             `json:"unit"`
			AvailableQty float64            `json:"available_qty"`
			LotNo        string             `json:"lot_no,omitempty"`
			Shade        string             `json:"shade,omitempty"`
			MaxQty       float64            `json:"max_qty"`
		}{
			ProductID:    productID,
			ProductName:  summary.ProductName,
			Unit:         summary.Unit,
			AvailableQty: summary.TotalQty,
			LotNo:        summary.LotNo,
			Shade:        summary.Shade,
			MaxQty:       maxQty,
		})
	}

	c.JSON(http.StatusOK, response)
}

// ---------- Update SubOrder is_in status ----------
// UpdateSubOrderIsInStatus updates suborder status and parent order quantities
// Accepts either PO number (starts with "PO") or voucher number (starts with "OUT")
func UpdateSubOrderIsInStatus(c *gin.Context) {
	identifier := c.Param("identifier")
	if identifier == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PO number or voucher number required"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client := db.Database.Client()
	session, err := client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start db session", "details": err.Error()})
		return
	}
	defer session.EndSession(ctx)

	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		var subOrder JobWorkSubOrder
		var parentOrder JobWorkOrder
		var processToUpdate string

		// Determine if identifier is PO number or voucher number
		if strings.HasPrefix(identifier, "PO") {
			// Case 1: PO number provided
			err := jobWorkOrdersColl().FindOne(sessCtx, bson.M{"po_number": identifier}).Decode(&parentOrder)
			if err != nil {
				return nil, fmt.Errorf("parent jobwork order not found for PO: %s", identifier)
			}

			// Find the latest OUT suborder for this parent that isn't marked as IN yet
			// Priority: Dyeing > Knitting
			filter := bson.M{
				"parent_jobwork_id": parentOrder.ID,
				"is_in":             false,
				"entry_type":        "OUT",
			}

			// First try to find a Dyeing process
			filter["process"] = "Dyeing"
			err = jobWorkSubordersColl().FindOne(
				sessCtx,
				filter,
				options.FindOne().SetSort(bson.M{"created_at": -1}),
			).Decode(&subOrder)

			if err != nil {
				// If no Dyeing found, try Knitting
				filter["process"] = "Knitting"
				err = jobWorkSubordersColl().FindOne(
					sessCtx,
					filter,
					options.FindOne().SetSort(bson.M{"created_at": -1}),
				).Decode(&subOrder)
				if err != nil {
					return nil, fmt.Errorf("no OUT suborders found for PO: %s that aren't already IN", identifier)
				}
				processToUpdate = "Knitting"
			} else {
				processToUpdate = "Dyeing"
			}
		} else if strings.HasPrefix(identifier, "OUT") {
			// Case 2: Voucher number provided
			err := jobWorkSubordersColl().FindOne(sessCtx, bson.M{"voucher_number": identifier}).Decode(&subOrder)
			if err != nil {
				return nil, fmt.Errorf("suborder not found for voucher: %s", identifier)
			}

			if subOrder.IsIn {
				return nil, fmt.Errorf("suborder %s is already marked as IN", identifier)
			}
			if subOrder.EntryType != "OUT" {
				return nil, fmt.Errorf("suborder %s is not an OUT entry", identifier)
			}

			processToUpdate = subOrder.Process

			// Get the parent order
			err = jobWorkOrdersColl().FindOne(sessCtx, bson.M{"_id": subOrder.ParentJobWorkID}).Decode(&parentOrder)
			if err != nil {
				return nil, fmt.Errorf("parent jobwork order not found for suborder")
			}
		} else {
			return nil, fmt.Errorf("identifier must start with 'PO' (PO number) or 'OUT' (voucher number)")
		}

		// Update the suborder to mark as IN
		update := bson.M{"$set": bson.M{"is_in": true}}
		result, err := jobWorkSubordersColl().UpdateOne(
			sessCtx,
			bson.M{"_id": subOrder.ID},
			update,
		)
		if err != nil || result.MatchedCount == 0 {
			return nil, fmt.Errorf("failed to update suborder status")
		}

		// Track if all products will be completed after this update
		allProductsCompleted := true
		productsToComplete := make(map[primitive.ObjectID]bool)

		// Update the parent order quantities and stage
		for _, subProduct := range subOrder.Products {
			// Find the corresponding product in the parent order
			for _, parentProduct := range parentOrder.Products {
				if parentProduct.ProductID == subProduct.ProductID {
					// Prepare update for this product
					update := bson.M{}
					incField := ""
					setFields := bson.M{}

					switch processToUpdate {
					case "Knitting":
						incField = "in_knitting_qty"
						setFields["remaining_qty"] = parentProduct.OutKnittingQty - (parentProduct.InKnittingQty + subProduct.Quantity)
						if parentProduct.InKnittingQty+subProduct.Quantity >= parentProduct.ExpectedQty {
							setFields["current_stage"] = "Dyeing"
						}
					case "Dyeing":
						incField = "in_dyeing_qty"
						setFields["remaining_qty"] = parentProduct.OutDyeingQty - (parentProduct.InDyeingQty + subProduct.Quantity)

						// For Dyeing IN, mark as completed if we've received all expected quantity
						if parentProduct.InDyeingQty+subProduct.Quantity >= parentProduct.ExpectedQty ||
							parentProduct.InDyeingQty+subProduct.Quantity >= parentProduct.OutDyeingQty {
							setFields["current_stage"] = "Completed"
							productsToComplete[parentProduct.ProductID] = true
						} else {
							allProductsCompleted = false
						}
					}

					if incField != "" {
						update["$inc"] = bson.M{fmt.Sprintf("products.$[p].%s", incField): subProduct.Quantity}
					}
					if len(setFields) > 0 {
						update["$set"] = bson.M{}
						for k, v := range setFields {
							update["$set"].(bson.M)[fmt.Sprintf("products.$[p].%s", k)] = v
						}
					}

					// Apply the update with array filter
					arrayFilter := options.Update().SetArrayFilters(options.ArrayFilters{
						Filters: []interface{}{bson.M{"p.product_id": subProduct.ProductID}},
					})

					if _, err := jobWorkOrdersColl().UpdateOne(
						sessCtx,
						bson.M{"_id": parentOrder.ID},
						update,
						arrayFilter,
					); err != nil {
						return nil, fmt.Errorf("failed to update parent order quantities: %w", err)
					}
					break
				}
			}
		}

		// For Dyeing process, check if all products are being completed
		if processToUpdate == "Dyeing" {
			// Verify all products in the suborder are being completed
			for _, subProduct := range subOrder.Products {
				if !productsToComplete[subProduct.ProductID] {
					allProductsCompleted = false
					break
				}
			}

			// Additionally verify all products in parent order are completed
			if allProductsCompleted {
				var updatedParent JobWorkOrder
				if err := jobWorkOrdersColl().FindOne(sessCtx, bson.M{"_id": parentOrder.ID}).Decode(&updatedParent); err != nil {
					return nil, fmt.Errorf("failed to verify parent completion status: %w", err)
				}

				for _, p := range updatedParent.Products {
					if p.CurrentStage != "Completed" {
						allProductsCompleted = false
						break
					}
				}
			}
		}

		// Mark parent order as complete if all products are completed
		if allProductsCompleted && !parentOrder.IsComplete {
			if _, err := jobWorkOrdersColl().UpdateOne(
				sessCtx,
				bson.M{"_id": parentOrder.ID},
				bson.M{"$set": bson.M{"is_complete": true}},
			); err != nil {
				return nil, fmt.Errorf("failed to mark parent complete: %w", err)
			}
		}

		return gin.H{
			"message":            "Suborder updated successfully",
			"voucher_number":     subOrder.VoucherNumber,
			"parent_jobwork_id":  parentOrder.ID.Hex(),
			"updated_process":    processToUpdate,
			"updated_quantities": len(subOrder.Products),
			"order_completed":    allProductsCompleted,
		}, nil
	}

	result, err := session.WithTransaction(ctx, callback)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to update suborder", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetProductsForInEntry returns products that can be marked as IN, either by PO number or voucher number
func GetProductsForInEntry(c *gin.Context) {
	identifier := c.Param("identifier")
	if identifier == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "identifier (PO or voucher number) required"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var response struct {
		ParentJobWorkID primitive.ObjectID  `json:"parent_jobwork_id"`
		VendorID        *primitive.ObjectID `json:"vendor_id,omitempty"`
		VendorName      string              `json:"vendor_name"`
		Process         string              `json:"process"`
		Products        []struct {
			ProductID    primitive.ObjectID `json:"product_id"`
			ProductName  string             `json:"product_name"`
			Unit         string             `json:"unit"`
			LotNo        string             `json:"lot_no,omitempty"`
			Shade        string             `json:"shade,omitempty"`
			IssuedQty    float64            `json:"issued_qty"`    // Original OUT quantity
			ReceivedQty  float64            `json:"received_qty"`  // Already received quantity (IN)
			AvailableQty float64            `json:"available_qty"` // Quantity available to receive (IssuedQty - ReceivedQty)
			MaxQty       float64            `json:"max_qty"`       // Maximum quantity that can be received (for validation)
		} `json:"products"`
	}

	// Case 1: Voucher number provided (starts with "OUT")
	if strings.HasPrefix(identifier, "OUT") {
		var subOrder JobWorkSubOrder
		if err := jobWorkSubordersColl().FindOne(ctx, bson.M{"voucher_number": identifier}).Decode(&subOrder); err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "suborder not found"})
			return
		}

		// Validate it's an OUT entry
		if subOrder.EntryType != "OUT" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "only OUT entries can be marked as IN"})
			return
		}

		// Validate it's not already marked as IN
		if subOrder.IsIn {
			c.JSON(http.StatusBadRequest, gin.H{"error": "suborder is already marked as IN"})
			return
		}

		// Get the parent order to get current quantities
		var parentOrder JobWorkOrder
		if err := jobWorkOrdersColl().FindOne(ctx, bson.M{"_id": subOrder.ParentJobWorkID}).Decode(&parentOrder); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get parent order"})
			return
		}

		response.ParentJobWorkID = parentOrder.ID
		response.VendorID = subOrder.VendorID
		response.VendorName = subOrder.VendorName
		response.Process = subOrder.Process

		// Prepare products with available quantities
		for _, subProduct := range subOrder.Products {
			// Find the product in parent order to get current quantities
			var issuedQty, receivedQty, maxQty float64
			for _, parentProduct := range parentOrder.Products {
				if parentProduct.ProductID == subProduct.ProductID {
					switch subOrder.Process {
					case "Knitting":
						issuedQty = parentProduct.OutKnittingQty
						receivedQty = parentProduct.InKnittingQty
						maxQty = parentProduct.OutKnittingQty - parentProduct.InKnittingQty
					case "Dyeing":
						issuedQty = parentProduct.OutDyeingQty
						receivedQty = parentProduct.InDyeingQty
						maxQty = parentProduct.OutDyeingQty - parentProduct.InDyeingQty
					}
					break
				}
			}

			response.Products = append(response.Products, struct {
				ProductID    primitive.ObjectID `json:"product_id"`
				ProductName  string             `json:"product_name"`
				Unit         string             `json:"unit"`
				LotNo        string             `json:"lot_no,omitempty"`
				Shade        string             `json:"shade,omitempty"`
				IssuedQty    float64            `json:"issued_qty"`
				ReceivedQty  float64            `json:"received_qty"`
				AvailableQty float64            `json:"available_qty"`
				MaxQty       float64            `json:"max_qty"`
			}{
				ProductID:    subProduct.ProductID,
				ProductName:  subProduct.ProductName,
				Unit:         subProduct.Unit,
				LotNo:        subProduct.LotNo,
				Shade:        subProduct.Shade,
				IssuedQty:    issuedQty,
				ReceivedQty:  receivedQty,
				AvailableQty: maxQty,
				MaxQty:       maxQty,
			})
		}

		c.JSON(http.StatusOK, response)
		return
	}

	// Case 2: PO number provided (starts with "PO")
	if strings.HasPrefix(identifier, "PO") {
		var parentOrder JobWorkOrder
		if err := jobWorkOrdersColl().FindOne(ctx, bson.M{"po_number": identifier}).Decode(&parentOrder); err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "jobwork order not found for PO"})
			return
		}

		response.ParentJobWorkID = parentOrder.ID

		// Determine which process to use (prefer Dyeing over Knitting)
		process := ""
		for _, product := range parentOrder.Products {
			if product.OutDyeingQty > 0 && product.InDyeingQty < product.OutDyeingQty {
				process = "Dyeing"
				break
			} else if product.OutKnittingQty > 0 && product.InKnittingQty < product.OutKnittingQty {
				process = "Knitting"
			}
		}

		if process == "" {
			c.JSON(http.StatusNotFound, gin.H{"error": "no products available for IN entry"})
			return
		}

		response.Process = process

		// Find the latest OUT suborder for this process to get vendor info
		var subOrder JobWorkSubOrder
		filter := bson.M{
			"parent_jobwork_id": parentOrder.ID,
			"process":           process,
			"entry_type":        "OUT",
			"is_in":             false,
		}
		opts := options.FindOne().SetSort(bson.M{"created_at": -1})
		if err := jobWorkSubordersColl().FindOne(ctx, filter, opts).Decode(&subOrder); err == nil {
			response.VendorID = subOrder.VendorID
			response.VendorName = subOrder.VendorName
		}

		// Prepare products with available quantities
		for _, product := range parentOrder.Products {
			var issuedQty, receivedQty, maxQty float64

			switch process {
			case "Knitting":
				if product.OutKnittingQty <= 0 || product.InKnittingQty >= product.OutKnittingQty {
					continue // Skip products not available for this process
				}
				issuedQty = product.OutKnittingQty
				receivedQty = product.InKnittingQty
				maxQty = product.OutKnittingQty - product.InKnittingQty
			case "Dyeing":
				if product.OutDyeingQty <= 0 || product.InDyeingQty >= product.OutDyeingQty {
					continue // Skip products not available for this process
				}
				issuedQty = product.OutDyeingQty
				receivedQty = product.InDyeingQty
				maxQty = product.OutDyeingQty - product.InDyeingQty
			}

			response.Products = append(response.Products, struct {
				ProductID    primitive.ObjectID `json:"product_id"`
				ProductName  string             `json:"product_name"`
				Unit         string             `json:"unit"`
				LotNo        string             `json:"lot_no,omitempty"`
				Shade        string             `json:"shade,omitempty"`
				IssuedQty    float64            `json:"issued_qty"`
				ReceivedQty  float64            `json:"received_qty"`
				AvailableQty float64            `json:"available_qty"`
				MaxQty       float64            `json:"max_qty"`
			}{
				ProductID:    product.ProductID,
				ProductName:  product.ProductName,
				Unit:         product.Unit,
				IssuedQty:    issuedQty,
				ReceivedQty:  receivedQty,
				AvailableQty: maxQty,
				MaxQty:       maxQty,
			})
		}

		if len(response.Products) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "no products available for IN entry"})
			return
		}

		c.JSON(http.StatusOK, response)
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"error": "identifier must start with 'PO' or 'OUT'"})
}
