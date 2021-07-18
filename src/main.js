// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './assets/style.css';
import axios from 'axios'
Vue.config.productionTip = false
let vuexStore = store(axios.create({
  baseURL: "http://localhost:3000/"
  // baseURL: "https://travel-kaki.herokuapp.com/"
}));
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: vuexStore,
  router,
  components: { App },
  template: `<App/>`
})
