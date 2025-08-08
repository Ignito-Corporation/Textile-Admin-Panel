package routes

import (
	"context"
	"fmt"
	"net/http"
	"textile-admin-panel/db"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// --- Snapshot Structs --- //
type ProductRaw struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Name       *string            `bson:"name"`
	HSNCode    *string            `bson:"hsn_code"`
	ShadeID    *string            `bson:"shade_id"`
	Unit       *string            `bson:"unit"`
	GSTPercent *float64           `bson:"gst_percent"`
}

type VendorRaw struct {
	ID            primitive.ObjectID `bson:"_id,omitempty"`
	Name          *string            `bson:"name"`
	Category      *string            `bson:"category"`
	Address       *string            `bson:"address"`
	City          *string            `bson:"city"`
	State         *string            `bson:"state"`
	MobileNumber  *string            `bson:"mobile_number"`
	GSTNumber     *string            `bson:"gst_number"`
	CreditDays    *int               `bson:"credit_days"`
	PaymentTerm   *string            `bson:"payment_term"`
	PaymentMode   *string            `bson:"payment_mode"`
	ContactPerson *string            `bson:"contact_person"`
	Email         *string            `bson:"email"`
}

type POProduct struct {
	ProductID   primitive.ObjectID `json:"product_id" bson:"product_id"`
	ProductName *string            `json:"product_name,omitempty" bson:"product_name,omitempty"`
	HSNCode     *string            `json:"hsn_code,omitempty" bson:"hsn_code,omitempty"`
	ShadeID     *string            `json:"shade_id,omitempty" bson:"shade_id,omitempty"`
	Unit        *string            `json:"unit,omitempty" bson:"unit,omitempty"`
	GSTPercent  *float64           `json:"gst_percent,omitempty" bson:"gst_percent,omitempty"`
	Quantity    int                `json:"quantity" bson:"quantity"`
	Rate        float64            `json:"rate" bson:"rate"`
	ReceivedQty int                `json:"received_qty" bson:"received_qty"`
}

type POVendor struct {
	VendorID      primitive.ObjectID `json:"vendor_id" bson:"vendor_id"`
	Name          *string            `json:"name,omitempty" bson:"name,omitempty"`
	Category      *string            `json:"category,omitempty" bson:"category,omitempty"`
	Address       *string            `json:"address,omitempty" bson:"address,omitempty"`
	City          *string            `json:"city,omitempty" bson:"city,omitempty"`
	State         *string            `json:"state,omitempty" bson:"state,omitempty"`
	MobileNumber  *string            `json:"mobile_number,omitempty" bson:"mobile_number,omitempty"`
	GSTNumber     *string            `json:"gst_number,omitempty" bson:"gst_number,omitempty"`
	CreditDays    *int               `json:"credit_days,omitempty" bson:"credit_days,omitempty"`
	PaymentTerm   *string            `json:"payment_term,omitempty" bson:"payment_term,omitempty"`
	PaymentMode   *string            `json:"payment_mode,omitempty" bson:"payment_mode,omitempty"`
	ContactPerson *string            `json:"contact_person,omitempty" bson:"contact_person,omitempty"`
	Email         *string            `json:"email,omitempty" bson:"email,omitempty"`
}

type PurchaseOrder struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PONumber     string             `json:"po_number" bson:"po_number"`
	Date         string             `json:"date" bson:"date"`
	Status       string             `json:"status" bson:"status"`
	Total        float64            `json:"total" bson:"total"`
	Vendor       POVendor           `json:"vendor" bson:"vendor"`
	PaymentTerms *string            `json:"payment_terms,omitempty" bson:"payment_terms,omitempty"`
	DeliveryDate *string            `json:"delivery_date,omitempty" bson:"delivery_date,omitempty"`
	Items        []POProduct        `json:"items" bson:"items"`
	Notes        *string            `json:"notes,omitempty" bson:"notes,omitempty"`
	IsClosed     bool               `json:"is_closed" bson:"is_closed"`
}

// --- PO Number generator (unchanged) --- //
func GeneratePONumber() string {
	now := time.Now()
	prefix := fmt.Sprintf("PO-%d%02d-", now.Year(), now.Month())
	collection := db.Database.Collection("purchase_orders")
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	count, _ := collection.CountDocuments(ctx, bson.M{
		"date": bson.M{
			"$regex": fmt.Sprintf("^%d-%02d", now.Year(), now.Month()),
		},
	})
	return fmt.Sprintf("%s%03d", prefix, count+1)
}

