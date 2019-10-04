<template>
   
   <div>
    <markdown-it-vue class="md-body" :content="content"/>
  </div>
    
</template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";
  import MdConfig from "./md-config.vue"
  import MarkdownItVue from 'modules/markdown-it-vue/markdown-it-vue.vue'
  // import snippets from "./snippets.js"


  Vue.prototype.$dialog.component('MdConfig', MdConfig)


  let compile = (template,context) => {
     _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    let result = _.template(template)(context)

    _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

    return result
    
  }



 export default  {
    
    name:"md-widget",

    icon: "mdi-markdown",

    mixins:[djvueMixin, listenerMixin],

    components:{
      MarkdownItVue
    },

    methods:{

      onUpdate ({data, options}) {
       this.content = data;
      },

      onReconfigure (widgetConfig) {
       return this.$dialog.showAndWait(MdConfig, {config:widgetConfig})
      },

      // onError (error) {
      //   this.template = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
      // },

      onDataSelect (emitter, data) {
        // console.log(JSON.stringify(data))
        this.template = data.selection.filter(item => item.selected).map(item => item.entity).join(", ")
        // this.emit("data-select", this, data+" redirected")
      } 

    },

    
    props:["config"],

    // computed:{
    //   html(){

    //      try {
    //       return compile(this.template, this);  
    //     } catch(e) {
    //       this.$djvue.warning({
    //                   type:"error",
    //                   title:"Cannot compile template",
    //                   text:e.toString()
    //                 })
    //     }
    //   }

    // },

    created(){ this.template = this.config.data.embedded || ""; },

    mounted(){ this.$emit("init") },
    
    data: () =>({
      content:""
    })

  }

</script>	