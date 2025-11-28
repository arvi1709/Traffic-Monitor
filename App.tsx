import React, { useState } from 'react';
import { LayoutDashboard, PieChart, HelpCircle, Shield, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Visualizations from './pages/Visualizations';
import Help from './pages/Help';

// Simple Router implementation since we can't use React Router DOM in this environment easily
// In a real app, use react-router-dom
enum Page {
  DASHBOARD = 'dashboard',
  VISUALIZATIONS = 'visualizations',
  HELP = 'help'
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case Page.DASHBOARD: return <Dashboard />;
      case Page.VISUALIZATIONS: return <Visualizations />;
      case Page.HELP: return <Help />;
      default: return <Dashboard />;
    }
  };

  const NavItem = ({ page, icon: Icon, label }: { page: Page, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActivePage(page);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activePage === page 
          ? 'bg-indigo-600 text-white' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded md:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NetGuard</h1>
            <p className="text-xs text-slate-400">ML-Based IDS</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <NavItem page={Page.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem page={Page.VISUALIZATIONS} icon={PieChart} label="Visualizations" />
          <NavItem page={Page.HELP} icon={HelpCircle} label="Help & Docs" />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-800 p-4 rounded-xl text-xs text-slate-400">
            <p className="font-semibold text-white mb-1">Student Project</p>
            <p>B.Tech CSE (AIML)</p>
            <p>5th Semester</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;