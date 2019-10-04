import angular from 'angular';
import Question from "./question.js"

let RadioPairs = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "radiopairs", title: "One for Each" },
      widget: {
        css: "fa fa-th",
        view: this.prefix + "radio_pairs.view.html",
        options: this.prefix + "radio_pairs.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        useOneList: false,
        entities: {},
        properties: {},
        disables: {}
      }
    }

    this.configure(previus)
  }

  configure(previus) {

    super.configure()
    if (!previus) return;

    // prepare question config before setting $scope.qtype variable 
    // res - next config, $scope.config - previus config
    // if(["dropdown","check", "radio", "scale"].indexOf(previus.state.type.value) < 0) return;

    // if(["dropdown","check", "radio"].indexOf(previus.state.type.value) >= 0){
    //   this.state.options.entities = {};

    //   for ( let item of this.scope.alternatives ){
    //     this.state.options.entities[item.id] = { title: item.title, user: item.user }; 
    //   }  
    // }

    // if( previus.state.type.value == "scale" ){
    //   this.state.options.ordinals = previus.state.options.ordinals;
    //   this.state.options.colors = previus.state.options.colors;
    // }


  }

  applyAnswer() {
    this.normalizeAnswer();
    this.scope.answerMap = {} 
    for(let i in this.scope.answer.value){
      this.scope.answerMap[this.scope.answer.value[i].entity] = this.scope.answer.value[i].property;
    }
  }

  prepare() {

    // prepare helped data structures
    this.scope.entities = _.toPairs(this.state.options.entities)
      .map(item => {
        return {
          id: item[0],
          title: item[1].title,
          user: item[1].user
        }
      })

    if( this.state.options.useOneList ){
      this.scope.properties = this.scope.entities      
    } else {
      this.scope.properties = _.toPairs(this.state.options.properties)
                          .map(item => {
                            return {
                              id: item[0],
                              title: item[1].title,
                              user: item[1].user
                            }
                          })  
    }
        

    // this.state.options.disables =  this.state.options.disables || [];
    // this.scope.disables = {};
    
    // this.state.options.disables.forEach(item => {
    //   this.scope.disables[item.entity] = this.scope.disables[item.entity] || {}
    //   this.scope.disables[item.entity][item.property] = true;
    // })


    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      type: "radiopairs",
      value: []
    }

    this.scope.answerMap = {} 
    for(let i in this.entities){
      this.scope.answerMap[this.entities[i].id] = null;
    }

  }

  setDisable(entity, property) {
    this.state.options.disables = this.state.options.disables || {};

    if( this.state.options.disables[entity] && this.state.options.disables[entity][property]){
      this.state.options.disables[entity][property] = undefined;
    } else {
      this.state.options.disables[entity] = this.state.options.disables[entity] || {}
      this.state.options.disables[entity][property] = true;
    }
  }

  setAllDisabled() {
    this.state.options.disables = {};

    this.scope.entities.forEach(e => {
      this.scope.properties.forEach(p => {
        this.setDisable(e.id,p.id)
      })
    })
  }

  setReverseDisabled() {
    this.scope.entities.forEach(e => {
      this.scope.properties.forEach(p => {
        this.setDisable(e.id,p.id)
      })
    })
  }

  setAllEnabled() {
    this.state.options.disables = {};
  }

  setDiagonalDisabled() {
    this.state.options.disables = {};
    let p = this.scope.properties;
    let e = this.scope.entities;


    for(let i=0; i<e.length; i++){
      for(let j=i+1; j<p.length; j++){
        this.setDisable(e[i].id,p[j].id)
      }
    }

    this.setReverseDisabled()
  }

  setValue(entity, property) {

    
    let index = this.scope.answer.value.map(item => item.entity).indexOf(entity)

    if (index < 0) {
      this.scope.answer.value.push({ entity: entity, property: property })
    } else {
      this.scope.answer.value[index].property = property;
    }

    this.scope.answer.valid = this.scope.answer.value.length == this.scope.entities.length;
  }

  getValue(entity, property) {
    // let index = -1;
    // for (let i = 0; i < this.scope.answer.value.length; i++) {
    //   let v = this.scope.answer.value[i]
    //   if ((v.entity == entity) && (v.property == property)) {
    //     index = i;
    //     break;
    //   }
    // }
    // return index >= 0    
  }

  updateConfig() {
    //  transform helped data structures into config
    this.state.options.entities = {};

    for (let item of this.scope.entities) {
      this.state.options.entities[item.id] = { title: item.title };
    }

    if (!this.state.options.useOneList) {
      this.state.options.properties = {};

      for (let item of this.scope.properties) {
        this.state.options.properties[item.id] = { title: item.title };
      }
    }
  }

  swap() {
    let buf = this.state.options.entities;
    this.state.options.entities = this.state.options.properties;
    this.state.options.properties = buf;
    this.state.options.disables = {};
    this.prepare();
  }

  normalizeAnswer() {
    if(this.scope.answer && this.scope.answer.value){
      
      // this.state.options.disables = this.state.options.disables || {};

      // this.scope.answer.value = this.scope.answer.value.filter(item => {
      //   if(!this.state.options.disables[item.entity]) return true;
      //   return !this.state.options.disables[item.entity][item.property]
      // })

      let e = this.state.options.entities;
      let p = (this.state.options.useOneList)
                ? this.state.options.entities
                : this.state.options.properties;

      this.scope.answer.value = this.scope.answer.value.filter(item => {
        return ( angular.isDefined(e[item.entity]) && angular.isDefined(p[item.property]))
      })
      
      this.scope.answer.valid = this.scope.answer.value.length == this.scope.entities.length;

    }

  }

  setMode(value){
    this.state.options.disables = {};
    this.prepare();
  }

  generateValues() {
    // let values = this.scope.config.state.options.ordinals.values;
    // let range = this.scope.config.state.options.ordinals.range;
    // let lowTitle = values[0].title;
    // let highTitle = values[values.length-1].title;
    // let newValues = []
    // for(let i=range.min; i<=range.max; i++) newValues.push({value:i})
    // newValues[0].title = lowTitle;
    // newValues[newValues.length-1].title = highTitle;
    // this.scope.config.state.options.ordinals.values = newValues;   
  }

  getResponseStat(responses) {
    let RStat = {};
    this.scope.entities.forEach(e => {
      RStat[e.id] = {}
      this.scope.properties.forEach(p => {
        RStat[e.id][p.id] = responses.filter(r => {
          if ( (r.entity_id == e.id) && (r.property_id == p.id) ){
              return true
            }else{
              return false
            }
        }).length;
      })
    })
    // console.log(RStat)
    _.toPairs(RStat).forEach(e => {
        let values = _.toPairs(e[1]);
        // console.log(values)
        let v = values.map(item => item[1])
        // console.log(v)
        // let max = v.reduce((item,max) => {return (max>item)?max:item})
        // let min = v.reduce((item,min) => {return (min<item)?min:item})
        let sum = v.reduce((item,sum) => {return sum+item})
        // console.log(min,max)
        if(sum==0){
          v = v.map(item => 0)
        }else{
          v = v.map(item => item/sum )
        }

        values.map(item => item[0]).forEach((item,index)=>{
          RStat[e[0]][item] = v[index]
        })  
    });

    

    this.scope.rstat = RStat;
    // console.log("RSTAT", this.scope.rstat)
  }

  isResponse(entity, property){

    let s = this.scope.answer.value.filter((item) => {
      return (item.entity == entity) && (item.property == property)
    })
    return (s.length > 0 )    
  }
 

}

module.exports = RadioPairs;
