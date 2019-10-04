import snippets from "./snippets.js"

export default {
	name:"md-widget",

    icon: "mdi-markdown",

    getInitialConfig( snippet ){
        snippet = snippet || "default"
        let res = snippets[snippet] || snippets["default"]
        return res
    }

}
