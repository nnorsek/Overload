package routes

import (
	"net/http"

	"github.com/nnorsek/overload-backend/internal/handlers"
)

func RegisteredRoutes() {
	http.HandleFunc("/client", handlers.Client)
}