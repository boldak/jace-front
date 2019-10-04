<template>

  <v-card flat color="transparent">
    <v-card-title class="py-0" v-if="user.isLoggedIn">
      <span class="font-weight-light body-2">{{portalURL}}</span>
     <v-spacer></v-spacer>
      
      <v-btn icon small @click="createApp" class="primary--text">
        <v-icon>mdi-plus</v-icon>
      </v-btn>  
      
      <v-divider vertical class="mx-2"></v-divider>
      
      <v-btn icon small @click="importApp" class="primary--text">
        <v-icon>mdi-import</v-icon>
      </v-btn>

      <v-btn icon small @click="openUrl('/api/app/export/'+selected.id,  '_blank')" :disabled="!selected" class="primary--text">
        <v-icon>mdi-export</v-icon>
      </v-btn>

      <v-divider vertical class="mx-2"></v-divider>
      
      <v-btn icon small 
        :disabled="!selected" 
        class="primary--text" 
        v-if="selected" 
        @click="openUrl('./design/'+selected.name,'_blank'+selected.name)"
      >
          <v-icon>mdi-play</v-icon>
      </v-btn>
      
      <v-divider vertical class="mx-2"></v-divider>
      
      <v-btn v-if="selected" icon small @click="deleteApp" :disabled="!selected || (app.config.name == selected.name) || !user.isOwner" class="primary--text">
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
       
    </v-card-title>
    
    <v-divider></v-divider>
    <v-row>
      
      <v-col cols="4" class="ml-3 pa-0">
        
        <v-list style="
            background:transparent !important;    
            max-height: 650px;
            overflow: auto;">
            <v-list-item v-for="(item, index) in appList" @click="toggle(item)">
              <v-list-item-avatar tile size="24" class="ma-0">
                <dj-img :src="item.icon" icon="mdi-application"></dj-img>
              </v-list-item-avatar>
              <v-list-item-title class="body-2 pl-2" :class="(selected && selected.name == item.name) ? 'primary--text':''">{{item.name}}</v-list-item-title>
              
            </v-list-item>
        </v-list>

        <v-overlay
          absolute="absolute"
          opacity="0.4"
          :value="overlay"
          z-index="5"
        >
          <v-progress-circular indeterminate size="48"></v-progress-circular>

        </v-overlay>    
      
      </v-col>

      <v-divider vertical></v-divider>
      
      <v-col class="mx-2">
        <v-card flat v-if="selected" color="transparent">
          <v-row>
            <v-col>
              <v-avatar tile size="36">
               <dj-img :src="selected.icon" icon="mdi-application" class="pr-2"></dj-img>
              </v-avatar>
              <a :href="'./design/'+selected.name" :target="'blank_'+selected.name"> 
                <span class="headline font-weight-light">{{selected.name}}</span>
              </a>  
            </v-col>
            <div class="mx-2">

              <!-- <v-row class="mx-0 px-0"> -->
                <p class="text-right my-0">
                  <v-icon small class="pr-2">mdi-update</v-icon>
                  <span class="caption">{{timeAgo(selected.updatedAt)}}</span>
                </p>
                <p class="text-right my-0">
                  <v-icon  small material-icons class="pr-2">access_time</v-icon>
                  <span class="caption">{{timeAgo(selected.createdAt)}}</span>
                </p>  
              <!-- </v-row> -->
       
            </div>  
          
          </v-row>
          
          <v-divider></v-divider>
          
          <v-row class="mx-2 pa-3 body-2 font-weight-light" style="text-align:justify;">
            {{selected.description}}
          </v-row>  
          
          <v-divider></v-divider>
          
          <v-row class="mx-2 pa-3 body-2 font-weight-light" style="text-align:justify;">
            <div v-if="selected.owner">
              
                <v-avatar>
                  <dj-img :src="selected.owner.photo" icon="mdi-account"></dj-img>
                </v-avatar>
              <a :href="'mailto:'+selected.owner.email">  
                {{selected.owner.name}}
              </a>&nbsp; (Author)
            </div>
          </v-row>  
    

        </v-card>  
      </v-col>  
    </v-row>
    <v-divider></v-divider>
  </v-card>    


