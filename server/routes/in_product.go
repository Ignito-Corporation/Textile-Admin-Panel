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

type InProduct struct {
	ID          primitive.ObjectID `json:"id"`
	ProductName string             `json:"product_name"`
	Quantity    float64            `json:"quantity"`
	Type        string             `json:"type"`
	Date        string             `json:"date"`
}

// GetAllInQuantities fetches all "IN" quantities.
// It gets data from 'purchase_bills' where knitting is true (for Knitting IN)
// and from 'final_stocks' (for Dyeing IN).
func GetAllInQuantities(c *gin.Context) {
	var allInProducts []InProduct
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	purchaseCollection := db.Database.Collection("purchase_bills")
	cursorKnitting, err := purchaseCollection.Find(ctx, bson.M{"products.knitting": true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch knitting quantities", "details": err.Error()})
		return
	}
	defer cursorKnitting.Close(ctx)

	var knittingBills []PurchaseBill
	if err := cursorKnitting.All(ctx, &knittingBills); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode knitting bills", "details": err.Error()})
		return
	}

	for _, bill := range knittingBills {
		for _, product := range bill.Products {
			if product.Knitting {
				allInProducts = append(allInProducts, InProduct{
					ID:          bill.ID,
					ProductName: product.ProductName,
					Quantity:    product.Quantity,
					Type:        "Knitting",
					Date:        bill.BillDate,
				})
			}
		}
	}

	finalStockCollection := db.Database.Collection("final_stocks")
	cursorDyeing, err := finalStockCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dyeing quantities", "details": err.Error()})
		return
	}
	defer cursorDyeing.Close(ctx)

	var dyeingStocks []FinalStock
	if err := cursorDyeing.All(ctx, &dyeingStocks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode dyeing stocks", "details": err.Error()})
		return
	}

	for _, stock := range dyeingStocks {
		allInProducts = append(allInProducts, InProduct{
			ID:          stock.ID,
			ProductName: stock.ProductName,
			Quantity:    stock.Quantity,
			Type:        "Dyeing",
			Date:        stock.ReceivedAt.Format("2006-01-02"),
		})
	}

	c.JSON(http.StatusOK, allInProducts)
}
