
import { vysPlugins, pcNpmls } from '../startItAsPluginColector.js'
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dirnameProcess = process.cwd();

//let debug = 'viteyssDebug' in process.env ? process.env.viteyssDebug:false;
let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;

class plugVector{

    constructor(){

        this.plugs = {};
        this.keys = [];

        this.isImporting = false;
        this.isImportingConut = 0;

        this.cbOnReady = undefined;

        this.tStartOfImprot = 0;

        this.cl('init ...')

    }

    setCbOnReady=( callBack )=>{
        this.cbOnReady = callBack;
    }

    cl=( str )=>{
        if(debug)console.log('pVec   ',str );
    }

    execReturn=( funcName, args )=>{

        //let tS = performance.now();
        //this.cl('----------------exec Return: '+funcName+` (  ${JSON.stringify(args)}  ) `);
        let res = undefined;
        //let p = undefined;
        
        //for( let i=0,ic=keys.length; i<ic; i++ ){
            //    p = this.plugs[ keys[i] ];
        
        for( let k of this.keys ){
            //p = this.plugs[ k ];
            //this.cl(`   plug name: ${keys[i]} `);
            res = this.plugs[ k ].o[ funcName ]( args );
            if( res != undefined )
               return res;

        }
        //let inSec = (performance.now() - tS)/1000.00;
        //this.cl(inSec+' sec.----------------exec Return result:  '+res);
        return res;
    }

    pathSolver=( pathIn )=>{
        let pathOuth = pathIn;
        let pathType = '';
        let fileLibOrg = pathIn;

        if( process.title.startsWith('local:') == true /*|| process.title == 'node'*/ ){
            pathType = 'local';
            //pathOuth = '../'+pathIn;
            //pathOuth = path.join( fs.realpathSync( __dirnameProcess) , pathIn );
            pathOuth = path.resolve( pathIn );
        } else if( process.title.startsWith('vysite:') == true ){
            pathType = 'vysite';
            pathOuth = path.join( fs.realpathSync( __dirname) , '../' , pathIn );
        
        }else{
            pathType = 'NAN:'+process.title;
        }

        if( debug )console.log(`---will import from path:
            now:            [${pathOuth}]
            org:            [${pathIn}]
            pathType:       [${pathType}]
            dirname :       [${__dirname}]
            dirnameProcess: [${__dirnameProcess}]
            process title:  [${process.title}]
            `);
        
        return pathOuth;
    }


    addFromFile = ( asName, fileLib ) => {
        this.isImportingConut++;
        this.isImporting = true;
        fileLib = this.pathSolver( fileLib );
        /*if( 1 ){
            console.log('resolve path --------------\n',
                `fileLib: ${fileLib}\n`,
                "resolve: "+ path.resolve( fileLib )+"\n",
                `title: ${process.title}\n`,
                `dirname: ${path.dirname('.')}\n`
                //"process.env: \n"+JSON.stringify(process.env,null,4)+"\n\n\n"
            );
        }

        let pathType = '';
        let fileLibOrg = fileLib;

        if( process.title.startsWith('local:') == true  ){
            pathType = 'local';
            //fileLib = '../'+fileLib;
            //fileLib = path.join( fs.realpathSync( __dirnameProcess) , fileLib );
            fileLib = path.resolve( fileLib );
        } else if( process.title.startsWith('vysite:') == true ){
            pathType = 'vysite';
            fileLib = path.join( fs.realpathSync( __dirname) , '../' , fileLib );
        
        }else{
            pathType = 'NAN:'+process.title;
        }

        console.log(`---will import from path:
            now:            [${fileLib}]
            org:            [${fileLibOrg}]
            pathType:       [${pathType}]
            dirname :       [${__dirname}]
            dirnameProcess: [${__dirnameProcess}]
            process title:  [${process.title}]
            proces title:   [${process.title}]`);
        */
        //process.exit(11);
        this.tStartOfImprot = Date.now();
        let tadd = this.addO;
        let trPromis = new Promise( (ok, noOk ) =>{        
            let {a} = import( fileLib ).then((o)=>{
                //console.log('------------------\n',o,'\n----------------');
                let po = new o[ Object.keys(o)[0] ]();
                if(debug)console.log('------------------\n',po,'\n----------------',`${(typeof po)}`);
                tadd( asName, po );
                this.onEmit_importDone();
                ok('loaded');
            }).catch(e=>{
                console.log('EE - when importing file ',fileLib,' error\n',e);
                noOk(e);
            });
            
        } );
        //console.log(' ->plug vector import ...');
        return trPromis;
    }

    onEmit_importDone = ( data='' ) => {
        this.isImportingConut--;
        if( this.isImportingConut == 0 ){
            this.isImporting = true;
            let tDelta = Date.now()-this.tStartOfImprot;
            console.log('[i] -> plug vector import DONE ALL ... '+tDelta+' ms.');
            if( this.cbOnReady ) this.cbOnReady();
        }
    }

    addO = ( asName, struct ) => {
        //this.cl(`addO `);this.cl( struct );
        this.plugs[ asName ] = {'o': struct};
        this.printPlugs(); 
    }

    populateByStruct=( struct )=>{
        for( let k of Object.keys(struct) )
            this.plugs[k] = struct[k]; 
        this.printPlugs();
    }

    populateByNpmPackage=( prefixToLook )=>{
        let res = pcNpmls( prefixToLook );
        for( let k of Object.keys(res) )
            this.plugs[k] = res[k]; 
        this.printPlugs();
    
    }

    printPlugs=()=>{
        this.keys = Object.keys( this.plugs );
        

        this.cl('So we have list of plugins :'); this.cl( this.plugs );
    }


}

//let p = new plugVector();
//p.populateByNpmPackage('viteyss-');


export { plugVector }