package controllers_test

import (
	"cloud.google.com/go/firestore"
	"context"
	"log"
	"os"
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httptest"
	"encoding/json"
	"bytes"
	"github.com/ekjyotshinh/ChemTrack/backend/controllers"
	"google.golang.org/api/option" 
)
// Declare the Firestore client and router as global variables
var client *firestore.Client
var r *gin.Engine

// Set up the Firestore client and the router once for the entire test suite
func TestMain(m *testing.M) {

	// Set the FIRESTORE_EMULATOR_HOST environment variable
	os.Setenv("FIRESTORE_EMULATOR_HOST", "localhost:8080")
	os.Setenv("ENVIRONMENT", "test")
	// Set up Firestore client
	client = setupFirestoreClient()

	// addditial checks
	if client == nil {
		log.Fatalf("Failed to create Firestore client")
	}

	// Set the Firestore client in the controllers
	controllers.SetClient(client)

	// Initialize the router
	r = setupRouter()

	// Run tests
	exitCode := m.Run()

	// Clean up after tests
	client.Close()

	// Exit with the code from the test run
	os.Exit(exitCode)
}

// Helper function to set up the Firestore client
func setupFirestoreClient() *firestore.Client {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, "chemtrack-3857a", option.WithoutAuthentication()) // Use WithoutAuthentication for emulator
	// chemtrack-3857a -- my temp project
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
		return nil
	}
	return client
}

// set up the  router
func setupRouter() *gin.Engine {
	r := gin.Default()

	// Set up routes for testing

	// user routes
	r.POST("/api/v1/users", controllers.AddUser)
	r.GET("/api/v1/users", controllers.GetUsers)
	r.GET("/api/v1/users/:id", controllers.GetUser)
	r.GET("/api/v1/users/schools", controllers.GetUserSchools)
	r.PUT("/api/v1/users/:id", controllers.UpdateUser)
	r.DELETE("/api/v1/users/:id", controllers.DeleteUser)
	r.POST("/api/v1/login", controllers.Login)

	// Chemical routes
	r.POST("/api/v1/chemicals", controllers.AddChemical)        // Create a new chemical
	r.GET("/api/v1/chemicals", controllers.GetChemicals)        // Get all chemicals
	r.GET("/api/v1/chemicals/:id", controllers.GetChemical)     // Get a specific chemical by ID
	r.PUT("/api/v1/chemicals/:id", controllers.UpdateChemical)  // Update a chemical by ID
	r.DELETE("/api/v1/chemicals/:id", controllers.DeleteChemical) // Delete a chemical by ID

	// email routes
	r.POST("/api/v1/email/send", controllers.SendEmail)

	// file routes
		// sds routes
	r.POST("/api/v1/files/sds/:chemicalIdNumber", controllers.AddSDS)      // Create a new chemical
	r.GET("/api/v1/files/sds/:chemicalIdNumber", controllers.GetSDS)       // Retrieve SDS URL
	r.DELETE("/api/v1/files/sds/:chemicalIdNumber", controllers.DeleteSDS) // Delete SDS

	//profile picture routes
	r.POST("/api/v1/files/profile/:userId", controllers.AddProfilePicture)      // Add a new profile picture
	r.GET("/api/v1/files/profile/:userId", controllers.GetProfilePicture)       // Get the profile picture URL
	r.DELETE("/api/v1/files/profile/:userId", controllers.DeleteProfilePicture) // Delete profile picture
	r.PUT("/api/v1/files/profile/:userId", controllers.UpdateProfilePicture)    // Update existing profile picture

	// label routes
	r.POST("/api/v1/files/label/:chemicalIdNumber", controllers.AddLabel) // Create a new label


	return r
}

// User structure for tests
type User struct {
	First         string `json:"first"`
	Last          string `json:"last"`
	Email         string `json:"email"`
	Password      string `json:"password"`
	School        string `json:"school"`
	ExpoPushToken string `json:"expo_push_token"`
	IsAdmin       bool   `json:"is_admin"`
	IsMaster      bool   `json:"is_master"`
	AllowEmail    bool   `json:"allow_email"`
	AllowPush     bool   `json:"allow_push"`
}

