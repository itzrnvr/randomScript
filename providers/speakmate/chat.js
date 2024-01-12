const axios = require('axios');
const axiosRetry = require('axios-retry'); // Install with npm install axios-retry]
const uuid = require('uuid');

const instance = axios.create({
    baseURL: 'https://us-central1-speakmateai-559f8.cloudfunctions.net',
    headers: {
        'Host': 'us-central1-speakmateai-559f8.cloudfunctions.net',
        'Accept': '*/*',
        'User-Agent': 'SpeakMate/2.1.0 (com.speakmate.ai.chatgpt; build:225; iOS 17.1.0) Alamofire/5.8.0',
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
    }
});

axiosRetry(instance, { retries: 3 });  //Set the number of retries to 3

async function getStreamChat(req, res) {
    instance({
        method: 'post',
        url: '/callOpenAI',
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

async function getStreamChatSpeakMate(req, res) {
    getStreamChat(req, res);
}

module.exports = { getStreamChatSpeakMate };



// const axios = require('axios');
// const axiosRetry = require('axios-retry'); // Install with npm install axios-retry]
// const uuid = require('uuid');

// const instance = axios.create({
//     baseURL: 'http://69.164.203.200:3000/v1',
//     headers: {
//         'Host': '69.164.203.200:3000',
//         'Accept': '*/*',
//         'User-Agent': 'Chatzi/68 CFNetwork/1485 Darwin/23.1.0',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer',
//         'Connection': 'keep-alive',
//         'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8'
//     }
// });

// axiosRetry(instance, { retries: 3 });  //Set the number of retries to 3

// async function getStreamChat(req, res) {
//     instance({
//         method: 'post',
//         url: '/chat/completions',
//         data: req.body,
//         responseType: 'stream'
//     })
//     .then(function (response) {
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');
//         res.flushHeaders();
    
//         // Pipe the response stream into the res stream
//         response.data.pipe(res)
//         .on('error', (err) => {
//               console.error('Error:', err);
//               res.status(500).send(err);
//         })
//         .on('end', () => {
//             console.log('end')
//             res.write(`[DONE]`);
//             res.end();
//         });
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// }

// async function getStreamChatChatz(req, res) {
//     getStreamChat(req, res);
// }

// module.exports = { getStreamChatChatz };
