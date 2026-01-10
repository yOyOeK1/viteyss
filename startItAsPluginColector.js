import { exec, execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

let debug = 'viteyssDebug' in process.env ? process.env.viteyssDebug:false;
//debug = true;
var vysPlugins = {};
var vysPluginRuning = false;

function cl(str){
    console.log('plugCol: ',[str]);
}



function pcNpmls( prefixToLook = 'viteyss-site-' ){
    vysPluginRuning = true;
    //let pwdQ = execSync('pwd').toString();
    //cl(`pcNpmlist -- pwd: `+pwdQ);
    let isOk = false;
    let npmQ = -1
    try{
        npmQ = execSync('npm ls --depth=1 --json').toString();
        isOk = true;
    }catch(e){
        console.error('\n\nEE oiysh moment \n * npm ls crashed on us! \n * error is: \n\n',e,'\n\n\n-----------------------------------');
    }
    //cl(`pcNpmlist -- \n\nis OK ? (${isOk}) \n\nprefixTo: `+prefixToLook+'........ DONE\nnpmQ:\n'+npmQ );
    
    if( npmQ == -1 ){
        console.error('EE - problem with npm list in process of looking for plugins viteyss-site-\n',
            `run # npm ls --depth=2 --json\nto see if it's not trowing any errors.`
        );
        process.exit(-2);
    }

    let j = {};
    try{
        j = JSON.parse( npmQ );
    } catch(e ){
        cl('npm list not json ',e,'\n\n',j);
    }


    //let vysPlugins_ = {};
    function isItvySite( pathTo, packageName ){
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
    
    
    
    Object.keys(j.dependencies).forEach(k0 => {
    //    cl(`   - dirName: ${k0}`);
        isItvySite( 'node_modules', k0 );
        if( j.dependencies[k0].dependencies ){
            Object.keys(j.dependencies[k0].dependencies).forEach(k1 => {
    //            cl(`        - ${k1}`);
                isItvySite( 'node_modules', k1 );
            });
        }
    });

    vysPluginRuning = false;
    return 1;
}

//pcNpmls();
export { vysPlugins, pcNpmls, vysPluginRuning };
//cl("DONE pluging exploration ...........");