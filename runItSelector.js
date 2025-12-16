import { Viteyss } from './startItAs.js';


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
    process.env['viteyss'] = {
        runIt: true,
        name: 'local'
    };

}else if( args.length == 1 && args[0] == 'devLocal' ){
    console.log(`  - select [ devLocal ]`);
    process.env['viteyss'] = {
        runIt: false,
        name:'devLocal'
    };

}else{
    console.info(`II Unknown arguments.. try:\n  * no arguments\n  * 'devLocal' `);
    process.exit(1);
}


if( 'viteyss' in process.env ){

    let viteyss = Viteyss();

}

