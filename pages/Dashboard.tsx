import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Square, ShieldAlert, Activity, 
  Network, Radio, Download, Upload 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { generatePacket, setSimulationMode } from '../services/simulationService';
import { AttackType, Packet, SystemStats, Protocol } from '../types';

const Dashboard: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalPackets: 0,
    totalAlerts: 0,
    normalCount: 0,
    dosCount: 0,
    arpCount: 0,
    scanCount: 0,
  });
  const [selectedAttackMode, setSelectedAttackMode] = useState<AttackType>(AttackType.NORMAL);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulation Loop
  useEffect(() => {
    let interval: number | undefined;

    if (isCapturing) {
      setSimulationMode(selectedAttackMode);
      interval = window.setInterval(() => {
        const newPacket = generatePacket();
        
        setPackets(prev => {
          const updated = [newPacket, ...prev].slice(0, 50); // Keep last 50
          return updated;
        });

        setStats(prev => ({
          totalPackets: prev.totalPackets + 1,
          totalAlerts: newPacket.prediction !== AttackType.NORMAL ? prev.totalAlerts + 1 : prev.totalAlerts,
          normalCount: newPacket.prediction === AttackType.NORMAL ? prev.normalCount + 1 : prev.normalCount,
          dosCount: newPacket.prediction === AttackType.DOS ? prev.dosCount + 1 : prev.dosCount,
          arpCount: newPacket.prediction === AttackType.ARP_SPOOF ? prev.arpCount + 1 : prev.arpCount,
          scanCount: newPacket.prediction === AttackType.PORT_SCAN ? prev.scanCount + 1 : prev.scanCount,
        }));

      }, selectedAttackMode === AttackType.DOS ? 200 : 800); // Faster for DoS
    }

    return () => clearInterval(interval);
  }, [isCapturing, selectedAttackMode]);

  // Handle Mode Change
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as AttackType;
    setSelectedAttackMode(newMode);
    // Restart logic is handled by effect dependency
  };

  const getSeverityColor = (type: AttackType) => {
    switch (type) {
      case AttackType.NORMAL: return 'text-green-600 bg-green-50 border-green-200';
      case AttackType.DOS: return 'text-red-600 bg-red-50 border-red-200';
      case AttackType.ARP_SPOOF: return 'text-orange-600 bg-orange-50 border-orange-200';
      case AttackType.PORT_SCAN: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-600';
    }
  };

  const handleExport = () => {
    const headers = "Timestamp,SrcIP,DstIP,Protocol,Length,Prediction,Confidence\n";
    const rows = packets.map(p => 
      `${p.timestamp},${p.srcIp},${p.dstIp},${p.protocol},${p.length},${p.prediction},${p.confidence.toFixed(2)}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ids_log_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Traffic Monitor</h1>
          <p className="text-slate-500">Real-time packet analysis and anomaly detection</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
          <select 
            className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedAttackMode}
            onChange={handleModeChange}
            disabled={isCapturing} // Lock mode while running for clarity
          >
            <option value={AttackType.NORMAL}>Simulate: Normal Traffic</option>
            <option value={AttackType.DOS}>Simulate: DoS Attack</option>
            <option value={AttackType.PORT_SCAN}>Simulate: Port Scan</option>
            <option value={AttackType.ARP_SPOOF}>Simulate: ARP Spoof</option>
          </select>

          <button
            onClick={() => setIsCapturing(!isCapturing)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
              isCapturing 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isCapturing ? <><Square size={16} /> Stop Capture</> : <><Play size={16} /> Start Analysis</>}
          </button>

          <button onClick={handleExport} className="p-2 text-slate-500 hover:text-indigo-600 border-l pl-3 ml-1">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Packets" value={stats.totalPackets} icon={Activity} color="blue" />
        <StatCard title="Threats Detected" value={stats.totalAlerts} icon={ShieldAlert} color="red" description={`${((stats.totalAlerts / (stats.totalPackets || 1)) * 100).toFixed(1)}% detection rate`} />
        <StatCard title="Active Protocol" value="TCP/UDP" icon={Network} color="green" />
        <StatCard title="Monitor Status" value={isCapturing ? "Live" : "Idle"} icon={Radio} color={isCapturing ? "green" : "yellow"} />
      </div>

      {/* Main Analysis Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Recent Alerts List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Live Packet Stream</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Showing last 50</span>
          </div>
          
          <div className="flex-1 overflow-auto p-0" ref={scrollRef}>
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
                {packets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      Waiting for traffic... Press "Start Analysis"
                    </td>
                  </tr>
                ) : (
                  packets.map((pkt) => (
                    <tr key={pkt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600">{pkt.timestamp}</td>
                      <td className="px-4 py-3">{pkt.srcIp}</td>
                      <td className="px-4 py-3">{pkt.dstIp}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{pkt.protocol}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{pkt.length}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(pkt.prediction)}`}>
                          {pkt.prediction}
                          {pkt.prediction !== AttackType.NORMAL && ` (${(pkt.confidence * 100).toFixed(0)}%)`}
                        </span>
                      </td>
                    </tr>
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
                <span className="font-medium">{stats.normalCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> DoS Attacks</span>
                <span className="font-medium">{stats.dosCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> ARP Spoof</span>
                <span className="font-medium">{stats.arpCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Port Scans</span>
                <span className="font-medium">{stats.scanCount}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">System Status</h4>
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                ML Model Active (RandomForest)
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg">
             <h3 className="font-bold mb-2 flex items-center gap-2"><Upload size={18}/> Analyze File</h3>
             <p className="text-sm text-slate-300 mb-4">Upload a .pcap or .csv file to run the IDS model on offline data.</p>
             <label className="block w-full text-center cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors py-2 rounded border border-slate-600 border-dashed">
               <span className="text-sm font-medium">Browse Files</span>
               <input type="file" className="hidden" accept=".csv,.pcap" onChange={() => alert("File upload simulation: Logic would parse CSV on backend.")} />
             </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;