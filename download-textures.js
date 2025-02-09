const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = {
    'mercury.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg',
    'venus.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus.jpg',
    'earth.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth.jpg',
    'mars.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars.jpg',
    'jupiter.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg',
    'saturn.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg',
    'saturn-rings.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn-rings.jpg',
    'uranus.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg',
    'neptune.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg'
};

const downloadTexture = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'textures', filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
        });
    });
};

async function downloadAllTextures() {
    try {
        for (const [filename, url] of Object.entries(textures)) {
            await downloadTexture(url, filename);
        }
        console.log('All textures downloaded successfully!');
    } catch (error) {
        console.error('Error downloading textures:', error);
    }
}

downloadAllTextures();
