const axios = require('axios');
const axiosRetry = require('axios-retry');
const { getCachedToken } = require('./generateToken');

// Configure the axios instance with retries
const axiosInstance = axios.create({
    headers: {
        'User-Agent': 'Chat GPT Android 3.0.1 361 Android SDK: 27 (8.1.0)',
        'Content-Type':  'application/json',
        'Connection': 'keep-alive'
    }
});
axiosRetry(axiosInstance, { retries: 3 });

async function getStreamChat(req, res) {
    try {
        const token = await getCachedToken();
        const data = {
            model: req.body.model,
            user: token.deviceID,
            messages: req.body.messages,
            nsfw_check: false,
            stream: true,
        };

        const response = await axiosInstance.post(
            'https://chatgpt.vulcanlabs.co/api/v4/chat',
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                },
            }
        );
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        const chunks = response.data.split('data:');
        let delay = 0;
        const delayIncrement = 50; // Adjust this delay as necessary for your "streaming" simulation

        chunks.forEach((chunk, index) => {
            if (chunk.trim() !== '') {
                // Schedule each SSE event to be sent with an incrementing delay
                setTimeout(() => {
                   // Ensure the 'data:' prefix is properly included, unless it's an empty chunk
                   const eventData = index > 0 ? `data: ${chunk}` : '';
                   res.write(`${eventData}\n\n`);
                }, delay);
                delay += delayIncrement;
            }
        });

        // End the simulated stream after all chunks have been scheduled
        setTimeout(() => {
            res.write('data: [DONE]\n\n');
            res.end();
        }, delay);


    } catch (error) {
        console.error('Stream request error:', error.message);
        res.status(500).send(error.message);
    }
}

async function getStreamChatVulcan(req, res) {
    if (req.body.stream) {
        return await getStreamChat(req, res);
    }
    return getChat(req, res);
}

module.exports = { getStreamChatVulcan };
