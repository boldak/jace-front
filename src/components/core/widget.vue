<template>
  <v-card :class="{widget:!isProductionMode}" ma-1 flat style="background:transparent;">
    <v-toolbar dark flat height="32px" :color="(!data.message)?'primary darken-1':'error'" v-if="!isProductionMode">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
        <v-avatar class="handle" size="32" tile slot="activator" v-on="on">
          <v-icon>{{config.icon}}</v-icon>
        </v-avatar>
      </template>
        <span>{{config.type}}</span>
      </v-tooltip>
      <v-toolbar-title class="body-2 white--text font-weight-light">{{config.id}} "{{config.name}}"</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon small text @click="configure()" :disabled="!reconfigurable" class="white--text body-2">
        <v-icon class="body-2">mdi-square-edit-outline</v-icon>
      </v-btn>  
      
      <v-btn icon small text @click="cloneWidget()" class="white--text  body-2">
        <v-icon  class="body-2">mdi-content-copy</v-icon>
      </v-btn>  
      
      <v-btn icon small text @click="deleteWidget()" class="white--text  body-2">
        <v-icon  class="body-2">mdi-close</v-icon>
      </v-btn>  

    </v-toolbar>
      <pre v-if="!isProductionMode && data.message" class="error lighten-2 white--text caption pa-2">
        Exception
        {{data.message}}
      </pre>
      
      <component  
        v-if="config.type" 
        :style="'width:100%;'+((hidden)?'display:none;' : '')" 
        :is="config.type" 
        ref="instance" 
        :config="config" 
        @init="onInit">
          
      </component>
  </v-card>
</template>
<script>

// import requiredWidgets from "@/components/core/widget-loader.js"
import djvueMixin from "@/mixins/core/djvue.mixin.js"
import widgetMixin from "@/mixins/core/widget.mixin.js";
import components from "@/components/widgets"
import * as _ from "lodash"
// let components = requiredWidgets();

// console.log(components)

export default {

  mixins: [djvueMixin, widgetMixin],

  name: "dj-widget",

  props: ["type", "holder"],

  components,

  data: () => {
    return {
      collapsed: false,
      hidden: false,
      hasError: false
    }
  },

  computed: {
    globalConfig() {
     return _.find(this.app.currentPage.holders[this.holder].widgets, (item) => item.id == this.config.id)
    }
  },

  methods: {

    configure() {
      this.$eventHub.emit("widget-reconfigure", this)
    },

    cloneWidget() {
      this.$eventHub.emit("widget-clone", this)
    },

    deleteWidget() {
      this.$eventHub.emit("widget-delete", this)
    },

    onInit(){
      this._updateConfig();
      this.onInitChild();
    }

  }

}



</script>
<style>
.widget {
  border: 1px solid #bbb !important;
}

.handle {
  cursor: pointer;
}

</style>
