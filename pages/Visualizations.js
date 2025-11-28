import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { html } from '../react-utils.js';
import { getSystemStats } from '../services/api.js';

const Visualizations = () => {
  const [data, setData] = useState({
    attackCounts: { Normal: 0, DoS: 0, ARP: 0, Scan: 0 }
  });

  useEffect(() => {
    // Fetch one-time stats when loading the page
    const fetchStats = async () => {
      const stats = await getSystemStats();
      if (stats.attack_counts) {
        setData({ attackCounts: stats.attack_counts });
      }
    };
    fetchStats();
  }, []);

  const attackData = [
    { name: 'Normal', value: data.attackCounts.Normal || 0, color: '#22c55e' },
    { name: 'DoS', value: data.attackCounts['DoS Attack'] || 0, color: '#ef4444' },
    { name: 'ARP Spoof', value: data.attackCounts['ARP Spoofing'] || 0, color: '#f97316' },
    { name: 'Port Scan', value: data.attackCounts['Port Scan'] || 0, color: '#eab308' },
  ];

  return html`
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Visual Analytics</h1>
      <p className="text-slate-500">Graphical representation of network traffic and detected threats.</p>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Attack Distribution Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Traffic Classification</h3>
          <div className="h-80 w-full">
            <${ResponsiveContainer} width="100%" height="100%">
              <${PieChart}>
                <${Pie}
                  data=${attackData}
                  cx="50%"
                  cy="50%"
                  innerRadius=${60}
                  outerRadius=${100}
                  paddingAngle=${5}
                  dataKey="value"
                >
                  ${attackData.map((entry, index) => (
                    html`<${Cell} key=${`cell-${index}`} fill=${entry.color} />`
                  ))}
                </${Pie}>
                <${Tooltip} />
                <${Legend} />
              </${PieChart}>
            </${ResponsiveContainer}>
          </div>
        </div>

        {/* Bar Chart by Severity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Attack Counts by Category</h3>
          <div className="h-80 w-full">
            <${ResponsiveContainer} width="100%" height="100%">
              <${BarChart} data=${attackData}>
                <${CartesianGrid} strokeDasharray="3 3" vertical=${false} />
                <${XAxis} dataKey="name" />
                <${YAxis} />
                <${Tooltip} cursor={{fill: 'transparent'}} />
                <${Bar} dataKey="value" fill="#6366f1" radius=${[4, 4, 0, 0]} barSize=${60}>
                  ${attackData.map((entry, index) => (
                      html`<${Cell} key=${`cell-${index}`} fill=${entry.color} />`
                    ))}
                </${Bar}>
              </${BarChart}>
            </${ResponsiveContainer}>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Visualizations;