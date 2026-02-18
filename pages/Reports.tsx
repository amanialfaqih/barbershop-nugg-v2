
import React, { useState, useMemo } from 'react';
import { 
  getTransactions, 
  getExpenses, 
  saveExpense, 
  deleteExpense 
} from '../services/storage';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar,
  Filter,
  Download,
  Plus,
  Trash2,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';

export const Reports: React.FC = () => {
  const transactions = getTransactions();
  const [expenses, setExpenses] = useState(getExpenses());
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: ''
  });

  const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));
  const filteredExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  const totalIncome = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now().toString(),
      title: expenseForm.title,
      amount: parseInt(expenseForm.amount) || 0,
      date: new Date().toISOString()
    };
    saveExpense(newExpense);
    setExpenses(getExpenses());
    setExpenseForm({ title: '', amount: '' });
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Hapus data pengeluaran ini?')) {
      deleteExpense(id);
      setExpenses(getExpenses());
    }
  };

  const pieData = [
    { name: 'Pemasukan', value: totalIncome, color: '#10b981' },
    { name: 'Pengeluaran', value: totalExpense, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
          <p className="text-slate-400">Analisis rugi-laba Barbershop Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="month" 
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-100 transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-slate-400 font-medium">Total Pemasukan</span>
          </div>
          <h3 className="text-3xl font-serif font-bold text-emerald-400">Rp {totalIncome.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <span className="text-slate-400 font-medium">Total Pengeluaran</span>
          </div>
          <h3 className="text-3xl font-serif font-bold text-red-400">Rp {totalExpense.toLocaleString()}</h3>
        </div>
        <div className={`p-6 rounded-3xl border ${netProfit >= 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-amber-500 text-slate-950' : 'bg-red-500 text-white'}`}>
              <Wallet size={24} />
            </div>
            <span className="text-slate-400 font-medium">Laba Bersih</span>
          </div>
          <h3 className={`text-3xl font-serif font-bold ${netProfit >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
            Rp {netProfit.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center">
          <h3 className="text-lg font-bold mb-8 w-full">Rasio Keuangan</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 w-full text-center">
            <p className="text-slate-400 text-sm">Persentase Margin Keuntungan</p>
            <h4 className="text-2xl font-bold text-amber-500">
              {totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0}%
            </h4>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Daftar Pengeluaran</h3>
            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="p-2 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-600 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {filteredExpenses.length > 0 ? filteredExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-700 transition-all">
                <div>
                  <h4 className="font-bold text-slate-100">{exp.title}</h4>
                  <p className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-400">-Rp {exp.amount.toLocaleString()}</span>
                  <button onClick={() => handleDeleteExpense(exp.id)} className="text-slate-600 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-500">
                <TrendingDown size={40} className="mx-auto mb-3 opacity-20" />
                <p>Tidak ada pengeluaran bulan ini</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 animate-in zoom-in duration-200 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Tambah Pengeluaran</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Deskripsi/Judul</label>
                <input 
                  required
                  type="text" 
                  placeholder="Contoh: Sewa gedung, Listrik"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500 text-slate-100"
                  value={expenseForm.title}
                  onChange={e => setExpenseForm({...expenseForm, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Nominal (Rp)</label>
                <input 
                  required
                  type="number" 
                  placeholder="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500 text-slate-100"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                />
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-1 py-4 bg-slate-800 text-slate-400 font-bold rounded-xl hover:text-white transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
