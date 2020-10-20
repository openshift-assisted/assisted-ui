// api timeout - 10 seconds
export const DEFAULT_API_REQUEST_TIMEOUT = 10 * 1000;
// timeout for hosts to boot and register - 10 minutes
export const HOST_REGISTRATION_TIMEOUT = 20 * 60 * 1000;
// host discovery and subnet discovery timeout - 30 seconds
export const HOST_DISCOVERY_TIMEOUT = 30 * 1000;
// timeout for validate changes - 10 seconds
export const VALIDATE_CHANGES_TIMEOUT = 10 * 1000;
// timeout for start installation to be enabled
export const START_INSTALLATION_TIMEOUT = 2.5 * 60 * 1000;
// timeout for install preparation - 1 minute
export const INSTALL_PREPARATION_TIMEOUT = 2 * 60 * 1000;
// timeout for generating ISO
export const GENERATE_ISO_TIMEOUT = 2 * 60 * 1000;
// timeout for downloading files
export const FILE_DOWNLOAD_TIMEOUT = 60 * 1000;
// timeout for downloading the ISO image
export const ISO_DOWNLOAD_TIMEOUT = 30 * 60 * 1000;
// timeout for cluster installation to finish - 1.5 hour
export const CLUSTER_CREATION_TIMEOUT = 90 * 60 * 1000;
