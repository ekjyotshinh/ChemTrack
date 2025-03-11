package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
)

// RegisterRoutes defines and registers all routes
func RegisterRoutesFiles(router *gin.Engine) {
	r := router.Group("/api/v1")

	// sds routes
	r.POST("/files/sds/:chemicalIdNumber", controllers.AddSDS)  	// Create a new chemical
	r.GET("/files/sds/:chemicalIdNumber", controllers.GetSDS)   // Retrieve SDS URL
	r.DELETE("/files/sds/:chemicalIdNumber", controllers.DeleteSDS) // Delete SDS

	//profile picture routes

	r.POST("/files/profile/:userId", controllers.AddProfilePicture)  	// Create a new chemical
	r.GET("/files/profile/:userId", controllers.GetProfilePicture)   // Retrieve SDS URL
	r.DELETE("/files/profile/:userId", controllers.DeleteProfilePicture) // Delete SDS
	
}