import fs from 'fs'
import path from 'path'

const directoryPath = '../../../wikiSites'; // Replace with the actual path to your directory
console.log("directory path:",directoryPath);
try {
    const files = fs.readdirSync(directoryPath);
    console.log('Files in directory:');
    files.forEach(file => {
        console.log(file);
    });
} catch (err) {
    console.error('Error reading directory:', err);
}

var mdList = [];

export { mdList }
