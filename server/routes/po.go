package routes

import (
	"context"
	"net/http"
	"textile-admin-panel/db"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ProductCode string  `json:"product_code"`
	Description string  `json:"description"`
	HSN         string  `json:"hsn"`
	Qty         int     `json:"qty"`
	Unit        string  `json:"unit"`
	Rate        float64 `json:"rate"`
	GSTPercent  float64 `json:"gst_percent"`
	Amount      float64 `json:"amount"`
}

type PurchaseOrder struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PONumber     string             `json:"po_number"`
	PODate       string             `json:"po_date"`
	DeliveryDate string             `json:"delivery_date"`
	PaymentTerms string             `json:"payment_terms"`
	VendorID     string             `json:"vendor_id"`
	Products     []Product          `json:"products"`
	Subtotal     float64            `json:"subtotal"`
	GSTTotal     float64            `json:"gst_total"`
	GrandTotal   float64            `json:"grand_total"`
}

func CreatePO(c *gin.Context) {
	var po PurchaseOrder
	if err := c.ShouldBindJSON(&po); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data", "details": err.Error()})
		return
	}

	collection := db.Database.Collection("purchase_orders")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, po)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create PO", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "PO created successfully", "po_id": result.InsertedID})
}

func GetAllPOs(c *gin.Context) {
	collection := db.Database.Collection("purchase_orders")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, primitive.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch POs", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var pos []PurchaseOrder
	if err := cursor.All(ctx, &pos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode POs", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pos)
}
