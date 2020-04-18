<template>
  <<< if( jace.mode == "development") { >>>
   <v-container fluid class="pa-1">
      <v-flex xs12>
        <v-row class="mx-0 px-0 my-2">
          <v-spacer></v-spacer>
          <span class="caption secondary--text px-2 mx-0">{{config.data.embedded.lang}}</span>
        </v-row>
      </v-flex>  
      <v-flex xs12>
        <editor
          v-if="!isProductionMode || !config.data.embedded.readOnly"       
          :content="config.data.script" 
          :lang="config.data.embedded.lang" 
          :sync="true"
          @change="onUpdateSource"
          style="border:1px solid #999"
        > 
        </editor>
        
        <highlight
          v-else 
          :content="config.data.script" 
          :lang="config.data.embedded.lang" 
        >
        </highlight>
      
      </v-flex>
      <v-flex xs12 v-if="config.data.embedded.button">
        <v-row class="mx-0 px-3">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="resolve">{{config.data.embedded.button.title}}</v-btn>
        </v-row> 
      </v-flex>

    </v-container>
  <<< } else { >>>
    <v-container fluid class="pa-1">
      <v-flex xs12>
        <highlight
          :content="config.data.script" 
          lang="dps"
        >
        </highlight>
      
      </v-flex>
    </v-container>
  <<< } >>>  
</template>

<script>

  import djvueMixin from "@/mixins/core/djvue.mixin.js";
  import listenerMixin from "@/mixins/core/listener.mixin.js";

    
  let components = {
      <<< if( jace.mode == "development") { >>>
    
        editor: () => import("@/components/core/ext/ace-editor.vue"),
  
      <<< } >>>

        highlight: () => import("@/components/core/ext/ace-highlight.vue") 
    }

<<< if( jace.mode == "development") { >>>  
  import EduEditorConfig from "./edu-editor-config.vue";
<<< } >>>

   

 export default  {
    
    name:"edu-editor-widget",

    icon: "mdi-code-braces",

    components,

    mixins:[djvueMixin, listenerMixin],

    methods:{

      onUpdate ({data}) {
        this.config.data.script = data;
      },

      onUpdateSource (value) {
          this.config.data.script = value
          this.setNeedSave(true)
      },

      resolve(){
        let event = this.config.data.embedded.button.event || "run-editor-script"
        this.emit(event, this.config.data.script) 
      },

<<< if( jace.mode == "development") { >>>
      onReconfigure (widgetConfig) {
       return this.$dialogManager.showAndWait(EduEditorConfig, {width:"90%"},{config:widgetConfig})
      },
<<< } >>>

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
    font-size: 14px;
    border: 1px solid #dedede;
  }
</style>