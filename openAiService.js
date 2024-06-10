const OpenAI = require('openai').default;  // Si OpenAI exporta por defecto, usa .default
const fs = require('fs').promises;  // Utiliza promesas con fs para operaciones asincrónicas
const path = require('path');  // Módulo path para manejar rutas de archivos

require('dotenv').config();  // Carga las variables de entorno desde .env

class OpenAiService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async askChatGPT(prompt) {
        console.log("Prompt: " + prompt);
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [{ role: 'system', content: prompt }]
            });
            let result = response.choices[0].message.content;
            console.log("Generated text:", result);
            return result;
        } catch (error) {
            console.error("Error during API call:", error);
        }
    }
}

module.exports = OpenAiService;
