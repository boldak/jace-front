
export default {
      // 'hello-world' :() => import("./hello-world/HelloWorld.vue"),

      'html-widget' :() => import("./html/html.vue"),
      'md-widget' :() => import("./md/md.vue"),
      
      'edu-editor-widget' :() => import("./edu-editor/edu-editor.vue"),
      'edu-push-button-widget' :() => import("./edu-push-button/edu-push-button.vue"),
      'edu-console-widget' :() => import("./edu-console/edu-console.vue"),
      
      'uml-chart-widget' :() => import("./uml-chart/uml-chart.vue"),
      
      'inputs-widget' :() => import("./inputs/inputs.vue"),
      'flowchart-widget' :() => import("./flowchart/flowchart.vue"),
      // 'tree-widget' :() => import("./tree/tree.vue"),

      'mediator-widget' : () => import("./mediator/mediator.vue"),
      // 'config-widget' : () => import("./config/config.vue"),
      
      'dps-suite-widget' : () => import("./dps-suite/dps-suite.vue"),
      'dps-highlight-widget' : () => import("./dps-highlight/dps-highlight.vue"),
      
      'ds-explorer-widget' : () => import("./ds-explorer/ds-explorer.vue"),
      'ds-value-explorer-widget' : () => import("./ds-value-explorer/ds-value-explorer.vue"),
      'ds-ontology-widget' : () => import("./ds-ontology/ds-ontology.vue"),
      


      // 'tree-widget' :() => import("./tree/tree.vue"),
      // 'echart-widget' :() => import("./echart/echart.vue"),



      'bar-chart-widget': () => import("./chart-bar/bar-chart.vue"),
      
      'wordcloud-chart-widget': () => import("./chart-word-cloud/wordcloud-chart.vue"),

      'pie-chart-widget': () => import("./chart-pie/pie-chart.vue"),
      'graph-chart-widget': () => import("./chart-graph/graph-chart.vue"),
      
      'gauge-chart-widget': () => import("./chart-gauge/gauge-chart.vue"),
      
      'line-chart-widget': () => import("./chart-line/line-chart.vue"),
      'scatter-chart-widget': () => import("./chart-scatter/scatter-chart.vue"),
      'bubble-chart-widget': () => import("./chart-bubble/bubble-chart.vue"),
      'scatter1d-chart-widget': () => import("./chart-scatter1d/scatter1d-chart.vue"),
      'radar-chart-widget': () => import("./chart-radar/radar-chart.vue"),
      // 'tree-chart-widget': () => import("./chart-tree/tree-chart.vue"),
      // 'treemap-chart-widget': () => import("./chart-treemap/treemap-chart.vue"),
      'sunburst-chart-widget': () => import("./chart-sunburst/sunburst-chart.vue"),
      // 'scatter3d-chart-widget': () => import("./chart-scatter3d/scatter3d-chart.vue"),
      'geo-chart-widget': () => import("./chart-geo/geo-chart.vue"),
      
      'geo-bubble-chart-widget': () => import("./chart-geo-bubble/geo-bubble-chart.vue"),
      'geo-markers-chart-widget': () => import( "./chart-geo-markers/geo-markers-chart.vue"),     
      'data-selector-widget': () => import("./data-selector/data-selector.vue"),

      'data-legend-widget': () => import("./data-legend/data-legend.vue"),

      'data-keywords-widget': () => import("./data-keywords/data-keywords.vue"),
      
      'data-table-widget': () => import("./data-table/data-table.vue"),


      'app-topbar-widget': () => import("./app-topbar/app-topbar.vue"),
      'app-footer-widget': () => import("./app-footer/app-footer.vue"),
      'app-list-widget': () => import("./app-list/app-list.vue"),

      'form-widget': () => import("./form/form.vue"),
      'question-widget': () => import("./question/question.vue"),
      'form-report-widget': () => import("./form-report/form-report.vue"),
      'form-response-widget': () => import("./form-response/form-response.vue")
      
      
      
      

      // 'editor-widget' :() => import("./ace/ace.vue")
}