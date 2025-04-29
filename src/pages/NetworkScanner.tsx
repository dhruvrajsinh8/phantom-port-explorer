
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Monitor, Search, Server } from 'lucide-react';
import { toast } from 'sonner';

// Network scan dummy data
const networkDevices = [
  { id: 1, name: 'Router', ip: '192.168.1.1', mac: 'AA:BB:CC:11:22:33', manufacturer: 'Cisco', status: 'online', lastSeen: '2 sec ago', services: ['HTTP', 'SSH', 'DNS'] },
  { id: 2, name: 'Desktop PC', ip: '192.168.1.100', mac: 'AA:BB:CC:11:22:44', manufacturer: 'Dell', status: 'online', lastSeen: '5 sec ago', services: ['HTTP', 'SMB'] },
  { id: 3, name: 'Smart TV', ip: '192.168.1.101', mac: 'AA:BB:CC:11:22:55', manufacturer: 'Samsung', status: 'online', lastSeen: '10 sec ago', services: ['DLNA', 'HTTP'] },
  { id: 4, name: 'Smartphone', ip: '192.168.1.102', mac: 'AA:BB:CC:11:22:66', manufacturer: 'Apple', status: 'online', lastSeen: '1 min ago', services: ['mDNS'] },
  { id: 5, name: 'IoT Device', ip: '192.168.1.103', mac: 'AA:BB:CC:11:22:77', manufacturer: 'Xiaomi', status: 'offline', lastSeen: '1 hour ago', services: ['HTTP'] },
  { id: 6, name: 'Gaming Console', ip: '192.168.1.104', mac: 'AA:BB:CC:11:22:88', manufacturer: 'Sony', status: 'online', lastSeen: '30 sec ago', services: ['HTTP', 'PSN'] },
  { id: 7, name: 'Network Printer', ip: '192.168.1.105', mac: 'AA:BB:CC:11:22:99', manufacturer: 'HP', status: 'online', lastSeen: '5 min ago', services: ['HTTP', 'IPP'] },
  { id: 8, name: 'Smart Speaker', ip: '192.168.1.106', mac: 'AA:BB:CC:11:33:00', manufacturer: 'Amazon', status: 'offline', lastSeen: '3 hours ago', services: ['mDNS'] },
];

// Dummy web activity data
const webActivities = [
  { id: 1, device: 'Desktop PC', website: 'google.com', timestamp: '12:45:33', status: 'visited' },
  { id: 2, device: 'Smartphone', website: 'facebook.com', timestamp: '12:43:22', status: 'visited' },
  { id: 3, device: 'Desktop PC', website: 'youtube.com', timestamp: '12:40:10', status: 'visited' },
  { id: 4, device: 'Smart TV', website: 'netflix.com', timestamp: '12:35:45', status: 'blocked' },
  { id: 5, device: 'Desktop PC', website: 'github.com', timestamp: '12:30:15', status: 'visited' },
  { id: 6, device: 'Smartphone', website: 'twitter.com', timestamp: '12:28:01', status: 'visited' },
  { id: 7, device: 'Gaming Console', website: 'twitch.tv', timestamp: '12:15:33', status: 'visited' },
  { id: 8, device: 'Desktop PC', website: 'malware.site', timestamp: '12:10:44', status: 'blocked' },
];

const NetworkScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  
  const handleStartScan = () => {
    setIsScanning(true);
    toast.info("Network scan started");
    
    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      toast.success("Network scan completed");
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-scanner-bg overflow-x-hidden">
      {/* Scanline effect */}
      <div className="scanline" />
      
      <div className="container py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold cyber-text glow">
            Network Scanner
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover and monitor devices on your network
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Scan controls */}
            <Card className="scanner-card">
              <CardHeader>
                <CardTitle className="cyber-text flex items-center gap-2">
                  <Search className="h-6 w-6" />
                  Network Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-2">Scan your network to discover connected devices</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>192.168.1.0/24</Badge>
                      <Badge variant="outline">Passive Mode</Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStartScan} 
                    disabled={isScanning}
                    className="bg-scanner-warning text-scanner-bg hover:bg-scanner-warning/80"
                  >
                    {isScanning ? (
                      <>
                        <span className="mr-2">Scanning</span>
                        <div className="h-4 w-4 rounded-full border-2 border-scanner-bg border-t-transparent animate-spin"></div>
                      </>
                    ) : scanCompleted ? "Scan Again" : "Start Scan"}
                  </Button>
                </div>
                
                {isScanning && (
                  <div className="mt-4 p-4 border border-scanner-warning/30 rounded-md bg-scanner-warning/5">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-scanner-warning animate-pulse" />
                      <p className="text-scanner-warning">Scanning network for devices...</p>
                    </div>
                    <div className="mt-2 w-full bg-scanner-bg/50 rounded-full h-2 overflow-hidden">
                      <div className="bg-scanner-warning h-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Tabs for different views */}
            <Card className="scanner-card">
              <Tabs defaultValue="devices" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="devices">
                    <Server className="h-4 w-4 mr-2" />
                    Devices
                  </TabsTrigger>
                  <TabsTrigger value="web-activity">
                    <Activity className="h-4 w-4 mr-2" />
                    Web Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="devices" className="p-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {networkDevices.map(device => (
                        <div 
                          key={device.id} 
                          className={`p-4 rounded-md border ${device.status === 'online' ? 'border-scanner-success/30' : 'border-scanner-danger/30'}`}
                        >
                          <div className="flex flex-wrap justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">{device.name}</h3>
                                <Badge variant="outline" className={device.status === 'online' ? 'border-scanner-success text-scanner-success' : 'border-scanner-danger text-scanner-danger'}>
                                  {device.status}
                                </Badge>
                              </div>
                              <p className="text-sm font-code text-muted-foreground">{device.ip} ({device.mac})</p>
                              <p className="text-xs mt-1">Manufacturer: {device.manufacturer} • Last seen: {device.lastSeen}</p>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Services</p>
                              <div className="flex flex-wrap gap-1">
                                {device.services.map((service, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs py-0">{service}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="web-activity" className="p-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {webActivities.map(activity => (
                        <div 
                          key={activity.id} 
                          className={`p-3 rounded-md border ${activity.status === 'visited' ? 'border-scanner-success/30' : 'border-scanner-danger/30'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{activity.website}</span>
                                <Badge className={activity.status === 'visited' ? 'bg-scanner-success/20 text-scanner-success' : 'bg-scanner-danger/20 text-scanner-danger'}>
                                  {activity.status}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">{activity.device}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Sidebar - Stats and tools */}
          <div className="md:col-span-1 space-y-6">
            <Card className="scanner-card">
              <CardHeader>
                <CardTitle className="cyber-text flex items-center gap-2">
                  <Monitor className="h-6 w-6" />
                  Network Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Active Devices</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">6</span>
                      <Badge className="bg-scanner-success text-scanner-bg">Online</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Inactive Devices</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">2</span>
                      <Badge className="bg-scanner-danger text-scanner-bg">Offline</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-muted-foreground text-sm mb-1">Web Activity</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Visited</span>
                        <span className="text-sm">6</span>
                      </div>
                      <div className="w-full bg-scanner-bg/50 rounded-full h-1.5">
                        <div className="bg-scanner-success h-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Blocked</span>
                        <span className="text-sm">2</span>
                      </div>
                      <div className="w-full bg-scanner-bg/50 rounded-full h-1.5">
                        <div className="bg-scanner-danger h-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-muted-foreground text-sm mb-2">IP Range</p>
                    <p className="font-code text-sm">192.168.1.0 - 192.168.1.255</p>
                    <p className="text-xs text-muted-foreground mt-1">CIDR: 192.168.1.0/24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="scanner-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg cyber-text">Scan Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Monitor className="mr-2 h-4 w-4" />
                    Traffic Analysis
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    Bandwidth Monitor
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Deep Packet Inspection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkScanner;
