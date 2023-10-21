const axios = require('axios');
const { performance } = require('perf_hooks');

async function getAiChat(req, res){
    const axios = require('axios');
    delete req.body.stream
    let data = JSON.stringify({
      ...req.body,
      "max_tokens": 8000
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://chtgpt.mkapps.app/chatgpt/',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept-Language': 'en-IN;q=1.0'
      },
      data : data
    };

    
    
    axios.request(config)
    .then((response) => {
      res.setHeader('Content-Type', 'text/event-stream'); // set the correct content type
      res.setHeader('Cache-Control', 'no-cache'); // recommend not to cache this response
      res.flushHeaders(); // flush the headers to ensure they are sent 

      response.data.on('data', chunk => {
          res.write(chunk);
      })

      response.data.on('end', () => { 
          res.end();
      })
    })
    .catch((error) => {
      console.log(error);
    });
    
}



const getPerformance = async ()=>{
  const t0 = performance.now();

  const requests = Array(20).fill(getAiChat());

  await Promise.all(requests)
    .then(responses => {
      responses.forEach((response, i) => {
        console.log(`Response ${i + 1}: ${JSON.stringify(response)}`);
      });
    })
    .catch(error => {
      console.log(error.message);
    });

  const t1 = performance.now();
  console.log(`Performance: ${t1 - t0} milliseconds.`);
}


//Execute the performance check
getPerformance();

module.exports = {getAiChat}