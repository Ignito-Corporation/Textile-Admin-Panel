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
	err := godotenv.Load()
	if err != nil {
		log.Println("❌ Error loading .env file")
		return false
	}

	uri := os.Getenv("GO_MONGO_URI")
	dbName := os.Getenv("GO_MONGO_DB")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	var connectErr error
	Client, connectErr = mongo.Connect(ctx, clientOptions)
	if connectErr != nil {
		log.Println("MongoDB connection error:", connectErr)
		return false
	}

	Database = Client.Database(dbName)
	return true
}
