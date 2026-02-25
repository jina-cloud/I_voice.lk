import React, { useState, useEffect } from 'react';

const LiveScoreboard = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasKey, setHasKey] = useState(true);

    const fetchScores = async () => {
        try {
            const res = await fetch('/api/scores');
            const data = await res.json();
            if (data.message === 'No CRICAPI_KEY configured') {
                setHasKey(false);
            } else {
                setMatches(data.matches || []);
            }
        } catch {
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
        const interval = setInterval(fetchScores, 60000); // refresh every 60s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="rounded-xl overflow-hidden shadow-sm bg-gray-950">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#0a1628]">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">🏏 Live Scores</span>
                    {!loading && matches.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    )}
                </div>
                <button
                    onClick={fetchScores}
                    title="Refresh"
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="px-3 py-2 space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                {loading && (
                    <div className="flex items-center justify-center py-4">
                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!loading && !hasKey && (
                    <div className="text-center py-4">
                        <p className="text-[10px] text-gray-500 mb-1">Add <span className="text-emerald-400 font-mono">CRICAPI_KEY</span> to Railway</p>
                        <a
                            href="https://cricapi.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-emerald-500 hover:text-emerald-400 underline"
                        >
                            Get free key at cricapi.com →
                        </a>
                    </div>
                )}

                {!loading && hasKey && matches.length === 0 && (
                    <p className="text-center text-[10px] text-gray-500 py-4">No live matches right now</p>
                )}

                {!loading && matches.map((match) => (
                    <div key={match.id} className="bg-gray-900 rounded-lg p-2.5 border border-gray-800">
                        {/* Match name */}
                        <p className="text-[9px] text-gray-400 font-mono leading-tight mb-1.5 truncate">{match.name}</p>

                        {/* Teams + scores */}
                        <div className="space-y-1">
                            {match.teams.map((team, i) => {
                                // CricAPI inning strings are very inconsistent. Do a fuzzy case-insensitive match.
                                const scoreEntry = match.score?.find(s => {
                                    if (!s.inning) return false;
                                    const teamLower = team.toLowerCase();
                                    const inningLower = s.inning.toLowerCase();
                                    // Sometimes inning is just " Inning 1" or joined names "Bahrain,Bhutan Inning 1".
                                    // If we can't find a direct match, we try to map by index if there are exactly 2 scores.
                                    return inningLower.includes(teamLower) || teamLower.includes(inningLower.replace(' inning 1', '').trim());
                                }) || (match.score?.length === match.teams.length ? match.score[i] : null);

                                return (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-white truncate max-w-[100px]" title={team}>
                                            {team}
                                        </span>
                                        {scoreEntry ? (
                                            <span className="text-[11px] font-black font-mono text-emerald-400">
                                                {scoreEntry.r}/{scoreEntry.w}
                                                <span className="text-[9px] text-gray-500 font-normal ml-1">({scoreEntry.o} ov)</span>
                                            </span>
                                        ) : (
                                            <span className="text-[9px] text-gray-600">Yet to bat</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Status */}
                        <div className="mt-1.5 pt-1.5 border-t border-gray-800">
                            <p className={`text-[9px] font-bold leading-tight ${match.status?.toLowerCase().includes('won') ? 'text-emerald-400' :
                                match.status?.toLowerCase().includes('live') || match.status?.toLowerCase().includes('progress') ? 'text-yellow-400' :
                                    'text-gray-400'
                                }`}>
                                {match.status || 'In Progress'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveScoreboard;
