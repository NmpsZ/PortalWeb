package main

import (
	"log"

	"portalweb/configs"
	"portalweb/modules/server"
	"portalweb/pkg/databases"
)

func main() {
	// 1. Load application configurations
	cfg := configs.LoadConfig()

	// 2. Connect to PostgreSQL database
	db, err := databases.NewPostgresDB(cfg)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	// 3. Initialize and start HTTP server
	server.NewServer(cfg, db).Start()
}
