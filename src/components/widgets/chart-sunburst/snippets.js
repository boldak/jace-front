export default {
  "Sunburst": {

    type: "sunburst-chart-widget",
    // id:Vue.prototype.$djvue.randomName(),
    name: "noname",
    icon: "mdi-chart-arc",
    options: {

      widget: {
        visible: true
      },

      series: [{
        type: 'sunburst',
        highlightPolicy: 'ancestor',
        data: [],
        radius: [0, '100%'],
        label: {
          normal: {
            show:false
          }
        }
      }]

    },



    data: {
      source: "embedded",
      embedded: {
        tooltip:["name"],
        series: [
          {
            name: 'Grandpa',
            children: [
              {
                name: 'Uncle Leo',
                value: 15,
                children: [{
                    name: 'Cousin Jack',
                    value: 2
                  },
                  {
                    name: 'Cousin Mary',
                    value: 5,
                    children: [{
                      name: 'Jackson',
                      value: 2
                    }]
                  },
                  {
                    name: 'Cousin Ben',
                    value: 4
                  }
                ]
              },
              {
                name: 'Father',
                value: 10,
                children: [{
                    name: 'Me',
                    value: 5
                  },
                  {
                    name: 'Brother Peter',
                    value: 1
                  }
                ]
              }
            ]
          },
          {
            name: 'Nancy',
            children: [{
              name: 'Uncle Nike',
              children: [{
                name: 'Cousin Betty',
                value: 1
              }, {
                name: 'Cousin Jenny',
                value: 2
              }]
            }]
          }
        ]
      }
    }
  }
}
