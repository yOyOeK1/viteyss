
console.log("m_wiki.js included ....");

import { hotHelperServer } from "../../libs/hotHelper.js";

class m_wiki extends hotHelperServer{
    constructor( ws ){
        super(ws);
        this.cl("m_wiki init ...");
        
        this.wskey = 'wikiKey';

        setInterval(()=>{
            this.sendIt({topic:'wikiKey/S2C', payload:'init'});
        },5000);
   
        
    }

    cl( str ){
        console.log('m_wiki',str);
    }    

    

}

export { m_wiki }