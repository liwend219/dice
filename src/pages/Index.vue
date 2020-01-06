<template>
    <div class="index-page">
        <div class="loading" v-if="showLoading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="menu">
            <button class="check-coin" @click="showCheckCoin = true">
                <div class="coin-l">
                    <img :src="icon[coin]" alt="">
                    <span>{{coin}}</span>
                </div>
                <i class="el-icon-caret-bottom"></i>
            </button>
            <div class="check-type">
                <button :class="type == 1?'active':''" @click="type = 1">{{$t['manual']}}</button>
                <button :class="type == 2?'active':''" @click="type = 2">{{$t['autoThrow']}}</button>
            </div>
        </div>
        <div class="content">
            <p class="available">
                <span>{{$t['dropValue']}}</span>
                <span class="available-span">{{$t['available']}} {{getBalances1 && getBalances1[coin] && getBalances1[coin].balance}} {{coin}}</span>
            </p>
            <div class="cell">
                <div class="cell-1">
                    <input type="number" :style="`background-image:url(${icon[coin]})`" v-model="amount" :placeholder="$t['enterBetAml']">
                    <span class="unit">{{coin}}</span>
                </div>
                <div class="set-box">
                    <button class="set-btn" @click="setHalf">1/2</button>
                    <button class="set-btn" @click="setDouble">2X</button>
                    <button class="set-btn" @click="setMax">MAX</button>
                </div>
            </div>
            <div class="yj" v-if="type == 1">
                <div class="box">
                    <div class="jj">
                        {{expectProfit2}}
                        <span class="coin">{{coin}}</span>
                    </div>
                    <p>{{$t['EstimateBonus']}}</p>
                </div>
            </div>
            <div v-else>
                <div class="auto-box" >
                    <div class="item" >
                        <div class="item-box">
                            <p class="yj-num">{{expectProfit2}} <span>{{coin}}</span></p>
                            <p class="txt1">{{$t['EstimateBonus']}}</p>
                        </div>
                    </div>
                    <div class="item" style="margin-right:0">
                        <div class="item-box">
                            <input type="number" v-model="betNum">
                            <p class="txt1" >{{$t['betsAutomatic']}}</p>
                        </div>
                    </div>
                </div>
                <div class="limit-box">
                    <div class="item">
                        <p class="stop-win">{{$t['stopWin']}}</p>
                        <input :style="`background-image:url(${icon[coin]})`"  type="number" v-model="stopWin">
                        <span class="unit">{{coin}}</span>
                    </div>
                    <div class="item" style="margin-right:0">
                        <p class="stop-loss">{{$t['stopLost']}}</p>
                        <input :style="`background-image:url(${icon[coin]})`"  type="number" v-model="stopLoss">
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
                        <p class="txt1">{{target}}</p>
                        <span class="txt2">{{$t['lessNumWin']}}</span>
                    </div>
                </div>
                <div class="item" style="margin-right:0;">
                    <div class="item-1">
                        <p class="txt1">{{target}}％</p>
                        <span class="txt2">{{$t['WinningRate']}}</span>
                    </div>
                </div>
            </div>

            <div class="block">
                <el-slider v-model="target" :show-tooltip="false"></el-slider>
                <div v-if="showTarget" :class="roll > target?'states los':'states win'"  :style="`left:${roll-5}%;background-image:url(${roll > target?los:win});`">{{roll}}</div>
                <div class="num">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                </div>
            </div>
            <div class="bet-box">
                <button :class="btnDisabled?'bet-btn dis':'bet-btn'" :disabled="btnDisabled" @click="bet">
                    {{stateTxt}} {{random}}
                </button>
            </div>
            <div class="history-box">
                <div class="menu">
                    <button :class="historyType == 1?'active':''" class="my-bet" @click="historyType = 1">{{$t['gamePageRecord_0']}}</button>
                    <button :class="historyType == 2?'active':''" class="all-bet" @click="historyType = 2">{{$t['gamePageRecord_1']}}</button>
                </div>
                <table v-if="historyType == 1">
                    <tr>
                        <th>{{$t['time']}}</th>
                        <th>{{$t['points']}}</th>
                        <th>{{$t['profit']}}</th>
                    </tr>
                    <tr  bgcolor="#153e5a" @click="detail(item)" v-for="item in myBet" :style="item.profit > 0?'background: #095154;':'background: #5f1d70;'" class="my-tb">
                        <td>{{item.created | setTime}}</td>
                        <td>{{item.roll}}</td>
                        <td>{{item.profit}} {{item.currency}}</td>
                    </tr>
                    
                </table>

                <table v-else>
                    <tr>
                        <th>{{$t['time']}}</th>
                        <th>{{$t['points']}}</th>
                        <th>{{$t['profit']}}</th>
                    </tr>
                    <tr  bgcolor="#153e5a" @click="detail(item)" v-for="item in allBet" :style="item.profit > 0?'background: #095154;':'background: #5f1d70;'" class="all-tb">
                        <td>{{item.created | setTime}}</td>
                        <td>{{item.roll}} </td>
                        <td>{{item.profit}} {{item.currency}}</td>
                    </tr>
                    
                </table>
                
            </div>
        </div>
        <div class="modal" v-if="showCheckCoin" @click="showCheckCoin = false">
            <ul class="list-box">
                <li class="item" v-for="(item,key) in getBalances1" :key="key" @click="checkCoin(key)">
                    <div class="item-1">
                        {{key}}<br>
                        {{$t['available']}} {{item.balance.toFixed(item.decimal) }} {{key}}
                    </div>
                </li>
            </ul>
        </div>
        <div class="modal1" v-if="showModal">
            <div class="detail">
                <div class="close" @click="showModal = false">✖️</div>
                <p class="title">{{$t['bettingDetail']}}</p>
                <div class="content">
                    <div class="detail-box">
                        <div class="item">
                            <p>{{$t['stake']}}</p>
                            <p>{{detailItem.bet_amount}}{{detailItem.currency}}</p>
                        </div>
                        <div class="item">
                            <p>{{$t['Odds']}}</p>
                            <p>{{detailItem.target | odd}}X</p>
                        </div>
                        <div class="item">
                            <p>{{$t['profit']}}</p>
                            <p>{{detailItem.profit}}{{detailItem.currency}}</p>
                        </div>
                    </div>
                    <div class="progress">
                        <el-slider v-model="detailItem.target" :show-tooltip="false" disabled></el-slider>
                        <div class="target-1" :style="`left:${detailItem.target - 5}%`">target:{{detailItem.target}}</div>
                        <div class="roll-1" :style="`left:${detailItem.roll-4}%`">roll:{{detailItem.roll}}</div>
                    </div>
                    <div class="form">
                        <p>{{$t['clientSeed']}}</p>
                        <input type="text" disabled v-model="detailItem.client_seed">
                        <p>{{$t['serverSeed']}} (HASH)</p>
                        <input type="text" disabled v-model="detailItem.server_hash">
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import BigNumber from 'bignumber.js'
import win from '../../static/images/win.png'
import los from '../../static/images/los.png'
// import ibtc from '/static/images/btc.png'
import ibtc from '../../static/images/BTC.png'
import ieth from '../../static/images/ETH.png'
import ieos from '../../static/images/EOS.png'
import ihot from '../../static/images/HOT.png'
import iwns from '../../static/images/WNS.png'
import itest from '../../static/images/WNSTEST.png'
export default {
    data(){
        return {
            type:1,
            coin:'',
            amount:0,
            target:50,
            historyType:1,
            betNum:0,
            showCheckCoin:false,
            myBet:[],
            allBet:[],
            random:'',
            stateTxt:'投注',
            btnDisabled:false,
            stopWin:0,
            stopLoss:0,
            roll:0,
            showTarget:false,
            showModal:false,
            detailItem:'',
            showLoading:true,
            icon:{
                BTC:ibtc,
                EOS:ieos,
                ETH:ieth,
                HOT:ihot,
                WNS:iwns,
                WNSTEST:itest
            },
            win,
            los
        }
    },
    computed:{
        ...mapGetters([
            "getSocket",
            "getBalances1",
            "getSession",
            "getUid",
            "$t"
        ]),
        
        expectProfit(){
            if(this.target == 0){
                return 0
            }
            let multiplier = new BigNumber(99).dividedBy(this.target);
            return Number(multiplier.toString()).toFixed(2);
        },
        expectProfit2(){
            if(this.target == 0 || this.amount <= 0){
                return 0
            }
            let multiplier = new BigNumber(99).dividedBy(this.target);
            return (Number(multiplier.toString()) * Number(this.amount)).toFixed(this.decimal)
        },
        decimal(){
            return this.getBalances1 && this.getBalances1[this.coin] && this.getBalances1[this.coin].precision
        }
    },
    methods:{
        ...mapMutations([
            "setSocket",
            "setBalances",
            "setSession",
            "setUid",
            "setLanguageType"
        ]),
        ...mapActions([
            "loginFetch",
            "getBalances",
            "getSupportCion",
            "getMyBet",
            "getAllBet"
        ]),
        detail(item){
            this.detailItem = item
            this.showModal = true
        },
        formatTooltip(val) {
            return val .toFixed(2);
        },
        bet(){
            if(this.amount > this.getBalances1[this.coin].balance){
                this.$toast(this.$t['balanceNotEnougth'])
                return
            }
            if(this.amount < this.getBalances1[this.coin].min_amount){
                this.$toast(this.$t['canNotLess'])
                return
            }
            if(this.amount > this.getBalances1[this.coin].max_amount){
                this.$toast(this.$t['canNotMax'])
                return
            }
            if(Number(this.amount) <= 0){
                this.$toast(this.$t['inputLegalAmount'])
                return
            }
            this.btnDisabled = true
            this.stateTxt = this.$t['beting']
            let msg;
            if(this.type == 1){
                msg = {
                    id: 102,
                    type: "start_bet",
                    payload:{
                        currency: this.coin,
                        condition: "below",
                        amount: Number(this.amount),
                        target: Number(this.target),
                        betNum: 1,
                    }
                }
            }else{
                msg = {
                    id: 102,
                    type: "start_bet",
                    payload:{
                        currency: this.coin,
                        condition: "below",
                        amount: Number(this.amount),
                        target: Number(this.target),
                        betNum: Number(this.betNum) == 0?1:Number(this.betNum),
                        stopWin:Number(this.stopWin),
                        stopLoss:Number(this.stopLoss)
                    }
                }
            }
            this.getSocket.send(msg)
            this.getSocket.socket.onmessage = (info) =>{
                // console.log(msg)
                this.monitor(JSON.parse(info.data))
            }
        },
        monitor(msg){
            if(msg.type == 'allbets'){
                //加一条
                
                if(this.getUid == msg.payload.uid){
                    this.effect(msg)
                }
                var t = setTimeout(() => {
                    if(!this.allBet){
                        this.allBet = []
                        this.allBet.push(msg.payload)
                    }else if(this.allBet.length < 20){
                        this.allBet.unshift(msg.payload)
                    }else{
                        this.allBet.unshift(msg.payload)
                        this.allBet.splice(-1,1)
                    }
                    
                },1000)
                
            }
            if(msg.type == 'stop_bet'){
                var t = setTimeout(() => {
                    this.stateTxt = this.$t['bet']
                    this.btnDisabled = false
                    this.getBalances1[this.coin].balance = Number(msg.payload.bizAmt)
                    this.showTarget = true
                    this.roll = msg.payload.roll
                },1000)
                
            } 
            if(msg.type == 'stop.autobet'){
                this.betNum -- ;
                var t = setTimeout(() => {
                    this.showTarget = true
                    this.getBalances1[this.coin].balance = Number(msg.payload.bizAmt)
                    this.roll = msg.payload.roll
                },1000)
            }
            if(msg.type == 'end.autobet'){
                this.stateTxt = this.$t['bet']
                var t = setTimeout(() => {
                    this.btnDisabled = false
                    this.getBalances1[this.coin].balance = Number(msg.payload.bizAmt)
                    this.betNum = 0
                },1000)
            }
            if(msg.type == 'error'){
                this.stateTxt = this.$t['bet']
                this.btnDisabled = false
                if(msg.payload.message){
                    this.$toast(msg.payload.message)
                }else{
                    this.$toast(this.$t['unknown error'])
                }
                
            }
        },
        effect(msg){
            let s = 0;
            var t = null;
            t = setInterval(() => {
                if(s >= 1000){
                    this.random = ''
                    this.stateTxt = this.$t['bet']
                    if(!this.myBet){
                        this.myBet = []
                        this.myBet.push(msg.payload)
                    }else if(this.myBet.length < 20){
                        this.myBet.unshift(msg.payload)
                    }else{
                        this.myBet.unshift(msg.payload)
                        this.myBet.splice(-1,1)
                    }
                    clearInterval(t)
                    return 
                }
                this.random = parseInt(Math.random() * 100)
                s += 100
            },80)
        },
        checkCoin(coin){
            this.coin = coin
            this.showCheckCoin = false
            this.amount = this.getBalances1[this.coin].min_amount;
            this.getData()
        },
        async init(codes){
            let res = await this.loginFetch({
                'access_code': codes
            })
            if(res.code == 1){
                let msg = {
                    type:'conn_init',
                    payload:{
                        token:res.data.session
                    }
                }
                this.getSocket.send(msg)
                this.setUid(res.data.uid)
                this.setSession(res.data.session)
                this.getBalance(res.data.session)
                
            }
        },
        setDouble(){
            if(this.amount * 2 >= this.getBalances1[this.coin].balance){
                this.amount = this.getBalances1[this.coin].balance
                return
            }
            this.amount *= 2
        },
        setHalf(){
            if(this.amount / 2 <= this.getBalances1[this.coin].min_amount){
                this.amount = this.getBalances1[this.coin].min_amount
                return
            }
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
                this.amount = obj[this.coin].min_amount
                this.setBalances(obj)
                this.getData()
            }
            
        },
        async getData(){
            Promise.all([this.getMyBet({
                "session":this.getSession
            }),this.getAllBet()]).then(res => {
                this.showLoading = false
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
        },
        odd(target){
            if(target == 0){
                return 0
            }
            let multiplier = new BigNumber(99).dividedBy(target);
            return Number(multiplier.toString()).toFixed(2);
        }
    },
    created(){
        let codes = this.$route.query.code
        let lang = this.$route.query.lang
        if(lang == 'zh-CN'){
            this.setLanguageType(lang)
        }else{
            this.setLanguageType('en-US')
        }
        this.stateTxt = this.$t['bet']
        this.setSocket();
        this.getSocket.socket.onopen = () =>{
            console.log('开启')
            this.init(codes)
        }
    },
    watch:{
        myBet(val){
            var div = document.getElementsByClassName('my-tb')[0];
            if(div){
                div.classList.add("shine1");
                let t = setTimeout(() => {
                    div.classList.remove("shine1");
                },1000)
            }
        },
        allBet(val){
            var div = document.getElementsByClassName('all-tb')[0];
            if(div){
                div.classList.add("shine1");
                let t = setTimeout(() => {
                    div.classList.remove("shine1");
                },1000)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.index-page{
    background: #110e42;
    min-height:100vh;
    .loading{
        width: 100%;
        height:100vh;
        position: fixed;
        top:0;
        left:0;
        background: rgba(0,0,0,.5);
        z-index:100000;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .loading span{
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 5px;
        border-radius: 50%;
        background: rgb(255, 255, 255);
        animation: load 1.04s ease infinite;
    }
    .loading span:last-child{
        margin-right: 0px; 
    }
    @keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
    .loading span:nth-child(1){
        animation-delay:0.13s;
    }
    .loading span:nth-child(2){
        animation-delay:0.26s;
    }
    .loading span:nth-child(3){
        animation-delay:0.39s;
    }
    .loading span:nth-child(4){
        animation-delay:0.52s;
    }
    .loading span:nth-child(5){
        animation-delay:0.65s;
    }
    @keyframes shine {
        0% {opacity: 1;}
        50% {opacity: .5;}
        100% {opacity: 1;}
    }
    .shine1{
        animation: shine 1s infinite;
        // animation-fill-mode: forwards;
    }
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
            width: 11rem;
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
        width:100%;
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
            
            margin-top:.5rem;
            .cell-1{
                width: 65%;
                position: relative;
            }
            .unit{
                position: absolute;
                right:0.8rem;
                top:1.2rem;
                font-size: 1.2rem;
                color: #ffffff;
            }
            input{
                width: 100%;
                height: 4rem;
                background-color: #191550;
                // background-image: url('/static/images/BTC.png');
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
                overflow: hidden;
                // height: 6rem;
                min-height:8.8rem;
                max-height:9.2rem;
                background-color: #272263;
                border-radius: .5rem;
                margin-right:.5rem;

                .item-box{
                    display: table-cell;
                    vertical-align: middle;
                    min-height:8.8rem;
                    max-height:9.2rem;
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
                    // background-image: url('/static/images/BTC.png');
                    background-size: 1.4rem;
                    background-repeat: no-repeat;
                    background-position: .8rem 50%;
                    color:#fff;
                    text-align: center;
                }
            }
        }
        .cell-2{
            width:100%;
            display: flex;
            margin-top:.5rem;
            .item{
                flex: 1;
                width:33.3%;
                margin-right:.5rem;
                display: table;
                overflow: hidden;
                // width: 224px;
                // height: 6rem;
                // padding:.5rem 0;
                height: 6.3rem;
                background-color: #272263;
                border-radius: .5rem;
                .item-1{
                    width:100%;
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
            position: relative;
            .num{
                display: flex;
                justify-content: space-between;
                color:#fff;
                margin-top:.8rem;
            }
            .states{
                position: absolute;
                width:3.5rem;
                height:2.9rem;
                background-size: 100% 100%;
                top:3rem;
                color:#fff;
                text-align: center;
                line-height: 3.5rem;
                font-size: 1rem;
                &.win{
                    transition:left 0.8s;
                    // background-image: url('/static/images/win.png');
                }
                &.los{
                    transition:left 0.8s;
                    // background-image: url('/static/images/los.png');
                }
            }
        }
        .bet-box{
            text-align: center;
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
                outline: none;
                border:none;
                font-family: 'IMPACT';
                &.dis{
                    background-color: #818181;
                }
            }
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
                    font-family: 'IMPACT';
                    font-weight: 100; 
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
    .modal1{
        width:100%;
        height:100vh;
        background: rgba(0, 0, 0, .5);
        position: fixed;
        z-index:10000;
        top:0;
        left:0;
        .detail{
            position: absolute;
            width:94%;
            top:5%;
            left:50%;
            margin-left:-47%;
            // height:
            padding:1.5rem;
            background: #fff;
            border-radius:.5rem;
            .close{
                color: #fff;
                font-size: 1.5rem;
                text-align:right;
            }
            .title{
                text-align: center;
                font-size: 1.4rem;

            }
            .content{
                padding:1.5rem .5rem;
                .detail-box{
                    width:100%;
                    background: #303137;
                    padding:1.5rem 0;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    border-radius:.5rem;
                    .item{
                        flex:1;
                        text-align: center;
                        color:#fff;
                        font-size: 1.4rem;
                        border-right:1px solid #eee;
                    }
                }
                .progress{
                    width:100%;
                    border:1px solid #eee;
                    position: relative;
                    padding:3rem 0.5rem;
                    margin-top:1rem;
                    
                    .target-1,.roll-1{
                        position: relative;
                        display: inline-block;
                        padding:.5rem;
                        color:#fff;
                        background: #2678b6;
                    }
                    .target-1{
                        position: absolute;
                        &::after{
                            content: '';
                            position: absolute;
                            width:1rem;
                            height: 1rem;
                            transform: rotate(45deg);
                            background: #2678b6;
                            top:-.5rem;
                            left:1rem;
                        }
                    }
                    .roll-1{
                        position: absolute;
                        top:.5rem;
                        // left:0;
                        &::after{
                            content: '';
                            position: absolute;
                            width:1rem;
                            height: 1rem;
                            transform: rotate(45deg);
                            background: #2678b6;
                            bottom:-.5rem;
                            left:1rem;
                        }
                    }
                }
                .form{
                    margin-top:1rem;
                    p{
                        font-size: 1.4rem;
                        line-height: 2rem;
                    }
                    input{
                        width:100%;
                        height:4rem;
                        outline: none;
                        border:none;
                            background: #e4e4e4;
                        color:#fff;
                        margin-bottom:2rem;
                        text-align: center;
                        border-radius:.2rem;
                        margin-top:.5rem;
                    }
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
    width:2.5rem !important;
    height:2.5rem !important;
    margin-top:.8rem !important;
    border: 5px solid rgba(40, 59, 163, 0.5) !important;
}
/* .el-tooltip__popper.is-dark{
    top:288px !important;
} */
</style>