
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanResult } from '@/types/scan';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { deleteScan, clearAllScans, generateScanReport } from '@/utils/scanUtils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileText, Trash2, AlertCircle, Search } from 'lucide-react';

interface ScanHistoryProps {
  scans: ScanResult[];
  onScanSelected: (scan: ScanResult) => void;
  onHistoryUpdated: () => void;
  onGenerateReport: (reportText: string) => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ 
  scans, 
  onScanSelected, 
  onHistoryUpdated,
  onGenerateReport
}) => {
  const [confirmClearOpen, setConfirmClearOpen] = React.useState(false);
  const [scanToDelete, setScanToDelete] = React.useState<string | null>(null);
  
  const handleDeleteScan = (scanId: string) => {
    setScanToDelete(scanId);
  };
  
  const confirmDelete = () => {
    if (scanToDelete) {
      deleteScan(scanToDelete);
      toast.success("Scan deleted");
      onHistoryUpdated();
      setScanToDelete(null);
    }
  };
  
  const handleClearAll = () => {
    setConfirmClearOpen(true);
  };
  
  const confirmClearAll = () => {
    clearAllScans();
    toast.success("Scan history cleared");
    onHistoryUpdated();
    setConfirmClearOpen(false);
  };

  const handleGenerateReport = (scan: ScanResult) => {
    const reportText = generateScanReport(scan);
    onGenerateReport(reportText);
  };
  
  return (
    <>
      <Card className="scanner-card h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl cyber-text">Scan History</CardTitle>
            {scans.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-muted-foreground hover:text-scanner-danger"
                onClick={handleClearAll}
              >
                <Trash2 size={14} className="mr-1" /> Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {scans.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground px-4">
              <p>No scan history found. Complete a scan to see it here.</p>
            </div>
          ) : (
            <ScrollArea className="h-[320px]">
              <div className="p-4 space-y-3">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="bg-card border border-scanner-accent/10 hover:border-scanner-accent/30 transition-colors p-3 rounded-md shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-code text-scanner-accent">{scan.ipAddress}</span>
                          {scan.status === 'error' && (
                            <span className="text-scanner-danger text-xs font-bold flex items-center">
                              <AlertCircle size={12} className="mr-1" /> Error
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="mr-3">
                            {new Date(scan.timestamp).toLocaleDateString()}{' '}
                            {new Date(scan.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="mr-3">
                            Ports: {scan.portRange.start}-{scan.portRange.end}
                          </span>
                          <span>
                            Open: {scan.ports.filter(p => p.status === 'open').length}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-scanner-accent"
                          onClick={() => onScanSelected(scan)}
                          title="View scan"
                        >
                          <Search size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-scanner-accent"
                          onClick={() => handleGenerateReport(scan)}
                          disabled={scan.status !== 'completed'}
                          title="Generate report"
                        >
                          <FileText size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-scanner-danger"
                          onClick={() => handleDeleteScan(scan.id)}
                          title="Delete scan"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      {/* Delete confirmation */}
      <Dialog open={scanToDelete !== null} onOpenChange={() => setScanToDelete(null)}>
        <DialogContent className="scanner-panel">
          <DialogHeader>
            <DialogTitle>Delete Scan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setScanToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Clear all confirmation */}
      <Dialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <DialogContent className="scanner-panel">
          <DialogHeader>
            <DialogTitle>Clear Scan History</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear your entire scan history? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmClearOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearAll}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanHistory;
