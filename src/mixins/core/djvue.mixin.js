import store from "@/state/index.js"
import { mapState, mapActions } from "vuex"
import * as moment from "moment"
import * as _ from "lodash"
import i18nMixin from "./i18n.mixin"

export default {

  mixins: [i18nMixin],

  store,




  computed: {
    isProductionMode() { return this.app.mode == 'production' },
    isNeedSave() { return this.app.needSave },
    appName() { return this.app.name },


    ...mapState({ app: state => state.Djvue.app })
  },



  methods: {

    saveAppConfig() {
      // this.app.config.pages = _.extend({},this.app.pages)
      // this.app.config.skin = _.extend({},this.app.skin)
      // this.app.config.theme = this.$vuetify.theme.themes.light
      this.app.config.appWidgets = undefined;
      this.app.config.skinName = undefined;

      if (this.emit) {
        this.emit("app-config-save")
      }

      return this.$portal.put(`api/app/config/${this.app.config.id}`, this.app.config)
        .then(() => {
          if (this.app.oldName != this.app.config.name) {
            this.$djvue.fullReload(`app/${this.app.config.name}/`)
          }
        })
        .then(() => {
          this.setNeedSave(false)
        })
        .then(() => {
          this.$portal.post(`/api/app/config/set`, window.devService)
        })

    },

    createEventContext(context) {
      return {
        emitter: this,
        context
      }
    },

    getPage(name) {
      let p = _.find(this.app.pages, item => item.id == name)
      p = p ||
        _.find(this.app.pages, item => !item.id) || {
          name: "error",
          title: "Page not found",
          layout: "layout-1",
          holders: {
            "Holder": { widgets: [] }
          }
        }
      return p;
    },

    go(path) {
      if (this.$route.path == path) return
      this.saveAppConfig()
        .then(() => {
          this.emit("page-stop")
          this.$router.replace(path)
        })
    },

    ...mapActions(
      ["setMode", "setNeedSave", "setCurrentPage", "setHolderContent"]
    ),

    fullReload(url) {
      this.$cookie.set(window.__application_Mode_Key, (this.isProductionMode) ? "production" : "development")
      this.$djvue.fullReload(url)
    },

    setLocale(locale) {
      this.$i18n.locale = locale;
      moment.locale(locale)
      this.$cookie.set("currentLanguage", locale)
    }
  }
}
