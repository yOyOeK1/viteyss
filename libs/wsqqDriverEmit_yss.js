let wsqqDriverEmint_yss = function( client, topic_, payload_){
    sOutSend( JSON.stringify({
        topic: topic_,
        payload: payload_
    }));
}

export{ wsqqDriverEmint_yss }
