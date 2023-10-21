const axios = require('axios');
const { performance } = require('perf_hooks');

const instance = axios.create({
  baseURL: 'https://securetoken.googleapis.com/v1',
  headers: {
    'Host': 'securetoken.googleapis.com',
    'Accept': '*/*',
    'X-Ios-Bundle-Identifier': 'com.michallangmajer.HelloAI',
    'Connection': 'keep-alive',
    'X-Client-Version': 'iOS/FirebaseSDK/10.9.0/FirebaseCore-iOS',
    'User-Agent': 'FirebaseAuth.iOS/10.9.0 com.michallangmajer.HelloAI/2.0.1 MacOSX/13.4.0',
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
    'X-Firebase-GMPID': '1:1055021594465:ios:c51f039116aba6bceeb720'
  }
});

const data = {
  'grantType': 'refresh_token',
  'refreshToken': 'AMf-vByh_tzqGRoJsEJYhrM3RzKYS09FEqJ_OQR-DBoLOq4EpKMB7Z7edwdZV6PujHzfdfOgf2qUKCcYPQSR2S5gKzUTE4QhNlsvtxNVT6QyUnPVmUeIdx9DhGAicObtlF6ObBzrzRe3Eqaf7aVwD09Gq1v7Do9WX-kb7WRSjQuSw4HfN_hXIvM'
};

async function generateToken() {
    const startTime = performance.now()
    const response = await instance.post('/token?key=AIzaSyAup7_ppfo1y-ZEBOfJgoQeskjnIMCtTZw', data)

    const endTime = performance.now();
    console.log(`Generated token in ${endTime - startTime} milliseconds`);

    return response.data.access_token
}

// generateToken()

// async function sendParallelRequests(numRequests) {
//     const requests = Array(numRequests).fill(instance.post('/token?key=AIzaSyAup7_ppfo1y-ZEBOfJgoQeskjnIMCtTZw', data));
  
//     const startTime = performance.now();
  
//     const responses = await Promise.all(requests);
  
    // const endTime = performance.now();
  
    // console.log(`Sent ${numRequests} requests in ${endTime - startTime} milliseconds`);
  
//     responses.forEach((response, index) => {
//       console.log(`Response ${index + 1}:`, response.data);
//     });
//   }
  
//   sendParallelRequests(20);

module.exports = {generateToken}