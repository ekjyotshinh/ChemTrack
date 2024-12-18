package helpers

import (
	"context"
	"google.golang.org/api/option"


	"os"
	"io"
	"cloud.google.com/go/storage"
)


// uploadFileToGCS uploads a file to Google Cloud Storage
func uploadFileToGCS(ctx context.Context, bucketName, objectName, filePath string) error {
	client, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return err
	}
	defer client.Close()

	bucket := client.Bucket(bucketName)
	object := bucket.Object(objectName)
	writer := object.NewWriter(ctx)
	defer writer.Close()

	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	if _, err := io.Copy(writer, file); err != nil {
		return err
	}

	return nil
}