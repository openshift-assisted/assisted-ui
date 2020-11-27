#!/bin/bash
set -x

# Creates a VM from given ISO to simplify cluster creation or adding Day 2 hosts
#
# Following examples are for our test-infra environments:
#
# Example for day 2 host:
#   - download generated Day 2 iso under /var/lib/libvirt/images/
#   $ ISO=/var/lib/libvirt/images/discovery_image_scale-up-mlibra11.iso NAME=mlibra11_worker_5 curl https://raw.githubusercontent.com/openshift-metal3/facet/master/hacks/create-test-vm.sh | sh -
#
# Provide additional parameters for day 1 masters (at least set MEMGIB and CPUS env variables)
 
export NAME=${NAME:-"vm-`mktemp -uq XXXXXXXXXX`"}
export ISO=${ISO:-missing_iso_file_path}
export MEMGIB=${MEMGIB:-8}
export CPUS=${CPUS:-4}
export DISKGIB=${DISKGIB:-25}
export MAC=${MAC:-"`openssl rand -hex 6 | sed 's/\(..\)/\1:/g; s/:$//'`"}

export TEMPLATE=${TEMPLATE:-"https://raw.githubusercontent.com/openshift-metal3/facet/master/hacks/vm-test-template.xml"}

echo NAME: $NAME
echo ISO: $ISO
echo MEMGIB: $MEMGIB
echo CPUS: $CPUS
echo MAC: $MAC
echo TEMPLATE: $TEMPLATE

qemu-img create -f qcow2 /var/lib/libvirt/images/$NAME.qcow2 ${DISKGIB}G

curl "$TEMPLATE" | \
  sed -e "s/__NAME__/$NAME/g" | \
  sed -e "s/__MEM_GIB__/$MEMGIB/g" | \
  sed -e "s/__CPUS__/$CPUS/g" | \
  sed -e "s~__ISO__~$ISO~g" | \
  sed -e "s/__MAC__/$MAC/g" \
  > ${NAME}.xml

virsh create ${NAME}.xml

