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

// OutProduct represents the simplified document structure for the frontend display.
// This will hold the flattened data we send to the frontend for 'out products'.
type OutProduct struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ProductName string             `json:"product_name"`
	Quantity    float64            `json:"quantity"`
	PartyName   string             `json:"party_name"` // Mapping vendorname to PartyName for frontend
	Process     string             `json:"process"`
	Date        string             `json:"date"` // This will be date_out
	CreatedAt   time.Time          `json:"created_at"`
}

// RawOutEntry represents the actual document structure in the 'out_entries' collection.
type RawOutEntry struct {
	ID            primitive.ObjectID `bson:"_id,omitempty"`
	VoucherNumber string             `bson:"voucher_number"`
	DateOut       string             `bson:"date_out"`
	Process       string             `bson:"process"`
	VendorName    string             `bson:"vendorname"` // Added vendorname
	Products      []struct {
		ProductID   primitive.ObjectID `bson:"product_id"`
		ProductName string             `bson:"product_name"`
		IssuedQty   float64            `bson:"issued_qty"` // Changed to IssuedQty based on mongo ref
		Unit        string             `bson:"unit"`
		Shade       string             `bson:"shade"`
		LotNo       string             `bson:"lot_no"`
		MillName    string             `bson:"mill_name"`
		MaxQty      float64            `bson:"max_qty"`
		Rate        float64            `bson:"rate"`
		GstPercent  float64            `bson:"gst_percent"`
		Amount      float64            `bson:"amount"`
		GstAmount   float64            `bson:"gst_amount"`
	} `bson:"products"`
	CreatedAt time.Time `bson:"created_at"`
}

// CreateOutProduct handles adding a new out product entry.
// This function assumes it's for 'out_products' collection, not 'out_entries'.
// If you intend to save new entries to 'out_entries', this struct needs to match RawOutEntry.
func CreateOutProduct(c *gin.Context) {
	var product OutProduct // This struct might not match if saving to RawOutEntry structure
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	product.CreatedAt = time.Now()
	collection := db.Database.Collection("out_products") // Still assuming 'out_products' for creation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create out product", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Out product created successfully", "out_product_id": result.InsertedID})
}

// GetAllOutProducts fetches all documents from the out_entries collection and flattens them.
func GetAllOutProducts(c *gin.Context) {
	collection := db.Database.Collection("out_entries") // Fetching from 'out_entries'
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch out products", "details": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var rawEntries []RawOutEntry
	if err := cursor.All(ctx, &rawEntries); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode out products", "details": err.Error()})
		return
	}

	var flattenedProducts []OutProduct

	// Iterate through each raw entry and flatten its products
	for _, entry := range rawEntries {
		for _, product := range entry.Products {
			// Create a new OutProduct for each item in the nested 'products' array
			// Do not aggregate quantities for out products as per request
			flattenedProducts = append(flattenedProducts, OutProduct{
				ID:          entry.ID, // Using the main entry ID, or generate a new one if needed per product item
				ProductName: product.ProductName,
				Quantity:    product.IssuedQty, // Use IssuedQty from the nested product
				PartyName:   entry.VendorName,  // Populate PartyName with VendorName
				Process:     entry.Process,
				Date:        entry.DateOut, // Use DateOut from the main entry
				CreatedAt:   entry.CreatedAt,
			})
		}
	}

	c.JSON(http.StatusOK, flattenedProducts)
}
