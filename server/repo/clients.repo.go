package repo

import (
	"fmt"

	"github.com/nnorsek/overload-backend/config"
	"github.com/nnorsek/overload-backend/models"
)

func CreateClient(client models.Client) error {
	if err := config.DB.Create(&client).Error; err != nil {
		return fmt.Errorf("could not create client: %w", err)
	}
	return nil
}
