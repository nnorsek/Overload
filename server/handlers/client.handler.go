package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nnorsek/overload-backend/models"
	"github.com/nnorsek/overload-backend/repo"
)

func CreateClient(c *gin.Context) {

	var Client models.Client
	if err := c.BindJSON(&Client); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request"})
		return
	}

	err := repo.CreateClient(Client);
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create client"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "successfully created client",
	})
}


