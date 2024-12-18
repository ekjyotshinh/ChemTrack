package controllers

import (
	"context"
	"fmt"
	"os"

	//"encoding/json"
	//"fmt"
	//"net/http"
	//"github.com/gin-gonic/gin" 
	"github.com/skip2/go-qrcode" 
	"github.com/ekjyotshinh/ChemTrack/backend/helpers"
	// #TODO : import the helper function for uploading to GCS @AggressiveGas

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
	bucketName := "chemtrack-testing"
	objectName := "QRcodes/" + chemID + ".png"

	err = uploadFileToGCS(ctx, bucketName, objectName, filepath)
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