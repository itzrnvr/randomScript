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
const { getStreamChatChatz, getStreamChatSpeakMate } = require("./providers/speakmate/chat");
const { getStreamChatSumit } = require("./providers/sumit/chat");
const { getStreamChatNeedAI } = require("./providers/needai/chat");
const { authenticateToken } = require("./middleWare/authTokenMiddleWare");


let cronJobStarted = false; // Flag to control cron job start

// CORS middleware
app.use(cors())

// Middleware to log client data for all requests
app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null; 
  const userAgent = req.headers['user-agent'];
  console.log(`[${new Date().toISOString()}] Request from IP: ${clientIp}, User-Agent: ${userAgent}`);
  next();
});

// BodyParser middleware
app.use('/api', authenticateToken);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => res.send('Hello World!'))



// On request to /health
app.get('/health', (req, res) => {
  console.log('Received request on /health')
  // Send response
  res.sendStatus(200);
})

app.post('/api/v1/chat/completions', authenticateToken,  (req, res) => {
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
  getStreamChatSumit(req, res)
})

app.post('/api/v8/chat/completions', (req, res) => {
  getStreamChatSpeakMate(req, res)
})





app.listen(8080, () => {
  console.log('Server started')
})

