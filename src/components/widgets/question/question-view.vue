<template>
  <div>
  	<v-row class="mx-0 pa-5">
      <v-col>
        <div 
          :class="`title font-weight-light ${(validation != true)?'warning--text':'primary--text'}`" 
          style="line-height:1.2em">{{title}}
        </div>
        <p class="body-2 py-1 pl-5 pr-2 my-0 font-weight-light" style="line-height:1.2em">{{note}}</p>
      </v-col>
      
    </v-row>
    <v-divider></v-divider>
    <v-row class="caption" color="warning" v-if="validation != true">
        <v-spacer></v-spacer>
        <div v-if="validation != true">
          <span class="warning--text caption pa-2 font-weight-light font-italic">{{validation}}</span>
        </div>
    </v-row>
  </div>
</template>

<script>

  
	export default {

		props:["title", "note", "validation"]

	}

</script>		