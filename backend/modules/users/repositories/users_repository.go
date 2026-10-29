package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"portalweb/modules/users/entities"
	"strings"
)

type IUsersRepository interface {
	GetProfile(userID int) (*entities.UserProfile, error)
	GetAvailableSkills() ([]string, error)
	UpdateContact(userID int, req *entities.UpdateContactRequest) (*entities.UserProfile, error)
	UpdateSkills(userID int, skills []string) (*entities.UserProfile, error)
	UpdatePhoto(userID int, photoURL string) (*entities.UserProfile, error)
	GetHistory(userID int, days int) ([]entities.ProfileHistory, error)
}

type usersRepository struct {
	db *sql.DB
}

func NewUsersRepository(db *sql.DB) IUsersRepository {
	return &usersRepository{db: db}
}

// GetProfile retrieves user profile by ID
func (r *usersRepository) GetProfile(userID int) (*entities.UserProfile, error) {
	query := `
		SELECT id, full_name, last_name, photo_url, phone_number, email, address, 
		       COALESCE(array_to_json(skills)::text, '[]'), created_at, updated_at 
		FROM users 
		WHERE id = $1
	`

	var p entities.UserProfile
	var skillsJSON string

	err := r.db.QueryRow(query, userID).Scan(
		&p.ID,
		&p.FullName,
		&p.LastName,
		&p.PhotoURL,
		&p.PhoneNumber,
		&p.Email,
		&p.Address,
		&skillsJSON,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	_ = json.Unmarshal([]byte(skillsJSON), &p.Skills)
	return &p, nil
}

// GetAvailableSkills retrieves all skills list from configuration
func (r *usersRepository) GetAvailableSkills() ([]string, error) {
	rows, err := r.db.Query(`SELECT name FROM skills ORDER BY id ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var skills []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err == nil {
			skills = append(skills, name)
		}
	}
	return skills, nil
}

// UpdateContact updates contact information and records change history
func (r *usersRepository) UpdateContact(userID int, req *entities.UpdateContactRequest) (*entities.UserProfile, error) {
	// 1. Fetch previous values to detect changes
	var oldPhone, oldEmail, oldAddress string
	err := r.db.QueryRow("SELECT phone_number, email, address FROM users WHERE id = $1", userID).Scan(&oldPhone, &oldEmail, &oldAddress)
	if err != nil {
		return nil, err
	}

	// 2. Record history for changed fields
	if oldPhone != req.PhoneNumber {
		r.recordHistory(userID, "phone_number", oldPhone, req.PhoneNumber)
	}
	if oldEmail != req.Email {
		r.recordHistory(userID, "email", oldEmail, req.Email)
	}
	if oldAddress != req.Address {
		r.recordHistory(userID, "address", oldAddress, req.Address)
	}

	// 3. Update users table
	_, err = r.db.Exec(`
		UPDATE users 
		SET phone_number = $1, email = $2, address = $3, updated_at = NOW() 
		WHERE id = $4
	`, req.PhoneNumber, req.Email, req.Address, userID)
	if err != nil {
		return nil, err
	}

	return r.GetProfile(userID)
}

// UpdateSkills updates selected skills and records change history
func (r *usersRepository) UpdateSkills(userID int, newSkills []string) (*entities.UserProfile, error) {
	// 1. Fetch previous skills
	var oldSkillsJSON string
	err := r.db.QueryRow("SELECT COALESCE(array_to_json(skills)::text, '[]') FROM users WHERE id = $1", userID).Scan(&oldSkillsJSON)
	if err != nil {
		return nil, err
	}

	var oldSkills []string
	_ = json.Unmarshal([]byte(oldSkillsJSON), &oldSkills)

	oldStr := strings.Join(oldSkills, ", ")
	newStr := strings.Join(newSkills, ", ")
	if oldStr != newStr {
		r.recordHistory(userID, "skills", oldStr, newStr)
	}

	// 2. Update skills array in users table
	_, err = r.db.Exec("UPDATE users SET skills = $1, updated_at = NOW() WHERE id = $2", newSkills, userID)
	if err != nil {
		return nil, err
	}

	return r.GetProfile(userID)
}

// UpdatePhoto updates profile photo and records change history
func (r *usersRepository) UpdatePhoto(userID int, newPhotoURL string) (*entities.UserProfile, error) {
	var oldPhoto string
	err := r.db.QueryRow("SELECT photo_url FROM users WHERE id = $1", userID).Scan(&oldPhoto)
	if err != nil {
		return nil, err
	}

	if oldPhoto != newPhotoURL {
		r.recordHistory(userID, "photo_url", oldPhoto, newPhotoURL)
	}

	_, err = r.db.Exec("UPDATE users SET photo_url = $1, updated_at = NOW() WHERE id = $2", newPhotoURL, userID)
	if err != nil {
		return nil, err
	}

	return r.GetProfile(userID)
}

// GetHistory retrieves change history within the specified days (e.g. past 7 days)
func (r *usersRepository) GetHistory(userID int, days int) ([]entities.ProfileHistory, error) {
	query := fmt.Sprintf(`
		SELECT id, user_id, field_changed, old_value, new_value, created_at 
		FROM profile_histories 
		WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '%d days' 
		ORDER BY created_at DESC
	`, days)

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	histories := make([]entities.ProfileHistory, 0)
	for rows.Next() {
		var h entities.ProfileHistory
		if err := rows.Scan(&h.ID, &h.UserID, &h.FieldChanged, &h.OldValue, &h.NewValue, &h.CreatedAt); err == nil {
			histories = append(histories, h)
		}
	}
	return histories, nil
}

// recordHistory inserts a change history entry into profile_histories table
func (r *usersRepository) recordHistory(userID int, field, oldVal, newVal string) {
	_, _ = r.db.Exec(`
		INSERT INTO profile_histories (user_id, field_changed, old_value, new_value, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`, userID, field, oldVal, newVal)
}
