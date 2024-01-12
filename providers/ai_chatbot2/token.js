const axios = require('axios');
const axiosRetry = require('axios-retry');
const uuid = require('uuid');

const DEVICE_TOKEN = `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`
const instance = axios.create({
  baseURL: 'https://firebaseappcheck.googleapis.com/v1/projects/xh-ios-chatgpt/apps',
  headers: {
    'Host': 'firebaseappcheck.googleapis.com',
    'User-Agent': 'ChatGPT/162 CFNetwork/1485 Darwin/23.1.0',
    'X-Ios-Bundle-Identifier': 'evolly.app.chatgpt',
    'Connection': 'keep-alive',
    'Accept': '*/*',
    'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
    'X-Goog-Api-Key': 'AIzaSyCh_DVf_C_Oqi5IiK0f6ow8nWAi_gjsP-Q',
    'Content-Type': 'application/json'
  }
});

axiosRetry(instance, { retries: 3 });

const cache = {
  token: null,
  expiresAt: null
};

const generateToken = async () => {
  const requestData = {
    device_token: DEVICE_TOKEN,
  };

  try {
    const response = await instance.post('/1:272076239371:ios:1a394866e629613cb10d0e:exchangeDeviceCheckToken', requestData);
    const { token, ttl } = response.data;

    // Convert TTL from string "1800s" to milliseconds and set expiration time
    const ttlMilliseconds = parseInt(ttl.slice(0, -1), 10) * 1000;
    const expiresAt = new Date().getTime() + ttlMilliseconds;

    // Cache the token and set the expiry
    cache.token = token;
    cache.expiresAt = expiresAt;

    console.log('token generated');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

const generateCacheToken = async () => {
  const now = new Date().getTime();
  if (cache.token && cache.expiresAt > now) {
    // Token is still valid, return cached token
    return {
      token: cache.token,
      ttl: `${(cache.expiresAt - now) / 1000}s` // Convert back to seconds with "s"
    };
  }
  // Token is expired or not set, generate a new one
  return await generateToken();
}



module.exports = {generateCacheToken}