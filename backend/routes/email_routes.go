package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"

)

func RegisterRoutesEmail(router *gin.Engine) {
	r := router.Group("/api/v1")
	{
		r.POST("/email/send", controllers.SendEmail)
	}
}
