import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function telMeYourHome( whoAsking ){
    console.log(`viteyss teling [${whoAsking}] home address...
    ${__dirname}`);
    return __dirname;
}

export { telMeYourHome }