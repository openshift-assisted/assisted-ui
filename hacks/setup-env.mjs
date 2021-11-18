#!/usr/bin/env zx

/**
 * This script has the following prerequisites:
 * 1. node.js >= 14.8, virsh, virt-install and xmllint
 * 2. The 'google/zx' package must be availabe globally: `npm i -g zx`
 * 3. Make this script executable: `chmod +x setup-en.mjs`
 * 4. Execute it like this: `./setup-env.mjs --help`
 */
import crypto from 'crypto';
import assert from 'assert';

/** Necessary until unhandled promise rejections end the process */
process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

const SCRIPT_NAME = argv._[0]

let storagePool = process.env.STORAGE_POOL || "default";
let masterDiskGB = process.env.MASTER_DISKGB || 20;
let masterMemMB = process.env.MASTER_MEMMB || 16 * 1024;
let masterCPUs = process.env.MASTER_CPUS || 4;
let workerDiskGB = process.env.WORKER_DISKGB || 20;
let workerMemMB = process.env.WORKER_MEMMB || 8 * 1024;
let workerCPUs = process.env.WORKER_CPUS || 2;

function* seq(n) {
  let i = 0;
  while (i < n) {
    yield i++;
  }
}

function printUsage() {
  console.log(
    `Description:
Creates virtual machines to serve as master and worker hosts in an OpenShift BareMetal cluster installation.

Usage:
  ${SCRIPT_NAME} <discovery-iso-file> [FLAGS...] 
  
  FLAGS:
    -h | --help                    Displays this help and exits.
    -s | --sno                     Creates a single host for usage in a SNO setup.
                                   The generated host will have the same specs as the master nodes.
                                   (This option is incompatible with --withWorkers (-w) flag).
    -d | --debug                   Displays verbose information.
    -w | --withWorkers             Creates 2 additional worker hosts.
    -c | --clusterName=<string>    The cluster name, this is used in order to
                                   identify to which cluster each vm belongs.

The hardware specifications can be tuned with the following environment variables:
STORAGE_POOL    (default: ${storagePool})
MASTER_DISKGB   (default: ${masterDiskGB}, for SNO: ${masterDiskGB + 100})
MASTER_MEMMB    (default: ${masterMemMB}, for SNO: ${masterMemMB * 2})
MASTER_CPUS     (default: ${masterCPUs}, for SNO: ${masterCPUs * 2})
WORKER_DISKGB   (default: ${workerDiskGB})
WORKER_MEMMB    (default: ${workerMemMB})
WORKER_CPUS     (default: ${workerCPUs})`
  );
}

async function createDomain(name, diskgb, memmb, cpus, isoFile) {
  return $
    `virt-install \
  --wait -1 \
  --name=${name} \
  --cdrom=${isoFile} \
  --vcpus=${cpus} \
  --ram=${memmb} \
  --disk=size=${diskgb},pool=${storagePool} \
  --os-variant=rhel-unknown \
  --network=bridge=virbr0,model=virtio \
  --graphics=spice \
  --noautoconsole`
}

function createHost(n, clusterName, type, isoFile) {
  const promises = [];
  for (let i of seq(n)) {
    switch (type) {
      case 'worker':
        promises.push(createDomain(`${clusterName}-worker-${i + 1}`, workerDiskGB, workerMemMB, workerCPUs, isoFile));
        break;
      case 'master':
      default:
        promises.push(createDomain(`${clusterName}-master-${i + 1}`, masterDiskGB, masterMemMB, masterCPUs, isoFile));
    }
  }

  return Promise.all(promises);
}

function validateArgv() {
  assert.ok(argv._.length === 2 && argv._[1].trim().length > 0, 'ISO image URL is missing')
  const knownFlags = [
    'debug', 'd',
    'sno', 's',
    'withWorkers', 'with-workers', 'w',
    'clusterName', 'cluster-name', 'c',
  ]

  const {_, ...cliFlags} = argv
  for (const cliFlag of Object.keys(cliFlags)) {
    assert.ok(knownFlags.includes(cliFlag), `Unrecognized flag '${cliFlag}'`)
  }
}

async function downloadISO(isoURL, clusterName) {
  const isoDir = await $`virsh pool-dumpxml ${storagePool} | xmllint --xpath '/pool/target/path/text()' -`;
  const isoFilePath = `${isoDir}/discovery_image_${clusterName}.iso`;
  await $`mkdir -pv ${isoDir}`;
  await $`wget -nv -O ${isoFilePath} ${isoURL}`;

  return isoFilePath;
}

async function displayUUIDs(clusterName) {
  const verboseInitialState = $.verbose
  $.verbose = true;
  await $`virsh list --uuid --name | grep ${clusterName}`;
  $.verbose = verboseInitialState;
}

async function main() {
  if (argv.help || argv.h) {
    printUsage()
    process.exit()
  }
  
  validateArgv()

  $.verbose = argv.debug || argv.d;
  const isoURL = argv._[1];
  const isSNO = argv.sno || argv.s || false
  const withWorkers = argv.withWorkers || argv['with-workers'] || argv.w || false;
  const clusterName = argv.clusterName || argv['cluster-name'] || argv.c || `vm-${crypto.randomBytes(4).toString('hex')}`;

  const isoFilePath = await downloadISO(isoURL, clusterName)

  if (isSNO) {
    masterDiskGB += 100;
    masterMemMB *= 2;
    masterCPUs *= 2;
    await createHost(1, clusterName, 'master', isoFilePath)
  } else {
    await createHost(3, clusterName, 'master', isoFilePath)
    if (withWorkers) {
      await createHost(2, clusterName, 'worker', isoFilePath)
    }
  }

  await displayUUIDs(clusterName);
}

main();
