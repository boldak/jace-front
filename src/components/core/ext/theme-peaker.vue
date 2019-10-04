<template>
  <v-layout column>
    <v-combobox
      label="Theme Palette"
      v-model="model"
      :items="themes"
      @input="onChange"
      dense
    >
      <template
        v-if="item === Object(item)"
        slot="selection"
        slot-scope="{ item, parent, selected }"
      >
            <span v-for="c in item"   :style="`margin:0; padding:0; background:${c};  width:16px; height:20px;`">
            </span> 
        
      </template>
      <template
        slot="item"
        slot-scope="{ index, item, parent }"
      >
            <v-layout row >
              <span v-for="c in item"   :style="`margin:0; padding:0; background:${c};  width:16px; height:20px;`">
              </span> 
      
            </v-layout>
      </template>
    </v-combobox>
  
  </v-layout>  

</template>

<script>
  
  import themes from "./themes.js"

  export default {
    props:["value"],

    data: () => ({
      model: {},
      themes: themes
    }),
    
    created(){
      this.model = this.value
      this.$emit("change", this.model) 
    },

    methods:{
      onChange(){
        if(this.model){
          this.$emit("change", this.model)  
        }
      }
    }
  }
</script>
