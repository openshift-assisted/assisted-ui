.PHONY: all build deploy clean

IMAGE := $(or ${IMAGE},quay.io/ocpmetal/ocp-metal-ui:latest)
TESTS_IMAGE := $(or ${TESTS_IMAGE},quay.io/ocpmetal/ocp-metal-ui-tests:latest)
BM_INVENTORY_URL := $(or ${BM_INVENTORY_URL},http://bm-inventory.assisted-installer.svc.cluster.local:8090)
NAMESPACE := $(or ${NAMESPACE},assisted-installer)
DEPLOY_FILE="deploy/ocp-metal-ui.yaml"

all: build deploy

build:
	yarn build
	podman build -t $(IMAGE) .
	podman build -f Dockerfile.cypress -t $(TESTS_IMAGE) .
	podman push $(IMAGE)
	podman push $(TESTS_IMAGE)

deploy:
	mkdir -p build/deploy/
	deploy/deploy_config.sh -u "${BM_INVENTORY_URL}" -i "${IMAGE}" -t deploy/ocp-metal-ui-template.yaml -n "${NAMESPACE}" > ${DEPLOY_FILE}
	kubectl apply -f ${DEPLOY_FILE}

# TODO(mlibra): Run tests: get UI URL, run run-tests.sh

clean:
	rm -f ${DEPLOY_FILE}
	kubectl delete deployment,service,configmap ocp-metal-ui
