
import React from 'react';
import { Shield, Code, Lock, Cpu, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-scanner-bg">
      <div className="scanline" />
      <Navbar />
      
      <div className="container py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold cyber-text glow mb-4">About Network Intelligence Suite</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              A comprehensive toolkit for network analysis and security monitoring
            </p>
          </header>
          
          <Card className="scanner-card mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl cyber-text mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                Network Intelligence Suite was developed to provide security professionals, system administrators, 
                and networking enthusiasts with a powerful yet accessible platform for network analysis and security 
                monitoring. Our goal is to make complex network operations more intuitive through advanced 
                visualization and intelligence-driven insights.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-scanner-accent" />
                    </div>
                    <h3 className="text-lg font-medium">Enhanced Security</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-[52px]">
                    Identify vulnerabilities and threats within your network infrastructure before they can be exploited.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-scanner-accent" />
                    </div>
                    <h3 className="text-lg font-medium">Advanced Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-[52px]">
                    Use cutting-edge visualization and analysis tools to gain deeper insights into your network.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                      <Code className="h-5 w-5 text-scanner-accent" />
                    </div>
                    <h3 className="text-lg font-medium">Powerful Integrations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-[52px]">
                    Connect with industry-standard tools like nmap and Wireshark for comprehensive network intelligence.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-scanner-accent" />
                    </div>
                    <h3 className="text-lg font-medium">Privacy First</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-[52px]">
                    All scanning is performed locally and no data is sent to external servers, maintaining your privacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="scanner-card mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl cyber-text mb-4">Disclaimer</h2>
              <p className="text-muted-foreground mb-4">
                The Network Intelligence Suite is designed for educational and legitimate network administration 
                purposes only. Users are responsible for ensuring they have proper authorization before scanning 
                any networks or systems.
              </p>
              <p className="text-muted-foreground mb-4">
                This tool simulates network scanning functionality for demonstration purposes. No actual scanning 
                is performed without explicit configuration and authorization.
              </p>
              <p className="text-muted-foreground">
                Always use network scanning tools responsibly and in accordance with applicable laws and regulations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="scanner-card mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl cyber-text mb-4">Technologies</h2>
              <p className="text-muted-foreground mb-6">
                This application is built using modern web technologies to provide a responsive, 
                accessible, and powerful user experience.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-scanner-bg rounded-md border border-scanner-accent/20 text-center">
                  <p className="text-scanner-accent font-medium">React</p>
                  <p className="text-xs text-muted-foreground">UI Framework</p>
                </div>
                <div className="p-4 bg-scanner-bg rounded-md border border-scanner-accent/20 text-center">
                  <p className="text-scanner-accent font-medium">TypeScript</p>
                  <p className="text-xs text-muted-foreground">Language</p>
                </div>
                <div className="p-4 bg-scanner-bg rounded-md border border-scanner-accent/20 text-center">
                  <p className="text-scanner-accent font-medium">TailwindCSS</p>
                  <p className="text-xs text-muted-foreground">Styling</p>
                </div>
                <div className="p-4 bg-scanner-bg rounded-md border border-scanner-accent/20 text-center">
                  <p className="text-scanner-accent font-medium">Vite</p>
                  <p className="text-xs text-muted-foreground">Build Tool</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button className="bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80 flex items-center gap-2">
                  <span>View Documentation</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
