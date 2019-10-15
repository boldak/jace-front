<template>
  <div>
    <v-data-table
      :headers="table.headers"
      :items="table.rows"
      style="border:1px solid #dedede;"
      :dense = "config.options.dense"
      :items-per-page="(config.options.pagination) ? 5 : Number.POSITIVE_INFINITY"
      :hide-default-footer="!config.options.pagination"
    >
     
      <template v-slot:body="props">
        <tbody>
          <tr v-for="(item, rowIndex) in props.items" :key="rowIndex">
            <td v-for="(col, index) in table.headers"  :key="index" :class="getClass(item,col)" :style="getStyle(item,col)">
              {{item[col.value]}}
            </td>
          </tr>
        </tbody>
      </template>

    </v-data-table>
    
  </div>
</template>


<script>

  import djvueMixin from "@/mixins/core/djvue.mixin.js";
  import listenerMixin from "@/mixins/core/listener.mixin.js";
  import dataTableConfigDialog from "./data-table-config.vue";
  import tinycolor from "tinycolor2"
  import * as _ from "lodash"
     
 export default  {
    
    name:"data-table-widget",

    icon: "mdi-grid",

    mixins:[djvueMixin, listenerMixin],

    props:["config"],

    computed:{
      pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },

    methods:{

      getClass(item,col){
        let value = item[col.value]
        let _class = "text-left" 
        if (col == 0) _class = "text-left"
        if (_.isNumber(value)) _class =  "text-right"  
        if( _.isBoolean(value) ) return "text-center"

        _class = `${_class} ${this.config.options.typography} ${this.config.options.textColor}--text ${this.config.options.textBackground}`

        return _class  
      },
      
      
      getStyle(item, col){

        let value = item[col.value]
        
        if(!this.config.options.useColors) return ""
        if (!this.colors) return ""   
        if (!_.isNumber(value)) return "" 
        
       
        
        if (this.config.options.colorMode == "row"){
          let values = _.values(item).filter(d => _.isNumber(d))
          let range = [_.min(values),_.max(values)]
          return "background:" + tinycolor(
            this.colors[Math.trunc(this.colors.length*(value-range[0])/(range[1]-range[0] + 0.00000000001))]
          ).setAlpha(0.5).toRgbString()
        }  

        if (this.config.options.colorMode == "column"){
          if(!this.ranges) return ""
          let range = this.ranges[col.value]
          if(!range) return ""
          return "background:" + tinycolor(
            this.colors[Math.trunc(this.colors.length*(value-range[0])/(range[1]-range[0] + 0.00000000001))]
          ).setAlpha(0.5).toRgbString()
        }  

        if (this.config.options.colorMode == "table"){
          let range = this.ranges
          if(!range) return ""
          return "background:" + tinycolor(
            this.colors[Math.trunc(this.colors.length*(value-range[0])/(range[1]-range[0] + 0.00000000001))]
          ).setAlpha(0.5).toRgbString()
        }  
    
      },

      onUpdate ({data}) {
        // console.log("table update", data)
        this.data = data.dataset.source;
        let temp = {
          headers: data.dataset.dimensions.map( item => ({
              text: item.text || item,
              align: 'center',
              value: item.value || item,
              class: (this.config.options.headerTextOrientation == "vertical") ? ["vertical-text"] : []
          })),
          rows: this.data

        }
        this.table = temp

        this.pagination.rowsPerPage = 10
        this.pagination.totalItems = this.table.rows.length
        
        if(!this.config.options.useColors) {
          this.ranges = null
          return
        }

        this.colors = JSON.parse(JSON.stringify(this.config.options.palette.color))
        if(this.config.options.palette.isReverse) this.colors.reverse()
            
        if (this.config.options.colorMode == "row") return
        
        if (this.config.options.colorMode == "column"){
          this.ranges = {}
          this.table.headers.forEach( h => {
              let values = this.table.rows.map( r => r[h.value])
              if((values.length > 0) && _.isNumber(values[0]))
              this.ranges[h.value]  = [_.min(values),_.max(values)]
          })
          return
        }

        if (this.config.options.colorMode == "table"){
          let values = [];
          this.table.headers.forEach( h => {
              let v = this.table.rows.map( r => r[h.value])
              if((v.length > 0) && _.isNumber(v[0]))
              values  =values.concat(v)
          })
          this.ranges  = [_.min(values),_.max(values)]
          return
        }

      },

      onReconfigure (widgetConfig) {
       return this.$dialogManager.showAndWait(dataTableConfigDialog, {width:"90%"},{config:widgetConfig})
      },

      onClear(){
        this.onUpdate({
          data: {
            "dataset": {
              "dimensions": [],
              "source": []
            }
          }
        })
      },

      // onError (error) {
      //   this.template = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
      // },

      onDataSelect (emitter, data) {
        
        let temp = {
          headers: this.table.headers,
          rows: this.data.filter( item => {
            let d = _.find(data.selection, t => t.entity == item[data.mapper])
            if(!d) return false;
            return d.selected
          })

        }
        this.table = temp
      }

    },

       

    created(){ 
      this.data = this.config.data.embedded.dataset.source;
      let temp = {
        headers: this.config.data.embedded.dataset.dimensions.map( item => ({
            text: item,
            align: 'center',
            value: item
        })),
        rows: this.data

      }
      this.table = temp
    },

     mounted(){ 
      this.$emit("init") 
    },
   
    
    data: () =>({
      table:{},
      data:[],
      ranges:null,
      colors:null,
      pagination:{}
    })
  }

</script> 

<style scoped>
  
  table.v-table tbody td, table.v-table tbody th {
      height: 2em;
  }

  .vertical-text span span{
        writing-mode: vertical-lr;
        transform: rotate(180deg);
  } 
    
</style>

