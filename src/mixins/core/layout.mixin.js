import djvueMixin from "@/mixins/core/djvue.mixin.js"
import listenerMixin from "@/mixins/core/listener.mixin.js"
import initiableMixin from "@/mixins/core/initiable.mixin.js"
import { values } from "lodash"


export default {

  mixins: [djvueMixin, listenerMixin, initiableMixin],

  beforeDestroy() {
    this.emit("page-stop", this, this.app.currentPage)
    this.off()
  },

  data: () => ({
    djType: "layout",
    djId: null
  }),

  methods: {

    getMediators() {
      let pageLevelMediators = []
      values(this.app.currentPage.holders).forEach(h => {
        pageLevelMediators = pageLevelMediators.concat(h.widgets.filter(w => w.type == "mediator-widget"))
      })

      pageLevelMediators = pageLevelMediators.map(m => this.$djvue.selectWidgets(this.$root, item => (item.config) && (item.config.id == m.id))[0])

      let appLevelMediators = []
      values(this.app.config.skin.holders).forEach(h => {
        appLevelMediators = appLevelMediators.concat(h.widgets.filter(w => w.type == "mediator-widget"))
      })

      appLevelMediators = appLevelMediators.map(m => this.$djvue.selectWidgets(this.$root, item => (item.config) && (item.config.id == m.id))[0])

      if (pageLevelMediators.length == 0) pageLevelMediators.push({ run: () => {} })
      if (appLevelMediators.length == 0) appLevelMediators.push({ run: () => {} })


      return [pageLevelMediators, appLevelMediators]
    },

    pageStart() {
      let mediators = this.getMediators();
      // console.log(mediators)
      // console.log("PageStart", mediators)

      Promise.all(mediators[0].map(pl => pl.run()))
        .then(() => {
          Promise.all(mediators[1].map(al => al.run()))
            .then(() => {
              this.$nextTick(() => {
                this.emit("page-start")
                  .then(() => {
                    this.emit("page-start-after")
                  })
              })
            })
            .catch((e) => {
              // eslint-disable-next-line
              console.error("App level error", e.toString())
              this.$djvue.warning({
                type: "error",
                title: `App level Error`,
                text: e.toString()
              })

              this.$nextTick(() => {
                this.emit("page-start")
                  .then(() => {
                    this.emit("page-start-after")
                  })
              })

            })
        })
        .catch((e) => {
          // eslint-disable-next-line	
          console.error("Page level error", e.toString())
          this.$djvue.warning({
            type: "error",
            title: `Page level Error`,
            text: e.toString()
          })

          this.$nextTick(() => {
            this.emit("page-start")
              .then(() => {
                this.emit("page-start-after")
              })
          })

        })
    },

    onChildsInitiated() {
      // console.log("onchildInitiated",this.djId,"emit layout-page-start")
      this.emit("layout-page-start", this) //pageStart() 
    }
  },

  created() {
    // console.log(this)
    this.djId = this.$djvue.randomName()
    this.on({
      event: "layout-page-start",
      callback: () => { this.pageStart() },
      rule: () => true
    })
    this.on({
      event: "page-stop",
      callback: () => { this.off() },
      rule: () => true
    })
    
  }

}
