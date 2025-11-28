import React, { useState, useEffect } from 'react';
import { 
  Play, Square, ShieldAlert, Activity, 
  Network, Radio, Download, Upload 
} from 'lucide-react';
import { html } from '../react-utils.js';
import StatCard from '../components/StatCard.js';
import { startCapture, stopCapture, getSystemStats } from '../services/api.js';
import { AttackType } from '../constants.js';

const Dashboard = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState([]);
  const [stats, setStats] = useState({
    totalPackets: 0,
    totalAlerts: 0,
    attackCounts: { Normal: 0, DoS: 0, ARP: 0, Scan: 0 }
  });
  const [selectedMode, setSelectedMode] = useState('live');
  const [backendError, setBackendError] = useState(false);

  // Polling Effect
  useEffect(() => {
    let interval;
    if (isCapturing) {
      interval = setInterval(async () => {
        const data = await getSystemStats();
        if (data.total_packets !== undefined) {
          setStats({
            totalPackets: data.total_packets,
            totalAlerts: data.total_alerts,
            attackCounts: data.attack_counts
          });
          setPackets(data.recent_packets);
          setBackendError(false);
        } else {
          setBackendError(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCapturing]);

  const toggleCapture = async () => {
    if (isCapturing) {
      await stopCapture();
      setIsCapturing(false);
    } else {
      const res = await startCapture(selectedMode);
      if (res.status !== 'error') {
        setIsCapturing(true);
        setBackendError(false);
      } else {
        alert("Could not start backend. Make sure 'backend/app.py' is running.");
        setBackendError(true);
      }
    }
  };

  const getSeverityColor = (prediction) => {
    if (prediction === AttackType.NORMAL) return 'text-green-600 bg-green-50 border-green-200';
    if (prediction === AttackType.DOS) return 'text-red-600 bg-red-50 border-red-200';
    if (prediction === AttackType.ARP_SPOOF) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (prediction === AttackType.PORT_SCAN) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-slate-600';
  };

  return html`
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Traffic Monitor</h1>
          <p className="text-slate-500">Real-time packet analysis and anomaly detection</p>
          ${backendError && html`<p className="text-red-500 text-sm mt-1">⚠️ Error connecting to Python Backend (localhost:8000)</p>`}
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
          <select 
            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
            value=${selectedMode}
            onChange=${(e) => setSelectedMode(e.target.value)}
            disabled=${isCapturing}
          >
            <option value="live">Live Sniffing (Scapy)</option>
            <option value="simulated">Simulation (Demo)</option>
          </select>

          <button
            onClick=${toggleCapture}
            className=${`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
              isCapturing 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            ${isCapturing 
              ? html`<${Square} size=${16} /> Stop Capture` 
              : html`<${Play} size=${16} /> Start Analysis`}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <${StatCard} title="Total Packets" value=${stats.totalPackets} icon=${Activity} color="blue" />
        <${StatCard} title="Threats Detected" value=${stats.totalAlerts} icon=${ShieldAlert} color="red" />
        <${StatCard} title="Active Protocol" value="Mixed" icon=${Network} color="green" />
        <${StatCard} title="Monitor Status" value=${isCapturing ? "Running" : "Idle"} icon=${Radio} color=${isCapturing ? "green" : "yellow"} />
      </div>

      {/* Main Analysis Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Recent Alerts List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Live Packet Stream</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Last 50</span>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Destination</th>
                  <th className="px-4 py-3 font-medium">Proto</th>
                  <th className="px-4 py-3 font-medium">Len</th>
                  <th className="px-4 py-3 font-medium">Prediction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                ${packets.length === 0 ? (
                  html`<tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400">
                      ${isCapturing ? "Listening for packets..." : "Waiting to start..."}
                    </td>
                  </tr>`
                ) : (
                  packets.map((pkt, idx) => (
                    html`<tr key=${idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600">${pkt.timestamp}</td>
                      <td className="px-4 py-3">${pkt.src_ip}</td>
                      <td className="px-4 py-3">${pkt.dst_ip}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">${pkt.protocol}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">${pkt.length}</td>
                      <td className="px-4 py-3">
                        <span className=${`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(pkt.prediction)}`}>
                          ${pkt.prediction}
                        </span>
                      </td>
                    </tr>`
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attack Distribution (Mini) */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4">Threat Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Normal</span>
                <span className="font-medium">${stats.attackCounts.Normal || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> DoS Attacks</span>
                <span className="font-medium">${stats.attackCounts['DoS Attack'] || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> ARP Spoof</span>
                <span className="font-medium">${stats.attackCounts['ARP Spoofing'] || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Port Scans</span>
                <span className="font-medium">${stats.attackCounts['Port Scan'] || 0}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">System Status</h4>
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Python Backend Active
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
};

export default Dashboard;