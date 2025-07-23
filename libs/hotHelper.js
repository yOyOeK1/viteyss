
class hotHelperServer{

    
    constructor( ws ){
        this.ws = ws;
    }


    sendIt( msg ){
        this.cl(`send ${this.wskey} to client ...`);
        this.ws.send({ type: 'custom', event: 'S2C'+this.wskey,
            data: msg
        });
    }


    onMsg( msg ){
        this.cl( " got msg: ");this.cl(msg);
    }

}

class hotHelperClient{
    constructor(){
        
    }

    hotSend( msg ){
        window.Hot.send('C2S'+this.hotKey,{
          topic: msg.topic,
          payload: msg.payload
        });
    }

    hotRegisterOn(){
        if( window['Hoty'] ){
            window['Hoty'].on('S2C'+this.hotKey, (msg)=>{
                this.onHotMessageCallBack(msg);
            });
        }
    }
}

export { hotHelperServer, hotHelperClient }