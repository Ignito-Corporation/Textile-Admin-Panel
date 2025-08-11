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

// OutProduct represents the document structure for the out_products collection.
type OutProduct struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ProductName string             `bson:"product_name" json:"product_name"`
	Quantity    float64            `bson:"quantity" json:"quantity"`
	PartyName   string             `bson:"party_name" json:"party_name"`
	Process     string             `bson:"process" json:"process"`
	Date        string             `bson:"date" json:"date"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}

// CreateOutProduct handles adding a new out product entry.
func CreateOutProduct(c *gin.Context) {
	var product OutProduct
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// Convert quantity from string if necessary, or ensure frontend sends number
	// For simplicity, assuming frontend sends correct types

	product.CreatedAt = time.Now()
	collection := db.Database.Collection("out_products")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create out product", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Out product created successfully", "out_product_id": result.InsertedID})
}

// GetAllOutProducts fetches all documents from the out_products collection.
func GetAllOutProducts(c *gin.Context) {
	collection := db.Database.Collection("out_products")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch out products"})
		return
	}
	defer cursor.Close(ctx)

	var products []OutProduct
	if err := cursor.All(ctx, &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode out products"})
		return
	}

	c.JSON(http.StatusOK, products)
}