<!--   <v-card flat style="background:transparent !important;">
    <v-container>
      <v-card-title primary-title class="pt-0 pb-0">
        <div>
          <h3 class="headline mb-0">DjVue Apps</h3>
          <div>{{portalURL}}</div>
        </div>
        <v-spacer></v-spacer>
        <v-menu bottom left>
          <v-btn slot="activator" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="openNewAppDialog">
              <v-list-tile-title>
                <v-icon>mdi-plus</v-icon> New App...
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="importApp">
              <v-list-tile-title>
                <v-icon>mdi-download</v-icon> Import App...
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-title class="pr-5 pt-0 pb-0">
        <v-autocomplete v-model="keywordsSelection" :items="keywords" color="primary" label="Select keywords" multiple>
          <template slot="selection" slot-scope="data">
            <v-chip outline label color="primary" :selected="data.selected" close class="chip--select-multi" @input="remove(data.item)">
              {{ data.item }}
            </v-chip>
          </template>
          <template slot="item" slot-scope="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-autocomplete>
      </v-card-title>
      <v-divider></v-divider>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex d-flex xs12 sm12 md12 lg4>
            <v-list style="
            background:transparent !important;    
            height: 350px;
            border:1px solid #dedede;
            overflow: auto;">
              <template v-for="(item, index) in apps">
                <v-subheader v-if="item.header" :key="item.header">
                  {{ item.header }}
                </v-subheader>
                <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>
                <v-list-tile v-else :key="item.name" avatar ripple :class="{'blue-grey lighten-4':(selected == index)}" @click="toggle(index)">
                  <v-list-tile-avatar tile size="24">
                    <dj-img :src="item.icon" icon="mdi-application"></dj-img>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{item.description}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
          <v-flex d-flex xs12 sm12 md12 lg8>
            <v-card flat style="background:transparent !important; border:1px solid #dedede;" v-if="selected != null">
              <v-toolbar flat card dense color="blue-grey lighten-5">
                <v-spacer></v-spacer>
                <v-btn flat color="primary">
                  <a :href="'./app/'+apps[selected].name" :target="'blank_'+apps[selected].name">
                    Open
                  </a>
                </v-btn>
                <v-btn flat color="primary">
                  <a target="_blank" :href="`/api/app/export/${apps[selected].id}`">
                    Export
                  </a>
                </v-btn>
                <v-btn flat color="error" :disabled="app.config.name == apps[selected].name" @click="deleteApp(apps[selected])">
                  Delete...
                </v-btn>
              </v-toolbar>
              <v-card-title primary-title class="pt-0 pb-0">
                <div>
                  <h5 class="headline ma-1">
                    <v-avatar tile>
                      <dj-img :src="apps[selected].icon" icon="mdi-application"></dj-img>
                    </v-avatar>
                    {{apps[selected].name}}
                  </h5>
                  <h6 class="title ma-1">{{apps[selected].title}}</h6>
                </div>
                <v-spacer></v-spacer>
                <div>
                  <v-tooltip tag="div" top>
                    <div slot="activator">
                      <v-icon>mdi-update</v-icon>
                      <span>{{timeAgo(apps[selected].updatedAt)}}</span>
                    </div>
                    <div>Updated at {{formatDate(apps[selected].updatedAt)}}</div>
                  </v-tooltip>
                  <v-tooltip tag="div" bottom>
                    <div slot="activator">
                      <v-icon material-icons>access_time</v-icon>
                      <span>{{timeAgo(apps[selected].createdAt)}}</span>
                    </div>
                    <div>Created at {{formatDate(apps[selected].createdAt)}}</div>
                  </v-tooltip>
                </div>
              </v-card-title>
              <v-card-text class="body-1" style="text-align:justify;">
                {{apps[selected].description}}
                <h5 class="subheading">Team: {{(apps[selected].owner) ? "" : "DjVue"}}</h5>
                <div v-if="apps[selected].owner">
                  <a :href="'mailto:'+apps[selected].owner.email">
                    <v-avatar>
                      <v-img :src="apps[selected].owner.photo"></v-img>
                    </v-avatar>
                    {{apps[selected].owner.name}}
                  </a>&nbsp; (Author)
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
  </v-card> -->
