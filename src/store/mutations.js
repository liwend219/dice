import socket from '../common/socket'
export default {
    setLanguageType(state,v){
        state.languageType = v
    },
    setSocket(state,v){
        state.socket = socket().initSocket()
    },
    setSuperCoin(state,v){
        state.superCoin = v
    },
    setBalances(state,v){
        state.balances = v
    },
    setSession(state,v){
        state.session = v
    },
    setUid(state,v){
        state.uid = v
    }
}