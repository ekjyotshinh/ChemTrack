# Step 1: Build the Go binary
FROM golang:1.23 AS builder

WORKDIR /app
COPY . .


# Install dependencies 
RUN go mod tidy

# Build the Go binary 
RUN go build -o server .

# Create a smaller image for running the binary
FROM gcr.io/distroless/base

# Copy the built binary from the builder image
COPY --from=builder /app/server /server

# Set the environment variable for Cloud Run (port 8080)
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Command to run the binary
CMD ["/server"]