// Test AddUser
func TestAddUser(t *testing.T) {
	// Prepare user data to add
	user := User{
		First:         "John",
		Last:          "Doe",
		Email:         "john.doe@example.com",
		Password:      "password123",
		School:        "Test School",
		ExpoPushToken: "expoPushToken",
		IsAdmin:       false,
		IsMaster:      false,
		AllowEmail:    true,
		AllowPush:     true,
	}

	jsonValue, _ := json.Marshal(user)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/users", bytes.NewReader(jsonValue))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "User added successfully")
}

// Test GetUser
func TestGetUser(t *testing.T) {
	// Add mock data for a user
	userID := "12345"
	userRef := client.Collection("users").Doc(userID)
	_, err := userRef.Set(context.Background(), map[string]interface{}{
		"first": "Jane",
		"last":  "Doe",
		"email": "jane.doe@example.com",
	})
	if err != nil {
		t.Fatalf("Failed to add mock user: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users/"+userID, nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), userID)
}

// Test GetUsers
func TestGetUsers(t *testing.T) {
	// Add mock data for users
	users := []User{
		{First: "John", Last: "Doe", Email: "john.doe@example.com", Password: "password123", School: "Test School"},
		{First: "Jane", Last: "Smith", Email: "jane.smith@example.com", Password: "password123", School: "Test School"},
	}

	// Insert multiple users into Firestore
	for _, user := range users {
		_, _, err := client.Collection("users").Add(context.Background(), map[string]interface{}{
			"first": user.First,
			"last":  user.Last,
			"email": user.Email,
		})
		if err != nil {
			t.Fatalf("Failed to add user: %v", err)
		}
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	// should have both of that added users
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "john.doe@example.com")
	assert.Contains(t, w.Body.String(), "jane.smith@example.com")
}

// Test GetUser with invalid ID
func TestGetUserWithInvalidID(t *testing.T) {
	invalidUserID := "nonexistent123"

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users/"+invalidUserID, nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "User not found")
}

// Test UpdateUser
func TestUpdateUser(t *testing.T) {

	userID := "12345"
	userRef := client.Collection("users").Doc(userID)
	_, err := userRef.Set(context.Background(), map[string]interface{}{
		"first": "Jane",
		"last":  "Doe",
		"email": "jane.doe@example.com",
	})
	if err != nil {
		t.Fatalf("Failed to add mock user: %v", err)
	}

	updatedUser := User{
		First:         "Janet",
		Last:          "Doe",
		Email:         "janet.doe@example.com",
		Password:      "newpassword123",
		School:        "New School",
		ExpoPushToken: "newExpoPushToken",
		IsAdmin:       false,
		IsMaster:      false,
		AllowEmail:    false,
		AllowPush:     true,
	}

	jsonValue, _ := json.Marshal(updatedUser)
	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/"+userID, bytes.NewReader(jsonValue))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "User updated successfully")
}

// Test DeleteUser
func TestDeleteUser(t *testing.T) {

	userID := "12345"
	userRef := client.Collection("users").Doc(userID)
	_, err := userRef.Set(context.Background(), map[string]interface{}{
		"first": "John",
		"last":  "Doe",
		"email": "john.doe@example.com",
	})
	if err != nil {
		t.Fatalf("Failed to add mock user: %v", err)
	}

	req := httptest.NewRequest(http.MethodDelete, "/api/v1/users/"+userID, nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "User deleted successfully")
}

// Test Login
func TestLogin(t *testing.T) {

	loginData := struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}{
		Email:    "john.doe@example.com",
		Password: "password123",
	}

	jsonValue, _ := json.Marshal(loginData)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/login", bytes.NewReader(jsonValue))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Login successful")
}

// Test Login with invalid credentials
func TestLoginWithInvalidCredentials(t *testing.T) {

	loginData := struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}{
		Email:    "invalid.email@example.com",
		Password: "wrongpassword",
	}

	jsonValue, _ := json.Marshal(loginData)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/login", bytes.NewReader(jsonValue))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "User not found")
}
