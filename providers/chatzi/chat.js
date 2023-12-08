const axios = require('axios');
const axiosRetry = require('axios-retry'); // Install with npm install axios-retry]
const uuid = require('uuid');

const instance = axios.create({
    baseURL: 'http://69.164.203.200:3000/v1',
    headers: {
        'Host': '69.164.203.200:3000',
        'Accept': 'text/event-stream',
        'User-Agent': 'Chatzi/68 CFNetwork/1485 Darwin/23.1.0',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer',
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

async function getStreamChatChatz(req, res) {
    getStreamChat(req, res);
}

module.exports = { getStreamChatChatz };
