package main

import (
	"log"
	"net/http"

	"github.com/nnorsek/overload-backend/config"
	"github.com/nnorsek/overload-backend/routes"
)

func main() {
	config.LoadEnv()
	config.Connect()
	routes.RegisteredRoutes()

	port := config.Get("APP_PORT")
	log.Println("Server running on port", port)

	log.Fatal(http.ListenAndServe(":"+port, nil))


	
}