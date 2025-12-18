
import { serverContainerVite } from './serverContainerVite.js'
import { vysPlugins, pcNpmls } from './startItAsPluginColector.js'
import nyss from "./sharelibs/node-yss/index.js";
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dirnameProcess = process.cwd();



let Viteyss = (
    isAs = 'local',
    instanceTitle = 'local:BigOne',

    hostPublicIp = 'localhost',
    pathsToSites = -1,
    doSSL = false, // need to have keys in `viteyss/cert/...`
) => {

  
  process.title = instanceTitle;
  let nyssPath = nyss.telMeYourHome(`${instanceTitle} - startItAs.js`);
  let pathNodeYss = path.join( nyssPath ,instanceTitle );

  function cl(str){
      console.log('staI',str);
  }



  if( isAs == 'local' ){ 
  }else  if( isAs == 'devLocal' ){
   
  }else  if( isAs == 'devOT' ){
  }

  let pathToYss = path.join( nyssPath, 'yss');

  if( isAs == 'local' ){ 
      pathsToSites = [
        // node-yss / sites
        path.join( pathToYss, 'sites' ),

        // viteyss / sites
        path.resolve('./sites'),

        // if you have `~/.viteyss/sites
        path.join( process.env.HOME, '.viteyss', 'sites' ),
      ];

  }else  if( isAs == 'devLocal' ){ 
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
      doSSL = true; 
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


  var pathToSitesPackages = [];

  // sites ass a plugins `viteyss-site-`
  if( 1 ){
    pcNpmls();
    console.log("---------------------",
      "vysPlugins",vysPlugins
    );
    if( Object.keys( vysPlugins ).length > 0 ){
      Object.keys( vysPlugins ).forEach((pkey)=>{
        pathsToSites.push( vysPlugins[pkey].pathTo );
        // add path to sites from packages 
        let ptp = {
          "package":vysPlugins[pkey].package,
          "pathTo":vysPlugins[pkey].pathTo
        };
        pathToSitesPackages.push( ptp );
      });
    }
  }


  
  var config0 = {
    'https': doSSL,
    'name': instanceTitle,
    'HOST': '0.0.0.0',
    'PORT': 8080,
    'wsHOST': '0.0.0.0',
    'wsPORT': 2999,
    'pathToYss': pathToYss,//'/home/yoyo/Apps/oiyshTerminal/ySS_calibration',
    'pathsToSites': pathsToSites,
    "pathsToSitesPackages": pathToSitesPackages,
    //'wsInjection': false,
    'wsInjection': true,
    
    'sitesInjection': true,
    'ws': undefined,
    'wsPinger': false
  };

  if( config0.https == true ){
    config0['yssWSUrl'] = `wss://${hostPublicIp}:${config0.PORT}/fooWSS`;
  } else {
    // old ws way
    config0['yssWSUrl'] = `ws://${hostPublicIp}:${config0.wsPORT}`;
    
    // noService ws as websocket as plugin in vite
    //config0['yssWSUrl'] = `ws://${hostPublicIp}:${config0.PORT}/fooWSS`;

  }

  // vyArgs start
  if( 'vyArgs' in process.env )
    config0['vyArgs'] = process.env['vyArgs'];
  // vyArgs start END



  cl(["\n\n-[info]------------------\nHello - isAs:["+isAs+"] process name ["+instanceTitle+"]\n",
    "\n * dirname: ",__dirname,
    "\n * config: ",config0,
    "\n -------------------------------------------\n\n"
  ]);

  let sc0 = new serverContainerVite(0,config0 );
  sc0.initServers();
  sc0.startServer();


  cl("Done --- end");


}

export { Viteyss }