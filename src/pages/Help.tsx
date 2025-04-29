
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Terminal, Network, Server, Activity, BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: "How do I start scanning my network?",
      answer: "Navigate to the Port Scanner or Network Scanner page, input the target IP address or range, select your desired scan options, and click the 'Start Scan' button. The results will be displayed once the scan is complete."
    },
    {
      question: "Is my scan data saved or shared?",
      answer: "No. All scanning is performed locally in your browser, and no data is sent to external servers. Your network information remains completely private."
    },
    {
      question: "How do I interpret the network graph?",
      answer: "The network graph shows devices as nodes and connections between them as lines. Colors indicate status: blue for safe devices, red for potential threats, and yellow for devices requiring attention. You can hover over nodes for more information or click to select them."
    },
    {
      question: "Can I integrate with external tools?",
      answer: "Yes! Network Intelligence Suite supports integration with industry-standard tools like nmap and Wireshark. Visit the Integrations page to configure these connections."
    },
    {
      question: "How accurate are the scan results?",
      answer: "The accuracy depends on your network environment and selected scan options. For demonstration purposes, some data in this application is simulated. When connected to actual scanning tools, accuracy depends on those tools' capabilities."
    }
  ];
  
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-scanner-bg">
      <div className="scanline" />
      <Navbar />
      
      <div className="container py-8 mt-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold cyber-text glow mb-4">Help Center</h1>
          <p className="mt-2 text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out of Network Intelligence Suite
          </p>
          
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <Input
                placeholder="Search for answers..."
                className="scanner-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="faq" className="mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-scanner-bg border border-scanner-accent/20">
              <TabsTrigger value="faq" className="data-[state=active]:bg-scanner-accent/10">FAQs</TabsTrigger>
              <TabsTrigger value="guides" className="data-[state=active]:bg-scanner-accent/10">Guides</TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-scanner-accent/10">API</TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-scanner-accent/10">Contact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="mt-4">
              <Card className="scanner-card">
                <CardContent className="p-6">
                  <h2 className="text-2xl cyber-text mb-4">Frequently Asked Questions</h2>
                  
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-scanner-accent/20">
                          <AccordionTrigger className="text-left hover:text-scanner-accent">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No matching questions found.</p>
                      <Button 
                        variant="ghost" 
                        className="mt-2 text-scanner-accent hover:bg-scanner-accent/10"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides" className="mt-4">
              <Card className="scanner-card">
                <CardContent className="p-6">
                  <h2 className="text-2xl cyber-text mb-6">Quick Start Guides</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-scanner-accent/20 rounded-md p-4 hover:bg-scanner-accent/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                          <Network className="h-4 w-4 text-scanner-accent" />
                        </div>
                        <h3 className="text-lg font-medium">Network Mapping Guide</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn how to create comprehensive maps of your network infrastructure.
                      </p>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="text-scanner-accent hover:bg-scanner-accent/10">
                          Read Guide
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-scanner-accent/20 rounded-md p-4 hover:bg-scanner-accent/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                          <Server className="h-4 w-4 text-scanner-accent" />
                        </div>
                        <h3 className="text-lg font-medium">Port Scanning Tutorial</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Discover how to effectively scan ports and identify services.
                      </p>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="text-scanner-accent hover:bg-scanner-accent/10">
                          Read Guide
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-scanner-accent/20 rounded-md p-4 hover:bg-scanner-accent/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                          <Terminal className="h-4 w-4 text-scanner-accent" />
                        </div>
                        <h3 className="text-lg font-medium">Integration Setup</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Step-by-step instructions for connecting to nmap and Wireshark.
                      </p>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="text-scanner-accent hover:bg-scanner-accent/10">
                          Read Guide
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-scanner-accent/20 rounded-md p-4 hover:bg-scanner-accent/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-scanner-accent/10 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-scanner-accent" />
                        </div>
                        <h3 className="text-lg font-medium">Traffic Analysis</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        How to interpret traffic patterns and identify anomalies.
                      </p>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="text-scanner-accent hover:bg-scanner-accent/10">
                          Read Guide
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button className="bg-scanner-bg border border-scanner-accent text-scanner-accent hover:bg-scanner-accent/10 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>View All Documentation</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api" className="mt-4">
              <Card className="scanner-card">
                <CardContent className="p-6">
                  <h2 className="text-2xl cyber-text mb-4">API Documentation</h2>
                  <p className="text-muted-foreground mb-6">
                    Network Intelligence Suite provides a comprehensive API for integration with your existing tools and workflows.
                  </p>
                  
                  <div className="bg-scanner-bg/70 border border-scanner-accent/20 rounded-md p-4 font-code mb-6">
                    <p className="text-sm text-scanner-accent mb-2">// Example API request</p>
                    <p className="text-xs text-muted-foreground">
                      GET /api/v1/scan/ports<br/>
                      &#123;<br/>
                      &nbsp;&nbsp;"target": "192.168.1.1",<br/>
                      &nbsp;&nbsp;"ports": "1-1000",<br/>
                      &nbsp;&nbsp;"options": &#123;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;"timeout": 2000,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;"concurrent": true<br/>
                      &nbsp;&nbsp;&#125;<br/>
                      &#125;
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Access our complete API documentation for detailed information on all available endpoints, 
                    request parameters, and response formats.
                  </p>
                  
                  <div className="flex justify-center">
                    <Button className="bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80">
                      View API Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-4">
              <Card className="scanner-card">
                <CardContent className="p-6">
                  <h2 className="text-2xl cyber-text mb-4">Contact Support</h2>
                  <p className="text-muted-foreground mb-6">
                    Need additional help? Our support team is ready to assist you with any questions or technical issues.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input placeholder="Your Name" className="scanner-input" />
                    <Input placeholder="Email Address" className="scanner-input" type="email" />
                    <Input placeholder="Subject" className="scanner-input col-span-full" />
                    <textarea 
                      placeholder="Describe your issue or question in detail..." 
                      className="scanner-input col-span-full min-h-[150px] resize-none p-3"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Help;
