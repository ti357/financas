
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardProps {
  stats: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}

const Dashboard: React.FC<DashboardProps> = React.memo(({ stats }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0 // Cleaner look for dashboard
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receitas</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalIncome)}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <TrendingDown size={24} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Despesas</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalExpense)}</p>
      </div>

      <div className={`p-6 rounded-2xl border shadow-sm transition-all ${stats.balance >= 0 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-orange-600 border-orange-500 text-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-lg text-white">
            <DollarSign size={24} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Saldo Geral</span>
        </div>
        <p className="text-3xl font-bold">
          {formatCurrency(stats.balance)}
        </p>
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
