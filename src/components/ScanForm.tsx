
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { isValidIpAddress } from '@/utils/scanUtils';
import { ScanRequest } from '@/types/scan';
import { Search } from 'lucide-react';

interface ScanFormProps {
  onStartScan: (request: ScanRequest) => void;
  isScanning: boolean;
}

const DEFAULT_START_PORT = 1;
const DEFAULT_END_PORT = 1000;
const MAX_PORT = 65535;

const ScanForm: React.FC<ScanFormProps> = ({ onStartScan, isScanning }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [startPort, setStartPort] = useState(DEFAULT_START_PORT);
  const [endPort, setEndPort] = useState(DEFAULT_END_PORT);
  const [ipError, setIpError] = useState('');
  const [portError, setPortError] = useState('');

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIpAddress(value);
    setIpError('');
  };

  const handleStartPortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setStartPort(value);
      setPortError('');
    }
  };

  const handleEndPortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setEndPort(value);
      setPortError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!ipAddress) {
      setIpError('IP address is required');
      return;
    }
    
    if (!isValidIpAddress(ipAddress)) {
      setIpError('Invalid IP address format');
      return;
    }
    
    if (startPort < 1 || startPort > MAX_PORT) {
      setPortError(`Start port must be between 1 and ${MAX_PORT}`);
      return;
    }
    
    if (endPort < 1 || endPort > MAX_PORT) {
      setPortError(`End port must be between 1 and ${MAX_PORT}`);
      return;
    }
    
    if (startPort > endPort) {
      setPortError('Start port must be less than or equal to end port');
      return;
    }
    
    // Submit the scan request
    onStartScan({
      ipAddress,
      portRange: {
        start: startPort,
        end: endPort
      }
    });
  };

  const handleQuickScan = () => {
    if (!ipAddress || !isValidIpAddress(ipAddress)) {
      setIpError('Please enter a valid IP address first');
      return;
    }

    onStartScan({
      ipAddress,
      portRange: {
        start: 1,
        end: 1000
      }
    });
  };

  const handleCommonPortScan = () => {
    if (!ipAddress || !isValidIpAddress(ipAddress)) {
      setIpError('Please enter a valid IP address first');
      return;
    }

    // Scan only common ports
    const commonPorts = [20, 21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 3389, 5432, 8080, 8443];
    const minPort = Math.min(...commonPorts);
    const maxPort = Math.max(...commonPorts);
    
    setStartPort(minPort);
    setEndPort(maxPort);
    
    onStartScan({
      ipAddress,
      portRange: {
        start: minPort,
        end: maxPort
      }
    });
  };

  return (
    <Card className="scanner-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl cyber-text flex items-center gap-2">
          <Search size={24} className="text-scanner-accent" />
          Port Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ipAddress" className="cyber-text">Target IP Address</Label>
            <Input
              id="ipAddress"
              placeholder="e.g., 192.168.1.1"
              value={ipAddress}
              onChange={handleIpChange}
              className="scanner-input font-code"
              disabled={isScanning}
            />
            {ipError && <p className="text-scanner-danger text-sm mt-1">{ipError}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startPort" className="cyber-text">Start Port</Label>
              <Input
                id="startPort"
                type="number"
                min={1}
                max={MAX_PORT}
                value={startPort}
                onChange={handleStartPortChange}
                className="scanner-input font-code"
                disabled={isScanning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endPort" className="cyber-text">End Port</Label>
              <Input
                id="endPort"
                type="number"
                min={1}
                max={MAX_PORT}
                value={endPort}
                onChange={handleEndPortChange}
                className="scanner-input font-code"
                disabled={isScanning}
              />
            </div>
          </div>
          {portError && <p className="text-scanner-danger text-sm mt-1">{portError}</p>}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit" 
                    className="bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80 font-bold"
                    disabled={isScanning}
                  >
                    {isScanning ? 'Scanning...' : 'Start Scan'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scan the specified port range</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleQuickScan}
                    className="border-scanner-accent text-scanner-accent hover:bg-scanner-accent/10"
                    disabled={isScanning}
                  >
                    Quick Scan
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scan ports 1-1000</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleCommonPortScan}
                    className="border-scanner-accent text-scanner-accent hover:bg-scanner-accent/10"
                    disabled={isScanning}
                  >
                    Common Ports
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scan most common service ports</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScanForm;
