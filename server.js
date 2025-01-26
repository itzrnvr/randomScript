const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const cors = require("cors");
const bodyParser = require("body-parser");
const { getHelloChat } = require("./providers/helloai/chat");
const { getStreamChatOpenX } = require("./providers/openx/chat");
const { getStreamChatVulcan } = require("./providers/vulcanlabs/chat");
const { getStreamChatAiChat2 } = require("./providers/ai_chatbot2/chat");
const { getStreamChatAiAssist } = require("./providers/assist/chat");
const {
    getStreamChatChatz,
    getStreamChatSpeakMate,
} = require("./providers/speakmate/chat");
const { getStreamChatSumit } = require("./providers/sumit/chat");
const { getStreamChatNeedAI } = require("./providers/needai/chat");
const { authenticateToken } = require("./middleWare/authTokenMiddleWare");
const { getChatBeta } = require("./providers/nova/soChat");
const { getChat4 } = require("./providers/nova/chat");

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const MAX_LOG_ENTRIES = 1000; // Adjust the limit as needed
let logs = []; // Array to store logs

// CORS middleware
app.use(cors());

app.use((req, res, next) => {
    const clientIp =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    const userAgent = req.headers["user-agent"];
    const logEntry = `[${new Date().toISOString()}] Request from IP: ${clientIp}, User-Agent: ${userAgent}`;

    console.log(logEntry);

    // Store the log entry in the logs array
    logs.push(logEntry);

    // Ensure the logs array does not exceed the maximum number of entries
    if (logs.length > MAX_LOG_ENTRIES) {
        logs.shift(); // Remove the oldest log entry
    }

    // Emit the log entry to all connected clients
    io.emit("log", logEntry);

    next();
});
// BodyParser middleware
app.use("/api", authenticateToken);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// Serve static files (like CSS, JS if needed)
app.use(express.static(__dirname + "/public"));

// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// On request to /health
app.get("/health", (req, res) => {
    console.log("Received request on /health");
    // Send response
    res.sendStatus(200);
});

app.post("/api/v1/chat/completions", authenticateToken, (req, res) => {
    getChat4(req, res);
});

app.post("/api/v2/chat/completions", (req, res) => {
    getChatBeta(req, res);
});

app.post("/api/v3/chat/completions", (req, res) => {
    getStreamChatOpenX(req, res);
});

app.post("/api/v4/chat/completions", (req, res) => {
    getStreamChatVulcan(req, res);
});

app.post("/api/v5/chat/completions", (req, res) => {
    getStreamChatAiChat2(req, res);
});

app.post("/api/v6/chat/completions", (req, res) => {
    getStreamChatAiAssist(req, res);
});

app.post("/api/v7/chat/completions", (req, res) => {
    getStreamChatSumit(req, res);
});

app.post("/api/v8/chat/completions", (req, res) => {
    getStreamChatSpeakMate(req, res);
});

// Setup Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("a user connected");

    // Send existing logs to the newly connected client
    logs.forEach((log) => socket.emit("log", log));

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    console.log(`http://localhost:${3000}/api/v2/chat/completions`);
});
