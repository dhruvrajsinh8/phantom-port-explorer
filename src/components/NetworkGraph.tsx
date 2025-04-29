
import React, { useRef, useEffect, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  type: string;
  connected: number[];
  velocity: { x: number; y: number };
  status: 'safe' | 'warning' | 'danger';
  pulse: number;
  data?: {
    ip?: string;
    name?: string;
    traffic?: number;
  };
}

interface NetworkGraphProps {
  highlightedNode: number | null;
  onNodeClick?: (id: number) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ highlightedNode, onNodeClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const [hoverNode, setHoverNode] = useState<Node | null>(null);

  // Initialize nodes
  useEffect(() => {
    const initializeNodes = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Create nodes
      const nodes: Node[] = [];
      const nodeCount = 35; // Increased node count
      
      // Node types with different colors
      const nodeTypes = [
        { type: 'server', color: '#0cffe1', status: 'safe' as const },
        { type: 'client', color: '#05d9e8', status: 'safe' as const },
        { type: 'router', color: '#ffb847', status: 'warning' as const },
        { type: 'device', color: '#ff2a6d', status: 'danger' as const },
        { type: 'iot', color: '#9e00ff', status: 'safe' as const },
      ];
      
      // Generate IP-like addresses
      const generateIP = () => {
        return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      };
      
      // Device names
      const deviceNames = [
        'Desktop', 'Laptop', 'Smartphone', 'Router', 'Smart TV', 'IoT Sensor',
        'Security Camera', 'Smart Speaker', 'Game Console', 'Network Printer',
        'Server', 'Tablet', 'WiFi Extender', 'Smart Watch', 'NAS', 'IoT Gateway',
        'IP Phone', 'Media Player', 'Smart Thermostat', 'Smart Bulb'
      ];
      
      for (let i = 0; i < nodeCount; i++) {
        const typeIndex = Math.floor(Math.random() * nodeTypes.length);
        const radius = Math.random() * 5 + (nodeTypes[typeIndex].type === 'router' ? 8 : 5);
        
        nodes.push({
          id: i,
          x: Math.random() * (containerWidth - radius * 2) + radius,
          y: Math.random() * (containerHeight - radius * 2) + radius,
          radius,
          color: nodeTypes[typeIndex].color,
          type: nodeTypes[typeIndex].type,
          status: nodeTypes[typeIndex].status,
          connected: [],
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
          },
          pulse: Math.random() * 2 * Math.PI, // Random starting phase for pulse animation
          data: {
            ip: generateIP(),
            name: `${nodeTypes[typeIndex].type.charAt(0).toUpperCase() + nodeTypes[typeIndex].type.slice(1)} ${deviceNames[Math.floor(Math.random() * deviceNames.length)]}`,
            traffic: Math.floor(Math.random() * 100)
          }
        });
      }
      
      // Create connections - more strategic connections
      // Routers connect to many devices
      const routers = nodes.filter(node => node.type === 'router');
      const nonRouters = nodes.filter(node => node.type !== 'router');
      
      // Connect routers to each other
      for (let i = 0; i < routers.length; i++) {
        for (let j = i + 1; j < routers.length; j++) {
          if (Math.random() < 0.7) { // 70% chance routers connect to each other
            routers[i].connected.push(routers[j].id);
            routers[j].connected.push(routers[i].id);
          }
        }
      }
      
      // Connect devices to routers
      for (const device of nonRouters) {
        if (routers.length > 0) {
          const randomRouter = routers[Math.floor(Math.random() * routers.length)];
          device.connected.push(randomRouter.id);
          randomRouter.connected.push(device.id);
          
          // Some devices connect to other devices too
          if (Math.random() < 0.3) { // 30% chance
            const otherDevice = nonRouters[Math.floor(Math.random() * nonRouters.length)];
            if (otherDevice.id !== device.id) {
              device.connected.push(otherDevice.id);
              otherDevice.connected.push(device.id);
            }
          }
        }
      }
      
      nodesRef.current = nodes;
    };
    
    initializeNodes();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      
      initializeNodes();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Animation loop with improved effects
  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update pulse animation
      const time = performance.now() * 0.001; // Time in seconds
      
