<template>
  <v-app-bar v-if="options" dark dence flat color="primary darken-1" class="mt-0 mb-2 py-0" style="padding-top: 1em; font-weight:300;">
    <div class="headline font-weight-light">
      {{options.title}}
    </div>
    <v-spacer></v-spacer>
    
    <span v-for="page in options.references">
      <router-link v-if="page.id" :to="`/${page.id || ''}`" class="white--text" style="text-decoration: none; padding: 0 0.5em;">
        {{page.title}}
      </router-link>
      <a v-if="page.url" :href="page.url" :target="page.target" class="white--text" style="text-decoration: none; padding: 0 0.5em;">
        {{page.title}}
      </a>
    </span>

    <v-divider vertical v-if="options.login || options.locale || options.user"></v-divider>
    <v-tooltip left v-if="!app.user.isLoggedIn && options.login">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on:click="login()" v-on="on">
          <v-icon>mdi-google-plus</v-icon>
        </v-btn>
      </template>  
      <span>Login with Google</span>
    </v-tooltip>

    <v-menu offset-y v-if="options.locale">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon>
          <img :src="'./img/'+$i18n.locale+'.png'" small>
        </v-btn>
      </template>  
      <v-list>
        <v-list-item key="uk" @click="setLocale('uk')">
          <img :src="'./img/uk.png'" small>
        </v-list-item>
        <v-list-item key="en" @click="setLocale('en')">
          <img :src="'./img/en.png'" small>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-tooltip left v-if="app.user.isLoggedIn && options.user">
      <template v-slot:activator="{ on }">
        <v-avatar size="32" class="ml-2" v-on="on" style="border: 1px solid rgba(255, 255, 255, 0.3);">
          <dj-img :src="app.user.photo" icon="mdi-account"></dj-img>
        </v-avatar>
      </template>  
      <span>{{app.user.name}}</span>
    </v-tooltip>
  </v-app-bar>







</template>
<script>
import djvueMixin from "@/mixins/core/djvue.mixin.js";
import listenerMixin from "@/mixins/core/listener.mixin.js";
import TopBarConfig from "./app-topbar-config.vue"

export default {

  name: "app-topbar-widget",

  icon: "mdi-page-layout-header",

  mixins: [djvueMixin, listenerMixin],

  methods: {

    onReconfigure(widgetConfig) {
      return this.$dialogManager.showAndWait(TopBarConfig, { width: "90%" }, { config: widgetConfig })
    }

  },

  props: ["config"],

  computed: {
    options() {
      return this.config.data.embedded
    }
  },

  mounted() { this.$emit("init") }

}

</script>
<style>
a:hover {
  font-weight: 500;
}

</style>
