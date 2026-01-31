<template>
    <div style="display: inline-block; background-color: #5c5247;;border-radius: 7px;margin-left:5px;:2px;border:solid gray 1px;">
        
        
        <div style="display: inline-block;">
            <input type="text" v-model="inTag" 
                :id="'divTagInput'+idIdentName"
                :placeholder="'add tag :'+getCountCharactersInTags()"
                style="width:100px"
                @keyup.enter="onAddNewTag(inTag)"
                ></input>

            <button 
                v-show="0"
                @click="onAddNewTag(inTag)">+</button>
        </div>

        <!--
            <div style="">
        -->
            <div v-for="tName,tInd in tags"
            style="display: inline-block; border:greenyellow 2px solid; border-radius: 5px;margin:2px;background-color: rgb(20 59 1);">
                &nbsp;
                {{ tName }}
                <a @click="$emit('tags-colector-remove-index',tInd)">x</a>&nbsp;
            </div>
            <!--
            </div>
            -->
        
    </div>
</template>
<script>
export default{


props:[ 'tags', 'idIdentName' ],
emits:[ 'tags-colector-add', 'tags-colector-remove-index' ],
data(){
    return {
        inTag: ''
    };
},
methods:{
    onAddNewTag( newTag ){
        if( newTag.length > 0 ){
            newTag = newTag.replaceAll(' ','-');
            this.$emit('tags-colector-add',newTag);
            this.inTag='';
        }
    },
    getCountCharactersInTags(){
        let tr = 512;
        if( this.tags == undefined ) return tr;
        for(let t of this.tags)
            tr-= t.length+2;

        return tr;
    }

}


}
</script>
