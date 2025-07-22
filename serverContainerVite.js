
import * as sws from 'mnodehttp/serverWs.js'
import { serverVite } from './serverVite.js'


class serverContainerVite{
    
    
    constructor( sNo, config, nwsCallBack = undefined ){
        this.sNo = sNo;
        this.config = config;
        this.http = undefined;
        this.ws = undefined;
        this.wsCallBack = nwsCallBack;
        
        this.sws = sws;//require('./serverWs');
        
        this.wsRunning = false;
        this.httpRunning = false;

        this.cl(`init ...`);
    }

    cl(str){
        console.log(`scov${this.sNo}`,str);
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
        delete this.ws;
        this.ws = undefined;
    }

}

export { serverContainerVite }