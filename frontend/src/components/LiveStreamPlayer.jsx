import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

const LiveStreamPlayer = () => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | loading | playing | error

    const startStream = async (video) => {
        setStatus('loading');
        try {
            // Fetch stream URL from backend — URL never exposed in frontend source
            const res = await fetch('/api/stream');
            const { url } = await res.json();

            if (Hls.isSupported()) {
                if (hlsRef.current) hlsRef.current.destroy();
                const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                hlsRef.current = hls;
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => { });
                    setStatus('playing');
                });
                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (data.fatal) setStatus('error');
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(() => { });
                    setStatus('playing');
                }, { once: true });
                video.addEventListener('error', () => setStatus('error'), { once: true });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    // Auto-start when panel opens, stop when closed
    useEffect(() => {
        if (open && videoRef.current) {
            startStream(videoRef.current);
        } else if (!open) {
            if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
            if (videoRef.current) videoRef.current.src = '';
            setStatus('idle');
        }
    }, [open]);

    // Cleanup on unmount
    useEffect(() => () => { if (hlsRef.current) hlsRef.current.destroy(); }, []);

    return (
        <div className="rounded-xl overflow-hidden shadow-sm bg-[#0f2027]">
            {/* Toggle header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0f2027] hover:bg-[#1a3040] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className={`text-red-500 ${status === 'playing' ? 'animate-pulse' : ''}`}>●</span>
                    <span className="text-white font-black font-sans text-xs tracking-widest uppercase">
                        {status === 'playing' ? 'Live Sports · ON AIR' : 'Live Sports Stream'}
                    </span>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expandable panel */}
            {open && (
                <div className="bg-gray-950 p-3 pt-0">
                    {/* Video player */}
                    <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
                        <video
                            ref={videoRef}
                            controls
                            className="w-full h-full"
                            playsInline
                            muted
                        />
                        {status === 'loading' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black pointer-events-none">
                                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-2" />
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Connecting to stream…</p>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black pointer-events-none">
                                <span className="text-red-500 text-2xl mb-1">⚠</span>
                                <p className="text-[10px] text-red-400 uppercase tracking-widest">Stream offline</p>
                                <p className="text-[9px] text-gray-500 mt-1">Please try again later</p>
                            </div>
                        )}
                        {status === 'playing' && (
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded pointer-events-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                                LIVE
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveStreamPlayer;
