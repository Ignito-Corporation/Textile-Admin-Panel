package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"textile-admin-panel/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JobWorkOrder struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	POID            primitive.ObjectID `bson:"po_id" json:"po_id"`
	CurrentStage    string             `bson:"current_stage" json:"current_stage"`
	OriginalProduct string             `bson:"original_product" json:"original_product"`
	FinalProduct    string             `bson:"final_product" json:"final_product"`
	QuantityTotal   float64            `bson:"quantity_total" json:"quantity_total"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
	IsComplete      bool               `bson:"is_complete" json:"is_complete"`
}

type JobWorkSubOrder struct {
	ID              primitive.ObjectID       `bson:"_id,omitempty" json:"id,omitempty"`
	ParentJobWorkID primitive.ObjectID       `bson:"parent_jobwork_id" json:"parent_jobwork_id"`
	VoucherNumber   string                   `bson:"voucher_number" json:"voucher_number"`
	EntryType       string                   `bson:"entry_type" json:"entry_type"`
	Process         string                   `bson:"process" json:"process"`
	IssuedDate      string                   `bson:"issued_date" json:"issued_date"`
	VendorID        string                   `bson:"vendor_id" json:"vendor_id"`
	VendorName      string                   `bson:"vendor_name" json:"vendor_name"`
	FpoNumber       string                   `bson:"fpo_number" json:"fpo_number"`
	Products        []map[string]interface{} `bson:"products" json:"products"`
	IsIn            bool                     `bson:"is_in" json:"is_in"`
	CreatedAt       time.Time                `bson:"created_at" json:"created_at"`
}

func CreateJobWorkOrder(c *gin.Context) {
	var payload struct {
		POID            string  `json:"po_id"`
		OriginalProduct string  `json:"original_product"`
		QuantityTotal   float64 `json:"quantity_total"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid", "details": err.Error()})
		return
	}
	poid, err := primitive.ObjectIDFromHex(payload.POID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid po_id"})
		return
	}
	doc := JobWorkOrder{
		POID:            poid,
		CurrentStage:    "Knitting",
		OriginalProduct: payload.OriginalProduct,
		FinalProduct:    "",
		QuantityTotal:   payload.QuantityTotal,
		CreatedAt:       time.Now(),
		IsComplete:      false,
	}
	res, err := db.Database.Collection("job_work_orders").InsertOne(context.Background(), doc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Job work order created", "order_id": res.InsertedID})
}

func CreateJobWorkSubOrder(c *gin.Context) {
	var sub JobWorkSubOrder
	if err := c.ShouldBindJSON(&sub); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}
	if sub.ParentJobWorkID.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parent_jobwork_id required"})
		return
	}
	parentColl := db.Database.Collection("job_work_orders")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var parent JobWorkOrder
	if err := parentColl.FindOne(ctx, bson.M{"_id": sub.ParentJobWorkID}).Decode(&parent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parent_jobwork_id"})
		return
	}
	if sub.VoucherNumber == "" {
		sub.VoucherNumber = fmt.Sprintf("OUT-%d", time.Now().UnixNano())
	}
	sub.IsIn = (sub.EntryType == "IN")
	sub.CreatedAt = time.Now()
	res, err := db.Database.Collection("job_work_suborders").InsertOne(ctx, sub)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create suborder", "details": err.Error()})
		return
	}
	if sub.EntryType == "IN" && sub.Process == "Knitting" {
		go checkAndStartDyeing(parent.ID)
	}
	if sub.EntryType == "IN" && sub.Process == "Dyeing" {
		go checkAndCompleteJobWork(parent.ID)
	}
	c.JSON(http.StatusOK, gin.H{"message": "Suborder created", "suborder_id": res.InsertedID, "voucher_number": sub.VoucherNumber})
}

func checkAndStartDyeing(parentID primitive.ObjectID) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	parentColl := db.Database.Collection("job_work_orders")
	var parent JobWorkOrder
	if err := parentColl.FindOne(ctx, bson.M{"_id": parentID}).Decode(&parent); err != nil {
		return
	}
	if parent.CurrentStage != "Knitting" {
		return
	}
	subColl := db.Database.Collection("job_work_suborders")
	cursor, _ := subColl.Find(ctx, bson.M{
		"parent_jobwork_id": parentID,
		"entry_type":        "IN",
		"process":           "Knitting",
	})
	defer cursor.Close(ctx)
	var totalIn float64
	for cursor.Next(ctx) {
		var job JobWorkSubOrder
		if err := cursor.Decode(&job); err == nil {
			for _, prod := range job.Products {
				if q, ok := prod["quantity"].(float64); ok {
					totalIn += q
				} else if q, ok := prod["quantity"].(int); ok {
					totalIn += float64(q)
				}
			}
		}
	}
	if totalIn >= parent.QuantityTotal {
		parentColl.UpdateOne(ctx, bson.M{"_id": parentID}, bson.M{"$set": bson.M{"current_stage": "Dyeing", "final_product": "Cloth"}})
	}
}

func checkAndCompleteJobWork(parentID primitive.ObjectID) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	parentColl := db.Database.Collection("job_work_orders")
	var parent JobWorkOrder
	if err := parentColl.FindOne(ctx, bson.M{"_id": parentID}).Decode(&parent); err != nil {
		return
	}
	if parent.IsComplete {
		return
	}
	subColl := db.Database.Collection("job_work_suborders")
	cursor, _ := subColl.Find(ctx, bson.M{
		"parent_jobwork_id": parentID,
		"entry_type":        "IN",
		"process":           "Dyeing",
	})
	defer cursor.Close(ctx)
	var totalIn float64
	for cursor.Next(ctx) {
		var job JobWorkSubOrder
		if err := cursor.Decode(&job); err == nil {
			for _, prod := range job.Products {
				if q, ok := prod["quantity"].(float64); ok {
					totalIn += q
				} else if q, ok := prod["quantity"].(int); ok {
					totalIn += float64(q)
				}
			}
		}
	}
	if totalIn >= parent.QuantityTotal {
		parentColl.UpdateOne(ctx, bson.M{"_id": parentID}, bson.M{"$set": bson.M{"current_stage": "Completed", "is_complete": true}})
	}
}

func GetJobWorkSubOrderByVoucher(c *gin.Context) {
	voucher := c.Param("voucher")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var subOrder JobWorkSubOrder
	err := db.Database.Collection("job_work_suborders").FindOne(ctx, bson.M{"voucher_number": voucher}).Decode(&subOrder)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, subOrder)
}

func GetJobWorkOrder(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var parent JobWorkOrder
	err = db.Database.Collection("job_work_orders").FindOne(context.Background(), bson.M{"_id": objID}).Decode(&parent)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, parent)
}

func ListJobWorkSubOrders(c *gin.Context) {
	parentID := c.Query("parent_id")
	process := c.Query("process")
	entryType := c.Query("entry_type")
	objID, err := primitive.ObjectIDFromHex(parentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid parent_id"})
		return
	}
	filter := bson.M{"parent_jobwork_id": objID}
	if process != "" {
		filter["process"] = process
	}
	if entryType != "" {
		filter["entry_type"] = entryType
	}
	cursor, err := db.Database.Collection("job_work_suborders").Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	defer cursor.Close(context.Background())
	var out []JobWorkSubOrder
	if err := cursor.All(context.Background(), &out); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode failed"})
		return
	}
	c.JSON(http.StatusOK, out)
}
