<template>
   <v-container fluid class="pa-1">
      <v-flex xs12>
        
        <editor
          v-if="!isProductionMode"       
          :content="config.data.script" 
          lang="dps" 
          :sync="true"
          @change="onUpdateSource"
          style="border:1px solid #999"
        > 
        </editor>
        <highlight
          v-else 
          :content="config.data.script" 
          lang="dps"
        >
        </highlight>
      
      </v-flex>
  </v-container>  
</template>

<script>

  import djvueMixin from "@/mixins/core/djvue.mixin.js";
  import listenerMixin from "@/mixins/core/listener.mixin.js";

  // import * as _ from "lodash"
  // import moment from "moment"
  
  let components = {
        editor: () => import("@/components/core/ext/ace-editor.vue"),
        highlight: () => import("@/components/core/ext/ace-highlight.vue") 
    }

   

 export default  {
    
    name:"dps-highlight-widget",

    icon: "mdi-code-braces",

    components,

    mixins:[djvueMixin, listenerMixin],

    methods:{

      onUpdateSource (value) {
          this.config.data.script = value
          this.setNeedSave(true)
      }

    },

    
    props:["config"],

  
    mounted(){
       this.$emit("init")
    }

  }

</script>	
<style scoped>
  .editor {
    width: 100%;
    font-size: 12px;
  }
</style>