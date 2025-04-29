
import { ScanRequest, ScanResult, PortResult, PortStatus } from '../types/scan';

// Common port service mapping (simplified)
const commonPorts: Record<number, string> = {
  20: 'FTP Data',
  21: 'FTP Control',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  143: 'IMAP',
  443: 'HTTPS',
  465: 'SMTPS',
  587: 'SMTP Submission',
  993: 'IMAPS',
  995: 'POP3S',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  8080: 'HTTP Alternate',
  8443: 'HTTPS Alternate',
};

// Function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Function to validate IP address format
export const isValidIpAddress = (ip: string): boolean => {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

// Simulated port scan function
export const scanPorts = async (request: ScanRequest): Promise<ScanResult> => {
  const startTime = Date.now();
  const { ipAddress, portRange } = request;
  
  // Basic validation
  if (!isValidIpAddress(ipAddress)) {
    return {
      id: generateId(),
      timestamp: Date.now(),
      ipAddress,
      portRange,
      ports: [],
      status: 'error',
      error: 'Invalid IP address format'
    };
  }
  
  // Create initial scan result
  const scanResult: ScanResult = {
    id: generateId(),
    timestamp: Date.now(),
    ipAddress,
    portRange,
    ports: [],
    status: 'in-progress'
  };
  
  try {
    // This is a browser-based simulation since real port scanning requires backend server access
    // In a real implementation, this would make API calls to a backend service
    
    const ports: PortResult[] = [];
    const totalPorts = portRange.end - portRange.start + 1;
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate simulated results
    for (let port = portRange.start; port <= portRange.end; port++) {
      // Generate a pseudo-random but deterministic result based on IP and port
      const hash = hashCode(`${ipAddress}:${port}`);
      let status: PortStatus;
      
      // Distribution: ~10% open, ~70% closed, ~20% filtered
      if (hash % 100 < 10) {
        status = 'open';
      } else if (hash % 100 < 80) {
        status = 'closed';
      } else {
        status = 'filtered';
      }
      
      ports.push({
        port,
        status,
        service: status === 'open' && commonPorts[port] ? commonPorts[port] : undefined
      });
      
      // If scanning many ports, simulate progressive updates
      if (totalPorts > 50 && (port - portRange.start) % 20 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Update scan result
    scanResult.ports = ports;
    scanResult.status = 'completed';
    scanResult.duration = Date.now() - startTime;
    
    return scanResult;
  } catch (error) {
    console.error('Scan error:', error);
    return {
      ...scanResult,
      status: 'error',
      error: 'Scan failed due to an error',
      duration: Date.now() - startTime
    };
  }
};

// Simple hash function to generate pseudo-random but consistent results
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate scan report text
export const generateScanReport = (scan: ScanResult): string => {
  if (scan.status !== 'completed') {
    return `Scan for ${scan.ipAddress} is not complete.`;
  }
  
  const openPorts = scan.ports.filter(p => p.status === 'open');
  const timestamp = new Date(scan.timestamp).toISOString();
  
  let report = `# Network Scan Report\n\n`;
  report += `## Target Information\n`;
  report += `- IP Address: ${scan.ipAddress}\n`;
  if (scan.hostname) report += `- Hostname: ${scan.hostname}\n`;
  report += `- Scan Date: ${timestamp}\n`;
  report += `- Duration: ${scan.duration ? (scan.duration / 1000).toFixed(2) + 's' : 'N/A'}\n\n`;
  
  report += `## Scan Summary\n`;
  report += `- Port Range: ${scan.portRange.start}-${scan.portRange.end}\n`;
  report += `- Open Ports: ${openPorts.length}\n`;
  report += `- Closed Ports: ${scan.ports.filter(p => p.status === 'closed').length}\n`;
  report += `- Filtered Ports: ${scan.ports.filter(p => p.status === 'filtered').length}\n\n`;
  
  report += `## Open Ports\n`;
  if (openPorts.length === 0) {
    report += `No open ports found.\n\n`;
  } else {
    report += `| Port | Service |\n`;
    report += `|------|--------|\n`;
    openPorts.forEach(port => {
      report += `| ${port.port} | ${port.service || 'Unknown'} |\n`;
    });
    report += '\n';
  }
  
  return report;
};

// Save scan to local storage
export const saveScan = (scan: ScanResult): void => {
  try {
    const savedScans = getSavedScans();
    savedScans.unshift(scan); // Add to beginning
    
    // Limit to 10 saved scans
    const limitedScans = savedScans.slice(0, 10);
    localStorage.setItem('savedScans', JSON.stringify(limitedScans));
  } catch (error) {
    console.error('Error saving scan:', error);
  }
};

// Get all saved scans from local storage
export const getSavedScans = (): ScanResult[] => {
  try {
    const savedScans = localStorage.getItem('savedScans');
    return savedScans ? JSON.parse(savedScans) : [];
  } catch (error) {
    console.error('Error getting saved scans:', error);
    return [];
  }
};

// Delete a scan from local storage
export const deleteScan = (scanId: string): void => {
  try {
    const savedScans = getSavedScans();
    const updatedScans = savedScans.filter(scan => scan.id !== scanId);
    localStorage.setItem('savedScans', JSON.stringify(updatedScans));
  } catch (error) {
    console.error('Error deleting scan:', error);
  }
};

// Clear all saved scans
export const clearAllScans = (): void => {
  try {
    localStorage.removeItem('savedScans');
  } catch (error) {
    console.error('Error clearing scans:', error);
  }
};
