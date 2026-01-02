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


let myOpts = {};
let stdOut = '';
let termSize = [40,10];
let defWaitTime = 5;
chkTerminalSize();



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





function clMkRow(charOf='='){
    console.log( "# "+
        new Array( termSize[0]-2 ).fill( charOf ).join('')
    );
}


function chkTerminalSize(){
    runcmd( 'tput cols', ec => {},( l )=>{
        termSize[0] = parseInt(l);       
        //console.log('# tput cols: ['+l+'] termSize is ',termSize); 
    }, false );
    runcmd( 'tput lines', ec => {},( l )=>{
        termSize[1] = parseInt(l);       
        //console.log('# tput lines: ['+l+'] termSize is ',termSize); 
    }, false );

}


function mkCmdPreview( cmd ){
    clMkRow("#");
    console.log('# cmd preview  START\n',
        cmd,
        '\n# cmd preview  END');
    clMkRow("#");
}

function cl( title, msg = [] , propmpt=[],defRes=undefined ){
    myOpts = { title, msg, propmpt, defRes };
    chkTerminalSize();


    let topBar = `Fake:[${fakeGitPull}] | `;
    if( fakeGitPull ) topBar+= ' to run for real fur from "npm run vyDialup" or with arg "--runReal" | '
    topBar+= `pwd:[ ${process.cwd()} ] | `;
    if( vyRunning ) topBar+= `vy:Running pid:${vySpaw.pid}/${vyPid} | `;


    console.log('\n\n');
    clMkRow('=');
    console.log(`# ${topBar}`);
    clMkRow('_');
    console.log(`#\n# ${title}\n#\n# ${msg.join('\n# ')}\n#:`);
    let i = 0;
    for( let l of propmpt ){
        console.log(` ${i++} )_   ${l}`);
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
        ['no','yes'],( r )=>{
            console.log('got ['+r+']');

            if( r == 0 ) process.exit(0);
            else if( r == 1 ) readyLocalRepoList();

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

    let toggleRealFakeStr = fakeGitPull?'make it real!':'fake it';
    
    cl('In repositories', ['List of basic operations'],
        ['exit', '------','load all','update repo', 'update one', /*'update all',*/ 'install new', 'remove one', '-----', toggleRealFakeStr],( r )=>{
            console.log('got ['+r+']');

            
            if( r == 0      ) process.exit(0);
            else if( r == 1 ) readyLocalRepoList();//todo;//startLocalHost();
            else if( r == 2 ) repoLoadAll();
            else if( r == 3 ) updateRepo_dialog();
            else if( r == 4 ) updateApp_dialog();
            //else if( r == 5 ) updateAppsAll();
            else if( r == 5 ) installNew_dialog();
            else if( r == 6 ) removeApp_dialog();
            else if( r == 7 ) readyLocalRepoList();
            else if( r == 8 ){ fakeGitPull=!fakeGitPull; readyLocalRepoList();}

        }
    );
}


let vyRunning = false;
let vySpaw = undefined;
let vyPid = undefined;
function startLocalHost(){

    if( vyRunning ){
        console.log('# send kill SIGINT');
        vySpaw.kill( vyPid, "SIGINT" );  
        //console.log('# send kill SIGINT2');
        //process.kill( vySpaw.pid, "SIGINT" );     
        vyPid = undefined; 
    }else{       

        vyRunning = true;
        setTimeout(()=>{
            vySpaw = runcmd( 'cd ../viteyss; npm run startItAsLocalhost & echo "#pidOfVY:[$!]"; read "a";', ec => {
                console.log('# viteyss exit: ',ec);
                vyRunning = false;
            },( l )=>{
                if( vyPid ) return 0;
                let lStr = `${l}`;


                console.log('# viteyss spit out ['+lStr+']');
                if( lStr.startsWith( '#pidOfVY:[') ){
                    let lNo = lStr.split('\n')[0].replaceAll('#pidOfVY:[','').replaceAll(']','');
                    let pidNo = parseInt( lNo );
                    vyPid = pidNo;
                }
            } );
        },100);

    }

    setTimeout(()=>readyLocalRepoList(),1000);
}



function runcmd( cmd, cbOnExit, cbOnData=undefined, mkCmdPreviewWithThisOne = true ){
    if( mkCmdPreviewWithThisOne ) mkCmdPreview( cmd );
    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => {
        if( cbOnData ) cbOnData( d );
        else console.log(`#BASH.out: ${d}`);
    });
    sp.stderr.on( 'data', d => console.log(`#BASH.err: ${d}`));
    sp.on('close', exitCode => {
        cbOnExit( exitCode );
    });

    sp.stdin.end();
    return sp;
}


/*
gitCloneRepoOneDir('/tmp','https://github.com/yOyOeK1/oiyshTerminal.git', r=>{
    console.log('git dir done with result',r);
}, ['/esp32IOBox1', '/esp01APDriver']);
*/
//process.exit(11);

function gitCloneRepoOneDir( dirPath, gitUrl, cbOnExit,dirsToClone = [] ){

    console.log('gitCloneRepoOneDir, url',gitUrl, " dirsToClone:",dirsToClone);

    let urlRepo=gitUrl
    let projectName = "oiyshTerminal";
    if( gitUrl.endsWith('.git') ) projectName = gitUrl.split('.git')[0].substring( gitUrl.lastIndexOf('/')+1 );
    else projectName = gitUrl.substring( gitUrl.lastIndexOf('/')+1 );

    console.log(' data ',{dirPath, urlRepo, projectName, dirsToClone});
    /*
    cd $tDir
    git clone --no-checkout --depth=1 --filter=tree:0 "$urlRepo"
    cd "$projectName"
    git sparse-checkout set --no-cone "$dirSub"
    git checkout
    */

    let cmd = `echo "# OK git clone dirs only ....";
        cd "${dirPath}";
        git clone --no-checkout --depth=1 --filter=tree:0 "${urlRepo}";
        cd "${projectName}";
        git sparse-checkout set --no-cone "${dirsToClone.join('" "')}";
        git chceckout
        `;
    runcmd( cmd, cbOnExit );
    /*mkCmdPreview( cmd );
    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => console.log(`#BASH.out: ${d}`));
    sp.on('close', exitCode => {
        cbOnExit( exitCode );
    });*/
    //sp.stdin.end();
}


function gitCloneRepo( dirPath, gitUrl, cbOnExit ){
    let cmd = `echo "# OK";
        cd ../sharelibs/src
        echo "clone repo ...${gitUrl} in [ \`pwd\` ]"
        
        git clone "${gitUrl}"
        cd ../../installer
        `;
    runcmd( cmd, cbOnExit );
    /*mkCmdPreview( cmd );
    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => console.log(`#BASH.out: ${d}`));
    sp.on('close', exitCode => {
        cbOnExit( exitCode );
    });*/
    //sp.stdin.end();
}

function readGitRepoInfo( repo ){
    let fPath = `../sharelibs/src/${repo.name}/vyDialup/vyDialup_repos.js`
    console.log(`# read git repo .... [ ${repo.name} ]`);
    let jsStr = fs.readFileSync( fPath ).toString();
    let j = JSON.parse(jsStr);
    return j.apps;
    let tr = [];
    for( let app of j.apps )
        tr.push({"name":app});
    return tr;
}


function chkSiteStatus( siteName, repoType = 'site' ){
    let dirIs = false;
    let insIs = false;
    let pwd = process.cwd();
    let uHome = process.env.HOME;

    if( repoType == 'site'){
        dirIs = fs.existsSync( `${pwd}/../../${siteName}` );
        insIs = fs.existsSync( `${pwd}/../node_modules/${siteName}` );
    }else if( repoType == 'dir'){
        //console.log('chkSiteStatus siteName:',siteName);
        dirIs = fs.existsSync( `${uHome}/.viteyss/src/${siteName}` );
        insIs = fs.existsSync( `${uHome}/.viteyss/sites/${siteName}` );
    }else if( repoType == 'dirFromGit'){
        //console.log('chkSiteStatus dir from git:',siteName);
        dirIs = fs.existsSync( `${uHome}/.viteyss/src/${siteName}` );
        insIs = fs.existsSync( `${uHome}/.viteyss/sites/${siteName}` );
    }else{
        console.log('EE repository type not suportet :( '+repoType );
        process.exit(-1);
    }

    return { dirIs, insIs };
}

function getAppT( app ){
    let appT = 'x';
    if( app.type ) appT = app.type.substring(0,1);
    if( app.type && app.type == 'dirFromGit' ) appT = 'D'
    return appT;
}


let appsToUpdate = [];
let appsCanInstall = [];
let repoToUpdate = [];
let totalPacks = 0;
function repoLoadAll(){
    clMkRow('~');
    console.log('# In repositiories - list all \n#   pwd['+process.cwd()+']');
    clMkRow('_');
    let pwd = process.cwd();
    let appNo = 0;
    let repoCloning = 0;
    //repoToUpdate = [];
    appsToUpdate = [];
    appsCanInstall = [];
    
    totalPacks = [];
    



    function chkCloneStack(){
        if( repoCloning == 0 ){

            clMkRow('=');
            console.log(`# Total: [${totalPacks}] | Installed: [${appsToUpdate.length}] | repos: [${repoToUpdate.length}] `)
            clMkRow('#');

            clMkRow('_');
            console.log(`# legend `);
            console.log(`#
# t:[ ] - type of package
# d:[ ] - directory status
# i:[ ] - installation status
#
# x - not implemented
# d - directory on repository
# D - directory on external repository
# s - viteyss-site- package system ( npm's )
# `);

            clMkRow('.');
            console.log('# clone stack is 0 GOGO ....');
            readyLocalRepoList(); 
            repoCloning--;           
        }
    }



    for(let repo of vyrepos){

        if( repo.apps != undefined ){
            //console.log('repo.type-> ',repo);
            for( let app of repo.apps ){
                repoCloning++;
                
                //let dirIs = fs.existsSync( `${pwd}/../../${repo.sufix}${app.name}` );
                //let insIs = fs.existsSync( `${pwd}/../node_modules/${repo.sufix}${app.name}` );
                //console.log('repo.app.type-> ',app.type);
                let { dirIs, insIs } = chkSiteStatus( `${repo.sufix}${app.name}`, app.type );
                
                totalPacks++;

                console.log( ` ${appNo++} ]__ t:[${getAppT(app)}] d:[${dirIs?'1':'0'}] i:[${insIs?'1':'0'}]  ${app.name}     ... ${repo.name}` );

                if( dirIs && insIs ){
                    appsToUpdate.push( {
                        'name':repo.sufix+app.name,
                        'appItem':app,
                        'type': app.type,
                        'repo': repo,
                        'fullPath':`${pwd}/../../${repo.sufix}${app.name}`} );
                }





                repoCloning--;

            }
        
        }else{
            repoCloning++;
            let repoPath =  `${pwd}/../sharelibs/src/${repo.name}`;
            let dirNameRepoPath =  `${pwd}/../sharelibs/src`;
            let repDirIs = fs.existsSync( repoPath );
            console.log(`# dir of repo ${repDirIs}\n#  path [ ${repoPath} ]`);

            if( !repDirIs ){

                repoToUpdate.push({ dirNameRepoPath, giturl: repo.giturl });
                gitCloneRepoOneDir( dirNameRepoPath, repo.giturl, 
                    exitCode =>{
                    let res = readGitRepoInfo( repo );
                    repo.apps = res;
                    console.log(`res22 # nice exit: [${exitCode}] repoCloningStack:`,repoCloning,
                        'res:',res
                    );
                    repoCloning--;
                    chkCloneStack();
                    },
                    ['/vyDialup']
                 );
                /*gitCloneRepo( repoPath, repo.giturl, exitCode =>{
                    let res = readGitRepoInfo( repo );
                    repo.apps = res;
                    console.log(`# nice exit: [${exitCode}] repoCloningStack:`,repoCloning,
                        'res:',res
                    );
                    repoCloning--;
                    chkCloneStack();
                } );
                */
            }else{
                repoToUpdate.push({ dirNameRepoPath, repo });
                let res = readGitRepoInfo( repo );
                repo.apps = res;
                console.log('res2: ',res, ' repoCloning:',repoCloning);
                repoCloning--;
                chkCloneStack();
            }


        }

    }


    chkCloneStack();
   

}

function removeApp_dialog(){
    repoLoadAll();
    let opts = ['back'];
    let optsJ = [''];
    //console.log('apps appsToUpdate now ',appsToUpdate);
    let appInd = 0;
    for( let app of appsToUpdate){
        let {dirIs,insIs} = chkSiteStatus( app.name, app.type );

        if( insIs ){
            opts.push( `${app.name}     ... . .    ${app.repo.name}` );
            optsJ.push( {name: app.name, appData: app} );
        }
        appInd++;
        
    }

     cl('In repositories - remove one', ['You can remove something'],
        opts,( r )=>{
            console.log('got ['+r+']')
            if( r == 0 ) readyLocalRepoList();//process.exit(0);
            else removeApp( optsJ[ r ] );

        }
    );
}


function removeApp( appHandle ){
    //console.log('removeApp:', appHandle);
    console.log(`# will remove [ ${appHandle.name} ] `,
        //`\ndebug: \n',${JSON.stringify(appHandle,null,4)} ]`
    );

    let app = appHandle.name;
    let sufix = appHandle.appData.repo.sufix;
    let appInd = appHandle.appData.repo.apps.findIndex( a => {
        let tr =`${sufix}${a.name}` === `${app}`;
        //console.log(`chk ${sufix}${a.name} === ${app}  is `,tr);
        return tr;
    } );
    if( appInd == -1 ){
        console.log('EE in looking for app to remove exit !');
        process.exit(-1);
    }
    let appData = appHandle.appData.repo.apps[ appInd ];
    let cmd = '';
    let cmdReal = `
                set +e;
                cd ../../
                #pwd;
                echo " - remove from viteyss ...";
                cd ./viteyss;
                npm remove "${app}";

                echo "   - list after remove viteyss ....";
                npm list;
                cd ..;

                #pwd;

                echo " - remove from project dir to [ _2del ]";
                mv "${app}" "${app}_2del_${Date.now()}";
                `;
    cmd = `echo "# OK ";
        echo "# working remove... type [${appData.type}] in [ pwd: \`pwd\` ]  ... in ${defWaitTime}'";
        sleep ${defWaitTime};
        `;
        

    if( appData.type == 'site' ){
        if( fakeGitPull ){
            cmd+= `echo '# fake  $[o.O]# TRUE remove`;
            cmd+= `echo '# fake   '; 
                echo '# working ....\n# working ....\n# working ....\n# work DONE\n'
                `;
            console.log('#@ fake And real cmdis ',cmdReal);
        
        }else{
            cmd+= `echo "will remove [${app}]`;
            cmd+= cmdReal;
            
        }
        cmd+= `echo "# remove [ ${app} ] DONE"`;

        
    } else if( appData.type == 'dir' ){
        cmd+= `echo "# OK ";`;
         
        if( fakeGitPull ){
            cmd+= `echo '# fake  $[o.O]# TRUE remove';`;
            cmd+= `
                echo "make dir app remove ... ";
                #mv "$HOME/.viteyss/sites/${app}" "\`mktemp -d\`/"
            `;            
        
        }else{
            cmd+= `echo "will remove [${app}]";
                tDir=\`mktemp -d\`
                mkdir -p "$tDir""/site";
                mkdir -p "$tDir""/src";
                mv "$HOME/.viteyss/sites/${app}" "$tDir/site"
                mv "$HOME/.viteyss/src/${app}" "$tDir/src"
                echo "# last chance to retrive it is in [ $tDir ]" 
            `;           
            
        }
        cmd+= `echo "# remove [ ${app} ] DONE"`;
        
        
    } else if( appData.type == 'dirFromGit' ){
         console.log('debg removal ',appData);
        cmd+= `echo '# remove ... in ${defWaitTime}';
            if test "1" = "${fakeGitPull?'0':'1'}";then
                mv "$HOME/.viteyss/src/${sufix}${appData.name}" \`mktemp -d\`"_2remove";
                rm "$HOME/.viteyss/sites/${sufix}${appData.name}";
                
            else
                echo "# is fake all the way down ..."

            fi

        `;
        
        
    }else{
        console.log('EE unknown type of removal ',appData);
        process.exit(-1);
    }
    mkCmdPreview( cmd );
    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => console.log(`#BASH.out: ${d}`));
    sp.stderr.on( 'data', d => console.log(`#BASH.err: ${d}`));
    sp.on('close', exitCode => {
        //cbOnExit( exitCode );
        if( exitCode == 0 ){
             removeApp_dialog();
        }else{
            console.log('EE installation exit with ',exitCode);
            process.exit(exitCode);
        }
    });
    sp.stdin.end();



}





