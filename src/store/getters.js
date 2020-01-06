import language from '../language'

export default {
    getLanguageType(state){
        return state.v
    },
    $t(state){
        return language[state.languageType]
    },
    getSocket(state){
        return state.socket
    },
    getBalances1(state){
        return state.balances
    },
    getSession(state){
        return state.session
    },
    getUid(state){
        return state.uid
    }
}