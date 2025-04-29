
import React, { useState } from 'react';
import { Terminal, Activity, Check, ChevronRight, AlertTriangle, Download } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';

const Integrations = () => {
  const [nmapPath, setNmapPath] = useState('');
  const [wiresharkPath, setWiresharkPath] = useState('');
  const [isSimulation, setIsSimulation] = useState(true);
  
  const handleNmapConnect = () => {
    // Simulated connection success
    toast({
      title: "Integration Connected",
      description: "Nmap integration has been successfully configured.",
      variant: "default"
    });
  };
  
  const handleWiresharkConnect = () => {
    // Simulated connection success
    toast({
      title: "Integration Connected",
      description: "Wireshark integration has been successfully configured.",
      variant: "default"
    });
  };
  
  return (
    <div className="min-h-screen bg-scanner-bg">
      <div className="scanline" />
      <Navbar />
      
      <div className="container py-8 mt-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold cyber-text glow mb-4">External Integrations</h1>
          <p className="mt-2 text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect Network Intelligence Suite with powerful external tools to enhance your analysis capabilities
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <Card className="scanner-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl cyber-text">Integration Settings</h2>
                <Badge variant="outline" className="ml-2 bg-scanner-bg border-scanner-accent/30 text-scanner-accent">
                  Demo Mode
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 py-4 border-b border-scanner-accent/10">
                <Checkbox 
                  id="simulation-mode" 
                  checked={isSimulation} 
                  onCheckedChange={() => setIsSimulation(!isSimulation)} 
                  className="border-scanner-accent data-[state=checked]:bg-scanner-accent data-[state=checked]:border-scanner-accent"
                />
                <label htmlFor="simulation-mode" className="text-sm text-muted-foreground cursor-pointer">
                  Enable simulation mode (no actual connections will be made to external tools)
                </label>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2 mb-6">
                Note: For full functionality, disable simulation mode and configure actual tool paths below.
              </p>
              
              <Tabs defaultValue="nmap" className="mt-6">
                <TabsList className="grid w-full grid-cols-2 bg-scanner-bg border border-scanner-accent/20">
                  <TabsTrigger value="nmap" className="data-[state=active]:bg-scanner-accent/10">
                    Nmap Integration
                  </TabsTrigger>
                  <TabsTrigger value="wireshark" className="data-[state=active]:bg-scanner-accent/10">
                    Wireshark Integration
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="nmap" className="mt-4">
                  <div className="space-y-6">
                    <div className="p-4 bg-scanner-bg/70 border border-scanner-accent/20 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                            <Terminal className="h-5 w-5 text-scanner-accent" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">Nmap Scanner</h3>
                            <p className="text-sm text-muted-foreground">Advanced network discovery and security auditing</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-scanner-success/10 text-scanner-success border-scanner-success/30">
                          <Check className="mr-1 h-3 w-3" /> Available
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Nmap Executable Path</label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="/usr/bin/nmap" 
                            className="scanner-input flex-1" 
                            value={nmapPath}
                            onChange={(e) => setNmapPath(e.target.value)}
                          />
                          <Button variant="outline" className="border-scanner-accent/30 text-scanner-accent">
                            Browse
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Default Scan Options</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Checkbox id="option-syn" className="border-scanner-accent data-[state=checked]:bg-scanner-accent" />
                            <label htmlFor="option-syn" className="text-sm">SYN Scan (-sS)</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="option-service" className="border-scanner-accent data-[state=checked]:bg-scanner-accent" defaultChecked />
                            <label htmlFor="option-service" className="text-sm">Version Detection (-sV)</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="option-os" className="border-scanner-accent data-[state=checked]:bg-scanner-accent" defaultChecked />
                            <label htmlFor="option-os" className="text-sm">OS Detection (-O)</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="option-aggressive" className="border-scanner-accent data-[state=checked]:bg-scanner-accent" />
                            <label htmlFor="option-aggressive" className="text-sm">Aggressive Scan (-A)</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-scanner-accent/10">
                        <Button 
                          className="bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80"
                          onClick={handleNmapConnect}
                        >
                          Connect Nmap Integration
                        </Button>
                        
                        {!nmapPath && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <AlertTriangle className="inline h-3 w-3 mr-1" />
                            In simulation mode, scanning will use simulated data.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="wireshark" className="mt-4">
                  <div className="space-y-6">
                    <div className="p-4 bg-scanner-bg/70 border border-scanner-accent/20 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-scanner-warning/10 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-scanner-warning" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">Wireshark</h3>
                            <p className="text-sm text-muted-foreground">Network protocol analyzer for deep packet inspection</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-scanner-success/10 text-scanner-success border-scanner-success/30">
                          <Check className="mr-1 h-3 w-3" /> Available
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Wireshark Executable Path</label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="C:\\Program Files\\Wireshark\\wireshark.exe" 
                            className="scanner-input flex-1" 
                            value={wiresharkPath}
                            onChange={(e) => setWiresharkPath(e.target.value)}
                          />
                          <Button variant="outline" className="border-scanner-warning/30 text-scanner-warning">
                            Browse
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Capture Interface</label>
                        <select className="scanner-input w-full p-2">
                          <option>eth0 - Ethernet Interface</option>
                          <option>wlan0 - Wireless Interface</option>
                          <option>lo - Loopback Interface</option>
                          <option>Any - All Interfaces</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Capture Filters</label>
                        <Input placeholder="host 192.168.1.1" className="scanner-input" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Example: "port 80" or "host 192.168.1.1 and port 443"
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-scanner-accent/10">
                        <Button 
                          className="bg-scanner-warning text-scanner-bg hover:bg-scanner-warning/80"
                          onClick={handleWiresharkConnect}
                        >
                          Connect Wireshark Integration
                        </Button>
                        
                        {!wiresharkPath && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <AlertTriangle className="inline h-3 w-3 mr-1" />
                            In simulation mode, packet analysis will use simulated data.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="scanner-card mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl cyber-text mb-4">Additional Tools</h2>
              <p className="text-muted-foreground mb-6">
                Enhance your network intelligence capabilities with these compatible tools.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-scanner-accent/20 rounded-md p-4 hover:bg-scanner-accent/5 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                      <Terminal className="h-4 w-4 text-scanner-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">Metasploit Framework</h3>
                      <p className="text-xs text-muted-foreground">Advanced security testing</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-scanner-accent hover:bg-scanner-accent/10">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <div className="border border-scanner-accent/20 rounded-md p-4 hover:bg-scanner-accent/5 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-scanner-warning/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-scanner-warning" />
                    </div>
                    <div>
                      <h3 className="font-medium">Burp Suite</h3>
                      <p className="text-xs text-muted-foreground">Web security testing</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-scanner-warning hover:bg-scanner-warning/10">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="outline" className="border-scanner-accent/30 text-scanner-accent hover:bg-scanner-accent/10">
                  <Download className="mr-2 h-4 w-4" />
                  Download Integration Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
