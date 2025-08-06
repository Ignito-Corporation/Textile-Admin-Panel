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

// ===== STRUCTS =====

type Product struct {
	ID      primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name    string             `json:"name"`
	ShadeID string             `json:"shade_id"`
	Unit    string             `json:"unit"`
}

type Vendor struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name          string             `json:"name"`
	ContactPerson string             `json:"contact_person"`
	Phone         string             `json:"phone"`
	Email         string             `json:"email"`
	Address       string             `json:"address"`
	GSTIN         string             `json:"gstin"`
}

type Shade struct {
	ID   primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name string             `json:"name"`
}

// ===== MASTER ROUTES =====

// Add Product
func AddProduct(c *gin.Context) {
	var p Product
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product data", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Database.Collection("products")
	result, err := collection.InsertOne(ctx, p)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save product", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product added", "product_id": result.InsertedID})
}

// Get Product by ID
func GetProductByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var product Product
	collection := db.Database.Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = collection.FindOne(ctx, bson.M{"_id": id}).Decode(&product)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

// Get All Products
func GetAllProducts(c *gin.Context) {
	collection := db.Database.Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var products []Product
	if err := cursor.All(ctx, &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding products", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// Add Vendor
// POST /api/vendor
func AddVendor(c *gin.Context) {
	var vendor Vendor
	if err := c.ShouldBindJSON(&vendor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid vendor data", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Database.Collection("vendors")
	result, err := collection.InsertOne(ctx, vendor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save vendor", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vendor added", "vendor_id": result.InsertedID})
}

// GET /api/vendors
func GetVendors(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Database.Collection("vendors")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vendors", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var vendors []Vendor
	if err := cursor.All(ctx, &vendors); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding vendors", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vendors)
}

// Add Shade
func AddShade(c *gin.Context) {
	var s Shade
	if err := c.ShouldBindJSON(&s); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid shade data", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Database.Collection("shades")
	result, err := collection.InsertOne(ctx, s)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save shade", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Shade added", "shade_id": result.InsertedID})
}

// Get All Shades
func GetAllShades(c *gin.Context) {
	collection := db.Database.Collection("shades")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shades", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var shades []Shade
	if err := cursor.All(ctx, &shades); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding shades", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, shades)
}

// Get ALL Master Data
func GetAllMasterData(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var (
		products []Product
		vendors  []Vendor
		shades   []Shade
	)

	// PRODUCTS
	productCursor, err := db.Database.Collection("products").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products", "details": err.Error()})
		return
	}
	defer productCursor.Close(ctx)
	if err := productCursor.All(ctx, &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode products", "details": err.Error()})
		return
	}

	// VENDORS
	vendorCursor, err := db.Database.Collection("vendors").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vendors", "details": err.Error()})
		return
	}
	defer vendorCursor.Close(ctx)
	if err := vendorCursor.All(ctx, &vendors); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode vendors", "details": err.Error()})
		return
	}

	// SHADES
	shadeCursor, err := db.Database.Collection("shades").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shades", "details": err.Error()})
		return
	}
	defer shadeCursor.Close(ctx)
	if err := shadeCursor.All(ctx, &shades); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode shades", "details": err.Error()})
		return
	}

	// SEND RESPONSE
	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"vendors":  vendors,
		"shades":   shades,
	})
}
