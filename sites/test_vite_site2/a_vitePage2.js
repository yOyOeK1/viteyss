
import { mt1 } from "./moduleTest1.js"
import mApp from '../../src/mApp.vue'
import { createApp,defineComponent } from 'vue'

//a xx 3
class s_vitePage2{

  constructor(){
    cl(`${this.getName} init ....`);
    cl(`${this.getName} using imports from modules ecosystem ....mt1`+mt1);
    this.mt1 = mt1;
    this.mAppVite = -1;

  }

  get getName(){
    console.log('vite 2 get name !');
    return `test vite 2 ?`;
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml = () => {
    return '<b>'+this.getName+'</b>'+
`<pre>
* from module -> mt1: ${JSON.stringify(this.mt1)}
* ...
</pre>
<hr>
<b>This is a site served by vite</b>
no comments

<hr>
<b>Component from vite</b><br>
<div id="vAppFromVite">?</div>
`;
  }

  getHtmlAfterLoad = () =>{
    cl(
      this.getName+
      " - getHtmlAfterLoad()"
    );

    this.mAppVite = createApp(mApp).mount('#vAppFromVite');

  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);
  }

}

export { s_vitePage2 };
