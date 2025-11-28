import React, { useState } from 'react';
import { LayoutDashboard, PieChart, HelpCircle, Shield, Menu, X } from 'lucide-react';
import { html } from './react-utils.js';
import Dashboard from './pages/Dashboard.js';
import Visualizations from './pages/Visualizations.js';
import Help from './pages/Help.js';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return html`<${Dashboard} />`;
      case 'visualizations': return html`<${Visualizations} />`;
      case 'help': return html`<${Help} />`;
      default: return html`<${Dashboard} />`;
    }
  };

  const NavItem = ({ page, icon: Icon, label }) => html`
    <button
      onClick=${() => {
        setActivePage(page);
        setSidebarOpen(false);
      }}
      className=${`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activePage === page 
          ? 'bg-indigo-600 text-white' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <${Icon} size=${20} />
      <span className="font-medium">${label}</span>
    </button>
  `;

  return html`
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded md:hidden"
        onClick=${() => setSidebarOpen(!isSidebarOpen)}
      >
        ${isSidebarOpen ? html`<${X} size=${20} />` : html`<${Menu} size=${20} />`}
      </button>

      <aside className=${`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <${Shield} size=${24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NetGuard</h1>
            <p className="text-xs text-slate-400">Python IDS</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <${NavItem} page="dashboard" icon=${LayoutDashboard} label="Dashboard" />
          <${NavItem} page="visualizations" icon=${PieChart} label="Visualizations" />
          <${NavItem} page="help" icon=${HelpCircle} label="Help & Docs" />
        </nav>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        ${renderContent()}
      </main>
    </div>
  `;
};

export default App;