package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/routes"
)

func main() {
	// Initialize Firestore
	routes.InitFirestore()

	// Create a Gin router
	router := gin.Default()

	// Register routes
	routes.RegisterRoutesUser(router)
	routes.RegisterRoutesChemical(router)

	// Start the server on port 8080
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
