/*
This  document is used to transform JSON from "ouput" folder to "documentation".

*/

const fs = require('fs');
const path = require('path');

const sourceDir = './outputdocs'; // Asegúrate de ajustar este camino al directorio donde están tus archivos
const targetDir = './organized'; // Directorio donde se crearán las subcarpetas

// Crear el directorio organizado si no existe
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}

// Leer todos los archivos en el directorio
fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio:', err);
        return;
    }

    files.forEach(file => {
        // Extraer el número del nombre del archivo
        const match = file.match(/(\d+)/);
        if (match) {
            const number = match[0];
            const folderPath = path.join(targetDir, `folder${number}`);

            // Crear subcarpeta si no existe
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            // Mover archivo a la subcarpeta correspondiente
            const srcPath = path.join(sourceDir, file);
            const destPath = path.join(folderPath, file);
            fs.rename(srcPath, destPath, (err) => {
                if (err) {
                    console.error('Error al mover el archivo:', err);
                } else {
                    console.log(`Archivo ${file} movido a ${folderPath}`);
                }
            });
        }
    });
});
