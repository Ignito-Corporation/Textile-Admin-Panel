package db

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var Database *mongo.Database

func ConnectMongoDB() bool {
	_ = godotenv.Load()

	uri := os.Getenv("GO_MONGO_URI")
	dbName := os.Getenv("GO_MONGO_DB")

	if uri == "" || dbName == "" {
		log.Println(" Missing GO_MONGO_URI or GO_MONGO_DB environment variables")
		return false
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Println("MongoDB connection error:", err)
		return false
	}

	Client = client
	Database = client.Database(dbName)
	log.Println("Connected to MongoDB")
	return true
}
