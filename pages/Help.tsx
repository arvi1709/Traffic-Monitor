import React from 'react';
import { BookOpen, ShieldCheck, Cpu } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Documentation & Help</h1>

      <div className="space-y-8">
        
        {/* Section 1: What is IDS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck size={24} /></div>
            <h2 className="text-xl font-bold text-slate-800">What is an IDS?</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            A <strong>Network Intrusion Detection System (NIDS)</strong> monitors network traffic for suspicious activity and known threats. 
            Unlike a firewall which blocks traffic, an IDS analyzes copies of packets to detect anomalies.
            This project uses <strong>Machine Learning</strong> to learn the difference between "normal" web browsing and malicious attacks.
          </p>
        </div>

        {/* Section 2: Attack Types */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><BookOpen size={24} /></div>
            <h2 className="text-xl font-bold text-slate-800">Detected Attack Types</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-bold text-red-600 mb-2">DoS (Denial of Service)</h3>
              <p className="text-sm text-slate-600">Flooding a target machine with superfluous requests (like SYN packets) to overload systems and prevent legitimate requests.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-bold text-orange-600 mb-2">ARP Spoofing</h3>
              <p className="text-sm text-slate-600">Sending falsified ARP messages over a LAN to link the attacker's MAC address with the IP address of a legitimate computer (e.g., gateway).</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-bold text-yellow-600 mb-2">Port Scanning</h3>
              <p className="text-sm text-slate-600">Probing a server or host for open ports. This is often a precursor to an attack to find vulnerabilities in specific services.</p>
            </div>
          </div>
        </div>

        {/* Section 3: How to Demo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Cpu size={24} /></div>
            <h2 className="text-xl font-bold text-slate-800">How to use this Project</h2>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-slate-700">
            <li><strong>Dashboard:</strong> Start here. The system defaults to an idle state.</li>
            <li><strong>Select Mode:</strong> Use the dropdown in the top right to simulate different traffic patterns (e.g., "Simulate: DoS Attack").</li>
            <li><strong>Start Analysis:</strong> Click the "Start Analysis" button. You will see packets appearing in real-time.</li>
            <li><strong>Observe ML:</strong> Watch the "Prediction" column. Normal traffic is green. Attacks will turn Red/Orange based on the ML model's confidence.</li>
            <li><strong>Visualizations:</strong> Go to the Visualizations tab to see aggregate charts of the captured session.</li>
            <li><strong>Stop:</strong> Click "Stop Capture" to pause the analysis.</li>
          </ol>
        </div>

      </div>
    </div>
  );
};

export default Help;