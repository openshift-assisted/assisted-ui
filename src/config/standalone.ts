export const VERSION = process.env.REACT_APP_VERSION;
export const GIT_SHA = process.env.REACT_APP_GIT_SHA;

export const SERVICE_LABELS: { [key in string]: string } = {
  'assisted-installer': 'Assisted Installer',
  'assisted-installer-service': 'Assisted Installer Service',
  'discovery-agent': 'Discovery Agent',
  'ignition-manifests-and-kubeconfig-generate': 'Ignition Manifests and Kubeconfig Generate',
  'image-builder': 'Image Builder',
};
