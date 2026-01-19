process.env['viteyssDebug'] = false;




import { Viteyss, vyConfigBuilder, vyAddPlugins} from './startItAs.js';
import { plugVector } from './libs/plugVector.js';


let args = process.argv.slice(2); // Skip the first two elements
console.log('[@@] Viteyss - run it selector\n* all arguments:', args);

let argvPv = new plugVector();
let nodeVerMin = 20;
let envviteyss = {};
let isAs = 'localNOTSETERR';
let config0 = undefined;
let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;


// args parser START
let argsOptsParse = ( argv ) =>{
    let tr = {};
    for(let arg of argv ){
        if( arg.startsWith('--') && arg.indexOf('=')>0 ){
            let aTmp = arg.substring(2).split('=');
            if( aTmp.length !=2 ){
                console.log(`EE argv [ ${arg} ] is wrong exiting`);
                process.exit(10);
            }
            tr[ aTmp[0] ] = aTmp[1];
        }
    }

    return tr;
};

let argsOpts = argsOptsParse( args );
if( argsOpts != {} ) args = [];
if( 'debug' in argsOpts ){
    console.log('[i] running as --debug=1')
    debug = true;
    process.env.viteyssDebug = true;
}
config0 = {argsOpts};
//console.log('argsOpts set config0 to ',config0);

// args parser END 



let argsOptsHelpList= [
    '--help=1', 'this argsOpts help list of possible actions ... ',
    '','',
    '--stop=1', 'to stop befor executing main viteyss',
    '--runUpToStartServer=1', 'to stop before starting http server listen',
    '--npmPlugDoVer=2', 'method how it looks for plugins: \n #\t\t1 - use npm list --depth ; \n #\t\t2 - use bash find (faster) !1.2sec',
    '','',
    '--yssSites=0', 'to disable node-yss / sites look up to speed up reboot',
    '--viteyssSites=0', 'to disable viteyss / sites look up to speed up reboot',
    '--homeSites=0', 'to disable ~/.viteyss / sites look up to speed up reboot',
    '','',
    '--debug=1', 'to enable debuging, make all console'
];

if( 'help' in argsOpts ){
    console.log(`[h] help from - viteyss running as --help=1\n # `);
    for( let h=0,hc=argsOptsHelpList.length; h<hc; h+=2 )
        console.log(` #  ${argsOptsHelpList[ h ]} - ${argsOptsHelpList[ h+1 ]}`);
    //process.exit(0);
}






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








let loadPluginsArgs = ( cbonTestResultsReady ) => {
   
    let apC = 0;
    let pendings = [];
    let pRes = 0;

    let onPlugVecReady = () => {
        console.group('[@] execReturn from plugins:');
        let envvyRes = argvPv.execReturn('handleRequestArgv',argsOpts);
        console.groupEnd();
        if( envvyRes != undefined ){
            if( envvyRes.then && envvyRes.then == 'function ' ){
                envvyRes.then((r)=>{ console.log('#envvyRes2'/*,r*/); } );

            }else{
                if( debug ) console.log('#envvyRes1', envvyRes);
                cbonTestResultsReady( 'res1', envvyRes );
                apC = -1;

            }
        }

        if( debug ){ console.log('#envvyRes3', envvyRes); console.groupEnd(); }
        //cbonTestResultsReady('res3',envvyRes);
        pRes++;
        if( pRes == apC )
            cbonTestResultsReady( 'allDoneNoResult', envvyRes );
    };

   argvPv.setCbOnReady( onPlugVecReady );

    for(let sp of config0.pathsToSitesPackages){
        if( 'argvParser' in sp.site ){
            apC++;
            pendings.push( argvPv.addFromFile( 
                `${sp.site.dir}`, 
                `${sp.pathTo}/${sp.site.argvParser}` 
            ));
            
        }
    }
    
    if( apC == 0 )
        return [1,'no plugins for argv'];
    else{
        console.log(`       .... loading in total (${apC})`);
        return [0,'loading', apC, pendings];
    }

};





