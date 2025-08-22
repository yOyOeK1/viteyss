<template>
    <div id="wikiMenu">

        <!--<small>
            Menu [{{ current }}]: 
            <a href="javascript:siteByKey.v_wikiPage.o.loadMdsList();">[R]</a>
        </small>
        -->


        <div data-role="collapsible-set">
 
            <div v-for="( item, index ) in Object.keys(mdListCategories)"
                data-role="collapsible"                 
                >
                
                <h3>{{ item }}</h3>
                <li v-for="( item, index ) in mdListCategories[ item ]" >
                    <a @click="setCurrent(item)" 
                        :key="index"
                        :class=" item.name==currentFull ? 'wikiMenuSel' : 'b' "
                        ><!--{{ item.category }} / -->{{ item.name }}</a>
                </li>
        
            </div>
            
           
        
        </div>


        <!--
            <ul class="wikiMenu">
                <li v-for="( item, index ) in mdList" >
                    <a @click="setCurrent(item)" 
                    :key="index"
                    :class=" item.name==currentFull ? 'wikiMenuSel' : 'b' "
                    >{{ item.name }}</a>
                </li>
            </ul>
        -->
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
.wikiMenuSel{
    border: solid 1px gray;
}
</style>
<script>
//import yssWiki from '/wikiSites/yss.md'
//import {mdList} from './getList'
import { ref } from 'vue';

export default {
    data(){
        let mdList = ref([ 'yss', 'viteyss', 'need to load ...' ]);
        let current = ref('');
        let currentFull = ref('');
        let mdListCategories = ref({});
        let wikiPage = ref(new Object());


        setTimeout(()=>{ this.updateCategories() },500);

        return { mdList, mdListCategories, current, currentFull, wikiPage };
    },
    methods:{
        setWikiPageParent( parent ){
            this.wikiPage = parent;
        },

        updateCategories(){
            this.mdListCategories = this.getMdCategories();

        },

        getMdCategories(){
            let tr = [];
            for(let i=0,ic=this.mdList.length; i<ic; i++){
                let item = this.mdList[ i ];
                console.log('item '+item.name);
                if( tr[ item.category ] == undefined ){
                    tr[ item.category ] = [ item ];
                }else{
                    tr[ item.category ].push( item );
                }
            }
            return tr;
        },
        setCurrentByPath( path, name ){
            this.setCurrent({
                'path': path,
                'name': name,
                'category': '--',
                "basename": '--'
            });
        },
        setCurrent(item){
            console.log("setCurrent",item.name,'\n\n');
            this.currentFull = item.name;
            this.current = item.category+" / "+item.name;
            this.wikiPage.loadNew(item);
        }
    }

}
</script>