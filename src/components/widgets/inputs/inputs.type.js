import snippets from "./snippets.js"

export default {

	name:"inputs-widget",

    icon: "mdi-file-document-box-outline",

    getInitialConfig(snippet){
        snippet = snippet || "Line"
        let res = snippets[snippet] || snippets["Line"]
        return res
    }    

}