
import React, { useState, useEffect } from 'react';
import { 
  getServices, 
  getTransactions, 
  saveTransaction 
} from '../services/storage';
import { Service, Transaction, PaymentMethod } from '../types';
import { 
  Plus, 
  ChevronRight, 
  User, 
  CreditCard, 
  CheckCircle2,
  Trash2,
  Receipt
} from 'lucide-react';

export const Transactions: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // New Transaction State
  const [customerName, setCustomerName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setServices(getServices());
    setTransactions(getTransactions());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;

    const service = services.find(s => s.id === selectedServiceId);
    if (!service) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      customerName,
      serviceId: service.id,
      serviceName: service.name,
      amount: service.price,
      date: new Date().toISOString(),
      paymentMethod: paymentMethod
    };

    saveTransaction(newTransaction);
    setTransactions(prev => [...prev, newTransaction]);
    
    // Reset Form
    setCustomerName('');
    setSelectedServiceId('');
    setPaymentMethod(PaymentMethod.CASH);
    
    // Show success state
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Transaction Form */}
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Input Transaksi Baru</h1>
          <p className="text-slate-400">Pilih layanan dan metode pembayaran untuk pelanggan.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
          {isSuccess && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-10 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={64} className="text-emerald-500 mb-4" />
              <p className="text-xl font-bold">Transaksi Berhasil!</p>
              <p className="text-slate-400 text-sm">Data telah tersimpan di sistem.</p>
              <button 
                type="button" 
                onClick={() => setIsSuccess(false)}
                className="mt-6 px-6 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg"
              >
                Lanjut Transaksi Lain
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <User size={16} /> Nama Pelanggan
              </label>
              <input 
                required
                type="text"
                placeholder="Masukkan nama pelanggan..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-amber-500 text-slate-100 text-lg transition-all"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Receipt size={16} /> Pilih Layanan
              </label>
              <div className="grid grid-cols-1 gap-2">
                {services.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      selectedServiceId === service.id 
                      ? 'border-amber-500 bg-amber-500/10' 
                      : 'border-slate-800 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{service.name}</span>
                      <span className="text-xs text-slate-400">ID: {service.id}</span>
                    </div>
                    <span className="font-serif font-bold text-amber-500">
                      Rp {service.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <CreditCard size={16} /> Metode Pembayaran
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(PaymentMethod).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      paymentMethod === method 
                      ? 'bg-amber-500 border-amber-500 text-slate-950' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-400 font-medium">Total Tagihan</span>
              <span className="text-3xl font-serif font-bold text-amber-500">
                Rp {((services.find(s => s.id === selectedServiceId)?.price) || 0).toLocaleString()}
              </span>
            </div>
            <button 
              type="submit"
              disabled={!selectedServiceId || !customerName}
              className="w-full py-5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
            >
              Bayar Sekarang
            </button>
          </div>
        </form>
      </div>

      {/* Recent History Sidebar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Riwayat Transaksi</h2>
        <div className="space-y-4">
          {transactions.slice(-10).reverse().map((t) => (
            <div key={t.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold">{t.customerName}</h4>
                  <p className="text-xs text-slate-500">
                    {t.serviceName} • {new Date(t.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400">Rp {t.amount.toLocaleString()}</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-bold tracking-widest">
                  {t.paymentMethod}
                </span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="py-20 text-center text-slate-500 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
              <Receipt size={40} className="mx-auto mb-3 opacity-20" />
              <p>Belum ada riwayat transaksi hari ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
