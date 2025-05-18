# Makefile for video-highlight-tool Docker workflows

# Variables
DEV_IMAGE=video-highlight-tool-dev
PROD_IMAGE=video-highlight-tool

# Build dev image
build-dev:
	docker build -f Dockerfile.dev -t $(DEV_IMAGE) .

# Run dev container
run-dev:
	docker run -p 5173:5173 $(DEV_IMAGE)

# Run dev container with hot reload (mount source)
run-dev-hot:
	docker run -p 5173:5173 -v $(PWD):/app -v /app/node_modules $(DEV_IMAGE)

# Build prod image
build-prod:
	docker build -t $(PROD_IMAGE) .

# Run prod container
run-prod:
	docker run -p 8080:80 $(PROD_IMAGE)

# Clean up all containers and images (use with caution)
clean:
	docker rm -f $$(docker ps -aq) 2>/dev/null || true
	docker rmi -f $(DEV_IMAGE) $(PROD_IMAGE) 2>/dev/null || true 