
import React, { useState, useEffect } from 'react';
import { 
  getServices, 
  saveService, 
  deleteService 
} from '../services/storage';
import { Service } from '../types';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Scissors,
  X
} from 'lucide-react';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });

  useEffect(() => {
    refreshServices();
  }, []);

  const refreshServices = () => {
    setServices(getServices());
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({ name: service.name, price: service.price.toString() });
    } else {
      setEditingService(null);
      setFormData({ name: '', price: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name,
      price: parseInt(formData.price) || 0
    };
    saveService(newService);
    refreshServices();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus layanan ini?')) {
      deleteService(id);
      refreshServices();
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Daftar Layanan</h1>
          <p className="text-slate-400">Kelola menu layanan dan harga Barbershop Anda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Cari nama layanan..."
            className="w-full bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex gap-2">
                 <button onClick={() => handleOpenModal(service)} className="p-2 bg-slate-800 text-amber-500 rounded-lg hover:bg-slate-700">
                   <Edit2 size={16} />
                 </button>
                 <button onClick={() => handleDelete(service.id)} className="p-2 bg-slate-800 text-red-500 rounded-lg hover:bg-slate-700">
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
            
            <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-amber-500 mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
              <Scissors size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 mb-1">{service.name}</h3>
            <p className="text-amber-500 font-serif font-bold text-lg">
              Rp {service.price.toLocaleString()}
            </p>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full py-20 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500">
            <Scissors size={48} className="mb-4 opacity-20" />
            <p className="text-lg">Layanan tidak ditemukan</p>
            <button onClick={() => setSearchTerm('')} className="mt-2 text-amber-500 hover:underline">Reset Pencarian</button>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold">{editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-100">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Nama Layanan</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500 text-slate-100"
                  placeholder="Contoh: Gentlemen Cut"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Harga (Rp)</label>
                <input 
                  required
                  type="number" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500 text-slate-100"
                  placeholder="0"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
