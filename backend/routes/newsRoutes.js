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
        const matches = (data.data || []).slice(0, 6).map(m => ({
            id: m.id,
            name: m.name,
            status: m.status,
            venue: m.venue,
            teams: m.teams || [],
            score: m.score || [],
            matchType: m.matchType,
            dateTimeGMT: m.dateTimeGMT,
        }));
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

