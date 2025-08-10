package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Nebula-work/docker-web/internal/api"
	"github.com/Nebula-work/docker-web/internal/docker"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// create real docker client wrapper
	dCli, err := docker.NewClientFromEnv()
	if err != nil {
		log.Fatalf("failed to create docker client: %v", err)
	}

	// gin router
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	// CORS config - read allowed origin from env or default
	cfg := cors.DefaultConfig()
	origin := os.Getenv("UI_ORIGIN")
	if origin == "" {
		origin = "http://localhost:3000"
	}
	cfg.AllowOrigins = []string{origin}
	cfg.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	cfg.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(cfg))
	apiGroup := r.Group("/api/v1")
	{
		// middleware: max body size 8MB, request timeout 30s
		apiGroup.Use(api.MaxBodySize(8 << 20))
		apiGroup.Use(api.RequestTimeout(30 * time.Second))
		api.RegisterRoutes(apiGroup, dCli)
	}

	// HTTP server with timeouts
	srv := &http.Server{
		Addr:         ":8080",
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 0, // streaming endpoints may need longer writes; per-route timeouts applied
		IdleTimeout:  120 * time.Second,
	}

	// start server
	go func() {
		log.Println("server starting on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	// graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("server shutdown failed: %v", err)
	}
	log.Println("server exited")
}
