const { dir } = require("console");
const OpenAiService = require("../openAiService");
const fs = require('fs').promises;  

const path = require('path'); 


// REVISAR METODO
// PROMPT: Decirle que saque la respuesta con un formato estandarizado que yo le provea (pensar)
async function createDocumentSummaryByVideoCommentsTalks(json) {
    let prompt = "Hola. Te voy a pasar un archivo JSON donde tengo almacenados datos de comentarios "+
        "y replicas en mis videos de TikTok, de tener tambien la descripcion del video, los likes, las views, etc." + 
        "Quisiera que entendieras el JSON, leyeras los comentarios e hicieras un resumen de lo que hablan teniendo en cuenta: " +
        "comentarios que tu creas mas relevantes, o que tengan mas replicas o likes. Al final quiero saber de que ha hablado la gente en base a este JSON."
        + ` ${JSON.stringify(json)}`;

        let a = new OpenAiService();
        return a.askChatGPT(prompt);
}

async function createDocumentFeelingAnalisyByVideoComments() {

}

async function createDocumentOfMainTopicByVideoComments() {

}

async function createDocumentOfTopSpecificKeyworsInVideoComments() {

}

async function createDocumentOfTopSimilarKeyworsInVideoComments() {

}

async function createDocumentAboutPercentageOfPeopleLickingTheVideo() {
    
}

/**
 * Document that explains if comments has engagement or not, taking in to account:
 * - feeling of comments
 * - likes
 */
async function createDocumentExplainingTheEngagementOfComments() {


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
            let allText = await createDocumentSummaryByVideoCommentsTalks(json);
            console.log(allText)
            saveTextToFile(allText, match[0], `summary.txt`);
        }
    }catch (error) {
        console.error("An error occurred:", error);
    }
}

function saveTextToFile(text, dirPath, filename) {
    dirPath = `video${dirPath}`;
    let root = "./outputdocs/";
    let fullPath = path.join(root, dirPath);

    // Comprobar si la carpeta existe
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    // Guardar el archivo en la carpeta
    let filePath = path.join(fullPath, filename);
    fs.writeFile(filePath, text, (err) => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
        } else {
            console.log(`El archivo ${filename} ha sido guardado con éxito en ${fullPath}.`);
        }
    });
}



// main();