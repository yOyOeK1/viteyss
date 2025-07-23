
import { serverContainerVite } from './serverContainerVite.js'
import nyss from "node-yss";
import path from 'path';



function cl(str){
    console.log('staI',str);

}

var config0 = {
    'name': "bigOne",
    'HOST': '0.0.0.0',
    'PORT': 8080,
    'wsHOST': '0.0.0.0',
    'wsPORT': 2999,
    'pathToYss': '/home/yoyo/Apps/oiyshTerminal/ySS_calibration',
    'pathsToSites': [
      '/home/yoyo/Apps/oiyshTerminal/ySS_calibration/sites',
      path.resolve('./sites')
    ],    
    //'wsInjection': false,
    'wsInjection': true,
    'yssWSUrl': `ws://localhost:2999/`,
    
    'sitesInjection': true,
    'ws': undefined,
    'wsPinger': true
};




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