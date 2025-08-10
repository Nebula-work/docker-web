package api

import (
	"github.com/gin-gonic/gin"
)

type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Detail  string `json:"detail,omitempty"`
}

func writeAPIError(c *gin.Context, code int, message string, detail string) {
	c.JSON(code, APIError{
		Code:    code,
		Message: message,
		Detail:  detail,
	})
	c.Abort()
}
