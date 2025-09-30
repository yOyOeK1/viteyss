console.log('Hello main.js');

import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

import { createApp } from 'vue'
import mApp from './mApp.vue'

import { wsqqDriverEmint_yss } from '../libs/wsqqDriverEmit_yss.js'
import { getSystemIdent } from '../libs/getBrowserName.js';
import { installSitesToQQS } from '../libs/sitesToQQS.js';
import { wsqqYssTookOwerWs_install } from '../libs/wsqqYssTookOverWs.js';

window['thisClientIdent'] =  getSystemIdent();



// install qqS
// so puts it's self infront of 
// `window.pager.callCurrentPage_onMessageCallBack`
console.log('qqS installation ... wsqqYssTookOwerWs_install(); ... main.js call');
wsqqYssTookOwerWs_install();


// sites loaded and install no qqS
// subscriptions for sites with defined trafic
console.log('sites to qqS ..... installSitesToQQS(); ... main.js call');
installSitesToQQS();
// sites loaded DONE





window.viteMksite = ()=>{
  $("#viteapp").html("hello");

  window.viteObjsite=createApp( mApp ).mount( '#viteapp' );

}


if (import.meta.hot) {
  window['Hoty'] = import.meta.hot;
  console.log("have HOT");
  console.log("have HOT", import.meta.env);
  console.log("have HOT", import.meta);

 
  window['Hot'] = import.meta.hot;

  if(0 ){
    setInterval(()=>{
      //console.log('hot - send customm ping ...');
      window['Hot'].send('hot-custom-testC2S', {
        topic:'test/ping', payload:''
      });
    },5000);
  }

  import.meta.hot.on("hot-custom-ping", (newModule) => {
    //console.log('hot - ping: ', newModule);
    
  });




  const count = 1;
  import.meta.hot.accept((newModule) => {
    console.log('updated: count is now ', newModule);
    
  });

  


}else{
  console.log("no have HOT");
}



if( 0 ){

  document.addEventListener('DOMContentLoaded', function() {
    
    
    document.querySelector('#app').innerHTML = `
    this is injection from main.js
    <div>
    <a href="https://vite.dev" target="_blank">
    <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
    <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite! :) hym</h1>
    <div class="card">
    <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
    Click on the Vite logo to learn more
    </p>
    </div>
    `;
    
    
    setupCounter(document.querySelector('#counter'))
    
    window.addEventListener("hashchange", (event) => {
      console.log('page change!');
    });
  });
  
}