package controllers_test

import (
	"bytes"
    "mime/multipart"
    "context"
    "testing"
	"io"
	"os"
	"net/http"
	"net/http/httptest"
    "github.com/stretchr/testify/assert"
)

func createMultipartFormData(t *testing.T, filePath string) (*bytes.Buffer, *multipart.Writer) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	file, err := os.Open(filePath)
	if err != nil {
		t.Fatalf("failed to open file: %v", err)
	}
	defer file.Close()

	part, err := writer.CreateFormFile("sds", "sdsfile.pdf")
	if err != nil {
		t.Fatalf("failed to create form file: %v", err)
	}

	_, err = io.Copy(part, file)
	if err != nil {
		t.Fatalf("failed to copy file content: %v", err)
	}

	err = writer.Close()
	if err != nil {
		t.Fatalf("failed to close writer: %v", err)
	}

	return body, writer
}
func createMultipartFormDataForProfile(t *testing.T, filePath string) (*bytes.Buffer, *multipart.Writer) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	file, err := os.Open(filePath)
	if err != nil {
		t.Fatalf("failed to open file: %v", err)
	}
	defer file.Close()

	part, err := writer.CreateFormFile("profilePicture", "profilePicture.pdf")
	if err != nil {
		t.Fatalf("failed to create form file: %v", err)
	}

	_, err = io.Copy(part, file)
	if err != nil {
		t.Fatalf("failed to copy file content: %v", err)
	}

	err = writer.Close()
	if err != nil {
		t.Fatalf("failed to close writer: %v", err)
	}

	return body, writer
}

// Section 1 - Test cases for SDS

// Test case for successful SDS upload
func TestAddSDS_Success(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing
	chemicalID := "12345TestAddSDS_Success"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{"name": "Chemical Test"})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a file upload request
	filePath := "./dummy.pdf" 
	body, writer := createMultipartFormData(t, filePath)
	req := httptest.NewRequest("POST", "/api/v1/files/sds/12345TestAddSDS_Success", body)

	// Set Content-Type header properly using the writer's FormDataContentType
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Create a recorder to capture the response
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the POST request)
	r.ServeHTTP(w, req)

	// Validate response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "SDS uploaded successfully")
}

// Test case for failed SDS upload due to missing file
func TestAddSDS_MissingFile(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing
	chemicalID := "12345TestAddSDS_MissingFile"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{"name": "Chemical Test"})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a POST request without the file
	req := httptest.NewRequest("POST", "/api/v1/files/sds/12345TestAddSDS_MissingFile", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the POST request)
	r.ServeHTTP(w, req)

	// Validate response
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Failed to retrieve file")
}

// Test case for chemical not found in Firestore
func TestAddSDS_ChemicalNotFound(t *testing.T) {
	// Mock a file upload request
	filePath := "./dummy.pdf" 
	body, writer := createMultipartFormData(t, filePath)
	req := httptest.NewRequest("POST", "/api/v1/files/sds/99999TestAddSDS_ChemicalNotFound", body)

	// Set Content-Type header properly using the writer's FormDataContentType
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Create a recorder to capture the response
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the POST request)
	r.ServeHTTP(w, req)

	// Validate response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Chemical not found")
}

// Test case for successful retrieval of SDS URL
func TestGetSDS_Success(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing
	chemicalID := "12345TestGetSDS_Success"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name":   "Chemical Test",
		"sdsURL": "https://storage.googleapis.com/chemtrack-deployment/sds/12345TestGetSDS_Success.pdf", // Mock the SDS URL
	})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a GET request for the SDS URL
	req := httptest.NewRequest("GET", "/api/v1/files/sds/12345TestGetSDS_Success", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the GET request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "sdsURL")
	assert.Contains(t, w.Body.String(), "https://storage.googleapis.com/chemtrack-deployment/sds/12345TestGetSDS_Success.pdf")
}

// Test case for chemical not found when retrieving SDS URL
func TestGetSDS_ChemicalNotFound(t *testing.T) {
	// Mock a GET request for a non-existent chemical
	req := httptest.NewRequest("GET", "/api/v1/files/sds/99999TestGetSDS_ChemicalNotFound", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the GET request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Chemical not found")
}

// Test case for SDS URL not found for the given chemical
func TestGetSDS_MissingSDSURL(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing (but no SDS URL)
	chemicalID := "12345TestGetSDS_MissingSDSURL"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name": "Chemical Test", // No SDS URL provided
	})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a GET request for the SDS URL
	req := httptest.NewRequest("GET", "/api/v1/files/sds/12345TestGetSDS_MissingSDSURL", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the GET request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "SDS file not found for this chemical")
}

