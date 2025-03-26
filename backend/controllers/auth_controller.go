package controllers  

import (  
    "net/http"  
    "github.com/ekjyotshinh/ChemTrack/backend/helpers" 
    "github.com/gin-gonic/gin"  
)  

func RequestPasswordReset(c *gin.Context) {  
    var req struct {  
        Email string `json:"email"`  
    }  

    if err := c.ShouldBindJSON(&req); err != nil {  
        c.JSON(http.StatusBadRequest, gin.H{"error": "Email is required"})  
        return  
    }  

    token, err := helpers.GenerateToken()  
    if err != nil {  
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})  
        return  
    }  

    // Step to store the token 
    expirationTime := time.Now().Add(1 * time.Hour)  
    err = StoreToken(req.Email, token, expirationTime)  
    if err != nil {  
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save token"})  
        return  
    }  

    resetLink := "https://your-frontend.com/reset-password?token=" + token  

    //Send password reset email
    err = helpers.SendEmailHelper(req.Email, "Password Reset Request",   
        "To reset your password, click the following link: "+resetLink)  
    
    if err != nil {  
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})  
        return  
    }  

    c.JSON(http.StatusOK, gin.H{"message": "Password reset link sent"})  
}  