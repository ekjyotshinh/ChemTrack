package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
)

// RegisterRoutes defines and registers all routes
func RegisterRoutesChemical(router *gin.Engine) {
	r := router.Group("/api/v1")

	// Chemical routes
	r.POST("/chemicals", controllers.AddChemical)        // Create a new chemical
	r.GET("/chemicals", controllers.GetChemicals)        // Get all chemicals
	r.GET("/chemicals/:id", controllers.GetChemical)     // Get a specific chemical by ID
	r.PUT("/chemicals/:id", controllers.UpdateChemical)  // Update a chemical by ID
	r.DELETE("/chemicals/:id", controllers.DeleteChemical) // Delete a chemical by ID
}