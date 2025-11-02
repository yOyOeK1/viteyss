
/*
Internal websocket layer for rerouting messagese inspired by socket io / mqtt.
Bais comunication is over websocket. It's managing messaga's with prefix in ascii
This case is `wsqq:`
Can be sen on init when use externaly or in differnt instace.

Data need to be feed by
```js
on_connection = (ws) =>{
on_close = (ws) =>{
onMsg = ( ws, event, msg ) =>{
```

Emiting to subscribers as server can by don by:
```js
wsqqS.public=( topic_, payload_ );
```




Use case's from client site by raw web socket.
```js
sOutSend('qq:{"subscribe":"abc21"}');

sOutSend('qq:{"unsubscribe":"abc21"}');

sOutSend('qq:{"topic":"abc20","payload":1}');

sOutSend('qq:{"subscribedTo":1}');
    get my list of subscriptions

sOutSend('qq:{"wsqqclientdump":1}');
    dumps all client stack subscriptions
```


*/

import { qqBridge_ws_to_qq } from "../src/qqBridge2.js";
import { topicPatternChk } from "./topicPatternHelp.js";
import { qq2 } from "./wsqq2.js";

/*
function topicMatchChk( topik, str ){
    let key  = '^('+topik.replaceAll('/','/||')+')#$';
    let pattern = new RegExp( key );
    return [pattern.test( str ), key];
}
*/




let cSubscribe = function( topic_ ){
    sOutSend(`qq:{"subscribe":"${topic_}"}`);
};
let cUnsubscribe = function( topic_ ){
    sOutSend(`qq:{"unsubscribe":"${topic_}"}`);
};
let cSend = function( topic_, payload_ ){
    sOutSend(`qq:`+JSON.stringify({
        topic: topic_,
        payload: payload_
    }));
};
let cGetSubscribedTo = function( ){
    sOutSend('qq:{"subscribedTo":1}');
};
let cGetClients = function(){
    sOutSend('qq:{"wsqqclientdump":1}');
};
let cSubscribeToClientTrafic = function(){
    sOutSend(`qq:{"subscribe":"wsqq/client/new"}`);
    sOutSend(`qq:{"subscribe":"wsqq/client/close"}`);
}

let wsqqC = {
    subscribe: cSubscribe,
    unsubscribe: cUnsubscribe,
    send: cSend,
    subscribedTo: cGetSubscribedTo,
    getClients: cGetClients,
    getClientsTrafic: cSubscribeToClientTrafic
};

let wsqqStats = {
    sendTotal:0,
    gotTotal:0
};





let wsqqEmitDriverUse = -1;
let wsqqSEmit = function( client, topic_, payload_ ){
    console.log('wsqqSEmit driver used: '+wsqqEmitDriverUse);
    wsqqEmitDriverUse( client, topic_, payload_ );
   
    wsqqStats.sendTotal++;
};


class qq2S{
    constructor( prefixUse = 'wsqq2S:', ident = ''){

        this.q2 = new qq2( '@viteyss' );

        this.qqBridge_ws_to_qq_o = new qqBridge_ws_to_qq('ws_2_qqC_00', this);
        this.q2.on( this.qqBridge_ws_to_qq_o.qqBName, '$SYS/#', this.qqBridge_ws_to_qq_o.parse );
        this.q2.on( 'q2_SS_'+ident, 'test/toConsole', (t,p)=>{
            this.cl(`\n ===================\n`+
                '   test / toConsole \n\n'+
                t+"\n\n"+JSON.stringify(p,null,4)+"\n"+
                "--------------------------\n"
            );
        } );

        this.clients = [];
        this.fallBackGate = [];
        this.prefix = prefixUse;
        this.ident = ident;
        this.prefixLength = this.prefix.length;
        this.msgSrc = -1;
        this.cl(`init .... wsqq2S [${this.prefix} ${this.ident}] done`);
    }

    cl(m){
        console.log(`[${this.prefix} ${this.ident}]: `,m);
    }

    setFallBackGate=(newGateList)=>{
        this.fallBackGate = newGateList;
        for(let f of newGateList){
            f.setParentWsqq( this );
            f.getTopicsDump();
        }

    }

    getClientIndexFromWs = ( ws ) => {
        for(let c=0,cc=this.clients.length; c<cc;c++){
            if( this.clients[c]['ws'] == ws )
                return c;
        }
        return -1;
    }


    chkClient = ( ws ) =>{
        let cId = this.getClientIndexFromWs( ws );

        if( cId == -1 ){
            this.cl(` + new client now there is ${this.clients.length}`);
            this.clients.push( {
                "ws":ws,
                "ident": typeof(ws) == "string"? ws : `@ws_${process.platform}_at_${process.arch}`,
                "subscribe": [],
                "entryDate": Date.now()
            } );
            cId = this.clients.length-1;
            this.sendToSubscribers('wsqq2/client/new',cId);
        }
        return cId;
    }


