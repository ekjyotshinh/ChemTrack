package controllers

import (
	"context"
	"strings"
	"time"
	"os"
	"fmt"

	"github.com/ekjyotshinh/ChemTrack/backend/helpers"

	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

// AddSDS godoc
// @Summary Add a new SDS file
// @Description Uploads a new SDS file to Google Cloud Storage and updates the Firestore document with the SDS URL- key is sds for file for data
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
	
	// Skip actual uploading SDS for test env
	if os.Getenv("ENVIRONMENT") == "test" {
		fmt.Println("Mock Adding SDS") 
		c.JSON(http.StatusOK, gin.H{
		"message": "SDS uploaded successfully",
		"url":     "testingURL",
		})
		return
	}

	// Define GCS bucket and object name
	bucketName := "chemtrack-deployment"
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

	// Skip actual uploading SDS for test env
	if os.Getenv("ENVIRONMENT") == "test" {
		fmt.Println("Mock Deleting SDS") 
		c.JSON(http.StatusOK, gin.H{
		"message": "SDS file deleted successfully",
		})
		return
	}

	// Extract the object name from the URL
	// Example URL: https://storage.googleapis.com/chemtrack-deployment/sds/12345.pdf
	objectName := sdsURLStr[strings.LastIndex(sdsURLStr, "sds/"):]

	// Delete the file from Google Cloud Storage
	bucketName := "chemtrack-deployment"
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

// AddProfilePicture godoc
// @Summary Add a new profile picture
// @Description Uploads a new profile picture to Google Cloud Storage and updates the Firestore document with the profile picture URL
// @Tags Profile
// @Accept multipart/form-data
// @Produce json
// @Param userId path string true "User ID"
// @Param profilePicture formData file true "Profile Picture"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /profile/{userId}/picture [post]
func AddProfilePicture(c *gin.Context) {
	ctx := context.Background()

	// Get userId from the request parameter
	userId := c.Param("userId")

	// Check if the user exists in Firestore
	doc, err := client.Collection("users").Doc(userId).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	userID := doc.Ref.ID // Retrieve the actual document ID

	// Get the file from the request
	file, err := c.FormFile("profilePicture")
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

	// Skip actual upload for the profile picture for test env
	if os.Getenv("ENVIRONMENT") == "test" {
		fmt.Println("Mock Adding Profile picture") 
			// Update Firestore document with the profile picture URL
		_, err = client.Collection("users").Doc(userID).Update(ctx, []firestore.Update{
			{Path: "profilePictureURL", Value: "testURL"},
		})
		if err != nil {
			log.Println("Failed to update Firestore:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user record"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
		"message": "Profile picture uploaded successfully",
		})
		return
	}

	// Define GCS bucket and object name
	bucketName := "chemtrack-deployment"
	objectName := "profile_pictures/" + userID + ".jpg"

	// Upload the file directly from memory
	uploadURL, err := helpers.UploadFileToGCSFromReader(ctx, bucketName, objectName, src)
	if err != nil {
		log.Println("Failed to upload profile picture to Google Cloud Storage:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload profile picture"})
		return
	}

	// Update Firestore document with the profile picture URL
	_, err = client.Collection("users").Doc(userID).Update(ctx, []firestore.Update{
		{Path: "profilePictureURL", Value: uploadURL},
	})
	if err != nil {
		log.Println("Failed to update Firestore:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile picture uploaded successfully",
		"url":     uploadURL,
	})
}

