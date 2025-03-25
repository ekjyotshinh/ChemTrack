package routers  

import (  
    "github.com/gin-gonic/gin"  
    "yourapp/controllers"  
)  

func SetupAuthRoutes(router *gin.Engine) {  
    auth := router.Group("/auth")  
    {  
        auth.POST("/request-password-reset", controllers.RequestPasswordReset)  
        auth.POST("/reset-password", controllers.ResetPassword)  
    }  
}  