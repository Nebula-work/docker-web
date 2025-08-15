# Go source paths
SERVER_SRC := ./cmd/server/main.go

# Output directory for binaries
BIN_DIR := ./out

# Names for the compiled binaries
SERVER_BIN := $(BIN_DIR)/docker-server

# Frontend directory
FRONTEND_DIR := ./frontend

# Use .PHONY to ensure these commands run even if a file with the same name exists.
.PHONY: all start stop run-server  run-frontend build clean

# The default command, executed when you just type "make"
all: build

# Build the Go binaries
build: build-server
	@echo "Build complete. Executables are $(SERVER_BIN)"

# Build server binary if any source changes
build-server: $(SERVER_BIN)

SERVER_DEPS := $(shell find ./cmd/server -type f -name '*.go')
$(SERVER_BIN): $(SERVER_DEPS)
	@echo "Building Go server binary..."
	@mkdir -p $(BIN_DIR)
	@go build -o $(SERVER_BIN) $(SERVER_SRC)


# Run only the server
run-server: build-server
	@echo "Starting server on localhost:8080..."
	@$(SERVER_BIN)


# Run only the frontend
run-frontend:
	@echo "Starting Next.js frontend..."
	@cd $(FRONTEND_DIR) && npm install && npm run dev

# Clean up build artifacts
clean:
	@echo "Cleaning up build artifacts..."
	@rm -rf $(BIN_DIR)
	@echo "Cleanup complete."