package controllers

import (
	"context"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/iterator"
)

// User represents the structure of a user
type User struct {
	First    string `json:"first"`
	Last     string `json:"last"`
	Email    string `json:"email"`
	Password string `json:"password"`
	School   string `json:"school"`
	IsAdmin  bool   `json:"is_admin"`  // Flag for admin
	IsMaster bool   `json:"is_master"` // Flag for master
}

var client *firestore.Client

// SetClient allows the Firestore client to be used in controllers
func SetClient(c *firestore.Client) {
	client = c
}

// HashPassword godoc
// @Summary Hash a password
// @Description Hash a given password using bcrypt
// @Tags users
// @Param password body string true "Password to hash"
// @Success 200 {string} string "Hashed password"
// @Failure 500 {object} map[string]interface{}
// @Router /users/hash [post]
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash godoc
// @Summary Check password hash
// @Description Compare a plain password with its hashed version
// @Tags users
// @Param password body string true "Plain password"
// @Param hash body string true "Hashed password"
// @Success 200 {boolean} boolean "True if passwords match"
// @Failure 500 {object} map[string]interface{}
// @Router /users/check-password [post]
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// AddUser godoc
// @Summary Add a new user
// @Description Add a new user to the database with a hashed password
// @Tags users
// @Accept json
// @Produce json
// @Param user body User true "User data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /users [post]
func AddUser(c *gin.Context) {
	var user User

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
		"school":   user.School,
		"is_admin": user.IsAdmin,
		"is_master": user.IsMaster,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User added successfully"})
}

// GetUsers godoc
// @Summary Get all users
// @Description Get a list of all users
// @Tags users
// @Produce json
// @Success 200 {array} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /users [get]
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
		user := doc.Data()
		user["id"] = doc.Ref.ID // Add the document ID to the user data
		users = append(users, user)
	}

	c.JSON(http.StatusOK, users)
}

// GetUser godoc
// @Summary Get a user by ID
// @Description Get a specific user by their ID
// @Tags users
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /users/{id} [get]
func GetUser(c *gin.Context) {
	userID := c.Param("id")
	ctx := context.Background()

	doc, err := client.Collection("users").Doc(userID).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user := doc.Data()
	user["id"] = doc.Ref.ID // Add the document ID to the user data

	c.JSON(http.StatusOK, user)
}

// UpdateUser godoc
// @Summary Update a user by ID
// @Description Update a specific user by their ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param user body User true "User data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /users/{id} [put]
func UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	var user User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hash the user's password if it is provided
	if user.Password != "" {
		hashedPassword, err := HashPassword(user.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		user.Password = hashedPassword
	}

	ctx := context.Background()
	_, err := client.Collection("users").Doc(userID).Set(ctx, map[string]interface{}{
		"first":    user.First,
		"last":     user.Last,
		"email":    user.Email,
		"password": user.Password, // Store hashed password
		"school":   user.School,
		"is_admin": user.IsAdmin,
		"is_master": user.IsMaster,
	}, firestore.MergeAll)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

// DeleteUser godoc
// @Summary Delete a user by ID
// @Description Delete a specific user by their ID
// @Tags users
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /users/{id} [delete]
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
