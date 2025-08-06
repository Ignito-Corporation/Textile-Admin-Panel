package routes

import (
	"context"
	"net/http"
	"time"

	"textile-admin-panel/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProductItem struct {
	ProductID   string  `json:"product_id"`
	ProductName string  `json:"product_name"`
	Unit        string  `json:"unit"`
	Shade       string  `json:"shade"`
	LotNo       string  `json:"lot_no"`
	MillName    string  `json:"mill_name"`
	ProductQty  float64 `json:"product_qty"`
	Rate        float64 `json:"rate"`
	GSTPercent  float64 `json:"gst_percent"`
	Amount      float64 `json:"amount"`
	GRate       float64 `json:"grate"`
}

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

type PurchaseBill struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PartyName    string             `json:"party_name"`
	BillNumber   string             `json:"bill_number"`
	BillDate     string             `json:"bill_date"`
	ReceivedDate string             `json:"received_date"`
	CRLNumber    string             `json:"crl_number"`
	Vendor       VendorInfo         `json:"vendor"`
	Products     []ProductItem      `json:"products"`
	CreatedAt    time.Time          `json:"created_at"`
}

func CreateBillEntry(c *gin.Context) {
	var bill PurchaseBill
	if err := c.ShouldBindJSON(&bill); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	bill.CreatedAt = time.Now()
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
