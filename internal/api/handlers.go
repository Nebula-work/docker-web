package api

import (
	"archive/tar"
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/api/types/registry"
	"github.com/docker/docker/api/types/volume"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/Nebula-work/docker-web/internal/docker"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

func ListContainers(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	containers, err := cli.ContainerList(ctx, container.ListOptions{All: true})
	if err != nil {
		writeAPIError(c, http.StatusInternalServerError,
			"Failed to list containers",
			err.Error(),
		)
		return
	}
	c.JSON(http.StatusOK, containers)
}

func StartContainer(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	id := c.Param("id")
	if err := cli.ContainerStart(ctx, id, container.StartOptions{}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "started"})
}

func StopContainer(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	id := c.Param("id")
	if err := cli.ContainerStop(ctx, id, container.StopOptions{}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "stopped"})
}

func RestartContainer(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	id := c.Param("id")
	if err := cli.ContainerRestart(ctx, id, container.StopOptions{}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "restarted"})
}

func RemoveContainer(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	id := c.Param("id")
	if err := cli.ContainerRemove(ctx, id, container.RemoveOptions{Force: true}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "removed"})
}

// StreamContainerLogs streams logs over websocket
func StreamContainerLogs(c *gin.Context, cli docker.DockerAPI) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("ws upgrade: %v", err)
		return
	}
	defer conn.Close()

	// set limits
	conn.SetReadLimit(512 * 1024)
	_ = conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	conn.SetPongHandler(func(string) error { _ = conn.SetReadDeadline(time.Now().Add(60 * time.Second)); return nil })

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	containerID := c.Param("id")
	logReader, err := cli.ContainerLogs(ctx, containerID, container.LogsOptions{ShowStdout: true, ShowStderr: true, Follow: true, Timestamps: false})
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("error: cannot get logs"))
		return
	}
	defer logReader.Close()

	// writer goroutine that serializes writes
	writeCh := make(chan []byte)
	go func() {
		for msg := range writeCh {
			_ = conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				break
			}
		}
	}()

	// read goroutine to detect client close / pongs
	go func() {
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				cancel()
				break
			}
		}
	}()

	buf := make([]byte, 2048)
	for {
		n, err := logReader.Read(buf)
		if err != nil {
			if err != io.EOF {
				log.Printf("log read err: %v", err)
			}
			break
		}
		// copy because buf will be reused
		b := make([]byte, n)
		copy(b, buf[:n])
		select {
		case writeCh <- b:
		case <-ctx.Done():
			break
		}
	}
	close(writeCh)
}

func ListImages(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	imgs, err := cli.ImageList(ctx, image.ListOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list images"})
		return
	}
	c.JSON(http.StatusOK, imgs)
}

type AuthConfig struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type PullRequest struct {
	Image string      `json:"image" binding:"required"`
	Auth  *AuthConfig `json:"auth"`
}

func PullImage(c *gin.Context, cli docker.DockerAPI) {
	var req PullRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	ctx := c.Request.Context()
	opts := image.PullOptions{}
	if req.Auth != nil && req.Auth.Username != "" {
		authConfig := registry.AuthConfig{
			Username: req.Auth.Username,
			Password: req.Auth.Password,
		}
		encodedJSON, err := json.Marshal(authConfig)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode auth config"})
			return
		}
		authStr := base64.URLEncoding.EncodeToString(encodedJSON)
		opts.RegistryAuth = authStr
	}
	reader, err := cli.ImagePull(ctx, req.Image, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer reader.Close()
	c.Stream(func(w io.Writer) bool { _, err := io.Copy(w, reader); return err == nil })
}

type BuildRequest struct {
	Dockerfile string `json:"dockerfile" binding:"required"`
	Tag        string `json:"tag" binding:"required"`
}

func BuildImage(c *gin.Context, cli docker.DockerAPI) {
	var req BuildRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create in-memory tar with the Dockerfile
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	hdr := &tar.Header{
		Name: "Dockerfile",
		Mode: 0600,
		Size: int64(len(req.Dockerfile)),
	}
	if err := tw.WriteHeader(hdr); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write tar header"})
		return
	}
	if _, err := tw.Write([]byte(req.Dockerfile)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write Dockerfile"})
		return
	}
	if err := tw.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close tar"})
		return
	}

	dockerBuildContext := bytes.NewReader(buf.Bytes())

	options := types.ImageBuildOptions{
		Tags:       []string{req.Tag},
		Dockerfile: "Dockerfile",
		Remove:     true, // remove intermediate containers
	}

	res, err := cli.ImageBuild(context.Background(), dockerBuildContext, options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer res.Body.Close()

	// Stream build output to client
	c.Stream(func(w io.Writer) bool {
		_, err := io.Copy(w, res.Body)
		return err == nil
	})
}

func RemoveImage(c *gin.Context, cli docker.DockerAPI) {
	id := c.Param("id")
	if _, err := cli.ImageRemove(c.Request.Context(), id, image.RemoveOptions{Force: true}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "removed"})
}

func ListVolumes(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	volumes, err := cli.VolumeList(ctx, volume.ListOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list volumes"})
	}
	c.JSON(http.StatusOK, volumes)
}
func CreateVolume(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	name := c.Param("name")
	if _, err := cli.VolumeCreate(ctx, volume.CreateOptions{Name: name}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"message": "created"})
}
func RemoveVolume(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	name := c.Param("name")
	if err := cli.VolumeRemove(ctx, name, false); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"message": "removed"})
}
func ListNetworks(c *gin.Context, cli docker.DockerAPI) {
	ctx := c.Request.Context()
	networks, err := cli.NetworkList(ctx, network.ListOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list networks"})
	}
	c.JSON(http.StatusOK, networks)
}
func CreateNetwork(c *gin.Context, cli docker.DockerAPI) {
	var req network.CreateOptions
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var networkName string
	var reqData map[string]interface{}
	if err := c.BindJSON(&reqData); err == nil {
		if name, ok := reqData["Name"].(string); ok {
			networkName = name
		}
	}

	if networkName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Network name is required"})
		return
	}

	resp, err := cli.NetworkCreate(context.Background(), networkName, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func RemoveNetwork(c *gin.Context, cli docker.DockerAPI) {
	networkID := c.Param("id")
	if err := cli.NetworkRemove(context.Background(), networkID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Network removed successfully"})
}
