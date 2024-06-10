const fs = require('fs');
const path = require('path');
const o = require('./openAiService.js');
const OpenAiService = require('./openAiService.js');

// Función para leer el contenido de un archivo de manera asíncrona
function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

// Función para encontrar el archivo con el número incrementado en su nombre
async function findAndReadFeelingAnalysisFiles(directoryPath) {
    try {
        const filesContents = [];
        const items = fs.readdirSync(directoryPath, { withFileTypes: true });
        let fileNumber = 1;
        for (const item of items) {
            console.log(item)
            if (item.isDirectory()) {
                
                const fileName = `feelingAnalisy${fileNumber}.txt`;
                const filePath = path.join(directoryPath, item.name, fileName);

                if (fs.existsSync(filePath)) {
                    const content = await readFileAsync(filePath);
                    filesContents.push(content);
                    fileNumber++; // Incrementa para buscar el próximo archivo
                } 
                
            }
        }
        const openAiService = new OpenAiService();

        console.log(filesContents);
        await openAiService.askChatGPT(filesContents)
    } catch (error) {
        console.error('Error reading files:', error);
        return [];
    }
}

// Ruta del directorio principal donde buscar
const mainDirectory = './organized';

// Ejecutar la función y mostrar los resultados
findAndReadFeelingAnalysisFiles(mainDirectory).then(contents => {
    // console.log('Contenidos de los archivos:', contents);
}).catch(error => {
    console.error('Error processing the directory:', error);
});
