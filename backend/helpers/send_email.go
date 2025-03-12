package helpers

import (
	"fmt"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// sendEmailHelper is a helper function to send an email
func SendEmailHelper(to, subject, body string) error {
	from := mail.NewEmail("ChemTrack", "ekjyotshinh@gmail.com") // TODO: Change this to Chemtrack email before deployment
	toEmail := mail.NewEmail("Recipient", to)
	message := mail.NewSingleEmail(from, subject, toEmail, body, body)

	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
	response, err := client.Send(message)

	// Log errors properly
	if err != nil {
		fmt.Println("SendGrid request error:", err)
		return err
	}

	if response.StatusCode >= 400 {
		fmt.Printf("SendGrid API error: status_code=%d, body=%s\n", response.StatusCode, response.Body)
		return fmt.Errorf("SendGrid API error, status_code: %d", response.StatusCode)
	}

	return nil
}