let viteyssRunIt = ( config0, envviteyss ) =>{
    //if( 'viteyss' in process.env ){
    if( envviteyss != {} ){
        if( envviteyss != {} ) config0['vyArgs'] = envviteyss;
        //config0['argsOpts'] = argsOpts;


        

        console.log('EXEC VITEYSS ....');
        //process.exit(55);

        if( 'stop' in argsOpts || 
            'help' in argsOpts
        ){ console.log('[i] arg --stop or --help was used; So Stop...'); process.exit(0);}
       

        let viteyss = Viteyss( config0 );
        console.log('[@@] Viteyss instance ... started',
            //viteyss
            );

    }else{
        console.log('exit: runItSelector don\'t know what to do');
    }
};










//debugger

//console.log('---------------------- argvPv test end');
//process.exit( 99);


let startedAllready = false;

if ( argsOpts != {} ){
    isAs = 'local'
    config0 = vyConfigBuilder( argsOpts, config0, isAs );
    config0 = vyAddPlugins( config0 );
    console.log('* args plugins ..... found '+config0['pathsToSitesPackages'].length);
    
    
    //console.log(`[i] do day do argvParsers:`);
    startedAllready = true;
    let plugsLoadResult = 'working ...';
    let plugsLoadStart = Date.now();

    let watDogPlu = setInterval(()=>{
        let tDelta = Date.now()-plugsLoadStart;
        console.log(`[watchdog] args plugins loading ....[ ${plugsLoadResult} ]? `+tDelta+'ms.');

        if( plugsLoadResult == 'done' )
            clearInterval( watDogPlu );

        if( tDelta > 5000 ){
            console.log('[watchdog] args plugins @ its too loong ....');
        }
    },500);


    let onLoadPluginsArgsDone = ( resNo, envvyResTest) =>{
        if( resNo == 'res1' ){
            console.log(`   NICE ! argv done by plugin ....`);
            plugsLoadResult = 'done';
            
            // starting vityess 
            viteyssRunIt( config0, envvyResTest );
            return 1;
        }else if( resNo == 'allDoneNoResult' ){
            plugsLoadResult = 'done';
            viteyssRunIt( config0, { runIt: true, name: 'local' } );
            return 0;
        }else{
            console.log(`   NICE ! NO argument done by plugins`);
            plugsLoadResult = 'done';
            //viteyssRunIt( config0,  { runIt: true, name: 'local' } );
            //return 0;
        }

    };
    let lpARes = loadPluginsArgs( onLoadPluginsArgsDone );
    console.log(`       .... loadPluginsArgs ends with result:\n\t`,lpARes);
    


}
/*else if( args.length == 0 ){
    console.log(`* select Default [ localhost - vanila - no ssl :8080 ]`);
    //process.env['viteyss'] 
    envviteyss = { runIt: true, name: 'local' };
    isAs = 'local';

} else if( args.length == 1 && args[0] == 'devLocal' ){
    console.log(`* select config [ devLocal ]`);
    //process.env['viteyss']
    isAs = 'devLocal';
    envviteyss = { runIt: false, name:'devLocal' };

}
*/



if( !startedAllready ){    
    console.log('[i] default init ... no args took over init sequenc debug: ['+debug+']',(typeof debug));
    config0 = vyConfigBuilder( argsOpts, config0, isAs );
    if( debug ) console.log( 'vyConfig build isAs',isAs, debug );

    config0 = vyAddPlugins( config0 );    
    console.log('* plugins ..... found '+config0['pathsToSitesPackages'].length);
    // starting vityess
    viteyssRunIt( config0, envviteyss );

}else{
    console.log('[i] default init interrupted ... plugins to the things ....');
}




//}else{
//    console.info(`II Unknown arguments.. try:\n  * no arguments\n  * 'devLocal' `);
    //process.exit(1);
//}








