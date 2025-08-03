### Current 

Not so good :( but !

#### life cicle of site

1. include / import
2. init
3. put into array and json
4. invoke of `getHtml` then `svgDyno`
5. fallowd by `getHtmlAfterLoad()` then `svgDynoAfterLoad()`
6. on page left site gets `onPageLeft()`

Cia

#### at site change

On every site change you go from
life cicle of site step `4.`, `5.`
Site is considure to be loaded, **interactive**.

now what?
on change site go do `at site change`


#### ws vite Hot 

* client site asVite module can define task to perform
    ```js
    this.hotTaskStart({topic:'get/getMdsList'}).then((msg)=>{
        this.menu._instance.ctx.$data.mdList=msg.list;
    }).catch( (err)=>{
        console.error(' Not able to get task mdList done :(');
    } );
    ```

* server site asVite module can define task performer executor
    - by setting `this.hotKey` to string walue and invocing `this.hotRegisterOn()` you will get only from your define `this.hotKey` type hot message to `hotTasksCallBack(msg)` it neet do be define.
    - there is `this.sendIt(msg);` to respond.
    - by setting up function `onMsg( msg )` in your class you can proccess all trafic
    ```js
onMsg( msg ){
    if( msg.topic == 'get/getMdsList' && msg.th !=undefined ){
        msg['list'] = ['aa','bb'];
        this.sendIt(msg);
    }
}

    ```


#### ws support

Site is supported with some functions to use WebSocket.

* client site
    - sending by `sOutSend("msg");`
    - internal operations using prefix of message to manipulate actions on server site by sending message with prefix
        - `sOutSend("wsClientIdent:TrustyWorker")` will register your client as `TrustyWorker` but it's for all sites. All of them have same WebSocket client
        - `wsSendToWSID:TrustyWorker:{"abc":1,"open":"yes"}` to send directly to client with Identificator `TrustyWorker`

* server site
    When you set you site to have server site file by using `modsrc` in `site.json` it can use some build in futures of local WebServer

    - if class have `onWsMessageCallBack=(ws, event, msg){}` it will recive messages and it can process it.
    - in `constructor()` of your class set `this.wsPrefferPrefix = 'yourPrefix:';` so it will recive messages with this prefix. This class need to have `onWsByPrefix=(ws,event,msg)=>{}`
    - if you sure that is only message for your. `return 1;` so stack will stop looking for correct processing class.
    - using `this.wss.sendToAll( ws, JSON.stringify(yourData), 'senderName')`
    - using `ws.send(msg)` to respond to this client