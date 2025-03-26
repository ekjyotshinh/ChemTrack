package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/ekjyotshinh/ChemTrack/backend/helpers"
)

type SendEmailRequest struct {
	To      string `json:"to" binding:"required,email"`
	Subject string `json:"subject" binding:"required"`
	Body    string `json:"body" binding:"required"`
}

func SendEmail(c *gin.Context) {
	var req SendEmailRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := helpers.SendEmailHelper(req.To, req.Subject, req.Body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to send email",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
