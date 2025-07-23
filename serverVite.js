

import { defineConfig, createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite';

import * as fsH from 'mnodehttp/fsHelp.js';
var dirList = fsH.dirList;
import * as mimeH from 'mnodehttp/mimeHelp.js';
var getMimeFromExt = mimeH.getMimeFromExt;
import * as sitesH from 'mnodehttp/sitesHelp.js';
import * as nyss from "node-yss";

import fs from 'fs';
import path from 'path';
import * as sws from 'mnodehttp/serverWs.js';
import { mkVueTemplateStr } from 'mnodehttp/vueHelp.js';
import { requestYss, resSetHeaders, res404 } from 'mnodehttp/yssHelp.js';
//import { resSetHeaders } from 'mnodehttp/yssHelp.js';
//import { res404 } from 'mnodehttp/yssHelp.js';

var config = undefined;


function cl(str){
    console.log('sVit', str);
}


function hotCBecho( hot, rt, data ){
  cl('hotCBecho: '+rt);
  hot.send({
    type: 'custom',
    event: 'echo-'+rt,
    data: String(data).toLocaleUpperCase()
  });
}

class serverVite {

  constructor( nconfig, nwss, nws ){
    this.config = nconfig;
    this.wss = nwss;
    this.ws = nws;
    this.http = undefined;
    this.isRunning = false;
    this.wsPingIter = undefined;
    this.pingCount = 0;
    this.hot = undefined;

    this.myConf = this.mkReadyForVit( nconfig );


    this.cl('serverVite init ....'+this.config.name);
  }

  cl(str) {
    console.log('sVit',str);    
  }

  mkReadyForVit( conf ){
    return defineConfig({

      server: {         
        host: this.config.HOST, 
        port: this.config.PORT ,
        headers:{
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':'Content-Type'
        }
      },
      
      define:{
        testDefineVal: 1
      },    
    
      // ... other configurations
      publicDir: ['public','sites', 'wikiSites', 'icons'], // Optional, but good practice to explicitly define it.  Defaults to 'public' if not specified
      
      plugins: [
        //this.cupItTo404(),

        /*{
          name: 'custom-dev-events',
          configureServer(server) {

            server.ws.on('hot-custom-testC2S', (newModule) => {
              console.log('Received custom event:', newModule);
              // You can also send a response back to the client
              //server.ws.send({ type: 'custom-response', message: 'Server received!' });
            });
          },
        },*/


        this.addToHot(),
        vue({
          include: [/\.vue$/, /\.md$/],
        }),
        Markdown({ /* options */ }),
        this.yssPostProcess(),
        // ... other plugins
              
      ],    
    
    });
    
  }
  

  addToHot(){
    var tconfig = this.config;
    return {
      name: 'ass-add-to-hot',
      configureServer(server) {  
        console.log('addToHot ..');
        server.ws.on('hot-custom-testC2S', (newModule) => {
            console.log('addToHot get :', newModule);
            // You can also send a response back to the client
            //server.ws.send({ type: 'custom-response', message: 'Server received!' });
          });
        //next();
        
      }
    }
  }

  cupItTo404(){
    var tconfig = this.config;
    return {
      name: 'ass-cupItTo404',
      configureServer(server) {  
        server.middlewares.use(async (req, res, next) => {
          let filePathFull = path.resolve( '/', req.url.substring(1) );
          console.log('cupItTo404 '+filePathFull);
          res404( 'no file '+filePathFull, res)
          //next();
        });
      }
    }
  }

  yssPostProcess() {
    var tconfig = this.config;
    return {
      name: 'yss-post-process',
      configureServer(server) {  
        server.middlewares.use(async (req, res, next) => {
          
          requestYss( req, res, next, tconfig );
        });
      }
    }
  }
  

  async mkInstance(){
    this.cl('mkInstance: ['+this.config.name+'] http://'+this.config.HOST+":"+this.config.PORT);
    //this.cl("config for server");this.cl(this.myConf);
    this.http = await createServer(this.myConf);
    //this.cl("after create we have");this.cl(this.http);
    
  }


  async startServer(){

    if( this.http == undefined ){
      this.cl('no http object ... wait ');
      setTimeout(()=>{ this.startServer() },100);
      return 1;
    }else{

      
      
      this.cl("[i] StartServer of ["+this.config.name+"] ...");//this.cl(this.http);
      await this.http.listen();
      this.http.printUrls()
      
      this.hot = this.http.hot;

      this.doPingTest( this.http.ws );
      
      if( this.config.wsPinger ){
        if( this.wsPingInter == undefined ){
          this.wsPingInter = setInterval( ()=>{this.sendPingOnWs();}, 10000 );
        }
      }
      
    }
  }

  doPingTest( hot ){

    setTimeout(()=>{
      console.log("hot:test...");
      hot.send({
        type: 'custom',
        event: 'hot-custom-ping',
        data: "{topic:'hot/ping', payload:'hello'}"
        
      });


      console.log("clients : ",new Set(this.hot.clients).size);
      this.doPingTest( hot );
    },5000);
  
  } 


  stopServer(){
    this.cl("[i] StopServer of ["+this.config.name+"]");
    this.http.close(()=>{cl('[i] Server http closed. No new connections will be accepted.');});
    if( this.wsPingInter != undefined ){
      cl("stopPing Interval ...");
      clearInterval( this.wsPingInter );
    }
    
  }

  sendPingOnWs(){
    //this.cl("ping ...");
    this.pingCount++;
    if( sws.wsClientsOnline( this.ws ) != 0 ){
     sws.sendToAll(this.ws, `{"topic":"ping","payload":"pong", "count":"${this.pingCount}"}`,
        "["+this.config.name+'] ping'
      );
    
    }
  }

}




//// ---------------------

/*
function resSetHeaders( res, code = 200, contentType = 'text/plain' ){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.writeHead(code, { 'Content-Type': contentType });
}
*/
function resJson( res, j ){
  resSetHeaders( res, code=200, contentType="text/javascript" );
  res.end( JSON.stringify(j) );
}

/*
function res404( str, res ){
  resSetHeaders( res, code=404,contentType='text/html' );
  res.end(`<!DOCTYPE html>
    <html>
    <head>
    <meta http-equiv="refresh" content="1; url='/yss/index.html'" />
    </head>
    <body>
    <b>404 ${str}</b>
    <p>Please follow <a href="/yss/index.html">/yss/index.html</a>.</p>
    </body>
    </html>`);      
}    
*/

function bStart(title){
  return { 'title': title, 'tStart': Date.now() };
}
function bEnd( bStartRes ){
  let inT = Date.now()-bStartRes.tStart; 
  //cl(`[ben] ${bStartRes.title} in ${inT}mil`);
}

var serverRunnit = true;
var server = undefined;







//startServer();


export { serverVite };