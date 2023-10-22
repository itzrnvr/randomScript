const { generateToken } = require('./tokenGen');
const { performance } = require('perf_hooks');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const SSEChannel = require('sse-channel');
const events = require('events');
const { Transform } = require('stream');




// Cached token information.
let cachedToken = {
    value: null,
    generatedTime: null
};

// Improved token management function.
async function getCachedToken() {

    const currentTime = new Date();

    if (cachedToken.value === null || ((currentTime - cachedToken.generatedTime) > 3500 * 1000)) {
        cachedToken.value = await generateToken();
        cachedToken.generatedTime = currentTime;
    }

    return cachedToken.value;
}

// Axios Instance.
const instance = axios.create({
    baseURL: 'https://helloaiffs-zkz2omyuxq-uc.a.run.app',
    headers: {
        'Host': 'helloaiffs-zkz2omyuxq-uc.a.run.app',
        'User-Agent': 'HelloAI/63 CFNetwork/1408.0.4 Darwin/22.5.0',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
        'Content-Type': 'application/json',
        'accept-encoding': 'gzip, deflate'
    },
    timeout: 30000,
    responseType: 'stream'
});

axiosRetry(instance, { retries: 3 }); // This will retry any request that fails.

// Stream Chat function.
async function getStreamChat(req, res) {
    const startTime = performance.now();
    const accessToken = await getCachedToken();

    // Create a Transform stream
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const originalData = chunk.toString();
            const transformedData = {
                id: 'chatcmpl-8C0vUx3ssrpN6aHLDJH06phVtShPh',
                object: "chat.completion.chunk",
                created: Date.now() / 1000 | 0, // Current Unix timestamp
                model: "gpt-4",
                choices: [
                    {
                        index: 0,
                        delta: {
                            role: 'assistant',
                            content: originalData
                        },
                        finish_reason: null
                    }
                ],
            };
    
            this.push("data: " + JSON.stringify(transformedData) + "\r\n\n");
            callback();
        }
    });

    instance({
        method: 'post',
        url: '/openai/stream-chat',
        data: req.body,
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
        .then(function (response) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();
       
            // Pipe the response data into the Transform stream
            response.data.pipe(transformStream).pipe(res);

            response.data.on('error', (err) => {
                console.error('Error:', err);
                res.status(500).send(err);
            });

            response.data.on('end', () => {
                const endTime = performance.now();
                res.write(`[DONE]`);
                res.end();
            });
        })
        .catch((error) => {
            console.error('Error occurred while sending request:', error);
        });
}

// Regular Chat function.
async function getChat(req, res) {
    const accessToken = await getCachedToken();
    const headers = {
        'Host': 'helloaiffs-zkz2omyuxq-uc.a.run.app',
        'User-Agent': 'HelloAI/63 CFNetwork/1408.0.4 Darwin/22.5.0',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
      
      const data = req.body
      
      axios.post('https://helloaiffs-zkz2omyuxq-uc.a.run.app/openai/chat', data, { headers: headers })
      .then((response) => {
        console.log(response.data);
        let chatCompletion = {
            "id": "chatcmpl-8C284D9ICZJyJBEVxIT7Irx9YjpBh",
            "object": "chat.completion",
            "created": 1697878812,
            "model": "gpt-4-0613",
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": response.data.data
                    },
                    "delta": null,
                    "finish_reason": "stop",
                    "index": 0
                }
            ]
        }

        res.send(chatCompletion)
      })
      .catch((error) => {
        console.error(error);
      });
}

// Hello Chat function.
async function getHelloChat(req, res) {
    req.body.stream ? getStreamChat(req, res) : getChat(req, res);
}

module.exports = { getHelloChat };
