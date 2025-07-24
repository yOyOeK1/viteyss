
console.log("m_wiki.js included ....");

import { hotHelperServer } from "../../libs/hotHelper.js";
import fs from 'fs';
import path from 'path';


class m_wiki extends hotHelperServer{
    constructor( ws ){
        super(ws);
        this.cl("m_wiki init ...");
        
        this.wskey = 'wikiKey';

        setInterval(()=>{
            this.sendIt({
                topic:'wikiKey/S2C', 
                payload:'init',
                testVal1: 1,
                abc: "4567890"
            });
        },5000);
   
        
    }

    cl( str ){
        console.log('m_wiki',str);
    }    

    onMsg( msg ){
        this.cl( " got msg: ");this.cl(msg);

        if( msg.topic == 'get/getMd' && msg.fullFileName != undefined && msg.th !=undefined ){
            try{
                msg['html'] = '';
                let f = path.resolve(msg.fullFileName);
                
                fs.readFile( f, (err, data )=>{
                    if( err ){
                        console.error('[e] get/getMd error: \n\n'+err+"\n\n-----");
                    }

                    msg['html'] = data.toString();
                    this.sendIt(msg);
                });
                
            }catch(e){
                this.cl(`[e] on get/getMd:\n\n ${e}\n------\n`);
            }
            
        
        } else if( msg.topic == 'get/getMdsList' && msg.th !=undefined ){
            this.cl('get md list tastk ... th: '+msg.th);
            let dirPat = path.resolve('wikiSites');
            console.log("dir to wiki: "+dirPat);
            fs.readdir( 'wikiSites',(err, files)=>{
                let mdList = [];
                files.forEach( file => { 
                    mdList.push( file.substring(0,file.length-3) );
                }); 
                
                msg['list'] = mdList;
                this.sendIt(msg);
                   

            });
        }

    }

}

export { m_wiki }