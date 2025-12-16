
console.log('Hello vite.config.js');

import { defineConfig } from 'vite'

import { readFileSync } from 'fs';
import { resolve } from 'path';

import { requestYss } from './sharelibs/mnodehttp/yssHelp'

import vue from '@vitejs/plugin-vue'


var configyss = {
  'name': "bigOne",
  'HOST': '0.0.0.0',
  'PORT': 8777,
  'wsHOST': '0.0.0.0',
  'wsPORT': 1999,
  'pathToYss': '/home/yoyo/Apps/oiyshTerminal/ySS_calibration',
  'pathsToSites': [
    '/home/yoyo/Apps/oiyshTerminal/ySS_calibration/sites',
    '/home/yoyo/Apps/vite01/viteyss/sites'
  ],    
  //'wsInjection': false,
  'wsInjection': true,
  'yssWSUrl': `ws://localhost:1999/`,
  
  'sitesInjection': true,
  'ws': undefined,
  'wsPinger': true

};


function fabc(){ testDefineVal++; console.log("testDefineFunc"); return 1;}



export default defineConfig({
  server: { 
    host: configyss.HOST, 
    port: configyss.PORT ,
  },
  define:{
    testDefineVal: 1,
    testDefineFunc: fabc // not working for functions :/,
  },

  // ... other configurations
  publicDir: ['public2','public','sites'], // Optional, but good practice to explicitly define it.  Defaults to 'public' if not specified
  plugins: [
    vue(),
    postprocessTestDirFiles(),
    yssPostProcess(),


    
    // ... other plugins
     
    
  ],


})






  
import { getWsInstance } from './sharelibs/mnodehttp/serverWs'

console.log("yssPostProcess -- init ws");

try{
  const ws = getWsInstance( configyss, (ws, topic, payload)=>{
    console.log(`ws got: topic:`+topic+" payload:"+payload);
  } );
  console.log(' ws cold start ...');
}catch(e){

  console.log(' ws is running? how to stop or get it ...',ws);
  console.error(e);
}

function yssPostProcess() {
  return {
    name: 'yss-post-process',
    configureServer(server) {

      server.middlewares.use(async (req, res, next) => {
        
        requestYss( req, res, next, configyss );

      });

    }
  }
}


function postprocessTestDirFiles() {
  return {
    name: 'postprocess-testdir-files',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Check if the request is for a file in your 'testDir'
        if (req.url && req.url.startsWith('/abc/')) {
          const filePath = resolve(server.config.root, req.url.substring(1)); // Remove leading '/'
          console.log("to upper");
          try {
            // Read the file content
            let fileContent = readFileSync(filePath, 'utf-8');

            // --- Your Post-Processing Logic Here ---
            // Example: Simple text replacement for .txt files
            if (filePath.endsWith('.txt')) {
              fileContent = fileContent.toUpperCase(); // Convert to uppercase
            }
            // Example: Parse and modify JSON
            else if (filePath.endsWith('.json')) {
              const data = JSON.parse(fileContent);
              data.processedByViteMiddleware = true;
              fileContent = JSON.stringify(data, null, 2);
              res.setHeader('Content-Type', 'application/json');
            }
            // Add more processing for other file types

            res.writeHead(200);
            res.end(fileContent);
            return; // Important: end the response here
          } catch (e) {
            console.error(`Error processing file ${filePath}:`, e);
            res.writeHead(500);
            res.end('Error processing file');
            return;
          }
        }
        next(); // Continue to the next middleware if not handled
      });
    },
  };
}




