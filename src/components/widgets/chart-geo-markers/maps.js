
import geodata from "./geodata.js"
import * as _ from "lodash"

export default (scope, locale) => {
	scope = scope || "World"
	locale = locale || "en"
	
	return {
		"type":"FeatureCollection",
		"features": JSON.parse(JSON.stringify(geodata))
			.filter(item => _.findIndex(item.properties.scope, t => t == scope) >=0 )
			
			.map(item => {
				item.properties.name = item.properties.name[locale]
				return item
			})
	} 
}