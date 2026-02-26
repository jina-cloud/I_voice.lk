const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('ready', async () => {
    console.log("Ready! Sending test...");
    
    // Test to yourself first instead of the group, to see if the library itself is working
    // Your own number receives messages sent to your own ID.
    try {
        const myChats = await client.getChats();
        const me = myChats.find(c => c.isGroup === false); // Find a personal chat
        
        if (me) {
            console.log(`Sending personal test to ${me.name}...`);
            await client.sendMessage(me.id._serialized, '🔔 Personal test from bot');
            console.log("Sent personal test");
        }
        
        console.log("Attempting group test...");
        await client.sendMessage('120363424938223270@g.us', '🔔 Group test from bot');
        console.log("Sent group test");
        
    } catch (e) {
        console.error("Error:", e.message);
    }
    process.exit(0);
});

client.initialize();
