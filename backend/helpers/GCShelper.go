package helpers

import (
	"context"
	"fmt"

	"google.golang.org/api/option"

	"io"
	"os"

	"cloud.google.com/go/storage"
)

// UploadFileToGCSFromReader uploads a file directly to Google Cloud Storage from an io.Reader.
func UploadFileToGCSFromReader(ctx context.Context, bucketName, objectName string, file io.Reader) (string, error) {
	client, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return "", fmt.Errorf("failed to create storage client: %w", err)
	}
	defer client.Close()

	// Define the bucket and object
	bucket := client.Bucket(bucketName)
	obj := bucket.Object(objectName)

	// Create a new writer for uploading the file
	wc := obj.NewWriter(ctx)
	defer wc.Close()

	// Copy file data from io.Reader to GCS
	if _, err = io.Copy(wc, file); err != nil {
		return "", fmt.Errorf("failed to copy file to GCS: %w", err)
	}

	// Construct the public URL for accessing the file
	publicURL := fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, objectName)

	return publicURL, nil
}

// @TODO: Replace THIS function with the one above, so we can get rid of the folders. @AggressiveGas
// uploadFileToGCS uploads a file to Google Cloud Storage
func UploadFileToGCS(ctx context.Context, bucketName, objectName, filePath string) error {
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

// deleteFileFromGCS deletes a file from Google Cloud Storage
func DeleteFileFromGCS(ctx context.Context, bucketName, objectName string) error {
	client, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return err
	}
	defer client.Close()

	bucket := client.Bucket(bucketName)
	object := bucket.Object(objectName)

	if err := object.Delete(ctx); err != nil {
		return err
	}

	return nil
}

// DoesFileExistGCS checks if a file exists in Google Cloud Storage, returning true if it does, false otherwise
func DoesFileExistGCS(ctx context.Context, bucketName, objectName string) bool {
	client, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return false
	}
	defer client.Close()

	bucket := client.Bucket(bucketName)
	object := bucket.Object(objectName)

	// Check if the object exists
	_, err = object.Attrs(ctx)
	if err != nil {
		if err == storage.ErrObjectNotExist {
			return false
		}
		return false
	}

	return true
}