func TestDeleteSDS_Success(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing
	chemicalID := "12345TestDeleteSDS_Success"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name":   "Chemical Test",
		"sdsURL": "https://storage.googleapis.com/chemtrack-deployment/sds/12345.pdf", // Mock the SDS URL
	})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a DELETE request for the SDS file
	req := httptest.NewRequest("DELETE", "/api/v1/files/sds/12345TestDeleteSDS_Success", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the DELETE request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "SDS file deleted successfully")
}

func TestDeleteSDS_ChemicalNotFound(t *testing.T) {
	// Mock a DELETE request for a non-existent chemical ID
	req := httptest.NewRequest("DELETE", "/api/v1/files/sds/99999TestDeleteSDS_ChemicalNotFound", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the DELETE request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Chemical not found")
}

func TestDeleteSDS_FileNotFound(t *testing.T) {
	// Set up the Firestore collection with a chemical record, but no SDS URL
	chemicalID := "12345TestDeleteSDS_FileNotFound"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name": "Chemical Test",
	})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a DELETE request for the SDS file
	req := httptest.NewRequest("DELETE", "/api/v1/files/sds/12345TestDeleteSDS_FileNotFound", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the DELETE request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "SDS file not found for this chemical")
}

func TestDeleteSDS_InvalidSDSURLFormat(t *testing.T) {
	// Set up the Firestore collection with a chemical record and an invalid SDS URL format
	chemicalID := "12345"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name":   "Chemical Test",
		"sdsURL": 12345, // Invalid format (not a string)
	})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a DELETE request for the SDS file
	req := httptest.NewRequest("DELETE", "/api/v1/files/sds/12345", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the DELETE request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid SDS URL format")
}

