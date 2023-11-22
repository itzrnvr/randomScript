const axios = require('axios');
const axiosRetry = require('axios-retry');
const uuid = require('uuid');

// Initialize the cache
let tokenCache = {
  token: null,
  expiration: null,
  deviceID: null, // Will set this when generating a new token
};

const instance = axios.create({
  baseURL: 'https://chatgpt-au.vulcanlabs.co/api',
  headers: {
    'Host': 'chatgpt-au.vulcanlabs.co',
    'User-Agent': 'Chat GPT Android 3.0.1 361 Android SDK: 27 (8.1.0)',
  }
});

axiosRetry(instance, { retries: 3 });

const generateToken = async () => {
  // Generate a new device_id each time we need to generate a new token
  tokenCache.deviceID = uuid.v4();

  // Prepare the request data with the new device_id
  const requestData = {
    device_id: tokenCache.deviceID,
    order_id: "",
    product_id: "",
    purchase_token: "",
    subscription_id: ""
  };

  const response = await instance.post('/v1/token', requestData);

  // Update cache
  tokenCache.token = response.data.AccessToken;
  tokenCache.expiration = new Date(response.data.AccessTokenExpiration);

  console.log('token generated')

  return tokenCache
}

// Function to get the cached token or generate a new one if necessary
const getCachedToken = async () => {
  const now = new Date();
  if (tokenCache.accessToken && now < tokenCache.expiration) {
    // Return cached token if not expired
    return tokenCache;
  } else {
    // Generate a new token (and new device_id) if expired or not present
    return await generateToken();
  }
}

module.exports = { getCachedToken, generateToken };