function installNew_dialog(){
    let opts = ['back'];
    let optsJ = [''];
    console.log('# apps appsCanInstall now ',appsCanInstall);
    function trowAlert(){

        if( appsCanInstall.length == 0 ){
            clMkRow(".");
            clMkRow("o");
            clMkRow("O");
            console.log('# EE no apps to install did you run [ load all ] ?');
            clMkRow("O");
            clMkRow("o");
            clMkRow(".");
            readyLocalRepoList();
            //return -1;
        }
    }
    for( let repo of vyrepos){
        let appInd = 0;

        if( !('apps' in repo) || ('apps' in repo && repo.apps == undefined) ){
                trowAlert();
                return -1;                
        }

        for( let app of repo.apps ){
            let {dirIs,insIs} = chkSiteStatus( repo.sufix+app.name, app.type );

            if( !insIs ){
                opts.push( `${app.name}     ... . .    ${repo.name}` );
                optsJ.push( {appname: app.name, appInd: appInd, dirIs, insIs, repo: repo} );
            }
            appInd++;
        }
    }

     cl('In repositories - install one', ['Installatio is posible on'],
        opts,( r )=>{
            console.log('got ['+r+']')
            if( r == 0 ) readyLocalRepoList();//process.exit(0);
            else installApp( optsJ[ r ] );

        }
    );
}

