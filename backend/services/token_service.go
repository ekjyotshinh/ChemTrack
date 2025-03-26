package services  

import (  
    "crypto/rand"  
    "encoding/base64"  
    "errors"  
    "time"  

    "github.com/ekjyotshinh/ChemTrack/backend/helpers"  
    "cloud.google.com/go/firestore" 
    "context"  
)  

type TokenService struct {  
    db *firestore.Client  
}  

// NewTokenService initializes a new TokenService with the provided Firestore client.  
func NewTokenService(db *firestore.Client) *TokenService {  
    return &TokenService{  
        db: db,  
    }  
}  

// GenerateToken creates a random token and returns it as a base64-encoded string.  
func (s *TokenService) GenerateToken() (string, error) {  
    tokenBytes := make([]byte, 32) 
    _, err := rand.Read(tokenBytes)  
    if err != nil {  
        return "", err  
    }  
    return base64.StdEncoding.EncodeToString(tokenBytes), nil  
}  

// StoreToken saves the token along with the user's email and expiration time to Firestore.  
func (s *TokenService) StoreToken(email, token string, expirationTime time.Time) error {  
    ctx := context.Background()  
    resetToken := models.PasswordResetToken{  
        Email:     email,  
        Token:     token,  
        ExpiresAt: expirationTime,  
    }  

    _, err := s.db.Collection("password_reset_tokens").Doc(token).Set(ctx, resetToken)  
    return err  
}  

// VerifyToken checks if the token exists and has not expired.  
func (s *TokenService) VerifyToken(token string) (bool, error) {  
    ctx := context.Background()  
    doc, err := s.db.Collection("password_reset_tokens").Doc(token).Get(ctx)  
    if err != nil {  
        return false, errors.New("token not found")  
    }  

    var resetToken models.PasswordResetToken  
    if err := doc.DataTo(&resetToken); err != nil {  
        return false, err  
    }  

    if time.Now().After(resetToken.ExpiresAt) {  
        return false, errors.New("token has expired")  
    }  

    return true, nil 
}  

// RemoveToken deletes the token from Firestore after it's used (e.g., after a successful password reset).  
func (s *TokenService) RemoveToken(token string) error {  
    ctx := context.Background()  
    _, err := s.db.Collection("password_reset_tokens").Doc(token).Delete(ctx)  
    return err  
}  