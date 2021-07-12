import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import tab from './modules/tab'
import auth from './modules/auth'

Vue.use(Vuex)

export default function store(http) {
    return new Vuex.Store({
        modules: {
            user: user(http),
            auth: auth(http),
            tab: tab()
        }
    })
}
