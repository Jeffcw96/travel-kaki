import cookie from '@/utils/cookie'
export default function auth(http) {
    const state = {
        isLogin: false
    }

    const getters = {
        getLoginStatus(state) {
            return state.isLogin
        }
    }

    const mutations = {
        setLogin(state, value) {
            state.isLogin = value
        }
    }

    const actions = {
        async login({ commit, state }, val) {
            const result = await http.post('/user/login', val)
            if (result.data.token) {
                cookie.setCookie('token', result.data.token, 1)
                commit("setLogin", true)
            } else {
                commit("setLogin", false)
            }
        },
    }

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    }

}
