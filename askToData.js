const OpenAI = require('openai').default; // Si OpenAI exporta por defecto, usa .default
require('dotenv').config(); // Así se carga dotenv en CommonJS
const fs = require('fs').promises;  // Importando fs con promesas
const { exec } = require('child_process');
const path = require('path');  // Importando el módulo path

/**
 * AskData hace las preguntas a los archivos JSON o a los DOCUMENTOS que se generan con IA.
 *  - Analisis de feeling.
 *  - Analisis de keywords, 
 * 
 * Pre requisitos:
 *  - JSONs generados.
 * 
 * Forma de desarrollar los scripts:
 *  - En cada pregunta (metodo) se:
 *      - si es una pregunta dirigida a un archivo JSON o Texto.
 *      - si quiero saber algo "en general" o algo "en conreto"
 *  
 */


async function prepareDocuments(document, prompt) {

}

async function doQuestion(document, prompt) {

}


async function whatIsTheGeneralOpinionOfPeopleAboutTheContent() {

}

async function doYouThinkPeopleLikesTheVideo() {
    
}

async function whatKindOfContentGeneratesMoreEngagement() {

}

async function whatIsTheGeneralFeelingOfPeopleAboutVideos() {

}

async function whatIsTheGeneralFeelingOfPeopleAboutVideo(videoUrl) {

}

async function whatKeywordsAreMoreCommonForEveryVideo() {

}

async function whatKeywordsAreMoreCommonInAllVideos() {
    
}

async function whatTypesOfVideosMakesMoreComments() {
    
}


// NO ia
async function getTheMostRepliedCommentOfAVideo() {

}

async function getThMostLickedCommentOfAVideo() {

}