package controllers  

import (  
	"net/http"  

	"github.com/gin-gonic/gin"  
	"github.com/ekjyotshinh/ChemTrack/backend/models"  
	"golang.org/x/crypto/bcrypt"  
)  

type UpdatePasswordRequest struct {  
	NewPassword string `json:"new_password" binding:"required,min=8"`  
}  

// UpdatePasswordHandler updates the user's password  
func UpdatePasswordHandler(c *gin.Context) {  
	var req UpdatePasswordRequest  

	// Validate the incoming JSON request  
	if err := c.ShouldBindJSON(&req); err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})  
		return  
	}  

	// Get the user ID from the session or token (assuming middleware sets it in context)  
	userID, exists := c.Get("userID")  
	if !exists {  
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})  
		return  
	}  

	// Hash the new password  
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)  
	if err != nil {  
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})  
		return  
	}  

	// Update the user's password in the database  
	if err := models.UpdateUserPasswordByID(userID.(int), string(hashedPassword)); err != nil {  
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})  
		return  
	}  

	// Respond with success  
	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})  
}  