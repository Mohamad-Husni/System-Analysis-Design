import React, { useState, useEffect } from 'react';

// --- Types & Interfaces ---
interface StockItem {
  id: string;
  name: string;
  quantity: number;
  status: 'optimal' | 'low' | 'out';
  lastUpdated: string;
}

// --- Mock Data ---
const initialStock: StockItem[] = [
  { id: 'RT-881A', name: 'Servo Motor Alpha', quantity: 45, status: 'optimal', lastUpdated: '10:04 AM' },
  { id: 'DK-992B', name: 'Thermal Sensor Node', quantity: 12, status: 'low', lastUpdated: '09:15 AM' },
  { id: 'RT-103C', name: 'Lithium Core Battery', quantity: 0, status: 'out', lastUpdated: '08:00 AM' },
  { id: 'DK-554D', name: 'Actuator Assembly', quantity: 89, status: 'optimal', lastUpdated: '10:30 AM' },
];

export default function RoboticDashboard() {
  const [inventory, setInventory] = useState<StockItem[]>(initialStock);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // --- Handlers ---
  const handleSimulateScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      // Simulate randomly scanning an item from the inventory and decrementing its stock
      const randomIdx = Math.floor(Math.random() * inventory.length);
      const targetItem = inventory[randomIdx];

      setInventory((prev) =>
        prev.map((item, idx) => {
          if (idx === randomIdx && item.quantity > 0) {
            const newQty = item.quantity - 1;
            return {
              ...item,
              quantity: newQty,
              status: newQty === 0 ? 'out' : newQty < 15 ? 'low' : 'optimal',
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return item;
        })
      );

      setScanResult(`Successfully logged outgoing unit: ${targetItem.name}`);
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono selection:bg-[#00f0ff] selection:text-black">
    {/* Header */}
    <header className="border-b border-[#00f0ff]/20 bg-[#0d0d14] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#00f0ff] to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          <span className="text-black font-bold text-xl tracking-tighter">M</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-widest text-white uppercase">Mistravora<span className="text-[#00f0ff]">Core</span></h1>
          <p className="text-xs text-[#00f0ff]/70 tracking-[0.2em] uppercase">RT & DK Consumers Laboratory</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs tracking-widest">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
          </span>
          <span className="text-[#00f0ff]">SYSTEM ONLINE</span>
        </div>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400">SESSION: 8X-990</span>
      </div>
    </header>

    {/* Main Grid */}
    <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">

      {/* Left Col: QR Scanner Simulator */}
      <section className="lg:col-span-1 space-y-6">
        <div className="bg-[#12121a] border border-[#00f0ff]/20 rounded-lg p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50"></div>

          <h2 className="text-[#00f0ff] text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M3 10v4M21 10v4M10 3h4M10 21h4m-8-5v2a2 2 0 002 2h2m4-14h2a2 2 0 012 2v2M6 3H4a2 2 0 00-2 2v2"></path></svg>
            QR Scanner Relay
          </h2>

          {/* Scanner Viewport */}
          <div className="relative aspect-square bg-[#08080c] border border-gray-800 rounded flex items-center justify-center mb-6 overflow-hidden">
            {scanning ? (
              <>
                <div className="absolute inset-0 bg-[#00f0ff]/5 animate-pulse"></div>
                <div className="w-full h-0.5 bg-[#00f0ff] absolute top-1/2 left-0 shadow-[0_0_10px_#00f0ff] animate-[scan_1s_ease-in-out_infinite]"></div>
                <p className="text-[#00f0ff] text-xs tracking-widest animate-pulse z-10">AWAITING READ...</p>
              </>
            ) : (
              <p className="text-gray-600 text-xs tracking-widest">SENSOR STANDBY</p>
            )}

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]/50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]/50"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]/50"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]/50"></div>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={scanning}
            className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 border ${scanning
                ? 'bg-transparent border-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
          >
            {scanning ? 'Processing...' : 'Simulate QR Scan'}
          </button>

          {/* Terminal Output */}
          <div className="mt-6 bg-black border border-gray-800 p-4 rounded h-24 overflow-hidden">
            <p className="text-gray-500 text-xs mb-1">&gt; _System Log</p>
            {scanResult && (
              <p className="text-[#00f0ff] text-xs">[{new Date().toLocaleTimeString()}] {scanResult}</p>
            )}
          </div>
        </div>
      </section>

      {/* Right Col: Live Inventory Matrix */}
      <section className="lg:col-span-2 space-y-6">
        <div className="bg-[#12121a] border border-[#00f0ff]/20 rounded-lg p-6 h-full">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-[#00f0ff] text-sm uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              Live Inventory Matrix
            </h2>
            <span className="text-xs text-gray-500 tracking-widest">SYNC: AUTO</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="py-4 px-4 font-normal">Asset ID</th>
                  <th className="py-4 px-4 font-normal">Nomenclature</th>
                  <th className="py-4 px-4 font-normal text-right">Qty</th>
                  <th className="py-4 px-4 font-normal">Status</th>
                  <th className="py-4 px-4 font-normal text-right">Last Sync</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800/50 hover:bg-[#00f0ff]/5 transition-colors">
                    <td className="py-4 px-4 text-gray-300">{item.id}</td>
                    <td className="py-4 px-4 text-white">{item.name}</td>
                    <td className="py-4 px-4 text-right font-bold tabular-nums">
                      {item.quantity.toString().padStart(3, '0')}
                    </td>
                    <td className="py-4 px-4">
                      {item.status === 'optimal' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">OPTIMAL</span>}
                      {item.status === 'low' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">LOW YIELD</span>}
                      {item.status === 'out' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#ff0000]/10 text-[#ff0000] border border-[#ff0000]/20 animate-pulse">CRITICAL</span>}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-500 tabular-nums text-xs">
                      {item.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </main>

    {/* Global CSS for Animations */}
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
  </div>
  );
}
