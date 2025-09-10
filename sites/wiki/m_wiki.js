
console.log("m_wiki.js included ....");

import { hotHelperServer } from "../../libs/hotHelper.js";
import markdownit from 'markdown-it'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


class m_wiki extends hotHelperServer{
    constructor( ws ){
        super(ws);
        this.cl("m_wiki init ...");
        this.server = -1;
        
        this.md = markdownit({ html:true });
        this.wskey = 'wikiKey';

        this.mdsList = [];
        
        /*
        setInterval(()=>{
            this.sendIt({
                topic:'wikiKey/S2C', 
                payload:'init',
                testVal1: 1,
                abc: "4567890"
            });
        },5000);
        */
        
    }

    cl( str ){
        console.log('m_wiki',str);
    }    

    setServer(server){
        this.server = server;
    }

    onMsg( msg ){
        this.cl( " got msg: ");this.cl(msg);

        if( msg.topic == 'get/getMd' && msg.fullFileName != undefined && msg.th !=undefined ){
            try{
                msg['html'] = '';

                /*
                let urlBase = path.join(__dirname,'../../');

                let ps = msg.fullFileName.split('/');
                if( ps[ ps.length-1 ].substring(0,5) == 'site-' ){
                    let yp = this.server.yssPages;
                    let lookFor = ps[ ps.length-1 ].substring(5,ps[ ps.length-1 ].length-3);
                    for( let p=0,pc=yp.length; p<pc; p++){
                        if( yp[p].dir == lookFor ){
                            urlBase = '/yss/sites/'+yp[p].dir+'/';
                            msg.fullFileName = path.join( yp[p].fDir, 'README.md');
                            break;
                        }
                    }

                }else if( ps[ ps.length-1 ].substring(0,13) == 'viteyss-site-' ){
                    msg.fullFileName = './sites/'+ps[ ps.length-1 ].substring(13,ps[ ps.length-1 ].length-3)+'/README.md';
                }
                */
                //let f = path.resolve(msg.fullFileName);
                
                fs.readFile( msg.fullFileName, (err, data )=>{
                    if( err ){
                        console.error('[e] get/getMd error: \n\n'+err+"\n\n-----");
                    }

                    let pCont = ""+data.toString();           
                    
                    // look for ### points
                    let lines = pCont.split("\n");
                    let bullets = [];
                    for( let line of lines ){
                        if( line.substring(0,1) == "#" ){
                            let hLevel = line.indexOf(' ');
                            let bulletStr = line.substring( hLevel+1, line.length );
                            bullets.push( {"level": hLevel, "str":bulletStr } );
                        }
                    }
                    
                    
                    // add nice task buttons '- [] ' or '- [x] '
                    
                    pCont = pCont.replaceAll(
                        ` [x] `,
                        ` <img class="mdTasks" src="/icons/ico_todo_16_16.png"> `
                        ); 
                        
                    pCont = pCont.replaceAll(
                           ` [] `,
                            ` <img  class="mdTasks" src="/icons/ico_notdone_16_16.png"> `
                        ); 
                    
                    pCont = pCont.replaceAll(
                        '](./',
                        `](${msg.basename}`
                        );
                    pCont = pCont.replaceAll(
                        ' src="./',
                        ` src="${msg.basename}`
                        );


                    // insert all md key words **abc** if there is a file with this name
                    for( let k=0,ki=this.mdsList.length; k<ki; k++ ){
                        pCont = pCont.replaceAll(
                           `**${this.mdsList[k].name}**`,
                            `<a href="javascript:siteByKey.v_wikiPage.o.menu._instance.ctx.setCurrentByPath('${this.mdsList[k].path}','${this.mdsList[k].name}');">**${this.mdsList[k].name}**</a>`
                        );
                    }    

                    msg['html'] = this.md.render( pCont );

                    // mod bullets ####
                    let legendHtml = '';
                    for(let bul of bullets){
                        if( bul.level > 1 ){
                            let lookFor = `<h${bul.level}>${bul.str}</h${bul.level}>`;
                            let strUrld = encodeURIComponent(bul.str)
                                .replaceAll("'","upper")
                                .replaceAll('<strong>','').replaceAll('</strong>','')
                                .replaceAll('`','up')
                                .replaceAll("\`",'upp').replaceAll("\\`",'upp').replaceAll("\\\`",'upp')
                                .replaceAll('.','dot')
                                .replaceAll('<code>','').replaceAll('</code>','');
                                
                            let newVal = `<section id="${strUrld}" ></section>
                                <h${bul.level}>
                                    <a href="javascript:void(0);" onclick="window.location.hash='${strUrld}';">#</a>
                                    ${bul.str}
                                </h${bul.level}>`;
                            msg['html'] = msg['html'].replaceAll( lookFor, newVal );
                            
                            legendHtml+= `<li><a href="javascript:void(0);" onclick="window.location.hash='${strUrld}';">${bul.str}</a></li>`;
                        }
                    }

                     if( legendHtml != '' ){
                        msg['html'] = `
                        <wikiTableOfCont>
                            <section id="tableOfCont"></section>
                            <fieldset class="tableOfCont">
                                <legend><b>Table of contents:</b></legend>
                                <ul>${legendHtml}</ul>
                            </fieldset>
                        </wikiTableOfCont>`+
                            msg['html'];
                    }

                    this.sendIt(msg);
                });
                
            }catch(e){
                this.cl(`[e] on get/getMd:\n\n ${e}\n------\n`);
            }
            
        
        } else if( msg.topic == 'get/getMdsList' && msg.th !=undefined ){
            this.cl('get md list tastk ... th: '+msg.th);
            let dirPat = path.resolve( path.join(__dirname,'../../wikiSites'));
            console.log("dir to wiki: "+dirPat);
            let mdList = [];
            // in /wikiSites
            let d0res = fs.readdirSync( dirPat );
            d0res.forEach((val,i)=>{


                if( fs.lstatSync( path.join( dirPat, val) ).isFile() ){
                    mdList.push({
                        'name': val.substring(0,val.length-3),
                        'category':'wikiSites',
                        'path': path.join( dirPat, val),
                        'basename': '/wikiSites/'
                    });
                }
            });
            //mdList = mdList.concat( toAdd );

                
            // in /sites/*/README.md
            let dirsToLook = [];
            for( let fDi of this.server.yssPages ){
                if( fs.existsSync( path.join( fDi.fDir, 'README.md' ) ) ){
                    dirsToLook.push( fDi.fDir );
                    console.log('add site '+fDi.siteNo);
                    mdList.push( {
                        'name': 'site / '+( fDi.dir != '' ? fDi.dir : fDi.oName),
                        'category':'yssPages',
                        'path': path.join( fDi.fDir, 'README.md'),
                        'basename': `/yss/siteNo/${fDi.siteNo}/${fDi.dir}/`
                    });
                        
                }

            }
            console.log(`now dirs to look is `,dirsToLook);



            let d1res = fs.readdirSync( path.join(__dirname,'../') )
            for( let s=0,si=d1res.length; s<si; s++ ){
                let file = d1res[s];

                let filePathSite = path.join( './', 'sites',file,'site.json');
                let filePathREADME = path.join( './','sites',file,'README.md');
                
                if( fs.existsSync( filePathSite ) &&
                    fs.existsSync( filePathREADME ) 
                ){

                    mdList.push({
                        'name': 'viteyss-site-'+file,
                        'category':'viteyss / sites',
                        'path': filePathREADME,
                        'basename': `/sites/${file}/`
                    }); 
                       
                    
                }
                
            }
            
            msg['list'] = mdList;
            this.mdsList = mdList;
            this.sendIt(msg);
        }

    }

}

export { m_wiki }