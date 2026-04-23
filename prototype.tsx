import React, { useState, useEffect, useMemo } from 'react';

// --- Types ---
type View = 'DASHBOARD' | 'INVENTORY' | 'ORDERS' | 'ANALYTICS' | 'SETTINGS' | 'ALERTS';
type Role = 'STAFF' | 'SUPERVISOR' | 'MANAGER';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  reorderLevel: number;
  lastUpdated: string;
  status: 'optimal' | 'warning' | 'critical';
  expiryDate?: string;
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'completed' | 'pending';
  timestamp: string;
}

// --- Mock Data Generator ---
const INITIAL_PRODUCTS: Product[] = [
  { id: 'RTDK-100123', name: 'Plastic Water Jug (2L)', category: 'Kitchenware', quantity: 124, price: 450.00, reorderLevel: 50, lastUpdated: '12:45 PM', status: 'optimal', expiryDate: '2025-12-31' },
  { id: 'RTDK-200567', name: 'Storage Bin Large', category: 'Home', quantity: 14, price: 1200.00, reorderLevel: 25, lastUpdated: '11:20 AM', status: 'critical', expiryDate: '2026-05-15' },
  { id: 'RTDK-300789', name: 'Dining Plate Set', category: 'Kitchenware', quantity: 45, price: 850.00, reorderLevel: 40, lastUpdated: '10:05 AM', status: 'warning', expiryDate: '2025-09-20' },
  { id: 'RTDK-400111', name: 'Garden Chair (Green)', category: 'Outdoor', quantity: 210, price: 2100.00, reorderLevel: 30, lastUpdated: '09:30 AM', status: 'optimal', expiryDate: '2027-01-10' },
];

const RECENT_ORDERS: Order[] = [
  { id: 'ORD-8821', customer: 'Nimal Perera', total: 4500.00, status: 'completed', timestamp: '10 mins ago' },
  { id: 'ORD-8822', customer: 'Sunil Silva', total: 1250.00, status: 'pending', timestamp: '25 mins ago' },
  { id: 'ORD-8823', customer: 'Kamal Gunaratne', total: 8900.00, status: 'completed', timestamp: '1 hour ago' },
];

