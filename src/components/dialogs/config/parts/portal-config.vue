<template>
    <div>
  <v-data-table 
    :headers="headers" 
    :items="metadata" 
    dense 
    hide-default-footer
    :items-per-page="Number.POSITIVE_INFINITY"
  >
    <template v-slot:item.key="props">
      <span class="caption secondary--text font-weight-medium">{{ props.item.key }}</span>
    </template>
    
    <template v-slot:item.value="props">
      <v-edit-dialog :return-value.sync="props.item.value"> {{ props.item.value }}
        <template v-slot:input>
          <v-text-field v-model="props.item.value" label="Edit" single-line></v-text-field>
        </template>
      </v-edit-dialog>
    </template>
  
  </v-data-table>
  
</div>
  
</template>

<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js"
import i18nMixin from "@/mixins/core/i18n.mixin.js"
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
  name: "portal-config",
  props: ["config"],

  mixins: [djvueMixin, i18nMixin],

  data() {
    return {
      i18n,
      metadata:[],
      headers:[
          { text: "Key", value: 'key', class: 'text-xs-left' },
          { text: "Value", value: 'value', class: 'text-xs-left' },
        ],
      devServiceConfig:{}  
    }
  },

  watch:{
    metadata:{
      handler(value){
        let c = {}
        value.forEach( item => {
          c[item.key] = item.value
        })
        devService.config = c
        this.devServiceConfig = c
      },
      deep:true
    }  
  },

  
  created() {
    this.devServiceConfig = devService.config
    this.metadata = _.toPairs(devService.config).map( d => ({key:d[0],value:d[1]}))
  }
}

</script>
