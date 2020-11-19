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
  import * as utils from "@/components/core/ext/nlp/utils.js"

  import djvueMixin from "@/mixins/core/djvue.mixin";
  import listenerMixin from "@/mixins/core/listener.mixin";
  import { extend, template, templateSettings, isArray, keys, findIndex, flattenDeep, flatten } from "lodash"
  import { v4 } from "uuid/dist"


<<< if( jace.mode == "development") { >>>  
  import NlpResolverConfig from "./nlp-resolver-config.vue";
<<< } >>>  
  
  

  

  let compile = (_template,context) => {
     templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    let result = template(_template)(context)

    templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

    return result
    
  }

  

 export default  {
    
    name:"nlp-resolver-widget",

    components:{
      annotator
    },

    icon: "mdi-source-merge",

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


    onSelectNodes(selection){
      if(this.config.data.embedded.events){
        let event = this.config.data.embedded.events.select || "select-nodes"
        this.emit(event, selection, this)  
      }
    },


    createAnnotation(annotation){
      return selection => {
        if(selection.length == 0) return

        let parent = utils.getParent(selection[0], this.config.data.embedded.document)
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
          this.emit(event, newAnnotation, this)  
        }

        if(this.config.data.embedded.events){
          let event = this.config.data.embedded.events.change || "change-document"
          this.emit(event, this.config.data.embedded.document, this)  
        }
    
      }
  
    },

    nestingTest( node, annotation){
      let a = this.config.data.embedded.availableAnnotation[annotation]
      if(!a) return true
      a.nestedIn = a.nestedIn || [] 
      let parent = utils.getParent(node, this.config.data.embedded.document)
      return (parent && a.nestedIn.includes(parent.type)) || a.nestedIn.length == 0
    },

    _remove(selection){
      if(selection.length == 0 || selection.length > 1) return

        
      let parent = utils.getParent(selection[0], this.config.data.embedded.document)
      if(parent){
        let pos = findIndex(parent.childs, node => node.id == selection[0].id)
        parent.childs.splice(pos,1)
        parent.childs.splice(pos,0,selection[0].childs)
        parent.childs = flattenDeep(parent.childs)
        
        parent.childs.forEach( child => {
          if (!this.nestingTest(child, child.type)) this._remove([child])
        })  
      }
     
      if(this.config.data.embedded.events){
        let event = this.config.data.embedded.events.remove || "remove-annotation"
        this.emit(event, selection[0], this)  
      }

      if(this.config.data.embedded.events){
        let event = this.config.data.embedded.events.change || "change-document"
        this.emit(event, this.config.data.embedded.document, this)  
      }
  
    


    },

    removeAnnotation(selection){
      this._remove(selection)
      this.$nextTick(() => {this.$refs.annotator.select(selection[0].childs)})
      this.onUpdate({data:this.config.data.embedded})
    },


    resolveBranch(selection){
      // console.log("RESOLVE", selection)
      let branch = selection[0]
      let diff = utils.getParent(branch, this.config.data.embedded.document)
      let parent = utils.getParent(diff, this.config.data.embedded.document)
      // console.log(branch, diff, parent,findIndex(parent.childs, node => node.id == diff.id))
      
      parent.childs.splice(
        findIndex(parent.childs, node => node.id == diff.id),
        1,
        branch.childs
      )

      parent.childs = flatten(parent.childs)
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
              if(!node) return

              return (node.type == "BRANCH") 
                ? [{
                    title:node.name,
                    action: self.resolveBranch,
                    icon:"mdi-source-pull"
                  }]
                : null  
            }, 

            
            selectable(node){ 
              return  (node)
                        ? (node.type == "BRANCH")
                          ? ["singly","wrap"]
                          : null
                        : null                
            },

            classes(node){ 
              return   (node)
                        ?  (self.config && self.config.data.embedded.decoration.classes) 
                                ? self.config.data.embedded.decoration.classes[node.type] 
                                : null
                        : null        
            },

            color(node){
              return   (node)
                        ?  (self.config && self.config.data.embedded.decoration.color) 
                                ? self.config.data.embedded.decoration.color[node.type] 
                                : null
                        : null        
            },
            
            label(node){
              // console.log(node.type)
              // if(node.type == "BRANCH"){
              //   console.log(self.config.data.embedded.decoration.label[node.type], {node})
              //   console.log(compile(self.config.data.embedded.decoration.label[node.type], {node} ))
                 
              // }
              return   (node)
                        ?  (self.config && self.config.data.embedded.decoration.label) 
                                ? compile(self.config.data.embedded.decoration.label[node.type], {node} )
                                : null
                        : null        
            },
            
            tooltip(node){
              if (!self.config) return null
              return   (node)
                        ?  (self.config && self.config.data.embedded.decoration.tooltip && self.config.data.embedded.decoration.tooltip[node.type]) 
                                ? compile(self.config.data.embedded.decoration.tooltip[node.type], {node} ) 
                                : null
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
       return this.$dialogManager.showAndWait(NlpResolverConfig,{width:"90%"}, {config:widgetConfig})  
      },
<<< } >>>      

  },

    created(){ 
    },

    mounted(){ this.$emit("init") },
    
      

  }

</script>	
