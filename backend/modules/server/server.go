package server

import (
	"database/sql"
	"log"
	"net/http"

	"portalweb/configs"

	"github.com/rs/cors"
)

type Server struct {
	App *http.ServeMux
	Cfg *configs.Config
	Db  *sql.DB
}

// NewServer creates a new Server instance with configs and database
func NewServer(cfg *configs.Config, db *sql.DB) *Server {
	return &Server{
		App: http.NewServeMux(),
		Cfg: cfg,
		Db:  db,
	}
}

// Start starts the HTTP server with mapped handlers and CORS support
func (s *Server) Start() {
	if err := s.MapHandlers(); err != nil {
		log.Fatalln(err.Error())
		panic(err.Error())
	}

	host := s.Cfg.App.Host
	port := s.Cfg.App.Port
	log.Printf("Server started on http://%s:%s", host, port)

	// Enable CORS for all origins, methods, and headers
	handler := cors.AllowAll().Handler(s.App)

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalln(err.Error())
		panic(err.Error())
	}
}
