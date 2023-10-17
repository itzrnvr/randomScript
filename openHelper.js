const OpenAI = require('openai');


async function getModel(key) {
     const openai = new OpenAI({
          apiKey: key // This is also the default, can be omitted
     });
     
     const model = await openai.models.retrieve("gpt-4");

     console.log(model);
}

async function testKeyStatus4(key){
     const openai = new OpenAI({
          apiKey: key // This is also the default, can be omitted
     });

     const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: "You are a helpful assistant." }],
          model: "gpt-4",
        });

      
     console.log(completion.choices[0]);
}

async function testKeyStatus3(key){
     const openai = new OpenAI({
          apiKey: key // This is also the default, can be omitted
     });

     const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: "You are a helpful assistant." }],
          model: "gpt-3.5-turbo",
        });

      
     console.log(completion.choices[0]);
}

module.exports = {getModel, testKeyStatus4, testKeyStatus3}

