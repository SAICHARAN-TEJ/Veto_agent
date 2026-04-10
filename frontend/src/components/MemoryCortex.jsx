import React, { useRef, useEffect, useCallback } from 'react';

/*
  MemoryCortex — Canvas-rendered neural network visualization.
  Represents the "corporate memory" as a living web of connected nodes.
  Nodes = customers, solutions, failure records.
  Connections pulse when memory is being "accessed."
*/

const NODE_COUNT = 38;
const CONNECTION_DENSITY = 0.06;

function generateNodes(width, height) {
  const nodes = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width * 0.38;
  const radiusY = height * 0.36;

  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (i / NODE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const dist = 0.25 + Math.random() * 0.75;
    const x = centerX + Math.cos(angle) * radiusX * dist;
    const y = centerY + Math.sin(angle) * radiusY * dist;
    const type = i < 5 ? 'customer' : i < 15 ? 'solution' : 'memory';
    const size = type === 'customer' ? 4.5 : type === 'solution' ? 3.2 : 2.2;

    nodes.push({
      x, y,
      baseX: x, baseY: y,
      size,
      type,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.6,
      drift: 8 + Math.random() * 14,
    });
  }
  return nodes;
}

function generateConnections(nodes) {
  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 180 && Math.random() < CONNECTION_DENSITY + (nodes[i].type === 'customer' ? 0.12 : 0)) {
        connections.push({
          from: i,
          to: j,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }
  return connections;
}

const typeColors = {
  customer: { r: 16, g: 185, b: 129 },
  solution: { r: 56, g: 189, b: 248 },
  memory: { r: 148, g: 163, b: 184 },
};

export function MemoryCortex({ width = 800, height = 500, className = '' }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const time = timeRef.current;
    const nodes = nodesRef.current;
    const connections = connectionsRef.current;

    // Update node positions (gentle drift)
    for (const node of nodes) {
      node.x = node.baseX + Math.sin(time * node.speed + node.phase) * node.drift;
      node.y = node.baseY + Math.cos(time * node.speed * 0.7 + node.phase) * node.drift * 0.6;
    }

    // Draw connections
    for (const conn of connections) {
      const a = nodes[conn.from];
      const b = nodes[conn.to];
      const pulse = (Math.sin(time * 1.2 + conn.phase) + 1) / 2;
      const alpha = 0.03 + pulse * 0.08;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Draw nodes
    for (const node of nodes) {
      const pulse = (Math.sin(time * 1.6 + node.phase) + 1) / 2;
      const color = typeColors[node.type];
      const alpha = 0.35 + pulse * 0.45;
      const glowAlpha = 0.04 + pulse * 0.08;

      // Glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${glowAlpha})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.fill();
    }

    ctx.restore();

    timeRef.current += 0.008;
    animFrameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    nodesRef.current = generateNodes(width, height);
    connectionsRef.current = generateConnections(nodesRef.current);

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [width, height, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
