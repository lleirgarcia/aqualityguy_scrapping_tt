const OpenAI = require('openai').default; // Si OpenAI exporta por defecto, usa .default
require('dotenv').config(); // Así se carga dotenv en CommonJS
const fs = require('fs').promises;  // Importando fs con promesas
const { exec } = require('child_process');
const path = require('path');  // Importando el módulo path

let allText = "";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getFeelingAnalisy(json) {
    await executeOpenAi(`Given the following data that contains a video description and main coments and replies to those comments: ${JSON.stringify(json)}, create an analisy of feelings. Dame el resultado en español.`);
}

async function getTrendsAndKeyWords(json) {
    await executeOpenAi(`Given the following data that contains a video description and main coments and replies to those comments: ${JSON.stringify(json)}, give me the key words and similar keywords found. Dame el resultado en español.`)
}

async function getAndSaveSummaryComment(json) {
    await executeOpenAi(`Given the following data that contains a video description and main coments and replies to those comments: ${JSON.stringify(json)}, provide me a summary of what the comments and replies are saying. Dame el resultado en español.`)
}

async function executeOpenAi(prompt) {
    console.log("Prompt: ")
    console.log(prompt)
    try {
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [{ role: 'system', content: prompt }]
        });
        // console.log("Generated text:", response.choices[0].message.content);
        allText+=response.choices[0].message.content + "\n"; 
      } catch (error) {
        console.error("Error during API call:", error);
      }
}

function saveTextToFile(text, filename) {
    fs.writeFile(filename, text, (err) => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
        } else {
            console.log(`El archivo ${filename} ha sido guardado con éxito.`);
        }
    });
}

async function main() {
    const directoryPath = './output';  // Directorio que contiene los JSON

    try {
        const files = await fs.readdir(directoryPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        let jsonCount = 0;

        for (const file of jsonFiles) {
            const data = await fs.readFile(path.join(directoryPath, file), 'utf8');
            const json = JSON.parse(data);

            let f = file.replace(/\.json$/, "");
            const match = f.match(/\d+/); 

            
            console.log("Processing file:", file);
            console.log(match[0])
            await getFeelingAnalisy(json);
            saveTextToFile(allText, `./outputdocs/feelingAnalisy${match[0]}.txt`);
            allText="";
            console.log("----------------")
            await getAndSaveSummaryComment(json);
            saveTextToFile(allText, `./outputdocs/summaryComment${match[0]}.txt`);
            allText="";
            console.log("----------------")
            await getTrendsAndKeyWords(json);
            saveTextToFile(allText, `./outputdocs/trendsKeywords${match[0]}.txt`);
            allText="";
            
            jsonCount++;
            console.log(jsonCount)
            
            allText = "";
           
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }

}

async function askChatGPT(prompt) {
    console.log("Prompt: " + prompt)
    try {
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [{ role: 'system', content: prompt }]
        });
        let r = response.choices[0].message.content;
        console.log("Generated text:", response.choices[0].message.content);
        return r;
      } catch (error) {
        console.error("Error during API call:", error);
      }
}

module.exports = {
    askChatGPT
}

main();

