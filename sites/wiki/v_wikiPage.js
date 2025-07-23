
import { createApp } from 'vue'
import App from './src/App.vue'
import Menu from './src/Menu.vue'
import { hotHelperClient } from '/libs/hotHelper.js';


//a xx 3
class v_wikiPage extends hotHelperClient{

  constructor(){
    super();
    this.app = createApp(App);
    this.menu = createApp(Menu);
    this.hotKey = 'wikiKey';
    this.hotRegisterOn(); // to get hot call backs
  }

  get getName(){
    return `Wiki`;

  }

  get getDefaultBackgroundColor(){
    return "#ffffff";

  }

  getHtml = () => {
    return `<b>Hello ${this.getName}</b>
    <hr>
    <input type="button" id="sendMsg" value="send" />
    <div id="menuWiki">?</div>
    <hr>
    <div id="appWikiPage">?</div>
    <hr>

    <input type="button" onclick="location.href='#';" name="goUp" value="up">
    <br><br>
    `;

  }
  
  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    this.app.mount('#appWikiPage');
    this.menu.mount('#menuWiki');
    
    /*
    // listen to server module calls
    if( window['Hoty'] ){
      window['Hoty'].on('S2C'+this.hotKey, (msg)=>{
        this.onHotMessageCallBack(msg);
      });
    }
      */

    // send client to server call
    $('#sendMsg').on('click',()=>{  
      if( window.Hot ){
        cl('send to v_wiki ...');
        /*window.Hot.send('C2S'+this.hotKey,{
          topic: 'wiki/C2S',
          payload: "hello"
        });
        */
       this.hotSend({topic:'wiki/c2s/click',
        payload:"click!"
       });
      }
    });

  }

  get svgDyno(){
    return '';

  }

  svgDynoAfterLoad(){

  }

  onHotMessageCallBack = ( msg ) =>{
    cl(`onHot Got!`);cl(msg);

  }


  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);

  }

}

export { v_wikiPage };
