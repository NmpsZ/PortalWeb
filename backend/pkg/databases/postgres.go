package databases

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"portalweb/configs"
)

// connectBuilder builds the database connection string (DSN)
func connectBuilder(cfg *configs.Config) string {
	d := cfg.Database
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		d.User, d.Password, d.Host, d.Port, d.DBName, d.SSLMode,
	)
}

// NewPostgresDB establishes a connection pool to PostgreSQL and initializes the schema
func NewPostgresDB(cfg *configs.Config) (*sql.DB, error) {
	dsn := connectBuilder(cfg)
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("[DATABASE] Connected successfully")

	initSchema(db)

	return db, nil
}

// initSchema reads and executes schema.sql to ensure tables exist
func initSchema(db *sql.DB) {
	sqlFile, err := os.ReadFile("pkg/databases/schema.sql")
	if err != nil {
		sqlFile, _ = os.ReadFile("backend/pkg/databases/schema.sql")
	}
	if len(sqlFile) > 0 {
		_, _ = db.Exec(string(sqlFile))
	}
}
