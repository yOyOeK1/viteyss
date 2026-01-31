
import { serverContainerVite } from './serverContainerVite.js'
import { vysPlugins, pcNpmls } from './startItAsPluginColector.js'
import nyss from "./sharelibs/node-yss/index.js";
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dirnameProcess = process.cwd();

//let debug = 'viteyssDebug' in process.env ? process.env.viteyssDebug:false;
let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;
let defNpmPlugDoVer = 2;


/** Viteyss Config Builder
 * ##returns:
 * congif0 
 */
let vyConfigBuilder = (
    argsOpts = {},
    config0 = undefined,
    isAs = 'local',
    instanceTitle = 'local:BigOne',

    hostPublicIp = 'localhost',
    pathsToSites = -1,
    doSSL = false, // need to have keys in `viteyss/cert/...`
) => {
  if( config0 == undefined || typeof config0 == 'string' ){
    console.error( 'EE vyConfigBuild start without config0 arg!! type [',(typeof config0),']' );
    process.exit(1);
  }
  
  process.title = instanceTitle;
  let nyssPath = nyss.telMeYourHome(`${instanceTitle} - startItAs.js`);
  let pathNodeYss = path.join( nyssPath ,instanceTitle );
  let wsPORT = 2999;
  
  function cl(str){
      console.log('* startItAs:',str);
  }



  if( isAs == 'local' ){ 
  }else  if( isAs == 'devLocal' ){
   
  }else  if( isAs == 'devOT' ){
  }

  let pathToYss = path.join( nyssPath, 'yss');

  if( isAs == 'local' ){ 
    //pathToYss = '/home/yoyo/Apps/oiyshTerminal/ySS_calibration';
    
    pathsToSites = [];
    
    if( 'yssSites' in argsOpts && argsOpts.yssSites == '0' ){
    }else{
      // node-yss / sites
      pathsToSites.push( path.join( pathToYss, 'sites' ) );
    }
    
    if( 'viteyssSites' in argsOpts && argsOpts.viteyssSites == '0' ){
    }else{
      // viteyss / sites
      pathsToSites.push( path.resolve('./sites') );
    }

    if( 'homeSites' in argsOpts && argsOpts.homeSites == '0' ){
    }else{
      // if you have `~/.viteyss/sites
      pathsToSites.push( path.join( process.env.HOME, '.viteyss', 'sites' ) );
    }
    
    

  }else  if( isAs == 'devLocal' ){ 
      wsPORT = 2998;
      pathsToSites = [
        // dev 
        '/home/yoyo/Apps/oiyshTerminal/ySS_calibration/sites',

        // node-yss / sites
        //path.join( nyssPath, 'sites' ),

        // viteyss / sites
        path.resolve('./sites'),

        // if you have `~/.viteyss/sites
        path.join( process.env.HOME, '.viteyss', 'sites' ),
      ];

  }else  if( isAs == 'devOT' ){ 
      hostPublicIp = '192.168.43.220';
      //doSSL = true; 
      pathToYss = '/home/yoyo/Apps/oiyshTerminal/ySS_calibration';

      pathsToSites = [
        // dev 
        path.join( pathToYss, 'sites' ),

        // node-yss / sites
        //path.join( pathNodeYss, 'sites' ),

        // viteyss / sites
        path.resolve('./sites'),

        // if you have `~/.viteyss/sites
        path.join( process.env.HOME, '.viteyss', 'sites' ),
      ];
  }

  
  config0['https'] = doSSL;
  config0['name'] = instanceTitle;
  config0['HOST'] = '0.0.0.0';
  config0['PORT'] = 8080;
  config0['wsHOST'] = '0.0.0.0';
  config0['wsPORT'] = wsPORT;
  config0['pathToYss'] = pathToYss;//'/home/yoyo/Apps/oiyshTerminal/ySS_calibration',
  config0['pathsToSites'] = pathsToSites;
  config0["pathsToSitesPackages"] = [];//pathToSitesPackages,
  config0['wsInjection'] = false;
  config0['wsInjection'] = true;
    
  config0['sitesInjection'] = true;
  config0['ws'] = undefined;
  config0['wsPinger'] = false;
  

  if( config0.https == true ){
    config0['yssWSUrl'] = `wss://${hostPublicIp}:${config0.PORT}/fooWSS`;
  } else {
    // old ws way
    config0['yssWSUrl'] = `ws://${hostPublicIp}:${config0.wsPORT}`;
    
    // noService ws as websocket as plugin in vite
    //config0['yssWSUrl'] = `ws://${hostPublicIp}:${config0.PORT}/fooWSS`;

  }

  
  

  if( debug )
    cl(["\n\n-[info]------------------\nHello - isAs:["+isAs+"] process name ["+instanceTitle+"]\n",
      "\n * dirname: ",__dirname,
      "\n * config: ",config0,
      "\n -------------------------------------------\n\n"
    ]);

  
  return config0;

};



let vyAddPlugins = ( config0 ) => {
  // sites ass a plugins `viteyss-site-`
  //console.log(`####`,config0);
  if( 1 ){
    pcNpmls( 'viteyss-site-', 
      ('npmPlugDoVer' in config0.argsOpts ? config0.argsOpts.npmPlugDoVer : defNpmPlugDoVer )
      );
    if( debug ) console.log("---------------------","vysPlugins",vysPlugins,"---------------------" );
    if( Object.keys( vysPlugins ).length > 0 ){
      Object.keys( vysPlugins ).forEach((pkey)=>{
        config0.pathsToSites.push( vysPlugins[pkey].pathTo );
        // add path to sites from packages 
        let ptsp = {
          "package":vysPlugins[pkey].package,
          "pathTo":vysPlugins[pkey].pathTo,
          'site':vysPlugins[pkey].site
        };
        config0['pathsToSitesPackages'].push( ptsp );
      });
    }
  }
  return config0;
}; 





/** Viteyss main init and start 
 * pass config0
*/
let Viteyss = ( config0 ) =>{

  if( debug )console.log('\n\n\n\n\n\n',
    '##START process.env\n',process.env,'\n##END process.env',
    '##START config\n',config0,'\n##END config\n',
    '\n\n\n\n\n\n\n'
  );

  let sc0 = new serverContainerVite(0,config0 );
  sc0.initServers();
  sc0.startServer();
  return sc0;
};


export { Viteyss, vyConfigBuilder, vyAddPlugins }