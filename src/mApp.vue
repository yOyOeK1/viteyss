<template>
<div>
    [{{ msg }}] - hello from mApp.vue
    This is comming from vite <b>jak?</b>

    <fieldset id="fieldset0">
        <label>This is a component from outsite</label>
        <xfood ref="myxfo"></xfood>
    </fieldset>
</div>


</template>
<script>
console.log('hello from mApp.vue \ntestDefineVal:'+testDefineVal);
import { ref } from 'vue'
import xFood from '/OT/ySS_calibration/sites/test_module_vue/comps/FoodItem2.vue'

export default{
    components:{
        'xfood': xFood
    },
    data(){

        const msg = ref('1');

        return {
            msg
        };
    }

}

</script>

<style>
#fieldset0{
    border-style: solid;
    border-width: 1px;
    border-color: gray;
}
#fieldset0 label{
    border:1px gray solid;
    background-color: lightgray;
}
</style>