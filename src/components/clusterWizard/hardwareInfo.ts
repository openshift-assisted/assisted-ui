import Humanize from 'humanize-plus';
import { BlockDevice, Introspection, Nic } from '../../api/types';

export type HostRowHardwareInfo = {
  cpu: string;
  memory: string;
  disk: string;
  disks: BlockDevice[];
  nics: Nic[];
};

export const getHardwareInfo = (hwInfoString: string): Introspection | undefined => {
  try {
    const hwInfo = JSON.parse(hwInfoString);
    return hwInfo;
  } catch (e) {
    console.error('Failed to parse Hardware Info', e, hwInfoString);
  }
  return undefined;
};

export const getMemoryCapacity = (hwInfo: Introspection) => hwInfo.memory?.[0]?.total || 0;

export const getDisks = (hwInfo: Introspection): BlockDevice[] =>
  hwInfo['block-devices']?.filter((device: BlockDevice) => device['device-type'] === 'disk') || [];

export const getNics = (hwInfo: Introspection): Nic[] => hwInfo.nics || [];

export const getHumanizedCpuClockSpeed = (hwInfo: Introspection) =>
  Humanize.formatNumber(hwInfo.cpu?.['cpu-mhz'] || 0);

export const getHostRowHardwareInfo = (hwInfo: Introspection): HostRowHardwareInfo => ({
  cpu: `${hwInfo.cpu?.cpus ? `${hwInfo.cpu?.cpus}x ` : ''}${getHumanizedCpuClockSpeed(hwInfo)} MHz`,
  memory: Humanize.fileSize(getMemoryCapacity(hwInfo)),
  disk: Humanize.fileSize(
    getDisks(hwInfo).reduce(
      (diskSize: number, device: BlockDevice) => diskSize + (device?.size || 0),
      0,
    ) || 0,
  ),
  disks: getDisks(hwInfo),
  nics: getNics(hwInfo),
});
