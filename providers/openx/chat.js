const axios = require('axios');
const axiosRetry = require('axios-retry'); // Install with npm install axios-retry]
const uuid = require('uuid');
const { getChat } = require('../helloai/chat');

function generateDeviceId() {
    return uuid.v4(); // generate a version 4 UUID (random)
}

const instance = axios.create({
    baseURL: 'https://openx-internal.azone.app/api',
    headers: {
        'Host': 'openx-internal.azone.app',
        'Accept': 'text/event-stream',
        'User-Agent': 'OpenX/11 CFNetwork/1408.0.4 Darwin/22.5.0',
        'Content-Type': 'application/json',
        'Authorization': 'openx-9845hhgjkhgJKLDJGopodgji',
        'Device-ID': generateDeviceId(),
        'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
        'Plan': 'free'
    }
});

axiosRetry(instance, { retries: 3 });  //Set the number of retries to 3

async function getStreamChat(req, res) {
    instance({
        method: 'post',
        url: '/chat/completions',
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

async function getStreamChatOpenX(req, res) {
    req.body.stream ? getStreamChat(req, res) : getChat(req, res);
}

module.exports = { getStreamChatOpenX };
