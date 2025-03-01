package controllers

import (
	"context"
	"strings"

	"github.com/ekjyotshinh/ChemTrack/backend/helpers"

	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

// AddSDS godoc
// @Summary Add a new SDS file
// @Description Uploads a new SDS file to Google Cloud Storage and updates the Firestore document with the SDS URL
// @Tags SDS
// @Accept multipart/form-data
// @Produce json
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Param sds formData file true "SDS File"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /sds/{chemicalIdNumber} [post]
func AddSDS(c *gin.Context) {
	ctx := context.Background()

	// Get chemicalIdNumber from the request parameter
	chemicalIdNumber := c.Param("chemicalIdNumber")

	// Check if the chemical exists in Firestore
	doc, err := client.Collection("chemicals").Doc(chemicalIdNumber).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chemical not found"})
		return
	}

	chemID := doc.Ref.ID // Retrieve the actual document ID

	// Get the file from the request
	file, err := c.FormFile("sds")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve file"})
		return
	}

	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	// Define GCS bucket and object name
	bucketName := "chemtrack-testing"
	objectName := "sds/" + chemID + ".pdf"

	// Upload the file directly from memory
	uploadURL, err := helpers.UploadFileToGCSFromReader(ctx, bucketName, objectName, src)
	if err != nil {
		log.Println("Failed to upload SDS to Google Cloud Storage:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload SDS"})
		return
	}

	// Update Firestore document with the SDS URL
	_, err = client.Collection("chemicals").Doc(chemID).Update(ctx, []firestore.Update{
		{Path: "sdsURL", Value: uploadURL},
	})
	if err != nil {
		log.Println("Failed to update Firestore:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update chemical record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "SDS uploaded successfully",
		"url":     uploadURL,
	})
}

// GetSDS godoc
// @Summary Get the SDS file URL
// @Description Retrieves the SDS file URL for a given chemical
// @Tags SDS
// @Produce json
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /sds/{chemicalIdNumber} [get]
func GetSDS(c *gin.Context) {
	ctx := context.Background()
	chemicalIdNumber := c.Param("chemicalIdNumber")

	// Fetch the document from Firestore
	doc, err := client.Collection("chemicals").Doc(chemicalIdNumber).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chemical not found"})
		return
	}

	// Extract the SDS URL from the document
	sdsURL, exists := doc.Data()["sdsURL"]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "SDS file not found for this chemical"})
		return
	}

	// Respond with the SDS URL
	c.JSON(http.StatusOK, gin.H{
		"chemicalIdNumber": chemicalIdNumber,
		"sdsURL":           sdsURL,
	})
}

// DeleteSDS godoc
// @Summary Delete the SDS file
// @Description Deletes the SDS file from Google Cloud Storage and removes the SDS URL from the Firestore document
// @Tags SDS
// @Produce json
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /sds/{chemicalIdNumber} [delete]
func DeleteSDS(c *gin.Context) {
	ctx := context.Background()
	chemicalIdNumber := c.Param("chemicalIdNumber")

	// Fetch the document from Firestore
	doc, err := client.Collection("chemicals").Doc(chemicalIdNumber).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chemical not found"})
		return
	}

	// Extract the SDS URL from Firestore
	sdsURL, exists := doc.Data()["sdsURL"]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "SDS file not found for this chemical"})
		return
	}

	// Convert sdsURL to string
	sdsURLStr, ok := sdsURL.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid SDS URL format"})
		return
	}

	// Extract the object name from the URL
	// Example URL: https://storage.googleapis.com/chemtrack-testing/sds/12345.pdf
	objectName := sdsURLStr[strings.LastIndex(sdsURLStr, "sds/"):]

	// Delete the file from Google Cloud Storage
	bucketName := "chemtrack-testing"
	err = helpers.DeleteFileFromGCS(ctx, bucketName, objectName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete SDS file from GCS"})
		return
	}

	// Remove the SDS URL from Firestore
	_, err = client.Collection("chemicals").Doc(chemicalIdNumber).Update(ctx, []firestore.Update{
		{Path: "sdsURL", Value: nil}, // Remove the SDS URL
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Firestore record"})
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"message": "SDS file deleted successfully",
	})
}
