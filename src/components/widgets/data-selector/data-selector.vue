<template>
  <div>
    <v-autocomplete v-model="selection" :items="items" :filter="filter" color="primary" :label="config.options.widget.label" :multiple="config.options.widget.multiple" :clearable="config.options.widget.multiple" v-if="source" item-text="title" :item-value="item => item" class="body-1">
    </v-autocomplete>
  </div>
</template>
<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import DataSelectorConfigDialog from "./data-selector-config.vue";

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

    onUpdate({ data, options }) {

      this.source = data
      // this.mapper = options.mapper;

      this.$nextTick(() => {
        this.selection = (this.config.options.widget.multiple) ? [this.items[0]] : this.items[0]
      })

    },

    onReconfigure(widgetConfig) {
      return this.$dialogManager.showAndWait( DataSelectorConfigDialog, {width:"90%"}, {config:widgetConfig} )
    },

    onClear() {
      this.onUpdate({
        data: []
      })
    },

    filter(item, queryText) {
      return _.includes(item.title.toLowerCase(), queryText.toLowerCase())
    },

    text(item) {
      // console.log("item:", item)
      return item.title
    },

    remove(item) {
      if (this.selection.length == 1) return
      const index = this.selection.indexOf(item)
      if (index >= 0) this.selection.splice(index, 1)
    }
  },

  watch: {
    selection(value) {
      // console.log("selection", value)
      if (!value) return
      // if (value.length == 0) return
      let res = {
        selection: _.sortBy(
          this.items.map(item => {
            item.index = _.findIndex((_.isArray(value) ? value : [value]), t => t == item)
            return {
              entity: item,
              selected: (_.findIndex((_.isArray(value) ? value : [value]), t => t == item) >= 0)
            }
          }),
          d => d.entity.index
        )

      }
      this.emit("data-select", this, res)
    }
  },

  data: () => ({
    selection: [],
    source: null
  }),


  mounted() { this.$emit("init") }

}

</script>
