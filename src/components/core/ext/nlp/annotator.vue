<template>
  <div>
      <tom 
        v-if="data"
        :node="data"
        :options = "options"
        @show-tooltip = "showTooltip"
        @hide-tooltip = "hideTooltip"
        @show-menu = "displayMenu"
      ></tom>
      
      <vue-selecto
        ref="selecto"
        :selectableTargets="['.selectable']"
        :hitRate="40"
        :selectFromInside="false"
        :selectByClick="true"
        @select="onSelect"
      />
      
      <v-tooltip
        top 
        :position-x="tt_x"
        :position-y="tt_y"
        :value="showTooltipModel"
        color="rgba(0,0,0,0)"
        open-delay=500
        transition="fade-transition"
      >
        <div 
          class="caption pa-2 secondary--text" 
          style="
            border-radius:5px; 
            background:#fff9c4; 
            background-opacity=0.75;
            box-shadow: 0 3px 3px -1px rgba(0,0,0,.2),0 6px 5px 0 rgba(0,0,0,.14),0 1px 9px 0 rgba(0,0,0,.12)!important;
          "
            v-html="tooltipText"
          >
        </div>
      </v-tooltip>

      <v-menu
        v-model="showMenu"
        :position-x="menu_x"
        :position-y="menu_y"
        absolute
        offset-y
        dense
      >
       
      <v-list dense>
            <v-list-item-group
              color="primary"
            >
              <v-list-item
                v-for="(item, i) in menu"
                :key="i"
                @click="item.action(selection)"
              >
                <v-list-item-icon v-if="!!item.icon">
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
            
          
  </div>    
</template>

<script>


import {VueSelecto} from "vue-selecto"
import { find, extend, first, last, slice, sortBy, isFunction, isArray } from "lodash"
import tom from "./tom.vue"
import { v4 } from "uuid/dist"
import { forEachNode, findNode } from "./utils.js"


export default {

  name: "annotator",

  props: ["data","options"],

  components: {
    VueSelecto,
    tom
  },
 
  data() {
      return {
          
          selection: [],
          
          showMenu: false,
          menu: [],
          menu_x: 0,
          menu_y: 0,

          showTooltipModel: false,
          tooltipText:"",
          tt_x:0,
          tt_y:0,
          tt_stack:[]
          
      }
  },

  watch:{
    data(value){
      if(value) 
        forEachNode(value, node => {
          node.id = node.id || v4()
        })
    }
  },
  
  methods: {
    
    
    onSelect(e) {
      this.selection = this.getSelectedItems(e.selected)  
      e.added.forEach(el => {
        el.classList.add("selected");
      })
      e.removed.forEach(el => {
        el.classList.remove("selected");
      })
    },

    
    getSelectedItems(elements) {
      
      if (elements.length == 0) return []
      if (elements.length == 1) return elements.map( el => findNode(this.data, item => item.id == el.attributes.id.nodeValue ))
      
      // todo refact this code 

      let s = sortBy(elements.map(el => find(this.data, item => item.id == el.attributes.id.nodeValue)), "index")
      let firstItem = first(s)
      let lastItem = last(s)
      let d = this.data 

      console.log(firstItem, lastItem)
      let group = slice(d,firstItem.index,lastItem.index+1)
      console.log(group)

      
      d.splice(firstItem.index,lastItem.index - firstItem.index+1,{
        id:1112211,
        value:group.map( g => g.value).join(""),
        selectable: true,
        selected: true
      })

      d = d.map( (item, index) => extend(item, {list:d, index}))
      console.log(d)
      return [find(d, item => item.id == "1112211")]
    },
    
    select(nodes){
      nodes = (isArray(nodes)) ? nodes : [nodes]
      if (nodes.length == 1 && this.selection.length == 1 && nodes[0].id == this.selection[0].id) return
      this.$refs.selecto.setSelectedTargets(nodes.map(item => document.getElementById(item.id)))
      this.onSelect({
        removed: this.selection.map( item => document.getElementById(item.id)),
        added: nodes.map(item => document.getElementById(item.id)),
        selected: nodes.map(item => document.getElementById(item.id))
      })
    },

    displayMenu(e) {
      let options = this.options()
     
      if(options.menu && !!options.menu(e.sender.node)) {
        this.select(e.sender.node)
        this.menu_x= e.position.x
        this.menu_y = e.sender.$el.getBoundingClientRect().bottom+5
        this.menu = e.sender.menu(e.sender.node)
        this.$nextTick(() => {this.showMenu = true})  
      } 
      
    },

    showTooltip(e){
      let options = this.options()
     
      if(options.tooltip && !!options.tooltip(e.sender.node)){
        this.tt_stack.push(e.sender)
        this.tt_x= e.position.x
        this.tt_y = e.position.y //component.$el.getBoundingClientRect().top //tt_pos.y
        this.tooltipText = options.tooltip(e.sender.node)
        this.showTooltipModel = true  
      }
      
    },

    hideTooltip(e){
      let options = this.options()
      
      if(options.tooltip && !!options.tooltip(e.sender.node)){
        if(this.tt_stack.length == 1 ) {
          this.tt_stack = []
          this.showTooltipModel = false  
        } else {
          this.tt_stack.pop()
          let component = this.tt_stack[this.tt_stack.length-1]
          this.tt_x = e.position.x
          this.tt_y = e.position.y //component.$el.getBoundingClientRect().top
          this.tooltipText = options.tooltip(component.node)
          this.showTooltipModel = true  
        }
      }  
      
    }
    
  },
  
  
  created(){
    forEachNode(this.data, node => {
      node.id = node.id || v4()
    })
  }
  
}

</script>