// Section 2 - Test cases for Profile
func TestAddProfilePicture_Success(t *testing.T) {
	// Set up Firestore mocks: Create a mock user with ID "123"
	client.Collection("users").Doc("123TestAddProfilePicture_Success").Set(context.Background(), map[string]interface{}{
		"userId": "123TestAddProfilePicture_Success",
	})

	filePath := "./dummy.pdf"
	body, writer := createMultipartFormDataForProfile(t, filePath)	

	req := httptest.NewRequest(http.MethodPost, "/api/v1/files/profile/123TestAddProfilePicture_Success", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is OK (200)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Profile picture uploaded successfully")
}

func TestAddProfilePicture_FileNotFound(t *testing.T) {
	// Set up Firestore mocks: Create a mock user with ID "123"
	client.Collection("users").Doc("123TestAddProfilePicture_FileNotFound").Set(context.Background(), map[string]interface{}{
		"userId": "123TestAddProfilePicture_FileNotFound",
	})

	// Prepare the request without a file
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/files/profile/123TestAddProfilePicture_FileNotFound", body)

	req.Header.Set("Content-Type", writer.FormDataContentType())

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is Bad Request (400)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	assert.Contains(t, w.Body.String(), "Failed to retrieve file")
}

func TestAddProfilePicture_UserNotExists(t *testing.T) {
	// Set up Firestore mocks: Do not create a user with invalid user ID format "user!@#"
	
	// Prepare a dummy file path for testing
	filePath := "./dummy.pdf"
	body, writer := createMultipartFormDataForProfile(t, filePath)

	// Prepare the request: use the body generated from the multipart form
	req := httptest.NewRequest(http.MethodPost, "/api/v1/files/profile/9999", body)

	// Set Content-Type header properly using the writer's FormDataContentType
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Execute the request using a response recorder
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is Bad Request (400)
	assert.Equal(t, http.StatusNotFound, w.Code)

	assert.Contains(t, w.Body.String(), "User not found")
}


func TestUpdateProfilePicture_Success(t *testing.T) {
	// Set up Firestore mocks: Create a mock user with ID "123"
	client.Collection("users").Doc("123TestUpdateProfilePicture_Success").Set(context.Background(), map[string]interface{}{
		"userId": "123TestUpdateProfilePicture_Success",
	})

	filePath := "./dummy.pdf"
	body, writer := createMultipartFormDataForProfile(t, filePath)

	// Prepare the request: use the body generated from the multipart form
	req := httptest.NewRequest(http.MethodPut, "/api/v1/files/profile/123TestUpdateProfilePicture_Success", body)

	// Set Content-Type header properly using the writer's FormDataContentType
	req.Header.Set("Content-Type", writer.FormDataContentType())

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is OK (200)
	assert.Equal(t, http.StatusOK, w.Code)

	// Check that the response contains the success message
	assert.Contains(t, w.Body.String(), "Profile picture updated successfully")
	assert.Contains(t, w.Body.String(), "testURL")
}

func TestUpdateProfilePicture_UserNotFound(t *testing.T) {
	// Prepare a dummy file for the test
	filePath := "./dummy.pdf"
	body, writer := createMultipartFormDataForProfile(t, filePath)

	// Prepare the request with a non-existing user ID
	req := httptest.NewRequest(http.MethodPut, "/api/v1/files/profile/123TestUpdateProfilePicture_UserNotFound", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)

	assert.Contains(t, w.Body.String(), "User not found")
}

func TestUpdateProfilePicture_FileNotProvided(t *testing.T) {
	// Set up Firestore mocks: Create a mock user with ID "123"
	client.Collection("users").Doc("123TestUpdateProfilePicture_FileNotProvided").Set(context.Background(), map[string]interface{}{
		"userId": "123TestUpdateProfilePicture_FileNotProvided",
	})

	// Prepare the request without a file
	req := httptest.NewRequest(http.MethodPut, "/api/v1/files/profile/123TestUpdateProfilePicture_FileNotProvided", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is Bad Request (400)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	// Check that the response contains the error message
	assert.Contains(t, w.Body.String(), "Failed to retrieve file")
}

func TestDeleteProfilePicture_Success(t *testing.T) {
	// Set up Firestore mocks: Create a mock user with ID "123TestDeleteProfilePicture_Success"
	client.Collection("users").Doc("123TestDeleteProfilePicture_Success").Set(context.Background(), map[string]interface{}{
		"userId": "123TestDeleteProfilePicture_Success",
		"profilePictureURL": "https://storage.googleapis.com/chemtrack-testing/profile_pictures/12345.jpg?t=123",
	})

	// Prepare the request
	req := httptest.NewRequest(http.MethodDelete, "/api/v1/files/profile/123TestDeleteProfilePicture_Success", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is OK (200)
	assert.Equal(t, http.StatusOK, w.Code)

	// Check that the response contains the success message
	assert.Contains(t, w.Body.String(), "Profile picture deleted successfully")
}

func TestDeleteProfilePicture_UserNotFound(t *testing.T) {
	// Prepare the request for a non-existing user
	req := httptest.NewRequest(http.MethodDelete, "/api/v1/files/profile/123TestDeleteProfilePicture_UserNotFound", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)


	assert.Equal(t, http.StatusNotFound, w.Code)

	assert.Contains(t, w.Body.String(), "User not found")
}

func TestDeleteProfilePicture_ProfileNotFound(t *testing.T) {
	// Set up Firestore mocks: Create a mock user with ID "123TestDeleteProfilePicture_ProfileNotFound"
	client.Collection("users").Doc("123TestDeleteProfilePicture_ProfileNotFound").Set(context.Background(), map[string]interface{}{
		"userId": "123TestDeleteProfilePicture_ProfileNotFound",
		// No profilePictureURL field
	})

	// Prepare the request
	req := httptest.NewRequest(http.MethodDelete, "/api/v1/files/profile/123TestDeleteProfilePicture_ProfileNotFound", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is Not Found (404)
	assert.Equal(t, http.StatusNotFound, w.Code)

	// Check that the response contains the error message
	assert.Contains(t, w.Body.String(), "Profile picture not found for this user")
}

func TestDeleteProfilePicture_InvalidProfilePictureURLFormat(t *testing.T) {
	// Set up Firestore mocks: Create a mock user with ID "123TestDeleteProfilePicture_InvalidFormat"
	client.Collection("users").Doc("123TestDeleteProfilePicture_InvalidFormat").Set(context.Background(), map[string]interface{}{
		"userId": "123TestDeleteProfilePicture_InvalidFormat",
		"profilePictureURL": 12345, // Invalid URL format
	})

	// Prepare the request
	req := httptest.NewRequest(http.MethodDelete, "/api/v1/files/profile/123TestDeleteProfilePicture_InvalidFormat", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	// Check that the response status is Internal Server Error (500)
	assert.Equal(t, http.StatusInternalServerError, w.Code)

	// Check that the response contains the error message
	assert.Contains(t, w.Body.String(), "Invalid profile picture URL format")
}

// Label tests
func TestAddLabel_Success(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing
	chemicalID := "12345TestAddLabel_Success"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{"name": "Chemical Test"})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/files/label/12345TestAddLabel_Success", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assert that the response status code is 200 OK
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Label created and uploaded successfully")
}
