package helpers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

const ExpoPushAPI = "https://exp.host/--/api/v2/push/send"

type PushNotification struct {
	To       string `json:"to"`
	Title    string `json:"title"`
	Body     string `json:"body"`
	Data     any    `json:"data,omitempty"`
	Sound    string `json:"sound,omitempty"`
	Priority string `json:"priority,omitempty"`
}

func SendPushNotification(deviceToken, title, body string) error {
	notification := PushNotification{
		To:       deviceToken,
		Title:    title,
		Body:     body,
		Sound:    "default",
		Priority: "high",
	}

	payload, err := json.Marshal([]PushNotification{notification})
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	req, err := http.NewRequest("POST", ExpoPushAPI, bytes.NewBuffer(payload))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to send notification, status: %s", resp.Status)
	}

	fmt.Println("Notification sent successfully!")
	return nil
}
