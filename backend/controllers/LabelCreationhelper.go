package controllers

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/go-pdf/fpdf"
)

// AddLabel godoc
// @Summary Create a PDF label with a QR code and text
// @Description Creates a PDF label with a QR code (retrieved from cloud storage) and chemical name, then uploads it to Google Cloud Storage under the "label" folder
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

	// firestore stuff
	chemicalIdNumber := c.Param("chemicalIdNumber")
	doc, err := client.Collection("chemicals").Doc(chemicalIdNumber).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chemical not found"})
		return
	}
	chemID := doc.Ref.ID
	Chemname, ok := doc.Data()["name"].(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve chemical name"})
		return
	}

	
	storageClient, err := storage.NewClient(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create storage client"})
		return
	}
	defer storageClient.Close()

	bucketName := "chemtrack-testing2"

	// getting the qr code from cloud storage
	qrObject := storageClient.Bucket(bucketName).Object("qrcodes/" + chemID + ".png")
	qrReader, err := qrObject.NewReader(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch QR code image from cloud storage"})
		return
	}
	defer qrReader.Close()

	// pdf dimensions
	width := 4 * 25.4  // 101.6 mm
	height := 2 * 25.4 // 50.8 mm

	// creatioonnn!
	pdf := fpdf.NewCustom(&fpdf.InitType{
		Size: fpdf.SizeType{Wd: width, Ht: height},
	})
	pdf.AddPage()

	// layoout 
	margin := 10.0               // margin from edges in mm
	imgWidth := width/2 - margin // half width minus margin
	imgHeight := 40.0            // set image height
	imgY := (height - imgHeight) / 2

	// qr code
	imgOptions := fpdf.ImageOptions{ImageType: "png", ReadDpi: true}
	pdf.RegisterImageOptionsReader("qrcode", imgOptions, qrReader)

	// place it on the label
	pdf.ImageOptions("qrcode", margin, imgY, imgWidth, 0, false, imgOptions, 0, "")

	// chemical name
	textX := width/2 + margin
	textY := height / 2 // Center vertically
	pdf.SetFont("Arial", "B", 14)
	pdf.Text(textX, textY-5, Chemname)

	//make the pdf
	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
		return
	}

	// in case it takes too long
	ctx, cancel := context.WithTimeout(ctx, time.Second*50)
	defer cancel()

	// upload the pdf to cloud storage
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
