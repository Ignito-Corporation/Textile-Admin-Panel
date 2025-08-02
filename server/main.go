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

	r.POST("/api/po", routes.CreatePO)
	r.POST("/api/vendor", routes.AddVendor)
	r.GET("/api/vendors", routes.GetVendors)

	log.Println("Server running at http://localhost:8080")
	r.Run(":8080")
}
