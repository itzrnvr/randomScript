const {deleteMultipleSheetsByTitle, getLimit, getKeys, clearAndUpdateWorkingColumn, getAuth, deleteLookupSheet} = require("./gSheet")
const {testKeyStatus4} = require("../openHelper")

const cron = require('node-cron');
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser');
const { getChat } = require("../providers/nova/chat");
const { getHelloChat } = require("../providers/helloai/chat");
const { getStreamChatOpenX } = require("../providers/openx/chat");
const { getStreamChatVulcan } = require("../providers/vulcanlabs/chat");

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

main()