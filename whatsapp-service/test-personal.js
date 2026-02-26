const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('ready', async () => {
    console.log("Ready! Fetching personal chats...");
    
    try {
        const chats = await client.getChats();
        
        // Find the first non-group chat (usually a direct message or yourself)
        const personalChat = chats.find(c => !c.isGroup);
        
        if (personalChat) {
            console.log(`Sending personal test to: ${personalChat.name} (${personalChat.id._serialized})`);
            await client.sendMessage(personalChat.id._serialized, '🔔 Personal test from bot. If you see this, the bot works but Group IDs are failing.');
            console.log("Sent personal test successfully.");
        } else {
            console.log("No personal chats found to test with.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
    process.exit(0);
});

client.initialize();
