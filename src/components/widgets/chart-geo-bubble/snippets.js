export default {

  "World Bubbles": {

    type: "geo-bubble-chart-widget",
    name: "noname",
    icon: "mdi-map",
    options: {

      widget: {
        visible: true
      },

      map: {
        locale: "en",
        scope: "World",
        name: "World"
      },

      geo: {
        map: 'World',

        silent: true,

        label: {
          emphasis: {
            show: false,
            areaColor: '#eee'
          }
        },

        itemStyle: {
          normal: {
            borderWidth: 0.2,
            borderColor: '#404a59'
          }
        },

        roam: true
      },


        visualMap: {
          align: 'auto',
          orient:"horizontal",
          dimension: 2,
          inRange: {
              color: ['#313695',  '#e0f3f8', '#ffffbf', '#fee090', '#a50026']
          },
          outOfRange: {
                color: ['#dedede']
          },
          text:['High','Low'],       
          calculable: true
      },


      series: [{

        type: 'scatter',
        coordinateSystem: 'geo',
        data: [
          [4.895168, 52.370216, 1, "Amsterdam"],
          [-83.357567, 33.951935, 2, "Athens"],
          [174.763332, -36.84846, 3, "Auckland"],
          [100.501765, 13.756331, 4, "Bangkok"],
          [2.173403, 41.385064, 5, "Barcelona"],
          [30.5234, 50.4501, 6, "Kiev"],
          [25.279651, 54.687156, 7, "Vilnius"],
          [21.012229, 52.229676, 8, "Warsaw"],
          [16.373819, 48.208174, 9, "Vienna"]

        ],
        activeOpacity: 1,
        label: {
          normal: {
            position: "right",
            color: "#333",
            fontWeight: "bold",
            show: true
          },
          emphasis: {
            show: true
          }
        }
        ,
        itemStyle: {
          normal: {
            borderColor: '#404a59'
          }
        }
      }],

      color: ["#0a0", "#ff0", "#c00"],
    },


    data: {
      source: "embedded",
      embedded: {
        serie: [
          { selector: "AFG", name: "Afghanistan", value: 33885.92544 },
          { selector: "ARM", name: "Armenia", value: 3124.784854 },
          { selector: "UKR", name: "Ukraine", value: 3124.784854 }
        ]
      }
    }

  },

  "Ukraine Bubbles": {

    type: "geo-bubble-chart-widget",
    name: "noname",
    icon: "mdi-map",
    options: {

      widget: {
        visible: true
      },

      map: {
        locale: "uk",
        scope: "Ukraine",
        name: "Ukraine"
      },

      geo: {
        map: 'Ukraine',

        silent: true,

        label: {
          emphasis: {
            show: false,
            areaColor: '#eee'
          }
        },

        itemStyle: {
          normal: {
            borderWidth: 0.2,
            borderColor: '#404a59'
          }
        },

        roam: true
      },


        visualMap: {
          align: 'auto',
          orient:"horizontal",
          dimension: 2,
          inRange: {
              color: ['#313695',  '#e0f3f8', '#ffffbf', '#fee090', '#a50026']
          },
          outOfRange: {
                color: ['#dedede']
          },
          text:['High','Low'],       
          calculable: true
      },


      series: [{

        type: 'scatter',
        coordinateSystem: 'geo',
        data: [
          [4.895168, 52.370216, 1, "Amsterdam"],
          [-83.357567, 33.951935, 2, "Athens"],
          [174.763332, -36.84846, 3, "Auckland"],
          [100.501765, 13.756331, 4, "Bangkok"],
          [2.173403, 41.385064, 5, "Barcelona"],
          [30.5234, 50.4501, 6, "Kiev"],
          [25.279651, 54.687156, 7, "Vilnius"],
          [21.012229, 52.229676, 8, "Warsaw"],
          [16.373819, 48.208174, 9, "Vienna"]

        ],
        activeOpacity: 1,
        label: {
          normal: {
            position: "right",
            color: "#333",
            fontWeight: "bold",
            show: true
          },
          emphasis: {
            show: true
          }
        }
        ,
        itemStyle: {
          normal: {
            borderColor: '#404a59'
          }
        }
      }],

      color: ["#0a0", "#ff0", "#c00"],
    },


    data: {
      source: "embedded",
      embedded: {
        serie: [
          { selector: "05", name: "Вінницька", value: 33885.92 },
          { selector: "12", name: "Дніпропетровська", value: 31240.00 },
          { selector: "32", name: "Київська", value: 15000.78 },
          { selector: "80", name: "Київ", value: 37124.784854 }
           
        ]
      }
    }

  }

}
