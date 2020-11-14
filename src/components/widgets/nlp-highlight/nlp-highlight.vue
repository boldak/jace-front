<template>
    <annotator 
      ref="annotator" 
      :id="config.id"
      :data="config.data.embedded.document" 
      :options="getOptions"
    ></annotator>
</template>

<script>

  import annotator from "@/components/core/ext/nlp/annotator.vue"
  import * as utils from "@/components/core/ext/nlp/utils.js"

  import djvueMixin from "@/mixins/core/djvue.mixin";
  import listenerMixin from "@/mixins/core/listener.mixin";
  import { extend, template, templateSettings } from "lodash"

<<< if( jace.mode == "development") { >>>  
  import NlpHighlightConfig from "./nlp-highlight-config.vue";
<<< } >>>  
  
  

  

  let compile = (_template,context) => {
     templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    let result = template(_template)(context)

    templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

    return result
    
  }

  

 export default  {
    
    name:"nlp-highlight-widget",

    components:{
      annotator
    },

    icon: "mdi-format-color-highlight",

    mixins:[djvueMixin, listenerMixin],

    props:["config"],

    methods:{

    getDocument(){
      return this.config.data.embedded.document 
    },
    
    getDecoration(){
      return this.config.data.embedded.decoration 
    },

    getAvailableAnnotation(){
      return this.config.data.embedded.availableAnnotation 
    },

    getSelection(){
      return this.config.data.embedded.selection
    },

    getEvents(){
      return this.config.data.embedded.events
    },

    getUtils(){
      return utils
    },

    getData(){
      return this.config.data.embedded
    },


    getOptions(){
      if(!this.config) return {}
      let self = this  
      return {
            
            
            classes(node){ 
              return (self.config && self.config.data.embedded.decoration.classes) 
                                ? self.config.data.embedded.decoration.classes[node.type] 
                                : null
            },

            color(node){
              return (self.config && self.config.data.embedded.decoration.color) 
                                ? self.config.data.embedded.decoration.color[node.type] 
                                : null
            },
            
            label(node){
              return (self.config && self.config.data.embedded.decoration.label) 
                                ? compile(self.config.data.embedded.decoration.label[node.type], {node} ) //self.config.data.embedded.decoration.label[node.type] 
                                : null
            },
            
            tooltip(node){
              if (!self.config) return null
              return (self.config && self.config.data.embedded.decoration.tooltip && self.config.data.embedded.decoration.tooltip[node.type]) 
                                ? compile(self.config.data.embedded.decoration.tooltip[node.type], {node} ) 
                                : null
            }
        
      }       
    },  

    onUpdate ({data}) {
      this.config.data.embedded = {}
      this.$nextTick(() => {
        this.config.data.embedded = data
        if(this.config.data.embedded.events){
          let event = this.config.data.embedded.events.change || "change-document"
          this.emit(event, this.config.data.embedded.document, this)  
        }
      })
    },

<<< if( jace.mode == "development") { >>>
      onReconfigure (widgetConfig) {
       return this.$dialogManager.showAndWait(NlpHighlightConfig,{width:"90%"}, {config:widgetConfig})  
      },
<<< } >>>      

  },

    created(){ 
    },

    mounted(){ this.$emit("init") },
    
      

  }

</script>	
