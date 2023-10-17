const {getKeys, clearAndUpdateWorkingColumn, getAuth} = require("./gSheet")
const {testKeyStatus4} = require("./openHelper")



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

main();