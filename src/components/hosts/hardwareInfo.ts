import Humanize from 'humanize-plus';
import { Disk, Inventory } from '../../api/types';
import { DASH } from '../constants';
import { HumanizedSortable } from '../ui/table/utils';

export type HostRowHardwareInfo = {
  serialNumber: string;
  cores: HumanizedSortable;
  cpuSpeed: string;
  memory: HumanizedSortable;
  disk: HumanizedSortable;
};

export const getMemoryCapacity = (inventory: Inventory) => inventory.memory?.physicalBytes || 0;

export const getHumanizedCpuClockSpeed = (inventory: Inventory) =>
  Humanize.formatNumber(inventory.cpu?.frequency || 0);

export const getHumanizedTime = (time: string | undefined): HumanizedSortable => {
  if (!time) {
    return {
      title: DASH,
      sortableValue: 0,
    };
  }

  const date = new Date(time);
  return {
    title: date.toLocaleString(),
    sortableValue: date.getTime(),
  };
};

const EMPTY = {
  title: DASH,
  sortableValue: 0,
};

export const getHostRowHardwareInfo = (inventory: Inventory): HostRowHardwareInfo => {
  let cores = EMPTY;
  let memory = EMPTY;
  let disk = EMPTY;
  let cpuSpeed = DASH;

  if (inventory.cpu?.count) {
    cpuSpeed = `${inventory.cpu?.count}x ${getHumanizedCpuClockSpeed(inventory)} MHz`;
    cores = {
      title: inventory.cpu?.count.toString(),
      sortableValue: inventory.cpu?.count,
    };
  }

  const memCapacity = getMemoryCapacity(inventory);
  if (memCapacity) {
    memory = {
      title: Humanize.fileSize(memCapacity),
      sortableValue: memCapacity,
    };
  }

  const disksCapacity = (inventory.disks || []).reduce(
    (diskSize: number, disk: Disk) => diskSize + (disk.sizeBytes || 0),
    0,
  );
  if (disksCapacity) {
    disk = {
      title: Humanize.fileSize(disksCapacity),
      sortableValue: disksCapacity,
    };
  }

  return {
    serialNumber: inventory.systemVendor?.serialNumber || DASH,
    cores,
    cpuSpeed,
    memory,
    disk,
  };
};
