package routes

import (
	"context"
	"log"
	"net/http"
	"time"

	"textile-admin-panel/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// OutEntryProduct represents a product in an out entry
type OutEntryProduct struct {
	ProductID   string  `bson:"product_id" json:"product_id"`
	ProductName string  `bson:"product_name" json:"product_name"`
	Unit        string  `bson:"unit" json:"unit"`
	Shade       string  `bson:"shade" json:"shade"`
	LotNo       string  `bson:"lot_no" json:"lot_no"`
	MillName    string  `bson:"mill_name" json:"mill_name"`
	IssuedQty   float64 `bson:"issued_qty" json:"issued_qty"`
	MaxQty      float64 `bson:"max_qty" json:"max_qty"`
	Rate        float64 `bson:"rate" json:"rate"`
	GSTPercent  float64 `bson:"gst_percent" json:"gst_percent"`
	Amount      float64 `bson:"amount" json:"amount"`
	GSTAmount   float64 `bson:"gst_amount" json:"gst_amount"`
}

// OutEntry represents the out entry document structure
type OutEntry struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	PONumber   string             `bson:"po_number" json:"po_number"`
	Process    string             `bson:"process" json:"process"`
	VoucherNo  string             `bson:"voucher_no" json:"voucher_no"`
	DateIn     string             `bson:"date_in" json:"date_in"`
	DateOut    string             `bson:"date_out" json:"date_out"`
	FPONumber  string             `bson:"fpo_number" json:"fpo_number"`
	VendorName string             `bson:"vendor_name" json:"vendor_name"`
	Products   []OutEntryProduct  `bson:"products" json:"products"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
}

// CreateOutEntry handles the creation of a new out entry
func CreateOutEntry(c *gin.Context) {
	var outEntry OutEntry
	if err := c.ShouldBindJSON(&outEntry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	outEntry.CreatedAt = time.Now()
	outEntryCollection := db.Database.Collection("out_entries")
	purchaseBillsCollection := db.Database.Collection("purchase_bills")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	session, err := db.Database.Client().StartSession()
	if err != nil {
		log.Printf("Error starting session: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session", "details": err.Error()})
		return
	}
	defer session.EndSession(ctx)

	callback := func(sc mongo.SessionContext) (interface{}, error) {
		log.Println("--- Starting Transaction ---")
		result, err := outEntryCollection.InsertOne(sc, outEntry)
		if err != nil {
			log.Printf("Error inserting out_entry: %v\n", err)
			return nil, err
		}
		outEntry.ID = result.InsertedID.(primitive.ObjectID)
		log.Printf("Successfully inserted out_entry with ID: %s", outEntry.ID.Hex())

		for _, product := range outEntry.Products {
			log.Printf("Processing product update for Lot No: %s", product.LotNo)

			filter := bson.M{
				"vendor.ponumber": outEntry.PONumber,
				"products.lot_no": product.LotNo,
			}

			update := bson.M{
				"$inc": bson.M{
					"products.$[elem].quantity": -product.IssuedQty,
				},
			}

			// The arrayFilter correctly identifies which element in the 'products' array to update.
			opts := options.UpdateOptions{
				ArrayFilters: &options.ArrayFilters{
					Filters: []interface{}{bson.M{"elem.lot_no": product.LotNo}},
				},
			}

			log.Printf("Filter: %v", filter)
			log.Printf("Update: %v", update)
			log.Printf("ArrayFilters: %v", opts.ArrayFilters.Filters)

			updateResult, err := purchaseBillsCollection.UpdateOne(sc, filter, update, &opts)
			if err != nil {
				log.Printf("Error updating purchase_bill for Lot No %s: %v", product.LotNo, err)
				return nil, err
			}
			log.Printf("Update result for Lot No %s: Matched %d, Modified %d", product.LotNo, updateResult.MatchedCount, updateResult.ModifiedCount)
			if updateResult.MatchedCount == 0 {
				log.Printf("Warning: No matching document found in purchase_bills for PO %s and Lot No %s", outEntry.PONumber, product.LotNo)
			}
		}
		log.Println("--- Committing Transaction ---")
		return outEntry.ID, nil
	}

	result, err := session.WithTransaction(ctx, callback)
	if err != nil {
		log.Printf("Transaction failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Out entry created successfully", "out_entry_id": result})
}
