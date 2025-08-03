<template>
    <div id="wikiMenu">
        Menu [{{ current }}]:
        <ul class="wikiMenu">
            <li v-for="( item, index ) in mdList" >
                <a @click="setCurrent(item)" :key="index">{{ item }}</a>
            </li>
        </ul>
    </div>
</template>
<style>
#wikiMenu{
    margin: 0.5em;
}

#wikiMenu li{
    line-height: 1;
}
#wikiMenu a{
    
}
</style>
<script>
//import yssWiki from '/wikiSites/yss.md'
//import {mdList} from './getList'
import { ref } from 'vue';

export default {
    data(){
        let mdList = ref([ 'yss', 'viteyss', 'need to load ...' ]);
        let current = ref(0);
        let wikiPage = ref(new Object());


        return { mdList, current, wikiPage };
    },
    methods:{
        setWikiPageParent( parent ){
            this.wikiPage = parent;
        },
        setCurrent(name){
            console.log("setCurrent",name,'\n\n');
            this.current = name;
            this.wikiPage.loadNew(name);
        }
    }

}
</script>