<template>
  <v-row class="pa-2 mx-0">
    <div>
      <a v-for="(item, index) in items" :key="index" @click="select(index)">
        <span :class="decoration(index)">{{item}}</span>
      </a>
    </div>
    <v-spacer></v-spacer>
    <div>
      <a class="ma-3" @click="control()">
        <v-icon class="primary--text">{{(!timer) ? "mdi-play" : "mdi-stop"}}</v-icon>
      </a>
    </div>
  </v-row>
</template>
<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import DataLegendConfigDialog from "./data-legend-config.vue";
import { isArray, sortBy, includes, findIndex, isUndefined, isNull } from "lodash"

export default {

  props: ["config"],

  mixins: [djvueMixin, listenerMixin],

  computed: {
    items() {
      if (!this.source) return
      return this.source
    }
  },


  methods: {

    onUpdate({ data }) {
      this.stop()
      this.source = data.items
      this.event = data.event
      this.$nextTick(() => {
        this.selection = 0
      })

    },

    onReconfigure(widgetConfig) {
      return this.$dialogManager.showAndWait(DataLegendConfigDialog, { width: "90%" }, { config: widgetConfig })
    },

    onClear() {
      this.onUpdate({
        data: []
      })
    },

    decoration(index) {
      return ` body-1 px-1  ${(this.selection == index) ? 'primary--text font-weight-bold' : 'secondary--text font-weight-light'}`
    },

    select(index) {
      this.stop()
      this.selection = index
    },

    control() {
      if (this.timer) {
        this.stop()
      } else {
        this.start()
      }
    },

    stop() {
      if (!this.timer) return
      clearInterval(this.timer)
      this.timer = null
    },

    start(interval) {
      this.stop()
      interval = interval || 2000
      this.timer = setInterval(() => {
        this.selection = (this.selection < this.items.length - 1) ? this.selection + 1 : 0
      }, interval)
    }

  },

  watch: {
    selection(value) {
      if (isNull(value) || isNull(this.event)) return
      this.emit(this.event, this, this.items[value])
    }
  },

  data: () => ({
    selection: null,
    source: null,
    timer: null,
    event: null
  }),


  mounted() {

    this.on({
      event: "page-stop",
      callback: () => {
        this.stop()
        console.log("page-stop")
      },
      rule: () => true
    })

    this.on({
      event: "start-timer",
      callback: (emitter, data) => {
        console.log("start-timer", data)
        this.start()
      },
      rule: () => true
    })

    this.on({
      event: "stop-timer",
      callback: (emitter, data) => {
        console.log("stop-timer", data)
        this.stop()
      },
      rule: () => true
    })

    this.$emit("init")

  }

}

</script>
