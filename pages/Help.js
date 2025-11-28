import React from 'react';
import { BookOpen, ShieldCheck, Cpu } from 'lucide-react';
import { html } from '../react-utils.js';

const Help = () => {
  return html`
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Documentation & Help</h1>

      <div className="space-y-8">
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><${ShieldCheck} size=${24} /></div>
            <h2 className="text-xl font-bold text-slate-800">What is an IDS?</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            A <strong>Network Intrusion Detection System (NIDS)</strong> monitors network traffic for suspicious activity.
            This project uses <strong>Python & Scikit-Learn</strong> to analyze packets in real-time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><${BookOpen} size=${24} /></div>
            <h2 className="text-xl font-bold text-slate-800">Attack Types</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-bold text-red-600 mb-2">DoS</h3>
              <p className="text-sm text-slate-600">Flooding attacks (SYN Flood) detected by high packet frequency.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-bold text-orange-600 mb-2">ARP Spoof</h3>
              <p className="text-sm text-slate-600">Unsolicited ARP replies linking attacker MAC to Gateway IP.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-bold text-yellow-600 mb-2">Port Scan</h3>
              <p className="text-sm text-slate-600">Sequential connection attempts to multiple ports.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><${Cpu} size=${24} /></div>
            <h2 className="text-xl font-bold text-slate-800">How to Run</h2>
          </div>
          <div className="space-y-2 text-slate-700">
            <p><strong>1. Start Backend:</strong> Run <code>uvicorn app:app --reload</code> in the backend folder.</p>
            <p><strong>2. Start Frontend:</strong> Open <code>index.html</code> in your browser.</p>
            <p><strong>3. Analyze:</strong> Click "Start Analysis" on the Dashboard.</p>
          </div>
        </div>

      </div>
    </div>
  `;
};

export default Help;