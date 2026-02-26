const cron = require('node-cron');
const axios = require('axios');
const News = require('../models/News');

// Keyword-based categorization from English title
// Maps API content to the nav sections: news, sports, business, politics, opinion, entertainment, life
const getCategoryLabel = (titleEn, numericCategory) => {
    if (!titleEn) return 'news';
    const t = titleEn.toLowerCase();

    if (/cricket|football|soccer|rugby|sport|match|team|tournament|cup|league|player|game|score|wicket|goal|athlete|olympic|race|swim|tennis|badminton|basketball|netball/.test(t)) return 'sports';
    if (/market|economy|gdp|trade|business|company|invest|stock|finance|bank|loan|revenue|export|import|tax|budget|profit|rupee|usd|dollar|economic/.test(t)) return 'business';
    if (/president|minister|parliament|election|government|political|party|vote|senator|cabinet|policy|law|court|judge|legal|mp|ruling|opposition|candidate/.test(t)) return 'politics';
    if (/opinion|editorial|column|view|analysis|comment|perspective|argue|debate|essay|letter/.test(t)) return 'opinion';
    if (/film|movie|music|actor|actress|singer|concert|award|celebrity|entertain|drama|theatre|show|tv|television|series|song|album|fashion|wedding/.test(t)) return 'entertainment';
    if (/health|food|recipe|travel|lifestyle|education|family|child|parent|home|garden|yoga|wellness|fitness|diet|weight|doctor|hospital|medical/.test(t)) return 'life';

    return 'news';
};

const fetchNews = async () => {
    try {
        console.log('[Cron] Fetching latest news from API...');

        const response = await axios.get('https://esena-news-api-v3.vercel.app/');

        if (response.data && response.data.news_data && response.data.news_data.data) {
            const articles = response.data.news_data.data;

            console.log(`[Cron] Found ${articles.length} articles. Processing...`);

            let newCount = 0;
            let updateCount = 0;

            const communityId = process.env.WHATSAPP_COMMUNITY_ID;
            const whatsappServiceURL = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:5002';

            for (const article of articles) {
                const categoryLabel = getCategoryLabel(article.titleEn, article.category);

                // Upsert to sync and avoid duplicates
                const updatedArticle = await News.findOneAndUpdate(
                    { id: String(article.id) },
                    {
                        titleSi: article.titleSi,
                        titleEn: article.titleEn || '',
                        cover: article.cover || article.thumb,
                        published: article.published ? new Date(article.published) : new Date(),
                        contentSi: article.contentSi,
                        share_url: article.share_url,
                        category: article.category,
                        categoryLabel,
                        isCustom: false
                    },
                    { upsert: true, new: false }
                );

                if (!updatedArticle) {
                    newCount++;

                    // Send WhatsApp notification for the new article
                    if (communityId) {
                        try {
                            const message = `*${article.titleSi}*\n\nRead more: ${article.share_url || 'https://ivoice.lk/'}\n\n_Ivoice_`;

                            // Send to Microservice instead of calling module directly
                            await axios.post(`${whatsappServiceURL}/send`, {
                                chatId: communityId,
                                message: message
                            });
                        } catch (err) {
                            console.error('[WhatsApp] Error communicating with microservice:', err.message);
                        }
                    }
                } else {
                    updateCount++;
                }
            }

            console.log(`[Cron] Sync completed. Inserted ${newCount} new and updated ${updateCount} existing articles.`);
        } else {
            console.log('[Cron] Unexpected API response format.');
        }
    } catch (error) {
        console.error('[Cron] Error fetching news data:', error.message);
    }
};

const initCronJob = () => {
    // Execute job every 5 minutes
    cron.schedule('*/5 * * * *', () => {
        fetchNews();
    });
    console.log('Cron job initialized: Fetching news every 5 minutes.');

    // Also run initially on setup
    fetchNews();
};

module.exports = initCronJob;
