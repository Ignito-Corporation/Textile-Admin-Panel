package main

import (
	"log"
	"textile-admin-panel/db"
	"textile-admin-panel/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	if db.ConnectMongoDB() {
		log.Println("MongoDB connected.")
	} else {
		log.Fatal("Failed to connect to MongoDB. Exiting...")
	}

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello World"})
	})

	//Routes Defined

	//This is for Create PO Page
	r.POST("/api/po", routes.CreatePO)
	r.GET("/api/po", routes.GetAllPOs)
	r.POST("/api/vendor", routes.AddVendor)
	r.GET("/api/vendors", routes.GetVendors)

	//This is for Create Bill Page
	r.POST("/api/bill", routes.CreateBillEntry)
	r.GET("/api/bills", routes.GetAllBills)

	log.Println("Server running at http://localhost:8080")
	r.Run(":8080")
}
