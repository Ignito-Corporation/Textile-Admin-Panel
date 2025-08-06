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

	//PO Routes
	po := r.Group("/api/po")
	{
		po.POST("/", routes.CreatePO)
		po.GET("/", routes.GetAllPOs)
		po.GET("/:id", routes.GetPOByID)
		po.GET("/generate-number", routes.GetNextPONumber)
	}

	//Bill Endpoint
	bill := r.Group("/api/purchase-bill")
	{
		bill.POST("/", routes.CreateBillEntry)
		bill.GET("/", routes.GetAllBills)
		bill.GET("/:id", routes.GetBillByID)
	}

	//Jobwork Endpoint
	jobwork := r.Group("/api/jobwork")
	{
		jobwork.POST("/out", routes.CreateJobWorkOut)
		jobwork.POST("/in", routes.CreateJobWorkIn)
		jobwork.GET("/out/:voucher", routes.GetJobWorkOutByVoucher)
	}

	//Master Data Routes
	api := r.Group("/api/master")
	{
		api.POST("/products", routes.AddProduct)
		api.GET("/products/:id", routes.GetProductByID)
		api.GET("/products", routes.GetAllProducts)

		api.POST("/vendors", routes.AddVendor)
		api.GET("/vendors", routes.GetVendors)

		api.POST("/shades", routes.AddShade)
		api.GET("/shades", routes.GetAllShades)

		api.GET("/all", routes.GetAllMasterData)
	}

	log.Println("Server running at http://localhost:8080")
	r.Run(":8080")
}
