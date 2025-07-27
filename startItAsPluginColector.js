import { exec, execSync } from 'child_process'
import path from 'path'


var vysPlugins = {};

function cl(str){
    console.log('plugCol: ',str);
}



function pcNpmls(){
    let npmQ = execSync('npm ls --depth=1 --json').toString();
    
    let j = {};
    try{
        j = JSON.parse( npmQ );
    } catch(e ){
        console.error('npm list not json ',e,'\n\n',j);
    }


    //let vysPlugins_ = {};
    function isItvySite( pathTo, packageName ){
        if( packageName.startsWith('viteyss-site-') ){
            vysPlugins[ packageName ] = {
                'o' : -1,
                'pathTo': path.resolve( path.join( pathTo, packageName) ),
                'entryDate': Date.now()
            };
            /*
            console.log(packageName);
            await import(packageName).then((m)=>{ //cl('import done!'); cl(m);
                vysPlugins[ packageName ]['o'] = m;
            });
            */
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


    //cl(`-----------------------
    //    after run in npm we have (${Object.keys(vysPlugins).length}) plugins:\n\t\t`+
    //    Object.keys(vysPlugins).join(', ')+'\n\n'+JSON.stringify(vysPlugins)
    //);
    //console.log(vysPlugins);
    //setTimeout(()=>{
        
    //},500);
    //console.log('-------------------',JSON.stringify(j));
    /*
    try {
        const dependencyTree = JSON.parse(stdout);
        console.log(dependencyTree);
        // You can now programmatically access and process the dependencyTree object
        // For example, to list direct dependencies:
        if (dependencyTree.dependencies) {
        console.log('Direct Dependencies:');
        for (const packageName in dependencyTree.dependencies) {
            console.log(`- ${packageName}@${dependencyTree.dependencies[packageName].version}`);
        }
        }
    } catch (parseError) {
        console.error(`Error parsing JSON: ${parseError}`);
    }
    */
    
}

pcNpmls();
export { vysPlugins };
cl("DONE pluging exploration ...........");