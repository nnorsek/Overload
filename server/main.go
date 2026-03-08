package main

import (
	"github.com/gin-gonic/gin"
	"github.com/nnorsek/overload-backend/config"
	"github.com/nnorsek/overload-backend/handlers"
)

func main() {

	config.Connect()

	r := gin.Default()

	client := r.Group("client") 
	{
	client.POST("/create", handlers.CreateClient)
	}

	r.Run(":8080")
}