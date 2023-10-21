const {generateToken} = require('./tokenGen')
const { performance } = require('perf_hooks');
const axios = require('axios');

let cachedToken = {
    value: null,
    generatedTime: null
};

async function getCachedToken() {
    const currentTime = new Date();
    
    if (cachedToken.value === null || (currentTime - cachedToken.generatedTime > 3500 * 1000)) {
        cachedToken.value = await generateToken();
        cachedToken.generatedTime = currentTime;
    }
    
    return cachedToken.value;
}

const instance = axios.create({
    baseURL: 'https://helloaiffs-zkz2omyuxq-uc.a.run.app',
    headers: {
        'Host': 'helloaiffs-zkz2omyuxq-uc.a.run.app',
        'User-Agent': 'HelloAI/63 CFNetwork/1408.0.4 Darwin/22.5.0',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
        'Content-Type': 'application/json'
    }
});

const data = {
    'model': 'gpt-4',
    'messages': [
        {
            'content': 'You are a helpful assistant.',
            'role': 'system'
        },
        {
            'content': 'gg',
            'role': 'user'
        }
    ],
    'simplified': false
};

async function getStreamChat(req, res) {
    const startTime = performance.now();
    const accessToken = await getCachedToken();

    instance({
        method: 'post',
        url: '/openai/stream-chat',
        data,
        headers: { 'Authorization': `Bearer ${accessToken}`},
        responseType: 'stream'
    })
    .then(function (response) {
        res.setHeader('Content-Type', 'text/event-stream'); // set the correct content type
        res.setHeader('Cache-Control', 'no-cache'); // recommend not to cache this response
        res.flushHeaders(); // flush the headers to ensure they are sent 

        response.data.on('data', function(chunk) {

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
                ]
            };
            //console.log(JSON.stringify(transformedData));

            res.write(JSON.stringify(transformedData));
        })
        response.data.on('end', () => {
            const endTime = performance.now();
            console.log(`Received and processed stream in ${endTime - startTime} milliseconds`);
    
            res.end();
        });
    })
    .catch(function (error) {
        console.log('An error occurred while sending the request:', error);
    });
}

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

async function getHelloChat(req, res) {
    req.body.stream ? getStreamChat(req, res) : getChat(req, res)
}




module.exports = {getHelloChat}

