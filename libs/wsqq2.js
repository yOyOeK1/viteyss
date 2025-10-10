import { topicPatternChk } from "./topicPatternHelp.js";


class qq2{

    constructor( onSite = 'client' ){

        this.topics = [
            {topic: '$SYS', clients:[] }
        ];
        this.stats = {
            'send':0, 'got':0,
            onSite: onSite
        };

        this.deb = false;
    }

    getName = () =>{
        return this.stats.onSite;
    }

     lookForTopic=( topicStr )=>{
        for( let t of this.topics ){
            if( t.topic == topicStr )
                return t;
        }
        
        this.topics.push( {topic: topicStr, clients: [] } );
        return this.topics[ this.topics.length-1 ];
    }

    getAllTopics=()=>{
        let tr = [];
        for( let t of this.topics )
            tr.push( t.topic );
        return tr;
    }

    dump=( returnAs = 'console.log' )=>{
        if( returnAs == 'console.log'){
            console.log('qq2 dump\n'+JSON.stringify(this.topics,null,4) );
            console.log('qq2 dump - status\n'+JSON.stringify(this.stats,null,4) );
        }else if( returnAs == 'json'){
            return {
                name: this.getName(),
                topics: this.topics,
                allTopics: this.getAllTopics(),
                allByClient: this.getByClient(),
                stats: this.stats
            };
        }
    }

    getByClient=()=>{
        let tC = {};
        for( let t of this.topics ){
            for( let c of t.clients ){
                if( `${c.name}` in tC ){
                    tC[ `${c.name}` ].push( t.topic );
                }else{
                    tC[ `${c.name}` ] = [ t.topic ];
                }

            }
        }
        return tC;
    }


    sysParser=( topic, payload, opts )=>{
        if( topic == '$SYS/cmd' ){
            console.log('qq2sysParse /cmd .... '+payload);
            return true;
        }


        return false;
    }


    emit=( topic, payload, opts = {} )=>{
        if( this.sysParser( topic, payload, opts ) ){
            return true;
        }

        this.stats.got++;
        for( let t of this.topics ){
            if( topicPatternChk( topic, t.topic ) && t.clients.length>0 ){
                for( let c of t.clients ){
                    if( 'skipClient' in opts && opts['skipClient'].indexOf( c.name ) != -1  ){
                        if( this.deb ) console.log('qq2 emit skipp ...');

                    }else if ( 'src' in opts && c.name.startsWith('q2BQ2ws.') && topic.startsWith('$SYS/') == false ){
                        if( this.deb ) console.log('qq2 emit src skipp ...as emit : '+topic+' to '+c.name+' have opts:'+JSON.stringify(opts) );

                    }else{
                        setTimeout(()=>{
                            if( this.deb ) console.log('qq2 emit['+this.getName()+']  ... as emit : '+topic+' to '+c.name+' have opts:'+JSON.stringify(opts) );
                            c.cb( topic, payload );
                            this.stats.send++;
                        },1);
                    }
                }
            }
        }

    }


    on = ( clientName, topic, callBack )=>{
        //console.log('q2.on -> ','\n',clientName, '\n',topic, '\n',callBack,'\n-----------------' );
        let lRes = this.lookForTopic( topic );
        lRes.clients.push( { name: clientName, cb: callBack } );
        if( this.deb ) console.log(this.getName()+' on 1 clientName:'+clientName,callBack);
        this.emit('$SYS/client/subscribe',{name: clientName, topic:topic} );
        
    }
    off = ( clientName, topic, callBack )=>{
        let lRes = this.lookForTopic( topic );
        if( lRes != -1 ){
            let ind = lRes.clients.indexOf( { name: clientName, cb: callBack }  );
            if( ind != -1 ){
                lRes.clients.pop( ind );
                this.emit('$SYS/client/unsubscribe',topic );
            }else{
                console.error('qq2 off error2. can\'t off if not subscribe'); 
            }
        }else{
            console.error('qq2 off error. can\'t off if not subscribe');
        }
    }
}

export { qq2 }