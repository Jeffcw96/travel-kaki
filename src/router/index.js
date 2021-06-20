import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Multilocation from '@/view/Multilocation'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Home
    },
    {
      path: '/multilocation',
      name: 'test',
      component: Multilocation
    },
  ]
})
