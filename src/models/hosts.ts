export interface Host {
  name: string;
  ip: string;
  status: string;
  cpu: number;
  memory: number;
  disk: number;
  type: string;
}

export type HostTableRow = string[];
export type HostTableRows = HostTableRow[];
