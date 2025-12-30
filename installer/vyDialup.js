import { spawn } from 'node:child_process';
import { time } from 'node:console';
import fs from 'fs';
import readline from 'node:readline';
import { vyrepos } from './vyDialup_repos.js';



console.log(`# running with args [${process.argv}]`);

let fakeGitPull = true;
if( process.argv.length == 3 && process.argv[2] == '--runReal' ){
    console.log(`# RUNNING REALD CMDS MODE !!! #`);
    fakeGitPull = false;
}




const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
/*
rl.question(`What's your name?`, name => {
  console.log(`Hi ${name}!`);
  rl.close();
});
*/

function processStdout( rl ){
    let stdInt = parseInt( stdOut );
    console.log('process ['+stdOut+'] stdInt['+stdInt+'] '+(typeof stdInt)+" is["+(stdInt>=0)+"]");
   
    if( stdInt >=0 &&  stdInt < myOpts.propmpt.length ){
        //rl.close();
        return myOpts.defRes(  stdInt );
    }
    // if( stdOut == '' || stdInt == 'NaN' || stdInt == NaN ){
    cl( myOpts.title, myOpts.msg, myOpts.propmpt, myOpts.defRes );
    //}
}


let myOpts = {};
let stdOut = '';
function cl( title, msg = [] , propmpt=[],defRes=undefined ){
    myOpts = { title, msg, propmpt, defRes };
    console.log(`#\n# ${title}\n#\n# ${msg.join('\n# ')}\n#:`);
    let i = 0;
    for( let l of propmpt ){
        console.log(` ${i++}. ${l}`);
    }
    
    if( defRes ){        
        rl.question(`?`, res => {
            //rl.close();            
            stdOut = res;
            processStdout( rl );           
         });
    }

}

function mainMane(){
    cl('Hello in vy Dial up js', ['Do you want to chceck repositories?'],
        ['yes','no','exit'],( r )=>{
            console.log('got ['+r+']');

            if( r == 1 || r == 2 ) process.exit(0);
            else if( r == 0 ) readyLocalRepoList();

        }
    );
}



function readyLocalRepoList(){
    console.log('# reading local repolitory list');

    let rNames = [];
    vyrepos.forEach(r=>{
        rNames.push( r.name );
    });
    console.log(`# have [${vyrepos.length}] repositories. [ ${rNames.join(' ] , [ ')} ]`);

    
    cl('In repositories', ['List of basic operations'],
        ['exit', 'load all', 'update one', 'update all', 'install new'],( r )=>{
            console.log('got ['+r+']');

            if( r == 0 ) process.exit(0);
            else if( r == 1 ) repoLoadAll();
            else if( r == 2 ) updateApp_dialog();
            else if( r == 3 ) updateAppsAll();
            else if( r == 4 ) installNew_dialog();

        }
    );
}





function gitCloneRepo( dirPath, gitUrl, cbOnExit ){
    let cmd = `echo "# OK";
        cd ../sharelibs/src
        echo "clone repo ...${gitUrl} in [ \`pwd\` ]"
        
        git clone "${gitUrl}"
        cd ../../installer
        `;
    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => console.log(`#BASH.out: ${d}`));
    sp.on('close', exitCode => {
        cbOnExit( exitCode );
    });
    sp.stdin.end();
}

function readGitRepoInfo( repo ){
    let fPath = `../sharelibs/src/${repo.name}/vyDialup_repos.js`
    console.log(`# read git repo .... [ ${repo.name} ]`);
    let jsStr = fs.readFileSync( fPath ).toString();
    let j = JSON.parse(jsStr);
    return j.apps;
    let tr = [];
    for( let app of j.apps )
        tr.push({"name":app});
    return tr;
}


function chkSiteStatus( siteName ){
    let dirIs = false;
    let insIs = false;
    let pwd = process.cwd();

    dirIs = fs.existsSync( `${pwd}/../../${siteName}` );
    insIs = fs.existsSync( `${pwd}/../node_modules/${siteName}` );

    return { dirIs, insIs };
}



let appsToUpdate = [];
let appsCanInstall = [];
function repoLoadAll(){
    console.log('# In repositiories - list all \n#   pwd['+process.cwd()+']');
    let pwd = process.cwd();
    let appNo = 0;
    let repoCloning = 0;



    function chkCloneStack(){
        if( repoCloning == 0 ){
            console.log('# clone stack is 0 GOGO ....');
            readyLocalRepoList(); 
            repoCloning--;           
        }
    }


    appsToUpdate = [];
    appsCanInstall = [];
    
    for(let repo of vyrepos){

        if( repo.apps != undefined ){
            //console.log('repo.app-> ',repo.apps);
            for( let app of repo.apps ){
                repoCloning++;
                
                //let dirIs = fs.existsSync( `${pwd}/../../${repo.sufix}${app.name}` );
                //let insIs = fs.existsSync( `${pwd}/../node_modules/${repo.sufix}${app.name}` );
                let { dirIs, insIs } = chkSiteStatus( `${repo.sufix}${app.name}` );

                //console.log( `[${appNo++}] d:[${dirIs?'1':'0'}] i:[${insIs?'1':'0'}]  ${app.name}     ... ${repo.name}` );

                if( dirIs && insIs ){
                    appsToUpdate.push( {
                        'name':repo.sufix+app.name,
                        'repo': repo,
                        'fullPath':`${pwd}/../../${repo.sufix}${app.name}`} );
                }





                repoCloning--;

            }
        
        }else{
            repoCloning++;
            let repoPath =  `${pwd}/../sharelibs/src/${repo.name}`;
            let repDirIs = fs.existsSync( repoPath );
            console.log(`# dir of repo ${repDirIs}\n#  path [ ${repoPath} ]`);

            if( !repDirIs ){
                gitCloneRepo( repoPath, repo.giturl, exitCode =>{
                    let res = readGitRepoInfo( repo );
                    repo.apps = res;
                    console.log(`# nice exit: [${exitCode}] repoCloningStack:`,repoCloning,
                        'res:',res
                    );
                    repoCloning--;
                    chkCloneStack();
                } );
            }else{
                let res = readGitRepoInfo( repo );
                repo.apps = res;
                //console.log('res2: ',res, ' repoCloning:',repoCloning);
                repoCloning--;
                chkCloneStack();
            }


        }

    }

    chkCloneStack();

}


