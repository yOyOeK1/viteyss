import { exec, execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

//let debug = 'viteyssDebug' in process.env ? process.env.viteyssDebug:false;
let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;
//debug = true;
var vysPlugins = {};
var vysPluginRuning = false;

function cl(str){
    console.log('plugCol: ',[str]);
}


//let vysPlugins_ = {};
function isItvySite( prefixToLook, pathTo, packageName ){
    let realp = fs.realpathSync( pathTo );
    
    if( packageName.startsWith( prefixToLook ) ){
        let pathTo = fs.realpathSync( path.join( realp, packageName) );
        try{
            if( debug ){

                console.log(
                    'pathTo         ', pathTo,'\t',
                    'packageName    ', packageName,'\t',
                    'realPath       ', realp,'\t'
                );
                console.log('add? ----------------');
            }
            vysPlugins[ packageName ] = {
                'o' : -1,
                //'pathTo': path.resolve( path.join( pathTo, packageName) ),
                'pathTo': pathTo,
                "package": JSON.parse(fs.readFileSync( path.join(pathTo, 'package.json')).toString()),
                "site": JSON.parse( fs.readFileSync( path.join(pathTo, 'site.json')).toString() ),
                'entryDate': Date.now()
            };
            
        }catch(e){
            console.error("\n\n[ERROR]          plugin in ["+pathTo+"]\n\nHave error : \n\n"+e+"---------------------------");
            process.exit(10);
        }
    }

}

function pcNpmls( prefixToLook = 'viteyss-site-', doVer = 1 ){
    if( debug )console.log('[pcNpmls##1]');
    console.log('* plugin npm list builder version: '+doVer);
    vysPluginRuning = true;
    //let pwdQ = execSync('pwd').toString();
    //cl(`pcNpmlist -- pwd: `+pwdQ);
    let isOk = false;
    let npmQ = -1
    let j = {};

    if( doVer == 1){
        try{
            npmQ = execSync('npm ls --depth=1 --json').toString();
            isOk = true;
        }catch(e){
            console.error('\n\nEE oiysh moment \n * npm ls crashed on us! \n * error is: \n\n',e,'\n\n\n-----------------------------------');
        }
        //cl(`pcNpmlist -- \n\nis OK ? (${isOk}) \n\nprefixTo: `+prefixToLook+'........ DONE\nnpmQ:\n'+npmQ );
   
        if( debug )console.log('[pcNpmls##2]', npmQ);
        try{
            j = JSON.parse( npmQ );
        } catch(e ){
            cl('npm list not json ',e,'\n\n',j);
        }
        if( debug )console.log('[pcNpmls##3]');
   
    }else if( doVer == 2 ){
        npmQ = [];
        let npmQ0 = execSync(`find -L ${prefixToLook}*/package.json 2>/dev/null || echo "-"`).toString().split('\n');
        npmQ0.forEach( n => n.length>5 ? npmQ.push( n ):'' );
        let npmQ2 = execSync(`find -L ./node_modules/${prefixToLook}*/package.json 2>/dev/null || echo "-"`).toString().split('\n');
        npmQ2.forEach( n => n.length>5 ? npmQ.push( n ):'' );
        if( debug ) console.log('------------------------------\n\n',npmQ,{npmQ0,npmQ2},'\n\n----------');
        
    }


    if( npmQ == -1 ){
        console.error('EE - problem with npm list in process of looking for plugins viteyss-site-\n',
            `run # npm ls --depth=2 --json\nto see if it's not trowing any errors.`
        );
        process.exit(-2);
    }

    

    
    if( debug )console.log('[pcNpmls##4]');
    
    
    if( doVer == 1 ){
        Object.keys(j.dependencies).forEach(k0 => {
            //    cl(`   - dirName: ${k0}`);
            isItvySite(prefixToLook,  'node_modules', k0 );
            if( j.dependencies[k0].dependencies ){
                Object.keys(j.dependencies[k0].dependencies).forEach(k1 => {
                    isItvySite( prefixToLook, 'node_modules', k1 );
                });
            }
        });

    }else if( doVer == 2 ){
        for( let pe of npmQ ){
            let pacAdd = pe.split('/');
            let pacName = pacAdd[ pacAdd.length - 2 ]; 
            isItvySite( prefixToLook, 'node_modules', pacName);
        }
        //process.exit(11);

    }

    if( debug )console.log('[pcNpmls##5]',vysPlugins);
    vysPluginRuning = false;
    return 1;
}

//pcNpmls();
export { vysPlugins, pcNpmls, vysPluginRuning };
//cl("DONE pluging exploration ...........");