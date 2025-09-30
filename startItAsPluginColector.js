import { exec, execSync } from 'child_process'
import path from 'path'
import fs from 'fs'


var vysPlugins = {};
var vysPluginRuning = false;

function cl(str){
    console.log('plugCol: ',str);
}



function pcNpmls( prefixToLook = 'viteyss-site-' ){
    vysPluginRuning = true;
    let pwdQ = execSync('pwd').toString();
    cl(`pcNpmlist -- pwd: `+pwdQ);
    let npmQ = execSync('npm ls --depth=1 --json').toString();
    cl(`pcNpmlist -- prefixTo: `+prefixToLook+'........ DONE');
    
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
                console.log(
                    'pathTo         ', pathTo,'\t',
                    'packageName    ', packageName,'\t',
                    'realPath       ', realp,'\t'
                );
                console.log('add ----------------');
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
        cl(`   - dirName: ${k0}`);
        isItvySite( 'node_modules', k0 );
        if( j.dependencies[k0].dependencies ){
            Object.keys(j.dependencies[k0].dependencies).forEach(k1 => {
                cl(`        - ${k1}`);
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