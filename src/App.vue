<template>
  <div class="app" v-show="started">
    <v-app>
      <v-speed-dial v-model="fab" bottom right direction="top" fixed transition="scale-transition">
        <template v-slot:activator>
          <v-btn v-model="fab" :color="(!isNeedSave)?'primary lighten-1':'warning'" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn fab dark small v-on="on" color="primary" @click="switchMode()">
              <v-icon :class="(isProductionMode) ? 'mdi-flip-h':''">mdi-exit-to-app</v-icon>
            </v-btn>
          </template>
          <span>Switch to {{ (isProductionMode) ? 'DESIGN' : "PRODUCTION"}} mode</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn fab dark small color="primary" v-on="on" v-if="!isProductionMode" @click="openSettingsDialog()">
              <v-icon>mdi-settings</v-icon>
            </v-btn>
          </template>
          <span>App Settings...</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn fab dark small v-if="isNeedSave" color="warning" v-on="on" @click="saveAppConfig()">
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
          <span>Save App is required</span>
        </v-tooltip>
        <v-menu open-on-hover left offset-y top>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn fab dark small v-if="!isProductionMode" color="primary" v-on="{ ...tooltip, ...menu }">
                  <v-icon>mdi-view-grid</v-icon>
                </v-btn>
              </template>
              <span>Goto Page...</span>
            </v-tooltip>
          </template>
          <v-subheader class="primary white--text ma-0 py-2">PAGES</v-subheader>
          <v-list dence>
            <v-list-item-content>
              <v-list-item v-for="(item, index) in app.pages" :key="index" @click="gotoPage(item)" style="min-height:0 !important">
                <v-list-item-title class="subtitle-2 py-1" :class="(isCurrentPage(item))?'primary--text':'font-weight-light'"> {{item.title}}</v-list-item-title>
              </v-list-item>
            </v-list-item-content>
          </v-list>
        </v-menu>
      </v-speed-dial>
      <v-content>
        <div>
          <holder name="AppHeader" type="skin"></holder>
          <router-view></router-view>
          <holder name="AppFooter" type="skin"></holder>
        </div>
      </v-content>
      <dialog-manager></dialog-manager>
      <!-- <v-snackbar v-model="snbar" bottom :timeout="4000" style="opacity:0.5;">
        
        <v-col cols=12 class="headline text-center font-weight-light">
          {{startMessage}} <span class="font-weight-light subtitle-1">starts in development mode.</span>
        </v-col>
       
      </v-snackbar>   -->
    </v-app>
  </div>
</template>
<script>
import page from "@/components/core/page.vue"
import djvueMixin from "@/mixins/core/djvue.mixin.js"
import listenerMixin from "@/mixins/core/listener.mixin.js"

import * as Cookie from "tiny-cookie"

import holder from "@/components/core/holder.vue"
import djDesignDrawer from "@/components/core/design-drawer/design-drawer.vue"


import dialogManager from "@/components/core/ext/dialog-manager"

import settingsDialog from "@/components/dialogs/config/settings-dialog.vue"
import * as _ from "lodash"

let components = {
  holder,
  "dj-design-drawer": djDesignDrawer,
  "dialog-manager": dialogManager

}


export default {

  mixins: [djvueMixin, listenerMixin],

  components,

  data() {
    return {
      user,
      author,
      designDrawer: false,
      started: false,
      djType: "app",
      progress: null,
      overlay: true,
      loadingMessage: "Please wait...",
      fab: null,
      log: [],
      // sockets: {
      //   connect() {
      //     console.log("connected");
      //   // },
      //   // log(msg) {
      //   //   this.log.push(msg)
      //   // }
      // },
      // snbar:false
    }
  },
  computed: {
    startMessage() {
      return `${this.app.title}/${ (this.app.currentPage) ? this.app.currentPage.title : "" }`
    }
  },

  methods: {

    gotoPage(p) {
      let path = (p.id) ? '/' + p.id : '/'
      this.go(path)
    },

    isCurrentPage(p) {
      return p == this.app.currentPage
    },

    openSettingsDialog() {
      this.$dialogManager.showAndWait(settingsDialog, { width: "90%" })
        .then(() => {
          this.setNeedSave(true)
        })
    },

    getPageInfo(page) {
      if (!page) return {}
      if (!this.app.currentPage) return {}

      return {
        title: page.title,
        path: (page.id) ? '/' + page.id : '/',
        current: page.id == this.app.currentPage.id
      }
    },

    loadAppList() {
      this.$portal
        .get('api/app/get-list')
        .then(response => {})
    },

    login() {
      this.$djvue.login()
    },

    switchMode() {
      // this.splash({text:`Switch to ${ (this.isProductionMode) ? 'DESIGN' : "PRODUCTION" } mode.`})

      this.started = false
      if (this.app.mode == 'production') {
        this.setMode('development')
        this.$cookie.set(__application_Mode_Key, "development")
        if (this.startedMode && this.startedMode == "production") {
          this.fullReload();
        } else {
          this.designDrawer = true
          this.emit("layout-page-start", this)
        }

        // this.emit("design-drawer-show", this)
      } else {
        this.setMode('production')
        this.$cookie.set(__application_Mode_Key, "production")
        this.designDrawer = false
        this.emit("layout-page-start", this)
        // this.fullReload()production
        // this.emit("design-drawer-hide", this)
      }

    },


    setupI18n() {
      let currentLocale = this.$cookie.get("currentLanguage") || "en";

      this.$i18n.mergeLocaleMessage("en", this.app.config.i18n.en);
      this.$i18n.mergeLocaleMessage("uk", this.app.config.i18n.uk);

      this.setLocale(currentLocale)

    }

  },


  created() {

    if (!this.$cookie.get(__application_Mode_Key)) {
      this.$cookie.set(__application_Mode_Key, "production")
    } else {
      this.setMode(this.$cookie.get(__application_Mode_Key))
    }

    this.startedMode = (this.isProductionMode) ? "production" : "development"
    console.log(`DjVue App starts on ${this.startedMode} mode`)
    this.designDrawer = this.startedMode == "development"

    if (this.app.config.theme) {
      this.$vuetify.theme.themes.light = _.extend(this.$vuetify.theme.themes.light, this.app.config.theme)
    }


    this.on({
      event: "page-start",
      callback: () => {
        this.started = true;
        if (this.app.mode == "development") {
          this.splash({ text: `${this.startMessage} starts in development mode.` })
        }
      },
      rule: () => true
    })



  },

  destroyed() {
    this.off()
  },


  mounted() {
    this.setupI18n()
  }


}

</script>
