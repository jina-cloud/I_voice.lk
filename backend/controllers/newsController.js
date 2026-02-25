const mongoose = require('mongoose');
const News = require('../models/News');

// Helper: check DB is ready before querying
const isDBReady = () => mongoose.connection.readyState === 1;
const dbNotReady = (res) => res.status(503).json({
    success: false,
    message: 'Database connection not established yet. Please try again in a moment.'
});


// PUBLIC: Get all news (paginated, sorted by date DESC)
exports.getAllNews = async (req, res) => {
    if (!isDBReady()) return dbNotReady(res);
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const news = await News.find()
            .sort({ published: -1 })
            .skip(skip)
            .limit(limit);

        const totalNews = await News.countDocuments();

        res.status(200).json({
            success: true,
            count: news.length,
            page,
            totalPages: Math.ceil(totalNews / limit),
            totalNews,
            data: news
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// PUBLIC: Get news by category label (sports, business, politics, opinion, entertainment, life, news)
exports.getNewsByCategory = async (req, res) => {
    if (!isDBReady()) return dbNotReady(res);
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const validCategories = ['news', 'sports', 'business', 'politics', 'opinion', 'entertainment', 'life'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ success: false, message: 'Invalid category' });
        }

        // Primary: filter by stored categoryLabel
        // Also grab articles with no label (legacy) + apply basic titleEn keyword filter for them
        const news = await News.find({ categoryLabel: category })
            .sort({ published: -1 })
            .skip(skip)
            .limit(limit);

        const total = await News.countDocuments({ categoryLabel: category });

        res.status(200).json({
            success: true,
            category,
            count: news.length,
            page,
            totalPages: Math.ceil(total / limit),
            total,
            data: news
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


// PUBLIC: Get single news article by custom string id
exports.getSingleNews = async (req, res) => {
    if (!isDBReady()) return dbNotReady(res);
    try {
        const rawId = req.params.id;
        // Try string match first; fall back to numeric in case stored as Number
        let news = await News.findOne({ id: rawId });
        if (!news && !isNaN(rawId)) {
            news = await News.findOne({ id: Number(rawId) });
        }
        if (!news) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ADMIN: Add custom news
exports.addCustomNews = async (req, res) => {
    try {
        const { id, titleSi, cover, published, contentSi, share_url } = req.body;

        const news = await News.create({
            id: id || `custom-${Date.now()}`,
            titleSi,
            cover,
            published: published || new Date(),
            contentSi,
            share_url,
            isCustom: true
        });

        res.status(201).json({ success: true, data: news });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error adding news', error: error.message });
    }
};

// ADMIN: Update custom news
exports.updateCustomNews = async (req, res) => {
    try {
        let news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ success: false, message: 'News not found' });
        }

        news = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: news });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating news', error: error.message });
    }
};

// ADMIN: Delete custom news
exports.deleteCustomNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ success: false, message: 'News not found' });
        }

        await news.deleteOne();

        res.status(200).json({ success: true, message: 'News deleted successfully', data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error deleting news', error: error.message });
    }
};
