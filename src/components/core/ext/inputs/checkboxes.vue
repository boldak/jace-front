<template>
	<div 
		:class="(options.decoration) ? getPropertyValue(options.decoration.classes) : ''" 
		:style="(options.decoration) ? getPropertyValue(options.decoration.style) : ''" >
		<v-checkbox   	
			v-for="(variant, index) in getPropertyValue(options.data.variants)"
			:key="index"
			hide-details
			:label="(options.data) ? getPropertyValue(variant) : ''" 
			v-model="selection[index]" 
			:disabled="(options.data) ? getPropertyValue(options.data.disabled) : false" 
			
			:color="(options.decoration) ? getPropertyValue(options.decoration.color) : ''"
			:flat="(options.decoration) ? getPropertyValue(options.decoration.flat) : false"
			:inset="(options.decoration) ? getPropertyValue(options.decoration.inset) : false"
			:dense="(options.decoration) ? getPropertyValue(options.decoration.dense) : false"
			:messages="(options.decoration) ? getPropertyValue(options.decoration.messages) : []"
			@change="inputData"
		>
			
		</v-checkbox>

	</div>
</template>	

<script>

import { isUndefined } from "lodash"

export default {
	
	props:[ "options", "getPropertyValue" ],

	data: () => ({
		selection: [],
		rules:{
			required: value => (!isUndefined(value) && (value !== null) && (value !== "")) || "Required."
		}
	}),
	
	methods:{
		
		inputData(data){
			this.$emit("change", this, this.getPropertyValue(this.options.data.variants).filter( (d,index) => this.selection[index]))
		}
	}, 

	created(){
		let resp = this.getPropertyValue(this.options.data.value) || []
		let variants = this.getPropertyValue(this.options.data.variants)
		let selection = variants.map(d => resp.includes(d))
		this.selection = selection
	}
}
</script>

<style scoped>
    .v-input--selection-controls {
        margin:0px !important;
    }
</style>