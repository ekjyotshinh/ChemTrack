package controllers

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"

	//"encoding/json"
	//"fmt"
	//"net/http"
	"cloud.google.com/go/storage"
	"github.com/ekjyotshinh/ChemTrack/backend/helpers"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
)

// GenerateQRCode generates a QR code for a chemical
func GenerateQRCode(chemicalIdNumber string) {
	ctx := context.Background()

	// more of a check to verify the chemical exists
	doc, err := client.Collection("chemicals").Doc(chemicalIdNumber).Get(ctx)

	if err != nil {
		//c.JSON(http.StatusNotFound, gin.H{"error": "Chemical not found"})
		fmt.Println("Chemical not found")
		return
	}

	// Get the chemical ID | seems redundant but we need to so the Document check above doesnt throw an cry errors
	chemID := doc.Ref.ID

	filepath := `qrcodes/` + chemID + `.png` // creating a filepath for the qr code to be saved to based on their id
	// Generate the QR code
	err = qrcode.WriteFile(chemID, qrcode.Medium, 256, filepath)
	if err != nil {
		//c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate QR code"})
		fmt.Println("Failed to generate QR code")
		return
	}

	// Upload the QR code to Google Cloud Storage
	bucketName := "chemtrack-deployment"
	objectName := "QRcodes/" + chemID + ".png"

	err = helpers.UploadFileToGCS(ctx, bucketName, objectName, filepath)
	if err != nil {
		fmt.Println("Failed to upload QR code to Google Cloud Storage")
		return
	}

	// Delete the QR code file
	deletePath := `qrcodes/` + chemID + `.png`
	fileDelete := os.Remove(deletePath)
	if fileDelete != nil {
		fmt.Println("Failed to delete QR code file")
		return
	}

}

// GetQRCode godoc
// @Summary Retrieve a QR code
// @Description Fetches a QR code image from Google Cloud Storage for a given chemical ID
// @Tags QRCode
// @Produce image/png
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Success 200 {file} file "QR Code Image"
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /qrcode/{chemicalIdNumber} [get]
func GetQRCode(c *gin.Context) {
	ctx := context.Background()

	// Get the chemicalIdNumber from the request parameter
	chemicalIdNumber := c.Param("chemicalIdNumber")

	// Define the bucket and object name
	bucketName := "chemtrack-deployment" // Replace with your bucket name
	objectName := "QRcodes/" + chemicalIdNumber + ".png"

	// Create a new storage client
	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create storage client"})
		return
	}
	defer storageClient.Close()

	// Get the object from the bucket
	qrObject := storageClient.Bucket(bucketName).Object(objectName)
	reader, err := qrObject.NewReader(ctx)
	if err != nil {
		if err == storage.ErrObjectNotExist {
			c.JSON(http.StatusNotFound, gin.H{"error": "QR code not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch QR code from cloud storage"})
		}
		return
	}
	defer reader.Close()

	// Set the content type to image/png and stream the QR code back to the client
	c.Header("Content-Type", "image/png")
	c.Status(http.StatusOK)
	if _, err := io.Copy(c.Writer, reader); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream QR code"})
		return
	}
}

// GetQRCodeURL godoc
// @Summary Get the QR Code Image URL
// @Description Retrieves the QR Code Image URL for a given chemical ID
// @Tags QR
// @Produce json
// @Param chemicalIdNumber path string true "Chemical ID Number"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /qrcode/{chemicalIdNumber} [get]
func GetQRCodeURL(c *gin.Context) {
	chemicalIdNumber := c.Param("chemicalIdNumber")

	bucketName := "chemtrack-deployment"
	objectName := "QRcodes/" + chemicalIdNumber + ".png"

	doesQRExist := helpers.DoesFileExistGCS(context.Background(), bucketName, objectName)

	// Empty string if QR code does not exist, otherwise the URL to the QR code
	// Example URL: https://storage.googleapis.com/chemtrack-deployment/QRcodes/12345.png
	QRCodeURL := ""

	if doesQRExist {
		QRCodeURL = fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, objectName)
	}

	// Respond with the QR Code URL
	c.JSON(http.StatusOK, gin.H{
		"chemicalQRURL": QRCodeURL,
	})
}
