<template>
  <div class="wikiContent" v-html="md" ref="myWikiContent"></div>
</template>
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
  
  h1, h2, h3 {
    color: #333;
    line-height: 0.8;
    
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

<script>
//import yssWiki from '/wikiSites/yss.md';
import { ref } from 'vue';

export default {
  components: {
    //yssWiki:-1,
  },
  data(){
    let md = ref('Select one from menu ...<br><br><center><img src="/icons/ico_viteyss_128.png"><br><b>Welcome to '+
      '<a href="javascript:pager._page.loadNew(\'README\');">Wiki</a> in <b>'+
      '<a href="javascript:pager._page.loadNew(\'viteyss\');">viteyss</a></b></b></center><br><br><br>');
    return {
      md
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