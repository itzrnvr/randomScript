const {getKeys, clearAndUpdateWorkingColumn, getAuth} = require("./gSheet")
const {testKeyStatus4} = require("./openHelper")

const cron = require('node-cron');

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/health', (req, res) => res.sendStatus(200))


app.listen(3000, () => {
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


cron.schedule('*/15 * * * * *', () => {
  console.log('running every 15 secs');
  main();
});
