.PHONY: all build deploy clean

IMAGE := $(or ${IMAGE},quay.io/edge-infrastructure/assisted-installer-ui:latest)
NAMESPACE := $(or ${NAMESPACE},assisted-installer)
ASSISTED_SERVICE_URL := $(or ${ASSISTED_SERVICE_URL},http://assisted-service.${NAMESPACE}.svc.cluster.local:8090)
DEPLOY_FILE="deploy/assisted-installer-ui.yaml"

all: build deploy

build:
	pnpm build
	podman build -t $(IMAGE) .
	podman push $(IMAGE)

deploy:
	mkdir -p build/deploy/
	deploy/deploy_config.sh -u "${ASSISTED_SERVICE_URL}" -i "${IMAGE}" -t deploy/ui-deployment-template.yaml -n "${NAMESPACE}" > ${DEPLOY_FILE}
	kubectl apply -f ${DEPLOY_FILE}

# TODO(mlibra): Run tests: get UI URL, run run-tests.sh

clean:
	rm -f ${DEPLOY_FILE}
	kubectl delete deployment,service,configmap assisted-installer-ui
