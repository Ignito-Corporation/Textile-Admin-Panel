package main

import (
	"log"
	"textile-admin-panel/db"
	"textile-admin-panel/routes"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	if db.ConnectMongoDB() {
		log.Println("MongoDB connected.")
	} else {
		log.Fatal("Failed to connect to MongoDB. Exiting...")
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true, // This allows requests from all origins
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

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
		po.PATCH("/:id/close", routes.ClosePO)
	}

	//Bill Endpoint
	bill := r.Group("/api/purchase-bill")
	{
		bill.POST("/", routes.CreateBillEntry)
		bill.GET("/", routes.GetAllBills)
		bill.GET("/summary", routes.GetBillSummary)
		bill.GET("/:id", routes.GetBillByID)
	}

	//PDF Handler
	r.POST("/api/convert/json-to-pdf", routes.ConvertJsonToPDF)

	//Jobwork Endpoint
	jobwork := r.Group("/api/jobwork")
	{
		jobwork.POST("/order", routes.CreateJobWorkOrder)
		jobwork.POST("/suborder", routes.CreateJobWorkSubOrder)
		jobwork.GET("/suborder/voucher/:voucher", routes.GetJobWorkSubOrderByVoucher)
		jobwork.GET("/order/:id", routes.GetJobWorkOrder)
		jobwork.GET("/suborders", routes.ListJobWorkSubOrders)

	}

	//Master Data Routes
	api := r.Group("/api/master")
	{
		api.POST("/products", routes.AddProduct)
		api.GET("/products/:id", routes.GetProductByID)
		api.GET("/products", routes.GetAllProducts)

		api.POST("/vendors", routes.AddVendor)
		api.GET("/vendors", routes.GetVendors)
		api.GET("/vendors/:id", routes.GetVendorByID)

		api.POST("/shades", routes.AddShade)
		api.GET("/shades", routes.GetAllShades)

		api.GET("/all", routes.GetAllMasterData)

		api.POST("/final-product", routes.AddFinalProduct)
		api.GET("/final-products", routes.GetAllFinalProducts)

		api.POST("/final-product-stock", routes.AddFinalProductStock)
		api.GET("/final-product-stocks", routes.GetAllFinalProductStocks)

	}

	log.Println("Server running at http://localhost:8080")
	r.Run(":8080")
}
