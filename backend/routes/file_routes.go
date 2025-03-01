package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
)

// RegisterRoutes defines and registers all routes
func RegisterRoutesFiles(router *gin.Engine) {
	r := router.Group("/api/v1")

	// Chemical routes
	r.POST("/files/:chemicalIdNumber", controllers.AddSDS)        // Create a new chemical
	r.GET("/files/:chemicalIdNumber", controllers.GetSDS)   // Retrieve SDS URL
	r.DELETE("/files/:chemicalIdNumber", controllers.DeleteSDS) // Delete SDS
}