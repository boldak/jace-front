import snippets from "./snippets.js"

export default {
	name:"md-widget",

    icon: "mdi-markdown",

    getInitialConfig( snippet ){
        snippet = snippet || "Markdown"
        let res = snippets[snippet] || snippets["Markdown"]
        return res
    }

}
