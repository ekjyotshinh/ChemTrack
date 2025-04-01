package controllers

import (
    "context"
    "crypto/rand"
    "crypto/sha256"
    "encoding/hex"
    "net/http"
    "time"

    "cloud.google.com/go/firestore"
    "github.com/gin-gonic/gin"
    "github.com/ekjyotshinh/ChemTrack/backend/helpers"  // Re-enabled this import
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

// Request types for password reset
type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword" `
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
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users [post]
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
	doc, _, err := client.Collection("users").Add(ctx, map[string]interface{}{
		"first":           user.First,
		"last":            user.Last,
		"email":           user.Email,
		"password":        hashedPassword, // Store hashed password
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

	// Return user info upon successful account addition
	response := gin.H{
		"id": doc.ID, // Firestore-generated document ID
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
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/{id} [put]
func UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	var user User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

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
	updateData["is_admin"] = user.IsAdmin
	updateData["is_master"] = user.IsMaster
	updateData["allow_email"] = user.AllowEmail
	updateData["allow_push"] = user.AllowPush

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

// ForgotPassword handles password reset requests
// @Summary Sends a password reset email
// @Description Generates a reset token and sends an email to the user
// @Tags auth
// @Accept json
// @Produce json
// @Param request body ForgotPasswordRequest true "User email"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/auth/forgot-password [post]

// ForgotPassword handles password reset requests
func ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Generate a secure random token
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	
	// Convert to hex string for URL safety
	resetToken := hex.EncodeToString(tokenBytes)
	
	// Hash token for storage
	hasher := sha256.New()
	hasher.Write([]byte(resetToken))
	hashedToken := hex.EncodeToString(hasher.Sum(nil))
	
	// Set expiration time (1 hour)
	expiryTime := time.Now().Add(15 * time.Minute)
	
	// Find user by email
	ctx := context.Background()
	iter := client.Collection("users").Where("email", "==", req.Email).Documents(ctx)
	
	var userFound bool
	var userID string
	
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			// Log the error but don't expose it to the client
			userFound = false
			break
		}
		
		userID = doc.Ref.ID
		userFound = true
		
		// Store the reset token and expiration time
		_, err = client.Collection("users").Doc(userID).Set(ctx, map[string]interface{}{
			"reset_token": hashedToken,
			"reset_expiry": expiryTime,
		}, firestore.MergeAll)
		
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process request"})
			return
		}
		
		break
	}
	
	// Always return a success message even if user not found (for security)
	if !userFound {
		c.JSON(http.StatusOK, gin.H{"message": "If that email exists in our system, we have sent a password reset link"})
		return
	}
	
	// Create reset URL
	// Create reset URL (still needed for the token in the email instructions)
	resetURL := "chemtrack://reset-password?token=" + resetToken

	// Email body with reset link - Format the email in HTML for better presentation
	emailBody := `
	<html>
	<body style="font-family: Arial, sans-serif; line-height: 1.6;">
		<h2>ChemTrack Password Reset</h2>
		<p>You requested a password reset for your ChemTrack account.</p>
		
		<div style="margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; background-color: #f8f8f8; border-radius: 5px;">
			<p><strong>Instructions:</strong></p>
			<ol>
				<li>Open the ChemTrack app on your device</li>
				<li>Go to the Login screen</li>
				<li>Tap "Forgot Password"</li>
				<li>Enter your email: ` + req.Email + `</li>
				<li>When prompted, use this reset token:</li>
			</ol>
			<div style="padding: 10px; background-color: #f0f0f0; border: 1px dashed #ccc; font-family: monospace; margin: 10px 0;">
				` + resetToken + `
			</div>
			<p>Or if your app supports deep links, you can try clicking this button:</p>
			<div style="margin: 15px 0;">
				<a href="` + resetURL + `" style="background-color: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Open in App</a>
			</div>
		</div>
		
		<p>This reset token will expire in 15 minutes.</p>
		<p>If you didn't request this reset, please ignore this email.</p>
	</body>
	</html>
	`

	// Send the email - make sure to use HTML content type
	if err := helpers.SendEmailHelper(req.Email, "ChemTrack Password Reset", emailBody); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}
	// This is the problematic line - make sure there are no missing commas
	c.JSON(http.StatusOK, gin.H{
		"message": "If that email exists in our system, we have sent a password reset link",
	})
}
// ResetPassword validates a reset token and updates the user's password
// @Summary Reset user password
// @Description Resets a user's password using a valid token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body ResetPasswordRequest true "Reset token and new password"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/auth/reset-password [post]
func ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	
	// Hash the token to compare with stored hash
	hasher := sha256.New()
	hasher.Write([]byte(req.Token))
	hashedToken := hex.EncodeToString(hasher.Sum(nil))
	
	// Find user with this token
	ctx := context.Background()
	iter := client.Collection("users").Where("reset_token", "==", hashedToken).Documents(ctx)
	
	var userFound bool
	var userID string
	var userData map[string]interface{}
	
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			userFound = false
			break
		}
		
		userID = doc.Ref.ID
		userData = doc.Data()
		userFound = true
		break
	}
	
	if !userFound {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired token"})
		return
	}
	
	// Check if token is expired
	if expiry, ok := userData["reset_expiry"].(time.Time); ok {
		if time.Now().After(expiry) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Reset token has expired"})
			return
		}
	} else {
		// If we can't parse the expiry time, consider the token invalid
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
		return
	}
	
	// Hash the new password
	hashedPassword, err := HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}
	
	// Update the password and clear reset token fields
	_, err = client.Collection("users").Doc(userID).Set(ctx, map[string]interface{}{
		"password": hashedPassword,
		"reset_token": firestore.Delete,
		"reset_expiry": firestore.Delete,
	}, firestore.MergeAll)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Password has been reset successfully"})
}

// VerifyResetToken validates if a password reset token exists and is not expired
// @Summary Verify reset token
// @Description Verify if a reset token is valid and not expired
// @Tags auth
// @Accept json
// @Produce json
// @Param request body map[string]string true "Token to verify"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/auth/verify-token [post]
func VerifyResetToken(c *gin.Context) {
	var req struct {
		Token string `json:"token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	
	// Hash the token to compare with stored hash (same as in ResetPassword)
	hasher := sha256.New()
	hasher.Write([]byte(req.Token))
	hashedToken := hex.EncodeToString(hasher.Sum(nil))
	
	// Find user with this token
	ctx := context.Background()
	iter := client.Collection("users").Where("reset_token", "==", hashedToken).Documents(ctx)
	
	var userFound bool
	var userData map[string]interface{}
	
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify token"})
			return
		}
		
		userData = doc.Data()
		userFound = true
		break
	}
	
	if !userFound {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
		return
	}
	
	// Check if token is expired
	if expiry, ok := userData["reset_expiry"].(time.Time); ok {
		if time.Now().After(expiry) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Reset token has expired"})
			return
		}
	} else {
		// If we can't parse the expiry time, consider the token invalid
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token format"})
		return
	}
	
	// Token is valid and not expired
	c.JSON(http.StatusOK, gin.H{"message": "Token is valid"})
}
