
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

import { topicPatternChk } from "./topicPatternHelp.js";

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


class wsqqs{
    constructor( wsqqDriver, prefixUse = 'wsqq:', ident = ''){
        wsqqEmitDriverUse = wsqqDriver;    
        this.clients = [];
        this.fallBackGate = [];
        this.prefix = prefixUse;
        this.ident = ident;
        this.prefixLength = this.prefix.length;
        this.cl(`init .... wsqq [${this.prefix} ${this.ident}] done`);
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
            this.sendToSubscribers('wsqq/client/new',cId);
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

    
    subscribeClient=( client, topic, broadCast=true )=>{
        if( client['subscribe'].indexOf( topic ) == -1 ){
            client['subscribe'].push( topic );
        }
        if( broadCast )
            this.sendToSubscribers( `wsqq/${this.ident}/topicsDump`, this.getTopicsDump() );
        for(let f of this.fallBackGate){
            f.subscribeClient( topic );
        }
    }
    unsubscribeClient=( client, topic, broadCast=true )=>{
        let tDel = client['subscribe'].indexOf( topic );

        if( tDel != -1 ){
            client['subscribe'].pop( tDel );
        }
        if( broadCast )
            this.sendToSubscribers( `wsqq/${this.ident}/topicsDump`, this.getTopicsDump() );
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
        this.sendToSubscribers( 'wsqq/client/close', cId );
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

    onMsg = ( ws, event, msg, broadCast=true ) =>{
        let deb = true;
        wsqqStats.gotTotal++
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
            this.subscribeClient( this.clients[ cId ], j['subscribe'], broadCast );        
        if( 'subscribeQ' in j )
            this.subscribeClient( this.clients[ cId ], j['subscribeQ'], false );        
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



        return 1;
    }

}



var wsqq = {
    server: wsqqs,
    client: wsqqC,
    topicPatternChk: topicPatternChk
};



export { wsqq }