    public=( topic_, payload_ )=>{
        this.sendToSubscribers( topic_, payload_ );
    }

    sendToSubscribers=( topic_, payload_, customCM = undefined)=>{
        let sendC = 0;
        for(let c of this.clients ){
            for(let t of c['subscribe']){
                // if( t.indexOf(topic) == 0 ){             // 1:1 pattern match
                //this.cl(`topic_: [${topic_}] , looking in subscribed [${t}] result: ${topicPatternChk( topic_, t )}`);
                if( topicPatternChk( topic_, t ) ){          // ~ mqtt with # and + look `./libs/topicPatternHelp.js`
                    if( customCM != undefined){
                        customCM( c, topic_, payload_ );            
                    }else{
                        wsqqSEmit( c, topic_, payload_ );            

                    }
                    
                    //c['ws'].send(JSON.stringify(msgj));
                    //wsqqStats.sendTotal++;
                    //sendC++;
                }
            }
        }
        //this.cl(`[${topic}] send (${sendC})`);
    }

    
    subscribeClient=( client, topic  )=>{
        if( client['subscribe'].indexOf( topic ) == -1 ){
            client['subscribe'].push( topic );
        }
        
       
    }
    unsubscribeClient=( client, topic, broadCast=true )=>{
        let tDel = client['subscribe'].indexOf( topic );

        if( tDel != -1 ){
            client['subscribe'].pop( tDel );
        }
        
    }
   
   
    on_connection = (ws) =>{
        this.chkClient( ws );
        this.cl(`connect    Have clients int stack (${this.clients.length})`);
    }

    on_close = (ws) =>{
        let cId = this.chkClient( ws );
        if( cId != -1 )
            this.clients.pop( cId );
        this.cl(`close      Have clients int stack (${this.clients.length})`);
        this.sendToSubscribers( 'wsqq2/client/close', cId );
    }

    getTopicsDump = () =>{
        let tr = {};
        for(let c of this.clients ){
            for(let t of c['subscribe']){
                if( !(t in tr) ){
                    tr[ t ] = 1;
                }else{
                    tr[ t ]++;
                }
            }
        }
        return {
            topics: tr,
            prefix: this.prefix,
            ident: this.ident
        };
    }
    getClientDump=()=>{
        this.cl('wsqq client dump:');
        let tr = {};
        for(let c=0,cc=this.clients.length; c<cc;c++){
        //for(let c of this.clients ){
            let client = this.clients[ c ];
            tr[ c ] = {
                "ident": client['ident'],
                "subscribe": client['subscribe']
            }
            this.cl(` subscribe to: ${client['subscribe']}`);
        }
        tr['stats'] = wsqqStats;
        return tr;
    }


    subAsWs = ( ws, name, subscribe ) =>{
        let deb  = false;
        this.q2.on( name, subscribe, (topic_, payload_)=>{

            if( deb ) this.cl('subAnWs.ws.send to ['+name+'] ws client on topic: '+topic_);
            //console.log('subAnWs.qq2 ws cliet is new : ',ws['isNew']);
            ws.send( JSON.stringify( { topic:topic_, payload:payload_} ) );
            /*
            let byC = this.q2.getByClient();
            for( let c of Object.keys(byC) ){
                let client = byC[ c ];
                if( !c.startsWith('q2BQ2ws.') && !c.startsWith('ws_2_qqC') ){
                    for( let t of client ){
                        ws.send( JSON.stringify( { topic:topic_, payload:{
                            name:'ws', topic: t
                        }} ) );
                        
                    }
                }
            }


            ws['isNew'] = false;
            }else{
                ws.send( JSON.stringify( { topic:topic_, payload:payload_} ) );
            }
                */

        } );


        if( ws['isNew'] ){
            let byC = this.q2.getByClient();
            let tL = [];
            for( let c of Object.keys(byC) ){
                let client = byC[ c ];
                if( !c.startsWith('q2BQ2ws.') && !c.startsWith('ws_2_qqC') ){
                    for( let t of client ){
                        tL.push( t );
                        
                    }
                }
            }
            if( tL.length >0 )
                ws.send( JSON.stringify( { 
                    subslist: tL,
                    name: name
                    } ) );


            ws['isNew'] = false;
        }

    }
    
