import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const SLIDE_INTERVAL = 5000; // ms between auto-advance

const HeroSlider = ({ articles = [] }) => {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef(null);
    const total = articles.length;

    const goTo = useCallback((index, manual = false) => {
        if (animating) return;
        setAnimating(true);
        setCurrent((index + total) % total);
        setTimeout(() => setAnimating(false), 600);
        if (manual) {
            setPaused(true);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setPaused(false), 5000);
        }
    }, [animating, total]);

    const next = useCallback(() => goTo(current + 1, true), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1, true), [current, goTo]);

    // Auto-advance
    useEffect(() => {
        if (paused || total === 0) return;
        const id = setInterval(() => {
            setCurrent(c => (c + 1) % total);
        }, SLIDE_INTERVAL);
        return () => clearInterval(id);
    }, [paused, total]);

    if (!articles.length) return null;

    const article = articles[current];
    const { id, titleSi, cover, published, contentSi, categoryLabel } = article;
    const linkTo = `/news/${encodeURIComponent(id)}`;

    let dateFormatted = '';
    try {
        const d = published ? new Date(published) : null;
        dateFormatted = d && !isNaN(d) ? format(d, 'MMM d, yyyy') : '';
    } catch { dateFormatted = ''; }

    let snippet = '';
    try {
        const rawText = Array.isArray(contentSi)
            ? contentSi.map(item => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object') return item.data || item.text || item.content || '';
                return '';
            }).join(' ')
            : typeof contentSi === 'string' ? contentSi : '';
        snippet = rawText.replace(/<[^>]+>/g, '').trim().substring(0, 180);
        if (snippet) snippet += '…';
    } catch { snippet = ''; }

    const catLabel = categoryLabel || 'news';
    const catColors = {
        sports: 'bg-green-600', business: 'bg-blue-600', politics: 'bg-purple-600',
        opinion: 'bg-orange-500', entertainment: 'bg-pink-600', life: 'bg-teal-600', news: 'bg-red-600',
    };
    const badgeColor = catColors[catLabel] || 'bg-red-600';

    return (
        <div
            className="relative overflow-hidden rounded-xl select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* ── Image ─────────────────────────────────────────────── */}
            <Link to={linkTo} className="block group">
                <div className="relative w-full aspect-[16/8] bg-gray-900 overflow-hidden rounded-xl">
                    {cover ? (
                        <img
                            key={current}
                            src={cover}
                            alt={titleSi}
                            className="w-full h-full object-cover object-top transition-transform duration-[6000ms] ease-out group-hover:scale-105"
                            style={{ animation: 'sliderFadeIn 0.6s ease' }}
                            onError={e => { e.target.src = 'https://placehold.co/900x450/1a1a2e/ffffff?text=The+Morning'; }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-900" />
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none rounded-xl" />

                    {/* ── Text overlay ─────────────────────────────────── */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-14 pt-10">
                        {/* Badge + date */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`${badgeColor} text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded`}>
                                {catLabel}
                            </span>
                            {dateFormatted && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{dateFormatted}</span>
                            )}
                        </div>
                        {/* Title */}
                        <h2 className="text-white font-black font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.2] mb-2 drop-shadow-md group-hover:text-red-300 transition-colors duration-200 line-clamp-3">
                            {titleSi}
                        </h2>
                        {/* Snippet */}
                        {snippet && (
                            <p className="text-white/70 text-sm font-sans leading-relaxed line-clamp-2 hidden sm:block max-w-3xl">
                                {snippet}
                            </p>
                        )}
                    </div>
                </div>
            </Link>

            {/* ── Prev / Next arrows ────────────────────────────────── */}
            <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* ── Dot indicators ────────────────────────────────────── */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
                {articles.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, true)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${i === current
                                ? 'w-6 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>

            {/* ── Progress bar ──────────────────────────────────────── */}
            {!paused && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden rounded-b-xl">
                    <div
                        key={current}
                        className="h-full bg-themorning-red"
                        style={{ animation: `sliderProgress ${SLIDE_INTERVAL}ms linear` }}
                    />
                </div>
            )}

            {/* Inline keyframe styles */}
            <style>{`
                @keyframes sliderFadeIn {
                    from { opacity: 0; transform: scale(1.04); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes sliderProgress {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default HeroSlider;
