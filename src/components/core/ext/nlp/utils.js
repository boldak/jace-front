import { isFunction, isArray } from "lodash"

let forEachNode = (node, beforeAction, afterAction) => {
  if(beforeAction && isFunction(beforeAction)) beforeAction(node)
  if(node.childs && isArray(node.childs)) node.childs.forEach( n => {
                                            forEachNode(n, beforeAction, afterAction)
                                          })
  if(afterAction && isFunction(afterAction)) afterAction(node)
}

let findNode = (node, test) => {
  if(test(node)) return node
  if(node.childs && isArray(node.childs)) 
    for( let index in node.childs ){
      let res = findNode(node.childs[index], test)
      if(res) return res 
    }
  return null
}


let getStyle = (element, property) => {
      return window.getComputedStyle 
        ? window.getComputedStyle(element, null).getPropertyValue(property) 
        : element.style[property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })];
  }

export {
  forEachNode,
  findNode,
  getStyle
}  


