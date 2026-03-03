package models

import (
	"time"
)

type Client struct {
	ClientID       uint          `gorm:"primaryKey;autoIncrement" json:"client_id"`
	FirstName      string        `gorm:"size:255;not null" json:"first_name"`
	LastName       string        `gorm:"size:255;not null" json:"last_name"`
	DateOfBirth    time.Time     `json:"date_of_birth"`
	Gender         string        `gorm:"size:20" json:"gender"`
	StartingWeight float64       `gorm:"type:numeric(5,2)" json:"starting_weight"`
	CurrentWeight  float64       `gorm:"type:numeric(5,2)" json:"current_weight"`
	Height         float64       `gorm:"type:numeric(5,2)" json:"height"`
	Goal           string        `gorm:"size:255" json:"goal"`
	PhotoURL       string        `gorm:"size:255" json:"photo_url"`
	CreatedAt      time.Time     `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time     `gorm:"autoUpdateTime" json:"updated_at"`

	Auth           ClientAuth    `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE"`
	Sessions       []*Session     `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE" json:"sessions,omitempty"`
    ProgressLogs   []*ProgressLog `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE" json:"progress_logs,omitempty"`
}

type ClientAuth struct {
	ClientID     uint   `gorm:"primaryKey" json:"client_id"`
	Email        string `gorm:"size:255;not null;unique" json:"email"`
	PasswordHash string `gorm:"not null" json:"password_hash"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`

	Client       *Client  `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE" json:"client,omitempty"`
}

type Trainer struct {
	TrainerID  uint      `gorm:"primaryKey;autoIncrement" json:"trainer_id"`
	FirstName  string    `gorm:"size:255;not null" json:"first_name"`
	LastName   string    `gorm:"size:255;not null" json:"last_name"`
	Age        int       `json:"age"`
	Gender     string    `gorm:"size:20" json:"gender"`
	PhotoURL   string    `gorm:"size:255" json:"photo_url"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	Workouts  []Workout  `gorm:"foreignKey:TrainerID;constraint:OnDelete:CASCADE"`
	Sessions  []Session  `gorm:"foreignKey:TrainerID;constraint:OnDelete:CASCADE"`
}

type Workout struct {
	WorkoutID       uint               `gorm:"primaryKey;autoIncrement" json:"workout_id"`
	TrainerID       uint               `gorm:"not null" json:"trainer_id"`
	Name            string             `gorm:"size:255;not null" json:"name"`
	Description     string             `gorm:"type:text;not null" json:"description"`
	DifficultyLevel string             `gorm:"size:20;not null" json:"difficulty_level"`
	EstimatedDuration int              `json:"estimated_duration"` // in minutes
	CreatedAt       time.Time          `gorm:"autoCreateTime" json:"created_at"`

	Trainer         Trainer            `gorm:"foreignKey:TrainerID;constraint:OnDelete:CASCADE"`
	WorkoutExercises []WorkoutExercise `gorm:"foreignKey:WorkoutID;constraint:OnDelete:CASCADE"`
	Sessions        []Session          `gorm:"foreignKey:WorkoutID;constraint:OnDelete:SET NULL"`
}

type Exercise struct {
	ExerciseID   uint               `gorm:"primaryKey;autoIncrement" json:"exercise_id"`
	Name         string             `gorm:"size:255;not null" json:"name"`
	Description  string             `gorm:"type:text" json:"description"`
	MuscleGroup  string             `gorm:"size:50" json:"muscle_group"`
	CreatedAt    time.Time          `gorm:"autoCreateTime" json:"created_at"`

	WorkoutExercises []WorkoutExercise `gorm:"foreignKey:ExerciseID;constraint:OnDelete:CASCADE"`
}

type WorkoutExercise struct {
	WorkoutExerciseID uint    `gorm:"primaryKey;autoIncrement" json:"workout_exercise_id"`
	WorkoutID         uint    `gorm:"not null" json:"workout_id"`
	ExerciseID        uint    `gorm:"not null" json:"exercise_id"`
	Sets              int     `gorm:"default:0" json:"sets"`
	Reps              int     `gorm:"default:0" json:"reps"`
	RestSeconds       int     `gorm:"default:0" json:"rest_seconds"`
	ExerciseOrder     int     `gorm:"not null" json:"exercise_order"`

	Workout   Workout   `gorm:"foreignKey:WorkoutID;constraint:OnDelete:CASCADE"`
	Exercise  Exercise  `gorm:"foreignKey:ExerciseID;constraint:OnDelete:CASCADE"`
}

type Session struct {
	SessionID      uint      `gorm:"primaryKey;autoIncrement" json:"session_id"`
	ClientID       uint      `gorm:"not null" json:"client_id"`
	TrainerID      uint      `gorm:"not null" json:"trainer_id"`
	WorkoutID      uint      `gorm:"not null" json:"workout_id"`
	ScheduledStart time.Time `gorm:"not null" json:"scheduled_start"`
	ScheduledEnd   time.Time `gorm:"not null" json:"scheduled_end"`
	Status         string    `gorm:"size:20;not null" json:"status"`
	Notes          string    `gorm:"size:255" json:"notes"`

	Client  Client  `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE"`
	Trainer Trainer `gorm:"foreignKey:TrainerID;constraint:OnDelete:CASCADE"`
	Workout Workout `gorm:"foreignKey:WorkoutID;constraint:OnDelete:SET NULL"`
}

type ProgressLog struct {
	ProgressID         uint      `gorm:"primaryKey;autoIncrement" json:"progress_id"`
	ClientID           uint      `gorm:"not null" json:"client_id"`
	LogDate            time.Time `gorm:"not null;default:CURRENT_DATE" json:"log_date"`
	Weight             float64   `gorm:"type:numeric(5,2);not null" json:"weight"`
	BodyFatPercentage  float64   `gorm:"type:numeric(5,2)" json:"body_fat_percentage"`
	Notes              string    `gorm:"size:255" json:"notes"`

	Client  Client `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE"`
}