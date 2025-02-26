package controllers

import (
	"context"
	"github.com/go-pdf/fpdf"
	"fmt"
	//"github.com/ekjyotshinh/ChemTrack/backend/helpers"
)

// LabelCreationFunc creates a PDF label with a QR code and text
func LabelCreationFunc(chemicalIdNumber string) error {
	ctx := context.Background()

	// more of a check to verify the chemical exists
	doc, err := client.Collection("chemicals").Doc(chemicalIdNumber).Get(ctx)

	if err != nil {
		//c.JSON(http.StatusNotFound, gin.H{"error": "Chemical not found"})
		fmt.Println("Chemical not found")
		return err
	}

	// Get the chemical ID | seems redundant but we need to so the Document check above doesnt throw an cry errors
	chemID := doc.Ref.ID

	Chemname := doc.Data()["name"].(string)
	ChemSDS := doc.Data()["sds"].(string)

	filepath := `Label/` + chemID + `.pdf` // creating a filepath for the qr code to be saved to based on their id


	// Create a new PDF document
	    // Define page size in mm (2x4 inches, but swapped for landscape)
		width := 4 * 25.4  // 101.6mm (now the width)
		height := 2 * 25.4 // 50.8mm (now the height)
	
		pdf := fpdf.NewCustom(&fpdf.InitType{
			Size: fpdf.SizeType{Wd: width, Ht: height},
		})
	
		pdf.AddPage()
	
		// Define layout variables
		margin := 10.0      // Margin from edges
		imgWidth := width / 2 - margin // Half of the width minus margin
		imgHeight := 40.0  // Image height (adjust as needed)
		textX := width/2 + margin // Right side for text
	
		// Center the image vertically
		imgY := (height - imgHeight) / 2 
	
		// Add image on the left side
		pdf.ImageOptions("QRcodes_RDsHIBDwxRXqQwmxEN1O.png", margin, imgY, imgWidth, 0, false,
			fpdf.ImageOptions{ImageType: "png", ReadDpi: true}, 0, "")
	
		// Center text vertically on the right side
		textY := height / 2 // Midpoint of the page
	
		pdf.SetFont("Arial", "B", 14)
		pdf.Text(textX, textY-5, Chemname)
	
		pdf.SetFont("Arial", "", 12)
		pdf.Text(textX, textY+2, ChemSDS)
	
		// Save PDF
		err = pdf.OutputFileAndClose(filepath)
		if err != nil {
			panic(err)
		}
		return nil
}
