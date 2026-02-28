package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/denisenkom/go-mssqldb"
	"github.com/nnorsek/overload-backend/internal/config"
)


var DB *sql.DB;

func Connect() {
	connString := fmt.Sprintf(
		"sqlserver://%s:%s@%s:%s?database=%s&encrypt=true",
		config.Get("DB_USER"),
		config.Get("DB_PASSWORD"),
		config.Get("DB_HOST"),
		config.Get("DB_PORT"),
		config.Get("DB_NAME"),
	)
	db, err := sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Failed to open DB:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}

	DB = db
	log.Println("Connected to Azure SQL")
}

