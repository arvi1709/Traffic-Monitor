import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const Visualizations: React.FC = () => {
  // Mock Data for Visualization
  const attackData = [
    { name: 'Normal', value: 1240, color: '#22c55e' },
    { name: 'DoS', value: 400, color: '#ef4444' },
    { name: 'ARP Spoof', value: 150, color: '#f97316' },
    { name: 'Port Scan', value: 280, color: '#eab308' },
  ];

  const timeData = [
    { time: '10:00', packets: 400, alerts: 10 },
    { time: '10:05', packets: 300, alerts: 5 },
    { time: '10:10', packets: 800, alerts: 120 }, // Attack spike
    { time: '10:15', packets: 750, alerts: 100 },
    { time: '10:20', packets: 350, alerts: 20 },
    { time: '10:25', packets: 450, alerts: 15 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Visual Analytics</h1>
      <p className="text-slate-500">Graphical representation of network traffic and detected threats.</p>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Attack Distribution Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Traffic Classification</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Over Time Line */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Traffic Volume vs Alerts</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="packets" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart by Severity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
          <h3 className="font-semibold text-slate-700 mb-4">Attack Counts by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={60}>
                  {attackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;