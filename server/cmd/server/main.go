package main

import (
	"log"
	"net/http"

	"github.com/nnorsek/overload-backend/internal/config"
	"github.com/nnorsek/overload-backend/internal/db"
	"github.com/nnorsek/overload-backend/routes"
)

func main() {
	config.LoadEnv()
	db.Connect()
	routes.RegisteredRoutes()

	port := config.Get("APP_PORT")
	log.Println("Server running on port", port)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}