package utils

import (
	"archive/tar"
	"io"
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
