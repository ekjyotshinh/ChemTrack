package controllers

import (
	"context"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/iterator"
)

var client *firestore.Client

// SetClient allows the Firestore client to be used in controllers
func SetClient(c *firestore.Client) {
	client = c
}

// HashPassword hashes the given password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares a plain password with its hashed version
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// AddUser adds a new user to Firestore with a hashed password
func AddUser(c *gin.Context) {
	var user struct {
		First    string `json:"first"`
		Last     string `json:"last"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Born     int    `json:"born"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hash the user's password
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	ctx := context.Background()
	_, _, err = client.Collection("users").Add(ctx, map[string]interface{}{
		"first":    user.First,
		"last":     user.Last,
		"email":    user.Email,
		"password": hashedPassword, // Store hashed password
		"born":     user.Born,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User added successfully"})
}

// GetUsers retrieves all users from Firestore
func GetUsers(c *gin.Context) {
	ctx := context.Background()
	iter := client.Collection("users").Documents(ctx)
	var users []map[string]interface{}

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
			return
		}
		users = append(users, doc.Data())
	}

	c.JSON(http.StatusOK, users)
}

// GetUser retrieves a single user by ID from Firestore
func GetUser(c *gin.Context) {
	userID := c.Param("id")
	ctx := context.Background()

	doc, err := client.Collection("users").Doc(userID).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, doc.Data())
}

// UpdateUser updates user details by ID
func UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	var user struct {
		First string `json:"first"`
		Last  string `json:"last"`
		Born  int    `json:"born"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	ctx := context.Background()
	_, err := client.Collection("users").Doc(userID).Set(ctx, map[string]interface{}{
		"first": user.First,
		"last":  user.Last,
		"born":  user.Born,
	}, firestore.MergeAll)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

// DeleteUser deletes a user by ID
func DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	ctx := context.Background()

	_, err := client.Collection("users").Doc(userID).Delete(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// Login authenticates a user by email and password
func Login(c *gin.Context) {
	var loginDetails struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	ctx := context.Background()
	iter := client.Collection("users").Where("email", "==", loginDetails.Email).Documents(ctx)
	var user map[string]interface{}

	// Find the user by email
	for {
		doc, err := iter.Next()
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		user = doc.Data()
		break
	}

	// Verify the password
	if !CheckPasswordHash(loginDetails.Password, user["password"].(string)) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}
