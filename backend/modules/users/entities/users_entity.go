package entities

import "time"

type UserProfile struct {
	ID          int       `json:"id"`
	FullName    string    `json:"full_name"`
	LastName    string    `json:"last_name"`
	PhotoURL    string    `json:"photo_url"`
	PhoneNumber string    `json:"phone_number"`
	Email       string    `json:"email"`
	Address     string    `json:"address"`
	Skills      []string  `json:"skills"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// UpdateContactRequest contains contact info (full_name and last_name are strictly read-only)
type UpdateContactRequest struct {
	PhoneNumber string `json:"phone_number"`
	Email       string `json:"email"`
	Address     string `json:"address"`
}

// UpdateSkillsRequest contains selected skills list
type UpdateSkillsRequest struct {
	Skills []string `json:"skills"`
}

// ProfileHistory tracks profile change logs
type ProfileHistory struct {
	ID           int       `json:"id"`
	UserID       int       `json:"user_id"`
	FieldChanged string    `json:"field_changed"`
	OldValue     string    `json:"old_value"`
	NewValue     string    `json:"new_value"`
	CreatedAt    time.Time `json:"created_at"`
}
