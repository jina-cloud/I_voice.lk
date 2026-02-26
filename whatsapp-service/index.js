const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 5002;

// WhatsApp Client State
let client;
let isReady = false;
let currentQr = '';
let currentStatus = 'initializing';
let subscribedGroups = [];

// Send state to a newly connected browser client
io.on('connection', (socket) => {
    console.log('[Socket] Client connected to UI');

    if (isReady) {
        socket.emit('status', { status: 'ready' });
        socket.emit('groups', subscribedGroups);
    } else if (currentQr) {
        socket.emit('status', { status: 'qr', qr: currentQr });
    } else {
        socket.emit('status', { status: currentStatus });
    }
});

// Helper to push status to all open browser tabs
const broadcastStatus = (statusData) => {
    currentStatus = statusData.status;
    io.emit('status', statusData);
};

// Initialize WhatsApp
const initWhatsApp = () => {
    console.log('[WhatsApp] Initializing Client...');
    broadcastStatus({ status: 'initializing' });

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', async (qr) => {
        console.log('[WhatsApp] QR Code Generated. Open http://localhost:5002 to scan.');
        try {
            currentQr = await qrcode.toDataURL(qr);
            broadcastStatus({ status: 'qr', qr: currentQr });
        } catch (err) {
            console.error('Failed to generate QR image:', err);
        }
    });

    client.on('ready', async () => {
        console.log('[WhatsApp] Mobile client is ready and authenticated!');
        isReady = true;
        currentQr = '';
        broadcastStatus({ status: 'ready' });

        await fetchAndBroadcastGroups();
    });

    client.on('authenticated', () => {
        console.log('[WhatsApp] Authentication successful.');
        broadcastStatus({ status: 'authenticated' });
    });

    client.on('auth_failure', msg => {
        console.error('[WhatsApp] Authentication failed:', msg);
        broadcastStatus({ status: 'disconnected' });
    });

    client.on('disconnected', (reason) => {
        console.log('[WhatsApp] Client disconnected:', reason);
        isReady = false;
        currentQr = '';
        subscribedGroups = [];
        broadcastStatus({ status: 'disconnected' });

        client.initialize();
    });

    client.initialize();
};

const fetchAndBroadcastGroups = async () => {
    try {
        const chats = await client.getChats();
        subscribedGroups = chats
            .filter(chat => chat.isGroup)
            .map(chat => ({ name: chat.name, id: chat.id._serialized }));

        io.emit('groups', subscribedGroups);
        console.log(`[WhatsApp] Loaded ${subscribedGroups.length} groups.`);
    } catch (error) {
        console.error('[WhatsApp] Error fetching chats:', error);
    }
};

// Primary Endpoint: Send a message
app.post('/send', async (req, res) => {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
        return res.status(400).json({ success: false, error: 'chatId and message are required' });
    }

    if (!isReady || !client) {
        return res.status(503).json({ success: false, error: 'WhatsApp client is not ready yet. Please wait or scan the QR code.' });
    }

    try {
        await client.sendMessage(chatId, message);
        console.log(`[WhatsApp API] Sent message to ${chatId}`);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('[WhatsApp API] Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message', details: error.message });
    }
});

// Endpoint: Send latest news
app.post('/send-latest', async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) return res.status(400).json({ success: false, error: 'chatId is required' });
    if (!isReady || !client) return res.status(503).json({ success: false, error: 'WhatsApp client is not ready' });

    try {
        const fetchRes = await fetch('https://esena-news-api-v3.vercel.app/');
        const data = await fetchRes.json();
        const articles = data?.news_data?.data;

        if (!articles || articles.length === 0) {
            return res.status(404).json({ success: false, error: 'No news found from API' });
        }

        const article = articles[0]; // newest
        const message = `*${article.titleSi}*\n\nRead more: ${article.share_url || 'https://ivoice.lk/'}\n\n_Ivoice_`;

        await client.sendMessage(chatId, message);
        console.log(`[WhatsApp API] Sent latest news to ${chatId}`);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('[WhatsApp API] Error fetching/sending latest:', error);
        res.status(500).json({ success: false, error: 'Failed to send latest', details: error.message });
    }
});

// Endpoint: Logout / Reset session manually
app.post('/logout', async (req, res) => {
    if (client) {
        try {
            await client.logout();
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.json({ success: true });
    }
});

// Health check endpoint
app.get('/status', (req, res) => {
    res.json({
        success: true,
        isReady: isReady,
        currentStatus: currentStatus
    });
});

// Start the server (Using wrapped http server for socket.io!)
server.listen(PORT, () => {
    console.log(`WhatsApp GUI & Microservice running on http://localhost:${PORT}`);
    initWhatsApp();
});