      // Draw connections with pulsing effect
      ctx.lineWidth = 1;
      nodesRef.current.forEach(node => {
        node.connected.forEach(targetId => {
          const target = nodesRef.current[targetId];
          
          // Calculate distance for line opacity
          const dx = node.x - target.x;
          const dy = node.y - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.min(canvas.width, canvas.height) * 0.4;
          const normalOpacity = Math.max(0, 1 - (distance / maxDistance));
          
          // Create pulsing effect
          const pulseSpeed = 0.5; // Speed of pulse animation
          const pulseAmount = 0.3; // Intensity of pulse
          const sinValue = Math.sin(time * pulseSpeed + node.pulse);
          const pulse = 1 + sinValue * pulseAmount;
          
          // Determine if this connection is highlighted
          const isHighlighted = node.id === highlightedNode || target.id === highlightedNode;
          
          // Draw connection line
          ctx.beginPath();
          if (isHighlighted) {
            // Highlighted connection
            const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
            gradient.addColorStop(0, `rgba(12, 255, 225, ${normalOpacity * pulse * 0.9})`);
            gradient.addColorStop(1, `rgba(12, 255, 225, ${normalOpacity * pulse * 0.9})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
          } else {
            // Normal connection
            const baseColor = node.status === 'danger' || target.status === 'danger' 
              ? 'rgba(255, 42, 109, ' 
              : node.status === 'warning' || target.status === 'warning'
              ? 'rgba(255, 184, 71, '
              : 'rgba(150, 150, 150, ';
              
            ctx.strokeStyle = `${baseColor}${normalOpacity * pulse * 0.4})`;
            ctx.lineWidth = 1;
          }
          
          // Draw main line
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
          
          // Add data packet animation for active connections
          if (Math.random() < 0.03) { // Randomly show data packets
            const packetPosition = Math.random(); // Position along the line
            const packetX = node.x + (target.x - node.x) * packetPosition;
            const packetY = node.y + (target.y - node.y) * packetPosition;
            
            // Draw data packet
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
            ctx.fillStyle = isHighlighted ? '#0cffe1' : '#ffffff';
            ctx.fill();
          }
        });
      });
      
      // Draw nodes
      nodesRef.current.forEach(node => {
        const isHovered = node === hoverNode;
        const isHighlighted = node.id === highlightedNode;
        
        // Breathing effect
        const breatheAmount = 0.2; // How much the nodes "breathe"
        const breatheSpeed = 1.0; // Speed of breathing animation  
        const breatheFactor = 1 + Math.sin(time * breatheSpeed + node.pulse) * breatheAmount;
        
        // Base radius with breathing effect applied
        const displayRadius = node.radius * (isHovered ? 1.3 : 1) * breatheFactor;
        
        // Determine node color based on status and highlight
        let nodeColor = node.color;
        if (isHighlighted || isHovered) {
          nodeColor = '#ffffff'; // Highlighted nodes are white
        }
        
        // Draw node
        ctx.beginPath();
        ctx.fillStyle = nodeColor;
        ctx.arc(node.x, node.y, displayRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        const glowSize = isHighlighted ? 3 : isHovered ? 2.5 : 1.5;
        const glowColor = node.status === 'danger' 
          ? 'rgba(255, 42, 109, 0.6)' 
          : node.status === 'warning'
          ? 'rgba(255, 184, 71, 0.6)'
          : 'rgba(12, 255, 225, 0.6)';
        
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          node.x, node.y, displayRadius * 0.8,
          node.x, node.y, displayRadius * glowSize
        );
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, displayRadius * glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.beginPath();
        ctx.strokeStyle = isHighlighted || isHovered 
          ? '#ffffff' 
          : 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = isHighlighted || isHovered ? 2 : 1;
        ctx.arc(node.x, node.y, displayRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Update node position based on velocity
        node.x += node.velocity.x;
        node.y += node.velocity.y;
        
        // Apply damping to slow down
        node.velocity.x *= 0.98;
        node.velocity.y *= 0.98;
        
        // Bounce off the edges
        if (node.x < displayRadius) {
          node.x = displayRadius;
          node.velocity.x *= -1;
        }
        if (node.x > canvas.width - displayRadius) {
          node.x = canvas.width - displayRadius;
          node.velocity.x *= -1;
        }
        if (node.y < displayRadius) {
          node.y = displayRadius;
          node.velocity.y *= -1;
        }
        if (node.y > canvas.height - displayRadius) {
          node.y = canvas.height - displayRadius;
          node.velocity.y *= -1;
        }
      });
      
      // Display tooltip for hovered node
      if (hoverNode) {
        const padding = 10;
        const fontSize = 12;
        const lineHeight = 16;
        
        // Content
        const name = hoverNode.data?.name || 'Unknown Device';
        const ip = hoverNode.data?.ip || 'N/A';
        const type = hoverNode.type.charAt(0).toUpperCase() + hoverNode.type.slice(1);
        const status = hoverNode.status.charAt(0).toUpperCase() + hoverNode.status.slice(1);
        const traffic = hoverNode.data?.traffic ? `${hoverNode.data.traffic}%` : 'N/A';
        
        // Calculate tooltip dimensions
        ctx.font = `${fontSize}px monospace`;
        const nameWidth = ctx.measureText(name).width;
        const ipWidth = ctx.measureText(`IP: ${ip}`).width;
        const typeWidth = ctx.measureText(`Type: ${type}`).width;
        const statusWidth = ctx.measureText(`Status: ${status}`).width;
        const trafficWidth = ctx.measureText(`Traffic: ${traffic}`).width;
        
        const tooltipWidth = Math.max(nameWidth, ipWidth, typeWidth, statusWidth, trafficWidth) + padding * 2;
        const tooltipHeight = lineHeight * 5 + padding * 2;
        
        // Position tooltip to ensure it stays on screen
        let tooltipX = hoverNode.x + 20;
        let tooltipY = hoverNode.y - tooltipHeight - 10;
        
        // Adjust if off-screen
        if (tooltipX + tooltipWidth > canvas.width) {
          tooltipX = canvas.width - tooltipWidth - 10;
        }
        if (tooltipY < 10) {
          tooltipY = hoverNode.y + 20;
        }
        
        // Draw tooltip background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.strokeStyle = hoverNode.status === 'danger' 
          ? 'rgba(255, 42, 109, 0.8)'
          : hoverNode.status === 'warning'
          ? 'rgba(255, 184, 71, 0.8)'
          : 'rgba(12, 255, 225, 0.8)';
        ctx.lineWidth = 1;
        
        // Rounded rectangle for tooltip
        const radius = 5;
        ctx.beginPath();
        ctx.moveTo(tooltipX + radius, tooltipY);
        ctx.lineTo(tooltipX + tooltipWidth - radius, tooltipY);
        ctx.quadraticCurveTo(tooltipX + tooltipWidth, tooltipY, tooltipX + tooltipWidth, tooltipY + radius);
        ctx.lineTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight - radius);
        ctx.quadraticCurveTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight, tooltipX + tooltipWidth - radius, tooltipY + tooltipHeight);
        ctx.lineTo(tooltipX + radius, tooltipY + tooltipHeight);
        ctx.quadraticCurveTo(tooltipX, tooltipY + tooltipHeight, tooltipX, tooltipY + tooltipHeight - radius);
        ctx.lineTo(tooltipX, tooltipY + radius);
        ctx.quadraticCurveTo(tooltipX, tooltipY, tooltipX + radius, tooltipY);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
        
        // Draw tooltip text
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        ctx.fillText(name, tooltipX + padding, tooltipY + padding);
        ctx.fillText(`IP: ${ip}`, tooltipX + padding, tooltipY + padding + lineHeight);
        ctx.fillText(`Type: ${type}`, tooltipX + padding, tooltipY + padding + lineHeight * 2);
        
        // Status with colored indicator
        ctx.fillText(`Status:`, tooltipX + padding, tooltipY + padding + lineHeight * 3);
        const statusTextWidth = ctx.measureText('Status: ').width;
        ctx.fillStyle = hoverNode.status === 'danger' 
          ? '#ff2a6d'
          : hoverNode.status === 'warning' 
          ? '#ffb847' 
          : '#0cffe1';
        ctx.fillText(status, tooltipX + padding + statusTextWidth, tooltipY + padding + lineHeight * 3);
        
        // Traffic
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Traffic: ${traffic}`, tooltipX + padding, tooltipY + padding + lineHeight * 4);
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [highlightedNode, hoverNode]);
  
  // Mouse events
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      mousePositionRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      
      // Check if mouse is over any node
      const x = mousePositionRef.current.x;
      const y = mousePositionRef.current.y;
      
      let hoveredNode: Node | null = null;
      for (const node of nodesRef.current) {
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= node.radius * 1.5) {
          hoveredNode = node;
          break;
        }
      }
      
      setHoverNode(hoveredNode);
      
      // Apply slight attraction to nearby nodes
      if (mousePositionRef.current) {
        nodesRef.current.forEach(node => {
          const dx = mousePositionRef.current!.x - node.x;
          const dy = mousePositionRef.current!.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            // Attract nodes slightly towards mouse
            const factor = 0.02 * (1 - distance / 100);
            node.velocity.x += dx * factor;
            node.velocity.y += dy * factor;
          }
        });
      }
    };
    
    const handleMouseLeave = () => {
      mousePositionRef.current = null;
      setHoverNode(null);
    };
    
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !canvasRef.current || !onNodeClick) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Check if clicked on a node
      for (let i = 0; i < nodesRef.current.length; i++) {
        const node = nodesRef.current[i];
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= node.radius * 1.5) {
          // Apply a force to all connected nodes
          const connectedNodes = node.connected.map(id => nodesRef.current.find(n => n.id === id)).filter(Boolean);
          connectedNodes.forEach(connectedNode => {
            if (connectedNode) {
              // Push connected nodes away slightly for visual effect
              const connDx = connectedNode.x - node.x;
              const connDy = connectedNode.y - node.y;
              const connDist = Math.sqrt(connDx * connDx + connDy * connDy);
              if (connDist > 0) {
                connectedNode.velocity.x += (connDx / connDist) * 2;
                connectedNode.velocity.y += (connDy / connDist) * 2;
              }
            }
          });
          
          onNodeClick(node.id);
          return;
        }
      }
    };
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      canvas.addEventListener('click', handleClick);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [onNodeClick]);
  
  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default NetworkGraph;
