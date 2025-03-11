package routes

import (
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutesEmail(router *gin.Engine) {
	r := router.Group("/api/v1")
	{
		r.POST("/email/send", controllers.SendEmail)
	}
}
