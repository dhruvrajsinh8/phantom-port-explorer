
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Shield, Server, Network, HelpCircle, Info, Settings, Command } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // Toggle command dialog
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 w-full bg-scanner-bg/80 backdrop-blur-lg z-50 border-b border-scanner-accent/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-scanner-accent" />
              <span className="text-lg font-bold cyber-text">NetIntel</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" active={isActive('/')}>
                <Server className="h-4 w-4 mr-1" />
                Dashboard
              </NavLink>
              <NavLink to="/port-scanner" active={isActive('/port-scanner')}>
                <Server className="h-4 w-4 mr-1" />
                Port Scanner
              </NavLink>
              <NavLink to="/network-scanner" active={isActive('/network-scanner')}>
                <Network className="h-4 w-4 mr-1" />
                Network Scanner
              </NavLink>
              <NavLink to="/integrations" active={isActive('/integrations')}>
                <Settings className="h-4 w-4 mr-1" />
                Integrations
              </NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="text-muted-foreground border-scanner-accent/30 hover:bg-scanner-accent/10"
              onClick={() => setOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search...
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-scanner-accent/30 bg-scanner-bg px-1.5 text-xs text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            
            <div className="hidden sm:flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/about">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Info className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>About</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/help">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Help</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for tools, devices, or documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/"; }}>
              <Server className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/port-scanner"; }}>
              <Server className="mr-2 h-4 w-4" />
              <span>Port Scanner</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/network-scanner"; }}>
              <Network className="mr-2 h-4 w-4" />
              <span>Network Scanner</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/integrations"; }}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Integrations</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/about"; }}>
              <Info className="mr-2 h-4 w-4" />
              <span>About</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/help"; }}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Tools">
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/integrations"; }}>
              <span>Connect to nmap</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = "/integrations"; }}>
              <span>Connect to Wireshark</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
        active 
          ? "bg-scanner-accent/10 text-scanner-accent border border-scanner-accent/30" 
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
