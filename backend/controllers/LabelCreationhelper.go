package controllers

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"strings"
	"os"

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
	chemicalId := c.Param("chemicalIdNumber")
	err := GenerateAndUploadLabel(chemicalId)
	if err != nil {
		status := http.StatusInternalServerError
		if strings.Contains(err.Error(), "not found") {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Label created and uploaded successfully",
		"file":    fmt.Sprintf("label/%s.pdf", chemicalId),
	})
}


func GenerateAndUploadLabel(chemicalId string) error {
	// Skip actual qr label generation and uploading if its test cases
	if os.Getenv("ENVIRONMENT") == "test" {
		fmt.Println("Mock creating QR Label while adding chemical")
		return nil
	}
	ctx := context.Background()

	// Initialize Google Cloud Storage client
	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("failed to init storage client: %w", err)
	}
	defer storageClient.Close()

	// Fetch the document to confirm existence
	doc, err := client.Collection("chemicals").Doc(chemicalId).Get(ctx)
	if err != nil {
		return fmt.Errorf("chemical not found: %w", err)
	}
	chemID := doc.Ref.ID


	// Fetch the QR code
	//TODO: update this 
	qrCodeURL := fmt.Sprintf("http://localhost:8080/api/v1/files/qrcode/%s", chemID)
	resp, err := http.Get(qrCodeURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to fetch QR code: %w", err)
	}
	defer resp.Body.Close()

	var qrCodeBuffer bytes.Buffer
	if _, err := io.Copy(&qrCodeBuffer, resp.Body); err != nil {
		return fmt.Errorf("failed to read QR code image: %w", err)
	}

	// Create the PDF
	width := 3 * 25.4
	height := 2 * 25.4
	pdf := fpdf.NewCustom(&fpdf.InitType{
		Size: fpdf.SizeType{Wd: width, Ht: height},
	})
	pdf.AddPage()

	imgOptions := fpdf.ImageOptions{ImageType: "png", ReadDpi: true}
	pdf.RegisterImageOptionsReader("qrcode", imgOptions, &qrCodeBuffer)

	imgWidth := 30.0
	imgHeight := 30.0
	imgX := (width - imgWidth) / 2
	imgY := 8.0
	pdf.ImageOptions("qrcode", imgX, imgY, imgWidth, imgHeight, false, imgOptions, 0, "")

	pdf.SetFont("Arial", "B", 12)
	text := chemID
	textWidth := pdf.GetStringWidth(text)
	textX := (width - textWidth) / 2
	textY := imgY + imgHeight + 8
	pdf.Text(textX, textY, text)

	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		return fmt.Errorf("failed to generate PDF: %w", err)
	}

	objectName := fmt.Sprintf("label/%s.pdf", chemID)
	writer := storageClient.Bucket("chemtrack-deployment").Object(objectName).NewWriter(ctx)
	if _, err := io.Copy(writer, &buf); err != nil {
		return fmt.Errorf("failed to upload PDF: %w", err)
	}
	if err := writer.Close(); err != nil {
		return fmt.Errorf("failed to close writer: %w", err)
	}

	return nil
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
	bucketName := "chemtrack-deployment" // Replace with your bucket name
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
	bucketName := "chemtrack-deployment"
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
