package controllers

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/go-pdf/fpdf"
)

// AddLabel godoc
// @Summary Create a PDF label with a QR code and text
// @Description Creates a PDF label with a QR code (retrieved via the QR code API) and chemical name, then uploads it to Google Cloud Storage under the "label" folder
// @Tags Label
// @Produce json
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /label/{chemicalIdNumber} [post]
func AddLabel(c *gin.Context) {
	ctx := context.Background()

	// Initialize Google Cloud Storage client
	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize storage client"})
		return
	}
	defer storageClient.Close()

	// Firestore stuff
	chemicalIdNumber := c.Param("chemicalIdNumber")
	doc, err := client.Collection("chemicals").Doc(chemicalIdNumber).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chemical not found"})
		return
	}
	chemID := doc.Ref.ID

	// Fetch the QR code using the new QR code API
	qrCodeURL := fmt.Sprintf("http://localhost:8080/api/v1/files/qrcode/%s", chemID) // Replace with the actual API URL
	resp, err := http.Get(qrCodeURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch QR code from API"})
		return
	}
	defer resp.Body.Close()

	// Read the QR code image from the API response
	var qrCodeBuffer bytes.Buffer
	if _, err := io.Copy(&qrCodeBuffer, resp.Body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read QR code from API response"})
		return
	}

	// PDF dimensions
	width := 4 * 25.4  // 101.6 mm
	height := 2 * 25.4 // 50.8 mm

	// Create the PDF
	pdf := fpdf.NewCustom(&fpdf.InitType{
		Size: fpdf.SizeType{Wd: width, Ht: height},
	})
	pdf.AddPage()

	// Layout
	margin := 10.0               // Margin from edges in mm
	imgWidth := width/2 - margin // Half width minus margin
	imgHeight := 40.0            // Set image height
	imgY := (height - imgHeight) / 2

	// QR code
	imgOptions := fpdf.ImageOptions{ImageType: "png", ReadDpi: true}
	pdf.RegisterImageOptionsReader("qrcode", imgOptions, &qrCodeBuffer)

	// Place the QR code on the label
	pdf.ImageOptions("qrcode", margin, imgY, imgWidth, 0, false, imgOptions, 0, "")

	// Chemical name
	textX := width/2 + margin
	textY := height / 2 // Center vertically
	pdf.SetFont("Arial", "B", 14)
	pdf.Text(textX, textY-5, chemID)

	// Generate the PDF
	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
		return
	}

	// Upload the PDF to cloud storage
	bucketName := "chemtrack-testing2"
	labelObject := storageClient.Bucket(bucketName).Object("label/" + chemID + ".pdf")
	writer := labelObject.NewWriter(ctx)
	if _, err := io.Copy(writer, &buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload PDF to cloud storage"})
		return
	}
	if err := writer.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close PDF writer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Label created and uploaded successfully",
		"file":    "label/" + chemID + ".pdf",
	})
}

// GetLabel godoc
// @Summary Retrieve a label PDF
// @Description Fetches a label PDF from Google Cloud Storage for a given chemical ID
// @Tags Label
// @Produce application/pdf
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Success 200 {file} file "Label PDF"
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /label/{chemicalIdNumber} [get]
func GetLabel(c *gin.Context) {
	ctx := context.Background()

	// Get the chemicalIdNumber from the request parameter
	chemicalIdNumber := c.Param("chemicalIdNumber")

	// Define the bucket and object name
	bucketName := "chemtrack-testing2" // Replace with your bucket name
	objectName := "label/" + chemicalIdNumber + ".pdf"

	// Create a new storage client
	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create storage client"})
		return
	}
	defer storageClient.Close()

	// Get the object from the bucket
	labelObject := storageClient.Bucket(bucketName).Object(objectName)
	reader, err := labelObject.NewReader(ctx)
	if err != nil {
		if err == storage.ErrObjectNotExist {
			c.JSON(http.StatusNotFound, gin.H{"error": "Label not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch label from cloud storage"})
		}
		return
	}
	defer reader.Close()

	// Set the content type to application/pdf and stream the label back to the client
	c.Header("Content-Type", "application/pdf")
	c.Status(http.StatusOK)
	if _, err := io.Copy(c.Writer, reader); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream label PDF"})
		return
	}
}

// DeleteLabel godoc
// @Summary Delete a label PDF
// @Description Deletes a label PDF from Google Cloud Storage for a given chemical ID
// @Tags Label
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /label/{chemicalIdNumber} [delete]
func DeleteLabel(c *gin.Context) {
	ctx := context.Background()

	// Get the chemicalIdNumber from the request parameter
	chemicalIdNumber := c.Param("chemicalIdNumber")

	// Define the bucket and object name
	bucketName := "chemtrack-testing2" // Replace with your bucket name
	objectName := "label/" + chemicalIdNumber + ".pdf"

	// Create a new storage client
	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create storage client"})
		return
	}
	defer storageClient.Close()

	// Get the object from the bucket
	labelObject := storageClient.Bucket(bucketName).Object(objectName)

	// Attempt to delete the object
	err = labelObject.Delete(ctx)
	if err != nil {
		if err == storage.ErrObjectNotExist {
			c.JSON(http.StatusNotFound, gin.H{"error": "Label not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete label from cloud storage"})
		}
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"message": "Label deleted successfully",
	})
}