function installNew_dialog(){
    let opts = ['back'];
    let optsJ = [''];
    console.log('apps appsCanInstall now ',appsCanInstall);
    for( let repo of vyrepos){
        let appInd = 0;
        for( let app of repo.apps ){
            let {dirIs,insIs} = chkSiteStatus( repo.sufix+app.name );

            if( !insIs ){
                opts.push( `${app.name}     ... . .    ${repo.name}` );
                optsJ.push( {appname: app.name, appInd: appInd, dirIs, insIs, repo: repo} );
            }
            appInd++;
        }
    }

     cl('In repositories - install', ['Installatio is posible on'],
        opts,( r )=>{
            console.log('got ['+r+']')
            if( r == 0 ) readyLocalRepoList();//process.exit(0);
            else installApp( optsJ[ r ] );

        }
    );
}

function installApp( appHandle ){
    
    console.log(`# will install [ ${appHandle.appname} ] from [ ${appHandle.repo.name} ]`,
        `\ndebug: \n',${JSON.stringify(appHandle,null,4)} ]`
    );

    let app = appHandle.repo.sufix+appHandle.appname;
    let appData = appHandle.repo.apps[ appHandle.appInd ];

    let cmd = '';

    if( appData.type == 'site' ){
        cmd = `echo "# OK";
            cd ../../
            echo "# working installing... in [ pwd: \`pwd\` ]"
            `;
        if( fakeGitPull ){
            cmd+= `echo '# fake  $[o.O]# TRUE install ... in 1';sleep 1;`;
            if( !appHandle.dirIs )
                cmd+= `echo '# fake   git clone "${appData.url}" '\n`;
            else 
                cmd+= `echo '# fake   skip clone ..... is in place '\n`;

            cmd+= `echo '# fake   cd ${app}; npm install; cd ../viteyss; npm install ../${app}; working ....\n# working ....\n# working ....\n# work DONE\n'\n`;
        
        }else{
            cmd+= `echo "will install [${app}] .... in 5";sleep 5;`;
            if( !appHandle.dirIs )
                cmd+= `git clone"${appData.url}"; `;
            else 
                cmd+= `echo '# skip clone ..... is in place '\n`;

            cmd+= `cd ${app}; npm install; cd ../viteyss; npm install ../${app};\n`;
        }
        cmd+= `echo "# install [ ${app} ] DONE"
            `;

    } else{
        console.log('EE unknown type of intsallation ',appData);
        process.exit(-1);
    }
    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => console.log(`#BASH.out: ${d}`));
    sp.on('close', exitCode => {
        //cbOnExit( exitCode );
        if( exitCode == 0 ){
             installNew_dialog();
        }else{
            console.log('EE installation exit with ',exitCode);
            process.exit(exitCode);
        }
    });
    sp.stdin.end();



}



function updateApp_dialog(){

    let opts = ['back'];
    for( let app of appsToUpdate)
        opts.push( app.name );

     cl('In repositories - update', ['Update is posible on this apps'],
        opts,( r )=>{
            console.log('got ['+r+']');

            if( r == 0 ) readyLocalRepoList();//process.exit(0);
            else updateApp( opts[r] );

        }
    );


}

let updatingAppNow = undefined;
function updateAppsAll(){
    let uList = [];
    for( let app of appsToUpdate ){
        uList.push( app.name );
    }
    console.log(`# will update list: [ ${uList.join(', ')} ]`);
    updatingAppNow = 0;
    let exitCode = updateAppAll_no( 0 );

    console.log(`# update list: exit:${exitCode}`);
}


function updateAppAll_no( noUpdateApp ){
    
    if( noUpdateApp < appsToUpdate.length ){
        console.log(`# * app on list [ ${appsToUpdate[ noUpdateApp ].name} ]`);
        updateApp( appsToUpdate[ noUpdateApp ].name, ec => {
            updateAppAll_no( noUpdateApp+1 );
        } );
    }else{
        console.log(`# end of list `);
        console.log(`# Nice let's go back...`);
        setTimeout(()=> readyLocalRepoList(), 1000 );
    }
    return 0;
}


function updateApp( app, cbOnExitCode = undefined ){
    console.log(`# will update [ ${app} ] ....`);
    let cmd = `echo "# OK"        
        cd "../../${app}"
        echo "# working ... in [ pwd: \`pwd\` ]"
        `;
    if( fakeGitPull ){
        cmd+= `echo -n '# fake $[o.O]# TRUE git pull\n# working ....\n# working ....\n# working ....\n# work DONE\n'\n`;
    }else{
        cmd+= `echo "will git pull in 5";sleep 5;git pull;\n`;
    }
    cmd+= `echo "# update [ ${app} ] DONE"
        `;
    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => console.log(`#BASH.out: ${d}`));
    sp.on('close', exitCode => {
        //cbOnExit( exitCode );
        if( exitCode == 0 ){
            if( cbOnExitCode )
                cbOnExitCode( exitCode );
            else
                updateApp_dialog();
        }else{
            console.log('EE update exit with ',exitCode);
            process.exit(exitCode);
        }
    });
    sp.stdin.end();


}




//mainMane();
//readyLocalRepoList();
repoLoadAll();