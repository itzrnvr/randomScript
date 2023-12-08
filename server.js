const {deleteMultipleSheetsByTitle, getLimit, getKeys, clearAndUpdateWorkingColumn, getAuth, deleteLookupSheet} = require("./gSheet")
const {testKeyStatus4} = require("./openHelper")

const cron = require('node-cron');
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser');
const { getChat } = require("./providers/nova/chat");
const { getHelloChat } = require("./providers/helloai/chat");
const { getStreamChatOpenX } = require("./providers/openx/chat");
const { getStreamChatVulcan } = require("./providers/vulcanlabs/chat");
const { getStreamChatAiChat2 } = require("./providers/ai_chatbot2/chat");
const { getStreamChatAiAssist } = require("./providers/assist/chat");
const { getStreamChatChatz } = require("./providers/chatzi/chat");


let cronJobStarted = false; // Flag to control cron job start

// CORS middleware
app.use(cors())

// BodyParser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => res.send('Hello World!'))

// On request to /health
app.get('/health', (req, res) => {
  console.log('Received request on /health')
  
  // Check if cron job has started
  if (!cronJobStarted) {
    cron.schedule('*/15 * * * * *', () => {
      console.log('running every 15 secs');
      main();
    });
    console.log('Cron job scheduled');
    cronJobStarted = true;
  }

  // Send response
  res.sendStatus(200);
})

app.post('/api/v1/chat/completions', (req, res) => {
  getChat(req, res)
})

app.post('/api/v2/chat/completions', (req, res) => {
  getHelloChat(req, res)
})

app.post('/api/v3/chat/completions', (req, res) => {
  getStreamChatOpenX(req, res)
})

app.post('/api/v4/chat/completions', (req, res) => {
  getStreamChatVulcan(req, res)
})

app.post('/api/v5/chat/completions', (req, res) => {
  getStreamChatAiChat2(req, res)
})

app.post('/api/v6/chat/completions', (req, res) => {
  getStreamChatAiAssist(req, res)
})


app.post('/api/v7/chat/completions', (req, res) => {
  getStreamChatChatz(req, res)
})



app.listen(8000, () => {
  console.log('Server started')
})



async function main(){

    const keys = await getKeys();

    const testPromises = keys.map(async (key) => {
        try {
            await testKeyStatus4(key);
            return { key, status: 'working' };
        } catch (error) {
            console.error(error);
            return { key, status: 'notWorking' };
        }
    });

    const results = await Promise.all(testPromises);

    const working = results.filter(result => result.status === 'working').map(result => result.key);
    const notWorking = results.filter(result => result.status === 'notWorking').map(result => result.key);

    console.log("working", working);
    console.log("working", working.length);
    console.log("notWorking", notWorking);

    clearAndUpdateWorkingColumn(await getAuth(), working)
}


async function testLimits() {
    const data = await getLimit(123456789)
    console.log(data.rowNumber);
}


// async function parallelCalls() {
//     let promises = [];
  
//     for (let i = 0; i < 10; i++) {
//       promises.push(testLimits()); // push the promise returned by testLimits into the array
//     }
  
//     try {
//       await Promise.all(promises); // wait for all promises to resolve
//       console.log('All parallel calls completed successfully');
//     } catch (error) {
//       console.error('Error occurred in one of the parallel calls', error);
//     }
//     console.timeEnd('parallelCalls');
//   }
//   console.time('parallelCalls');
//   parallelCalls();

//   setInterval(async () => {
//     console.time('deleteMultipleSheetsByTitle')
//     deleteMultipleSheetsByTitle()
//     .then(() => {
//         console.timeEnd('deleteMultipleSheetsByTitle')
//     })
//       .catch(err => console.error(err));
//   }, 5000); // time in milliseconds