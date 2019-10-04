<template>
    <config-dialog 
      :options="props"
      :submit="submit"
    ></config-dialog>  
 </template> 




<script>
import configDialog from "./settings-dialog-layout.vue"

export default {
	
  name: "settingsDialog",
  
  
	props:["options","submit"],

  components:{
    "config-dialog": configDialog 
  },

  computed:{
    props(){
      return {
        icon: "mdi-settings",
        title: `Application Settings`,
        config: this.options.config,
        editorTree: this.editorTree
      }
    }
  },
	
  data () {
      return {
        editorTree:[
          {
            name: "Settings",
            children: [
              {
                name: 'Application',
                editor: () => import("@/components/dialogs/config/parts/app-editor.vue")
              },

              {
                name: "Pages",
                editor: () => import("./parts/page-manager.vue")
              },
              {
                name: "I18n",
                editor: () => import("./parts/i18n-manager.vue")
              },
              {
                name: "Resources",
                editor: () => import("./parts/resource-manager.vue")
              },

              // {
              //   name: "Decoration",
              //   editor:() => import("@/components/dialogs/config/parts/decoration-editor.vue")
              // },
              // {
              //   name: "Select-data Behavior",
              //   editor: () => import("@/components/dialogs/config/parts/data-select-emitters.vue")
              // }

            ]
          }
        ],
      }
    }
}

</script>