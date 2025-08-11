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

// FinalStock represents the document structure for the final_stocks collection.
type FinalStock struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PONumber      string             `bson:"po_number,omitempty" json:"po_number,omitempty"`
	ProductID     string             `bson:"product_id,omitempty" json:"product_id,omitempty"`
	ProductName   string             `bson:"product_name" json:"product_name"`
	Unit          string             `bson:"unit,omitempty" json:"unit,omitempty"`
	Shade         string             `bson:"shade,omitempty" json:"shade,omitempty"`
	LotNo         string             `bson:"lot_no,omitempty" json:"lot_no,omitempty"`
	Quantity      float64            `bson:"quantity" json:"quantity"`
	VoucherNumber string             `bson:"voucher_number,omitempty" json:"voucher_number,omitempty"`
	Date          string             `bson:"date,omitempty" json:"date,omitempty"`
	ReceivedAt    time.Time          `bson:"received_at" json:"received_at"`
}

// CreateFinalStockEntry handles adding a new product to the final stock.
func CreateFinalStockEntry(c *gin.Context) {
	var stock FinalStock
	if err := c.ShouldBindJSON(&stock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	stock.ReceivedAt = time.Now()
	collection := db.Database.Collection("final_stocks")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, stock)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create final stock entry", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Final stock entry created successfully"})
}

// GetAllFinalStockProducts fetches all documents from the final_stocks collection.
func GetAllFinalStockProducts(c *gin.Context) {
	collection := db.Database.Collection("final_stocks")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch final stock products"})
		return
	}
	defer cursor.Close(ctx)

	var products []FinalStock
	if err := cursor.All(ctx, &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode final stock products"})
		return
	}

	c.JSON(http.StatusOK, products)
}
