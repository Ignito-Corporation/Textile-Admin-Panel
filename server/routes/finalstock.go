package routes

import (
	"context"
	"net/http"
	"textile-admin-panel/db"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// FinalStockProduct
type FinalStockProduct struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ProductName   string             `bson:"product_name" json:"productName"`
	Quantity      float64            `bson:"quantity" json:"quantity"`
	VoucherNumber string             `bson:"voucher_number" json:"voucherNumber"`
	Date          time.Time          `bson:"date" json:"date"`
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`
}

// OutProduct
type OutProduct struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ProductName string             `bson:"product_name" json:"productName"`
	Quantity    float64            `bson:"quantity" json:"quantity"`
	PartyName   string             `bson:"party_name" json:"partyName"`
	Process     string             `bson:"process" json:"process"`
	Date        time.Time          `bson:"date" json:"date"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}

// --- FINAL STOCK PRODUCT HANDLERS ---

// AddFinalStockProduct handles the creation of a new final product stock entry.
func AddFinalStockProduct(c *gin.Context) {
	var payload struct {
		ProductName   string  `json:"productName"`
		Quantity      float64 `json:"quantity,string"` // Allow string conversion for quantity
		VoucherNumber string  `json:"voucherNumber"`
		Date          string  `json:"date"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	// Basic validation
	if payload.ProductName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product Name is required"})
		return
	}

	parsedDate, err := time.Parse("2006-01-02", payload.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD."})
		return
	}

	newFinalStock := FinalStockProduct{
		ProductName:   payload.ProductName,
		Quantity:      payload.Quantity,
		VoucherNumber: payload.VoucherNumber,
		Date:          parsedDate,
		CreatedAt:     time.Now(),
	}

	collection := db.Database.Collection("final_stock_products")
	result, err := collection.InsertOne(context.Background(), newFinalStock)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save final stock product", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Final stock product added successfully", "id": result.InsertedID})
}

// GetAllFinalStockProducts retrieves all final stock entries to display in the table.
func GetAllFinalStockProducts(c *gin.Context) {
	collection := db.Database.Collection("final_stock_products")
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve final stock products", "details": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	var products []FinalStockProduct
	if err = cursor.All(context.Background(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode final stock products", "details": err.Error()})
		return
	}
	if products == nil {
		products = []FinalStockProduct{}
	}

	c.JSON(http.StatusOK, products)
}

// --- OUT PRODUCT HANDLERS ---
// AddOutProduct handles the creation of a new "out product" entry.
func AddOutProduct(c *gin.Context) {
	var payload struct {
		ProductName string  `json:"productName"`
		Quantity    float64 `json:"quantity,string"`
		PartyName   string  `json:"partyName"`
		Process     string  `json:"process"`
		Date        string  `json:"date"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	if payload.ProductName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product Name is required"})
		return
	}

	parsedDate, err := time.Parse("2006-01-02", payload.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD."})
		return
	}

	newOutProduct := OutProduct{
		ProductName: payload.ProductName,
		Quantity:    payload.Quantity,
		PartyName:   payload.PartyName,
		Process:     payload.Process,
		Date:        parsedDate,
		CreatedAt:   time.Now(),
	}

	collection := db.Database.Collection("out_products")
	result, err := collection.InsertOne(context.Background(), newOutProduct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save out product", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Out product added successfully", "id": result.InsertedID})
}

// GetAllOutProducts retrieves all "out product" entries to display in the table.
func GetAllOutProducts(c *gin.Context) {
	collection := db.Database.Collection("out_products")
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve out products", "details": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	var products []OutProduct
	if err = cursor.All(context.Background(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode out products", "details": err.Error()})
		return
	}
	if products == nil {
		products = []OutProduct{}
	}

	c.JSON(http.StatusOK, products)
}
