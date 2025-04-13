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
	First         string `json:"first"`
	Last          string `json:"last"`
	Email         string `json:"email"`
	Password      string `json:"password"`
	School        string `json:"school"`
	ExpoPushToken string `json:"expo_push_token"`
	IsAdmin       bool   `json:"is_admin"`    // Flag for admin
	IsMaster      bool   `json:"is_master"`   // Flag for master
	AllowEmail    bool   `json:"allow_email"` // flag for email notifications
	AllowPush     bool   `json:"allow_push"`  // flag for push notifications
}

var client *firestore.Client

// SetClient allows the Firestore client to be used in controllers
func SetClient(c *firestore.Client) {
	client = c
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

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
// @Failure 409
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users [post]
func AddUser(c *gin.Context) {
	var user User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	ctx := context.Background()

	// Check if a user with the same email already exists
	iter := client.Collection("users").Where("email", "==", user.Email).Documents(ctx)
	existingUser, err := iter.Next()
	if err == nil && existingUser.Exists() {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
		return
	}

	// Hash the user's password
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	

	// Add the new user
	doc, _, err := client.Collection("users").Add(ctx, map[string]interface{}{
		"first":           user.First,
		"last":            user.Last,
		"email":           user.Email,
		"password":        hashedPassword,
		"school":          user.School,
		"is_admin":        user.IsAdmin,
		"is_master":       user.IsMaster,
		"expo_push_token": user.ExpoPushToken,
		"allow_email":     user.AllowEmail,
		"allow_push":      user.AllowPush,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add user"})
		return
	}

	response := gin.H{
		"id": doc.ID,
	}

	c.JSON(http.StatusOK, gin.H{"message": "User added successfully", "user": response})
}

// GetUsers godoc
// @Summary Get all users
// @Description Get a list of all users
// @Tags users
// @Produce json
// @Success 200 {array} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users [get]
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

// GetUserSchools godoc
// @Summary Get all distinct schools from users
// @Description Get a list of distinct schools from every users
// @Tags users
// @Produce json
// @Success 200 {array} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/schools [get]
func GetUserSchools(c *gin.Context) {
	if client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Firestore client is not initialized"})
		return
	}

	ctx := context.Background()
	iter := client.Collection("users").Documents(ctx)

	// store unique schools in a set
	schoolSet := make(map[string]struct{})

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
		// ensure school exists and is a string then add to set
		if school, ok := user["school"].(string); ok {
			schoolSet[school] = struct{}{}
		}
	}

	// convert set to slice
	var schools []string
	for school := range schoolSet {
		schools = append(schools, school)
	}

	c.JSON(http.StatusOK, schools)
}

// GetUser godoc
// @Summary Get a user by ID
// @Description Get a specific user by their ID
// @Tags users
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /api/v1/users/{id} [get]
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
// @Failure 409 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/{id} [put]
func UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	var user User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Check if email is already in use
	if user.Email != "" {
		ctx := context.Background()
		iter := client.Collection("users").Where("email", "==", user.Email).Documents(ctx)
		var existingUserID string

		for {
			doc, err := iter.Next()
			if err != nil {
				break // No user with the given email found -- so the users email can be update to this email
			}
			existingUserID = doc.Ref.ID
			if existingUserID != userID {
				// Found another user with the same email so cannot update the email to this email
				c.JSON(http.StatusConflict, gin.H{"error": "Email is already in use"})
				return
			}
		}
	}


	// Proceed with updating the user data
	updateData := make(map[string]interface{})

	if user.First != "" {
		updateData["first"] = user.First
	}
	if user.Last != "" {
		updateData["last"] = user.Last
	}
	if user.Email != "" {
		updateData["email"] = user.Email
	}
	if user.Password != "" {
		hashedPassword, err := HashPassword(user.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		updateData["password"] = hashedPassword
	}
	if user.School != "" {
		updateData["school"] = user.School
	}
	if user.ExpoPushToken != "" {
		updateData["expo_push_token"] = user.ExpoPushToken
	}
	if user.IsAdmin {
		updateData["is_admin"] = user.IsAdmin
	}
	if user.IsMaster {
		updateData["is_master"] = user.IsMaster
	}

	if user.AllowEmail{
	    updateData["allow_email"] = user.AllowEmail
	}
	if user.AllowPush{
	    updateData["allow_push"] = user.AllowPush
	}


	ctx := context.Background()
	_, err := client.Collection("users").Doc(userID).Set(ctx, updateData, firestore.MergeAll)
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
// @Router /api/v1/users/{id} [delete]
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

// Login authenticates a user by email and password and return the user data
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
	var userID string

	// Find the user by email
	for {
		doc, err := iter.Next()
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		user = doc.Data()
		userID = doc.Ref.ID
		break
	}

	// Verify the password
	if !CheckPasswordHash(loginDetails.Password, user["password"].(string)) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	// Return user info upon successful login
	response := gin.H{
		"first":           user["first"],
		"last":            user["last"],
		"email":           user["email"],
		"school":          user["school"],
		"is_admin":        user["is_admin"],
		"is_master":       user["is_master"],
		"allow_email":     user["allow_email"],
		"allow_push":      user["allow_push"],
		"expo_push_token": user["expo_push_token"],
		"id":              userID,
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": response})
}
