import {wsqq} from '../libs/wsqq.js'
import { wsqqDriverEmint_yss } from '../libs/wsqqDriverEmit_yss.js'



// install qqC onmessage wsCallback  to viteyss
class qqSFalbackToWS{
  constructor(){
    this.parent = -1;
  }
  setParentWsqq( parentwsqq ){
    this.parent = parentwsqq;    
    sOutSend(`qq:{"subscribeQ":"wsqq/+/topicsDump"}`);
  }
  getTopicsDump=()=>{
    //sOutSend('qq:{"wsqqtopicstdump":1}');
  }
  subscribeClient=( topic )=>{
    //qqC.subscribe( topic );
    console.log(" wsqqYssTookOverWs ....subscribe client topic:"+topic);
    sOutSend(`qq:{"subscribeQ":"${topic}"}`);
  }
  send=( topic_, payload_ )=>{
    console.log(" wsqqYssTookOverWs ....");
  }
}
window['qqC'] = wsqq.client;



var wsqqYssTookOwerWs_install = function(){
    console.log('wsqqYssTookOwerWs_install(); .... start');

    function installQQS(){
        let qqS = new wsqq.server(wsqqDriverEmint_yss, 'qq:', thisClientIdent);
        qqS.setFallBackGate([ new qqSFalbackToWS() ]);
        //let qqSAsHandler = new wsqq.server(wsqqDriverEmint_yss, 'qq:', 'handler');
        window['qqS'] = qqS;


        console.log('wsqqC installation ...');
        var pagerOrgwsCB = window.pager.callCurrentPage_onMessageCallBack; 

        window.pager.wsCallback = function( r ){

            console.log(`wsqqC took over wsCallback ! -- `+r);
            
        

            if( 'topic' in r ){

              // rerouting msg to site   ->  handler
              if( 'payload' in r && 
                r['topic'].startsWith("and/") &&
                r['topic'].endsWith("/cmd")
                ){

                qqS.sendToSubscribers( r['topic'], r['payload'], (c, topic_, payload_)=>{
                  //console.log('have client subscriptino c:'+JSON.stringify(c));
                  //siteByKey[ siteKey ][ device ]( r );
                  let device = r['topic'].split('/');
                  device = device[ device.length-2 ];
                  siteByKey[ c['ws'] ][ device ]( r );
                });

              }

              if( r['topic'].startsWith("wsqq/") && r['topic'].endsWith("/topicsDump") ){
                console.log("[i] .... wsqqtopicstdumpRes");
                let ident = r['payload']['ident'];
                let topics = r['payload']['topics'];
                for(let topic of Object.keys(topics) ){
                    qqS.onMsg( ident, '', 'qq:'+JSON.stringify({subscribe:topic}), false );
                    console.log("[i] .... .... "+topic);
                }
                console.log("qqS status---------\n"+JSON.stringify(qqS.getClientDump(),null,4)); 
              }

            }
            
            pagerOrgwsCB( r );
            
        };

        window['pagerOrgwsCB'] = pagerOrgwsCB;
    }
   
  
    document.addEventListener('DOMContentLoaded', installQQS);
}
  




export { wsqqYssTookOwerWs_install }