
import { serverContainerVite } from './serverContainerVite.js'
import { vysPlugins, pcNpmls } from './startItAsPluginColector.js'
import nyss from "node-yss";
import path from 'path';

let pathNodeYss = path.join( nyss.telMeYourHome(`viteyss - startItAsDev.js`),"yss" );

function cl(str){
    console.log('staI',str);

}


var pathsToSites = [
    // dev 
    '/home/yoyo/Apps/oiyshTerminal/ySS_calibration/sites',

    // node-yss / sites
    //path.join( pathNodeYss, 'sites' ),

    // viteyss / sites
    path.resolve('./sites'),

    // if you have `~/.viteyss/sites
    path.join( process.env.HOME, '.viteyss', 'sites' ),
];

// sites ass a plugins `viteyss-site-`
if( 1 ){
  pcNpmls();
  console.log("---------------------",
    "vysPlugins",vysPlugins
  );
  if( Object.keys( vysPlugins ).length > 0 ){
    Object.keys( vysPlugins ).forEach((pkey)=>{
      pathsToSites.push( vysPlugins[pkey].pathTo );
    });
  }
}


var hostPublicIp = '192.168.43.220';
var config0 = {
  'https': true,
  'name': "bigOne",
  'HOST': '0.0.0.0',
  'PORT': 8080,
  'wsHOST': '0.0.0.0',
  'wsPORT': 2999,
  'pathToYss': '/home/yoyo/Apps/oiyshTerminal/ySS_calibration',
  'pathsToSites': pathsToSites,
  //'wsInjection': false,
  'wsInjection': true,
  
  'sitesInjection': true,
  'ws': undefined,
  'wsPinger': true
};

if( config0.https == true ){
  config0['yssWSUrl'] = `wss://${hostPublicIp}:${config0.PORT}/fooWSS`;
} else {
  // old ws way
  config0['yssWSUrl'] = `ws://${hostPublicIp}:${config0.wsPORT}`;
  
  // noService ws as websocket as plugin in vite
  //config0['yssWSUrl'] = `ws://${hostPublicIp}:${config0.PORT}/fooWSS`;

}


cl("Hello - As Dev");


let sc0 = new serverContainerVite(0,config0 );
sc0.initServers();
sc0.startServer();


/*
config1 = JSON.parse(JSON.stringify(config0));;
config1.name = 'small';
config1.HOST = 'localhost';
config1.PORT = 8080;
config1.wsHOST = 'localhost';
config1.wsPORT = 2999;
config1.pathToYss = path.join( nyss.telMeYourHome(`serverHttp ${config1.HOST}:${config1.PORT}`),"yss" );
config1.pathsToSites = [ path.join( config1.pathToYss, 'sites' ) ]; // add more locations
config1.yssWSUrl = `ws://localhost:2999/`;
let sc1 = new serCon.serverContainer( 1, config1 );

sc1.initServers();
sc1.startServer();
cl(`Open web browser at: http://${config1.HOST}:${config1.PORT}`);
*/

cl("Done --- end");