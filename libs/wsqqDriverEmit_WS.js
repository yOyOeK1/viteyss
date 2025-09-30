
let wsqqDriverEmint_WebSocket = function( client, topic_, payload_){
    client['ws'].send( JSON.stringify({
        topic: topic_,
        payload: payload_
    }));
}

export{ wsqqDriverEmint_WebSocket }