package routes

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
	"github.com/ekjyotshinh/ChemTrack/backend/services"
	"github.com/gin-gonic/gin"
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
	// Pass the initialized Firestore client to the services package
	services.SetClient(client)
}

// RegisterRoutes defines and registers all routes
func RegisterRoutesUser(router *gin.Engine) {
	r := router.Group("/api/v1")

	// User routes
	r.POST("/users", controllers.AddUser)               // Create a new user
	r.GET("/users", controllers.GetUsers)               // Get all users
	r.GET("/users/:id", controllers.GetUser)            // Get a specific user by ID
	r.GET("/users/schools", controllers.GetUserSchools) // Get list of schools
	r.PUT("/users/:id", controllers.UpdateUser)         // Update a user by ID
	r.DELETE("/users/:id", controllers.DeleteUser)      // Delete a user by ID

	// Authentication route
	r.POST("/login", controllers.Login) // User login
	
	// Password reset routes
	r.POST("/auth/forgot-password", controllers.ForgotPassword) // Request password reset
	r.POST("/auth/reset-password", controllers.ResetPassword)   // Reset password with token
	
	// Verify reset token route
	r.POST("/auth/verify-token", controllers.VerifyResetToken) // Verify reset token
}

