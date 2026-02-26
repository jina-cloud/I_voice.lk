const axios = require('axios');
require('dotenv').config();

const testWhatsAppDir = async () => {
    try {
        const communityId = process.env.WHATSAPP_COMMUNITY_ID;
        if (!communityId) {
            console.log('Error: WHATSAPP_COMMUNITY_ID not found in .env');
            return;
        }

        console.log(`Sending test message to ${communityId} via Microservice...`);

        const response = await axios.post('http://localhost:5002/send', {
            chatId: communityId,
            message: "🔔 *TEST NOTIFICATION*\n\nThis is a test message to verify the WhatsApp integration is working correctly.\n\n_Ivoice_"
        });

        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};

testWhatsAppDir();
