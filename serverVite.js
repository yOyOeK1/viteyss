

import { defineConfig, createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite';

import basicSsl from '@vitejs/plugin-basic-ssl';


import * as sitesH from './sharelibs/mnodehttp/sitesHelp.js';

import fs from 'fs';
import path from 'path';
import * as sws from './sharelibs/mnodehttp/serverWs.js';
import { requestYss, resSetHeaders, res404 } from './sharelibs/mnodehttp/yssHelp.js';
//import { resSetHeaders } from './sharelibs/mnodehttp/yssHelp.js';
//import { res404 } from './sharelibs/mnodehttp/yssHelp.js';

//import { m_wiki } from './sites/wiki/m_wiki.js';
//import * as otmp from './sites/wiki/m_wiki.js';
import { WebSocketServer } from 'ws';
import { wsCallBackHelper } from './wsCallBackHelp.js' 
import { fileURLToPath, URL } from 'url';           

import {dirname, resolve} from 'node:path'

import { plugVector  } from './libs/plugVector.js';
import { sh_reqParse } from './serverHelp.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dirnameProcess = process.cwd();



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

    if( this.config.https == true ){
      this.swssClients = {};
    }
    this.wss = nwss;
    this.ws = nws;
    this.http = undefined;
    this.isRunning = false;
    this.wsPingIter = undefined;
    this.pingCount = 0;
    this.hot = undefined;
    this.yssPages = undefined;
    this.modulesSrc = [];
    this.m = []; // modules comming from sites
    this.wsCBH = new wsCallBackHelper( this.wss, this.ws );
    
    this.pVector = -1;
    this.initPlugVector();

    this.buildYssPages()
    this.myConf = this.mkReadyForVite( nconfig );

    this.yssBundleStr = ''; // buffor / cashe
    this.yssBundleSet = {};
    

    this.cl('serverVite init ....'+this.config.name);
  }

  cl(str) {
    console.log('sVit',str);    
  }

  yssWSS(){
    var tconfig = this.config;
    var tswss = this.ws;

    return {
      name: 'yss-wss',
      configureServer(server) {  

        // do wss 
        server.httpServer.on('upgrade', function upgrade(request, socket, head) {

          

          if (request.url == '/fooWSS') {
          
            tswss.handleUpgrade(request, socket, head, function done(ws) {
              console.log("wss on foowss");
              tswss.emit('connection', ws, request, "c"+Math.random()+"_"+Date.now() );
              //ws.send('hello from ws2');
              //setTimeout(()=>{
              //  ws.send('hello delayd...');
              //},1000);
            });
           
          }else{
            //socket.destroy();
          }

        });     

      }

    }

  }



  initPlugVector(){
    this.pVector = new plugVector();

    // to test it curl -x POST http://localhost:8080/apis/echo -d 'a=1&b=2&a=3'  | jq .
    this.pVector.addO('echo',{
      handleRequest: ( args )=> {

        let {req, res } = args;
        if( req.method == 'POST' && req.url == '/apis/echo' ){
            console.log('echo /apis/echo in middle ....');
            sh_reqParse( req, res, ( resp, fields, files )=>{
              console.log(`So this is echo and fields are `+JSON.stringify(fields));
              let tr ={
                'api': '/apis/echo',
                'fields': fields,
                'files': files
              };
              resp.end(JSON.stringify(tr));
              
            } );
            return 0;
        }else{}
      }

    });

    // for upload files
    this.pVector.addFromFile('serUpl', './libs/apis/upload.js');


  }

  async buildYssPages(){
    this.cl("\n\n/----- modules sites src\n\n");

    this.yssPages = sitesH.getInjectionStr('', this.config.pathsToSites,'yssPages');
    
    for( let p=0,pc=this.yssPages.length;p<pc;p++){
      let plug = this.yssPages[p];
      if( plug.modsrc != undefined ){
          this.cl( `- [modsrc] site ${plug.oName} `+(plug.modsrc != undefined? ' modsrc: '+plug.modsrc : '') );
          this.modulesSrc.push( plug );          
      }

      if( plug.apisrc != undefined ){
          this.cl( `- [apisrc] site ${plug.oName} `+(plug.apisrc != undefined? ' apisrc: '+plug.apisrc : '') );
          let fileS = plug.fDir+'/'+plug.apisrc[0]; 
          this.pVector.addFromFile( `${plug.oName} \ ${plug.apisrc[0]}`, fileS );
      }

    }    
    
    this.cl("\n\n\\___ modules sites src count: "+this.modulesSrc.length);

  }
  
  
  
  mkReadyForVite( conf ){    
    let fsAllow = [ fs.realpathSync(__dirnameProcess),__dirname, path.join(__dirname, 'wikiSites'), fs.realpathSync('./')];
    for( let p of this.config.pathsToSites ){
      try{
        fsAllow.push( 
          fs.realpathSync(p)
          //p
          );
      }catch(e){
        console.error(`serVit [e] looking for site directory [${p}] in allows error\n`,e,'\n---------- DONE');
      }
    }
    console.log(`[i] host file access to `,fsAllow);
    //process.exit(11);

    let pluginsList = [];
    if( this.config.https == true ){
      pluginsList.push( basicSsl() );
      pluginsList.push( this.yssWSS() );

    }
    //pluginsList.push( this.cupItTo404PostProcess() );
    //pluginsList.push( mkcert() );
    pluginsList.push( this.yssPostProcess() );
    pluginsList.push( this.addToHotPostProcess() );
    pluginsList.push( vue({
        include: [/\.vue$/, /\.md$/],
      }) );
    pluginsList.push( Markdown() );

    let ssl = this.config.https;
    if( ssl == true ){
      ssl = { //path.join(__dirname, 'wikiSites')
          key: fs.readFileSync( path.join( __dirname, 'cert/server.key') ), // Path to your private key
          cert: fs.readFileSync( path.join(__dirname, 'cert/server.crt') )  // Path to your certificate
        };
      this.cl('HTTP(S) enabled ... reading key crt ....');
      this.cl(ssl);
    }


    let sAlias = {
      '@src/': path.join( __dirnameProcess, 'src' ),//'/home/yoyo/Apps/viteyss/src/', //fileURLToPath(new URL('./src', import.meta.url))
      '@libs/': path.join( __dirnameProcess, 'libs' ),
      '@sharedlibs/': path.join( __dirnameProcess, 'sharedlibs' ),//'/home/yoyo/Apps/viteyss/src/', //fileURLToPath(new URL('./src', import.meta.url))
      //relibs/': path.join(__dirnameProcess, 'sharelibs' ),
    };

    
    for( let ypi of this.yssPages ){
      let dName = ypi.fDir.substring( ypi.fDir.lastIndexOf('/')+1 );

      if( ypi.fDir.startsWith('/') ){
        //sAlias[ '@'+dName ] = ypi.fDir;//this.pVector.pathSolver( ypi.fDir );
        sAlias[ '@'+dName ] = fileURLToPath( new URL(fs.realpathSync( ypi.fDir ), import.meta.url) );
      } else{
        //fs.realpathSync(__dirnameProcess)
        //sAlias[ '@'+dName ] = fileURLToPath(new URL('./'+ypi.fDir, import.meta.url))
        sAlias[ '@'+dName ] = fileURLToPath( new URL(fs.realpathSync( './'+ypi.fDir ), import.meta.url) );
      }
    }
    this.cl('build of sAliasis result .....');
    this.cl(sAlias);


    return defineConfig({
      root:__dirname,
      
      define:{
        'process.env.vy_config': this.config,
        'testDefineVal': '1',
        'process.env.testDefineVal2': '{abc:1,ddd:"str"}',
        'process.env.testDefineVal3': {abc:1,ddd:"str"},
        //'process.env.testFunc1': ()=>{ console.log('testFunc1')},
      },   
      /*
      build : {
        rollupOptions: {
          input: {
            main: resolve(path.join(__dirname, 'index.html')),
            //'abc' : resolve(__dirname, 'dirTest1/index.html'),
            'ys': resolve(__dirname, '../viteyss-site-otdmtools/index.html'),
          },
        },
      },
      */

      server: {    
        //open: true,
        https: ssl,
        'fs':{
          allow:fsAllow,
          alias: sAlias,
        },
        
        host: this.config.HOST, 
        port: this.config.PORT ,
        
        headers:{
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':'Content-Type'
        },
        
      },      
      
      // ... other configurations
      publicDir: [ 'public','sites', 'wikiSites', 'icons','libs'], // Optional, but good practice to explicitly define it.  Defaults to 'public' if not specified
      plugins: pluginsList,
      resolve:{
        alias: sAlias
      },

      
    
    });

    
    
    
  }
  

  addToHotPostProcess(){
    var tconfig = this.config;
    var tmodulesSrc = this.modulesSrc;
    var tserver = this;
    let twsCBH = this.wsCBH;
    return {
      name: 'ass-add-to-hot',
      configureServer(server) {  

        return ()=>{

          console.log('addToHot ..');
          
          console.log("/--- init modules");
          for( let mi=0,mic=tmodulesSrc.length; mi<mic; mi++ ){
            this.m = tmodulesSrc[mi]
            let m = this.m;
            m['omods'] = [];
            m['imods'] = [];
            console.log("   - module name: "+m.oName);
            for( let fi=0,fic=m.modsrc.length; fi<fic; fi++ ){
              let classS = m.modsrc[fi].substring(0, m.modsrc[fi].length-3);
              let fileS = m.fDir+'/'+m.modsrc[fi]; 
              
              fileS = tserver.pVector.pathSolver( fileS );

              console.log("     - file: "+fileS);
              
              m.omods[fi] = import(fileS).then((o)=>{
                var ims = new o[classS]( server.ws );
                let ke = ims.wskey;
                if( tmodulesSrc[mi]['modinst'] == undefined )
                  tmodulesSrc[mi]['modinst'] = {};
                tmodulesSrc[mi]['modinst'][fi] = ims;
                ims['o'] = m;
                if( ims.setServer )
                  ims.setServer( tserver );
                

                if( ims.onWsMessageCallBack ){
                console.log(`   connect with ws ... recive onWsMessageCallBack`);
                ims.wss = twsCBH.wss;
                ims.ws = twsCBH.ws;
                twsCBH.addCB( ims );
              }
              
              server.ws.on( ke, function ( msg ){ 
                  //console.log('addToHot get :', msg);                
                  //ims.onMsg( msg ); // to route Hot 
                  
                } );
                server.ws.on( "C2S"+ke, function ( msg ){ 
                  //console.log('C2S '+ke+' got :', msg);
                  ims.onMsg( msg ); 
                  
                } );
                m.imods[fi] = ims;
                
              }); 
              
            }
          }

          console.log("\\___ init modules DONE");
          
          server.ws.on('hot-custom-testC2S', (newModule) => {
            
            console.log('C2S hot-custom get :', newModule);
            // You can also send a response back to the client
            //server.ws.send({ type: 'custom-response', message: 'Server received!' });
          });
          //next();
          

          

        }
          
      }

    }
  }

  cupItTo404PostProcess(){
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




  yssPostProcess( ){
    var tconfig = this.config;
    var tyssPages = this.yssPages;
    var tpVector = this.pVector;
    var tserver = this;

    return {
      name: 'yss-post-process',
      /*
      transform(src, id){
        console.log('trans  \n\nid\n',id);

      },
      */
      configureServer(server) {  
        
        //console.log('req.url: '+server);
        
        server.middlewares.use(async (req, res, next) => {
          
          if( req.originalUrl ){
            req.url = req.originalUrl;
          }
          //console.log('serVite    ',req.url,' methode:', req.method,'\ndirName: ',__dirname);
          
              
            // -- POST handlers 
            let pRes = tpVector.execReturn('handleRequest',{
              'req': req, 'res': res, 'server': tserver
            });
            //console.log('plugins result: --------------\n'),pRes,"\n-------------";
            if( pRes != undefined ){
              if( pRes.then && pRes.then == 'function ' ){
                return pRes.then((r)=>{ return r; } );
              }else{
                return 1;
              }
            }
          
            /*
            if( req.method == 'POST' ){
              console.log('in middle POST ....');
              let form = formidable({
                uploadDir: path.join(process.cwd(), 'uploads'),
                keepExtensions: true,
                maxFileSize: 5 * 1024 * 1024, // 5MB limit 
              });
              let [fields, files] = await form.parse(req);
              //console.log(` field   `,fields,"\n\nfiles\n",files);
              
              let uploadedFile = files.myFile ? files.myFile[0] : null;

              if (uploadedFile) {
                console.log('File uploaded successfully:', uploadedFile.filepath);
                console.log('Original filename:', uploadedFile.originalFilename);
                console.log('File size:', uploadedFile.size);
                console.log('Description:', fields.description ? fields.description[0] : 'No description');
                res.end(JSON.stringify(uploadedFile));
              }

            }
            */

          // ---- POST handlers end

          /// ------------ fake res for bundle start
          let r = 0;
          let fakeRes = {
            setHeader: ( arga, argb ) => { //console.log('fake res got set header ',arga, argb );
              res.setHeader( arga, argb );
            },
            writeHead: ( code, opts ) => { //console.log('fake res got write head ',code, opts);
              res.writeHead(code, opts );
            },

            end: ( tr ) => { //console.log('fake res got end ',tr);

              console.log('VYBundlerS have yss/index.html make bundle ....');
              let aband = false;

              let trSplt  = tr.split('<!-- bundle area [1] START -->');
              if( trSplt.length == 1 ){
                console.error('EE VYBundlerS have yss/index.html make bundle ....ABORD no injection spot found');
              
                res.end( tr );
                if( r != 0 ){
                  next();
                }
              }else{
                let trTop = trSplt[0];
                trSplt = trSplt[1].split('<!-- bundle area [1] END -->');
                let trBundle = trSplt[0];
                let trBottom = trSplt[1]



                let bRes = [];
                let bConts = [];
                let srcBund = 'NaN';
                let fileInBundele = [];


                if( 1|| tserver.yssBundleStr == '' ){


                  trBundle.split('\n').forEach( entr => {
                    let fName = entr.replaceAll('<script src="','').replaceAll('"></script>','');
                    
                    if( fName != "" && String(fName).length > 0 ){                    
                      let fPath = path.join( tconfig.pathToYss, fName );
                      let fCont = fs.readFileSync( fPath );
                      bConts.push( 
                        `\n//--start [${fName}]\n
                        //console.log("   * bundle [${fName}]");\n`+
                        fCont.toString()+
                        `\n//--end [${fName}]\n`
                      );
                      tserver.yssBundleStr = bConts.join('\n\n');
                      tserver.yssBundleSet[1] = fileInBundele;
                      bRes.push( fName );
                      fileInBundele.push( fName );
                    }
                  });

                  srcBund = 'files';
                }else{
                  bRes = 'cashe';
                  srcBund = 'cashe';

                }

                console.log('VYBundlerS bundle \n',trBundle,'\n------');
                tr = trTop+
                  `\n\n<!-- injection bundle start -->\n\n
                  <script src="index_bundle.js"></script>
                  <script>
  console.log('VYBundlerC [i] - bundle from [${srcBund}]');

  let yssBundleSet = ${JSON.stringify(tserver.yssBundleSet, null, 4)};


  let bundleIn = ${JSON.stringify(bRes)};
  `+/*${bConts.join('\n\n')}*/
  `

                  \n</script>\n\n<!-- injection bundle end -->\n\n`+
                  trBottom;


                res.end( tr );
                
                if( r != 0 ){
                  next();
                }
                console.log('VYBundlerS have yss/index.html make bundle ....END');

              }              
            }
          };
          /// ------------ fake res for bundle end 


          if( req.originalUrl == '/yss/index_bundle.js' ){          
            console.log('VYBundlerS ok have q for index bundle js :) ');
            res.end(
              'console.group("VYBundlerC load logs");\n'+
              tserver.yssBundleStr+
              'console.groupEnd("VYBundlerC load logs");\n'
            );

          }else if( req.originalUrl == '/yss/index.html' ){

            r = requestYss( req, fakeRes, '', tconfig, server, tyssPages);
            if( r != 0 ){
              //console.log(`requestYss returnd ...[${r}] so next() ...${req.url}`);
              next();            
            }

          }else{

            r = requestYss( req, res, '', tconfig, server, tyssPages);
            if( r != 0 ){
              //console.log(`requestYss returnd ...[${r}] so next() ...${req.url}`);
              next();            
            }
          }



            
        });
          
      }

    };
      
      
    
  }
  

  async mkInstance(){
    this.cl('mkInstance: ['+this.config.name+'] '+
      'http'+( this.config.https ? '(s)':'')+
      '://'+this.config.HOST+":"+this.config.PORT);
    this.http = await createServer(this.myConf);
    
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
      this.doHotPingTest( this.http.ws );




      if( this.config.wsPinger ){
        if( this.wsPingInter == undefined ){
          this.wsPingInter = setInterval( ()=>{this.sendPingOnWs();}, 10000 );
        }
      }
      
    }
  }
  
  sendPingOnWs(){
    //this.cl("ping ...");
    this.pingCount++;
    if( sws.wsClientsOnline( this.ws ) != 0 ){
     sws.sendToAll(this.ws, `{"topic":"ping","payload":"pong", "count":"${this.pingCount}"}`,
        //"["+this.config.name+'] ping'
      );
    
    }
  }
  
  doHotPingTest( hot ){
    setTimeout(()=>{
      let clientsCount = parseInt(new Set(this.hot.clients).size);
      if( clientsCount > 0 ){
        hot.send({
          type: 'custom',
          event: 'hot-custom-ping',
          data: "{topic:'hot/ping', payload:'hello'}"
          
        });      
        //console.log("clients : ",new Set(this.hot.clients).size);
        //console.log("hot:serverVite PingTest clients:"+clientsCount);
      }

      this.doHotPingTest( hot );

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