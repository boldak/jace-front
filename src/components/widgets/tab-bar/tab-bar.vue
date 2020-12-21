<template>
  <v-tabs
      v-model="tab"
      background-color="transparent"
      :color="options.decoration.color"
      :background-color="options.decoration.bgColor"
      :active-class="options.decoration.activeClass"
      :slider-size="options.decoration.sliderSize"
      :slider-color="options.decoration.sliderColor"
      show-arrows
      :vertical = "options.decoration.vertical"
      :right = "options.decoration.right"
      :left = "options.decoration.left"
       
    >
      <v-tab
        v-for="(item, index) in options.tabs"
        :key="index"
        :class="options.decoration.classes"
        :style="`
          text-transform:none !important; 
          justify-content: flex-start;
          ${(options.decoration.vertical) ? 'border-bottom: 1px solid #cfd7e6' : 'none'};
        `"
        @click="selectTab(item)"
      >
        <i v-if="item.icon" :class="`mdi ${item.icon} pr-1`"></i>
        {{ item.title }}
      </v-tab>
    </v-tabs>
</template>
<script>

import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import { isString } from "lodash"

<<< if( jace.mode == "development") { >>>

import TabBarConfig from "./tab-bar-config.vue"


<<< } >>>


export default {

  name: "tab-bar-widget",

  icon: "mdi-tab",

  mixins: [djvueMixin, listenerMixin],

  methods: {

  
    selectTab(tab){
      let event = tab.event || "select-tab"
      this.emit(event, tab) 
    },


<<< if( jace.mode == "development") { >>>

    onReconfigure(widgetConfig) {
      return this.$dialogManager.showAndWait(TabBarConfig, { width: "90%" }, { config: widgetConfig })
    }

<<< } >>>

  },


  props: ["config"],

  data:() => ({
    tab:null
  }),

  computed: {
    options() {
      return this.config.data.embedded
    }
  },

  mounted() { this.$emit("init") }

}

</script>
