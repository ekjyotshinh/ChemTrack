package main


import (
    "log"
    "time"
    "os"

    "github.com/swaggo/gin-swagger"
    "github.com/swaggo/files"
    "github.com/gin-gonic/gin"
    "github.com/ekjyotshinh/ChemTrack/backend/routes"
    _ "github.com/ekjyotshinh/ChemTrack/backend/docs" // Import generated docs
	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"
    //"github.com/ekjyotshinh/ChemTrack/backend/services"
)
func setupCredentials() {
	// Handle GOOGLE_APPLICATION_CREDENTIALS_JSON → /tmp/bucketkey.json
    if jsonCreds := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON"); jsonCreds != "" {
        path := "/tmp/bucketkey.json"
        err := os.WriteFile(path, []byte(jsonCreds), 0600)
        if err != nil {
            log.Fatalf("Failed to write GOOGLE_APPLICATION_CREDENTIALS file: %v", err)
        }
        log.Println("Successfully wrote GOOGLE_APPLICATION_CREDENTIALS to: ", path)
        os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", path)
    }
    
    if keyJson := os.Getenv("KEY_JSON"); keyJson != "" {
        path := "/tmp/key.json"
        err := os.WriteFile(path, []byte(keyJson), 0600)
        if err != nil {
            log.Fatalf("Failed to write KEY_JSON file: %v", err)
        }
        log.Println("Successfully wrote KEY_JSON to: ", path)
    }

}



func main() {

	// Load environment variables from .env
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, relying on environment variables.")
    }
    setupCredentials()
	// Create a Gin router
    router := gin.Default()

	// Set up CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))


	// Initialize Firestore
	routes.InitFirestore()
	// create a subroutine
	//go startBackgroundJobs()

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
// startBackgroundJobs runs scheduled tasks in a separate goroutine.
func startBackgroundJobs() {
    ticker := time.NewTicker(30 * 24 * time.Hour) 
    defer ticker.Stop()

    for {
        log.Println("Running CheckCriticalChemicalStatus...")
        //services.CheckCriticalChemicalStatus()
        log.Println("Finished execution. Waiting for next cycle...")
        <-ticker.C
    }
}



