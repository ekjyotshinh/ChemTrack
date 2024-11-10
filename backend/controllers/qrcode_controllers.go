package controllers

import (	
"fmt"
//"context"
"net/http"
//"strconv"
//"cloud.google.com/go/firestore"
"github.com/gin-gonic/gin"
"github.com/skip2/go-qrcode"
)

func GenerateQRCode(c *gin.Context, text string) {

	//fileName := fmt.Sprintf("%s.png", text)

	var png []byte
	png, err := qrcode.Encode(text , qrcode.Medium, 256)

    //err := qrcode.WriteFile(text, qrcode.Medium, 256, fileName)
    if err != nil {
        fmt.Println("Error generating QR code")
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate QR code"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "QR code generated successfully", "qr_code": png})
}
