package routes

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
	"google.golang.org/api/option"
)

var client *firestore.Client

// InitFirestore initializes the Firestore client and sets it in the controllers
func InitFirestore() {
	ctx := context.Background()
	sa := option.WithCredentialsFile("key.json")

	var err error
	client, err = firestore.NewClient(ctx, "chemtrack-csc", sa)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}

	// Pass the initialized Firestore client to the controllers package
	controllers.SetClient(client)
}

// RegisterRoutes defines and registers all routes
func RegisterRoutes(router *gin.Engine) {
	r := router.Group("/api/v1")

	// User routes
	r.POST("/users", controllers.AddUser)        // Create a new user
	r.GET("/users", controllers.GetUsers)        // Get all users
	r.GET("/users/:id", controllers.GetUser)     // Get a specific user by ID
	r.PUT("/users/:id", controllers.UpdateUser)  // Update a user by ID
	r.DELETE("/users/:id", controllers.DeleteUser) // Delete a user by ID

	// Authentication route
	r.POST("/login", controllers.Login)  // User login
}
