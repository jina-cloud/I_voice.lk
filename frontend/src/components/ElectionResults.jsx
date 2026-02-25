import React, { useState } from 'react';

const PRESIDENTIAL = [
    { party: 'NPP / JVP', candidate: 'Anura Kumara Dissanayake', votes: 5740179, color: '#e63946' },
    { party: 'SJB', candidate: 'Sajith Premadasa', votes: 4530902, color: '#1d3557' },
    { party: 'SLPP / SLFP', candidate: 'Ranil Wickremesinghe', votes: 2299767, color: '#457b9d' },
    { party: 'SLMC', candidate: 'M.M. Harees', votes: 226343, color: '#2a9d8f' },
    { party: 'Other', candidate: '—', votes: 342809, color: '#adb5bd' },
];

const PARLIAMENTARY = [
    { party: 'NPP', color: '#e63946', seats: 159 },
    { party: 'SJB', color: '#1d3557', seats: 40 },
    { party: 'SLPP', color: '#457b9d', seats: 18 },
    { party: 'UNP', color: '#f4a261', seats: 5 },
    { party: 'ITAK', color: '#2a9d8f', seats: 3 },
];

const TOTAL_SEATS = 225;
const totalVotes = PRESIDENTIAL.reduce((s, p) => s + p.votes, 0);

const ElectionResults = () => {
    const [tab, setTab] = useState('presidential');

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            {/* Header */}
            <div className="bg-[#1a1a2e] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-500 rounded" />
                    <h3 className="text-white font-black font-sans text-xs tracking-widest uppercase">
                        Election Results
                    </h3>
                    <span className="text-[9px] font-bold text-red-400 bg-red-400/20 border border-red-400/30 px-1.5 py-0.5 rounded">
                        2025 · SL
                    </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Final Count</span>
            </div>

            {/* Tab switcher */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                {[
                    { key: 'presidential', label: 'Presidential' },
                    { key: 'parliamentary', label: 'Parliamentary' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${tab === key
                                ? 'border-b-2 border-red-600 text-red-600 bg-white'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Presidential */}
            {tab === 'presidential' && (
                <div className="p-3 space-y-2.5">
                    {PRESIDENTIAL.map((p, i) => {
                        const pct = ((p.votes / totalVotes) * 100).toFixed(1);
                        return (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                                        <span className="text-[11px] font-bold text-gray-800 truncate">{p.party}</span>
                                        {i === 0 && (
                                            <span className="text-[8px] bg-green-100 text-green-700 font-black px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0">
                                                Winner
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-1.5 flex-shrink-0 ml-2">
                                        <span className="text-[12px] font-black text-gray-900">{pct}%</span>
                                        <span className="text-[9px] text-gray-400">{(p.votes / 1e6).toFixed(2)}M</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="h-1.5 rounded-full"
                                        style={{ width: `${pct}%`, background: p.color }}
                                    />
                                </div>
                                {p.candidate !== '—' && (
                                    <p className="text-[9px] text-gray-400 mt-0.5 ml-3.5">{p.candidate}</p>
                                )}
                            </div>
                        );
                    })}
                    <p className="text-[8px] text-gray-300 text-center border-t border-gray-100 pt-2">
                        Total: {totalVotes.toLocaleString()} votes · Sep 21, 2024
                    </p>
                </div>
            )}

            {/* Parliamentary */}
            {tab === 'parliamentary' && (
                <div className="p-3">
                    {/* Seat blocks */}
                    <div className="flex items-center gap-0.5 mb-3 flex-wrap">
                        {PARLIAMENTARY.map((p) =>
                            Array.from({ length: Math.round(p.seats / 5) }).map((_, j) => (
                                <span
                                    key={`${p.party}-${j}`}
                                    className="w-3.5 h-3.5 rounded-sm"
                                    style={{ background: p.color }}
                                    title={`${p.party}: ${p.seats} seats`}
                                />
                            ))
                        )}
                    </div>
                    <div className="space-y-2">
                        {PARLIAMENTARY.map((p) => {
                            const pct = ((p.seats / TOTAL_SEATS) * 100).toFixed(1);
                            return (
                                <div key={p.party} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                                    <span className="text-[11px] font-bold text-gray-700 w-14 flex-shrink-0">{p.party}</span>
                                    <div className="flex-grow bg-gray-100 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: p.color }} />
                                    </div>
                                    <span className="text-[11px] font-black text-gray-900 w-6 text-right flex-shrink-0">
                                        {p.seats}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[8px] text-gray-300 text-center border-t border-gray-100 pt-2 mt-3">
                        Total seats: {TOTAL_SEATS} · Majority: 113 · Nov 14, 2024
                    </p>
                </div>
            )}
        </div>
    );
};

export default ElectionResults;
