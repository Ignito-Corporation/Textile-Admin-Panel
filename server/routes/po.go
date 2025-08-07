package routes

import (
	"context"
	"fmt"
	"net/http"
	"textile-admin-panel/db"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


type PurchaseOrder struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PONumber  string             `json:"po_number"`
	VendorID  primitive.ObjectID `json:"vendor_id"`
	Date      string             `json:"date"`
	Status    string             `json:"status"`
	Total     float64            `json:"total"`

	VendorName string `json:"vendor_name,omitempty" bson:"-"`
	VendorAddr string `json:"vendor_address,omitempty" bson:"-"`
	Contact    string `json:"vendor_contact,omitempty" bson:"-"`

	Items []ResolvedPOItem `json:"items,omitempty" bson:"-"`
}

type POItem struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	POID        primitive.ObjectID `json:"po_id"`
	ProductID   primitive.ObjectID `json:"product_id"`
	Quantity    int                `json:"quantity"`
	Rate        float64            `json:"rate"`
	ReceivedQty int                `json:"received_qty"`
}

type ResolvedPOItem struct {
	ProductID   primitive.ObjectID `json:"product_id"`
	ProductName string             `json:"product_name"`
	ShadeID     string             `json:"shade_id"`
	Unit        string             `json:"unit"`
	Quantity    int                `json:"quantity"`
	Rate        float64            `json:"rate"`
	ReceivedQty int                `json:"received_qty"`
}


func GeneratePONumber() string {
	now := time.Now()
	prefix := fmt.Sprintf("PO-%d%02d-", now.Year(), now.Month())

	collection := db.Database.Collection("purchase_orders")
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	count, _ := collection.CountDocuments(ctx, bson.M{
		"date": bson.M{
			"$regex": fmt.Sprintf("^%d-%02d", now.Year(), now.Month()),
		},
	})

	return fmt.Sprintf("%s%03d", prefix, count+1)
}


// POST /api/po
func CreatePO(c *gin.Context) {
	var payload struct {
		VendorID string `json:"vendor_id"`
		Date     string `json:"date"`
		Items    []struct {
			ProductID string  `json:"product_id"`
			Quantity  int     `json:"quantity"`
			Rate      float64 `json:"rate"`
		} `json:"items"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data", "details": err.Error()})
		return
	}

	vendorObjID, err := primitive.ObjectIDFromHex(payload.VendorID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid vendor ID"})
		return
	}

	po := PurchaseOrder{
		PONumber: GeneratePONumber(),
		VendorID: vendorObjID,
		Date:     payload.Date,
		Status:   "Pending",
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	poResult, err := db.Database.Collection("purchase_orders").InsertOne(ctx, po)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create PO"})
		return
	}

	poID := poResult.InsertedID.(primitive.ObjectID)
	var total float64
	var poItems []interface{}

	for _, item := range payload.Items {
		productObjID, err := primitive.ObjectIDFromHex(item.ProductID)
		if err != nil {
			continue
		}
		poItem := POItem{
			POID:        poID,
			ProductID:   productObjID,
			Quantity:    item.Quantity,
			Rate:        item.Rate,
			ReceivedQty: 0,
		}
		poItems = append(poItems, poItem)
		total += float64(item.Quantity) * item.Rate
	}

	_, err = db.Database.Collection("purchase_order_items").InsertMany(ctx, poItems)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save PO items"})
		return
	}

	_, _ = db.Database.Collection("purchase_orders").UpdateOne(ctx, bson.M{"_id": poID}, bson.M{"$set": bson.M{"total": total}})

	c.JSON(http.StatusOK, gin.H{"message": "PO created", "po_id": poID.Hex(), "po_number": po.PONumber})
}

// GET /api/po
func GetAllPOs(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.Database.Collection("purchase_orders").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch POs"})
		return
	}
	defer cursor.Close(ctx)

	var pos []PurchaseOrder
	if err := cursor.All(ctx, &pos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode POs"})
		return
	}

	c.JSON(http.StatusOK, pos)
}

// GET /api/po/:id
func GetPOByID(c *gin.Context) {
	idParam := c.Param("id")
	poID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid PO ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var po PurchaseOrder
	err = db.Database.Collection("purchase_orders").FindOne(ctx, bson.M{"_id": poID}).Decode(&po)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "PO not found"})
		return
	}

	// Resolve vendor
	var vendor struct {
		Name    string `bson:"name"`
		Address string `bson:"address"`
		Contact string `bson:"contact"`
	}
	_ = db.Database.Collection("vendors").FindOne(ctx, bson.M{"_id": po.VendorID}).Decode(&vendor)
	po.VendorName = vendor.Name
	po.VendorAddr = vendor.Address
	po.Contact = vendor.Contact

	// Get PO items
	cursor, err := db.Database.Collection("purchase_order_items").Find(ctx, bson.M{"po_id": poID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}
	defer cursor.Close(ctx)

	var items []POItem
	if err := cursor.All(ctx, &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding items"})
		return
	}

	// Resolve product info
	for _, item := range items {
		var product struct {
			Name    string `bson:"name"`
			Unit    string `bson:"unit"`
			ShadeID string `bson:"shade_id"`
		}
		_ = db.Database.Collection("products").FindOne(ctx, bson.M{"_id": item.ProductID}).Decode(&product)

		resolved := ResolvedPOItem{
			ProductID:   item.ProductID,
			ProductName: product.Name,
			Unit:        product.Unit,
			ShadeID:     product.ShadeID,
			Quantity:    item.Quantity,
			Rate:        item.Rate,
			ReceivedQty: item.ReceivedQty,
		}
		po.Items = append(po.Items, resolved)
	}

	c.JSON(http.StatusOK, po)
}

// GET /api/po/generate-number
func GetNextPONumber(c *gin.Context) {
	poNumber := GeneratePONumber()
	c.JSON(http.StatusOK, gin.H{"po_number": poNumber})
}