    onMsg = ( ws, event, msg, broadCast=true ) =>{
        this.msgSrc = ws;
        let deb = true;
        msg = String(msg).substring( this.prefixLength );
        wsqqStats.gotTotal++
        let j = JSON.parse(msg);
        if( deb ) {
            this.cl(`onMsg ev:${event}`);
            this.cl( "j raw msg:\n"+JSON.stringify(j,null,4) );
            if( 'qq2Subs' in ws ){
                this.cl(['ws subs',ws['qq2Subs']]);
            }
        }

        if( 'subslist' in j ){
            if( true ) this.cl('q2SS got subs list from: '+j.name+' of\n\t'+j.subslist.join(' , ') );
            for(let t of j.subslist ){
                this.subAsWs( ws , j.name, t );
            }

        }else if( 'subscribe' in j && 'name' in j ){
            let jname = j['name'];
            let jsubscribe = j['subscribe'];
            if( !('isNew' in ws) ){
                ws['isNew'] = true;
            }
            if( deb ) this.cl('subscribe ['+jname+'] ws client on topic: '+jsubscribe);

            if( 'qq2Subs' in ws ){
                if( ws['qq2Subs'].indexOf( jname ) == -1 ){
                    ws['qq2Subs'].push( jname  );
                    
                }
            }else{
                ws['qq2Subs'] = [ jname ];
               
            }

            this.subAsWs( ws , jname, jsubscribe );
            /*
            this.q2.on( jname, jsubscribe, (topic_, payload_)=>{

                if( deb ) this.cl('ws.send to ['+jname+'] ws client on topic: '+topic_);
                console.log('qq2 ws cliet is new : ',ws['isNew']);
                if( ws['isNew'] ){
                    ws.send( JSON.stringify( { topic:topic_, payload:payload_} ) );
                    let byC = this.q2.getByClient();
                    for( let c of Object.keys(byC) ){
                        let client = byC[ c ];
                        if( !c.startsWith('q2BQ2ws.') && !c.startsWith('ws_2_qqC') ){
                            for( let t of client ){
                                ws.send( JSON.stringify( { topic:topic_, payload:{
                                    name:'ws', topic: t
                                }} ) );
                                
                            }
                        }
                    }


                    ws['isNew'] = false;
                }else{
                    ws.send( JSON.stringify( { topic:topic_, payload:payload_} ) );
                }

            } );
             */

        }

        if( 'topic' in j && 'payload' in j ){
            if( deb ) this.cl('got msg on topic: '+j['topic']+' ... emit ');
            if( deb ) this.cl('ws have qq2Subs? '+( 'qqSSubs' in ws ));
            if( 'qqSSubs' in ws ){
                this.cl(['subs',ws['qq2Subs']]);
            }

            this.q2.emit( j['topic'], j['payload'], {skipClient: ws['qq2Subs'] } );
        }

        if( 'cmd' in j ){
            this.cl('got cmd : '+j['cmd']);
            if( j['cmd'] == 'dump'){
                this.cl('cmd: dump-------------------\n');
                this.q2.dump();
            }else  if( j['cmd'] == 'getAllTopics'){
                this.cl('cmd: getAllTopics-------------------\n'+
                    JSON.stringify( this.q2.getAllTopics(), null, 4)
                );
            }else if( j['cmd'] == 'getByClient'){ //getByClient
                this.cl('cmd: getByClient-------------------\n'+
                    JSON.stringify( this.q2.getByClient(), null, 4)
                );
            }else if( j['cmd'] == 'dummSub'){
                this.cl('cmd: dummSub :['+j['dummSub']+']-------------------\n');
                this.q2.on('dummSub',j['dummSub'],(t,p)=>{console.log('Log dumSub :'+t+'\npayload: '+p);});
            
            }else if( j['cmd'] == 'postByClients' && 'src' in j ){
                this.cl('postByClients: '+j['src']);
                this.q2.emit( j.src, {
                    hostName: this.q2.getName(),
                    res:this.q2.getByClient() ,
                    entryDate: parseInt( Date.now() )
                });
            }
        }

        /*
        let cId = this.chkClient( ws );
        msg = String(msg).substring( this.prefixLength );
        
        console.log("so it's\n"+msg);
        let j = JSON.parse(msg);
        if( deb ) {
            this.cl(`onMsg ev:${event}`);
            this.cl(`cId:[${cId}] to process[${msg}]`);
            this.cl( "j raw msg:\n"+JSON.stringify(j,null,4) );
        }




        if( 'topic' in j && 'payload' in j )
            this.sendToSubscribers( j['topic'], j['payload'] );
        
        
        if( 'subscribe' in j )
            this.subscribeClient( this.clients[ cId ], j['subscribe'], j['name'] );        
        if( 'subscribeQ' in j )
            this.subscribeClient( this.clients[ cId ], j['subscribeQ'], j['name'] );        
        if( 'unsubscribe' in j )
            this.unsubscribeClient( this.clients[ cId ], j['unsubscribe'], broadCast );        
        if( 'subscribedTo' in j )
            wsqqSEmit( this.clients[ cId ], "subscribedTo", this.clients[ cId ]['subscribe'] );
        
        if( 'wsqqtopicstdump' in j ){
            wsqqSEmit( this.clients[ cId ], "wsqqtopicstdumpRes", this.getTopicsDump() );            
            
        }

        if( 'wsqqclientdump' in j ){
            wsqqSEmit( this.clients[ cId ], 'wsqqclientdump', this.getClientDump());
        }


        */
        this.msgSrc = -1;
        return 1;
    }

}


/*
var wsqq = {
    server: wsqqs,
    client: wsqqC,
    topicPatternChk: topicPatternChk
};
*/


export { qq2S }