</template>
<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import moment from "moment"
import NewAppDialog from "./new-app-dialog.vue";
import ImportAppDialog from "./import-app-dialog.vue";


export default {

  name: "app-list-widget",

  icon: "mdi-apps",

  mixins: [djvueMixin, listenerMixin],

  methods: {

    importApp() {
      this.$dialogManager.showAndWait(ImportAppDialog, { width: "30%" }, { appList: this.appList })
        .then( res => {
          if(!res) return

          let formData = new FormData();
          formData.append("name", res.name)
          formData.append('file', res.file);
          this.$portal.post('api/app/import',
              formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
            .then(() => {
              this.loadAppList()
                .then(() => {
                  this.selected = _.find(this.appList, a => a.name = res.name)
                })

            })
            .catch(e => {
              // console.log("ERROR")
            })
        })
    },

    deleteApp() {
      let app = this.selected
      this.$djvue.confirm({
          type: "warning",
          title: "Delete app",
          text: `You sure want to delete app ${app.name} "${app.title}"`,
          rejectText: "Cancel",
          resolveText: "Delete"

        })
        .then(() => {
          this.$portal.get(`api/app/destroy/${app.id}`)
            .then(() => {
              this.loadAppList()
              // this.selected = null
            })
        })


    },

    createApp() {
      this.$dialogManager.showAndWait(NewAppDialog, { width: "50%" }, { appList: this.appList })
        .then(res => {
          if(!res) return
            this.$portal.post("api/app/create/", {
              config: res
            })
            .then(() => {
              this.$djvue.warning({
                type: "success",
                title: "App created",
                text: `Access to app with url ${this.portalURL}/app/${res.name}`
              })
              this.loadAppList()
                .then(() => {
                  this.selected = _.find(this.appList, a => a.name = res.name)
                })

            })
            .catch(e => {
              this.$djvue.warning({
                type: "error",
                title: "Cannot create app",
                text: e.toString()
              })
            })
          
        })
    },


    timeAgo(d) {
      return moment(new Date(d)).fromNow();
    },

    formatDate(d) {
      return moment(new Date(d)).format("DD MMM YYYY HH:mm")
    },

    remove(item) {
      const index = this.keywordsSelection.indexOf(item)
      if (index >= 0) this.keywordsSelection.splice(index, 1)
    },

    _makeKeywords(data) {
      let keywords = [];
      data.forEach(app => {
        keywords = _.union(keywords, app.keywords)
      })
      _.remove(keywords, k => k == "");

      this.keywords = keywords
    },

    loadAppList() {
      
      this.appList = []
      this.selected = null
      this.overlay = true
      return this.$portal
        .get('api/app/get-list')
        .then(response => {
          this._makeKeywords(response.data)
          this.appList = response.data.map( d=> d )
          if(!this.selected && this.appList.length>0) this.selected = this.appList[0] 
          this.$nextTick(() => { 
            this.overlay = false 
          })  
        })
    },

    toggle(item) {
      this.selected = item;
    }

  },

  props: ["config"],

  // computed: {
  //   apps() {
  //     if (this.keywordsSelection.length == 0) return this.appList;
  //     return this.appList.filter(app => _.intersection(app.keywords, this.keywordsSelection).length > 0)
  //   }
  // },

  // watch: {
  //   keywordsSelection(value) {
  //     this.selected = null
  //   }
  // },

  created() {
    this.portalURL = 'Hosted on ' + window.location.origin
    this.loadAppList()
  },

  mounted() {
    this.$emit("init")
  },

  data: () => ({
    appList: [],
    selected: null,
    keywords: [],
    keywordsSelection: [],
    portalURL: "",
    user,
    overlay:false
  })

}

</script>
