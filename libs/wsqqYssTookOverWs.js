

var wsqqYssTookOwerWs_install = function(){
    console.log('wsqqYssTookOwerWs_install(); .... start');

    function installQQS(){
        //let qqS = new wsqq.server(wsqqDriverEmint_yss, 'qq:', thisClientIdent);
        //qqS.setFallBackGate([ new qqSFalbackToWS() ]);
        //let qqSAsHandler = new wsqq.server(wsqqDriverEmint_yss, 'qq:', 'handler');
        //window['qqS'] = qqS;


        console.log('wsqqC installation ...');
        var pagerOrgwsCB = window.pager.callCurrentPage_onMessageCallBack; 

        window.pager.wsCallback = function( r ){

            if( 0 ){
              console.log(`wsqqC took over wsCallback ! -- `+r);
              try{
                console.log('json ------------------\n',JSON.stringify(r,null,4));
              }catch(e){}
            }
            
        
            // bridge from web socket to qq2 
            if( 'topic' in r && 'payload' in r && Object.keys(r).length == 2 ){
              console.log('wsqqC => q2.emit ....'+r['topic'] );
              //if( r['topic'] != '$SYS/client/subscribe' )
                q2.emit( r['topic'], r['payload'] , { src: 'ws' } );

            }
            // bridge from web socket to qq2  END

            // bridge subs list 
            else if( 'subslist' in r && 'name' in r ){
              console.log('wsqqC - subslist from '+r.name+'\n\t'+r.subslist.join(" , "));
              for( let top of r.subslist ){
                q2.emit('$SYS/client/subscribe',{
                  name:'ws', topic: top
                });
              }
            }
            // bridge subs list END 

            if( 0 && 'topic' in r ){

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