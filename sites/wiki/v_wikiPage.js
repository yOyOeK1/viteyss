
import { createApp } from 'vue'
import App from './src/App.vue'
import Menu from './src/Menu.vue'



//a xx 3
class v_wikiPage{

  constructor(){
    this.app = createApp(App);
    this.menu = createApp(Menu);

    
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
  }

  get svgDyno(){
    return '';

  }

  svgDynoAfterLoad(){

  }

  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);

  }

}

export { v_wikiPage };
