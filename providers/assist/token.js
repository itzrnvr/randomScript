const axios = require('axios');
const axiosRetry = require('axios-retry');
const uuid = require('uuid');

const DEVICE_TOKEN = `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`

const instance = axios.create({
  baseURL: 'https://auth-prod.assistai.guru/v3',
  headers: {
    'Host': 'auth-prod.assistai.guru',
    'User-Agent': 'Assist/1.1.2 (limited.universeapps.Assist; build:2; iOS 17.1.0) Alamofire/5.6.4',
    'Connection': 'keep-alive',
    'Accept': '*/*',
    'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
    'Content-Type': 'application/json'
  }
});

axiosRetry(instance, { retries: 3 });

const generateToken = async () => {

  const requestData = {
    "os": "iOS",
    "timeZone": 19800,
    "uuid": uuid.v4(),
    "IDFA": "00000000-0000-0000-0000-000000000000",
    "appsFlyerId": "1700900421533-9373850",
    "app": "assist"
  };

  const response = await instance.post('/signup', requestData);

  // Update cache

  console.log('token generated')
  console.log(response.data)
}

generateToken()