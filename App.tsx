
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, Users, Trash2, Calendar, Github } from 'lucide-react';
import { Transaction, Category, TransactionType } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import SpendingChart from './components/SpendingChart';
import GithubSyncModal from './components/GithubSyncModal';
import ReportsTab from './components/ReportsTab';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bankfv_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastSync, setLastSync] = useState<string | null>(() => {
    return localStorage.getItem('bankfv_last_sync');
  });

  const [partnerA, setPartnerA] = useState('Teste');
  const [partnerB, setPartnerB] = useState('Milena');
  const [showForm, setShowForm] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports'>('dashboard');

  useEffect(() => {
    localStorage.setItem('bankfv_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSyncSuccess = () => {
    const now = new Date().toLocaleString('pt-BR');
    setLastSync(now);
    localStorage.setItem('bankfv_last_sync', now);
    setShowSync(false);
  };

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Bank Flejs & Vandresen</h1>
              {lastSync && (
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                  Last Sync: {lastSync}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSync(true)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              title="Sync with GitHub"
            >
              <Github size={20} />
            </button>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              <Users size={16} />
              <span>{partnerA} & {partnerB}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-4 pt-2 -mb-px flex gap-6 overflow-x-auto">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`pb-3 font-medium text-sm transition-colors border-b-2 ${currentView === 'dashboard'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('reports')}
            className={`pb-3 font-medium text-sm transition-colors border-b-2 ${currentView === 'reports'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
          >
            Relatórios
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {currentView === 'dashboard' ? (
          <>
            <Dashboard stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Calendar size={20} className="text-indigo-500" />
                      Transações Recentes
                    </h2>
                  </div>
                  <TransactionList
                    transactions={transactions}
                    onDelete={deleteTransaction}
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" />
                    Distribuição de Gastos
                  </h2>
                  <SpendingChart transactions={transactions} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <AIInsights
                  transactions={transactions}
                  partnerA={partnerA}
                  partnerB={partnerB}
                />
              </div>
            </div>
          </>
        ) : (
          <ReportsTab
            transactions={transactions}
            partnerA={partnerA}
            partnerB={partnerB}
          />
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span className="font-semibold">Nova Transação</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Adicionar Transação</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>
            <div className="p-6">
              <TransactionForm onAdd={addTransaction} partnerA={partnerA} partnerB={partnerB} />
            </div>
          </div>
        </div>
      )}

      {showSync && (
        <GithubSyncModal
          onClose={() => setShowSync(false)}
          onSuccess={handleSyncSuccess}
          data={transactions}
        />
      )}
    </div>
  );
};

export default App;
