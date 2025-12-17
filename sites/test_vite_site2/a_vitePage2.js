
import { mt1 } from "./moduleTest1.js"
import mApp from './assets/mApp.vue'
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
    return `test viteyss`;
  }

  get getDefaultBackgroundColor(){
    return "#ffffff";
  }

  getHtml = () => {
    return '<b>'+this.getName+'</b>'+
`<pre>
<b>This is a site served by vite</b>
In Menu: ${this.getName}
Home url: ${this.homeUrl}
Ver: ${this.instanceOf.ver}
<hr>

<b>include value from file</b>
More ditails in \`./site.json\`

* from module -> mt1: ${JSON.stringify(this.mt1)}
* ...
no comments
</pre>
<hr>
<br>
<b>Make vue app from vite ...</b><br>
<div id="vAppFromVite">?</div>

<hr>
<br>
<b>uplad file to /apis/upload</b><br>
<form id="uploadForm">
  <input type="text" name="myTextValu" value="valTest1" >
  <input type="file" name="myFile" id="myFileId">
  <input type="button" name="send" value="send It" id="sendBtId">
</form>

<br>
<hr>
<b>test echo at /apis/echo</b><br>
<input type="button" value="send to echo" id="btSendToEcho" /><br>

<hr>
<b>test ws indentification client stack:</b><br>
<input type="button" value="get clients" onclick="sOutSend('wsGetClients:');"/>
<input type="button" value="register me" onclick="sOutSend('wsClientIdent:vite-test-page');"/>


<br><br><br><br>


`;
  }

  getHtmlAfterLoad = () =>{
    cl(
      this.getName+
      " - getHtmlAfterLoad()"
    );

    this.mAppVite = createApp(mApp).mount('#vAppFromVite');


    $('#sendBtId').click(()=>{
      cl('click');
      var formData = new FormData();
      
      var fileInput = document.getElementById('myFileId');
      var file = fileInput.files[0]; // Get the first selected file
      formData.append('myFile', file); // 'file_field_name' is the name the server expects
      formData.append('other_field', 'some_value');

      fetch('/apis/upload', { 
        method: 'POST',
        body: formData // The FormData object is directly passed as the body
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json(); // Or response.text() depending on server response
      })
      .then(data => {
          console.log('Upload successful:', data);
      })
      .catch(error => {
          console.error('Upload failed:', error);
      });

    });


    $('#btSendToEcho').click(()=>{
      cl('click');
      var formData = new FormData();
      
      formData.append('it_is_a_test', true);
      formData.append('other_field', Date.now());
      formData.append('action_type', 'test /apis/echo');

      let res = fetch('/apis/echo', { 
        method: 'POST',
        body: formData // The FormData object is directly passed as the body
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json(); // Or response.text() depending on server response
      })
      .then(data => {
          console.log('echo successful:', data);
      })
      .catch(error => {
          console.error('echo failed:', error);
      });


      console.log('after click after feth res ',res);

    });


  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg \n`);//+JSON.stringify( r,null,2 ));

    if( r.wsClients ){
      console.log('nice');

      for( let client of r.wsClients ){
        if( client.wsCID )
          console.log('wsClient ',client.wsCID);
        else
          console.log('wsClient ','unregistered');
      }

    }

  }

}

export { s_vitePage2 };
