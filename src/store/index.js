import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import tab from './modules/tab'

Vue.use(Vuex)

export default function store(http) {
    return new Vuex.Store({
        modules: {
            user: user(http),
            tab: tab()
        }
    })
}
