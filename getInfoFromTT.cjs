const { chromium } = require('playwright');
const HeaderPage = require('./HeaderPage');
const MongoOperations = require('./mongoOperations');
const fs = require('fs');

let totalCommentsCounter = 0;

function saveDataToJson(data, filePath) {
    // Verifica si el archivo ya existe
    if (!fs.existsSync(filePath)) {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf-8');
        console.log(`Datos guardados en ${filePath}`);
    } else {
        console.log(`El archivo ${filePath} ya existe. No se realizaron cambios.`);
    }
}

// Función para guardar datos de video
async function saveDataOfVideo(mongo, videoData) {
  
}

// Función para guardar datos de comentarios
async function getAllComments(page) {
    const commentItems = await page.$$('[class*="DivCommentItemContainer"]');
    let coments = [];
    for (const commentItem of commentItems) {
      

        const mainComment = await commentItem.$('[class*="DivCommentContentContainer"]');
        const mainCommentTextElement = await mainComment.$('[data-e2e="comment-level-1"]');
        const username = await commentItem.$('[data-e2e="comment-username-1"]');
        const likeCounter = await commentItem.$('[data-e2e="comment-like-count"]');
        console.log(await username.textContent())
        console.log(await likeCounter.textContent())
        const totalReplies = await getAllRepliesOfComment(page, commentItem)
        let commentDataObject = {
            username: await username.textContent(),
            commentLikes: await likeCounter.textContent(),
            mainComment: await mainCommentTextElement.textContent(),
            replies: totalReplies,
            totalReplies: totalReplies.length,
        };

        totalCommentsCounter++;
        coments.push(commentDataObject);
    }
    return coments;
}

async function getAllRepliesOfComment(page, commentItem) {
    let replies = [];

    // Verifica si existe el contenedor de respuestas "DivReplyContainer"
    const replyContainer = await commentItem.$('[class*="DivReplyContainer"]');

    if (replyContainer && await replyContainer.isVisible()) {
        let viewMoreButton;

        // Continúa buscando y haciendo clic en "Ver más" mientras haya un botón visible
        while (true) {
        viewMoreButton = await replyContainer.$('[data-e2e*="view-more-"]');
        if (viewMoreButton && await viewMoreButton.isVisible()) {
            const mainComment = await commentItem.$('[class*="DivCommentContentContainer"]');
            handleCaptcha(page);
            await mainComment.hover();
            handleCaptcha(page);
            await viewMoreButton.hover();
            handleCaptcha(page);
            await viewMoreButton.click();
            
            await page.waitForTimeout(2000);  // Espera para que los nuevos elementos carguen
        } else {
            break;  // No hay más botones "Ver más" visibles, salir del bucle
        }
        }

        // Recoge los comentarios de las respuestas
        const replyComments = await replyContainer.$$('[class*="DivCommentContentContainer"]');

        for (const replyComment of replyComments) {
            const replyCommentTextElement = await replyComment.$('[data-e2e="comment-level-2"]');
            const replyCommentUsername = await replyComment.$('[data-e2e="comment-username-2"]');
            const replyCommentLikes = await replyComment.$('[data-e2e="comment-like-count"]');
            
            let commentDataObject = {
                username: await replyCommentUsername.textContent(),
                commentLikes: await replyCommentLikes.textContent(),
                comment: await replyCommentTextElement.textContent(),
            }
            replies.push(commentDataObject);
            totalCommentsCounter++;
        }
    }
    return replies;
}

(async () => {
 let goToVideo = 337;
  const browser = await chromium.launch({headless: false});
  
  const page = await browser.newPage();
  const headerPage = new HeaderPage(page);
  
  const mongo = new MongoOperations();
  
    // Navega a la página de login de TikTok
    await page.goto('https://tiktok.com/login');
    
    // Suponiendo que ya tienes cookies guardadas
    const cookies = [{
        name: 'sessionid',
        value: '152c6eceda20ec27066a83846a0d89fa',
        domain: '.tiktok.com',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }];

    // Agrega las cookies al contexto del navegador
    await page.context().addCookies(cookies);
    
    // Navega a la página principal de TikTok después de establecer las cookies
    await page.goto('https://tiktok.com');
    await page.waitForTimeout(5000);
    await headerPage.clickMoreMenuIcon();
    await page.waitForTimeout(3000);
    await headerPage.clickProfileInfo();

    //   let aceptarCookies = await page.$("//*button[contains(text(), 'Aceptar todo')]")
    //   aceptarCookies.click();

    console.log('Por favor, realiza la interacción necesaria y luego presiona cualquier tecla en la consola...');
    process.stdin.setRawMode(true);
    await new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        resolve();
    }));

    console.log('Continuando con el resto del script...');
    let videosLocators = '[class*="DivItemContainer"]';
    await page.waitForSelector(videosLocators);

    // Recoge todos los elementos por ID
    const videoOnMainPage = await page.$$(videosLocators);
    
    let allVideos = {
        videoObjects: []
    };

    let videoNumber = 0;
console.log("total: " + await videoOnMainPage.length)
    for (let video of videoOnMainPage) {
        console.log(videoNumber)
        if (videoNumber >= goToVideo) {
            try {
                let videoViews = await video.$('[data-e2e="video-views"]');
                let qttVideoViews = await videoViews.textContent();
        
                await video.click();
                console.log("Inside video")
                try {
                    await page.waitForSelector('[class*="DivCommentItemContainer"]', { timeout: 4000 }); 
                    console.log("Elemento encontrado y procesado.");
                } catch (error) {
                    console.log("Elemento no encontrado o no disponible a tiempo, continuando con el resto del script.");
                }
                
                await page.waitForTimeout(2000); 
                const buttonExpand = await page.$('[class*="ButtonExpand"]');  // Usa el selector correcto para tu clase
                if (buttonExpand && await buttonExpand.isVisible()) {
                    await buttonExpand.click();
                    handleCaptcha(page);
                }

                const videoDescriptionLabel = await page.$('[data-e2e="browse-video-desc"]');
                const likeLabel = await page.$('[data-e2e="browse-like-count"]');
                
                let videoObject = {
                    videoDesc: await videoDescriptionLabel.textContent(),
                    videoViews: qttVideoViews,
                    url: page.url(),
                    commentList: await getAllComments(page),
                    totalLikes: await likeLabel.textContent(),
                    totalComments: totalCommentsCounter
                };

                console.log("Video content: " + videoObject.videoDesc )
                console.log(videoObject.totalComments);
                totalCommentsCounter = 0;
            
                allVideos.videoObjects.push(videoObject)

                saveDataToJson(videoObject, `./output/output${videoNumber}.json`);
                
                const close = await page.$('[data-e2e="browse-close"]');
                close.click();
                handleCaptcha(page);
                await page.waitForTimeout(1000); 
            } catch (error) {
                console.log('Error ocurrido:', error.message);
                // Guarda un screenshot si algo falla
                await page.screenshot({ path: 'error-screenshot.png' });
                
            }
        }
        videoNumber++;
    }

})();

async function handleCaptcha(page) {
    try {
        // Comprobar si el captcha aparece en la página
        if (await page.$("[class*='captcha_verify_container']")) {
            console.log('Por favor, realiza la interacción necesaria y luego presiona cualquier tecla en la consola...');
            process.stdin.setRawMode(true);
            await new Promise(resolve => process.stdin.once('data', () => {
                process.stdin.setRawMode(false);
                resolve();
            }));
        }
        // Continúa con más acciones después de la interacción manual
    } catch (error) {
        console.error('Error al procesar la página:', error);
    }
}
