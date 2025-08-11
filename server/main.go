package main

import (
	"log"
	"net/http"
	"textile-admin-panel/db"
	"textile-admin-panel/routes"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		allowedOrigins := []string{
			"http://localhost:5173", // Local frontend
			"http://localhost:8080",
			"https://your-vercel-app.vercel.app", // Prod frontend
		}

		origin := c.Request.Header.Get("Origin")
		allowOrigin := ""
		for _, o := range allowedOrigins {
			if o == origin {
				allowOrigin = o
				break
			}
		}

		// If no match, you can comment this to block unknown origins
		if allowOrigin == "" {
			allowOrigin = "*" // for open access, but remove if you want strict security
		}

		c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		c.Writer.Header().Set("Vary", "Origin")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, Accept, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "*")

		// Handle preflight OPTIONS
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	if db.ConnectMongoDB() {
		log.Println("MongoDB connected.")
	} else {
		log.Fatal("Failed to connect to MongoDB. Exiting...")
	}

	r := gin.Default()

	r.Use(CORSMiddleware())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello World"})
	})

	// PO Routes
	po := r.Group("/api/po")
	{
		po.POST("/", routes.CreatePO)
		po.GET("/", routes.GetAllPOs)
		po.GET("/:id", routes.GetPOByID)
		po.GET("/generate-number", routes.GetNextPONumber)
		po.PATCH("/:id/close", routes.ClosePO)
	}

	// Bill Endpoint
	bill := r.Group("/api/purchase-bill")
	{
		bill.POST("/", routes.CreateBillEntry)
		bill.GET("/", routes.GetAllBills)
		bill.GET("/summary", routes.GetBillSummary)
		bill.GET("/:id", routes.GetBillByID)
		bill.GET("/po/:poNumber", routes.GetBillByPONumber)
		bill.POST("/po/:poNumber/add-product", routes.AddProductToBill)
	}

	// PDF Handler
	r.POST("/api/convert/json-to-pdf", routes.ConvertJsonToPDF)

	// Jobwork Endpoint
	jobwork := r.Group("/api/jobwork")
	{
		jobwork.POST("/out-entry", routes.CreateOutEntry)
		jobwork.GET("/out-entries/po/:poNumber", routes.GetOutEntriesByPO)
		jobwork.POST("/receive-product", routes.MarkAsReceived)
		jobwork.GET("/get-items/:process", routes.GetJobworkItemsByProcess)

	}

	// Master Data Routes
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
	}

	// Final Stock Routes
	finalStock := r.Group("/api/finalstock")
	{
		finalStock.POST("/", routes.CreateFinalStockEntry)
		finalStock.GET("/", routes.GetAllFinalStockProducts)
	}

	outProducts := r.Group("/api/outproducts")
	{
		outProducts.POST("/", routes.CreateOutProduct)
		outProducts.GET("/", routes.GetAllOutProducts)
	}

	log.Println("Server running at http://localhost:8080")
	r.Run(":8080")
}
