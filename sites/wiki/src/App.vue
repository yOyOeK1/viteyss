<template>
  <b> this is App.vue</b><br>
  <span v-html="md"></span>
</template>

<script>
//import yssWiki from '/wikiSites/yss.md';
import { ref } from 'vue';

export default {
  components: {
    //yssWiki:-1,
  },
  data(){
    let md = ref('not set');
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