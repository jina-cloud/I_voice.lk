import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const NewsCard = ({ article, variant = 'default' }) => {
    if (!article) return null;

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
        snippet = rawText.replace(/<[^>]+>/g, '').trim().substring(0, 160);
        if (snippet) snippet += '…';
    } catch { snippet = ''; }

    const catLabel = categoryLabel || 'news';
    const catColors = {
        sports: 'bg-green-600', business: 'bg-blue-600', politics: 'bg-purple-600',
        opinion: 'bg-orange-500', entertainment: 'bg-pink-600', life: 'bg-teal-600', news: 'bg-red-600'
    };
    const badgeColor = catColors[catLabel] || 'bg-red-600';

    // ── HERO ──────────────────────────────────────────────────────────────────
    if (variant === 'hero') {
        return (
            <Link to={linkTo} className="group block no-underline text-inherit h-full">
                <article className="flex flex-col h-full">
                    {cover && (
                        <div className="relative overflow-hidden mb-4 rounded-lg aspect-video bg-gray-100 shadow-sm">
                            <img
                                src={cover} alt={titleSi}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                                onError={e => { e.target.src = 'https://placehold.co/900x506/f3f4f6/9ca3af?text=The+Morning'; }}
                            />
                            <img src="/overlay-sub.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" />
                        </div>
                    )}
                    <div className="flex flex-col flex-grow">
                        <span className={`self-start ${badgeColor} text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2`}>
                            {catLabel}
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black font-serif leading-[1.2] mb-3 text-gray-900 group-hover:text-themorning-red transition-colors duration-200">
                            {titleSi}
                        </h1>
                        {snippet && (
                            <p className="text-gray-500 font-sans text-sm leading-relaxed mb-4 line-clamp-3 hidden sm:block">
                                {snippet}
                            </p>
                        )}
                        {dateFormatted && (
                            <time className="mt-auto text-[11px] font-bold font-sans uppercase tracking-widest text-themorning-red">
                                {dateFormatted}
                            </time>
                        )}
                    </div>
                </article>
            </Link>
        );
    }

    // ── LIST (horizontal) ─────────────────────────────────────────────────────
    if (variant === 'list') {
        return (
            <Link to={linkTo} className="group block no-underline text-inherit">
                <article className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-b-0">
                    {cover && (
                        <div className="relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 overflow-hidden rounded bg-gray-100">
                            <img
                                src={cover} alt={titleSi}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                onError={e => { e.target.src = 'https://placehold.co/200x150/f3f4f6/9ca3af?text=News'; }}
                            />
                            <img src="/overlay-sub.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold font-serif leading-snug text-gray-900 group-hover:text-themorning-red transition-colors line-clamp-3">
                            {titleSi}
                        </h3>
                        {dateFormatted && (
                            <time className="block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {dateFormatted}
                            </time>
                        )}
                    </div>
                </article>
            </Link>
        );
    }

    // ── DEFAULT (grid card) ───────────────────────────────────────────────────
    return (
        <Link to={linkTo} className="group block no-underline text-inherit">
            <article>
                {cover && (
                    <div className="relative overflow-hidden mb-3 aspect-[16/10] rounded-md bg-gray-100">
                        <img
                            src={cover} alt={titleSi}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            onError={e => { e.target.src = 'https://placehold.co/400x250/f3f4f6/9ca3af?text=News'; }}
                        />
                        <img src="/overlay-sub.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" />
                    </div>
                )}
                <span className={`inline-block ${badgeColor} text-white text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded mb-1.5`}>
                    {catLabel}
                </span>
                <h3 className="text-base font-bold font-serif leading-snug text-gray-900 group-hover:text-themorning-red transition-colors line-clamp-3 mb-1.5">
                    {titleSi}
                </h3>
                {dateFormatted && (
                    <time className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{dateFormatted}</time>
                )}
            </article>
        </Link>
    );
};

export default NewsCard;
