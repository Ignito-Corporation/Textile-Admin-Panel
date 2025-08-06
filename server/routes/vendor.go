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

type Vendor struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name          string             `json:"name"`
	ContactPerson string             `json:"contact_person"`
	Phone         string             `json:"phone"`
	Email         string             `json:"email"`
	Address       string             `json:"address"`
	GSTIN         string             `json:"gstin"`
}

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
