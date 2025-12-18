
import React from 'react';
import { Trash2, ShoppingBag, CreditCard, Home, Coffee, Utensils, HeartPulse, Landmark, User, Users } from 'lucide-react';
import { Transaction, Category } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const getCategoryIcon = (cat: Category) => {
  switch (cat) {
    case 'Housing': return <Home size={18} />;
    case 'Food': return <Utensils size={18} />;
    case 'Transport': return <ShoppingBag size={18} />;
    case 'Leisure': return <Coffee size={18} />;
    case 'Health': return <HeartPulse size={18} />;
    case 'Salary': return <Landmark size={18} />;
    case 'Investment': return <CreditCard size={18} />;
    default: return <ShoppingBag size={18} />;
  }
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>Nenhuma transação registrada ainda.</p>
        <p className="text-sm mt-1">Comece adicionando seu primeiro gasto ou renda!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide">
      {transactions.map((t) => (
        <div key={t.id} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {getCategoryIcon(t.category)}
            </div>
            <div>
              <p className="font-semibold text-slate-800 leading-tight">{t.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{t.category}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  {t.member === 'Shared' ? <Users size={12} /> : <User size={12} />}
                  {t.member}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
              </p>
              <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
            </div>
            <button 
              onClick={() => onDelete(t.id)}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
