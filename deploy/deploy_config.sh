#!/bin/bash

# This tool prepares the UI deployment yaml, by taking in a template and replacing the Bm-Inventory URL and
# UI Image that were supplied in the command line

usage() {
  echo "Usage: $0 [ -t deploy-confing-template ] [ -u BM-INVENTORY-URL ] [ -i UI_IMAGE_NAME ] [ -n NAMESPACE ]" 1>&2
}

BM_INVENTORY_URL="http://bm-inventory.assisted-installer.svc.cluster.local:8090"
INPUT_TEMPLATE="/deploy/ocp-metal-ui-template.yaml"
IMAGE="quay.io/ocpmetal/ocp-metal-ui:latest"
NAMESPACE="assisted-installer"

while getopts ":u:i:t:n:h" opt; do
  case $opt in
    t)
      INPUT_TEMPLATE="$OPTARG"
      ;;
    i)
      IMAGE="$OPTARG"
      ;;
    n)
      NAMESPACE="$OPTARG"
      BM_INVENTORY_URL="http://bm-inventory.${NAMESPACE}.svc.cluster.local:8090"
      ;;
    u)
      BM_INVENTORY_URL="$OPTARG"
      ;;
    h)
      usage
      exit 0
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      usage
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      usage
      exit 1
      ;;
  esac
done

sed "s#__IMAGE__#${IMAGE}#g;
     s#__BM_INVENTORY_URL__#${BM_INVENTORY_URL}#g;
     s#__NAMESPACE__#${NAMESPACE}#g" ${INPUT_TEMPLATE}


