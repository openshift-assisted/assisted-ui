.PHONY: all build deploy clean

IMAGE := $(or ${IMAGE},quay.io/ocpmetal/ocp-metal-ui:latest)

all: build deploy

build:
	yarn build
	sudo podman build -t $(IMAGE) .
	sudo podman push $(IMAGE)

deploy:
	sed "s#__IMAGE__#${IMAGE}#g;s#__BM_INVENTORY_URL__#${BM_INVENTORY_URL}#g" deploy/ocp-metal-ui-template.yaml > deploy/ocp-metal-ui.yaml
	kubectl apply -f deploy/ocp-metal-ui.yaml
	rm deploy/ocp-metal-ui.yaml

clean:
	kubectl delete deployment,service,configmap ocp-metal-ui