package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"


	"github.com/stretchr/testify/assert"
)




func TestSendEmail(t *testing.T) {

	// Create request body
	emailRequest := map[string]interface{}{
		"body":    "This is a test email.",
		"subject": "Test Subject",
		"to":      "eshinh@csus.edu",
	}

	jsonValue, _ := json.Marshal(emailRequest)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/email/send", bytes.NewReader(jsonValue))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Assertions
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Email sent successfully")
}
