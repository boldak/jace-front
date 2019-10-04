import snippets from "./snippets.js"

export default {

	name:"scatter-chart-widget",

    icon: "mdi-chart-scatter-plot",

    getInitialConfig(snippet){
        snippet = snippet || "Classic Scatterplot"
        let res = snippets[snippet] || snippets["Classic Scatterplot"]
        return res
    }    

}