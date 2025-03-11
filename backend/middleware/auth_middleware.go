package middleware  

import (  
	"fmt"  
	"net/http"  
	"strings"  

	"github.com/gin-gonic/gin"  
)  

// ExtractUserIDFromToken simulates the extraction of a userID from the Authorization token.  
// In a production system, replace this logic with proper token verification (e.g., JWT verification).  
func ExtractUserIDFromToken(authHeader string) (string, error) {  
	if authHeader == "" {  
		return "", fmt.Errorf("no authorization header provided")  
	}  

	parts := strings.Split(authHeader, " ")  
	if len(parts) != 2 || parts[0] != "Bearer" {  
		return "", fmt.Errorf("invalid token format")  
	}  

	token := parts[1]  

	// For demonstration purposes, assume the token is simply the user id.  
	// Replace this with proper token parsing and validation.  
	return token, nil  
}  

// AuthMiddleware authenticates the user and sets their userID in the context.  
// Use this middleware to protect routes that require authentication.  
func AuthMiddleware(c *gin.Context) {  
	authHeader := c.Request.Header.Get("Authorization")  
	userID, err := ExtractUserIDFromToken(authHeader)  
	if err != nil {  
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})  
		c.Abort()  
		return  
	}  

	// Store the userID in the Gin context for later retrieval  
	c.Set("userID", userID)  
	c.Next()  
}  