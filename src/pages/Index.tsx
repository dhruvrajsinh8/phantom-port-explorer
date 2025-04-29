
import React, { useState, useEffect } from 'react';
import ScanForm from '@/components/ScanForm';
import ScanResults from '@/components/ScanResults';
import PortVisualizer from '@/components/PortVisualizer';
import ScanHistory from '@/components/ScanHistory';
import ScanReport from '@/components/ScanReport';
import { ScanRequest, ScanResult } from '@/types/scan';
import { scanPorts, getSavedScans, generateScanReport } from '@/utils/scanUtils';
import { toast } from 'sonner';

const Index = () => {
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  
  // Load scan history from local storage
  useEffect(() => {
    loadScanHistory();
  }, []);
  
  const loadScanHistory = () => {
    setScanHistory(getSavedScans());
  };
  
  const handleStartScan = async (request: ScanRequest) => {
    try {
      setIsScanning(true);
      
      // Start scan and get initial result
      const initialResult = await scanPorts({
        ipAddress: request.ipAddress,
        portRange: request.portRange
      });
      
      setCurrentScan(initialResult);
      
      if (initialResult.status === 'error') {
        toast.error(initialResult.error || 'Scan failed');
        setIsScanning(false);
        return;
      }
      
      if (initialResult.status === 'completed') {
        toast.success(`Scan completed with ${initialResult.ports.filter(p => p.status === 'open').length} open ports`);
        loadScanHistory(); // Refresh history
        setIsScanning(false);
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to start scan');
      setIsScanning(false);
    }
  };
  
  const handleClearResult = () => {
    setCurrentScan(null);
  };
  
  const handleScanSelected = (scan: ScanResult) => {
    setCurrentScan(scan);
  };
  
  const handleGenerateReport = (reportSource: ScanResult | string) => {
    try {
      let generatedReport: string;
      
      if (typeof reportSource === 'string') {
        generatedReport = reportSource;
      } else {
        generatedReport = generateScanReport(reportSource);
      }
      
      setReportText(generatedReport);
      setReportOpen(true);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };
  
  return (
    <div className="min-h-screen bg-scanner-bg overflow-x-hidden">
      {/* Scanline effect */}
      <div className="scanline" />
      
      <div className="container py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold cyber-text glow">
            Phantom Port Explorer
          </h1>
          <p className="mt-2 text-muted-foreground">
            Network Scanner & Port Analysis Tool
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Scanner form */}
            <ScanForm 
              onStartScan={handleStartScan} 
              isScanning={isScanning} 
            />
            
            {/* Current scan results */}
            {currentScan && (
              <ScanResults 
                result={currentScan}
                onClearResult={handleClearResult}
                onGenerateReport={handleGenerateReport}
              />
            )}
            
            {/* Port visualization */}
            <div className={currentScan ? 'block' : 'hidden'}>
              <PortVisualizer 
                ports={currentScan?.ports || []}
                isLoading={isScanning}
              />
            </div>
          </div>
          
          {/* Sidebar - History */}
          <div className="lg:col-span-1">
            <ScanHistory
              scans={scanHistory}
              onScanSelected={handleScanSelected}
              onHistoryUpdated={loadScanHistory}
              onGenerateReport={(scan) => handleGenerateReport(scan)}
            />
          </div>
        </div>
        
        <footer className="mt-10 text-center text-sm text-muted-foreground">
          <p>Phantom Port Explorer - For Educational Purposes Only</p>
          <p className="text-xs mt-1">
            This is a demonstration tool and uses simulated scan data. No actual network scanning is performed.
          </p>
        </footer>
      </div>
      
      {/* Report dialog */}
      <ScanReport 
        isOpen={reportOpen}
        reportText={reportText}
        onOpenChange={setReportOpen}
      />
    </div>
  );
};

export default Index;
