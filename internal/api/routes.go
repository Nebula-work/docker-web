package api

import (
	"github.com/Nebula-work/docker-web/internal/docker"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup, cli docker.DockerAPI) {
	// container routes
	rg.GET("/containers", func(c *gin.Context) { ListContainers(c, cli) })
	rg.POST("/containers/:id/start", func(c *gin.Context) { StartContainer(c, cli) })
	rg.POST("/containers/:id/stop", func(c *gin.Context) { StopContainer(c, cli) })
	rg.POST("/containers/:id/restart", func(c *gin.Context) { RestartContainer(c, cli) })
	rg.DELETE("/containers/:id", func(c *gin.Context) { RemoveContainer(c, cli) })
	rg.GET("/containers/:id/logs", func(c *gin.Context) { StreamContainerLogs(c, cli) })

	// images
	rg.GET("/images", func(c *gin.Context) { ListImages(c, cli) })
	rg.POST("/images/pull", func(c *gin.Context) { PullImage(c, cli) })
	rg.POST("/images/build", func(c *gin.Context) { BuildImage(c, cli) })
	rg.DELETE("/images/:id", func(c *gin.Context) { RemoveImage(c, cli) })

	// volumes
	rg.GET("/volumes", func(c *gin.Context) { ListVolumes(c, cli) })
	rg.POST("/volumes", func(c *gin.Context) { CreateVolume(c, cli) })
	rg.DELETE("/volumes/:id", func(c *gin.Context) { RemoveVolume(c, cli) })

	// networks
	rg.GET("/networks", func(c *gin.Context) { ListNetworks(c, cli) })
	rg.POST("/networks", func(c *gin.Context) { CreateNetwork(c, cli) })
	rg.DELETE("/networks/:id", func(c *gin.Context) { RemoveNetwork(c, cli) })
}
