package routes  

import (  
    "github.com/gin-gonic/gin"  
    "github.com/ekjyotshinh/ChemTrack/backend/controllers"  
)  

func SetupAuthRoutes(router *gin.Engine) {  
    auth := router.Group("/auth")  
    {  
        auth.POST("/request-password-reset", controllers.RequestPasswordReset)  
        auth.POST("/reset-password", controllers.ResetPassword)  
    }  
}  