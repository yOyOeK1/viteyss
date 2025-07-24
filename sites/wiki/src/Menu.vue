<template>
  Menu [{{ current }}]:
  <span v-for="( item, index ) in mdList" >
       | <a @click="setCurrent(item)" :key="index">{{ item }}</a>
  </span>
</template>

<script>
//import yssWiki from '/wikiSites/yss.md'
//import {mdList} from './getList'
import { ref } from 'vue';

export default {
    data(){
        let mdList = ref([ 'yss', 'viteyss', 'need to load ...' ]);
        let current = ref(0);



        return { mdList, current };
    },
    methods:{
        setCurrent(name){
            console.log("setCurrent",name,'\n\n');
            this.current = name;
            pager._page.loadNew(name);
        }
    }

}
</script>