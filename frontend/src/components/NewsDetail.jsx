import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, ExternalLink, Clock, Wand2, Download, CheckCircle, AlertCircle } from 'lucide-react';

const CATEGORY_LABELS = {
    news: 'News', sports: 'Sports', business: 'Business',
    politics: 'Politics', opinion: 'Opinion', entertainment: 'Entertainment', life: 'Life'
};

const CAT_COLORS = {
    sports: '#16a34a', business: '#2563eb', politics: '#7c3aed',
    opinion: '#ea580c', entertainment: '#db2777', life: '#0d9488', news: '#dc2626'
};

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Watermark removal state
    const [wmStatus, setWmStatus] = useState('idle'); // idle | loading | done | error
    const [cleanImageUrl, setCleanImageUrl] = useState(null);
    const [wmError, setWmError] = useState(null);
    const [imgHovered, setImgHovered] = useState(false);

    const removeWatermark = useCallback(async (imageUrl) => {
        if (!imageUrl || wmStatus === 'loading') return;
        setWmStatus('loading');
        setWmError(null);
        try {
            const res = await fetch('/api/watermark/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Watermark removal failed.');
            setCleanImageUrl(json.imageUrl);
            setWmStatus('done');
        } catch (err) {
            setWmError(err.message || 'Something went wrong.');
            setWmStatus('error');
        }
    }, [wmStatus]);

    const handleDownloadClean = () => {
        if (!cleanImageUrl) return;
        const a = document.createElement('a');
        a.href = cleanImageUrl;
        a.download = `clean-image-${Date.now()}.png`;
        a.click();
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/news/${encodeURIComponent(id)}`);
                if (!response.ok) throw new Error(`Article not found (status ${response.status})`);
                const json = await response.json();
                if (json.success) {
                    setArticle(json.data);
                } else {
                    throw new Error(json.message || 'Failed to load article');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    // Helper: detect if a string is an image URL
    const isImageUrl = (str) => {
        if (!str || typeof str !== 'string') return false;
        const clean = str.trim().toLowerCase();
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|avif)(\?.*)?$/.test(clean);
    };

    // Helper: detect if a string is a PDF URL
    const isPdfUrl = (str) => {
        if (!str || typeof str !== 'string') return false;
        return /^https?:\/\/.+\.pdf(\?.*)?$/i.test(str.trim());
    };

    // Helper: detect if a string is any generic URL
    const isUrl = (str) => {
        if (!str || typeof str !== 'string') return false;
        return /^https?:\/\//i.test(str.trim());
    };

    const buildContent = (contentSi) => {
        if (!contentSi) return '';

        const processText = (text) => {
            if (!text || typeof text !== 'string') return '';
            const t = text.trim();
            if (!t) return '';

            if (isImageUrl(t)) {
                // Render as a real image
                return `<figure class="my-4"><img src="${t}" alt="Article image" class="w-full rounded-lg shadow-sm max-h-[500px] object-contain bg-gray-50" loading="lazy" onerror="this.parentElement.style.display='none'" /></figure>`;
            }
            if (isPdfUrl(t)) {
                // Render as a downloadable link
                return `<p><a href="${t}" target="_blank" rel="noopener noreferrer" class="text-red-600 underline hover:text-red-800 break-all">📄 View Document</a></p>`;
            }
            if (isUrl(t)) {
                // Generic URL — render as a link but shorten display text
                return `<p><a href="${t}" target="_blank" rel="noopener noreferrer" class="text-red-600 underline hover:text-red-800 break-all">${t}</a></p>`;
            }
            return `<p>${t}</p>`;
        };

        if (Array.isArray(contentSi)) {
            return contentSi.map(item => {
                if (typeof item === 'string') return processText(item);
                if (item && typeof item === 'object') {
                    const text = item.data || item.text || item.content || '';
                    return processText(typeof text === 'string' ? text : '');
                }
                return '';
            }).filter(Boolean).join('');
        }
        return typeof contentSi === 'string' ? processText(contentSi) : '';
    };


    const formatDate = (published) => {
        try {
            const d = new Date(published);
            return !isNaN(d) ? format(d, 'MMMM d, yyyy') : '';
        } catch { return ''; }
    };

    const formatTime = (published) => {
        try {
            const d = new Date(published);
            return !isNaN(d) ? format(d, 'h:mm a') : '';
        } catch { return ''; }
    };

    // ── STICKY NAV ──────────────────────────────────────────────────────────
    const StickyNav = ({ article }) => (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <Link to="/" className="flex items-center no-underline">
                    <img src="/logo.png" alt="iVoice Logo" className="h-[28px] w-auto" />
                </Link>
                {article?.share_url ? (
                    <a
                        href={article.share_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
                    >
                        Source <ExternalLink size={12} />
                    </a>
                ) : <div className="w-16" />}
            </div>
        </nav>
    );

    // ── LOADING SKELETON ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <StickyNav />
                <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 space-y-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-4/5" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="w-full aspect-video rounded-xl" />
                    <div className="space-y-3 pt-4">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />)}
                    </div>
                </main>
            </div>
        );
    }

    // ── ERROR STATE ──────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <StickyNav />
                <div className="flex flex-1 justify-center items-center p-12 text-center">
                    <div className="max-w-sm">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-2xl font-black font-serif text-gray-900 mb-2">Article Not Found</h2>
                        <p className="text-gray-500 mb-6 text-sm">{error}</p>
                        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-sm">
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const contentHtml = buildContent(article?.contentSi);
    const catLabel = article?.categoryLabel || 'news';
    const catColor = CAT_COLORS[catLabel] || '#dc2626';
    const catName = CATEGORY_LABELS[catLabel] || 'News';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <StickyNav article={article} />

            {/* Full-width cover image with watermark removal */}
            {article.cover && (
                <div
                    className="w-full max-h-[70vh] overflow-hidden bg-gray-900 relative"
                    onMouseEnter={() => setImgHovered(true)}
                    onMouseLeave={() => setImgHovered(false)}
                >
                    {/* The image — swaps to clean version when done */}
                    <img
                        src={wmStatus === 'done' && cleanImageUrl ? cleanImageUrl : article.cover}
                        alt={article.titleSi}
                        className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                        style={{ maxHeight: '70vh' }}
                        onError={e => { e.target.parentElement.style.display = 'none'; }}
                    />

                    {/* The new overlay image added dynamically */}
                    <img src="/overlay.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10" />

                    {/* Loading overlay */}
                    {wmStatus === 'loading' && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                            <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin mb-3" />
                            <p className="text-white text-sm font-semibold">Removing watermark…</p>
                            <p className="text-white/60 text-xs mt-1">This may take a few seconds</p>
                        </div>
                    )}

                    {/* Success badge */}
                    {wmStatus === 'done' && (
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            <CheckCircle size={12} />
                            Watermark Removed
                        </div>
                    )}

                    {/* Error badge */}
                    {wmStatus === 'error' && wmError && (
                        <div className="absolute top-4 left-4 right-4 z-20 flex items-start gap-2 bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg">
                            <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                            <span>{wmError}</span>
                        </div>
                    )}

                    {/* Hover action buttons */}
                    <div className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 transition-all duration-200 ${imgHovered && wmStatus !== 'loading' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}>
                        {wmStatus !== 'done' ? (
                            <button
                                onClick={() => removeWatermark(article.cover)}
                                className="flex items-center gap-2 bg-black/70 hover:bg-themorning-red backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl transition-all duration-200 hover:scale-105"
                            >
                                <Wand2 size={13} />
                                Remove Watermark
                            </button>
                        ) : (
                            <button
                                onClick={handleDownloadClean}
                                className="flex items-center gap-2 bg-green-600/80 hover:bg-green-600 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl transition-all duration-200 hover:scale-105"
                            >
                                <Download size={13} />
                                Download Clean Image
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Article card — white card on gray bg */}
            <main className="flex-grow">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-16">
                    <div className="bg-white rounded-2xl shadow-lg px-6 sm:px-10 py-10">

                        {/* Category + Date */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span
                                className="text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                                style={{ backgroundColor: catColor }}
                            >
                                {catName}
                            </span>
                            {article.published && (
                                <div className="flex items-center gap-3 text-xs text-gray-400 font-sans">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={11} />
                                        {formatDate(article.published)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={11} />
                                        {formatTime(article.published)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Headline */}
                        <h1 className="text-3xl sm:text-4xl font-black font-serif leading-[1.15] text-gray-900 mb-6">
                            {article.titleSi}
                        </h1>

                        {/* Decorative rule */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-0.5 w-10" style={{ backgroundColor: catColor }} />
                            <div className="flex-grow h-px bg-gray-100" />
                        </div>

                        {/* Body */}
                        {contentHtml ? (
                            <div
                                className="font-serif text-gray-700 text-[1.0625rem] leading-[1.85] space-y-5
                                           [&>p]:mb-5 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:font-serif [&>h2]:mb-3 [&>h2]:mt-8
                                           [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>li]:mb-1.5
                                           [&_a]:text-red-600 [&_a]:underline [&_a:hover]:text-red-800"
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                        ) : (
                            <p className="text-gray-400 italic font-sans text-center py-12 text-sm">
                                Full article content is not available.
                            </p>
                        )}

                        {/* Source link */}
                        {article.share_url && (
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <a
                                    href={article.share_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
                                >
                                    Read on original source <ExternalLink size={13} />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Back link below card */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm font-semibold text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
                        >
                            <ArrowLeft size={14} /> Back to News
                        </button>
                    </div>
                </div>
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

export default NewsDetail;
