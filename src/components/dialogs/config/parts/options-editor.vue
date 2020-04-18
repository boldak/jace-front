<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12>
        <editor :content="embeddedSource" lang="json" :sync="true" @change="onUpdateSource" style="border:1px solid #999;height:28em !important">
        </editor>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import editor from '@/components/core/ext/ace-editor.vue';
import { isString } from "lodash"

export default {
  name: "options-editor",
  components: {
    editor
  },

  props: ["config"],

  computed: {
    embeddedSource() {
      return (isString(this.config.data.embedded))
          ? this.config.data.embedded
          : JSON.stringify(this.config.data.embedded, null, "\t")

    }
  },

  data: () => ({
    editor: null,
    esource:null
  }),

  methods: {

    setEditor(editor) {
      this.editor = editor;
    },

    onUpdateSource(value) {

      this.esource  = value //JSON.parse(value)

    },

    onUpdateScript(value) {
      this.config.data.script = value
    }
  },

  created() {

     this.esource = (isString(this.config.data.embedded))
                ? this.config.data.embedded
                : JSON.stringify(this.config.data.embedded, null, "\t")

    this.mode = this.config.data.source;
    this.clearWatch = this.$watch("mode", () => { this.config.data.source = this.mode })
  },

  beforeDestroy () {
    
    try {
      this.config.data.embedded = JSON.parse(this.esource)  
    } catch (e) {
      this.config.data.embedded = this.esource
      this.warning({
        type: "error",
        title: "Data error",
        text: e.toString()
      })
    }
  },


  destroyed() {
    this.clearWatch();
  }

}

</script>
