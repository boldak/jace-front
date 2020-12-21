<template>
	<span v-if="options && getPropertyValue" v-html="getPropertyValue(settings.value)"> 
	</span>
</template>	

<script>
export default {
	props:["options","getPropertyValue"],
	computed:{
		settings(){
			return ( this.options && this.options.data ) ? this.options.data : {}
		}
	}
}
</script>