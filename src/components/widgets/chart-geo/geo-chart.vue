<script>
import getGeoJson from "./maps.js"
import geo_util from "./utils.js"
import echartWidget from "@/components/widgets/echart-widget/echart-widget.vue"
import * as _ from "lodash"
import echarts from "echarts/dist/echarts-en"

export default {

  extends: echartWidget,

  name: "geo-chart-widget",

  icon: "mdi-map",

  computed: {
    chartOptions() {

      if (!this.options) return
      let res = JSON.parse(JSON.stringify(this.options));

      if (this.config.dataSelectEmitters && this.config.dataSelectEmitters.length > 0 && this.selection.length > 0) {

        let s = this.selection.filter(d => d.selected)
        res.series[0].data = this.serie.filter(d => _.find(s, e => e.entity.id == d.selector))

      } else {
        res.series[0].data = this.serie
      }

      let selection = res.series[0].data.map(d => {
        let f = _.find(this.features, g => {
          return (g.id == d.selector) || _.find(g.properties.geocode, c => c == d.selector)
        })

        if (!f) return null
        
        d.selector = f.id
        return f
      }).filter(d => !_.isNull(d))



      if (selection.length > 0) {
        if (this.config.options.map.scope == "Ukraine") {
          res.series[0].zoom = 0.45 + geo_util.getZoom(selection, this.mapBounds)
          res.series[0].center = geo_util.getCenter(selection)
        } else {
          let bounds = geo_util.getBounds(selection)
          res.series[0].boundingCoords = [
            [
              bounds.left,
              bounds.bottom
            ],
            [
              bounds.right,
              bounds.top
            ]
          ]
        }
      } else {
        if (this.config.options.map.scope == "Ukraine") {
          res.series[0].zoom = 0.45
        }
      }

      res.tooltip = {
        trigger: 'item',
        formatter: d => `${d.name}${(Number.isNaN(d.value)) ? '' : ': '+d.value}`
      }


      return res
    }
  },

  methods: {

    onUpdate({ data, options }) {
      const tempOptions = JSON.parse(JSON.stringify(options));
      const tempData = JSON.parse(JSON.stringify(data));

      let map = getGeoJson(this.config.options.map.scope, this.config.options.map.locale);

      this.features = map.features;

      this.mapBounds = geo_util.getBounds(this.features)
      this.zoom = Math.max(
        (this.mapBounds.right - this.mapBounds.left) / 360,
        (this.mapBounds.bottom - this.mapBounds.top) / 180
      )

      if (!echarts.getMap(this.config.options.map.name)) {
        echarts.registerMap(this.config.options.map.name, map)
      }




      tempOptions.series[0].data = tempData.serie;
      tempOptions.visualMap.min = _.min(tempData.serie.map(d => d.value))
      tempOptions.visualMap.max = _.max(tempData.serie.map(d => d.value))
      tempOptions.visualMap.inRange.color = this.config.options.color;
      tempOptions.visualMap.precision = 3
      this.serie = tempData.serie;
      this.options = tempOptions;


    },

    // onError (error) {
    //   this.template = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
    // },

    onDataSelect(emitter, data) {
      this.selection = JSON.parse(JSON.stringify(data.selection))
    }
  },

  data: () => ({
    options: null,
    selection: [],
    serie: null,
    mapBounds: null,
    features: []
  })

}

</script>
