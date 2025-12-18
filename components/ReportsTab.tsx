import React, { useState, useMemo } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, Category } from '../types';

interface ReportsTabProps {
    transactions: Transaction[];
    partnerA: string;
    partnerB: string;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ transactions, partnerA, partnerB }) => {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedPartner, setSelectedPartner] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories: Category[] = [
        'Housing', 'Food', 'Transport', 'Leisure', 'Health',
        'Salary', 'Investment', 'Other'
    ];

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Date Filter
            if (dateRange.start && new Date(t.date) < new Date(dateRange.start)) return false;
            if (dateRange.end && new Date(t.date) > new Date(dateRange.end)) return false;

            // Partner Filter
            if (selectedPartner !== 'all' && t.member !== selectedPartner) return false;

            // Category Filter
            if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

            return true;
        });
    }, [transactions, dateRange, selectedPartner, selectedCategory]);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Relatório Financeiro', 14, 22);

        doc.setFontSize(11);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
        doc.text(`Total de Transações: ${filteredTransactions.length}`, 14, 36);

        const tableData = filteredTransactions.map(t => [
            new Date(t.date).toLocaleDateString('pt-BR'),
            t.description,
            t.category,
            t.member,
            t.type === 'income' ? `+ R$ ${t.amount.toFixed(2)}` : `- R$ ${t.amount.toFixed(2)}`
        ]);

        autoTable(doc, {
            head: [['Data', 'Descrição', 'Categoria', 'Pago Por', 'Valor']],
            body: tableData,
            startY: 44,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
        });

        doc.save('relatorio-financeiro.pdf');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Filter size={20} className="text-indigo-500" />
                    <h2 className="text-lg font-bold text-slate-800">Filtros</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Data Inicial</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Data Final</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Responsável</label>
                        <select
                            value={selectedPartner}
                            onChange={e => setSelectedPartner(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        >
                            <option value="all">Todos</option>
                            <option value={partnerA}>{partnerA}</option>
                            <option value={partnerB}>{partnerB}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoria</label>
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        >
                            <option value="all">Todas</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Resultados:</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-sm font-bold text-slate-900">{filteredTransactions.length}</span>
                </div>
                <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Download size={18} />
                    Baixar PDF
                </button>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Descrição</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Categoria</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Pago Por</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 text-sm text-slate-600">
                                            {new Date(t.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-800">{t.description}</td>
                                        <td className="p-4 text-sm">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{t.member}</td>
                                        <td className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                            {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Calendar size={48} className="opacity-20" />
                                            <p>Nenhuma transação encontrada com os filtros selecionados.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsTab;
