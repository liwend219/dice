<template>
    <div class="index-page">
        <div class="menu">
            <button class="check-coin" @click="showCheckCoin = true">
                <div class="coin-l">
                    <img src="/static/images/BTC.png" alt="">
                    <span>{{coin}}</span>
                </div>
                <i class="el-icon-caret-bottom"></i>
            </button>
            <div class="check-type">
                <button :class="type == 1?'active':''" @click="type = 1">MANUAL</button>
                <button :class="type == 2?'active':''" @click="type = 2">AUTO</button>
            </div>
        </div>
        <div class="content">
            <p class="available">
                <span>赌注金额</span>
                <span class="available-span">可用 {{getBalances1 && getBalances1[coin] && getBalances1[coin].balance}} {{coin}}</span>
            </p>
            <div class="cell">
                <input type="number" v-model="amount" placeholder="请输入下注筹码">
                <span class="unit">{{coin}}</span>
                <div class="set-box">
                    <button class="set-btn" @click="setHalf">1/2</button>
                    <button class="set-btn" @click="setDouble">2X</button>
                    <button class="set-btn" @click="setMax">MAX</button>
                </div>
            </div>
            <div class="yj" v-if="type == 1">
                <div class="box">
                    <div class="jj">
                        0.001
                        <span class="coin">{{coin}}</span>
                    </div>
                    <p>预计获得奖金</p>
                </div>
            </div>
            <div v-else>
                <div class="auto-box" >
                    <div class="item" >
                        <div class="item-box">
                            <p class="yj-num">0.001 <span>BTC</span></p>
                            <p class="txt1">预计获得奖金</p>
                        </div>
                    </div>
                    <div class="item" style="margin-right:0">
                        <div class="item-box">
                            <input type="number" v-model="autoNum">
                            <p class="txt1" >自动下注计数</p>
                        </div>
                    </div>
                </div>
                <div class="limit-box">
                    <div class="item">
                        <p class="stop-win">止赢金额</p>
                        <input type="text">
                        <span class="unit">{{coin}}</span>
                    </div>
                    <div class="item" style="margin-right:0">
                        <p class="stop-loss">止损金额</p>
                        <input type="text">
                        <span class="unit">{{coin}}</span>
                    </div>
                </div>
            </div>
            <div class="cell-2">
                <div class="item">
                    <div class="item-1">
                        <p class="txt1">{{expectProfit}}X</p>
                        <span class="txt2">Odds</span>
                    </div>
                </div>
                <div class="item">
                    <div class="item-1">
                        <p class="txt1">{{betNum}}</p>
                        <span class="txt2">小于该数获胜</span>
                    </div>
                </div>
                <div class="item" style="margin-right:0;">
                    <div class="item-1">
                        <p class="txt1">{{betNum}}％</p>
                        <span class="txt2">胜率</span>
                    </div>
                </div>
            </div>

            <div class="block">
                <el-slider v-model="betNum"></el-slider>
                <div class="num">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                </div>
            </div>
            <div class="bet-btn" @click="bet">
                投注
            </div>
            <div class="history-box">
                <div class="menu">
                    <button :class="historyType == 1?'active':''" class="my-bet" @click="historyType = 1">MY BET</button>
                    <button :class="historyType == 2?'active':''" class="all-bet" @click="historyType = 2">ALL BETS</button>
                </div>
                <table>
                    <tr>
                        <th>TIME</th>
                        <th>点数</th>
                        <th>盈利</th>
                    </tr>
                    <tr v-if="historyType == 1" bgcolor="#153e5a" v-for="item in myBet" :style="item.profit > 0?'background: #095154;':'background: #5f1d70;'">
                        <td>{{item.created | setTime}}</td>
                        <td>{{parseInt(item.roll)}} {{coin}}</td>
                        <td>{{item.profit}} {{coin}}</td>
                    </tr>
                    <tr v-else bgcolor="#153e5a" v-for="item in allBet" :style="item.profit > 0?'background: #095154;':'background: #5f1d70;'">
                        <td>{{item.created | setTime}}</td>
                        <td>{{parseInt(item.roll)}} {{coin}}</td>
                        <td>{{item.profit}} {{coin}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="modal" v-if="showCheckCoin" @click="showCheckCoin = false">
            <ul class="list-box">
                <li class="item" v-for="(item,key) in getBalances1" :key="key" @click="checkCoin(key)">
                    <div class="item-1">
                        {{key}}<br>
                        可用 {{item.balance.toFixed(item.decimal) }} {{key}}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import BigNumber from 'bignumber.js'
export default {
    data(){
        return {
            type:1,
            coin:'',
            amount:1,
            betNum:50,
            historyType:1,
            autoNum:0,
            showCheckCoin:false,
            myBet:[],
            allBet:[]
        }
    },
    computed:{
        ...mapGetters([
            "getSocket",
            "getBalances1",
            "getSession"
        ]),
        expectProfit(){
            if(this.betNum == 0){
                return 0
            }
            let multiplier = new BigNumber(99).dividedBy(this.betNum);
            return Number(multiplier.toString()).toFixed(2);
        }
    },
    methods:{
        ...mapMutations([
            "setSocket",
            "setBalances",
            "setSession"
        ]),
        ...mapActions([
            "loginFetch",
            "getBalances",
            "getSupportCion",
            "getMyBet",
            "getAllBet"
        ]),
        bet(){
            if(this.amount > this.getBalances1[this.coin].balance){
                alert('dale')
            }
        },
        checkCoin(coin){
            this.coin = coin
            this.showCheckCoin = false
        },
        async init(){
            let res = await this.loginFetch({
                'access_code': 'bo2no2rb5ov0l7h31cu0'
            })
            if(res.code == 1){
                this.setSession(res.data.session)
                this.getBalance(res.data.session)
            }
        },
        setDouble(){
            this.amount *= 2
        },
        setHalf(){
            this.amount /= 2
        },
        setMax(){
            this.amount = this.getBalances1[this.coin].balance
        },
        async getSupportCions (balance){
            let res = await this.getSupportCion()

            if(res.code == 1){
                this.coin = res.data[0].coin
                let obj = {}
                res.data.forEach(val => {
                    obj[val.coin] = val
                    if(balance[val.coin] != undefined){
                        obj[val.coin].balance = balance[val.coin]
                    }
                })
                this.setBalances(obj)
                this.getData()
            }
            
        },
        async getData(){
            Promise.all([this.getMyBet({
                "currency": this.coin,
                "session":this.getSession
            }),this.getAllBet({
                "currency": this.coin
            })]).then(res => {
                console.log(res)
                if(res[0].code == 1){
                    this.myBet = res[0].data
                }
                if(res[1].code == 1){
                    this.allBet = res[1].data
                }
            })
        },
        async getBalance(session){
            let res = await this.getBalances(session)
            if(res.code == 1){
                this.getSupportCions(res.data.balances)
            }
        }
    },
    filters:{
        setTime(val){
            let date = new Date(val*1000)
            let m = (date.getMonth()+1) < 10 ? '0' + date.getMonth()+1 : date.getMonth()+1
            let d = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
            let h = date.getHours() < 10 ?'0'+date.getHours() : date.getHours()
            let min = date.getMinutes() < 10 ?'0' + date.getMinutes() : date.getMinutes()
            let s = date.getSeconds() < 10 ?'0' + date.getSeconds() : date.getSeconds()
            return `${m}-${d} ${h}:${min}:${s}`
        }
    },
    created(){
        this.setSocket();
        this.getSocket.socket.onopen = () =>{
            this.init()
        }
    }
}
</script>

<style lang="less" scoped>
.index-page{
    background: #110e42;
    min-height:100vh;
    .modal{
        width:100%;
        height:100vh;
        position: fixed;
        top:0;
        left:0;
        background: rgba(0,0,0,.5);
        z-index:10000;
        .list-box{
            position: absolute;
            bottom:0;
            width:100%;
            
            .item{
                display: table;
                width:100%;
                height:5.5rem;
                border-bottom:1px solid #eee;
                background: #fff;
                text-align: center;
                .item-1{
                    width:100%;
                    display: table-cell;
                    vertical-align: middle;
                }
            }
        }
    }
    .menu{
        width: 100%;
        height: 5rem;
        background-color: #272263;
        padding:1rem;
        display: flex;
        justify-content: space-between;
        .check-coin{
            width: 10rem;
            height: 3rem;
            background-color: #110e42;
            border-radius: .5rem;
            border:none;
            outline: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0 .7rem;
            color:#fff;
            .coin-l{
                display: flex;
                align-items: center;
                span{
                    margin-left:.8rem;
                }
            }
            img{
                width: 1.4rem;
            }
        }
        .check-type{
            width: 15rem;
            height: 3rem;
            background-color: #191550;
            border-radius: .5rem;
            display: flex;
            // ju
            button{
                width:50%;
                height: 100%;
                color:#fff;
                line-height: 3rem;
                outline: none;
                border:none;
                background: none;
                &.active{
                    background-color: #008ffe;
                    border-radius: .5rem;
                }
            }
        }
    }
    .content{
        padding:1.5rem 1.2rem;
        .available{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
            color: #ffffff;
            .available-span{
                font-size: 1rem;
                color: #e5e5e5;
            }
        }
        .cell{
            width: 100%;
            display: flex;
            // justify-content: space-between;
            position: relative;
            margin-top:.5rem;
            .unit{
                position: absolute;
                left:55%;
                top:1.2rem;
                font-size: 1.2rem;
                color: #ffffff;
            }
            input{
                width: 65%;
                height: 4rem;
                background-color: #191550;
                background-image: url('/static/images/BTC.png');
                background-size: 1.4rem;
                background-repeat: no-repeat;
                background-position: .8rem 50%;
                border-radius: .5rem;
                outline: none;
                border:none;
                color:#fff;
                padding:0 3rem;
                text-align: center;
            }
            ::-webkit-input-placeholder { /* WebKit browsers */
                color: rgb(219, 219, 219);
                // font-size: 16px;
            }
            .set-box{
                display: flex;
                justify-content: space-between;
                margin-left:.6rem;
                width:35%;
                
                
                .set-btn{
                    width: 4rem;
                    height: 4rem;
                    background-color: #191550;
                    border-radius: .5rem;
                    border:none;
                    outline:none;
                    color:#fff;
                }
            }
            
        }
        .yj{
            width: 100%;
            // height: 6rem;
            padding:1rem 0;
            background-color: #272263;
            border-radius: .5rem;
            margin-top:1rem;
            text-align: center;
            display: table;
            .box{
                display: table-cell;
                vertical-align: middle;
            }
            .jj{
                color:#fff;
                font-size: 3rem;
                .coin{
                    color: #1ab394;
                    font-size: 1.8rem;
                }
            }
            p{
                font-size: 1.4rem;
                color: #ffffff;
            }
        }
        .auto-box{
            width:100%;
            display: flex;
            margin-top:.5rem;
            .item{
                width:50%;
                display: table;
                text-align: center;
                height: 6rem;
                background-color: #272263;
                border-radius: .5rem;
                margin-right:.5rem;
                .item-box{
                    display: table-cell;
                    vertical-align: middle;
                    input{
                        width:100%;
                        border:none;
                        outline: none;
                        // height:3rem;
                        background: none;
                        text-align: center;
                        color: #fff600;
                        font-size: 3rem;
                        font-family: 'IMPACT'
                    }
                    .yj-num{
                        font-size: 3rem;
                        color: #fff600;
                        span{
                            font-size: 1.8rem;
                        }
                    }
                    .txt1{
                        font-size: 1rem;
                        color: #ffffff;
                    }
                }
            }
        }
        .limit-box{
            display: flex;
            margin:1.4rem 0 .5rem ;
            .item{
                width:50%;
                margin-right:.5rem;
                position: relative;
                .unit{
                    position: absolute;
                    right:1rem;
                    font-size: 1.2rem;
                    top:3rem;
                    color: #ffffff;
                }
                .stop-win,.stop-loss{
                    font-size: 1rem;
                    color: #ffffff;
                }
                input{
                    width:100%;
                    height: 4rem;
                    background-color: #191550;
                    border-radius: .5rem;
                    border:none;
                    outline: none;
                    background-image: url('/static/images/BTC.png');
                    background-size: 1.4rem;
                    background-repeat: no-repeat;
                    background-position: .8rem 50%;
                }
            }
        }
        .cell-2{
            display: flex;
            margin-top:.5rem;
            .item{
                flex: 1;
                margin-right:.5rem;
                display: table;
                // width: 224px;
                // height: 6rem;
                // padding:.5rem 0;
                height: 6.3rem;
                background-color: #272263;
                border-radius: .5rem;
                .item-1{
                    text-align: center;
                    display: table-cell;
                    vertical-align: middle;
                    .txt1{
                        font-size: 3rem;
                        color: #ffffff;
                    }
                    .txt2{
                        font-size: 1rem;
                        color: #ffffff;
                    }
                }
            }
        }
        .block{
            width:95%;
            margin:4rem auto ;
            .num{
                display: flex;
                justify-content: space-between;
                color:#fff;
            }
        }
        .bet-btn{
            width: 15rem;
            height: 4rem;
            background-color: #008ffe;
            box-shadow: 0px .2rem .7rem 1px 
                rgba(0, 143, 254, 0.31);
            border-radius: .5rem;
            margin:0 auto;
            font-size: 1.5rem;
            text-align: center;
            color: #ffffff;
            line-height: 4rem;
        }
        .history-box{
            width:100%;
            background-color: #272263;
            padding:.7rem .7rem;
            border-radius:.5rem;
            margin-top:4rem;
            .menu{
                display: flex;
                justify-content: space-around;
                border-bottom:1px solid #eee;
                padding:0;
                button{
                    border:none;
                    outline: none;
                    color: #fff;
                    // flex:1;
                    font-size: 1.4rem;
                    background: none;
                    height:100%;

                    &.active{
                        border-bottom:2px solid #fff;
                    }
                }
            }
            table{
                width:100%;
                border-collapse:collapse;
                th{
                    width:33.3%;
                    height:2rem;
                    color: #ededed;
                }
                
                td{
                    width:33.3%;
                    height: 4rem;
                    // background-color: #153e5a;
                    color:#fff;
                    text-align: center;
                    border-bottom:1px solid rgb(107, 107, 107);
                }
            }
        }
    }
}

</style>

<style>
.el-slider__bar{
    height: 1.5rem !important;
    background-color: #30ffaf !important;
    border-radius: .7rem !important;
}
.el-slider__runway{
    background-color: #ff3052;
    border-radius: .7rem !important;
    height: 1.5rem !important;
}
.el-slider__button{
    width:2.3rem;height:2.3rem;
    margin-top:.7rem;
    border: 5px solid rgba(40, 59, 163, 0.5)
}
.el-tooltip__popper.is-dark{
    top:288px !important;
}
</style>