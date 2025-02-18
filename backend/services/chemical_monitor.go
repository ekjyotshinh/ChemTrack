package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"github.com/ekjyotshinh/ChemTrack/backend/helpers"
)

// Global Firestore client variable
var client *firestore.Client

// SetClient initializes Firestore client
func SetClient(c *firestore.Client) {
	client = c
}

// CheckCriticalChemicalStatus checks for chemicals with low stock or near expiration
func CheckCriticalChemicalStatus() {
	ctx := context.Background()

	if client == nil {
		log.Println("Firestore client is not initialized")
		return
	}

	now := time.Now()
	sixMonthsLater := now.AddDate(0, 6, 0)

	iter := client.Collection("chemicals").Documents(ctx)

	schoolMap := make(map[string][]map[string]interface{})

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Printf("Error fetching chemicals: %v", err)
			continue
		}

		data := doc.Data()

		CAS, ok1 := data["CAS"]
		school, ok2 := data["school"].(string)
		expField, ok3 := data["expiration_date"]
		quantity, ok4 := data["quantity"].(string)

		if !ok1 || !ok2 || !ok3 || !ok4 {
			log.Printf("Skipping invalid document: %v", data)
			continue
		}

		var expirationDate time.Time
		switch v := expField.(type) {
		case time.Time:
			expirationDate = v
		case string:
			var err error
			expirationDate, err = time.Parse("2006-01-02", v)
			if err != nil {
				continue
			}
		default:
			continue
		}

		chemicalData := map[string]interface{}{
			"CAS":             CAS,
			"expiration_date": expirationDate,
			"quantity":        quantity,
		}
		schoolMap[school] = append(schoolMap[school], chemicalData)
	}

	for school, chemicals := range schoolMap {
		var alertMessage string

		for _, chemical := range chemicals {
			expirationDate := chemical["expiration_date"].(time.Time)

			if chemical["quantity"] == "Low" {
				alertMessage += fmt.Sprintf(
					"🔴 LOW STOCK ALERT\n<br>"+
						"- CAS Number: %v\n<br>"+
						"- School: %s\n<br>"+
						"- Status: Low Stock\n\n<br><br>",
					chemical["CAS"], school,
				)
			}
			if expirationDate.Before(now) {
				alertMessage += fmt.Sprintf(
					"⚠️ EXPIRED CHEMICAL ALERT\n<br>"+
						"- CAS Number: %v\n<br>"+
						"- School: %s\n<br>"+
						"- Expiration Date: %s\n<br>"+
						"- Status: Expired \n\n<br><br>",
					chemical["CAS"], school, expirationDate.Format("2006-01-02"),
				)
			}
			if expirationDate.Before(sixMonthsLater) {
				alertMessage += fmt.Sprintf(
					"🟡 EXPIRATION WARNING\n<br>"+
						"- CAS Number: %v\n<br>"+
						"- School: %s\n<br>"+
						"- Expiration Date: %s\n<br>"+
						"- Status: Will Expire Soon \n\n<br><br>",
					chemical["CAS"], school, expirationDate.Format("2006-01-02"),
				)
			}
		}

		if alertMessage != "" {
			emails, err := GetAdminAndMasterEmails(school)
			if err != nil {
			    fmt.Println("Error fetching admin and master emails:", err)
			    return
			}

			if len(emails) > 0 {
				for _,email := range emails{
					fmt.Println(email)
					subject := fmt.Sprintf("Chemical Alert Report for %s", school)
					helpers.SendEmailHelper(email, subject, alertMessage)
				}
			}
		}
	}
}


func GetAdminAndMasterEmails(school string) ([]string, error) {
    ctx := context.Background()
    emailSet := make(map[string]struct{}) // Set to store unique emails

    // Query for users who are either admins for the school or masters user(in that case we just semd out the email irrespective of the)
    queries := []firestore.Query{
        client.Collection("users").Where("is_admin", "==", true).Where("school", "==", school),
        client.Collection("users").Where("is_master", "==", true),
    }

    for _, query := range queries {
        iter := query.Documents(ctx)
        for {
            doc, err := iter.Next()
            if err == iterator.Done {
                break
            }
            if err != nil {
                return nil, err
            }
            user := doc.Data()
			log.Printf(user["email"].(string))
            if email, ok := user["email"].(string); ok {
                emailSet[email] = struct{}{} 
            }
        }
    }

    // Convert map keys to a array
    emails := make([]string, 0, len(emailSet))
    for email := range emailSet {
        emails = append(emails, email)
    }

    return emails, nil
}
