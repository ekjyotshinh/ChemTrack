package main

import (
    "log"
	"os"

    "github.com/swaggo/gin-swagger"
    "github.com/swaggo/files"
    "github.com/gin-gonic/gin"
    "github.com/ekjyotshinh/ChemTrack/backend/routes"
    _ "github.com/ekjyotshinh/ChemTrack/backend/docs" // Import generated docs
	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"
)

func main() {

	// Load environment variables from .env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Create a Gin router
    router := gin.Default()

	// Set up CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{os.Getenv("FRONTEND_PORT")},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))


    // Initialize Firestore
    routes.InitFirestore()



    // Register routes
    routes.RegisterRoutesUser(router)
    routes.RegisterRoutesChemical(router)
    routes.RegisterRoutesEmail(router)
    routes.RegisterRoutesFiles(router)
    //routes.RegisterRoutesQRCode(router)

	// Swagger Documentation: http://localhost:8080/swagger/index.html
    // Swagger route
    router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    // Start the server on port 8080
    if err := router.Run(":8080"); err != nil {
        log.Fatalf("Failed to run server: %v", err)
    }
}
