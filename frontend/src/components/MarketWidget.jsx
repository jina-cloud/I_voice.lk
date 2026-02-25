import React, { useState, useEffect } from 'react';

const EXCHANGE_RATES = [
    { code: 'USD', name: 'US Dollar', buy: 299.50, sell: 305.20, color: '#3b82f6' },
    { code: 'EUR', name: 'Euro', buy: 318.75, sell: 325.00, color: '#8b5cf6' },
    { code: 'GBP', name: 'British Pound', buy: 370.20, sell: 378.50, color: '#ec4899' },
    { code: 'AUD', name: 'Australian Dollar', buy: 188.40, sell: 193.10, color: '#f59e0b' },
    { code: 'SGD', name: 'Singapore Dollar', buy: 218.60, sell: 224.30, color: '#10b981' },
    { code: 'INR', name: 'Indian Rupee', buy: 3.52, sell: 3.61, color: '#f97316' },
    { code: 'SAR', name: 'Saudi Riyal', buy: 79.80, sell: 82.40, color: '#14b8a6' },
    { code: 'AED', name: 'UAE Dirham', buy: 81.50, sell: 84.20, color: '#6366f1' },
];

const CSE_INDICES = [
    { name: 'ASPI', value: 13842.65, change: +124.30, changePct: +0.91 },
    { name: 'S&P SL20', value: 3971.20, change: -18.45, changePct: -0.46 },
];


const MarketWidget = () => {
    const [tab, setTab] = useState('forex');
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const fmtTime = (d) =>
        d.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Colombo' });

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            {/* Header */}
            <div className="bg-[#0f2027] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-400 rounded" />
                    <h3 className="text-white font-black font-sans text-xs tracking-widest uppercase">
                        MARKETS
                    </h3>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/20 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                        LKR
                    </span>
                </div>
                <span className="text-[9px] text-gray-400 font-mono">{fmtTime(time)} · Colombo</span>
            </div>

            {/* CSE Index bar */}
            <div className="flex divide-x divide-gray-100 border-b border-gray-200">
                {CSE_INDICES.map((idx) => {
                    const up = idx.change >= 0;
                    return (
                        <div key={idx.name} className="flex-1 px-3 py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{idx.name}</p>
                                <p className={`text-[10px] font-bold ${up ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {up ? '+' : ''}{idx.changePct.toFixed(2)}%
                                </p>
                            </div>
                            <p className="text-[15px] font-black text-gray-900 mt-0.5 leading-none">
                                {idx.value.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            </p>
                            <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1">
                                <div
                                    className="h-1 rounded-full"
                                    style={{
                                        width: `${Math.min(100, 50 + idx.changePct * 10)}%`,
                                        background: up ? '#10b981' : '#ef4444',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tab switcher */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                {[
                    { key: 'forex', label: 'Exchange Rates' },
                    { key: 'rates', label: 'Buy / Sell' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${tab === key
                            ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="p-3">
                {tab === 'forex' ? (
                    <div className="space-y-0.5">
                        {EXCHANGE_RATES.map((r) => (
                            <div key={r.code} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="text-[9px] font-black px-1.5 py-0.5 rounded text-white flex-shrink-0"
                                        style={{ background: r.color }}
                                    >
                                        {r.code}
                                    </span>
                                    <span className="text-[10px] text-gray-500 truncate">{r.name}</span>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0 text-right">
                                    <div>
                                        <p className="text-[8px] text-gray-400 leading-none uppercase">Buy</p>
                                        <p className="text-[11px] font-bold text-gray-700">{r.buy.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-gray-400 leading-none uppercase">Sell</p>
                                        <p className="text-[11px] font-bold text-emerald-700">{r.sell.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-3 text-[9px] font-bold text-gray-400 uppercase tracking-wide pb-1.5 border-b border-gray-100 mb-1">
                            <span>Currency</span>
                            <span className="text-center">Buy</span>
                            <span className="text-right">Sell</span>
                        </div>
                        {EXCHANGE_RATES.map((r) => (
                            <div key={r.code} className="grid grid-cols-3 items-center py-1.5 border-b border-gray-50 last:border-0">
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="text-[9px] font-black px-1.5 py-0.5 rounded text-white"
                                        style={{ background: r.color }}
                                    >
                                        {r.code}
                                    </span>
                                </span>
                                <span className="text-[11px] font-mono text-center text-gray-700">{r.buy.toFixed(2)}</span>
                                <span className="text-[11px] font-mono text-right text-emerald-700 font-bold">{r.sell.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="text-[8px] text-gray-300 text-center mt-2">
                    Indicative rates · Central Bank of Sri Lanka
                </p>
            </div>

        </div>
    );
};

export default MarketWidget;
