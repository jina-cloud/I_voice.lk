import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewsCard from './NewsCard';

const CATEGORIES = {
    news: { label: 'News', emoji: '📰', color: '#dc2626' },
    sports: { label: 'Sports', emoji: '🏆', color: '#16a34a' },
    business: { label: 'Business', emoji: '💼', color: '#2563eb' },
    politics: { label: 'Politics', emoji: '🏛️', color: '#7c3aed' },
    opinion: { label: 'Opinion', emoji: '💡', color: '#ea580c' },
    entertainment: { label: 'Entertainment', emoji: '🎬', color: '#db2777' },
    life: { label: 'Life', emoji: '🌿', color: '#0d9488' },
};

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const CategoryPage = () => {
    const { category } = useParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const catInfo = CATEGORIES[category] || { label: category, emoji: '📰', color: '#dc2626' };

    const fetchCategory = async (p = 1) => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/news/category/${category}?page=${p}&limit=20`);
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const json = await res.json();
            if (json.success) {
                setArticles(json.data);
                setTotalPages(json.totalPages || 1);
                setPage(p);
            } else {
                throw new Error(json.message || 'Failed to fetch');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setPage(1);
        fetchCategory(1);
    }, [category]);

    const heroArticle = articles[0];
    const secondHero = articles[1];
    const listStories = articles.slice(2, 6);
    const gridArticles = articles.slice(6);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Sticky nav */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors group no-underline"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                        <span className="hidden sm:inline">Back to News</span>
                    </Link>
                    <Link to="/" className="flex items-center no-underline">
                        <img src="/logo.png" alt="iVoice Logo" className="h-[28px] w-auto" />
                    </Link>
                    <div className="w-24" />
                </div>

                {/* Category sub-nav */}
                <div className="border-t border-gray-100 bg-white">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 overflow-x-auto">
                        <ul className="flex gap-1 py-0 whitespace-nowrap">
                            {Object.entries(CATEGORIES).map(([key, val]) => (
                                <li key={key}>
                                    <Link
                                        to={key === 'news' ? '/' : `/category/${key}`}
                                        className={`inline-block py-3 px-4 text-xs font-bold uppercase tracking-widest border-b-[3px] transition-colors no-underline ${category === key
                                            ? 'border-current text-gray-800'
                                            : 'border-transparent text-gray-500 hover:text-black hover:border-gray-200'
                                            }`}
                                        style={category === key ? { borderColor: val.color, color: val.color } : {}}
                                    >
                                        {val.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="flex-grow max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-8">

                {/* Category heading */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 rounded" style={{ backgroundColor: catInfo.color }} />
                    <h1 className="text-3xl font-black font-serif uppercase tracking-tight">{catInfo.label}</h1>
                    <div className="flex-grow h-px bg-gray-200 ml-2" />
                </div>

                {/* ── LOADING SKELETON ─────────────────────────────────── */}
                {loading && (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                            <div className="lg:col-span-6 space-y-4">
                                <Skeleton className="w-full aspect-video" />
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                            <div className="lg:col-span-6 space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-3 py-3 border-b border-gray-100">
                                        <Skeleton className="w-20 h-14 shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-4/5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="w-full aspect-[16/10]" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ERROR ────────────────────────────────────────────── */}
                {!loading && error && (
                    <div className="bg-red-50 text-red-600 p-8 text-center rounded-xl border border-red-100">
                        <p className="font-bold text-lg mb-2">Failed to load articles</p>
                        <p className="text-sm mb-4">{error}</p>
                        <button onClick={() => fetchCategory(page)} className="px-6 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-bold">
                            Try Again
                        </button>
                    </div>
                )}

                {/* ── EMPTY STATE ───────────────────────────────────────── */}
                {!loading && !error && articles.length === 0 && (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-6xl mb-4">{catInfo.emoji}</p>
                        <p className="text-xl font-serif font-bold mb-2">No articles yet</p>
                        <p className="text-sm mb-6">New articles are fetched every 5 minutes.</p>
                        <Link to="/" className="inline-block px-6 py-2.5 bg-gray-900 text-white text-sm rounded-lg font-bold hover:bg-gray-700 no-underline">
                            Read all news
                        </Link>
                    </div>
                )}

                {/* ── ARTICLES ─────────────────────────────────────────── */}
                {!loading && !error && articles.length > 0 && (
                    <>
                        {/* Hero layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 pb-10 border-b border-gray-200">
                            {/* Primary hero */}
                            <div className="lg:col-span-6 lg:border-r border-gray-200 lg:pr-8">
                                {heroArticle && <NewsCard article={heroArticle} variant="hero" />}
                            </div>

                            {/* Secondary hero + list */}
                            <div className="lg:col-span-6 lg:pl-4">
                                {secondHero && (
                                    <div className="mb-5 pb-5 border-b border-gray-200">
                                        <NewsCard article={secondHero} variant="hero" />
                                    </div>
                                )}
                                <div>
                                    {listStories.map(a => (
                                        <NewsCard key={a.id} article={a} variant="list" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Remaining grid */}
                        {gridArticles.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                                {gridArticles.map(a => (
                                    <NewsCard key={a.id} article={a} variant="default" />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => { window.scrollTo(0, 0); fetchCategory(page - 1); }}
                                    className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors"
                                >
                                    ← Prev
                                </button>
                                <span className="text-sm text-gray-500 font-sans">Page {page} / {totalPages}</span>
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => { window.scrollTo(0, 0); fetchCategory(page + 1); }}
                                    className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="bg-gray-900 text-white py-12 mt-12 flex flex-col items-center gap-4">
                <img src="/logo.png" alt="iVoice Logo" className="h-8 w-auto filter brightness-0 invert opacity-80" />
                <p className="font-sans text-xs text-gray-500 text-center">
                    &copy; {new Date().getFullYear()} ivoice.lk. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default CategoryPage;
