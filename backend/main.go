package main

import (
    "log"

    "github.com/swaggo/gin-swagger"
    "github.com/swaggo/files"
    "github.com/gin-gonic/gin"
    "github.com/ekjyotshinh/ChemTrack/backend/routes"
    _ "github.com/ekjyotshinh/ChemTrack/backend/docs" // Import generated docs
)

func main() {
    // Initialize Firestore
    routes.InitFirestore()

    // Create a Gin router
    router := gin.Default()

    // Register routes
    routes.RegisterRoutesUser(router)
    routes.RegisterRoutesChemical(router)

	// Swagger Documentation: http://localhost:8080/swagger/index.html
    // Swagger route
    router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    // Start the server on port 8080
    if err := router.Run(":8080"); err != nil {
        log.Fatalf("Failed to run server: %v", err)
    }
}
