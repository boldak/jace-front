<template>
    <v-fade-transition leave-absolute>
      <div>
        <div v-if="loading" class="d-flex justify-center align-center secondary--text lighten-2">
            <i class="mdi mdi-48px mdi-spin mdi-loading"></i>
        </div>
        <div v-if="html" class="markdown-body pa-3" v-html="html"></div>
      </div>
    </v-fade-transition>
</template>

<script>

  import djvueMixin from "@/mixins/core/djvue.mixin";
  import listenerMixin from "@/mixins/core/listener.mixin";
  import "./md.css"
  import "github-markdown-css"
<<< if( jace.mode == "development") { >>>  
  import MdConfig from "./md-config.vue";
<<< } >>>  


 export default  {
    
    name:"md-widget",

    icon: "mdi-markdown",

    mixins:[djvueMixin, listenerMixin],

    methods:{

      onUpdate ({data, options}) {
       // console.log("!!!",data)
       options = options || {}
       
       
       if(!data) return
        try {
        data = decodeURIComponent(data) 
        } catch(e) {

        } finally {
          this.html='<div></div>'
          this.$nextTick(() => {
            this.loading = true
          })
          let script = `
          <?md
          ${(data.startsWith("\n")) ? data : "\n"+data}
          ?>
          md.toHtml(options:{{options}})
         `; 
         this.$dps.run({script,state:{options}})
          .then( res => {
            this.html = res.data
            this.loading = false
            this.$nextTick(() => {
              this.$el.scrollTop = 0 //this.$el.scrollHeight - this.$el.clientHeight;
            })

          })   
        }
       
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
      html:"<div></div>",
      loading: false
    })

  }

</script>	
