<template>
	
    <v-avatar v-if="options && getPropertyValue"
    	:color="getPropertyValue(decoration.color)"
    	:size = "getPropertyValue(decoration.size)"
    >
          	<dj-img 
	          	:src="getPropertyValue(decoration.src)" 
	          	:icon="getPropertyValue(decoration.icon)">
    		</dj-img>
    </v-avatar>
      
</template>	

<script>
export default {
	props:["options","getPropertyValue"],
	computed:{
		decoration(){
			return ( this.options && this.options.decoration ) ? this.options.decoration : {}
		}
	}
}
</script>