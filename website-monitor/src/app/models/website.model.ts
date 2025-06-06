export interface Website {
  id: number;
  name: string;
  url: string;
  refreshInterval: number; // in seconds
  active: boolean;
}
