import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, Activity, Network, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NetworkGraph from '@/components/NetworkGraph';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Dummy data for network scanning
const networkDevices = [
  { id: 1, name: 'Router', ip: '192.168.1.1', type: 'networking', status: 'online', visited: true },
  { id: 2, name: 'Desktop PC', ip: '192.168.1.100', type: 'computer', status: 'online', visited: true },
  { id: 3, name: 'Smart TV', ip: '192.168.1.101', type: 'media', status: 'online', visited: false },
  { id: 4, name: 'Smartphone', ip: '192.168.1.102', type: 'mobile', status: 'online', visited: true },
  { id: 5, name: 'IoT Device', ip: '192.168.1.103', type: 'iot', status: 'offline', visited: false },
  { id: 6, name: 'Gaming Console', ip: '192.168.1.104', type: 'gaming', status: 'online', visited: false },
  { id: 7, name: 'Network Printer', ip: '192.168.1.105', type: 'peripheral', status: 'online', visited: true },
  { id: 8, name: 'Smart Speaker', ip: '192.168.1.106', type: 'iot', status: 'offline', visited: false },
];

const Home = () => {
  const [highlightedDevice, setHighlightedDevice] = useState<number | null>(null);
  const [graphStats, setGraphStats] = useState({
    nodeCount: 0,
    connectionCount: 0,
    activeNodes: 0
  });
  
  // Simulate updating stats
  useEffect(() => {
    // Initial stats
    setGraphStats({
      nodeCount: 35,
      connectionCount: 68,
      activeNodes: 29
    });
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      setGraphStats(prev => ({
        ...prev,
        activeNodes: Math.max(20, Math.min(35, prev.activeNodes + Math.floor(Math.random() * 3) - 1))
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-scanner-bg overflow-x-hidden">
      {/* Scanline effect */}
      <div className="scanline" />
      
      <div className="container py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold cyber-text glow mb-4">
            Network Intelligence Suite
          </h1>
          <p className="mt-2 text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced scanning and visualization tools for your network infrastructure
          </p>
        </header>
        
        {/* Interactive Network Graph with Stats */}
        <div className="mb-12 scanner-card p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl cyber-text">Network Topology</h2>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-scanner-bg/80 p-2 rounded-md border border-scanner-accent/30">
                    <div className="h-2 w-2 rounded-full bg-scanner-accent animate-pulse"></div>
                    <span className="text-xs">{graphStats.nodeCount} Devices</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total devices on network</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-scanner-bg/80 p-2 rounded-md border border-scanner-accent/30">
                    <div className="h-2 w-2 rounded-full bg-scanner-success animate-pulse"></div>
                    <span className="text-xs">{graphStats.activeNodes} Active</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Devices currently transmitting data</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-scanner-bg/80 p-2 rounded-md border border-scanner-accent/30">
                    <div className="h-2 w-2 rounded-full bg-scanner-warning animate-pulse"></div>
                    <span className="text-xs">{graphStats.connectionCount} Connections</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Active network connections</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="h-[40vh] relative">
            <NetworkGraph 
              highlightedNode={highlightedDevice} 
              onNodeClick={(id) => setHighlightedDevice(id === highlightedDevice ? null : id)} 
            />
          </div>
          
          <div className="absolute bottom-4 right-4 bg-scanner-bg/70 p-2 rounded-md border border-scanner-accent/30 text-xs flex items-center gap-2">
            <Info className="h-3 w-3 text-scanner-accent" />
            <span>Hover over nodes to inspect · Click to select</span>
          </div>
        </div>
        
        {/* Scan Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Port Scanner */}
          <Link to="/port-scanner" className="group">
            <Card className="scanner-card h-full transition-all duration-300 hover:shadow-lg hover:shadow-scanner-accent/20 hover:-translate-y-1">
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-scanner-accent/5 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Server className="h-8 w-8 text-scanner-accent" />
                    <h2 className="text-2xl cyber-text">Port Scanner</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Scan for open ports on target systems and identify services running on each port.
                  </p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <Badge className="bg-scanner-accent text-scanner-bg">IP Range Scanning</Badge>
                    <Badge className="bg-scanner-accent/30">Service Detection</Badge>
                    <Badge className="bg-scanner-accent/30">Vulnerability Assessment</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 p-4">
                <Button className="w-full bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80 group-hover:shadow-glow flex items-center gap-2">
                  <span>Launch Scanner</span>
                  <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
          
          {/* Network Scanner */}
          <Link to="/network-scanner" className="group">
            <Card className="scanner-card h-full transition-all duration-300 hover:shadow-lg hover:shadow-scanner-accent/20 hover:-translate-y-1">
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-scanner-warning/5 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Network className="h-8 w-8 text-scanner-warning" />
                    <h2 className="text-2xl cyber-text">Network Scanner</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Discover devices on your network, monitor traffic, and analyze web activity in real-time.
                  </p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    <Badge className="bg-scanner-warning text-scanner-bg">Device Discovery</Badge>
                    <Badge className="bg-scanner-warning/30">Traffic Analysis</Badge>
                    <Badge className="bg-scanner-warning/30">Web Activity</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 p-4">
                <Button className="w-full bg-scanner-warning text-scanner-bg hover:bg-scanner-warning/80 group-hover:shadow-glow-warning flex items-center gap-2">
                  <span>Launch Network Scanner</span>
                  <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
        
        {/* Network Devices List */}
        <Card className="scanner-card mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl cyber-text mb-4">Network Devices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {networkDevices.map(device => (
                <HoverCard key={device.id}>
                  <HoverCardTrigger asChild>
                    <div 
                      className={`
                        p-4 rounded-md border cursor-pointer transition-all duration-200
                        ${highlightedDevice === device.id ? 'border-scanner-accent bg-scanner-accent/10' : 'border-border bg-card'}
                        ${device.status === 'online' ? 'hover:border-scanner-success/50' : 'hover:border-scanner-danger/50'}
                      `}
                      onClick={() => setHighlightedDevice(device.id === highlightedDevice ? null : device.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{device.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={device.status === 'online' ? 'border-scanner-success text-scanner-success' : 'border-scanner-danger text-scanner-danger'}
                        >
                          {device.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-code text-muted-foreground mb-1">{device.ip}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{device.type}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{device.visited ? 'Web activity' : 'No activity'}</span>
                          <div className={`h-2 w-2 rounded-full ${device.visited ? 'bg-scanner-warning' : 'bg-muted'}`}></div>
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-popover/95 backdrop-blur-sm border-scanner-accent/30">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold">{device.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">IP Address</p>
                          <p className="font-code">{device.ip}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className={device.status === 'online' ? 'text-scanner-success' : 'text-scanner-danger'}>
                            {device.status === 'online' ? '● Online' : '○ Offline'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="capitalize">{device.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Web Activity</p>
                          <p>{device.visited ? 'Active' : 'None detected'}</p>
                        </div>
                      </div>
                      <div className="pt-2 mt-2 border-t border-border">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full border-scanner-accent text-scanner-accent hover:bg-scanner-accent/10"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <footer className="mt-10 text-center text-sm text-muted-foreground">
          <p>Network Intelligence Suite - For Educational Purposes Only</p>
          <p className="text-xs mt-1">
            This is a demonstration tool and uses simulated scan data. No actual network scanning is performed.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
