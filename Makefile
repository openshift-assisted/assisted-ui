.PHONY: all build deploy clean

IMAGE := $(or ${IMAGE},quay.io/ocpmetal/ocp-metal-ui:latest)

all: build deploy

build:
	yarn build
	sudo podman build -t $(IMAGE) .
	sudo podman push $(IMAGE)

deploy:
	kubectl apply -f deploy/ocp-metal-ui.yaml

clean:
	kubectl delete deployment,service,configmap ocp-metal-ui