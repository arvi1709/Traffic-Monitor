import React from 'react';
import { html } from '../react-utils.js';

const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return html`
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">${title}</p>
        <h3 className="text-2xl font-bold text-slate-800">${value}</h3>
        ${description && html`<p className="text-xs text-slate-400 mt-2">${description}</p>`}
      </div>
      <div className=${`p-3 rounded-lg border ${colorClasses[color] || colorClasses.blue}`}>
        <${Icon} size=${24} />
      </div>
    </div>
  `;
};

export default StatCard;