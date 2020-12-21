<template>
  <div>

    <!-- <pre class="caption" style="line-height:1;">
      {{options}}
    </pre>  
     -->
    <div v-if="options" 
      :class="(options.decoration) ? options.decoration.classes : ''" 
      :style="(options.decoration) ? options.decoration.style : ''"
    >

      <div v-for="(row, rowIndex) in options.rows" :key="rowIndex" 
        :class="(row.decoration) ? row.decoration.classes : ''" 
        :style="(row.decoration) ? row.decoration.style : ''"
      >
        <component v-if="components[`${col.type}Input`]" v-for="(col, colIndex) in row.cols" :key="colIndex" 
          :class="(col.decoration) ? col.decoration.classes : ''" 
          :style="(col.decoration) ? col.decoration.style : ''"
          :is="`${col.type}Input`" 
          :options="col"
          :getPropertyValue="getPropertyValue"
          @push-button="pushButton"
          @push-ref="pushRef"
          @push-menu="pushMenu"
          @change="inputData"

        ></component>        
      </div>  
    </div>  
</div>

</template>
<script>
import { find, isUndefined, isArray, isNull, isString, includes, zipObject, keys, isEqual, extend, get, set } from "lodash"
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";


<<< if( jace.mode == "development") { >>>
  
  import configDialog from "./input-group-config.vue";

<<< } >>> 

import components from "@/components/core/ext/inputs"


import moment from "moment"


export default {

  name: "input-group-widget",

  icon: "mdi-file-document-box-outline",

  mixins: [djvueMixin, listenerMixin],

  components,


  data: () => ({
    components,
    options: null,
    
  }),


  methods: {

    inputData(sender, data){
      if(
        !isUndefined(sender.options) 
        && !isUndefined(sender.options.data) 
        && !isUndefined(sender.options.data.value)
      ) {
        if((/^\{\{.+\}\}$/gi).test(sender.options.data.value)) {
          set( this, sender.options.data.value.replace("{{","").replace("}}","").trim(), data )
        } else {
          sender.options.data.value = data
        }
      }   
    },

    pushButton(sender){
        let event = (sender.options.data) ? sender.options.data.event || "push-ref" : "push-ref"
        this.emit(event, this.options, sender.options)
      },
    
    pushRef(sender){
        let event = (sender.options.data) ? sender.options.data.event || "push-ref" : "push-ref"
        this.emit(event, this.options, sender.options)
      },
    
    pushMenu(sender){
        let event = sender.event || "push-menu"
        console.log(this._uid, event, this.options, sender)
        this.emit(event, this.options, sender)
      },

    getPropertyValue(v){
      return ( (/^\{\{.+\}\}$/gi).test(v) ) ? get(this, v.replace("{{","").replace("}}","").trim()) : v  
    },

    setPropertyValue(v, data){
      if((/^\{\{.+\}\}$/gi).test(v)) {
        set( this, get(this, v.replace("{{","").replace("}}","").trim()), data )
      } else {
        v = data
      }
    },

    
    onUpdate({ data }, mode) {
      
      if( mode ){
        if (mode.override) {
          set(this, mode.override, data)
        }
        if (mode.extend) {
          set(this, mode.extend, extend(get(this, mode.extend), data))
        }
      } else {
        this.options = data  
      }
      let temp = this.options
      this.options = null
      this.$nextTick(() => { this.options = temp})
    },


<<< if( jace.mode == "development") { >>>

    onReconfigure(widgetConfig) {
      return this.$dialogManager.showAndWait(configDialog, { width: "90%" }, { config: widgetConfig })
    },

<<< } >>>    

  },

  created() {
  },

  mounted() { this.$emit("init") },
}

</script>