// --- CREATE PO Handler: Vendor by name, Product by id --- //
func CreatePO(c *gin.Context) {
	var payload struct {
		VendorName   string  `json:"vendor_name"`
		Date         string  `json:"date"`
		PaymentTerms *string `json:"payment_terms"`
		DeliveryDate *string `json:"delivery_date"`
		Notes        *string `json:"notes"`
		Items        []struct {
			ProductID string  `json:"product_id"`
			Quantity  int     `json:"quantity"`
			Rate      float64 `json:"rate"`
			Unit      string  `json:"unit"`
		} `json:"items"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 12*time.Second)
	defer cancel()

	var vendor VendorRaw
	err := db.Database.Collection("vendors").FindOne(ctx, bson.M{"name": payload.VendorName}).Decode(&vendor)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vendor not found", "vendor_name": payload.VendorName})
		return
	}
	povendor := POVendor{
		VendorID:      vendor.ID,
		Name:          vendor.Name,
		Category:      vendor.Category,
		Address:       vendor.Address,
		City:          vendor.City,
		State:         vendor.State,
		MobileNumber:  vendor.MobileNumber,
		GSTNumber:     vendor.GSTNumber,
		CreditDays:    vendor.CreditDays,
		PaymentTerm:   vendor.PaymentTerm,
		PaymentMode:   vendor.PaymentMode,
		ContactPerson: vendor.ContactPerson,
		Email:         vendor.Email,
	}

	var items []POProduct
	var total float64
	for _, item := range payload.Items {
		prodObjID, err := primitive.ObjectIDFromHex(item.ProductID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID", "product_id": item.ProductID})
			return
		}

		var prod ProductRaw
		err = db.Database.Collection("products").FindOne(ctx, bson.M{"_id": prodObjID}).Decode(&prod)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Product not found", "product_id": item.ProductID})
			return
		}

		poItem := POProduct{
			ProductID:   prodObjID,
			ProductName: prod.Name,
			HSNCode:     prod.HSNCode,
			ShadeID:     prod.ShadeID,
			Unit:        prod.Unit,
			GSTPercent:  prod.GSTPercent,
			Quantity:    item.Quantity,
			Rate:        item.Rate,
			ReceivedQty: 0,
		}
		items = append(items, poItem)
		total += float64(item.Quantity) * item.Rate
	}

	order := PurchaseOrder{
		PONumber:     GeneratePONumber(),
		Date:         payload.Date,
		Status:       "Pending",
		Vendor:       povendor,
		PaymentTerms: payload.PaymentTerms,
		DeliveryDate: payload.DeliveryDate,
		Notes:        payload.Notes,
		Items:        items,
		Total:        total,
		IsClosed:     false,
	}
	result, err := db.Database.Collection("purchase_orders").InsertOne(ctx, order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create PO"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "PO created", "po_id": result.InsertedID, "po_number": order.PONumber})
}

// ------------------------- GET ALL POs Endpoint --------------------------- //
func GetAllPOs(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cursor, err := db.Database.Collection("purchase_orders").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch POs"})
		return
	}
	defer cursor.Close(ctx)
	var pos []PurchaseOrder
	if err := cursor.All(ctx, &pos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode POs"})
		return
	}
	c.JSON(http.StatusOK, pos)
}

// ------------------------- GET PO By ID Endpoint --------------------------- //
func GetPOByID(c *gin.Context) {
	poNumber := c.Param("id") // now treating 'id' as 'po_number'

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var po PurchaseOrder
	err := db.Database.
		Collection("purchase_orders").
		FindOne(ctx, bson.M{"po_number": poNumber}). // 👈 changed only this line
		Decode(&po)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "PO not found"})
		return
	}

	c.JSON(http.StatusOK, po)
}


// ---------------------- NEXT PO NUMBER Endpoint --------------------------- //
func GetNextPONumber(c *gin.Context) {
	poNumber := GeneratePONumber()
	c.JSON(http.StatusOK, gin.H{"po_number": poNumber})
}

// PATCH /api/po/:id/close
func ClosePO(c *gin.Context) {
	idParam := c.Param("id")
	poID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid PO ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"status":    "Closed",
			"is_closed": true,
		},
	}

	res, err := db.Database.Collection("purchase_orders").UpdateOne(ctx, bson.M{"_id": poID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close PO"})
		return
	}

	if res.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "PO not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "PO closed successfully"})
}
