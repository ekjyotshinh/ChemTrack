package controllers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// SendEmailRequest represents the structure of the email request
type SendEmailRequest struct {
	To      string `json:"to" binding:"required"`
	Subject string `json:"subject" binding:"required"`
	Body    string `json:"body" binding:"required"`
}

// SendEmail godoc
// @Summary Send an email
// @Description Send an email using Twilio SendGrid
// @Tags email
// @Accept json
// @Produce json
// @Param email body SendEmailRequest true "Email request data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/email/send [post]
func SendEmail(c *gin.Context) {
	var req SendEmailRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	from := mail.NewEmail("ChemTrack", "ekjyotshinh@gmail.com") // TODO: Change this to Chemtract one before deployment
	to := mail.NewEmail("Recipient", req.To)
	message := mail.NewSingleEmail(from, req.Subject, to, req.Body, req.Body)
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))

	response, err := client.Send(message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email", "details": err.Error()})
		return
	}

	if response.StatusCode >= 400 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SendGrid API error", "status_code": response.StatusCode})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
