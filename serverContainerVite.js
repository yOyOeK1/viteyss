
import * as sws from './sharelibs/mnodehttp/serverWs.js'
import { serverVite } from './serverVite.js'

let debug = 'viteyssDebug' in process.env ? process.env.viteyssDebug:false;

class serverContainerVite{
    
    
    constructor( sNo, config, nwsCallBack = undefined ){
        this.sNo = sNo;
        this.config = config;
        this.http = undefined;
        this.ws = undefined;
        this.nwsCallBack = nwsCallBack;

        //if( nwsCallBack == undefined ){
        this.wsCallBack = this.onWsMessage;
        //}else{
        //    this.wsCallBack = nwsCallBack;
       // }
        
        
        
        this.sws = sws;//require('./serverWs');
        
        this.wsRunning = false;
        this.httpRunning = false;
        
        this.cl(`init ...`);
    }
    
    cl(str){
        if( debug ) console.log(`scov${this.sNo}`,str);
    }
    
    onWsMessage=( ws, event, msg )=>{
        let res = undefined;
        if( this.wsRunning == true && this.http ){
            res = this.http.wsCBH.onWsMessage(ws, event, msg);
            if( res == undefined && this.nwsCallBack != undefined )
                this.nwsCallBack(ws, event, msg);
        }



    }
    
    
    initServers(){
        this.cl('initServers ...');
        //this.cl(this.config);
        this.cl('   ws ...');
        this.ws = this.sws.getWsInstance( this.config, this.wsCallBack );
        this.wsRunning = true; // TODO check in nicer way if it's fine
        this.cl('   vite ...');
        //this.shh.setWs( this.ws, this.sws );
        //this.http = this.shh.getHttpInstance( this.config );
        this.http = new serverVite( this.config, this.sws, this.ws );
        this.http.mkInstance();
    }

    startServer(){
        this.cl("startServer ....");
        this.http.startServer();
        this.httpRunning = true;// TODO check in nicer way if it's fine
    }

    stopServer(){
        this.cl("stopServer ....");
        this.cl("vite stop...");
        this.http.stopServer();
        delete this.http;
        this.http = undefined;
        this.cl("ws closeall ...");
        this.sws.closeAll( this.ws , "going down by service container");
        this.cl("ws close ...");
        this.ws.close(()=>{this.cl("ws is down by service container");});
        this.cl("ws terminate ...");
        this.ws.terminate();
        this.wsRunning = false;
        delete this.ws;
        this.ws = undefined;
    }

}

export { serverContainerVite }