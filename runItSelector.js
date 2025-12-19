import path from 'node:path';
import { Viteyss } from './startItAs.js';
import fs from 'fs';


const args = process.argv.slice(2); // Skip the first two elements
console.log('Viteyss - run it selector\n  * all arguments:', args,'\n\n\n');

let nodeVerMin = 20;

// node version test .....
let nodeV = process.version.replaceAll('v','').split('.');
if( nodeV.length != 3 ){
    console.error(`EE - node version is [${process.version}]\n  - expecting 3 dots... version [example v20.19.6]`);
    process.exit(-1);
}else{
    if( parseInt(nodeV[0]) >= nodeVerMin ){

    }else{
        console.error(`EE - node version no low expect v${nodeVerMin}.x.x or newer. Have [${process.version}]`);
        process.exit(-2);
    }
}


if( args.length == 0 ){
    console.log(`  - select Default [ localhost - vanila - no ssl :8080 ]`);
    process.env['viteyss'] = JSON.stringify({
        runIt: true,
        name: 'local'
    });




// 2qest start
}else if( args.length == 2 && args[0] == '--site=2qest' ){
    console.log(`  - select -site-2qest [ localhost - vanila - no ssl :8080 ]`);    
    let flist = args[1].replaceAll('--files=','').split('\n');
    if( flist.length == 0 ){
        console.log('no --files= or files with space separation found');
        process.exit(-2);
    }
    let qest = {files:[],dirs:[],fInfos:[]};
    flist.forEach( f => {
        if ( f.length > 5 ){
            let src = f;
            while( src.startsWith(' /') && src.length > 5 ){
                src = src.substring(1);
            }
            qest.files.push( src );
            qest.dirs.push( path.dirname( src ));
            let fInfo = -1;

            try{
                fInfo = fs.statSync( src );                
            }catch(e){
                console.log('EE file info no',e);
            }
            qest.fInfos.push( fInfo );
        }
    });
    console.log('have files',JSON.stringify(qest,null,4));
    //process.exit(-1);
    
    process.env['vyArgs'] = JSON.stringify({ name: '2qest', 'payload': qest,
        fsAllow: qest.dirs
    });
    process.env['viteyss'] = JSON.stringify({
        runIt: true,
        name: 'local',
    });
// 2qest END


}else if( args.length == 1 && args[0] == 'devLocal' ){
    console.log(`  - select [ devLocal ]`);
    process.env['viteyss'] = JSON.stringify({
        runIt: false,
        name:'devLocal'
    });

}else{
    console.info(`II Unknown arguments.. try:\n  * no arguments\n  * 'devLocal' `);
    process.exit(1);
}








if( 'viteyss' in process.env ){

    let viteyss = Viteyss();

}