// UpdateProfilePicture godoc
// @Summary Update the profile picture
// @Description Updates the profile picture for a given user
// @Tags Profile
// @Accept multipart/form-data
// @Produce json
// @Param userId path string true "User ID"
// @Param profilePicture formData file true "Profile Picture"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /profile/{userId}/picture [put]
func UpdateProfilePicture(c *gin.Context) {
	ctx := context.Background()

	// Get userId from the request parameter
	userId := c.Param("userId")

	// Check if the user exists in Firestore
	doc, err := client.Collection("users").Doc(userId).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	userID := doc.Ref.ID // Retrieve the actual document ID

	// Get the file from the request
	file, err := c.FormFile("profilePicture")
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
	bucketName := "chemtrack-deployment"
	objectName := "profile_pictures/" + userID + ".jpg"

		// Skip actual upload for the profile picture for test env
	if os.Getenv("ENVIRONMENT") == "test" {
		fmt.Println("Mock Updating Profile picture") 
			// Update Firestore document with the profile picture URL
		_, err = client.Collection("users").Doc(userID).Update(ctx, []firestore.Update{
			{Path: "profilePictureURL", Value: "testURL"},
		})
		if err != nil {
			log.Println("Failed to update Firestore:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user record"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Profile picture updated successfully",
			"url":     "testURL",
		})
		return
	}

	// Upload the file directly from memory
	uploadURL, err := helpers.UploadFileToGCSFromReader(ctx, bucketName, objectName, src)
	if err != nil {
		log.Println("Failed to upload profile picture to Google Cloud Storage:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload profile picture"})
		return
	}

	// Append a timestamp to the URL to prevent caching
	// Ensures image is up to date in the frontend
	t := time.Now()
	uploadURL += "?t=" + t.Format("20060102150405")

	// Update Firestore document with the profile picture URL
	_, err = client.Collection("users").Doc(userID).Update(ctx, []firestore.Update{
		{Path: "profilePictureURL", Value: uploadURL},
	})
	if err != nil {
		log.Println("Failed to update Firestore:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile picture updated successfully",
		"url":     uploadURL,
	})
}

// DeleteProfilePicture godoc
// @Summary Delete the profile picture
// @Description Deletes the profile picture from Google Cloud Storage and removes the profile picture URL from the Firestore document
// @Tags Profile
// @Produce json
// @Param userId path string true "User ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /profile/{userId}/picture [delete]
func DeleteProfilePicture(c *gin.Context) {
	ctx := context.Background()
	userId := c.Param("userId")

	// Fetch the document from Firestore
	doc, err := client.Collection("users").Doc(userId).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Extract the profile picture URL from Firestore
	profilePictureURL, exists := doc.Data()["profilePictureURL"]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile picture not found for this user"})
		return
	}

	// Convert profilePictureURL to string
	profilePictureURLStr, ok := profilePictureURL.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid profile picture URL format"})
		return
	}


	// Skip actual delete for the profile picture for test env
	if os.Getenv("ENVIRONMENT") == "test" {
		fmt.Println("Mock Deleting Profile picture") 
		// Remove the profile picture URL from Firestore
		_, err = client.Collection("users").Doc(userId).Update(ctx, []firestore.Update{
			{Path: "profilePictureURL", Value: nil}, // Remove the profile picture URL
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Firestore record"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Profile picture deleted successfully",
		})
		return
	}

	// Extract the object name from the URL
	// Example URL: https://storage.googleapis.com/chemtrack-deployment/profile_pictures/12345.jpg
	objectName := profilePictureURLStr[strings.LastIndex(profilePictureURLStr, "profile_pictures/"):]
	objectName = strings.Split(objectName, "?t=")[0] // Remove the timestamp

	// Delete the file from Google Cloud Storage
	bucketName := "chemtrack-deployment"
	err = helpers.DeleteFileFromGCS(ctx, bucketName, objectName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete profile picture from GCS"})
		return
	}

	// Remove the profile picture URL from Firestore
	_, err = client.Collection("users").Doc(userId).Update(ctx, []firestore.Update{
		{Path: "profilePictureURL", Value: nil}, // Remove the profile picture URL
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Firestore record"})
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"message": "Profile picture deleted successfully",
	})
}

// GetProfilePicture godoc
// @Summary Get the profile picture URL
// @Description Retrieves the profile picture URL for a given user
// @Tags Profile
// @Produce json
// @Param userId path string true "User ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /profile/{userId}/picture [get]
func GetProfilePicture(c *gin.Context) {
	ctx := context.Background()
	userId := c.Param("userId")

	// Fetch the document from Firestore
	doc, err := client.Collection("users").Doc(userId).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Extract the profile picture URL from the document
	profilePictureURL, exists := doc.Data()["profilePictureURL"]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile picture not found for this user"})
		return
	}

	// Respond with the profile picture URL
	c.JSON(http.StatusOK, gin.H{
		"userId":            userId,
		"profilePictureURL": profilePictureURL,
	})
}
