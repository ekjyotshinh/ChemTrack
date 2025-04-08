package controllers_test


import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Chemical represents the structure of a chemical
type Chemical struct {
	ID             string `json:"id"`
	QRcode         string `json:"qrcode"`
	Name           string `json:"name"`
	CAS            int    `json:"CAS"`
	School         string `json:"school"`
	PurchaseDate   string `json:"purchase_date"`
	ExpirationDate string `json:"expiration_date"`
	Status         string `json:"status"`
	Quantity       string `json:"quantity"`
	Room           string `json:"room"`
	Cabinet        int    `json:"cabinet"`
	Shelf          int    `json:"shelf"`
}

// Test AddChemical
func TestAddChemical(t *testing.T) {

	chemical := Chemical{
		Name:           "Test Chemical",
		CAS:            123456,
		School:         "Test School",
		PurchaseDate:   "2023-03-01",
		ExpirationDate: "2025-03-01",
		Status:         "Active",
		Quantity:       "10",
		Room:           "101",
		Cabinet:        1,
		Shelf:          1,
	}

	jsonValue, _ := json.Marshal(chemical)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/chemicals", bytes.NewReader(jsonValue))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Chemical added successfully")
}

// Test GetChemical
func TestGetChemical(t *testing.T) {

	// Adding a mock chemical for testing
	chemical := Chemical{
		Name:           "Test Chemical",
		CAS:            123456,
		School:         "Test School",
		PurchaseDate:   "2023-03-01",
		ExpirationDate: "2025-03-01",
		Status:         "Active",
		Quantity:       "10",
		Room:           "101",
		Cabinet:        1,
		Shelf:          1,
	}

	ctx := context.Background()
	// add a chemical to test get
	docRef, _, err := client.Collection("chemicals").Add(ctx, map[string]interface{}{
		"name":            chemical.Name,
		"CAS":             chemical.CAS,
		"school":          chemical.School,
		"purchase_date":   chemical.PurchaseDate,
		"expiration_date": chemical.ExpirationDate,
		"status":          chemical.Status,
		"quantity":        chemical.Quantity,
		"room":            chemical.Room,
		"cabinet":         chemical.Cabinet,
		"shelf":           chemical.Shelf,
	})
	if err != nil {
		t.Fatalf("Failed to add mock chemical: %v", err)
	}

	// Send a GET request to fetch the chemical
	req := httptest.NewRequest(http.MethodGet, "/api/v1/chemicals/"+docRef.ID, nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), docRef.ID)
}

// Test GetChemicals
func TestGetChemicals(t *testing.T) {

	// Adding a mock chemical for testing
	chemical := Chemical{
		Name:           "Test Chemical",
		CAS:            123456,
		School:         "Test School",
		PurchaseDate:   "2023-03-01",
		ExpirationDate: "2025-03-01",
		Status:         "Active",
		Quantity:       "10",
		Room:           "101",
		Cabinet:        1,
		Shelf:          1,
	}

	// add a chemical to test get all
	ctx := context.Background()
	_, _, err := client.Collection("chemicals").Add(ctx, map[string]interface{}{
		"name":            chemical.Name,
		"CAS":             chemical.CAS,
		"school":          chemical.School,
		"purchase_date":   chemical.PurchaseDate,
		"expiration_date": chemical.ExpirationDate,
		"status":          chemical.Status,
		"quantity":        chemical.Quantity,
		"room":            chemical.Room,
		"cabinet":         chemical.Cabinet,
		"shelf":           chemical.Shelf,
	})
	if err != nil {
		t.Fatalf("Failed to add mock chemical: %v", err)
	}

	// Send a GET request to fetch all chemicals
	req := httptest.NewRequest(http.MethodGet, "/api/v1/chemicals",nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Test Chemical")
}

// Test UpdateChemical
func TestUpdateChemical(t *testing.T) {

	// Adding a mock chemical for testing
	chemical := Chemical{
		Name:           "Test Chemical",
		CAS:            123456,
		School:         "Test School",
		PurchaseDate:   "2023-03-01",
		ExpirationDate: "2025-03-01",
		Status:         "Active",
		Quantity:       "10",
		Room:           "101",
		Cabinet:        1,
		Shelf:          1,
	}

	ctx := context.Background()
	// add a chemical to test update
	docRef, _, err := client.Collection("chemicals").Add(ctx, map[string]interface{}{
		"name":            chemical.Name,
		"CAS":             chemical.CAS,
		"school":          chemical.School,
		"purchase_date":   chemical.PurchaseDate,
		"expiration_date": chemical.ExpirationDate,
		"status":          chemical.Status,
		"quantity":        chemical.Quantity,
		"room":            chemical.Room,
		"cabinet":         chemical.Cabinet,
		"shelf":           chemical.Shelf,
	})
	if err != nil {
		t.Fatalf("Failed to add mock chemical: %v", err)
	}

	// New data for updating the chemical
	updatedChemical := Chemical{
		Name:           "Updated Chemical",
		CAS:            789012,
		School:         "Updated School",
		PurchaseDate:   "2024-01-01",
		ExpirationDate: "2026-01-01",
		Status:         "Inactive",
		Quantity:       "5",
		Room:           "102",
		Cabinet:        2,
		Shelf:          2,
	}

	jsonValue, _ := json.Marshal(updatedChemical)
	req := httptest.NewRequest(http.MethodPut, "/api/v1/chemicals/"+docRef.ID, bytes.NewReader(jsonValue))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Chemical updated successfully")
}

// Test DeleteChemical
func TestDeleteChemical(t *testing.T) {

	// Adding a mock chemical for testing
	chemical := Chemical{
		Name:           "Test Chemical",
		CAS:            123456,
		School:         "Test School",
		PurchaseDate:   "2023-03-01",
		ExpirationDate: "2025-03-01",
		Status:         "Active",
		Quantity:       "10",
		Room:           "101",
		Cabinet:        1,
		Shelf:          1,
	}

	ctx := context.Background()
	// add a chemical to test delete
	docRef, _, err := client.Collection("chemicals").Add(ctx, map[string]interface{}{
		"name":            chemical.Name,
		"CAS":             chemical.CAS,
		"school":          chemical.School,
		"purchase_date":   chemical.PurchaseDate,
		"expiration_date": chemical.ExpirationDate,
		"status":          chemical.Status,
		"quantity":        chemical.Quantity,
		"room":            chemical.Room,
		"cabinet":         chemical.Cabinet,
		"shelf":           chemical.Shelf,
	})
	if err != nil {
		t.Fatalf("Failed to add mock chemical: %v", err)
	}

	req := httptest.NewRequest(http.MethodDelete, "/api/v1/chemicals/"+docRef.ID, nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Chemical deleted successfully")
}
