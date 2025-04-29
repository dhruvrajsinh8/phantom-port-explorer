import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanResult } from '@/types/scan';
import { saveScan, generateScanReport } from '@/utils/scanUtils';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, FileSearch } from 'lucide-react';

interface ScanResultsProps {
  result: ScanResult | null;
  onClearResult: () => void;
  onGenerateReport: (reportText: string) => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ result, onClearResult, onGenerateReport }) => {
  useEffect(() => {
    if (result && result.status === 'completed') {
      saveScan(result);
    }
  }, [result]);

  const handleSaveResult = () => {
    if (!result) return;
    
    try {
      // Create a JSON blob
      const resultJson = JSON.stringify(result, null, 2);
      const blob = new Blob([resultJson], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scan-${result.ipAddress}-${new Date(result.timestamp).toISOString().slice(0, 10)}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Scan results downloaded successfully");
    } catch (error) {
      console.error("Failed to download results:", error);
      toast.error("Failed to download results");
    }
  };

  const handleGenerateReport = () => {
    if (!result) return;
    
    const reportText = generateScanReport(result);
    onGenerateReport(reportText);
  };

  if (!result) {
    return null;
  }

  const openPorts = result.ports.filter(p => p.status === 'open');
  
  return (
    <Card className="scanner-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl cyber-text flex items-center gap-2">
            <FileSearch size={24} className="text-scanner-accent" />
            Scan Results
          </CardTitle>
          <Badge 
            variant={
              result.status === 'completed' ? "default" :
              result.status === 'in-progress' ? "outline" : "destructive"
            }
            className={
              result.status === 'completed' ? "bg-scanner-success/20 text-scanner-success" :
              result.status === 'in-progress' ? "animate-pulse bg-scanner-warning/20 text-scanner-warning" :
              "bg-scanner-danger/20 text-scanner-danger"
            }
          >
            {result.status === 'completed' ? 'Completed' :
             result.status === 'in-progress' ? 'Scanning...' : 'Error'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {result.status === 'error' ? (
          <div className="py-4 text-scanner-danger">
            <p>Error: {result.error || 'Unknown error occurred'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">Target IP</p>
                <p className="font-code text-xl">{result.ipAddress}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Port Range</p>
                <p className="font-code text-lg">{result.portRange.start} - {result.portRange.end}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">Scan Date</p>
                <p className="font-code">{new Date(result.timestamp).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-code">
                  {result.duration ? `${(result.duration / 1000).toFixed(2)}s` : 'In progress...'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Open Ports</p>
                <Badge className="bg-scanner-accent text-scanner-bg">
                  {openPorts.length} found
                </Badge>
              </div>
              
              {openPorts.length > 0 ? (
                <ScrollArea className="h-[120px]">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {openPorts.map(port => (
                      <div 
                        key={port.port}
                        className="bg-scanner-success/10 border border-scanner-success/30 rounded p-2 text-center"
                      >
                        <p className="font-bold text-scanner-success">{port.port}</p>
                        {port.service && <p className="text-xs">{port.service}</p>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  {result.status === 'in-progress' ? 'Scanning...' : 'No open ports found'}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          onClick={handleGenerateReport}
          className="bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80 flex items-center gap-2"
          disabled={result.status !== 'completed'}
        >
          <FileText size={16} />
          Generate Report
        </Button>
        <Button 
          onClick={handleSaveResult} 
          variant="outline" 
          className="border-scanner-accent text-scanner-accent hover:bg-scanner-accent/10"
          disabled={result.status !== 'completed'}
        >
          Save Results
        </Button>
        <Button 
          onClick={onClearResult} 
          variant="ghost"
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScanResults;