export default function RTDKInventorySystem() {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [currentRole, setCurrentRole] = useState<Role>('MANAGER');
  const [inventory, setInventory] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanLog, setScanLog] = useState<string[]>(['Neural System Online...', 'Awaiting neural link...']);
  
  // --- Access Control Logic ---
  const canAccessView = (view: View) => {
    if (currentRole === 'MANAGER') return true;
    if (currentRole === 'SUPERVISOR') {
      return ['DASHBOARD', 'INVENTORY', 'ORDERS', 'ALERTS'].includes(view);
    }
    return ['DASHBOARD', 'INVENTORY', 'ORDERS'].includes(view);
  };

  const restrictedViews: View[] = ['ANALYTICS', 'SETTINGS', 'ALERTS'];

  // --- Derived Stats ---
  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const criticalItems = inventory.filter(p => p.status === 'critical').length;
    const stockValue = inventory.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    return { totalItems, criticalItems, stockValue };
  }, [inventory]);

  // --- Handlers ---
  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * inventory.length);
      const target = inventory[randomIdx];
      
      setInventory(prev => prev.map((p, i) => {
        if (i === randomIdx) {
          const newQty = Math.max(0, p.quantity - 1);
          return {
            ...p,
            quantity: newQty,
            status: newQty === 0 ? 'critical' : newQty < p.reorderLevel ? 'warning' : 'optimal',
            lastUpdated: 'JUST NOW'
          };
        }
        return p;
      }));

      setScanLog(prev => [`[LOG] Scanned: ${target.name} (-1 unit)`, ...prev].slice(0, 5));
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-[#050508] text-[#e0e0e0] font-['Geist_Mono',monospace] overflow-hidden selection:bg-[#00f0ff] selection:text-black">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#00f0ff]/10 bg-[#08080c] flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <span className="text-black font-black text-2xl tracking-tighter">R</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white">RT & DK</h1>
            <p className="text-[10px] text-[#00f0ff] tracking-[0.3em] font-bold">INVENTORY v2.1</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem active={currentView === 'DASHBOARD'} onClick={() => setCurrentView('DASHBOARD')} icon="M13 10V3L4 14h7v7l9-11h-7z" label="Command Center" />
          <NavItem active={currentView === 'INVENTORY'} onClick={() => setCurrentView('INVENTORY')} icon="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" label="Inventory Matrix" />
          <NavItem active={currentView === 'ORDERS'} onClick={() => setCurrentView('ORDERS')} icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" label="Supply Orders" />
          
          {canAccessView('ALERTS') && (
            <NavItem active={currentView === 'ALERTS'} onClick={() => setCurrentView('ALERTS')} icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" label="Critical Alerts" />
          )}

          {canAccessView('ANALYTICS') && (
            <NavItem active={currentView === 'ANALYTICS'} onClick={() => setCurrentView('ANALYTICS')} icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" label="Data Neural" />
          )}
        </nav>

        <div className="p-6 border-t border-[#00f0ff]/5">
          <div className="mb-4">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-2">Access Authority</span>
            <select 
              value={currentRole} 
              onChange={(e) => {
                const newRole = e.target.value as Role;
                setCurrentRole(newRole);
                if (newRole === 'STAFF' && restrictedViews.includes(currentView)) {
                  setCurrentView('DASHBOARD');
                }
              }}
              className="w-full bg-[#12121a] border border-[#00f0ff]/20 text-[10px] text-[#00f0ff] px-2 py-1.5 focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="STAFF">STAFF ACCESS</option>
              <option value="SUPERVISOR">SUPERVISOR ACCESS</option>
              <option value="MANAGER">MANAGER AUTHORITY</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{currentRole} ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ff0000]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-20 border-b border-[#00f0ff]/10 flex items-center justify-between px-10 bg-[#08080c]/50 backdrop-blur-xl">
          <div className="flex flex-col">
            <h2 className="text-xs uppercase tracking-[0.4em] text-[#00f0ff]">Neural Interface</h2>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{currentView}</span>
              <span className="text-[10px] px-2 py-0.5 rounded border border-[#00f0ff]/20 text-[#00f0ff] bg-[#00f0ff]/5">REAL-TIME</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={simulateScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                isScanning 
                ? 'border-gray-700 text-gray-600' 
                : 'border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              }`}
            >
              <svg className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
              {isScanning ? 'Processing...' : 'Neural Scan Item'}
            </button>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          
          {currentView === 'DASHBOARD' && (
            <div className="space-y-10 animate-fade-in">
              {/* Stats HUD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Assets" value={stats.totalItems} trend="+12% / mo" color="#00f0ff" />
                <StatCard label="Neural Alerts" value={stats.criticalItems} trend="Action Required" color="#ff0000" />
                <StatCard label="Inventory Valuation" value={`LKR ${stats.stockValue.toLocaleString()}`} trend="Real-time Sync" color="#00f0ff" />
              </div>

              {/* Central Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Scan Log */}
                <div className="bg-[#0c0c14] border border-[#00f0ff]/10 rounded-lg overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-[#00f0ff]/10 flex justify-between items-center bg-[#11111a]">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#00f0ff] uppercase">Scan Telemetry</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-[#00f0ff]"></div>
                      <div className="w-1 h-1 bg-[#00f0ff]/50"></div>
                      <div className="w-1 h-1 bg-[#00f0ff]/20"></div>
                    </div>
                  </div>
                  <div className="p-6 h-[300px] overflow-hidden flex flex-col justify-end space-y-3 font-mono text-xs">
                    {scanLog.map((log, i) => (
                      <div key={i} className="flex items-center gap-3 opacity-80" style={{ opacity: 1 - (i * 0.15) }}>
                        <span className="text-[#00f0ff] font-bold">&gt;&gt;</span>
                        <span className={log.includes('Scanned') ? 'text-white' : 'text-gray-500'}>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-[#0c0c14] border border-[#00f0ff]/10 rounded-lg p-6">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">Asset Categorization</h3>
                  <div className="space-y-6">
                    <ProgressBar label="Kitchenware" percent={65} color="#00f0ff" />
                    <ProgressBar label="Home Essentials" percent={42} color="#0066ff" />
                    <ProgressBar label="Outdoor Supply" percent={88} color="#00f0ff" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'INVENTORY' && (
            <div className="animate-fade-in space-y-6">
               <div className="bg-[#0c0c14] border border-[#00f0ff]/10 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[10px] uppercase tracking-wider">
                    <thead>
                      <tr className="bg-[#11111a] border-b border-[#00f0ff]/20">
                        <th className="px-6 py-4 font-bold text-[#00f0ff]">Asset ID</th>
                        <th className="px-6 py-4 font-bold text-[#00f0ff]">Nomenclature</th>
                        <th className="px-6 py-4 font-bold text-[#00f0ff]">Category</th>
                        <th className="px-6 py-4 font-bold text-[#00f0ff] text-right">Quantity</th>
                        <th className="px-6 py-4 font-bold text-[#00f0ff]">Status</th>
                        <th className="px-6 py-4 font-bold text-[#00f0ff] text-right">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00f0ff]/5">
                      {inventory.map(product => (
                        <tr key={product.id} className="hover:bg-[#00f0ff]/5 transition-colors group">
                          <td className="px-6 py-5 text-gray-400 group-hover:text-[#00f0ff]">{product.id}</td>
                          <td className="px-6 py-5 font-bold text-white">{product.name}</td>
                          <td className="px-6 py-5 text-gray-500">{product.category}</td>
                          <td className="px-6 py-5 text-right font-bold tabular-nums text-white">{product.quantity}</td>
                          <td className="px-6 py-5">
                            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black tracking-widest border ${
                              product.status === 'optimal' ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff]' :
                              product.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500' :
                              'bg-[#ff0000]/10 border-[#ff0000]/40 text-[#ff0000] animate-pulse'
                            }`}>
                              {product.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right tabular-nums text-gray-400">LKR {product.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {currentView === 'ALERTS' && (
            <div className="animate-fade-in space-y-6">
               <h3 className="text-xs font-bold tracking-[0.3em] text-[#ff0000] uppercase mb-4">Neural Warning Relay</h3>
               <div className="grid grid-cols-1 gap-4">
                  {inventory.filter(p => p.status !== 'optimal').map(p => (
                    <div key={p.id} className="bg-[#1a0a0a] border border-[#ff0000]/20 p-6 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#ff0000]/10 border border-[#ff0000]/30 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#ff0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{p.name}</p>
                          <p className="text-[10px] text-[#ff0000] uppercase tracking-widest">CRITICAL LOW STOCK: {p.quantity} UNITS REMAINING</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-[#ff0000]/10 border border-[#ff0000] text-[#ff0000] text-[10px] font-bold uppercase tracking-widest hover:bg-[#ff0000] hover:text-black transition-all">GENERATE P.O.</button>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100;400;700;900&display=swap');
        
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050508; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00f0ff22; border-radius: 10px; }
      `}} />
    </div>
  );
}

// --- Sub-components ---

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 group relative ${
        active ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00f0ff] rounded-r shadow-[0_0_10px_#00f0ff]"></div>}
      <svg className={`w-4 h-4 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function StatCard({ label, value, trend, color }: { label: string; value: string | number; trend: string; color: string }) {
  return (
    <div className="bg-[#0c0c14] border border-[#00f0ff]/10 p-6 rounded-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-[#00f0ff]/5 rotate-45 -mr-10 -mt-10"></div>
      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">{label}</p>
      <h3 className="text-xl font-bold text-white mb-2 tabular-nums" style={{ color: color }}>{value}</h3>
      <p className="text-[8px] font-bold tracking-widest text-gray-600 uppercase">{trend}</p>
    </div>
  );
}

function ProgressBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-gray-500">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${percent}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
      </div>
    </div>
  );
}
