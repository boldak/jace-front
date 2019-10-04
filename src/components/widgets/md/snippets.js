export default {
	
	"default":{
      
        type:"md-widget", 
        // id:Vue.prototype.$djvue.randomName(),
        name:"noname",
        icon:"mdi-markdown",
        options: { widget:{
            visible: true
          }
        },
        data:{
          source:"embedded",
          embedded:`
            Ace (Ajax.org Cloud9 Editor)
============================

Ace is a standalone code editor written in JavaScript. Our goal is to create a browser based editor that matches and extends the features, usability and performance of existing native editors such as TextMate, Vim or Eclipse. It can be easily embedded in any web page or JavaScript application. Ace is developed as the primary editor for [Cloud9 IDE](http://www.cloud9ide.com/) and the successor of the Mozilla Skywriter (Bespin) Project.

Features
--------

* Syntax highlighting
* Automatic indent and outdent
* An optional command line
* Handles huge documents (100,000 lines and more are no problem)
* Fully customizable key bindings including VI and Emacs modes
* Themes (TextMate themes can be imported)
* Search and replace with regular expressions
* Highlight matching parentheses
* Toggle between soft tabs and real tabs
* Displays hidden characters
* Drag and drop text using the mouse
* Line wrapping
* Unstructured / user code folding
* Live syntax checker (currently JavaScript/CoffeeScript)

Take Ace for a spin!
--------------------

Check out the Ace live [demo](http://ajaxorg.github.com/ace/) or get a [Cloud9 IDE account](http://run.cloud9ide.com) to experience Ace while editing one of your own GitHub projects.

If you want, you can use Ace as a textarea replacement thanks to the [Ace Bookmarklet](http://ajaxorg.github.com/ace/build/textarea/editor.html).
          `
        }
       
    }
}