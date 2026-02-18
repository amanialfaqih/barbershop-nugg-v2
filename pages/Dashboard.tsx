
import React, { useMemo } from 'react';
import { 
  getTransactions, 
  getExpenses, 
  getServices 
} from '../services/storage';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Scissors, 
  ArrowUpRight, 
  ArrowDownRight,
  // Added Receipt to fix "Cannot find name 'Receipt'" errors at line 177 and 191
  Receipt 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const transactions = getTransactions();
  const expenses = getExpenses();
  const services = getServices();

  const today = new Date().toISOString().split('T')[0];
  
  const todayTransactions = transactions.filter(t => t.date.startsWith(today));
  const todayIncome = todayTransactions.reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    { 
      label: 'Pemasukan Hari Ini', 
      value: `Rp ${todayIncome.toLocaleString()}`, 
      icon: Wallet, 
      color: 'bg-emerald-500/20 text-emerald-400',
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Total Transaksi', 
      value: todayTransactions.length.toString(), 
      icon: Scissors, 
      color: 'bg-amber-500/20 text-amber-400',
      change: '+5%',
      trend: 'up'
    },
    { 
      label: 'Layanan Aktif', 
      value: services.length.toString(), 
      icon: Users, 
      color: 'bg-blue-500/20 text-blue-400',
      change: '0%',
      trend: 'neutral'
    },
    { 
      label: 'Saldo Kas', 
      value: `Rp ${(transactions.reduce((a,b)=>a+b.amount,0) - expenses.reduce((a,b)=>a+b.amount,0)).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'bg-purple-500/20 text-purple-400',
      change: '+8%',
      trend: 'up'
    },
  ];

  const weeklyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date.startsWith(date));
      const income = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        date: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' }),
        income
      };
    });
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-serif font-bold text-slate-100">Selamat Datang, Admin</h1>
        <p className="text-slate-400 mt-1">Berikut ringkasan performa Barbershop Anda hari ini.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all group">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : stat.trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-400'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight size={12} className="mr-1" />}
                {stat.trend === 'down' && <ArrowDownRight size={12} className="mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1 group-hover:text-amber-400 transition-colors">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Pemasukan Mingguan</h3>
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">7 Hari Terakhir</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `Rp${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold mb-6">Transaksi Terbaru</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {transactions.slice(-5).reverse().map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-100 truncate max-w-[120px]">{t.customerName}</p>
                    <p className="text-xs text-slate-400">{t.serviceName}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-400">
                  +Rp {t.amount.toLocaleString()}
                </p>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Receipt size={48} className="mb-4 opacity-20" />
                <p>Belum ada transaksi</p>
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors text-sm">
            Lihat Semua Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};
