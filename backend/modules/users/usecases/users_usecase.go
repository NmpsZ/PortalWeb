package usecases

import (
	"errors"
	"fmt"
	"net/mail"
	"regexp"
	"strings"

	"portalweb/modules/users/entities"
	"portalweb/modules/users/repositories"
)

// phoneRegex validates allowed characters: numbers, +, -, spaces, and brackets (8-20 characters)
var phoneRegex = regexp.MustCompile(`^[0-9+\-\s()]{8,20}$`)

type IUsersUsecase interface {
	GetProfile(userID int) (*entities.UserProfile, error)
	GetAvailableSkills() ([]string, error)
	UpdateContact(userID int, req *entities.UpdateContactRequest) (*entities.UserProfile, error)
	UpdateSkills(userID int, skills []string) (*entities.UserProfile, error)
	UpdatePhoto(userID int, photoURL string) (*entities.UserProfile, error)
	GetHistory(userID int, days int) ([]entities.ProfileHistory, error)
}

type usersUsecase struct {
	repo repositories.IUsersRepository
}

func NewUsersUsecase(repo repositories.IUsersRepository) IUsersUsecase {
	return &usersUsecase{repo: repo}
}

func (u *usersUsecase) GetProfile(userID int) (*entities.UserProfile, error) {
	return u.repo.GetProfile(userID)
}

func (u *usersUsecase) GetAvailableSkills() ([]string, error) {
	return u.repo.GetAvailableSkills()
}

func (u *usersUsecase) UpdateContact(userID int, req *entities.UpdateContactRequest) (*entities.UserProfile, error) {
	if req == nil {
		return nil, errors.New("request body is required")
	}

	// 1. Data sanitization: trim spaces and normalize phone number
	req.Email = strings.TrimSpace(req.Email)
	req.PhoneNumber = strings.ReplaceAll(strings.TrimSpace(req.PhoneNumber), " ", "")
	req.Address = strings.TrimSpace(req.Address)

	// 2. Validate required fields
	if req.PhoneNumber == "" || req.PhoneNumber == "-" {
		return nil, errors.New("mobile phone number is required")
	}
	if req.Email == "" {
		return nil, errors.New("email address is required")
	}
	if req.Address == "" {
		return nil, errors.New("address is required")
	}

	// 3. Validate email format (RFC 5322 standard)
	if _, err := mail.ParseAddress(req.Email); err != nil {
		return nil, errors.New("invalid email address format (e.g. name@domain.com)")
	}

	// 4. Validate phone number format
	if !phoneRegex.MatchString(req.PhoneNumber) {
		return nil, errors.New("invalid phone number format (must be 8-20 digits)")
	}

	// 5. Validate address length
	if len(req.Address) > 500 {
		return nil, errors.New("address must not exceed 500 characters")
	}

	return u.repo.UpdateContact(userID, req)
}

func (u *usersUsecase) UpdateSkills(userID int, skills []string) (*entities.UserProfile, error) {
	// Fetch available skills from configuration to use as whitelist
	availableSkills, err := u.repo.GetAvailableSkills()
	if err != nil {
		return nil, err
	}

	validSkillsMap := make(map[string]bool, len(availableSkills))
	for _, s := range availableSkills {
		validSkillsMap[s] = true
	}

	// Whitelist validation and deduplication
	cleanedSkills := make([]string, 0, len(skills))
	seen := make(map[string]bool)

	for _, s := range skills {
		trimmed := strings.TrimSpace(s)
		if trimmed == "" {
			continue
		}
		if !validSkillsMap[trimmed] {
			return nil, fmt.Errorf("invalid skill '%s': must be selected from configuration", trimmed)
		}
		if !seen[trimmed] {
			seen[trimmed] = true
			cleanedSkills = append(cleanedSkills, trimmed)
		}
	}

	return u.repo.UpdateSkills(userID, cleanedSkills)
}

func (u *usersUsecase) UpdatePhoto(userID int, photoURL string) (*entities.UserProfile, error) {
	return u.repo.UpdatePhoto(userID, photoURL)
}

func (u *usersUsecase) GetHistory(userID int, days int) ([]entities.ProfileHistory, error) {
	if days <= 0 {
		days = 7
	}
	return u.repo.GetHistory(userID, days)
}
