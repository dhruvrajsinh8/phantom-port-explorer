
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

interface ScanReportProps {
  isOpen: boolean;
  reportText: string;
  onOpenChange: (open: boolean) => void;
}

const ScanReport: React.FC<ScanReportProps> = ({ isOpen, reportText, onOpenChange }) => {
  const textRef = useRef<HTMLPreElement>(null);
  
  const downloadReport = () => {
    try {
      const blob = new Blob([reportText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `network-scan-report-${new Date().toISOString().slice(0, 10)}.md`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Failed to download report:", error);
      toast.error("Failed to download report");
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      toast.success("Report copied to clipboard");
    } catch (error) {
      console.error("Failed to copy report:", error);
      toast.error("Failed to copy report");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="scanner-panel max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl cyber-text">Network Scan Report</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[50vh]">
          <div className="border border-scanner-accent/20 bg-scanner-bg/40 rounded-md p-4 font-code">
            <pre ref={textRef} className="whitespace-pre-wrap text-sm">
              {reportText}
            </pre>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex flex-wrap gap-2">
          <Button 
            onClick={downloadReport}
            className="bg-scanner-accent text-scanner-bg hover:bg-scanner-accent/80"
          >
            Download Report
          </Button>
          <Button 
            onClick={copyToClipboard} 
            variant="outline"
            className="border-scanner-accent text-scanner-accent hover:bg-scanner-accent/10"
          >
            Copy to Clipboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScanReport;