function installApp( appHandle ){
    let app = appHandle.repo.sufix+appHandle.appname;
    let appData = appHandle.repo.apps[ appHandle.appInd ];
    
    console.log(`# will install type: [${appData.type}] [ ${appHandle.appname} ] from [ ${appHandle.repo.name} ]`,
        `\ndebug: \n',${JSON.stringify(appHandle,null,4)} ]`
    );


    let cmd = '';

    if( appData.type == 'site' ){
        cmd = `echo "# OK";
            cd ../../
            echo "# working installing... in [ pwd: \`pwd\` ] ... in ${defWaitTime} sec";
            sleep ${defWaitTime};
            `;
        if( fakeGitPull ){
            cmd+= `echo '# fake  $[o.O]# TRUE install ... ';`;
            if( !appHandle.dirIs )
                cmd+= `echo '# fake   git clone "${appData.url}" ';`;
            else 
                cmd+= `echo '# fake   skip clone ..... is in place ';`;

            cmd+= `echo '# fake   cd ${app}; npm install; cd ../viteyss; npm install ../${app}; working ....\n# working ....\n# working ....\n# work DONE\n'\n`;
        
        }else{
            cmd+= `echo "will install [${app}] ....  ... ";`;
            if( !appHandle.dirIs )
                cmd+= `echo "# clone ...."; git clone "${appData.url}" 2>&1 ; echo "# clone ... DONE";`;
            else 
                cmd+= `echo '# skip clone ..... is in place ';`;

            cmd+= `cd ${app}; npm install 2>&1 ; cd ../viteyss; npm install ../${app} 2>&1;`;
        }
        cmd+= `echo "# install [ ${app} ] DONE"`;

        //console.log('cmd',cmd);

    } else if( appData.type == 'dir' ){
    
        cmd = `echo "# OK";
            echo "# working installing... in [ pwd: \`pwd\` ] ... in ${defWaitTime} sec"; 
            sleep ${defWaitTime/10};
            `;
        //if( fakeGitPull ){
        cmd+= `echo '# fake  $[o.O]# TRUE install ... in ${defWaitTime}';
            echo "pwd we need to copy stuff from repo to .viteyss/sites ...";
            
            if test "1" = "${fakeGitPull?'0':'1'}";then
                mkdir -p "$HOME/.viteyss/sites";
                mkdir -p "$HOME/.viteyss/src/${appHandle.repo.sufix}${appHandle.appname}";
                repoFullPath="$HOME/.viteyss/src/${appHandle.repo.sufix}${appHandle.appname}"
                repoDirName=\`dirname "$repoFullPath"\`;
                repoBaseName=\`basename "${appHandle.repo.name}"\`;
                
                echo "* will clone only part of repo ... ";
                cd "$repoFullPath";
                git clone --no-checkout --depth=1 --filter=tree:0 "${appHandle.repo.giturl}"
                cd "$repoBaseName"
                git sparse-checkout set --no-cone "/${appHandle.appname}"
                git checkout
                
                pwd
                fullPathToApp=\`pwd\`"/${appHandle.appname}";
                echo "* linking to home .viteyss/sites/... fullPathToApp:[ $fullPathToApp ]";
                ln -s "$fullPathToApp" "$HOME""/.viteyss/sites/${appHandle.repo.sufix}${appHandle.appname}";
            
            else
                echo "# is fake all the way down ..."

            fi

        `;
        

        cmd+= `echo "# install type: [${appData.type}] [ ${app} ] DONE"`;

        //console.log('cmd',cmd);
    

    }else if( appData.type == 'dirFromGit' ){
    
        cmd = `echo "# OK";
            echo "# working installing... in [ pwd: \`pwd\` ] ... in ${defWaitTime} sec"; 
            sleep ${defWaitTime/10};
            `;
        //if( fakeGitPull ){
        cmd+= `echo '# fake  $[o.O]# TRUE install ... in ${defWaitTime}';
            echo "pwd we need to copy stuff from repo to .viteyss/sites ...";
            
            if test "1" = "${fakeGitPull?'0':'1'}";then
                repoFullPath="$HOME/.viteyss/src/${appHandle.repo.sufix}${appData.name}"
                repoBaseName=\`basename "${appData.url}"\`;
                repoDirName=\`dirname "$repoFullPath"\`;
                
                mkdir -p "$HOME/.viteyss/sites";
                mkdir -p "$repoFullPath";
                
                echo "* will clone only part of repo ... ";
                cd "$repoFullPath";
                git clone --no-checkout --depth=1 --filter=tree:0 "${appData.url}"
                cd "$repoBaseName"
                git sparse-checkout set --no-cone "/${appData.subdir}"
                git checkout
                
                pwd
                cd "./${appData.subdir}";
                pwd
                fullPathToApp=\`pwd\`;
                echo "* linking to home .viteyss/sites/... fullPathToApp:[ $fullPathToApp ]";
                ln -s "$fullPathToApp" "$HOME""/.viteyss/sites/${appHandle.repo.sufix}${appData.name}";
            
            else
                echo "# is fake all the way down ..."

            fi

        `;
        

        cmd+= `echo "# install type: [${appData.type}] [ ${app} ] DONE"`;

        //console.log('cmd',cmd);
    

    } else{
        console.log('EE unknown type of installation ',appData);
        process.exit(-1);
    }

    mkCmdPreview( cmd );

    let sp = spawn( cmd, { shell: true } );
    sp.stdout.on( 'data', d => console.log(`#BASH.out: ${d}`));
    sp.stderr.on( 'data', d => console.log(`#BASH.err: ${d}`));
    sp.on('close', exitCode => {
        //cbOnExit( exitCode );
        if( exitCode == 0 ){
             installNew_dialog();
        }else{
            console.log('#BASH.close: EE installation exit with ',exitCode);
            process.exit(exitCode);
        }
    });
    sp.stdin.end();



}



