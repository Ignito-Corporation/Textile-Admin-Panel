package main

import (
	"log"
	"textile-admin-panel/db"
	"textile-admin-panel/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Debug middleware to log all requests
func debugMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("🔥 Request: %s %s from Origin: %s", c.Request.Method, c.Request.URL.Path, c.Request.Header.Get("Origin"))
		log.Printf("🔥 Headers: %v", c.Request.Header)

		c.Next()

		log.Printf("🔥 Response Status: %d", c.Writer.Status())
		log.Printf("🔥 Response Headers: %v", c.Writer.Header())
	}
}

func main() {
	if db.ConnectMongoDB() {
		log.Println("MongoDB connected.")
	} else {
		log.Fatal("Failed to connect to MongoDB. Exiting...")
	}

	r := gin.Default()

	// Add debug middleware first
	r.Use(debugMiddleware())

	// Use only the Gin CORS middleware for development
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	// Test endpoints
	r.GET("/test-cors", func(c *gin.Context) {
		log.Printf("🧪 Test CORS endpoint called")
		c.JSON(200, gin.H{"message": "CORS is working!", "origin": c.Request.Header.Get("Origin")})
	})

	r.GET("/ping", func(c *gin.Context) {
		log.Printf("🏓 Ping endpoint called")
		c.JSON(200, gin.H{"message": "Hello World"})
	})

	// Simple test for finalstock endpoint
	r.GET("/api/test-finalstock", func(c *gin.Context) {
		log.Printf("🧪 Test finalstock endpoint called")
		c.JSON(200, gin.H{"message": "finalstock endpoint is reachable", "data": []interface{}{}})
	})

	// PO Routes
	po := r.Group("/api/po")
	{
		po.POST("/", routes.CreatePO)
		po.GET("/", routes.GetAllPOs)
		po.GET("/:id", routes.GetPOByID)
		po.GET("/generate-number", routes.GetNextPONumber)
		po.PATCH("/:id/close", routes.ClosePO)
		po.DELETE("/purchase-delete/:poNumber", routes.DeletePO)
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

	// Final Stock Routes with debug
	finalStock := r.Group("/api/finalstock")
	{
		finalStock.POST("/p", func(c *gin.Context) {
			log.Println("🎯 POST /api/finalstock called")
			routes.CreateFinalStockEntry(c)
		})
		finalStock.GET("/p", func(c *gin.Context) {
			log.Println("🎯 GET /api/finalstock called")
			routes.GetAllFinalStockProducts(c)
		})
	}

	outProducts := r.Group("/api/outproducts")
	{
		outProducts.POST("/p", func(c *gin.Context) {
			log.Println("🎯 POST /api/outproducts called")
			routes.CreateOutProduct(c)
		})
		outProducts.GET("/p", func(c *gin.Context) {
			log.Println("🎯 GET /api/outproducts called")
			routes.GetAllOutProducts(c)
		})
	}

	inQuantities := r.Group("/api/in-quantities")
	{
		inQuantities.GET("/", routes.GetAllInQuantities)
	}

	log.Println("🚀 Server running at https://textile-admin-panel.onrender.com")
	r.Run(":8080")
}
