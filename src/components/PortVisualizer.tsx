
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortResult } from '@/types/scan';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortVisualizerProps {
  ports: PortResult[];
  isLoading?: boolean;
}

const PortVisualizer: React.FC<PortVisualizerProps> = ({ ports, isLoading = false }) => {
  const openPorts = ports.filter(p => p.status === 'open');
  const closedPorts = ports.filter(p => p.status === 'closed');
  const filteredPorts = ports.filter(p => p.status === 'filtered');
  
  // Calculate percentages for summary
  const totalPorts = ports.length;
  const openPercent = totalPorts ? Math.round((openPorts.length / totalPorts) * 100) : 0;
  const closedPercent = totalPorts ? Math.round((closedPorts.length / totalPorts) * 100) : 0;
  const filteredPercent = totalPorts ? Math.round((filteredPorts.length / totalPorts) * 100) : 0;

  return (
    <Card className="scanner-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl cyber-text">Port Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="h-32 w-32 mx-auto rounded-full border-4 border-t-scanner-accent border-r-scanner-accent/30 border-b-scanner-accent/10 border-l-scanner-accent/60 animate-spin"></div>
            <p className="mt-4 text-scanner-accent animate-pulse">Analyzing ports...</p>
          </div>
        ) : ports.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>No port data available. Start a scan to see results.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-scanner-accent">Scan Summary</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-card p-3 rounded-md border border-scanner-success/30">
                  <p className="text-scanner-success text-2xl font-bold">{openPorts.length}</p>
                  <p className="text-sm">Open</p>
                </div>
                <div className="bg-card p-3 rounded-md border border-scanner-danger/30">
                  <p className="text-scanner-muted text-2xl font-bold">{closedPorts.length}</p>
                  <p className="text-sm">Closed</p>
                </div>
                <div className="bg-card p-3 rounded-md border border-scanner-warning/30">
                  <p className="text-scanner-warning text-2xl font-bold">{filteredPorts.length}</p>
                  <p className="text-sm">Filtered</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Open ({openPercent}%)</span>
                  <span>Closed ({closedPercent}%)</span>
                  <span>Filtered ({filteredPercent}%)</span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full">
                  <div 
                    className="bg-scanner-success" 
                    style={{ width: `${openPercent}%` }}
                  />
                  <div 
                    className="bg-scanner-danger/50" 
                    style={{ width: `${closedPercent}%` }}
                  />
                  <div 
                    className="bg-scanner-warning" 
                    style={{ width: `${filteredPercent}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Ports Detail Tabs */}
            <Tabs defaultValue="open">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="open" className="data-[state=active]:text-scanner-success">
                  Open ({openPorts.length})
                </TabsTrigger>
                <TabsTrigger value="filtered" className="data-[state=active]:text-scanner-warning">
                  Filtered ({filteredPorts.length})
                </TabsTrigger>
                <TabsTrigger value="closed" className="data-[state=active]:text-scanner-muted">
                  Closed ({closedPorts.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="open">
                <PortList ports={openPorts} statusClass="port-open" />
              </TabsContent>
              
              <TabsContent value="filtered">
                <PortList ports={filteredPorts} statusClass="port-filtered" />
              </TabsContent>
              
              <TabsContent value="closed">
                <PortList ports={closedPorts} statusClass="port-closed" />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface PortListProps {
  ports: PortResult[];
  statusClass: string;
}

const PortList: React.FC<PortListProps> = ({ ports, statusClass }) => {
  if (ports.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No ports in this category</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[240px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 py-2">
        {ports.map((port) => (
          <TooltipProvider key={port.port}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`text-center p-2 rounded border text-sm ${statusClass}`}>
                  <div className="font-bold">{port.port}</div>
                  {port.service && <div className="text-xs truncate">{port.service}</div>}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  <p>Port: {port.port}</p>
                  <p>Status: {port.status}</p>
                  {port.service && <p>Service: {port.service}</p>}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </ScrollArea>
  );
};

export default PortVisualizer;
