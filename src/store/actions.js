import fetch from '../common/index'
export default {
    loginFetch: async (ctx,data) => {
        let res = await fetch({
            url:'/login',
            method: 'post',
            data,
        })
        return res
    },
    getBalances: async (ctx,data) => {
        let res = await fetch({
            url:'/v1/balances',
            method: 'post',
            headers:{
                'x-access-token':data,
            }
        })
        return res
    },
    getSupportCion: async (ctx,data) => {
        let res = await fetch({
            url:'/coin',
            method: 'get',
            
        })
        return res
    },
    getHash: async (ctx,data) => {
        let res = await fetch({
            url:'/v1/seed/active',
            method: 'post',
            data
        })
    },
    getMyBet:async (ctx,data) => {
        let res = await fetch({
            url:'/v1/mybets',
            method:'post',
            headers:{
                'x-access-token':data.session,
            },
            data:{
                "currency":data.currency
            }
        })
        return res
        
    },
    getAllBet:async (ctx,data) => {
        let res = await fetch({
            url:'/allbets',
            method:'post',
            data
        })
        return res
    }
}