
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, RefreshCcw } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialInsights } from '../geminiService';

interface AIInsightsProps {
  transactions: Transaction[];
  partnerA: string;
  partnerB: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions, partnerA, partnerB }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (transactions.length < 3) return;
    setLoading(true);
    const result = await getFinancialInsights(transactions, partnerA, partnerB);
    setInsight(result || "Erro ao carregar insights.");
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length >= 3 && !insight) {
      fetchInsights();
    }
  }, [transactions]);

  return (
    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative border border-indigo-800">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BrainCircuit size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-300" />
            Insights do Casal
          </h3>
          <button 
            onClick={fetchInsights}
            disabled={loading || transactions.length < 3}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {transactions.length < 3 ? (
          <p className="text-indigo-200 text-sm italic">
            Adicione pelo menos 3 transações para desbloquear a inteligência artificial.
          </p>
        ) : loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-indigo-800 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-indigo-800 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-indigo-800 animate-pulse rounded w-1/2"></div>
          </div>
        ) : (
          <div className="text-indigo-50 text-sm leading-relaxed whitespace-pre-line bg-indigo-800/40 p-4 rounded-xl">
            {insight}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-indigo-800 flex items-center gap-2 text-xs text-indigo-300 font-medium">
          <BrainCircuit size={14} />
          Powered by Gemini AI
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
