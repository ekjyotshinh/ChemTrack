package helpers

import (
	"os"
	"fmt"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)
// sendEmailHelper is a helper function to send an email 
func SendEmailHelper(to, subject, body string) error {
    from := mail.NewEmail("ChemTrack", "ekjyotshinh@gmail.com")
    toEmail := mail.NewEmail("Recipient", to)
    
    // Create HTML email
    // Plain text content first, then HTML content
    plainTextContent := "Please view this email in an HTML-compatible client."
    htmlContent := body
    message := mail.NewSingleEmail(from, subject, toEmail, plainTextContent, htmlContent)

    client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
    response, err := client.Send(message)
    if err != nil {
        return err
    }

    if response.StatusCode >= 400 {
        return fmt.Errorf("SendGrid API error, status_code: %d", response.StatusCode)
    }
    return nil
}