import djImg from "@/components/core/ext/dj-img.vue"

import warningDialog from "@/components/dialogs/core/warning.vue"
import confirmDialog from "@/components/dialogs/core/confirm.vue"
import progressDialog from "@/components/dialogs/core/progress.vue"
import selectFileDialog from "@/components/dialogs/core/select-file.vue"
import customDialog from "@/components/dialogs/core/custom-dialog.vue"
import splashDialog from "@/components/dialogs/core/splash.vue"
import Vue from "vue"

import * as Cookie from "tiny-cookie"
import * as _ from "lodash"

// import store from "@/state/index.js"

import dialogManager from "@/components/core/ext/dialog-manager"

import axios from "axios"


var _dialog_manager = (app) => {
  _dialog_manager = (new Vue(dialogManager)).$mount()
  app.$el.appendChild(_dialog_manager.$el)
}

// var _dialogManagerPlugin = (Vue, app) => {
//     _dialog_manager =  (new Vue(dialogManager)).$mount()
//     app.$el.appendChild(_dialog_manager.$el)
// } 



export var dialogManagerPlugin = {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$dialogManager', {
      get: function() {
        return _dialog_manager;
      }
    });

    Object.defineProperty(Vue, '$dialogManager', {
      get: function() {
        return _dialog_manager;
      }
    });
  }
}


export var cookiePlugin = {

  install: function(Vue) {
    Vue.prototype.$cookie = this;
    Vue.cookie = this;
  },
  set: function(name, value, daysOrOptions) {
    var opts = daysOrOptions;
    if (Number.isInteger(daysOrOptions)) {
      opts = { expires: daysOrOptions };
    }
    return Cookie.set(name, value, opts);
  },

  put: function(name, value, daysOrOptions) {
    return this.set(name, value, daysOrOptions)
  },

  get: function(name) {
    return Cookie.get(name);
  },

  delete: function(name, options) {
    var opts = { expires: -1 };
    if (options !== undefined) {
      opts = Object.assign(options, opts);
    }
    this.set(name, '', opts);
  }
}


export var portalPlugin = {
  install(Vue, options = { baseURL: "/" }) {
    Vue.prototype.$portal = axios.create(options)
  }
}

export var httpPlugin = {
  install(Vue, options) {
    Vue.prototype.$http = axios.create(options)
  }
}

export var dpsPlugin = {
  install(Vue, options) {
    let transport = axios.create(options);
    let url = "api/script"
    let client = options.client;
    client.href = location.href
    let baseURL = options.baseURL;

    // client = {user: user, app: appName} from main page or from options
    // url from main page or from options

    Vue.prototype.$dps = {
      run: ({ script, state, file }) => {
        if (!file) {
          return transport.post(
            url, {
              client,
              script,
              state: { storage: state }
            }
          ).then(response => {
            return {
              type: response.data.type,
              data: response.data.data
            }
          })
        } else {
          let formData = new FormData();
          formData.append("client", JSON.stringify(client))
          formData.append("script", script)
          formData.append("state", JSON.stringify({ storage: state }))
          formData.append('file', file);
          return transport.post(
            url,
            formData, { headers: { 'Content-Type': 'multipart/form-data' } }
          )
        }
      },
      call: this.run,
      getBaseURL: () => baseURL,
      setBaseURL: (value) => {
        transport.defaults.baseURL = value
      }
    }

    Vue.component("dj-img", djImg)
  }
}



var findChild = (component, filter, res) => {

  res = res || []
  if (component.$children) {
    res = res.concat(component.$children.filter(filter))
    component.$children.forEach(child => {
      res = res.concat(findChild(child, filter))
    })
  }

  return res
}

var toTree = (object) =>

  _.keys(object).map(key => {
    return {
      name: (_.isObject(object[key])) ? key : `${key}: ${object[key]}`,
      children: (!_.isObject(object[key])) ? undefined : toTree(object[key])
    }
  })



var eventHub = {}

export var eventhubPlugin = {
  install(Vue) {
    eventHub = new Vue();

    Object.defineProperties(eventHub, {
      on: {
        get: function() {
          return eventHub.$on
        }
      },
      emit: {
        get: function() {
          return eventHub.$emit
        }
      },
      off: {
        get: function() {
          return eventHub.$off
        }
      }
    });

    Object.defineProperty(Vue.prototype, '$eventHub', {
      get: function() {
        return eventHub;
      }
    });

    Object.defineProperty(Vue, 'eventHub', {
      get: function() {
        return eventHub;
      }
    });
  }
}




export var djvuePlugin = {
  install(Vue) {

    Vue.prototype.$djvue = {

      fullReload: (url) => {
        if (url) {
          window.location = url
        } else {

          window.location.reload()
        }
      },

      login: () => {
        Vue.cookie.set('redirectToUrl', window.location);
        window.location = `/auth/google`;
      },

      randomName: () => Math.random().toString(36).substring(2),

      findChild,

      toTree,

      extend: (object, extention) => {
        return _.extend(object, JSON.parse(JSON.stringify(extention)))
      },


      warning(options) {
        options = options || {}
        options.text = options.text || "";
        options.type = options.type || "info";
        options.title = options.title || options.type;

        return Vue.prototype.$dialogManager.showAndWait(warningDialog, options)
      },


      customDialog(options) {
        options = options || {}
        return Vue.prototype.$dialogManager.showAndWait(customDialog, options)
      },

      progress(options) {

        let result = Vue.prototype.$dialogManager.showAndWait(Vue.extend(progressDialog), { persistent: false }, options)
        result.cancel = () => {
          // console.log("FIRE CANCEL",result.dialogID)
          Vue.prototype.$eventHub.emit("progress-dialog-cancel", { dialogID: result.dialogID })
        }
        result.set = (options) => {
          Vue.prototype.$eventHub.emit("progress-dialog-set", _.extend(options, { dialogID: result.dialogID }))
        }
        return result
      },

      confirm(options) {
        options = options || {}
        options.text = options.text || "";
        options.type = options.type || "info";
        options.title = options.title || options.type;

        return new Promise((resolve, reject) => {
          Vue.prototype.$dialogManager.showAndWait(confirmDialog, options)
            .then(res => {
              if (res) {
                resolve()
              } else {
                reject()
              }
            })
        })

      },

      splash(options) {
        return new Promise((resolve) => {
          Vue.prototype.$dialogManager.showAndWait(splashDialog, { width: "30%", hideOverlay: true }, options)
            .then(() => { resolve() })
        })

      },

      openUrl(url, target) {
        if (!url) return
        window.open(url, target);
      },

      selectFile(options) {
        options = options || {}
        options = (_.isString(options)) ? { title: options } : {}
        options.title = options.title || "Upload File";

        return new Promise((resolve, reject) => {
          Vue.prototype.$dialogManager.showAndWait(selectFileDialog, options)
            .then(res => {
              if (res) {
                resolve(res)
              } else {
                reject(null)
              }
            })
        })

      },

      selectWidgets(root, filter) {
        return findChild(root, filter).filter(item => item.widgetWrapper)
      },

      loadLocalFile(file, encoding) {

        return new Promise((resolve) => {
          let fr = new FileReader();
          fr.onload = (e) => {
            resolve(e.target.result)
          }
          fr.readAsText(file, encoding);
          // reader.readAsText(file, 'CP866');
        })

      },

      saveLocalFile(fileName, object) {

        if (!object) return;

        let a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(JSON.stringify(object, null, '\t')));
        a.setAttribute('download', fileName);
        a.click()

      }



    }

    Vue.prototype = _.extend(Vue.prototype, Vue.prototype.$djvue)

  }
}
