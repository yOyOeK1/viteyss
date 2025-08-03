

class wsCallBackHelper {
    constructor( wss, ws ){
        this.cbList = [];
        this.wss = wss;
        this.ws = ws;

        this.prefixHandlers = {};
        this.prefixHandlersKeys = [];
        this.registerInternalPrefix();
        this.cl(`constructor ....`);
    }

    cl(s){
        console.log(`wsCBH  `,s);
    }

    regWsClientIdent=( ws,event,msg )=>{
        ws['wsCID'] = String(msg).substring(14);
        console.log(`regWsClientIdent [${ws['wsCID']}]`);
        ws.send('{"code":200,"status":"OK"}');
        return 1;
    }
    regWsSendToWSID =  ( ws,event,msg )=>{
        //console.log(`yyyyy  wsClientIdent got ${msg}`);
        let tmpV = String(msg).substring(13);
        let cID = tmpV.substring(0, tmpV.indexOf(':') );
        let msgToS = tmpV.substring(tmpV.indexOf(':')+1)
        let cs = this.ws.clients;
        for( let client of cs ){
             if( client['wsCID'] == cID ){
                client.send(msgToS);
                return 1;
             }
        }


        return 0;
    }

    registerInternalPrefix=()=>{
        let wsCBH = this;
        this.prefixHandlers['wsClientIdent:'] = this.regWsClientIdent;
        this.prefixHandlersKeys.push('wsClientIdent:');

        this.prefixHandlers['wsSendToWSID:'] = this.regWsSendToWSID;
        this.prefixHandlersKeys.push('wsSendToWSID:');


    }


    sendToClient( wsCID, msg ){
        this.cl(`sendToClient: -- ${wsCID} and msg... ${msg}`);
    }



    addCB( callBack ){
        this.cbList.push( callBack );
        this.cl(`add now there is .... ${this.cbList.length}`);

        if( callBack.wsPrefferPrefix ){
            this.cl(`   it have wsPrefferPrefix...."${callBack.wsPrefferPrefix}"`);

            if( this.prefixHandlers[ callBack.wsPrefferPrefix ] == undefined ){
                this.cl(`       it's empty registering...`);
                if( callBack.onWsByPrefix != undefined ){
                    this.prefixHandlersKeys.push( callBack.wsPrefferPrefix );
                    this.prefixHandlers[ callBack.wsPrefferPrefix ] = callBack.onWsByPrefix;
                    
                }else
                    this.cl(`       Oiysh it dont have receiving method onWsByPrefix`);

            } else {
                this.cl(`       ! this prefix is taken !`);
            }

        }


    }

    onWsMessage( ws, event, msg ){
        
        // prefix first from stack
        let res = 0;
        let prefix = '';
        if( event == 'on_message' ){
            for(let k=0,kc=this.prefixHandlersKeys.length; k<kc; k++){
                prefix = this.prefixHandlersKeys[k];
                //this.cl(`   do prefix chk: ${prefix}`);
                if( String(msg).startsWith( prefix ) == true  ){
                    if( 1 == this.prefixHandlers[ prefix ]( ws,event,msg ) ){
                        this.cl(`did prefixHandlers .... skipping rest of the stack `);
                        return 1;  
                    }
                }   
            }
        }

        // regular call backs 

        if( event == 'on_message' ){
            this.cbList.forEach(cb => {
                res = cb.onWsMessageCallBack( this.ws, event, msg );
                if( res == 1 ) return 1;
            });
            
            if( res == 0 ){
                this.cl(` got msg on ws in call back helper \n\tevent\n\n\t${event}\n\nmsg\n\n\t${msg} \n\nnot handled\n\n`);
                //this.cl(msg);                
            }

        }else if( event == 'on_connection' ){
            this.cl(`2 got msg on ws in call back helper \n\tevent\n\n\t${event}\n\nmsg\n\n\t${msg} \n\nnot handled\n\n`);
            this.cbList.forEach(cb => {
                if( cb.onWsConnect )
                    cb.onWsConnect( ws, event, msg );
            });
        }else{
            this.cl(`3 got msg on ws in call back helper \n\tevent\n\n\t${event}\n\nmsg\n\n\t${msg} \n\nnot handled\n\n`);
                
        }
        
    }


}

export { wsCallBackHelper }