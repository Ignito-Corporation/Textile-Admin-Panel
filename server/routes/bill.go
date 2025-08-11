package routes

import (
	"context"
	"net/http"
	"time"

	"textile-admin-panel/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// PurchaseBillProduct represents a product in the purchase bill
type PurchaseBillProduct struct {
	ProductID   string  `bson:"product_id" json:"product_id"`
	ProductName string  `bson:"product_name" json:"product_name"`
	Unit        string  `bson:"unit" json:"unit"`
	Shade       string  `bson:"shade" json:"shade"`
	LotNo       string  `bson:"lot_no" json:"lot_no"`
	MillName    string  `bson:"mill_name" json:"mill_name"`
	Quantity    float64 `bson:"quantity" json:"quantity"` // Corresponds to 'quantity' from frontend
	MaxQty      float64 `bson:"max_qty" json:"max_qty"`   // This field will store the initial quantity
	Rate        float64 `bson:"rate" json:"rate"`
	GSTPercent  float64 `bson:"gst_percent" json:"gst_percent"`
	Amount      float64 `bson:"amount" json:"amount"`
	Knitting    bool    `bson:"knitting" json:"knitting"`
	GSTAmount   float64 `bson:"gst_amount" json:"gst_amount"` // Corresponds to 'gst_amount' from frontend
}

// VendorInfo represents vendor details in the purchase bill
type VendorInfo struct {
	VendorID   string `json:"vendor_id"`
	VendorName string `json:"vendor_name"`
	PONumber   string `json:"po_number"`
	GRNNumber  string `json:"grn_number"`
	BillType   string `json:"bill_type"`
	Address    string `json:"address"`
	State      string `json:"state"`
	Phone      string `json:"phone"`
}

// PurchaseBill represents the purchase bill document structure
type PurchaseBill struct {
	ID           primitive.ObjectID    `bson:"_id,omitempty" json:"id,omitempty"`
	PartyName    string                `json:"party_name"`
	BillNumber   string                `json:"bill_number"`
	BillDate     string                `json:"bill_date"`
	ReceivedDate string                `json:"received_date"`
	CRLNumber    string                `json:"crl_number"`
	Mode         string                `json:"mode"`
	Vendor       VendorInfo            `json:"vendor"`
	Products     []PurchaseBillProduct `json:"products"`
	CreatedAt    time.Time             `json:"created_at"`
}

// BillSummary provides a summary of bill entries
type BillSummary struct {
	TotalBillEntry int64   `json:"total_bill_entry"`
	TotalValue     float64 `json:"total_value"`
	ThisMonth      int64   `json:"this_month"`
}

func CreateBillEntry(c *gin.Context) {
	var bill PurchaseBill
	if err := c.ShouldBindJSON(&bill); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	for i := range bill.Products {
		bill.Products[i].MaxQty = bill.Products[i].Quantity
		// The `knitting` field should be sent from the frontend.
		// If not provided, it defaults to false (for Knitting process).
	}

	bill.CreatedAt = time.Now() // Set creation timestamp
	collection := db.Database.Collection("purchase_bills")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, bill)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create bill", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Purchase bill created", "bill_id": result.InsertedID})
}

func GetAllBills(c *gin.Context) {
	collection := db.Database.Collection("purchase_bills")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bills", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var bills []PurchaseBill
	if err := cursor.All(ctx, &bills); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode bills", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, bills)
}

func GetBillByID(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	collection := db.Database.Collection("purchase_bills")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var bill PurchaseBill
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&bill)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bill not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, bill)
}

// GetBillByPONumber fetches a single bill by its PO Number.
func GetBillByPONumber(c *gin.Context) {
	poNumber := c.Param("poNumber")
	if poNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PO Number is required"})
		return
	}

	collection := db.Database.Collection("purchase_bills")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var bill PurchaseBill
	// Find where the 'vendor.ponumber' field matches.
	err := collection.FindOne(ctx, bson.M{"vendor.ponumber": poNumber}).Decode(&bill)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Bill not found for the given PO Number"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bill", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, bill)
}

// GetBillSummary provides a summary of bill statistics.
func GetBillSummary(c *gin.Context) {
	collection := db.Database.Collection("purchase_bills")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	totalBillEntry, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count documents"})
		return
	}

	pipeline := mongo.Pipeline{
		bson.D{{Key: "$unwind", Value: "$products"}},
		bson.D{{
			Key: "$group",
			Value: bson.D{
				{Key: "_id", Value: nil},
				{Key: "totalValue", Value: bson.D{
					{Key: "$sum", Value: "$products.amount"},
				}},
			},
		}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total value"})
		return
	}

	var result []bson.M
	if err := cursor.All(ctx, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode aggregation result"})
		return
	}

	totalValue := 0.0
	if len(result) > 0 {
		totalValue = result[0]["totalValue"].(float64)
	}

	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	thisMonth, err := collection.CountDocuments(ctx, bson.M{
		"created_at": bson.M{"$gte": startOfMonth},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count this month's bills"})
		return
	}

	summary := BillSummary{
		TotalBillEntry: totalBillEntry,
		TotalValue:     totalValue,
		ThisMonth:      thisMonth,
	}

	c.JSON(http.StatusOK, summary)
}
