<template>
   
  <div>
     <div class="md" v-if="html" v-html="html"></div>
  </div>
</template>

<script>

  import djvueMixin from "@/mixins/core/djvue.mixin";
  import listenerMixin from "@/mixins/core/listener.mixin";
  import "./md.css"
<<< if( jace.mode == "development") { >>>  
  import MdConfig from "./md-config.vue";
<<< } >>>  


 export default  {
    
    name:"md-widget",

    icon: "mdi-markdown",

    mixins:[djvueMixin, listenerMixin],

    methods:{

      onUpdate ({data, options}) {
       if(!data) return


       let script = `
        <?md
        ${(data.startsWith("\n")) ? data : "\n"+data}
        ?>
        md.toHtml()
       `; 
       this.$dps.run({script})
        .then( res => {
          this.html = res.data
        })
      },

<<< if( jace.mode == "development") { >>>
      onReconfigure (widgetConfig) {
       return this.$dialogManager.showAndWait(MdConfig,{width:"90%"}, {config:widgetConfig})  
      },
<<< } >>>      

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
      html:"<div></div>"
    })

  }

</script>	
