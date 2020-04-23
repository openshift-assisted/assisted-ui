import Humanize from 'humanize-plus';
import { BlockDevice, HardwareInfo, Nic } from '../../api/types';

export type HostRowHardwareInfo = {
  cpu: string;
  memory: string;
  disk: string;
};

export const getHardwareInfo = (hwInfoString: string): HardwareInfo | undefined => {
  try {
    const hwInfo = JSON.parse(hwInfoString);
    console.log('--- hwInfo: ', JSON.stringify(hwInfo));
    return hwInfo;
  } catch (e) {
    console.error('Failed to parse Hardware Info', e, hwInfoString);
  }
  return undefined;
};

export const getMemoryCapacity = (hwInfo: HardwareInfo) => hwInfo.memory?.[0]?.total || 0;

export const getDisks = (hwInfo: HardwareInfo): BlockDevice[] =>
  hwInfo['block-devices']?.filter((device: BlockDevice) => device['device-type'] === 'disk') || [];

export const getNics = (hwInfo: HardwareInfo): Nic[] => hwInfo.nics || [];

export const getHostRowHardwareInfo = (hwInfo: HardwareInfo): HostRowHardwareInfo => ({
  cpu: `${hwInfo.cpu?.cpus}x ${Humanize.formatNumber(hwInfo.cpu?.['cpu-mhz'] || 0)} MHz`,
  memory: Humanize.fileSize(getMemoryCapacity(hwInfo)),
  disk: Humanize.fileSize(
    getDisks(hwInfo).reduce(
      (diskSize: number, device: BlockDevice) => diskSize + (device?.size || 0),
      0,
    ) || 0,
  ),
});
