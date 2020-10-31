<template>
    <annotator 
      ref="annotator"
      :id="config.id" 
      :data="config.data.embedded.document" 
      :options="getOptions"
      @select = "onSelectNodes"
    ></annotator>
</template>

<script>

  import annotator from "@/components/core/ext/nlp/annotator.vue"
  import { getParent, getSiblings } from "@/components/core/ext/nlp/utils.js"

  import djvueMixin from "@/mixins/core/djvue.mixin";
  import listenerMixin from "@/mixins/core/listener.mixin";
  import { extend, template, templateSettings, isArray, keys, findIndex, flattenDeep } from "lodash"
  import { v4 } from "uuid/dist"


<<< if( jace.mode == "development") { >>>  
  import NlpAnnotatorConfig from "./nlp-annotator-config.vue";
<<< } >>>  
  
  

  

  let compile = (_template,context) => {
     templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    let result = template(_template)(context)

    templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

    return result
    
  }

  

 export default  {
    
    name:"nlp-annotator-widget",

    components:{
      annotator
    },

    icon: "mdi-format-color-highlight",

    mixins:[djvueMixin, listenerMixin],

    props:["config"],

    methods:{

    onSelectNodes(selection){
      if(this.config.data.embedded.events){
        let event = this.config.data.embedded.events.select || "select-nodes"
        this.emit(event, selection)  
      }
    },


    createAnnotation(annotation){
      return selection => {
        if(selection.length == 0) return

        let parent = getParent(selection[0], this.config.data.embedded.document)
        let start = findIndex(parent.childs, node => node.id == selection[0].id)
        let stop = findIndex(parent.childs, node => node.id == selection[selection.length-1].id)
        let childs = parent.childs.splice(start, stop-start+1)
        let newAnnotation = {
          type: annotation,
          childs,
          id: `${this.config.id}-${v4()}`
        }

        parent.childs.splice(start, 0, newAnnotation)

        this.$nextTick(() => {this.$refs.annotator.select(newAnnotation)})

        if(this.config.data.embedded.events){
          let event = this.config.data.embedded.events.create || "create-annotation"
          this.emit(event, newAnnotation)  
        }
    
      }
      

    },

    removeAnnotation(selection){
      if(selection.length == 0 || selection.length > 1) return

      let parent = getParent(selection[0], this.config.data.embedded.document)
      let pos = findIndex(parent.childs, node => node.id == selection[0].id)
      parent.childs.splice(pos,1)
      parent.childs.splice(pos,0,selection[0].childs)
      parent.childs = flattenDeep(parent.childs)
      
      if(this.config.data.embedded.events){
        let event = this.config.data.embedded.events.remove || "remove-annotation"
        this.emit(event, selection[0])  
      }
      
      this.$nextTick(() => {this.$refs.annotator.select(selection[0].childs)})
      this.onUpdate({data:this.config.data.embedded})
    },
      
    getOptions(){
      if(!this.config) return {}
      let self = this  
      return {

            availableSelectionMode(){
              return ["singly", "bundly"]
            },

            menu(node){
              if (!keys(self.config.data.embedded.selection).includes(node.type)) return
  
              if(self.config.data.embedded.availableAnnotation.includes(node.type)){
                return [{
                  title:`Remove annotation "${node.type}"`,
                  action: self.removeAnnotation
                }]
              } else {
                return self.config.data.embedded.availableAnnotation.map( item =>({
                  title:`Annotate as "${item}"`,
                  action: self.createAnnotation(item)
                }))
              }
            }, 

            
            selectable(node){ 
              return (self.config && self.config.data.embedded.selection) 
                            ? ( self.config.data.embedded.selection[node.type] )
                                ? ( isArray( self.config.data.embedded.selection[node.type] ) )
                                    ? self.config.data.embedded.selection[node.type]
                                    : self.config.data.embedded.selection[node.type].split(",").map( item => item.trim())
                                : null
                            : null            
            },

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
                                ? self.config.data.embedded.decoration.label[node.type] 
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
      })
    },

<<< if( jace.mode == "development") { >>>
      onReconfigure (widgetConfig) {
       return this.$dialogManager.showAndWait(NlpAnnotatorConfig,{width:"90%"}, {config:widgetConfig})  
      },
<<< } >>>      

  },

    created(){ 
    },

    mounted(){ this.$emit("init") },
    
      

  }

</script>	
