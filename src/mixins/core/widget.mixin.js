import listenerMixin from "@/mixins/core/listener.mixin.js";
import initiableMixin from "@/mixins/core/initiable.mixin.js"
import djvueMixin from "@/mixins/core/djvue.mixin.js"
import { set, isArray } from "lodash"

export default {

  props: ["config"],

  mixins: [listenerMixin, initiableMixin, djvueMixin],

  data: () => ({
    widgetWrapper: true,
    reconfigurable: false,
    data: {},
    pageStarted: false,
    options: {
      widget: {
        visible: true
      }
    }
  }),


  methods: {



    onBeforeInit() { this._waitList = [""] },

    onChildsInitiated() { this.$emit("init", this.config.id) },

    isSameWidget(widget) { return this.config.id == widget.config.id },


<<< if( jace.mode == "development") { >>>
    
    _reconfigure(widget) {

      if (this.$refs.instance.onReconfigure) {

        let c = this.$djvue.extend({}, widget.config)

        this.$refs.instance.onReconfigure(c)
          .then(newConfig => {
            if (newConfig)
              this.emit(
                "holder-update-widget-config",
                this, {
                  widget: this,
                  newConfig: this.$djvue.extend({}, newConfig)
                }
              )
          })
          .catch(() => {})
      }

    },

     _delete() {
      let rule = (this.$refs.instance && this.$refs.instance.isDeleteAvailable) ? this.$refs.instance.isDeleteAvailable : (() => true)
      if (rule.apply(this.$refs.instance)) {
        if (this.$refs.instance && this.$refs.instance.onDelete) this.$refs.instance.onDelete()
        this._removeSubscriptions()
        return true
      }
      return false
    },

<<< } >>>


    _updateConfig() {

      if (!this.pageStarted && this.isProductionMode) return

      new Promise((resolve, reject) => {

        this.reconfigurable = (this.$refs && this.$refs.instance) ? !!this.$refs.instance.onReconfigure : false

        if (!this.config.data) {
          reject("no data")
        }

        if (this.config.data.source == "url") {
          this.$http
            .get(this.config.data.url)
            .then(res => {
              this.hasError = false;
              resolve(res.data)
            })
            .catch((error) => {
              this.hasError = true;
              this.$djvue.warning({
                type: "error",
                title: "Cannot load data",
                text: error.toString()
              })
              if (this.$refs.instance && this.$refs.instance.onError) this.$refs.instance.onError(error)

            })
          return
        }

        if (this.config.data.source == "dps") {
          this.$dps.run({
              script: this.config.data.script
            })
            .then(response => {
              this.hasError = false;
              resolve(response.data)
            })
            .catch(error => {
              this.$djvue.warning({
                type: "error",
                title: "Cannot run dps",
                text: error.toString()
              })
              if (this.$refs.instance && this.$refs.instance.onError) this.$refs.instance.onError(error)
            })
          return
        }

        if (this.config.data.source == "embedded") {
          this.hasError = false;
          resolve(this.config.data.embedded)
          return
        }
      }).then(data => {
        this.update({ data, options: this.config.options })
      })

    },

    run() {
      if (this.$refs.instance && this.$refs.instance.onRun) return this.$refs.instance.onRun()
      return new Promise( resolve => { resolve() })
    },

    update(state) {

      if (!state) state = {
        data: this.data,
        options: this.options
      };

      if (!state.data) state.data = Object.assign({}, this.data);
      if (!state.options) state.options = Object.assign({}, this.options);

      this.data = state.data;
      this.options = state.options;

      this.$nextTick(() => {
        // console.log(this.$refs.instance)
        if (this.$refs.instance && this.$refs.instance.onUpdate) this.$refs.instance.onUpdate(state)
      })
    },

    hide() {
      this.$nextTick(() => {
        this.hidden = true
      })
    },

    show() {
      this.$nextTick(() => {
        this.hidden = false
        this.$nextTick(() => {
          this.update({
            data: this.data,
            options: this.options
          })
        })
      })
    },

    clear() {
      this.$nextTick(() => {
        if (this.$refs.instance && this.$refs.instance.onClear) return this.$refs.instance.onClear()
      })
    },

    setOption(path, value) {
      set(this.options, path, value)
    },

   

    _removeSubscriptions() { this.off() },

    _initSubscriptions() {


<<< if( jace.mode == "development") { >>>

      this.on({
        event: "app-config-save",
        callback: () => {
          if (this.$refs.instance && this.$refs.instance.onSaveAppConfig) this.$refs.instance.onSaveAppConfig()
        },
        rule: () => true
      })

      this.on({
        event: "widget-reconfigure",
        callback: this._reconfigure,
        rule: this.isSameWidget
      })

<<< } >>>


      this.on({
        event: "widget-update",
        callback: this._updateConfig,
        rule: () => true
      })

      this.on({
        event: "page-start",
        callback: () => {
          this.pageStarted = true;
          this._updateConfig()
          if (this.$refs.instance && this.$refs.instance.onPageStart) this.$refs.instance.onPageStart()
        },
        rule: () => true
      })

      this.on({
        event: "page-stop",
        callback: () => {
          if (this.$refs.instance && this.$refs.instance.onPageStop) this.$refs.instance.onPageStop()
        },
        rule: () => true
      })

      this.dataSelectEmitters = this.config.dataSelectEmitters || [];
      this.dataSelectEmitters = (isArray(this.dataSelectEmitters)) ? this.dataSelectEmitters : [this.dataSelectEmitters];
      this.dataSelectEmitters.forEach(emitter => {
        this.on({
          event: "data-select",
          callback: (emitter, data) => {
            if (this.$refs.instance && this.$refs.instance.onDataSelect) this.$refs.instance.onDataSelect(emitter, data)
          },
          rule: emitter
        })
      })
    }

  },

  watch: {

    config() { this._updateConfig() },

    "config.dataSelectEmitters"(value) {
      this.dataSelectEmitters = value || []
      this._removeSubscriptions()
      this._initSubscriptions()
      this._updateConfig()
    }

  },

  created() {
    this.config.data = this.config.data || {}
    this.config.data.script = this.config.data.script || ""
    this._initSubscriptions()
    this._updateConfig()
  },

  beforeDestroy() {
    this._removeSubscriptions()
  }
}
