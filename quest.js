const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const OpenAiService = require('./openAiService');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  "¿Cual es el objetivo del documento que quieres crear?",
  "Especifica si debe de ser extenso o resumido (extenso/resumido).",
  "¿El documento se creará dividido por puntos? (si/no).",
  "Especifica una estructura que desearías para dicho documento.",
  "Titulo del documento"
];

const answers = [];

const askQuestions = (questions, index = 0) => {
  return new Promise((resolve) => {
    const askQuestion = (index) => {
      if (index < questions.length) {
        rl.question(questions[index] + '\n', (answer) => {
          answers.push({
            question: questions[index],
            answer: answer
          });
          askQuestion(index + 1);
        });
      } else {
        rl.close();
        resolve(answers);
      }
    };
    askQuestion(index);
  });
};

const saveTextToFile = async (text, dirPath, filename) => {
  let root = "./outputdocs/";
  let fullPath = path.join(root, dirPath);

  try {
    // Comprobar si la carpeta existe
    await fs.mkdir(fullPath, { recursive: true });

    let filePath = path.join(fullPath, filename);
    await fs.writeFile(filePath, text);
    console.log(`El archivo ${filename} ha sido guardado con éxito en ${fullPath}.`);
  } catch (err) {
    console.error('Error al crear la carpeta o escribir el archivo:', err);
  }
};

async function createDocumentByAnswers(answers) {
  const directoryPath = './output'; // Directorio que contiene los JSON

  try {
    const files = await fs.readdir(directoryPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
        const data = await fs.readFile(path.join(directoryPath, file), 'utf8');
        const json = JSON.parse(data);

        let promptToGPT = `Utiliza como base las siguientes preguntas y respuestas, luego lee el documento JSON que te adjunto y crea el documento según el objetivo del documento:\n`;
        for (const response of answers) {
            promptToGPT += `${response.question} ${response.answer}\n`;
        }
        promptToGPT =  `${JSON.stringify(json)}`;

        let a = new OpenAiService();
        const allText = await a.askChatGPT(promptToGPT);

        let f = file.replace(/\.json$/, "");
        const match = f.match(/\d+/); 

        saveTextToFile(allText, match[0], `summary.txt`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function main() {
  await askQuestions(questions);
  console.log("Respuestas recopiladas:");
  console.log(answers);
  await createDocumentByAnswers(answers);
}

main();
