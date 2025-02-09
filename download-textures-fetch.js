const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = {
    'mercury.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    'venus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
    'earth.jpg': 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    'mars.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    'jupiter.jpg': 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
    'saturn.jpg': 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    'saturn-rings.jpg': 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png',
    'uranus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    'neptune.jpg': 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg'
};

const downloadTexture = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'textures', filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
            
            file.on('error', (err) => {
                fs.unlink(filePath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
        });
    });
};

async function downloadAllTextures() {
    try {
        // Create textures directory if it doesn't exist
        const texturesDir = path.join(__dirname, 'textures');
        if (!fs.existsSync(texturesDir)) {
            fs.mkdirSync(texturesDir);
        }
        
        for (const [filename, url] of Object.entries(textures)) {
            try {
                await downloadTexture(url, filename);
                console.log(`Successfully downloaded ${filename}`);
            } catch (error) {
                console.error(`Error downloading ${filename}:`, error.message);
            }
        }
        console.log('Finished downloading textures');
    } catch (error) {
        console.error('Error in downloadAllTextures:', error);
    }
}

downloadAllTextures();
