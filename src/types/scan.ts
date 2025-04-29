
export type PortStatus = 'open' | 'closed' | 'filtered' | 'unknown';

export interface PortResult {
  port: number;
  status: PortStatus;
  service?: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  ipAddress: string;
  hostname?: string;
  portRange: {
    start: number;
    end: number;
  };
  ports: PortResult[];
  status: 'completed' | 'in-progress' | 'error';
  error?: string;
  duration?: number;
}

export interface ScanRequest {
  ipAddress: string;
  portRange: {
    start: number;
    end: number;
  };
}
