import React from 'react';
import NewsCard from './NewsCard';
import HeroSlider from './HeroSlider';
import MarketWidget from './MarketWidget';
import LiveStreamPlayer from './LiveStreamPlayer';
import LiveScoreboard from './LiveScoreboard';
import ElectionResults from './ElectionResults';

// Skeleton loader
const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const SectionHeader = ({ title, sub }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="h-[3px] w-8 bg-themorning-red flex-shrink-0" />
        <h2 className="text-xl font-black font-serif uppercase tracking-tight whitespace-nowrap">{title}</h2>
        <div className="flex-grow h-px bg-gray-200" />
        {sub && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans whitespace-nowrap">{sub}</span>}
    </div>
);

const Divider = () => (
    <div className="flex items-center gap-4 my-8">
        <div className="h-[3px] w-8 bg-themorning-red" />
        <div className="flex-grow h-px bg-gray-200" />
    </div>
);

const NewsGrid = ({ articles, loading }) => {
    if (loading) {
        return (
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        <Skeleton className="w-full aspect-video" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
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
            </div>
        );
    }

    if (!articles || articles.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-32 text-gray-400 font-sans">
                <span className="text-6xl mb-4">📰</span>
                <p className="text-xl font-bold">No articles found</p>
                <p className="text-sm mt-1">Make sure the backend server is running</p>
            </div>
        );
    }

    // Slice articles into named buckets
    const sliderArticles = articles.slice(0, 7);  // 7 slides for the hero slider
    const row2 = articles.slice(7, 13); // 6 cards beside MarketWidget
    const row3Left = articles.slice(13, 18);// 5 list cards beside ElectionResults
    const featuredRow = articles.slice(18, 22);// 4 featured grid
    const moreStories = articles.slice(22);    // rest

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

            {/* ── SECTION 1: Auto-sliding hero ─────────────────────────────── */}
            <section className="mb-0">
                <HeroSlider articles={sliderArticles} />
            </section>

            <Divider />

            {/* ── SECTION 2: Market Widget + 6 cards ────────────────────── */}
            <section className="mb-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start">
                    {/* MarketWidget, Stream, Scoreboard */}
                    <div className="lg:col-span-3 lg:border-r border-gray-200 lg:pr-6 pb-6 lg:pb-0 flex flex-col gap-6">
                        <MarketWidget />
                        <LiveStreamPlayer />
                        <LiveScoreboard />
                    </div>
                    {/* 6 cards: 3-col grid */}
                    <div className="lg:col-span-9 lg:pl-6">
                        <SectionHeader title="Latest News" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {row2.map(article => (
                                <NewsCard key={article.id} article={article} variant="default" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ══ SECTION 3: Election Results + side list ════════════════════ */}
            <section className="mb-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start">
                    {/* Election Widget */}
                    <div className="lg:col-span-3 lg:border-r border-gray-200 lg:pr-6 pb-6 lg:pb-0">
                        <ElectionResults />
                    </div>
                    {/* List of articles beside it */}
                    <div className="lg:col-span-9 lg:pl-6">
                        <SectionHeader title="More Stories" sub="Sri Lanka" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-x-8">
                            {row3Left.map(article => (
                                <NewsCard key={article.id} article={article} variant="list" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* ══ SECTION 4: Featured Stories (4-col) ════════════════════════ */}
            {featuredRow.length > 0 && (
                <section className="mb-0">
                    <SectionHeader title="Featured Stories" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredRow.map(article => (
                            <NewsCard key={article.id} article={article} variant="default" />
                        ))}
                    </div>
                </section>
            )}

            {/* ══ SECTION 5: More Stories ════════════════════════════════════ */}
            {moreStories.length > 0 && (
                <>
                    <Divider />
                    <section>
                        <SectionHeader title="More Stories" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {moreStories.map(article => (
                                <NewsCard key={article.id} article={article} variant="default" />
                            ))}
                        </div>
                    </section>
                </>
            )}

        </div>
    );
};

export default NewsGrid;
