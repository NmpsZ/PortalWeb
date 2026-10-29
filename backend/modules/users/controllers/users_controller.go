package controllers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"portalweb/modules/users/entities"
	"portalweb/modules/users/usecases"
)

type UsersController struct {
	usecase usecases.IUsersUsecase
}

func NewUsersController(usecase usecases.IUsersUsecase) *UsersController {
	return &UsersController{usecase: usecase}
}

// writeErrorResponse returns a standard JSON error response to the client
func writeErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]any{
		"status":      "error",
		"status_code": statusCode,
		"message":     message,
	})
}

// GetProfile retrieves employee profile
func (c *UsersController) GetProfile(w http.ResponseWriter, r *http.Request) {
	log.Println("[API] GET  /api/profile - Fetching profile for user ID: 1")
	profile, err := c.usecase.GetProfile(1)
	if err != nil {
		log.Printf("[ERROR] GET  /api/profile - Failed: %v", err)
		writeErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// GetAvailableSkills retrieves all available skills from configuration
func (c *UsersController) GetAvailableSkills(w http.ResponseWriter, r *http.Request) {
	log.Println("[API] GET  /api/skills - Fetching available skills configuration")
	skills, err := c.usecase.GetAvailableSkills()
	if err != nil {
		log.Printf("[ERROR] GET  /api/skills - Failed: %v", err)
		writeErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(skills)
}

// UpdateContact updates contact information with validation
func (c *UsersController) UpdateContact(w http.ResponseWriter, r *http.Request) {
	var req entities.UpdateContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println("[WARN] PUT  /api/profile/contact - Failed to decode JSON body")
		writeErrorResponse(w, http.StatusBadRequest, "Invalid JSON request body")
		return
	}

	profile, err := c.usecase.UpdateContact(1, &req)
	if err != nil {
		log.Printf("[WARN] PUT  /api/profile/contact - Validation failed: %v", err)
		writeErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	log.Printf("[SUCCESS] PUT  /api/profile/contact - Contact updated (Phone: '%s', Email: '%s')", profile.PhoneNumber, profile.Email)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// UpdateSkills updates selected skills with whitelist validation
func (c *UsersController) UpdateSkills(w http.ResponseWriter, r *http.Request) {
	var req entities.UpdateSkillsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println("[WARN] PUT  /api/profile/skills - Failed to decode JSON body")
		writeErrorResponse(w, http.StatusBadRequest, "Invalid JSON request body")
		return
	}

	profile, err := c.usecase.UpdateSkills(1, req.Skills)
	if err != nil {
		log.Printf("[WARN] PUT  /api/profile/skills - Validation failed: %v", err)
		writeErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	log.Printf("[SUCCESS] PUT  /api/profile/skills - Skills updated: %v", profile.Skills)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// UploadPhoto uploads photo directly to database as Base64 Data URL with type and size checks
func (c *UsersController) UploadPhoto(w http.ResponseWriter, r *http.Request) {
	// 1. Limit multipart form size to 5MB
	const maxUploadSize = 5 << 20 // 5MB
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		log.Println("[WARN] POST /api/profile/photo - File exceeds 5MB limit")
		writeErrorResponse(w, http.StatusBadRequest, "File size exceeds 5MB limit")
		return
	}

	file, _, err := r.FormFile("photo")
	if err != nil {
		log.Println("[WARN] POST /api/profile/photo - Missing 'photo' field in form")
		writeErrorResponse(w, http.StatusBadRequest, "Missing 'photo' form field")
		return
	}
	defer file.Close()

	// 2. Read file bytes
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		log.Printf("[ERROR] POST /api/profile/photo - Failed to read bytes: %v", err)
		writeErrorResponse(w, http.StatusInternalServerError, "Failed to read uploaded file")
		return
	}

	if len(fileBytes) > maxUploadSize {
		log.Println("[WARN] POST /api/profile/photo - File exceeds 5MB limit")
		writeErrorResponse(w, http.StatusBadRequest, "File size exceeds 5MB limit")
		return
	}

	// 3. Verify magic bytes to prevent spoofed file extensions
	detectedMimeType := http.DetectContentType(fileBytes)
	allowedMimeTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
		"image/gif":  true,
	}

	if !allowedMimeTypes[detectedMimeType] {
		log.Printf("[WARN] POST /api/profile/photo - Unsupported image type: %s", detectedMimeType)
		writeErrorResponse(w, http.StatusBadRequest, fmt.Sprintf("Invalid image format: '%s' is not allowed (supported: JPEG, PNG, WEBP, GIF)", detectedMimeType))
		return
	}

	// 4. Convert to Base64 Data URL and store directly in database
	base64Photo := fmt.Sprintf("data:%s;base64,%s", detectedMimeType, base64.StdEncoding.EncodeToString(fileBytes))

	profile, err := c.usecase.UpdatePhoto(1, base64Photo)
	if err != nil {
		log.Printf("[ERROR] POST /api/profile/photo - Database update failed: %v", err)
		writeErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	log.Printf("[SUCCESS] POST /api/profile/photo - Photo saved to DB (%s, %d bytes)", detectedMimeType, len(fileBytes))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// GetHistory retrieves change history for the past X days
func (c *UsersController) GetHistory(w http.ResponseWriter, r *http.Request) {
	days := 7
	if dStr := r.URL.Query().Get("days"); dStr != "" {
		if d, err := strconv.Atoi(dStr); err == nil && d > 0 {
			days = d
		}
	}

	histories, err := c.usecase.GetHistory(1, days)
	if err != nil {
		log.Printf("[ERROR] GET  /api/profile/history - Failed: %v", err)
		writeErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	log.Printf("[API] GET  /api/profile/history?days=%d - Fetched %d change history records", days, len(histories))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(histories)
}
