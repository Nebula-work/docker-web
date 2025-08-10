package docker

import (
	"context"
	"io"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/build"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
)

// DockerAPI defines the subset of the Docker client used by handlers. This makes testing easy.
type DockerAPI interface {
	ContainerList(ctx context.Context, options container.ListOptions) ([]types.Container, error)
	ContainerStart(ctx context.Context, containerID string, options container.StartOptions) error
	ContainerStop(ctx context.Context, containerID string, options container.StopOptions) error
	ContainerRemove(ctx context.Context, containerID string, options container.RemoveOptions) error
	ContainerRestart(ctx context.Context, containerID string, options container.StopOptions) error
	ContainerLogs(ctx context.Context, containerID string, options container.LogsOptions) (io.ReadCloser, error)
	ImageList(ctx context.Context, options image.ListOptions) ([]image.Summary, error)
	ImagePull(ctx context.Context, ref string, options image.PullOptions) (io.ReadCloser, error)
	ImageBuild(ctx context.Context, buildContext io.Reader, options build.ImageBuildOptions) (build.ImageBuildResponse, error)
	ImageRemove(ctx context.Context, imageID string, options image.RemoveOptions) ([]image.DeleteResponse, error)
	VolumeList(ctx context.Context, options volume.ListOptions) (volume.ListResponse, error)
	VolumeCreate(ctx context.Context, options volume.CreateOptions) (volume.Volume, error)
	VolumeRemove(ctx context.Context, volumeID string, force bool) error
	NetworkList(ctx context.Context, options network.ListOptions) ([]network.Summary, error)
	NetworkCreate(ctx context.Context, name string, options network.CreateOptions) (network.CreateResponse, error)
	NetworkRemove(ctx context.Context, networkID string) error
}

// clientWrapper wraps the real docker client
type clientWrapper struct {
	cli *client.Client
}

func NewClientFromEnv() (DockerAPI, error) {
	c, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}
	return &clientWrapper{cli: c}, nil
}

// Implement the interface by delegating to cli
func (w *clientWrapper) ContainerList(ctx context.Context, options container.ListOptions) ([]types.Container, error) {
	return w.cli.ContainerList(ctx, options)
}
func (w *clientWrapper) ContainerStart(ctx context.Context, containerID string, options container.StartOptions) error {
	return w.cli.ContainerStart(ctx, containerID, options)
}
func (w *clientWrapper) ContainerStop(ctx context.Context, containerID string, options container.StopOptions) error {
	return w.cli.ContainerStop(ctx, containerID, options)
}
func (w *clientWrapper) ContainerRemove(ctx context.Context, containerID string, options container.RemoveOptions) error {
	return w.cli.ContainerRemove(ctx, containerID, options)
}
func (w *clientWrapper) ContainerRestart(ctx context.Context, containerID string, options container.StopOptions) error {
	return w.cli.ContainerRestart(ctx, containerID, options)
}
func (w *clientWrapper) ContainerLogs(ctx context.Context, containerID string, options container.LogsOptions) (io.ReadCloser, error) {
	return w.cli.ContainerLogs(ctx, containerID, options)
}
func (w *clientWrapper) ImageList(ctx context.Context, options image.ListOptions) ([]image.Summary, error) {
	return w.cli.ImageList(ctx, options)
}
func (w *clientWrapper) ImagePull(ctx context.Context, ref string, options image.PullOptions) (io.ReadCloser, error) {
	return w.cli.ImagePull(ctx, ref, options)
}
func (w *clientWrapper) ImageBuild(ctx context.Context, buildContext io.Reader, options build.ImageBuildOptions) (build.ImageBuildResponse, error) {
	return w.cli.ImageBuild(ctx, buildContext, options)
}
func (w *clientWrapper) ImageRemove(ctx context.Context, imageID string, options image.RemoveOptions) ([]image.DeleteResponse, error) {
	return w.cli.ImageRemove(ctx, imageID, options)
}
func (w *clientWrapper) VolumeList(ctx context.Context, options volume.ListOptions) (volume.ListResponse, error) {
	return w.cli.VolumeList(ctx, options)
}
func (w *clientWrapper) VolumeCreate(ctx context.Context, options volume.CreateOptions) (volume.Volume, error) {
	return w.cli.VolumeCreate(ctx, options)
}
func (w *clientWrapper) VolumeRemove(ctx context.Context, volumeID string, force bool) error {
	return w.cli.VolumeRemove(ctx, volumeID, force)
}
func (w *clientWrapper) NetworkList(ctx context.Context, options network.ListOptions) ([]network.Summary, error) {
	return w.cli.NetworkList(ctx, options)
}
func (w *clientWrapper) NetworkCreate(ctx context.Context, name string, options network.CreateOptions) (network.CreateResponse, error) {
	return w.cli.NetworkCreate(ctx, name, options)
}
func (w *clientWrapper) NetworkRemove(ctx context.Context, networkID string) error {
	return w.cli.NetworkRemove(ctx, networkID)
}
