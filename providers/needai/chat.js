const axios = require('axios');
const axiosRetry = require('axios-retry'); // Install with npm install axios-retry]
const uuid = require('uuid');

const instance = axios.create({
    baseURL: 'https://us-central1-need-ai-app.cloudfunctions.net',
    headers: {
        'Host': 'us-central1-need-ai-app.cloudfunctions.net',
        'Accept': '*/*',
        'User-Agent': 'Need%20AI/0 CFNetwork/1485 Darwin/23.1.0',
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
    }
});

axiosRetry(instance, { retries: 3 });  //Set the number of retries to 3

async function getStreamChat(req, res) {
    instance({
        method: 'post',
        url: '/openAIProxy',
        data: req.body,
        responseType: 'stream'
    })
    .then(function (response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
    
        // Pipe the response stream into the res stream
        response.data.pipe(res)
        .on('error', (err) => {
              console.error('Error:', err);
              res.status(500).send(err);
        })
        .on('end', () => {
            console.log('end')
            res.write(`[DONE]`);
            res.end();
        });
    })
    .catch((error) => {
        console.error(error);
    });
}

async function getStreamChatNeedAI(req, res) {
    getStreamChat(req, res);
}

module.exports = { getStreamChatNeedAI };
