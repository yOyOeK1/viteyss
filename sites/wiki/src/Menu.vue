<template>
  Menu [{{ current }}]:
  <span v-for="( item, index ) in mdList" >
       | <a @click="setCurrent(index)" :key="index">{{ item }}</a>
  </span>
</template>

<script>
//import yssWiki from '/wikiSites/yss.md'
//import {mdList} from './getList'
import { ref } from 'vue';

export default {
    setup(){
        let mdList = ref([ 'yss', 'viteyss' ]);
        let current = ref(0);



        return { mdList, current };
    },
    methods:{
        setCurrent(no){
            console.log("setCurrent",no,'\n\n');
            this.current = no;
        }
    }

}
</script>