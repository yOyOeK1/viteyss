<template>
  <div class="wikiContent" v-html="md" ref="myWikiContent"></div>
</template>

<script>
//import yssWiki from '/wikiSites/yss.md';
import { ref } from 'vue';
//import TableOfCont from './tableOfCont.vue';

export default {
  components: {
    //yssWiki:-1,
    //'wikitableofcont':TableOfCont
  },
  data(){
    let md = ref('Select one from menu ...<br><br><center><img src="/icons/ico_viteyss_128.png"><br><b>Welcome to '+
      '<a href="javascript:pager._page.loadByName(\'README\');">Wiki</a> in <b>'+
      '<a href="javascript:pager._page.loadByName(\'viteyss\');">viteyss</a></b></b></center><br><br><br>');
      
    //let tabofcon = ref('ok let do it');

    return {
      md, //tabofcon
    };
  },
  methods:{
    /*
    async loadNew( fileName ){
      let fullFileName = `wikiSites/${fileName}.md`;
      console.log('full file name: '+fullFileName);
      let loadIt = await import(fullFileName).then((o)=>{
        console.log('loaded md file !',o);
      });
      // = mdCon;
    }
      */
  }
}
</script>
<style>

.wikiContent {
	margin: 1em;
  overflow-y: auto;

}
.mdTasks{
  padding: 0px;
  position: relative;
  left: -7px;
}

#appWikiPage {

  img{
    max-width: 100%;
  }
  
  legend {
    line-height: 0.8;
    padding: 10px;
    background-color: rgb(255, 255, 255);
    border: gray 1px solid;
    border-radius: 15px; 
  }
  h1, h2, h3, h4, h5, h6, fieldset {
    color: #333;
    line-height: 0.8;
    padding: 10px;
    background-color: rgb(213, 255, 170);
    border-radius: 15px;    
	}
  
	
	p {
		margin-bottom: 1em;
    line-height: 1.2;
	}
	
	code {
		background-color: #f4f4f4;
		padding: 2px 4px;
		border-radius: 3px;
	}
	
	pre code {
		display: block;
		padding: 1em;
		overflow-x: auto;
	}
}
</style>