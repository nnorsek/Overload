package config

import (
	"fmt"
	"log"
	"os"

	"github.com/nnorsek/overload-backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	// Build PostgreSQL DSN
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	// Open GORM connection with PostgreSQL driver
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to PostgreSQL:", err)
	}

	// Auto-migrate your models
	err = db.AutoMigrate(&models.Client{}) // add other models here later
	if err != nil {
		log.Fatal("Failed to auto-migrate models:", err)
	}

	DB = db
	log.Println("Connected to PostgreSQL and models migrated")
}