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
          :content="config.data.content" 
          :lang="config.data.embedded.lang" 
          :sync="true"
          @change="onUpdateSource"
          style="border:1px solid #999"
        > 
        </editor>
        
        <highlight
          v-else 
          :content="config.data.content" 
          :lang="config.data.embedded.lang" 
          :style="config.data.embedded.style"
        >
        </highlight>
      
      </v-flex>
      <v-flex xs12 v-if="config.data.embedded.button">
        <v-row class="mx-0 px-3 my-1">
          <v-spacer></v-spacer>
          <v-btn v-for="(b,index) in config.data.embedded.button" :key="index" text :color="b.color || 'primary'" @click="resolve(index)">{{b.title || 'noname'}}</v-btn>
        </v-row> 
      </v-flex>

    </v-container>
  <<< } else { >>>
    <v-container fluid class="pa-1">
      <v-flex xs12>
        <highlight
          :content="config.data.content" 
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
  import {isArray, isString} from "lodash"
    
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
        if(isString(data)) this.config.data.content = data;
      },

      onUpdateSource (value) {
          this.config.data.content = value
          this.setNeedSave(true)
      },

      resolve(index){
        let event = this.config.data.embedded.button[index].event || "run-editor-script"
        this.emit(event, this.config.data.content, this) 
      },

<<< if( jace.mode == "development") { >>>
      onReconfigure (widgetConfig) {
       return this.$dialogManager.showAndWait(EduEditorConfig, {width:"90%"},{config:widgetConfig})
      },
<<< } >>>

    },

    
    props:["config"],

    created(){
      this.config.data.content = this.config.data.content || " "
      this.config.data.embedded.button = (this.config.data.embedded.button) ? 
        (isArray(this.config.data.embedded.button)) ? this.config.data.embedded.button : [this.config.data.embedded.button]
        : null  
    },

    mounted(){
      // console.log(this.config)
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