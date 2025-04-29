
import React, { useRef, useEffect } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  type: string;
  connected: number[];
  velocity: { x: number; y: number };
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

  // Initialize nodes
  useEffect(() => {
    const initializeNodes = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Create nodes
      const nodes: Node[] = [];
      const nodeCount = 12;
      
      // Node types with different colors
      const nodeTypes = [
        { type: 'server', color: '#0cffe1' },
        { type: 'client', color: '#05d9e8' },
        { type: 'router', color: '#ffb847' },
        { type: 'device', color: '#ff2a6d' },
      ];
      
      for (let i = 0; i < nodeCount; i++) {
        const typeIndex = Math.floor(Math.random() * nodeTypes.length);
        const radius = Math.random() * 10 + 5;
        
        nodes.push({
          id: i,
          x: Math.random() * (containerWidth - radius * 2) + radius,
          y: Math.random() * (containerHeight - radius * 2) + radius,
          radius,
          color: nodeTypes[typeIndex].color,
          type: nodeTypes[typeIndex].type,
          connected: [],
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
          }
        });
      }
      
      // Create connections
      for (let i = 0; i < nodes.length; i++) {
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < connectionCount; j++) {
          const target = Math.floor(Math.random() * nodeCount);
          if (target !== i && !nodes[i].connected.includes(target)) {
            nodes[i].connected.push(target);
            if (!nodes[target].connected.includes(i)) {
              nodes[target].connected.push(i);
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
  
  // Animation loop
  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.lineWidth = 1;
      nodesRef.current.forEach(node => {
        node.connected.forEach(targetId => {
          const target = nodesRef.current[targetId];
          
          // Calculate distance for line opacity
          const dx = node.x - target.x;
          const dy = node.y - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.min(canvas.width, canvas.height) * 0.4;
          const opacity = Math.max(0, 1 - (distance / maxDistance));
          
          // Draw connection line
          ctx.beginPath();
          ctx.strokeStyle = node.id === highlightedNode || target.id === highlightedNode 
            ? `rgba(12, 255, 225, ${opacity * 0.8})` 
            : `rgba(150, 150, 150, ${opacity * 0.3})`;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });
      
      // Update node positions
      nodesRef.current.forEach(node => {
        // Mouse attraction/repulsion
        if (mousePositionRef.current) {
          const dx = mousePositionRef.current.x - node.x;
          const dy = mousePositionRef.current.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only affect nodes that are close to the mouse
          if (distance < 100) {
            // Repulsion effect
            node.velocity.x -= dx * 0.001;
            node.velocity.y -= dy * 0.001;
          }
        }
        
        // Update position based on velocity
        node.x += node.velocity.x;
        node.y += node.velocity.y;
        
        // Apply damping to slow down
        node.velocity.x *= 0.98;
        node.velocity.y *= 0.98;
        
        // Bounce off the edges
        if (node.x < node.radius) {
          node.x = node.radius;
          node.velocity.x *= -1;
        }
        if (node.x > canvas.width - node.radius) {
          node.x = canvas.width - node.radius;
          node.velocity.x *= -1;
        }
        if (node.y < node.radius) {
          node.y = node.radius;
          node.velocity.y *= -1;
        }
        if (node.y > canvas.height - node.radius) {
          node.y = canvas.height - node.radius;
          node.velocity.y *= -1;
        }
      });
      
      // Draw nodes
      nodesRef.current.forEach(node => {
        ctx.beginPath();
        
        // Fill
        ctx.fillStyle = node.id === highlightedNode ? '#ffffff' : node.color;
        ctx.arc(node.x, node.y, node.id === highlightedNode ? node.radius * 1.3 : node.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect for highlighted node
        if (node.id === highlightedNode) {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(
            node.x, node.y, node.radius * 0.8,
            node.x, node.y, node.radius * 2.5
          );
          gradient.addColorStop(0, `rgba(12, 255, 225, 0.6)`);
          gradient.addColorStop(1, 'rgba(12, 255, 225, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Border
        ctx.beginPath();
        ctx.strokeStyle = node.id === highlightedNode ? '#0cffe1' : 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = node.id === highlightedNode ? 2 : 1;
        ctx.arc(node.x, node.y, node.id === highlightedNode ? node.radius * 1.3 : node.radius, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [highlightedNode]);
  
  // Mouse events
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      mousePositionRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };
    
    const handleMouseLeave = () => {
      mousePositionRef.current = null;
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
