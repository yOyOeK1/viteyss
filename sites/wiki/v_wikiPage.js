
import { createApp, defineComponent, defineCustomElement } from 'vue'
import App from './src/App.vue'
import Menu from './src/Menu.vue'
import { hotHelperClient } from '/libs/hotHelper.js';


//a xx 3
class v_wikiPage extends hotHelperClient{

  constructor(){
    super();
    this.hotKey = 'wikiKey';
    
    this.hotRegisterOn(); // to get hot call backs
    this.mdsList = [];
    /*
    this.th = {
      'getList': Date.now()
    };

    this.hotSend({
      topic:'get/getMdsList', 
      payload:{ th:this.th.getList} 
    });
    */
    

  }

  onPageLeft = () =>{
    this.app.unmount();
    this.menu.unmount();
    console.log('wiki unmount vue');
  }

  get getName(){
    return `Wiki`;

  }

  get getDefaultBackgroundColor(){
    return "#ffffff";

  }

  getHtml = () => {
    this.app = createApp(App);    
    this.menu = createApp(Menu);    
    

    return `
    <!--<input type="button" id="sendMsg" value="send" />-->

    <div id="menuWiki">?</div>
    <hr>
    <div id="appWikiPage"></div>
    <hr>
    <br>
    <div
      style="position: fixed;
        bottom: 0;
        right: 0;
        z-index: 21;"
        >
      <input type="button" onclick="location.href='#';" name="goUp" 
        id="btGoUp" value="up">
    </div>
    <br><br>
    `;

  }

  loadNewByPath = ( path )=>{
    this.loadNew({
      'path': path,
      "basename": '--'
    });
  }

  loadNew = ( item )=>{
    let fullFileName = item.path;
    console.log('full file name: '+fullFileName);
    
    this.hotTaskStart({topic:'get/getMd','basename':item.basename,'fullFileName':fullFileName}).then((msg)=>{
      this.app._instance.ctx.$data.md = msg.html;
      $('.wikiContent').scrollTop();
      //this.app._instance.ctx.$refs.myWikiContent.scrollIntoView({top:0,behavior: 'smooth'})
      
      
    }).catch( (err)=>{
      let errMsg = ' Not able to get task getMD done :(';
      console.error(errMsg);
      this.app._instance.ctx.$data.md = errMsg;
      
    });
    
    /*
    setTimeout(()=>{

      this.hotTaskStart({topic:'get/ping'}, 'C2S-ping').then((msg)=>{
        cl("Got result of ping");cl(msg);        
        
      }).catch( (err)=>{
        let errMsg = ' Not able to get task ping done :(';
        console.error(errMsg);
      } );
    },500);
    */
      //$.get(fullFileName, (data )=>{
      //  this.app._instance.ctx.$data.md = String(data);
      //}, 'html');
      /*
      await import(fullFileName).then((md)=>{
        html = String(md);
        console.log('loaded md file !',html);
        /*let mdFile = defineComponent(o);
        this.app = createApp({
          components:{
            mdFile
          }
        }).mount('#appWikiPage');
      });
      */
      
      
      // = mdCon;
  }

  loadMdsList(){
    this.hotTaskStart({topic:'get/getMdsList'}).then((msg)=>{
      cl("Got result of mds list");cl(msg);
      //cl(msg.list.reverse());
      this.menu._instance.ctx.$data.mdList=msg.list;

      setTimeout(()=>{ $('#wikiMenu').enhanceWithin(); }, 500);
     
    }).catch( (err)=>{
      console.error(' Not able to get task mdList done :(');
    } );

  }

  
  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    this.app.mount('#appWikiPage');
    
    this.menu.mount('#menuWiki');
    this.menu._instance.ctx.setWikiPageParent( this );

    
    this.loadMdsList();

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
       this.hotSend({
        topic:'wiki/c2s/click',
        payload:"click!",
        customVal1: "1",
        abc: 1234
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

    /*
    if( msg.topic == 'get/getMdsList' && msg.payload.th == this.th.getList ){
      cl("Got result of mds list");
      cl(msg.payload.list.reverse());
      this.menu._instance.ctx.$data.mdList=msg.payload.list;
      //this.menu._instance.ctx.setCurrent('viteyss');
    }
    */

  }


  onMessageCallBack = ( r ) => {
    //cl( `[cb] ${this.getName} - got msg `);cl(r);

  }

}

export { v_wikiPage };
