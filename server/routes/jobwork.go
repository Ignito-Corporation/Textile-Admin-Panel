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
	if len(payload.Products) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "products required"})
		return
	}
	entryType := payload.EntryType
	process := payload.Process
	if entryType != "OUT" && entryType != "IN" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "entry_type must be OUT or IN"})
		return
	}
	if process != "Knitting" && process != "Dyeing" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "process must be Knitting or Dyeing"})
		return
	}

	// session + transaction
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
		// 1) Load parent jobwork (read inside txn)
		var parent JobWorkOrder
		if err := jobWorkOrdersColl().FindOne(sessCtx, bson.M{"_id": parentID}).Decode(&parent); err != nil {
			return nil, errors.New("parent jobwork not found")
		}

		// 2) Validate & prepare updates per product
		// We'll accumulate array of increments to apply using arrayFilters
		type prodChange struct {
			ProdIdx int
			Inc     bson.M
			Set     bson.M
		}
		var changes []prodChange

		// track if we need to convert to stock per product (on dyeing IN)
		var convertProducts []SubProduct

		for _, sp := range payload.Products {
			pid := sp.ProductID
			idx := findProductIndex(parent.Products, pid)
			if idx < 0 {
				return nil, fmt.Errorf("product %s not found in parent jobwork", pid.Hex())
			}
			pp := parent.Products[idx]

			// compute numbers depending on process and entry type
			q := sp.Quantity
			if q <= 0 {
				return nil, fmt.Errorf("quantity must be > 0 for product %s", pid.Hex())
			}

			inc := bson.M{}
			set := bson.M{}

			// In the CreateJobWorkSubOrder function, modify the validation logic:

			switch process {
			case "Knitting":
				if entryType == "OUT" {
					// Calculate remaining quantity (expected - already issued)
					remaining := pp.ExpectedQty - pp.OutKnittingQty
					if q > remaining && !payload.Override {
						return nil, fmt.Errorf(
							"attempt to OUT %.3f but only %.3f remaining for product %s; pass override=true to force",
							q, remaining, pid.Hex())
					}
					inc["products.$[p].out_knitting_qty"] = q
					// Update remaining quantity display
					set["products.$[p].remaining_qty"] = remaining - q
					if pp.CurrentStage == "Pending" {
						set["products.$[p].current_stage"] = "Knitting"
					}
				} else { // IN for Knitting
					issuedOut := pp.OutKnittingQty
					if pp.InKnittingQty+q > issuedOut && !payload.Override {
						return nil, fmt.Errorf(
							"attempt to IN %.3f but only %.3f issued out for knitting for product %s",
							q, issuedOut-pp.InKnittingQty, pid.Hex())
					}
					inc["products.$[p].in_knitting_qty"] = q
					// Update remaining quantity for next stage
					set["products.$[p].remaining_qty"] = issuedOut - (pp.InKnittingQty + q)
					if pp.InKnittingQty+q >= pp.ExpectedQty {
						set["products.$[p].current_stage"] = "Dyeing"
					}
				}
			case "Dyeing":
				if entryType == "OUT" {
					remaining := pp.InKnittingQty - pp.OutDyeingQty
					if q > remaining && !payload.Override {
						return nil, fmt.Errorf(
							"attempt to OUT %.3f dyeing but only %.3f available (knitted qty) for product %s",
							q, remaining, pid.Hex())
					}
					inc["products.$[p].out_dyeing_qty"] = q
					// Update remaining quantity display
					set["products.$[p].remaining_qty"] = remaining - q
					if pp.CurrentStage == "Dyeing" {
						// keep as dyeing
					}
				} else { // IN for Dyeing
					issuedOut := pp.OutDyeingQty
					if pp.InDyeingQty+q > issuedOut && !payload.Override {
						return nil, fmt.Errorf(
							"attempt to IN %.3f dyeing but only %.3f issued out for dyeing for product %s",
							q, issuedOut-pp.InDyeingQty, pid.Hex())
					}
					inc["products.$[p].in_dyeing_qty"] = q
					// Update remaining quantity
					set["products.$[p].remaining_qty"] = issuedOut - (pp.InDyeingQty + q)
					if pp.InDyeingQty+q >= pp.ExpectedQty || pp.InDyeingQty+q >= issuedOut {
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
		} // end for each product

		// 3) Insert suborder doc
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

		// 4) Apply per-product updates using arrayFilters to target each product by product_id
		for _, ch := range changes {
			if len(ch.Inc) == 0 && len(ch.Set) == 0 {
				continue
			}
			update := bson.M{}
			if len(ch.Inc) > 0 {
				update["$inc"] = ch.Inc
			}
			if len(ch.Set) > 0 {
				if update["$set"] == nil {
					update["$set"] = ch.Set
				} else {
					for k, v := range ch.Set {
						update["$set"].(bson.M)[k] = v
					}
				}
			}
			arrayFilter := options.Update().SetArrayFilters(options.ArrayFilters{
				Filters: []interface{}{bson.M{"p.product_id": parent.Products[ch.ProdIdx].ProductID}},
			})
			if _, err := jobWorkOrdersColl().UpdateOne(sessCtx, bson.M{"_id": parentID}, update, arrayFilter); err != nil {
				return nil, fmt.Errorf("failed to update parent counters: %w", err)
			}
		}

		// 5) After updates, refresh the parent product slices to check whole-order completion & possible stock conversion
		if err := jobWorkOrdersColl().FindOne(sessCtx, bson.M{"_id": parentID}).Decode(&parent); err != nil {
			return nil, fmt.Errorf("failed to re-read parent: %w", err)
		}

		// If any products became Completed, and overall all products Completed -> mark order complete
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

		// 6) Convert finished products to stock (if any convertProducts). Do inside txn for atomicity.
		for _, cp := range convertProducts {
			stockDoc := bson.M{
				"product_id":         cp.ProductID,
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
		// transaction failed: return error message
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
	jobWorkSubOrderColl := db.Database.Collection("jobwork_suborders")

	// Get optional vendor_name from query
	vendorName := strings.TrimSpace(c.Query("vendor_name"))

	// Build filter for purchase bills
	filter := bson.M{}
	if vendorName != "" {
		// Match the actual Mongo field name "partyname" with case-insensitive regex
		filter["partyname"] = bson.M{
			"$regex": primitive.Regex{Pattern: "^" + regexp.QuoteMeta(vendorName) + "$", Options: "i"},
		}
	}

	// Fetch all (or vendor-filtered) purchase bills
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

	type AvailableProduct struct {
		ProductID   string  `json:"product_id"`
		ProductName string  `json:"product_name"`
		Unit        string  `json:"unit"`
		Shade       string  `json:"shade"`
		LotNo       string  `json:"lot_no"`
		Remaining   float64 `json:"remaining_qty"`
	}

	var available []AvailableProduct

	for _, bill := range bills {
		for _, p := range bill.Products {

			// Build match condition for both string & ObjectID
			orConditions := []bson.M{{"product_id": p.ProductID}}
			if oid, err := primitive.ObjectIDFromHex(p.ProductID); err == nil {
				orConditions = append(orConditions, bson.M{"product_id": oid})
			}

			match := bson.M{
				"process_type": "Knitting",
				"$or":          orConditions,
			}

			// Aggregate issued qty
			var totalSent struct {
				Total float64 `bson:"total"`
			}
			pipeline := mongo.Pipeline{
				{{Key: "$match", Value: match}},
				{{Key: "$group", Value: bson.M{
					"_id":   nil,
					"total": bson.M{"$sum": "$issue_qty"},
				}}},
			}

			cur, err := jobWorkSubOrderColl.Aggregate(ctx, pipeline)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Aggregation failed", "details": err.Error()})
				return
			}
			if cur.Next(ctx) {
				_ = cur.Decode(&totalSent)
			}
			cur.Close(ctx)

			remaining := p.ProductQty - totalSent.Total

			// Debugging
			println("Bill:", bill.PartyName, "| Product:", p.ProductName, "| Qty:", p.ProductQty, "| Sent:", totalSent.Total, "| Remaining:", remaining)

			if remaining > 0 {
				available = append(available, AvailableProduct{
					ProductID:   p.ProductID,
					ProductName: p.ProductName,
					Unit:        p.Unit,
					Shade:       p.Shade,
					LotNo:       p.LotNo,
					Remaining:   remaining,
				})
			}
		}
	}

	if available == nil {
		available = []AvailableProduct{}
	}
	c.JSON(http.StatusOK, available)
}

// GetAvailableDying returns knitted products that still have qty left to send for dying
func GetAvailableDying(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	jobWorkSubOrderColl := db.Database.Collection("jobwork_suborders")

	// Fetch all knitting_in entries
	matchKnitting := bson.M{"process_type": "Knitting-In"}
	cursor, err := jobWorkSubOrderColl.Find(ctx, matchKnitting)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch knitting-in records", "details": err.Error()})
		return
	}

	var knittingIn []bson.M
	if err := cursor.All(ctx, &knittingIn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode knitting-in", "details": err.Error()})
		return
	}

	type AvailableProduct struct {
		ProductID   string  `json:"product_id"`
		ProductName string  `json:"product_name"`
		Unit        string  `json:"unit"`
		Shade       string  `json:"shade"`
		LotNo       string  `json:"lot_no"`
		Remaining   float64 `json:"remaining_qty"`
	}

	var available []AvailableProduct

	for _, record := range knittingIn {
		productID := record["product_id"].(string)
		productName := record["product_name"].(string)
		unit := record["unit"].(string)
		shade := record["shade"].(string)
		lotNo := record["lot_no"].(string)
		qty := record["issue_qty"].(float64)

		// Get total already sent for dying
		match := bson.M{"product_id": productID, "process_type": "Dying"}
		totalSent := struct {
			Total float64 `bson:"total"`
		}{}
		pipeline := mongo.Pipeline{
			{{Key: "$match", Value: match}},
			{{Key: "$group", Value: bson.M{"_id": nil, "total": bson.M{"$sum": "$issue_qty"}}}},
		}
		cur, _ := jobWorkSubOrderColl.Aggregate(ctx, pipeline)
		if cur.Next(ctx) {
			cur.Decode(&totalSent)
		}
		cur.Close(ctx)

		remaining := qty - totalSent.Total
		if remaining > 0 {
			available = append(available, AvailableProduct{
				ProductID:   productID,
				ProductName: productName,
				Unit:        unit,
				Shade:       shade,
				LotNo:       lotNo,
				Remaining:   remaining,
			})
		}
	}

	c.JSON(http.StatusOK, available)
}

// ---------- Update SubOrder is_in status ----------
func UpdateSubOrderIsInStatus(c *gin.Context) {
	voucher := c.Param("voucher")
	if voucher == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "voucher required"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Update the is_in status to true
	update := bson.M{"$set": bson.M{"is_in": true}}
	result, err := jobWorkSubordersColl().UpdateOne(
		ctx,
		bson.M{"voucher_number": voucher},
		update,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update suborder", "details": err.Error()})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "voucher not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Suborder updated", "voucher": voucher})
}
