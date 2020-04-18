import Vue from '@/plugins/vue'
import vuetify from "@/plugins/vuetify"
import VueRouter from "vue-router"
import VueClipboard from "vue-clipboard2"
import { 
  portalPlugin, 
  httpPlugin, 
  djvuePlugin, 
  cookiePlugin, 
  eventhubPlugin, 
  dpsPlugin, 
  <<< if(jace.availablePublishing) { >>>
  socketPlugin 
  <<< } >>>
} from "@/plugins"


import App from '@/App.vue'
import page from "@/components/core/page.vue"
import store from "@/state/index.js"


import "@/modules/google-fonts/roboto.css"
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/dist/vuetify.min.css"


// import bluebird from "bluebird"

// window.Promise = bluebird

// import "katex/dist/katex.min.css"



// import VueSocketIoExt from "vue-socket.io-extended";
// import io from "socket.io-client";

<<< if(jace.availablePublishing) { >>>
Vue.use(socketPlugin, window.devService.config.pubService);
<<< } >>>


Vue.use(VueClipboard)

// window.gotoPage = path => {
//       console.log(window.appRouter)
//       window.appRouter.push(path)
// }

Vue.use(cookiePlugin)
Vue.use(portalPlugin, { baseURL: `${(window.initialConfig.portalUrl) ? window.initialConfig.portalUrl:''}/` })
Vue.use(dpsPlugin, {
  baseURL: window.dpsURL.trim() || "http://127.0.0.1:8098/",
  client: { user: window.user, app: window.appName }
});

Vue.use(httpPlugin)


Vue.use(djvuePlugin);
Vue.use(eventhubPlugin);


Vue.use(VueRouter)

var router = new VueRouter({
  // hashbang: false,
  // mode: 'history',
  routes: [
    { path: "/", component: page },
    { path: "/:page", component: page }
  ]
})


router.beforeEach((_to, _from, next) => {
  if (store.state.Djvue.app.needSave) {
    Vue.prototype.$djvue.confirm({
        type: "warning",
        text: "App config not saved.",
        rejectText: "Keep page anyway",
        resolveText: "Save app config and keep page"

      })
      .then(() => {
        this.saveAppConfig()
        next()
      })
      .catch(() => {
        next()
      })
  } else {
    next()
  }

})


window.appRouter = router


window.onbeforeunload = (evt) => {
  // console.log(jaceApp)
  if(jaceApp.startedMode == "production") return
  sessionStorage.clear();
  let message = '111'

  if (store.state.Djvue.app.needSave) {
    if (typeof evt === "undefined") {
      evt = window.event;
    }
    if (evt) {
      evt.returnValue = message;
    }
    return message;
  }
}



new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
