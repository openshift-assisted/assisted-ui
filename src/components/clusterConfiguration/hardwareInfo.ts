import Humanize from 'humanize-plus';
import { BlockDevice, Introspection, Nic } from '../../api/types';
import { DASH } from '../constants';

export type HostRowHardwareInfo = {
  cores: string;
  cpuSpeed: string;
  memory: string;
  disk: string;
  disks: BlockDevice[];
  nics: Nic[];
};

export const getHardwareInfo = (hwInfoString: string): Introspection | undefined => {
  if (hwInfoString) {
    try {
      const hwInfo = JSON.parse(hwInfoString);
      return hwInfo;
    } catch (e) {
      console.error('Failed to parse Hardware Info', e, hwInfoString);
    }
  } else {
    console.info('Empty hardwareInfo received.');
  }
  return undefined;
};

export const getMemoryCapacity = (hwInfo: Introspection) => hwInfo.memory?.[0]?.total || 0;

export const getDisks = (hwInfo: Introspection): BlockDevice[] =>
  hwInfo['block-devices']?.filter((device: BlockDevice) => device['device-type'] === 'disk') || [];

export const getNics = (hwInfo: Introspection): Nic[] => hwInfo.nics || [];

export const getHumanizedCpuClockSpeed = (hwInfo: Introspection) =>
  Humanize.formatNumber(hwInfo.cpu?.['cpu-mhz'] || 0);

export const getHumanizedTime = (time: string | undefined): string => {
  if (!time) {
    return DASH;
  }

  const date = new Date(time);
  return date.toLocaleString();
};

export const getHostRowHardwareInfo = (hwInfo: Introspection): HostRowHardwareInfo => {
  let cores = DASH;
  let cpuSpeed = DASH;
  if (hwInfo.cpu?.cpus) {
    cpuSpeed = `${hwInfo.cpu?.cpus}x ${getHumanizedCpuClockSpeed(hwInfo)} MHz`;
    // already total per mahcine (cores x sockets). WIll be changed by https://github.com/filanov/bm-inventory/pull/108
    cores = hwInfo.cpu?.cpus.toString();
  }

  let memory = DASH;
  if (getMemoryCapacity(hwInfo)) {
    memory = Humanize.fileSize(getMemoryCapacity(hwInfo));
  }

  let disk = DASH;
  const disksCapacity = getDisks(hwInfo).reduce(
    (diskSize: number, device: BlockDevice) => diskSize + (device?.size || 0),
    0,
  );
  if (disksCapacity) {
    disk = Humanize.fileSize(disksCapacity);
  }

  return {
    cores,
    cpuSpeed,
    memory,
    disk,
    disks: getDisks(hwInfo),
    nics: getNics(hwInfo),
  };
};
