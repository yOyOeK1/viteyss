


class qqBridge_ws_to_qq{

    constructor( qqBName, qqServerSite ){
        this.qqBridgeList = [];
        this.qqBName = qqBName;
        this.setHash = false;
        this.qqSS = qqServerSite;
        this.deb = false;
    }

    parse = ( topic, payload ) => {
        if( this.deb ) console.log('qqBridge_ws_to_qq ('+this.qqBName+') got \ntopic:  ',topic, '\npayload:  ',payload);
        let cDone = [];


        if( topic != undefined && payload != undefined ){
            if( topic == '$SYS/client/subscribe' ){
                if( this.deb ) console.log('qqBridge_ws_to_qq, subscribe');

                if( payload['name'] != this.qqBName ){
                    if( this.deb ) console.log('not my ... so propagate to all but not owner');
                    //sOutSend(`q2:{"subscribe":"${payload['topic']}","name":"${this.qqBName}"}`);
                    for( let t of this.qqSS.q2.topics ){
                        if( this.deb ) console.log(' looking for client .....'+JSON.stringify(t.clients));
                        for( let c of t.clients ){
                            if( this.deb ) console.log('   .... client:',c);
                            if( cDone.indexOf( c.name ) == -1 && `${c.name}`.startsWith('q2BQ2ws.') && c.name != payload['name'] ){
                                c.cb( '$SYS/client/subscribe', {
                                    name: 'ws',
                                    topic: payload['topic']
                                } );
                                cDone.push( c.name );
                            }
                        }
                    }
                    
                    
                    this.setHash = true;
                }
            }
        }
    
    }
}

class qqBridge_qq2_to_ws{

    constructor( qqBName ){
        this.qqBridgeList = [];
        this.qqBName = qqBName;
        this.setHash = false;
        this.deb = false;
        this.buff = [];
        this.bufIter = -1;
    }

    parse = ( topic, payload ) => {
        if( this.deb ) console.log('qqBridge_q2_ws ('+wsInIsOk+') ('+this.qqBName+') got \ntopic:  ',topic, '\npayload:  ',payload);
        
        if( wsInIsOk == false){
            this.buff.push( [ topic, payload] );
            console.log(' qq2 bridge ws is off ... in buffer '+this.buff.length);
            
            if( this.bufIter == -1 )
                this.bufIter = setInterval(()=>{
                    if( this.deb ) console.log(' qq2 brigde buffor look for ws online .....'+wsInIsOk );
                    if( wsInIsOk ){
                        clearInterval( this.bufIter );
                        this.bufIter = -1;
                        for( let m of this.buff ){
                            console.log('   qq2 bridge dump buffer .... '+m[0]);
                            sOutSend('q2:'+JSON.stringify({ 
                                    topic:m[0], 
                                    name: m[1],
                                } ) );
                        }
                        this.buff = [];
                    }
                },500);

            return 1;
        }

        if( topic != undefined && payload != undefined ){
            if( topic == '$SYS/client/subscribe' ){
                if( this.deb ) console.log('qqBridge_q2_ws, subscribe');

                if( this.qqBridgeList.indexOf( payload ) == -1 ){


                    if( payload['name'] != this.qqBName && payload['name'] != 'ws' ){
                        if( this.deb ) console.log('qqBridge_q2_ws, subscribe send to ws ');

                        sOutSend(`q2:{"subscribe":"${payload['topic']}","name":"${this.qqBName}"}`);
                        let byC = q2.getByClient();    
                        let subslist = [];                
                        for( let c of Object.keys(byC) ){
                            let client = byC[ c ];
                            if( !c.startsWith('q2BQ2ws.') && !c.startsWith('ws_2_qqC') ){
                                for( let t of client ){
                                    if( this.deb ) console.log('qq2 bridge late sub ',t);
                                    subslist.push( t );                                    
                                }
                            }
                        }
                        setTimeout(()=>{
                            sOutSend(`q2:`+JSON.stringify({"subslist": subslist,"name":this.qqBName}));
                        },500);
                            
                    }else if( payload['name'] == 'ws' && payload['topic'].startsWith('$SYS/') == false ){
                        if( this.deb ) console.log('qqBridge_q2_ws, subscribe build local q2.on( .... ');
                        
                        q2.on( this.qqBName, payload['topic'], (t,p)=>{
                            sOutSend( `q2:`+JSON.stringify({topic:t,payload:p}) );
                        } );
                    }
                }

                this.qqBridgeList.push( payload );

            }else if( topic == '$SYS/client/unsubscribe' ){
                console.log('qqBridge_q2_ws, unsubscribe');
                this.qqBridgeList.pop( qqBridgeList.indexOf(payload) );
                //sOutSend(`q2:{"unsubscribe":"${payload},"name":"${qqBName}"}`);
            }
        }else{
            console.error( 'qqBridge_q2_ws - wrong frame of msg ....' );

        }
        //window['qqBri'] = this.qqBridgeList;

        //sOutSend('q2:{"wsqqclientdump":1}');
    }
}

export{ qqBridge_qq2_to_ws, qqBridge_ws_to_qq }