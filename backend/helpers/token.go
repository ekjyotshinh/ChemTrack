package helpers  

import (  
    "crypto/rand"  
    "encoding/hex"  
)  

func GenerateToken() (string, error) {  
    bytes := make([]byte, 32)  
    _, err := rand.Read(bytes)  
    if err != nil {  
        return "", err  
    }  
    return hex.EncodeToString(bytes), nil  
}  