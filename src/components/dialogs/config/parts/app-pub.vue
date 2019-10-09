<template>
  
  <v-container>
      
    <v-row class="justify-end ma-0 px-2">
      <div :class="($socket.connected)?'success--text':'warning--text'" class="caption ma-0 px-5 py-0">
       JACE Publication Service: {{$socket.client.io.uri}}
      </div>
    </v-row>
    
    <v-row v-if="!wait" class="justify-center ma-0 pa-2">
      <v-btn color="primary" text @click="publish">Click for publish App</v-btn>
    </v-row>

    <v-row v-else class="justify-center ma-0 pa-2">
      <v-progress-circular
        indeterminate
        size="18"
        color="secondary lighten-2"
      ></v-progress-circular>
    </v-row>
    
    
    <v-row v-if="wait" class="justify-center ma-0 px-2">
      <log-view autoscroll width="60em" height="15em" :messages="messages"></log-view>
    </v-row>

   
  </v-container>
  
</template>

<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js"
import i18nMixin from "@/mixins/core/i18n.mixin.js"
import themePeaker from "@/components/core/ext/theme-peaker.vue"
import logView from "@/components/core/ext/log-view.vue"
import * as _ from "lodash"

let i18n = {
  en: {
    "Application_settings": "Application settings"
  },
  uk: {
    "Application_settings": "Налаштування застосунку"
  }
}



export default {
  name: "app-pub",
  props: ["config"],

  mixins: [djvueMixin, i18nMixin],

  components:{"log-view": logView},

  data() {
    return {
      i18n,
      messages:[],
      wait:false
    }
  },

  
  methods: {
    publish(){
      this.wait = true
      this.messages.push(`-start-`)
      this.messages.push(`===================================================================================`)
      this.messages.push(`Publish ${this.app.config.name} (${this.app.config.id})`)
      this.messages.push(`JACE dev service: ${window.location.origin}`)
      this.messages.push(`JACE pub service: ${this.$socket.client.io.uri}`)
      this.messages.push(`Agent: ${this.$socket.client.id}`)
      this.messages.push(`===================================================================================`)
      
      
      this.app.config.portalUrl = window.location.origin
      this.app.config.pubAgent = this.$socket.client.id
      this.$socket.client.emit("publish", this.app.config)
      

      // this.messages.push(`Publish ${JSON.stringify(this.app.config,null," ")}`)
    }
  },

  created() {

    this.$socket.$subscribe('log', payload => {
      this.messages.push(payload)
      if(payload == "-end-"){
        this.wait = false
        this.$djvue.warning(
                  {
                      type: "success",
                      title: "Publication completed",
                      text: this.messages[this.messages.length-2]  
                  }
              )
        
        if(this.$socket.$unsubscribe) {
          this.$socket.$unsubscribe("log")
          window.location.href = `${devService.config.pubService}/${this.messages[this.messages.length-4]}`
        }  
      }
    }); 
  }
}

</script>