function updateRepo_dialog(){

    let opts = ['back'];
    for( let repo of repoToUpdate){

        opts.push( ' . . . o O O o __  '+repo.repo.name );
    }
    
   
     cl('In repositories - update one', ['Update is posible on this repositories','','- - -','r - repository','s - site for viteyss'],
        opts,( r )=>{
            console.log('got ['+r+']');

            if( r == 0 ) readyLocalRepoList();//process.exit(0);
            else  updateRepo( repoToUpdate[ r-1 ] );

        }
    );
    
    
}
function updateRepo( repo ){
    //console.log('repo: '+JSON.stringify(repo,null,4));
    let cmd = `
        echo "# OK update repe [ ${repo.repo.name} ] . . . in ${defWaitTime} sec ";
        sleep ${defWaitTime};
        cd "../sharelibs/src/${repo.repo.name}";
        git pull 2>&1;
        `;

    if( fakeGitPull ){
        console.log('# fake bash ---------------\n',cmd);
        updateRepo_dialog();
    }else{
        runcmd( cmd, cbOnExit=>{
            console.log("# repo update DONE; exit code ",cbOnExit);
            updateRepo_dialog();
        } );
    }
   
}


function updateApp_dialog(){

    let opts = ['back'];
    let optsJ = [''];
   
    let optNo = 0;
    for( let app of appsToUpdate){
        opts.push( `t:[${getAppT(app)}]  ${app.name}` );
        optsJ.push(  {name: app.name, appInd: optNo++, appData: app} );
        
    }


     cl('In repositories - update one', ['Update is posible on this apps','','- - -','r - repository','s - site for viteyss','d - directory on repository','D - directory on external repository','s - viteyss-site- package system ( npm\'s )'],
        opts,( r )=>{
            console.log('got ['+r+']');

            if( r == 0 ) readyLocalRepoList();//process.exit(0);
            else  updateApp( optsJ[r] );

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

    let appData = app.appData;
    let appItem =  appsToUpdate[ parseInt( app.appInd ) ].appItem;
    console.log(`# will update type: [${appData.type}] `,
        `[ ${JSON.stringify(app,null,4)} ] ....\n\nappItem: [ ${JSON.stringify(appItem,null,4)} ] ....`
        );
    let cmd = '';
    if( appData.type == 'site' ){
        cmd = `
            echo "# OK";
            echo "# working ... git pull  in [ pwd: \`pwd\` ] ... in ${defWaitTime}";
            sleep ${defWaitTime};
            
            cd "../../${app.name}";
            git pull 2>&1;

            echo "# update [ ${app.name} ] DONE"
            `;

        if( fakeGitPull ){
            console.log(`# fake cmd\n`,cmd);
            cmd = 'echo "#fake cmd";';
        }
    } else if( appData.type == 'dirFromGit' ){
        
        
        cmd = `
            echo "# OK";
            echo "# working ... git pull  in [ pwd: \`pwd\` ] ... in ${defWaitTime}";
            sleep ${defWaitTime};

            rUrl="${appItem.url}";
            rBn=\`basename "$rUrl"\`;
            sDir="${appItem.subdir}";
            
            cd "$HOME/.viteyss/src/${appData.name}/""$rBn";
            git pull 2>&1;

            echo "# update [ ${app.name} ] DONE";
            `;

        if( fakeGitPull ){
            console.log(`# fake cmd\n`,cmd);
            cmd = 'echo "#fake cmd";';
        }
    
    } else {
        console.log("# EE wrong appData type ",appData.type," un known update type ");
        process.exit(-1);
    }

    mkCmdPreview( cmd );
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
