export const VERSION = process.env.REACT_APP_VERSION;
export const GIT_SHA = process.env.REACT_APP_GIT_SHA;

export const SERVICE_LABELS: { [key in string]: string } = {
  assistedInstaller: 'Assisted Installer',
  assistedInstallerService: 'Assisted Installer Service',
  discoveryAgent: 'Discovery Agent',
  ignitionManifestsAndKubeconfigGenerate: 'Ignition Manifests and Kubeconfig Generate',
  imageBuilder: 'Image Builder',
};
