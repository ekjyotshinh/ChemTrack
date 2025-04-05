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

// Section 1 - Test cases for SDS

// Test case for successful SDS upload
func TestAddSDS_Success(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing
	chemicalID := "12345"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{"name": "Chemical Test"})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a file upload request
	filePath := "./dummy.pdf" // Replace with an actual file path for testing
	body, writer := createMultipartFormData(t, filePath)
	req := httptest.NewRequest("POST", "/api/v1/files/sds/12345", body)

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
	chemicalID := "12345"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{"name": "Chemical Test"})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a POST request without the file
	req := httptest.NewRequest("POST", "/api/v1/files/sds/12345", nil)
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
	filePath := "./dummy.pdf" // Replace with an actual file path for testing
	body, writer := createMultipartFormData(t, filePath)
	req := httptest.NewRequest("POST", "/api/v1/files/sds/99999", body)

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
	chemicalID := "12345"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name":   "Chemical Test",
		"sdsURL": "https://storage.googleapis.com/chemtrack-testing2/sds/12345.pdf", // Mock the SDS URL
	})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a GET request for the SDS URL
	req := httptest.NewRequest("GET", "/api/v1/files/sds/12345", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the GET request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "sdsURL")
	assert.Contains(t, w.Body.String(), "https://storage.googleapis.com/chemtrack-testing2/sds/12345.pdf")
}

// Test case for chemical not found when retrieving SDS URL
func TestGetSDS_ChemicalNotFound(t *testing.T) {
	// Mock a GET request for a non-existent chemical
	req := httptest.NewRequest("GET", "/api/v1/files/sds/99999", nil)
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
	chemicalID := "12345"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name": "Chemical Test", // No SDS URL provided
	})
	if err != nil {
		t.Fatalf("Failed to set chemical data in Firestore: %v", err)
	}

	// Mock a GET request for the SDS URL
	req := httptest.NewRequest("GET", "/api/v1/files/sds/12345", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the GET request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "SDS file not found for this chemical")
}

func TestDeleteSDS_Success(t *testing.T) {
	// Set up the Firestore collection with a chemical record for testing
	chemicalID := "12345"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name":   "Chemical Test",
		"sdsURL": "https://storage.googleapis.com/chemtrack-testing2/sds/12345.pdf", // Mock the SDS URL
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
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "SDS file deleted successfully")
}

func TestDeleteSDS_ChemicalNotFound(t *testing.T) {
	// Mock a DELETE request for a non-existent chemical ID
	req := httptest.NewRequest("DELETE", "/api/v1/files/sds/99999", nil)
	w := httptest.NewRecorder()

	// Call the handler function (route handler for the DELETE request)
	r.ServeHTTP(w, req)

	// Validate the response
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "Chemical not found")
}

func TestDeleteSDS_FileNotFound(t *testing.T) {
	// Set up the Firestore collection with a chemical record, but no SDS URL
	chemicalID := "12345"
	collection := client.Collection("chemicals")
	docRef := collection.Doc(chemicalID)
	_, err := docRef.Set(context.Background(), map[string]interface{}{
		"name": "Chemical Test",
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
