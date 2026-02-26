const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const test = async () => {
    console.log("Starting temporary test client...");
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    });
    
    client.on('ready', async () => {
        console.log("Ready! Attempting to send message to 120363424938223270@g.us...");
        try {
            await client.sendMessage('120363424938223270@g.us', '🔔 DIRECT TEST');
            console.log("Sent successfully.");
        } catch (e) {
            console.error("Failed:", e);
        }
        process.exit(0);
    });
    
    client.on('auth_failure', () => {
        console.log("Auth failed");
        process.exit(1);
    });
    
    client.initialize();
}
test();
