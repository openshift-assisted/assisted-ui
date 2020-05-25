.PHONY: all build deploy clean

IMAGE := $(or ${IMAGE},quay.io/ocpmetal/ocp-metal-ui:latest)
BM_INVENTORY_URL := $(or ${BM_INVENTORY_URL},http://bm-inventory.assisted-installer.svc.cluster.local:8090)

DEPLOY_FILE="deploy/ocp-metal-ui.yaml"

all: build deploy

build:
	yarn build
	sudo podman build -t $(IMAGE) .
	sudo podman push $(IMAGE)

deploy:
	mkdir -p build/deploy/
	deploy/deploy_config.sh -u "${BM_INVENTORY_URL}" -i "${IMAGE}" -t deploy/ocp-metal-ui-template.yaml > ${DEPLOY_FILE}
	kubectl apply -f ${DEPLOY_FILE}

clean:
	rm -f ${DEPLOY_FILE}
	-kubectl delete deployment,service,configmap ocp-metal-ui
