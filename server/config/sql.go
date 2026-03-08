package config

import (
	"fmt"
	"log"

	"github.com/nnorsek/overload-backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	LoadEnv()
	
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
		Get("DB_HOST"), 
		Get("DB_USER"),
		Get("DB_PASSWORD"),
		Get("DB_NAME"),    
		Get("DB_PORT"),  
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to PostgreSQL:", err)
	}

	if err := db.AutoMigrate(
		&models.Session{},
		&models.ProgressLog{},
		&models.WorkoutExercise{},
		&models.Client{},
		&models.Trainer{},
		&models.Workout{},
		&models.Exercise{},



	); err != nil {
		log.Fatal("Failed to auto-migrate models:", err)
	}

	DB = db
	log.Println("Connected to PostgreSQL and models migrated")
}
