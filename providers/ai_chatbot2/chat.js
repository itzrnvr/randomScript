const axios = require('axios');
const axiosRetry = require('axios-retry');
const { generateCacheToken } = require('./token');

const chatServiceInstance = axios.create({
  baseURL: 'https://chatwithios-4pquu3xxza-uc.a.run.app',
  headers: {
    'Host': 'chatwithios-4pquu3xxza-uc.a.run.app',
    'Accept': '*/*', // Changed 'keep-alive' to '*/*'
    'User-Agent': 'ChatGPT/1.6.2 (evolly.app.chatgpt; build:162; iOS 17.1.0) Alamofire/5.6.4',
    'Content-Type': 'application/json',
    'Accept-Language': 'en-IN;q=1.0',
    'Connection': 'keep-alive'
  }
});

axiosRetry(chatServiceInstance, { retries: 3 }); // Set the number of retries to 3

async function getStreamChat(req, res) {
  console.log(req.body); // Logging the request body for debugging

  try {
    const tokenData = await generateCacheToken(); // Await the token instead of .then chain
    chatServiceInstance.defaults.headers['X-Firebase-AppCheck'] = tokenData.token; // Set the token in the header

    const response = await chatServiceInstance.post('/', req.body, { responseType: 'stream' });

    // Set up headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Pipe the response stream into the res stream
    response.data.pipe(res)
      .on('error', (err) => {
        console.error('Stream Error:', err);
        res.status(500).send(err);
      })
      .on('end', () => {
        console.log('Stream End');
        res.end();
      });

  } catch (error) {
    console.error('Error in getStreamChat:', error);
    res.status(error.response?.status || 500).send(error.message);
  }
}

async function getStreamChatAiChat2(req, res) {
  getStreamChat(req, res);
}

module.exports = { getStreamChatAiChat2 };
