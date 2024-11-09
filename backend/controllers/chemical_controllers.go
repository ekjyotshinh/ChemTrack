package controllers

import (
	"context"
	"net/http"
	"strconv"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"

	//"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/iterator"
)

// #TODO add the functionality of adding a PDF for sds @AggressiveGas
// #TODO Currently Dates are held as strings, should be changed to date objects @AggressiveGas
func AddChemical(c *gin.Context) {
	var chemical struct {
		Name           string `json:"name"`
		CAS            int    `json:"CAS"`
		School         string `json:"school"`
		PurchaseDate   string `json:"purchase_date"`
		ExpirationDate string `json:"expiration_date"`
		Status         string `json:"status"`
		Quantity       string `json:"quantity"`
		Room           string `json:"room"`
		Cabinet        int    `json:"cabinet"`
		Shelf          int    `json:"shelf"`
	}

	if err := c.ShouldBindJSON(&chemical); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Check the length of the CAS number
	casStr := strconv.Itoa(chemical.CAS)
	if len(casStr) < 5 || len(casStr) > 9 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CAS number must be between 5 and 9 digits"})
		return
	}

	ctx := context.Background()
	_, _, err := client.Collection("chemicals").Add(ctx, map[string]interface{}{
		"name":            chemical.Name,
		"CAS":             chemical.CAS,
		"school":          chemical.School,
		"purchase_date":   chemical.PurchaseDate,
		"expiration_date": chemical.ExpirationDate,
		"status":          chemical.Status,
		"quantity":        chemical.Quantity,
		"room":            chemical.Room,
		"cabinet":         chemical.Cabinet,
		"shelf":           chemical.Shelf,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add chemical"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Chemical added successfully"})
}

func GetChemical(c *gin.Context) {
	chemicalID := c.Param("id")
	ctx := context.Background()

	doc, err := client.Collection("chemicals").Doc(chemicalID).Get(ctx)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	chemical := doc.Data()
    chemical["id"] = doc.Ref.ID // Add the document ID to the chemical data

	c.JSON(http.StatusOK, chemical)
}

func GetChemicals(c *gin.Context) {
	ctx := context.Background()
	iter := client.Collection("chemicals").Documents(ctx)
	var chemicals []map[string]interface{}

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
			return
		}
		chemical := doc.Data()
        chemical["id"] = doc.Ref.ID // Add the document ID to the chemical data
        chemicals = append(chemicals, chemical)
	}

	c.JSON(http.StatusOK, chemicals)
}

func UpdateChemical(c *gin.Context) {
	chemicalID := c.Param("id")
	var chemical struct {
		Name           string `json:"name"`
		CAS            int    `json:"CAS"`
		School         string `json:"school"`
		PurchaseDate   string `json:"purchase_date"`
		ExpirationDate string `json:"expiration_date"`
		Status         string `json:"status"`
		Quantity       string `json:"quantity"`
		Room           string `json:"room"`
		Cabinet        int    `json:"cabinet"`
		Shelf          int    `json:"shelf"`
	}
	if err := c.ShouldBindJSON(&chemical); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	ctx := context.Background()
	_, err := client.Collection("chemicals").Doc(chemicalID).Set(ctx, map[string]interface{}{
		"name":            chemical.Name,
		"CAS":             chemical.CAS,
		"school":          chemical.School,
		"purchase_date":   chemical.PurchaseDate,
		"expiration_date": chemical.ExpirationDate,
		"status":          chemical.Status,
		"quantity":        chemical.Quantity,
		"room":            chemical.Room,
		"cabinet":         chemical.Cabinet,
		"shelf":           chemical.Shelf,
	}, firestore.MergeAll)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func DeleteChemical(c *gin.Context) {
	chemicalID := c.Param("id")
	ctx := context.Background()

	_, err := client.Collection("chemicals").Doc(chemicalID).Delete(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
