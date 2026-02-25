const express = require('express');
const axios = require('axios');
const {
    getAllNews,
    getSingleNews,
    getNewsByCategory,
    addCustomNews,
    updateCustomNews,
    deleteCustomNews
} = require('../controllers/newsController');
const { removeWatermark } = require('../controllers/watermarkController');

const router = express.Router();

// Public Routes  (note: category route MUST come before :id route)
router.get('/news', getAllNews);
router.get('/news/category/:category', getNewsByCategory);
router.get('/news/:id', getSingleNews);

// Live stream endpoint — URL is server-side only, never exposed in client code
router.get('/stream', (req, res) => {
    const streamUrl = process.env.LIVE_STREAM_URL ||
        'https://rtmp01.voaplus.com/hls/6x6ik312qk4grfxocfcv_src/index.m3u8';
    res.json({ url: streamUrl });
});

// Live cricket scores — fetches from CricAPI (add CRICAPI_KEY to Railway env vars)
router.get('/scores', async (req, res) => {
    const apiKey = process.env.CRICAPI_KEY;
    if (!apiKey) {
        return res.json({ success: true, matches: [], message: 'No CRICAPI_KEY configured' });
    }
    try {
        const { data } = await axios.get(
            `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`,
            { timeout: 6000 }
        );
        const matches = (data.data || []).slice(0, 6).map(m => {
            let parsedTeams = m.teams || [];
            // CricAPI sometimes gives 1 team if there's a comma in the name (e.g. "Hong Kong, China")
            if (parsedTeams.length !== 2) {
                const matchTitle = m.name.split(',')[0] + (m.name.split(',')[1] && m.name.split(',')[1].includes('vs') ? ',' + m.name.split(',')[1] : '');
                let titleParts = matchTitle.split(' vs ');
                if (titleParts.length !== 2) titleParts = matchTitle.split(' v ');
                if (titleParts.length === 2) {
                    parsedTeams = titleParts.map(t => t.trim().replace(/^,+|,+$/g, ''));
                }
            }
            if (parsedTeams.length < 2) {
                parsedTeams = [parsedTeams[0] || 'Team 1', 'Team 2'];
            }

            return {
                id: m.id,
                name: m.name,
                status: m.status,
                venue: m.venue,
                teams: parsedTeams.slice(0, 2),
                score: m.score || [],
                matchType: m.matchType,
                dateTimeGMT: m.dateTimeGMT,
            };
        });
        res.json({ success: true, matches });
    } catch (err) {
        res.json({ success: false, matches: [], message: err.message });
    }
});


// Admin Routes for manual news updates
router.post('/admin/news', addCustomNews);
router.put('/admin/news/:id', updateCustomNews);
router.delete('/admin/news/:id', deleteCustomNews);

// Watermark Removal (accepts JSON body: { imageUrl })
router.post('/watermark/remove', removeWatermark);

module.exports = router;

