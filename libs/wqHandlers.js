

let mstat = {
    running: false
};

function getSrc( addIt ){
    return ['and',q2.getName(),'s_vysmapleafletPage',addIt];
}


function showOnMap( msg ){
    console.log('showOnMap - > '+msg['topic']+'         ['+msg['payload']+']');

    if( msg['topic'].endsWith("/cmd") ){

        if( msg['payload'] == 'ping' ){
            q2.emit( 'and/showOnMap/res', 'pong' );

        }else if( msg['payload'] == "?"){
            q2.emit( 'and/showOnMap/res', {
                "src": getSrc('showOnMap'),
                "name":"showOnMap",
                'status': mstat,
                'in_min':['lat','lng','zoom']
            } );
        }

    }

}

function wqHandlerr_install( siteO ){
    console.log('wqHandlerr_install ....');
    siteO['q2_showOnMap'] = showOnMap;
}

export { wqHandlerr_install, showOnMap }