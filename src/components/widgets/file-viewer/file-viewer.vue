<template>
  <div>
    <div> File Viewer Config </div>
    <pre class="caption">${config}</pre>
    <div> File Viewer Options </div>
    <pre class="caption">${options}</pre>
  </div>  
</template>

<script>

import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";

<<< if( jace.mode == "development") { >>>
  
  import configDialog from "./file-viewer-config.vue";

<<< } >>> 



import moment from "moment"

export default {

  name: "file-viewer-widget",

  icon: "mdi-file-document-box-outline",

  mixins: [djvueMixin, listenerMixin],


  data: () => ({
  }),

  watch: {},

  methods: {

    onValidate(data,options){
      if( isString(data) ) {
          try {
            data = JSON.parse(data)
            return data
          } catch (e) {
            return { error: e.toString() }
          }
        }
      return data  
    },


    onUpdate({ data }) {
      if (!data) {
        this.opts = []
        this.options = null
        return
      }
      // console.log("data", data)
      // this.opts = this.normalizeOptions(data)
      this.options = data
    },


<<< if( jace.mode == "development") { >>>

    onReconfigure(widgetConfig) {
      return this.$dialogManager.showAndWait(configDialog, { width: "90%" }, { config: widgetConfig })
    },

<<< } >>>    


    
  },

  created() {
    // this.opts = this.normalizeOptions(_.extend(this.options))
  },

  mounted() { this.$emit("init") },
}

</script>
