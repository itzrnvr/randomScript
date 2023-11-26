const axios = require('axios');
const axiosRetry = require('axios-retry'); // Install with npm install axios-retry]
const uuid = require('uuid');

function generateDeviceId() {
    return uuid.v4(); // generate a version 4 UUID (random)
}

const instance = axios.create({
    baseURL: 'https://api-ios.assistai.guru',
    headers: {
        'Host': 'api-ios.assistai.guru',
        'Connection': 'keep-alive',
        'Accept': 'keep-alive',
        'User-Agent': 'Assist/2 CFNetwork/1485 Darwin/23.1.0',
        'Content-Type': 'application/json',
        'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
        //'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsaW1pdGVkLnVuaXZlcnNlYXBwcy5Bc3Npc3QjZTg5YmZiYjAtZWUwMC00MzU4LWIzMGEtODg2ZDVlNWVkOGRiIiwiYXBwIjoibGltaXRlZC51bml2ZXJzZWFwcHMuQXNzaXN0IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTEtMjZUMTM6MjI6MDAuMjU4WiIsImlhdCI6MTcwMTAwNDkyMCwiZXhwIjoxNzAxMDA1ODIwfQ.pSXWBPmUv5jqtZFm0T3bkK_oXZRAP_L85_7iavr2x5U`
    }
});

axiosRetry(instance, { retries: 3 });  //Set the number of retries to 3

// Regular Chat function.
async function getChat(req, res) {
    console.log(req.body)
    instance({
        method: 'post',
        url: '/json/v1/chat/completions',
        data: req.body,
    })
    .then(function (response) {
        res.send(response.data)
    })
    .catch((error) => {
        console.error(error);
    });
}

async function getStreamChat(req, res) {

    console.log(req.body)
    instance({
        method: 'post',
        url: '/stream/v1/chat/completions',
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

async function getStreamChatAiAssist(req, res) {
    req.body.stream ? getStreamChat(req, res) : getChat(req, res);
}

module.exports = { getStreamChatAiAssist };
