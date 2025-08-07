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

type JobWorkOut struct {
	ID            primitive.ObjectID       `bson:"_id,omitempty" json:"id,omitempty"`
	VoucherNumber string                   `bson:"voucher_number" json:"voucher_number"`
	EntryType     string                   `bson:"entry_type" json:"entry_type"`
	IssuedDate    string                   `bson:"issued_date" json:"issued_date"`
	VendorID      string                   `bson:"vendor_id" json:"vendor_id"`
	VendorName    string                   `bson:"vendor_name" json:"vendor_name"`
	FpoNumber     string                   `bson:"fpo_number" json:"fpo_number"`
	Products      []map[string]interface{} `bson:"products" json:"products"`
	IsIn          bool                     `bson:"is_in" json:"is_in"`
	CreatedAt     time.Time                `bson:"created_at" json:"created_at"`
}

type JobWorkIn struct {
	ID            primitive.ObjectID       `bson:"_id,omitempty" json:"id,omitempty"`
	VoucherNumber string                   `bson:"voucher_number" json:"voucher_number"`
	Date          string                   `bson:"date" json:"date"`
	Products      []map[string]interface{} `bson:"products" json:"products"`
	CreatedAt     time.Time                `bson:"created_at" json:"created_at"`
}

func CreateJobWorkOut(c *gin.Context) {
	var out JobWorkOut
	if err := c.ShouldBindJSON(&out); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	if out.VoucherNumber == "" {
		out.VoucherNumber = fmt.Sprintf("OUT-%d", time.Now().Unix())
	}
	out.IsIn = false
	out.CreatedAt = time.Now()

	collection := db.Database.Collection("job_work_out")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, out)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create OUT entry", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Job Work OUT entry created",
		"voucher_number": out.VoucherNumber,
		"out_id":         result.InsertedID,
	})
}

func CreateJobWorkIn(c *gin.Context) {
	var in JobWorkIn
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	outCollection := db.Database.Collection("job_work_out")
	inCollection := db.Database.Collection("job_work_in")

	var outEntry JobWorkOut
	err := outCollection.FindOne(ctx, bson.M{"voucher_number": in.VoucherNumber}).Decode(&outEntry)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No OUT entry found for this voucher number", "voucher": in.VoucherNumber})
		return
	}

	if outEntry.IsIn {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This voucher has already been marked as IN", "voucher": in.VoucherNumber})
		return
	}

	in.CreatedAt = time.Now()
	result, err := inCollection.InsertOne(ctx, in)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save IN entry", "details": err.Error()})
		return
	}

	_, err = outCollection.UpdateOne(
		ctx,
		bson.M{"voucher_number": in.VoucherNumber},
		bson.M{"$set": bson.M{"is_in": true}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "IN saved, but failed to update OUT", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Job Work IN entry saved and OUT marked as received",
		"in_id":          result.InsertedID,
		"voucher_number": in.VoucherNumber,
	})
}

func GetJobWorkOutByVoucher(c *gin.Context) {
	voucher := c.Param("voucher")
	collection := db.Database.Collection("job_work_out")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var out JobWorkOut
	err := collection.FindOne(ctx, bson.M{"voucher_number": voucher}).Decode(&out)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, out)
}
