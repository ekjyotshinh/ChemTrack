package routes

import (
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
	"github.com/gin-gonic/gin"
)

// RegisterRoutes defines and registers all routes
func RegisterRoutesFiles(router *gin.Engine) {
	r := router.Group("/api/v1")

	// sds routes
	r.POST("/files/sds/:chemicalIdNumber", controllers.AddSDS)      // Create a new chemical
	r.GET("/files/sds/:chemicalIdNumber", controllers.GetSDS)       // Retrieve SDS URL
	r.DELETE("/files/sds/:chemicalIdNumber", controllers.DeleteSDS) // Delete SDS

	//profile picture routes
	r.POST("/files/profile/:userId", controllers.AddProfilePicture)      // Add a new profile picture
	r.GET("/files/profile/:userId", controllers.GetProfilePicture)       // Get the profile picture URL
	r.DELETE("/files/profile/:userId", controllers.DeleteProfilePicture) // Delete profile picture
	r.PUT("/files/profile/:userId", controllers.UpdateProfilePicture)    // Update existing profile picture

	// label routes
	r.POST("/files/label/:chemicalIdNumber", controllers.AddLabel) // Create a new label
	r.GET("/files/label/:chemicalIdNumber", controllers.GetLabel) // Retrieve label URL
	r.DELETE("/files/label/:chemicalIdNumber", controllers.DeleteLabel) // Delete label

	// QR code routes
	r.GET("/files/qrcode/:chemicalIdNumber", controllers.GetQRCode) // Generate a QR code for a chemical
}
