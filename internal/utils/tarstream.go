package utils

import (
	"archive/tar"
	"context"
	"fmt"
	"io"
	"os/exec"
	"time"

	"github.com/docker/docker/client"
)

// WriteDockerfileTar writes a simple tar archive containing a Dockerfile to w.
func WriteDockerfileTar(w io.Writer, dockerfile string) error {
	tw := tar.NewWriter(w)
	defer tw.Close()
	if err := tw.WriteHeader(&tar.Header{Name: "Dockerfile", Mode: 0600, Size: int64(len(dockerfile))}); err != nil {
		return err
	}
	if _, err := tw.Write([]byte(dockerfile)); err != nil {
		return err
	}
	return nil
}
func CheckDockerAvailability() error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// 1️⃣ Check if docker binary exists
	if _, err := exec.LookPath("docker"); err != nil {
		return fmt.Errorf("docker CLI not found: %w", err)
	}

	// 2️⃣ Try connecting via Go Docker SDK
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err == nil {
		cli.NegotiateAPIVersion(ctx)
		if _, err := cli.Ping(ctx); err == nil {
			// Optional: Get version
			version, _ := cli.ServerVersion(ctx)
			fmt.Printf("Docker daemon is running. Version: %s\n", version.Version)
			return nil
		}
	}

	// 3️⃣ Fallback to docker CLI command
	cmd := exec.CommandContext(ctx, "docker", "info")
	if output, err := cmd.CombinedOutput(); err != nil {
		return fmt.Errorf("docker CLI found, but daemon may not be running: %v\nOutput: %s", err, output)
	}

	fmt.Println("Docker CLI is working and daemon is responding (checked via CLI).")
	return nil
}
