#!/bin/bash
set -e

# Creates a VM from given ISO to simplify cluster creation or adding Day 2 hosts
#
# Following examples are for our test-infra environments:
#
# Example for day 2 host:
#   - download generated Day 2 iso under /var/lib/libvirt/images/
#   $ curl https://raw.githubusercontent.com/openshift-assisted/assisted-ui/master/hacks/create-test-vm.sh | ISO=/var/lib/libvirt/images/discovery_image_scale-up-mlibra11.iso NAME=mlibra11_worker_7 sh -
#
# Provide additional parameters for day 1 masters (at least set MEMMIB and CPUS env variables)

export NAME=${NAME:-"vm-`mktemp -uq XXXXXXXXXX`"}
export ISO=${ISO:-missing_iso_file_path}
export MEMMIB=${MEMMIB:-8192}
export CPUS=${CPUS:-4}
export DISKGIB=${DISKGIB:-25}
export POOL=${POOL:-default}

echo NAME: $NAME
echo ISO: $ISO
echo MEMMIB: $MEMMIB
echo CPUS: $CPUS
echo Storage POOL: $POOL

set -x

virt-install --name="${NAME}" \
  --vcpus=${CPUS} \
  --ram=${MEMMIB}\
  --network=bridge=virbr0 \
  --events on_reboot=restart \
  --graphics=none \
  --os-variant=rhel7.0 \
  --disk=size=${DISKGIB},pool=${POOL} \
  --cdrom=${ISO} \
  --noautoconsole

