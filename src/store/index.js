import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

Vue.use(Vuex)

export default function store(http) {
    return new Vuex.Store({
        modules: {
            user: user(http)
        }
    })
}
