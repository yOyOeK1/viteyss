
import { vysPlugins, pcNpmls } from '../startItAsPluginColector.js'
import path from 'path';


class plugVector{

    constructor(){

        this.plugs = {};
        this.keys = [];


        this.cl('init ...')

    }

    cl( str ){
        console.log('pVec   ',str );
    }

    execReturn( funcName, args ){

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

    addFromFile( asName, fileLib ){
        if( 0 ){
            console.log('resolve path --------------\n',
                `fileLib: ${fileLib}\n`,
                "resolve: "+ path.resolve( fileLib )+"\n",
                `title: ${process.title}\n`,
                `dirname: ${path.dirname('.')}\n`
                //"process.env: \n"+JSON.stringify(process.env,null,4)+"\n\n\n"
            );
        }

        if( process.title == 'node-red' ){

            fileLib = '../'+fileLib;
        }else{
            fileLib = path.resolve( fileLib );
        }


        let {a} = import( fileLib ).then((o)=>{
            console.log('------------------\n',o,'\n----------------');
            let po = new o[ Object.keys(o)[0] ]();
            console.log('------------------\n',po,'\n----------------',`${(typeof po)}`);
            this.addO( asName, po );
        });

    }

    addO( asName, struct ){
        //this.cl(`addO `);this.cl( struct );
        this.plugs[ asName ] = {'o': struct};
        this.printPlugs(); 
    }

    populateByStruct( struct ){
        for( let k of Object.keys(struct) )
            this.plugs[k] = struct[k]; 
        this.printPlugs();
    }

    populateByNpmPackage( prefixToLook ){
        let res = pcNpmls( prefixToLook );
        for( let k of Object.keys(res) )
            this.plugs[k] = res[k]; 
        this.printPlugs();
    
    }

    printPlugs(){
        this.keys = Object.keys( this.plugs );
        

        this.cl('So we have list of plugins :'); this.cl( this.plugs );
    }


}

//let p = new plugVector();
//p.populateByNpmPackage('viteyss-');


export { plugVector }