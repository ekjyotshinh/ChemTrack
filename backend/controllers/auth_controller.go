package controllers  

import (  
    "net/http"  
    "yourapp/helpers"  
    "yourapp/services"  
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

    // Store the token (implement your own storage logic)  
    expirationTime := time.Now().Add(1 * time.Hour)  
    err = StoreToken(req.Email, token, expirationTime) // Your logic to store token  
    if err != nil {  
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save token"})  
        return  
    }  

    resetLink := "https://your-frontend.com/reset-password?token=" + token  
    services.SendResetEmail(req.Email, resetLink) // Send email with the reset link  

    c.JSON(http.StatusOK, gin.H{"message": "Password reset link sent"})  
}  

func ResetPassword(c *gin.Context) {  
    var req struct {  
        Token       string `json:"token"`  
        NewPassword string `json:"new_password"`  
    }  

    if err := c.ShouldBindJSON(&req); err != nil {  
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})  
        return  
    }  

    // Verify the token and reset the password  
    valid, err := VerifyToken(req.Token) // Your logic to verify token  
    if err != nil || !valid {  
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})  
        return  
    }  

    err = UpdateUserPassword(req.NewPassword) // Your logic to update the password  
    if err != nil {  
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})  
        return  
    }  

    c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})  
}  