export type ImageTableRow = string[];
export type ImageTableRows = ImageTableRow[];

export enum ImageStatus {
  creating = 'creating',
  ready = 'ready',
  error = 'error',
}

export type Image = {
  kind: string;
  id: string;
  href: string;
  name: string;
  description?: string;
  namespace: string;
  proxy_ip?: string;
  proxy_port?: string;
  status: ImageStatus;
  download_url?: string;
};
