const axios = require('axios');
const { json } = require('express');
const { Logger } = require('../../utils/logUtils.js');
const { getNewUserBeta } = require('./soProfileGen.js');
const getNewUser = require('./profileGen.js').getNewUser

async function getChatBeta(req, res) {
    const messages = req.body.messages
    const userID = await getNewUserBeta()

    let jsonData = {
        messages: messages,
        modelMap: [
          {
            key: 0,
            value: "mpwyUrxHu4Xa47BP5lPEgwk/NcaFFlnhBk3SA745INc="
          },
          {
            key: 2,
            value: "utq91e3b3StjmuMJGullm0fDoieGv2EhMsvPdq2jc34="
          },
          {
            key: 3,
            value: "FIjaUTDhgL/r4IxrhYKBUzRLrshrJldlVgKL8EQogrY="
          },
          {
            key: 4,
            value: "nIjaUTDhgL/r4IxrhYKBUzRLrshrJldlVgKL8EQoaaa="
          },
          {
            key: 5,
            value: "nIjaUTDhbb/r4IxrhYKBUzRLrshrJldlVgKL8EQobbb="
          },
          {
            key: 6,
            value: "nIjaUTDhcc/r4IxrhYKBUzRLrshrJldlVgKL8EQoccc="
          },
          {
            key: 7,
            value: "nIjaUTDhdd/r4IxrhYKBUzRLrshrJldlVgKL8EQoddd="
          },
          {
            key: 8,
            value: "nIjaUTDhee/r4IxrhYKBUzRLrshrJldlVgKL8EQoeee="
          },
          {
            key: 9,
            value: "nIjaUTDhff/r4IxrhYKBUzRLrshrJldlVgKL8EQofff="
          },
          {
            key: 10,
            value: "nIjaUTDhgg/r4IxrhYKBUzRLrshrJldlVgKL8EQoggg="
          },
          {
            key: 11,
            value: "nIjaUTDhgg/r4IxrhYKBUzRLrshrJldlVgKL8EQohhh="
          },
          {
            key: 12,
            value: "nIjaUTDhgg/r4IxrhYKBUzRLrshrJldlVgKL8EQojjj="
          },
          {
            key: 13,
            value: "nIjaUTDhgg/r4IxrhYKBUzRLrshrJldlVgKL8EQokkk="
          },
          {
            key: 14,
            value: "nIjaUTDhgg/r4IxrhYKBUzRLrshrJldlVgKL8EQolll="
          },
          {
            key: 15,
            value: "nIjaUTDhgg/r4IxrhYKBUzRLrshrJldlVgKL8EQommm="
          },
          {
            key: 16,
            value: "nIjaUTDhgg/r4IxrhYKBUzRLrshrJldlVgKL8EQonnn="
          }
        ]
      };
      

    let data = JSON.stringify(jsonData)

   // console.log(data)

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.novaapp.ai/api/chat',
    headers: { 
        'Host': 'api.novaapp.ai',
        'Content-Type': 'application/json, application/json;charset=utf-8', 
        'X_USER_ID': userID, 
        'X_PLATFORM': 'ios', 
        'X_DEV': 'false', 
        'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8', 
        'X_MODEL': '15', 
        'X_PR': 'false', 
        'X_STREAM': 'false',
        'User-Agent': `ChatAI/81 CFNetwork/1408.0.4 Darwin/22.5.0`,
        'Connection': 'keep-alive',
        'X_STREAM': `${req.body.stream == true}`,
    },
    data : data
    };

    if(!req.body.stream){
        const response = await axios.request(config)
        //console.log(response.data)
        res.send(response.data)
        return 
    }

    config.responseType = 'stream'; // set responseType as 'stream' only if stream is specifically set to true
    
    axios.request(config)
    .then(response => {
        res.setHeader('Content-Type', 'text/event-stream'); // set the correct content type
        res.setHeader('Cache-Control', 'no-cache'); // recommend not to cache this response
        res.flushHeaders(); // flush the headers to ensure they are sent 

        let modelLogged = false;

        response.data.on('data', chunk => {
            const chunkStr = chunk.toString();
            const lines = chunkStr.split('\n');
            
            lines.forEach(line => {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonStr = line.slice(6).trim();
                        if (jsonStr !== '[DONE]') {
                            const jsonData = JSON.parse(jsonStr);
                            if (!modelLogged && jsonData.model) {
                                Logger.model(jsonData.model)
                                modelLogged = true;
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
            });
            res.write(chunk);
        })

        response.data.on('end', () => { 
            res.end();
        })
    })
    .catch(error => {
        console.log(error);
        res.end();
    })
}

module.exports = {getChatBeta}