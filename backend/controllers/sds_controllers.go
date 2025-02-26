package controllers

import (
"context"
"fmt"
"os"


"github.com/ekjyotshinh/ChemTrack/backend/helpers"
)

func AddSDS(chemicalIdNumber string, pdfName string) {
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

	filepath := `sds/` + pdfName + `.pdf` // creating a filepath for the sds to be saved to based on their id


	// Upload the QR code to Google Cloud Storage
	bucketName := "chemtrack-testing"
	objectName := "sds/" + chemID + ".pdf"

	err = helpers.UploadFileToGCS(ctx, bucketName, objectName, filepath)
	if err != nil {
		fmt.Println("Failed to upload QR code to Google Cloud Storage")
		return
	}

	// Delete the sds file
	deletePath := `sds/` + chemID + `.pdf`
	fileDelete := os.Remove(deletePath)
	if fileDelete != nil {
		fmt.Println("Failed to delete QR code file")
		return
	}

}
