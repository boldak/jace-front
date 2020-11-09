import { isFunction, isArray, find, last, drop, findIndex, take } from "lodash"
import Diff from "@netilon/differify"

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

let getParent = (node, root) => findNode(root, n => n.childs && find(n.childs, item => item.id == node.id))

let getSiblings = (node, root) => {
  let parent = getParent(node, root)
  return (parent) ? parent.childs : []
}

let getStyle = (element, property) => {
      return window.getComputedStyle 
        ? window.getComputedStyle(element, null).getPropertyValue(property) 
        : element.style[property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })];
  }



//--------------------------------- diff -----------------------------------------------


let diff = new Diff({mode:{object:"DIFF", array:"DIFF"}})

let originalBranchName = "original"
let currentBranchName = "current"


let tom2Plain = node => {
  
  let syntaxNode = ["word", "text", "paragraph", "sentence", "subSentence", "number", "whitespace", "punctuation"]
  let versionNode = ["DIFF","BRANCH"]

  forEachNode(node, n => {
    // delete n.id
    // delete n.selected
    n.concept = (syntaxNode.includes(n.type)) ? "SYNTAX" : (versionNode.includes(n.type)) ? "VERSION" : "SEMANTIC" 
  })


  let res = []
  
  forEachNode(node, n => {
    if (n.childs) {
      res.push({ action:"START", concept:n.concept, type:n.type, value: n.value })
    } else {
      res.push({ action:"TERMINAL", concept:n.concept, type:n.type, value:n.value })
    }
  }, n => {
    if (n.childs) {
      res.push({ action:"STOP", concept:n.concept, type:n.type })
    }
  })
  return res
}

let plain2Tom = (data, parentStack) => {
  
  if(data.length == 0) return
  
  parentStack = parentStack || [] 
  
  let node = data[0]
  let parent = last(parentStack)
  
  switch (node.action){
    
    case "START":
      node.childs = []
      parentStack.push(node)
      if(parent){
        parent.childs.push(node)
      }
      plain2Tom(drop(data), parentStack)
      break
    
    case "TERMINAL":
      if(parent){
        parent.childs.push(node)
      }
      plain2Tom(drop(data), parentStack)
      break
    
    case "STOP":
      parentStack.pop()
      plain2Tom(drop(data), parentStack)
      break
        
  }
  
  return node
}


let isAnnotationOpened = branch => {
  let c = 0
  branch.forEach( (item, index) => {
    if(item.action == "START" && item.concept == "SEMANTIC"){
      c++
      return
    }
    if(item.action == "STOP" && item.concept == "SEMANTIC"){
      c--
      return
    }
  })
  return c != 0
}

let takeSegment = (fragment, stopped) => {
  let i = findIndex(fragment.source, stopped)
  let slice = take(fragment.source, i+1)
  fragment.source = drop(fragment.source, slice.length)
  fragment.branch = fragment.branch.concat(slice)
  return fragment
}

let segmentBranches = (original, current) =>{
  if(isAnnotationOpened(original.branch)){
    original = takeSegment(original, item => item.action == "STOP" && item.concept == "SEMANTIC")
    current = takeSegment(current, item => diff.compare(original.branch[original.branch.length-2],item).status == "EQUAL")
    let res = segmentBranches(current, original)
    return {
      current: res.original, 
      original:res.current
    }
  }

  if(isAnnotationOpened(current.branch)) {
    let res = segmentBranches(current, original)
    return {
      current: res.original, 
      original:res.current
    }
  } 
  
  return {
    original, current
  } 
  
} 

let diffSequence = data => [{action:"START", type:"DIFF"}, {action:"START", type:"BRANCH", name:originalBranchName}]
  .concat(data.original.branch)
  .concat([{action:"STOP", type:"BRANCH", name:originalBranchName}, {action:"START", type:"BRANCH", name:currentBranchName}])
  .concat(data.current.branch)
  .concat([{action:"STOP", type:"BRANCH", name:currentBranchName}, {action:"STOP", type:"DIFF"}])



let getDifferenceTom = (d1,d2) => {
  originalBranchName = d1.branch || "original"
  currentBranchName = d2.branch || "current"


  let l1 = tom2Plain(d1)
  let l2 = tom2Plain(d2)

  let res = []
  let c = true
  for (;l2.length>0 && l1.length>0 && c;){
    
    
    if(l1[0].concept=="SYNTAX" && diff.compare(l1[0], l2[0]).status == "EQUAL"){
      res.push(l1[0])
      l1 = drop(l1)
      l2 = drop(l2)
      continue
    } 

    if(     
        (l1[0].concept=="SYNTAX" && l2[0].concept=="SEMANTIC") 
      ||  (l2[0].concept=="SYNTAX" && l1[0].concept=="SEMANTIC")
    ){
      
      let b1 = [l1[0]]
      let b2 = [l2[0]]
      let tres = segmentBranches({
          source:drop(l1),
          branch:b1
        },{
          source:drop(l2),
          branch:b2
        })  
      l1 = tres.original.source
      l2 = tres.current.source
      
      res = res.concat(diffSequence(tres))
      continue
    }

    if( l1[0].concept=="SEMANTIC" && l2[0].concept=="SEMANTIC"){
      let f1 = takeSegment({source:l1,branch:[]}, item => item.action == "STOP" && item.concept == "SEMANTIC")
      let f2 = takeSegment({source:l2,branch:[]}, item => item.action == "STOP" && item.concept == "SEMANTIC")
      if( diff.compare(f1.branch,f2.branch).status == "EQUAL"){
        res = res.concat(f1.branch)
        l1 = drop(l1,f1.branch.length)
        l2 = drop(l2,f1.branch.length)
      } else {
        let tres = segmentBranches(f1,f2)
        
        l1 = tres.original.source
        l2 = tres.current.source
        
        res = res.concat(diffSequence(tres))
      }
      continue  
    } 
    


  }

  return plain2Tom(res)
}  

export {

  forEachNode,
  findNode,
  getParent,
  getSiblings,
  getStyle,
  getDifferenceTom

}  


