import Axios from "axios"
import { OK } from '../util'

/**
 * ログイン済みユーザーを保持する
 */
const state = {
    user: null,
    apiStatus: null
}

const getters = {
    // ログインチェック
    check: state => !! state.user,
    // ログインユーザーのuserがnullの場合に呼ばれてもエラー発生しないよう空文字を返す
    username: state => state.user ? state.user.name : ''
}

/**
 * userステートの値を更新する
 */
const mutations = {
    setUser(state, user) {
        state.user = user
    },
    setApiStatus(state, status) {
        state.apiStatus = status
    }
}

/**
 * 会員登録APIを呼び出す
 */
const actions = {
    async register(context, data) {
        const response = await axios.post('/api/register', data)
        context.commit('setUser', response.data)
    },
    async login(context, data) {
        context.commit('setApiStatus', null)
        // 通信エラーの取得
        const response = await axios.post('/api/login', data)
            .catch(err => err.response || err)

        // 通信ステータスの更新 成功
        if (response.status === OK) {
            context.commit('setApiStatus', true)
            context.commit('setUser', response.data)
            return false
        }

        // 通信ステータスの更新 失敗
        context.commit('setApiStatus', false)
        // 別モジュールのミューテーションを呼び出す
        context.commit('error/setCode', response.status, { root: true })
    },
    async logout(context) {
        const response = await axios.post('/api/logout')
        context.commit('setUser', null)
    },
    async currentUser(context) {
        const response = await axios.get('/api/user')
        const user = response.data || null
        context.commit('setUser', user)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
