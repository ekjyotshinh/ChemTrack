package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
)

// RegisterRoutes defines and registers all routes
func RegisterRoutesQR(router *gin.Engine) {
	r := router.Group("/api/v1")

	// QR code routes
	//r.GET("/qrcode", controllers.GenerateQRCode)        // Generate a QR code

}