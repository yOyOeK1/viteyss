import { exec, execSync } from 'child_process'
import path from 'path'


var vysPlugins = {};

function cl(str){
    console.log('plugCol: ',str);
}



function pcNpmls( prefixToLook = 'viteyss-site-' ){
    let npmQ = execSync('npm ls --depth=1 --json').toString();
    
    let j = {};
    try{
        j = JSON.parse( npmQ );
    } catch(e ){
        console.error('npm list not json ',e,'\n\n',j);
    }


    //let vysPlugins_ = {};
    function isItvySite( pathTo, packageName ){
        if( packageName.startsWith( prefixToLook ) ){
            vysPlugins[ packageName ] = {
                'o' : -1,
                'pathTo': path.resolve( path.join( pathTo, packageName) ),
                'entryDate': Date.now()
            };
          
        }

    }
    
    
    Object.keys(j.dependencies).forEach(k0 => {
        //cl(`   - ${k0}`);
        isItvySite( 'node_modules', k0 );
        if( j.dependencies[k0].dependencies ){
            Object.keys(j.dependencies[k0].dependencies).forEach(k1 => {
            //    cl(`        - ${k1}`);
                isItvySite( 'node_modules', k1 );
            });
        }
    });

    return vysPlugins;
}

//pcNpmls();
export { vysPlugins, pcNpmls };
//cl("DONE pluging exploration ...........");