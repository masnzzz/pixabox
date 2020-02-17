import { OK, UNPROCESSABLE_ENTITY } from '../util'

/**
 * ログイン済みユーザーを保持する
 */
const state = {
    user: null,
    apiStatus: null,
    loginErrorMessages: null
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
    },
    setLoginErrorMessages(state, messages) {
        state.loginErrorMessages = messages
    }
}

/**
 * APIを呼び出す
 */
const actions = {
    // 会員登録
    async register(context, data) {
        const response = await axios.post('/api/register', data)
        context.commit('setUser', response.data)
    },

    // ログイン
    async login(context, data) {
        context.commit('setApiStatus', null)
        // 通信エラーの取得
        const response = await axios.post('/api/login', data)

        // 通信ステータスの更新 成功
        if (response.status === OK) {
            context.commit('setApiStatus', true)
            context.commit('setUser', response.data)
            return false
        }
        
        // 通信ステータスの更新 失敗
        context.commit('setApiStatus', false)
        if (response.status === UNPROCESSABLE_ENTITY) {
            context.commit('setLoginErrorMessages', response.data.errors)
        } else {
            context.commit('error/setCode', response.status, { root: true })
        }
    },

    // ログアウト
    async logout(context) {
        const response = await axios.post('/api/logout')
        context.commit('setUser', null)
    },

    // ログインユーザーチェック
    async currentUser (context) {
        context.commit('setApiStatus', null)
        const response = await axios.get('/api/user')
        const user = response.data || null
    
        if (response.status === OK) {
          context.commit('setApiStatus', true)
          context.commit('setUser', user)
          return false
        }
    
        context.commit('setApiStatus', false)
        context.commit('error/setCode', response.status, { root: true })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
