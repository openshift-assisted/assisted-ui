export interface IntrospectionDataState {
  [name: string]: IntrospectionData;
}

export interface IntrospectionData {
  name: string;
  inventory: Inventory;
}

export interface Inventory {
  disks: Disk[];
}

export interface Disk {
  size: number;
}
