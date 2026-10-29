package server

import (
	"net/http"

	"portalweb/modules/users/controllers"
	"portalweb/modules/users/repositories"
	"portalweb/modules/users/usecases"
)

// MapHandlers maps API endpoints and routes to controllers
func (s *Server) MapHandlers() error {
	// 1. Health check endpoint
	s.App.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"Server and database are ready"}`))
	})

	// 2. Wire up Clean Architecture for Users module
	usersRepository := repositories.NewUsersRepository(s.Db)
	usersUsecase := usecases.NewUsersUsecase(usersRepository)
	usersController := controllers.NewUsersController(usersUsecase)

	// Users API Endpoints
	s.App.HandleFunc("GET /api/profile", usersController.GetProfile)
	s.App.HandleFunc("PUT /api/profile/contact", usersController.UpdateContact)
	s.App.HandleFunc("PUT /api/profile/skills", usersController.UpdateSkills)
	s.App.HandleFunc("POST /api/profile/photo", usersController.UploadPhoto)
	s.App.HandleFunc("GET /api/profile/history", usersController.GetHistory)
	s.App.HandleFunc("GET /api/skills", usersController.GetAvailableSkills)

	return nil
}
