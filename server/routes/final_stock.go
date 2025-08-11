package routes

import (
	"context"
	"net/http"
	"time"

	"textile-admin-panel/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// FinalStock represents the document structure for the final_stocks collection.
type FinalStock struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PONumber    string             `bson:"po_number" json:"po_number"`
	ProductID   string             `bson:"product_id" json:"product_id"`
	ProductName string             `bson:"product_name" json:"product_name"`
	Unit        string             `bson:"unit" json:"unit"`
	Shade       string             `bson:"shade" json:"shade"`
	LotNo       string             `bson:"lot_no" json:"lot_no"`
	Quantity    float64            `bson:"quantity" json:"quantity"`
	ReceivedAt  time.Time          `bson:"received_at" json:"received_at"`
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

	result, err := collection.InsertOne(ctx, stock)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create final stock entry", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Final stock entry created", "stock_id": result.InsertedID})
}
