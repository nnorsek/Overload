package routes

import (
	"net/http"

	"github.com/nnorsek/overload-backend/handlers"
)

func RegisteredRoutes() {
	http.HandleFunc("/client", handlers.Client)
}