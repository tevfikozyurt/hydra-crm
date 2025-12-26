import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RegionNode } from '../types';

interface BackgroundMapProps {
  onRegionSelect: (region: string) => void;
  activeFilter: string;
}

const BackgroundMap: React.FC<BackgroundMapProps> = ({ onRegionSelect, activeFilter }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<RegionNode[]>([]);

  // Simulate Turkey's major regions as nodes in a network
  useEffect(() => {
    const width = 800;
    const height = 400;
    
    // Rough coordinates scaled to relative 800x400 box to resemble Turkey's shape
    const initialNodes: RegionNode[] = [
      { id: 'ist', name: 'İstanbul', x: 150, y: 80, stressLevel: 85, leakRate: 12.4 },
      { id: 'ank', name: 'Ankara', x: 300, y: 120, stressLevel: 65, leakRate: 5.2 },
      { id: 'izm', name: 'İzmir', x: 80, y: 200, stressLevel: 78, leakRate: 8.1 },
      { id: 'ant', name: 'Antalya', x: 250, y: 300, stressLevel: 45, leakRate: 2.3 },
      { id: 'ada', name: 'Adana', x: 450, y: 280, stressLevel: 92, leakRate: 15.6 }, // Critical
      { id: 'diy', name: 'Diyarbakır', x: 600, y: 200, stressLevel: 55, leakRate: 4.1 },
      { id: 'tra', name: 'Trabzon', x: 550, y: 70, stressLevel: 20, leakRate: 1.2 },
      { id: 'van', name: 'Van', x: 700, y: 180, stressLevel: 30, leakRate: 1.8 },
      { id: 'kon', name: 'Konya', x: 320, y: 220, stressLevel: 88, leakRate: 9.5 }, // High stress
      { id: 'bur', name: 'Bursa', x: 160, y: 110, stressLevel: 70, leakRate: 6.7 },
    ];
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Scaling function to fit our relative coordinates to the actual container
    const xScale = d3.scaleLinear().domain([0, 800]).range([50, width - 50]);
    const yScale = d3.scaleLinear().domain([0, 400]).range([50, height - 50]);

    // Draw Connections (Network Grid)
    // Create links based on proximity to simulate pipeline network
    const links: { source: RegionNode; target: RegionNode }[] = [];
    nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
            if (i < j) {
                const dist = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                if (dist < 250) { // Connect close cities
                    links.push({ source: node, target: otherNode });
                }
            }
        });
    });

    const linkGroup = svg.append("g").attr("class", "links");
    
    linkGroup.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.source.x))
      .attr("y1", d => yScale(d.source.y))
      .attr("x2", d => xScale(d.target.x))
      .attr("y2", d => yScale(d.target.y))
      .attr("stroke", "#06b6d4") // Cyan
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.15);

    // Draw Heatmap Zones (Voronoi)
    // We use a Voronoi diagram to create regions
    /* 
       Note: d3-delaunay is often needed for Voronoi in newer D3, 
       but we can simulate heat zones with large radial gradients for simplicity in this stack 
       to avoid complex geometry imports.
    */
    
    // Draw Nodes (Cities)
    const nodeGroup = svg.append("g").attr("class", "nodes");

    const circles = nodeGroup.selectAll("circle")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${xScale(d.x)},${yScale(d.y)})`)
      .on("click", (event, d) => onRegionSelect(d.name))
      .style("cursor", "pointer");

    // Pulsing Effect (Outer Ring)
    circles.append("circle")
      .attr("r", d => d.stressLevel > 80 ? 30 : 15)
      .attr("fill", d => d.stressLevel > 80 ? "#ef4444" : "#06b6d4")
      .attr("opacity", 0.2)
      .append("animate")
      .attr("attributeName", "r")
      .attr("values", d => d.stressLevel > 80 ? "30;50;30" : "15;25;15")
      .attr("dur", d => d.stressLevel > 80 ? "1s" : "3s")
      .attr("repeatCount", "indefinite");

    circles.append("circle")
      .attr("r", d => d.stressLevel > 80 ? 30 : 15)
      .attr("fill", d => d.stressLevel > 80 ? "#ef4444" : "#06b6d4")
      .attr("opacity", 0.1)
      .append("animate")
      .attr("attributeName", "opacity")
      .attr("values", "0.1;0;0.1")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite");

    // Inner Core
    circles.append("circle")
      .attr("r", 4)
      .attr("fill", "#ffffff")
      .attr("stroke", d => d.stressLevel > 80 ? "#ef4444" : "#06b6d4")
      .attr("stroke-width", 2);

    // Labels
    circles.append("text")
      .text(d => d.name)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("fill", d => d.stressLevel > 80 ? "#fca5a5" : "#a5f3fc")
      .attr("font-size", "10px")
      .attr("font-family", "Chakra Petch")
      .attr("opacity", 0.8)
      .style("pointer-events", "none");

    // Data Label (Leak Rate)
    circles.append("text")
      .text(d => `${d.leakRate} L/dk`)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", d => d.stressLevel > 80 ? "#ef4444" : "#22d3ee")
      .attr("font-size", "9px")
      .attr("font-family", "Chakra Petch")
      .attr("opacity", 0) // Hidden by default, show on hover could be cool
      .transition()
      .duration(1000)
      .attr("opacity", 0.7);

  }, [nodes, activeFilter]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
       {/* Map Container - allow pointer events only on map elements */}
      <svg ref={svgRef} className="w-full h-full opacity-60 pointer-events-auto" />
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/50 to-slate-950/90 pointer-events-none" />
    </div>
  );
};

export default BackgroundMap;