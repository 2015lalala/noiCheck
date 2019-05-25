<template>
    <div class="leftContentOne">
        <!--第一部分-->
            <div class="hangzhou">
                <div class="hangzhouImg lf">
                </div>
                <ul class="hangzhouD lf">
                    <li  class="hangzhouName">{{this.$store.state.headerCity}}</li>
                    <li class="hangzhouAssess">II 清新</li>
                    <li class="hangzhouNum">
                        <span class="bigNum">757</span>
                        /1140
                        <span class="darkNum">负氧离子(个/cm3)</span>
                    </li>
                </ul>
            </div>
            <div class="onData">
                <!--宽窄竖线-->
                <div class="doubleLine lf">
                    <div class="wide lf"></div>
                    <div class="narrow lf"></div>
                </div>
                <!--浙江省-->
                <div class="zjProvince lf">
                    <div class="provinceName lf">实时数据</div>
                </div>
                <div class="nowTime ">
                     2018-09-26 10:10:10
                </div>
            </div>
            <div class="threeLine">
                <div class="firstLine lf"></div>
                <div class="secondLine lf"></div>
                <div class="thirdLine lf"></div>
            </div>
            <div class="hbData">
                <div class="hbDataLi">
                    <span class="iconfont">&#xe8f2;</span>
                    <span>10150/16772</span>  
                </div>
                <div class="hbDataPM">
                    <div class="lf">
                        <div class="iconfont">&#xe60a;</div>
                        <div>PM2.5</div>
                    </div>
                    <div class="lf">
                        <div>20</div>
                        <div>(μg/m³)</div>
                    </div>
                    
                </div>
                <div class="hbDataO">
                   <div  class="lf">
                        <div class="iconfont">&#xe633;</div>
                        <div>O3</div>
                    </div>
                    <div  class="lf">
                        <div>63</div>
                        <div>(μg/m³)</div>
                    </div>
                </div>
            </div>
            <div class="weatherData">
                <div class="onDayWeather"  v-for="(item, index) of weatherList.data.forecast" :key="index" :class="{active: isIndex==index}">
                    <div class="onDayWeatherDate">
                        {{item.date}}
                    </div>
                    <div class="onDayWeatherImg">
                        <!-- <img src="/tianqi.png" alt="" style="height:3.4vh"> -->
                        <span class="iconfont" v-html="getWeatherPic(item.type)" style="height:3.4vh;color:yellow;font-size:.50rem"></span>
                    </div>
                    <div class="onDayWeatherDu">
                        {{parseInt(item.low.substring(2))}} ~ {{parseInt(item.high.substring(2))}} ℃
                    </div>
                    <div class="onDayWeatherRain">
                        {{item.type}}
                    </div>
                    <div class="onDayWeatherWind">
                        {{item.fx}}
                    </div>
                    <div class="onDayWeatherLevel">
                        <div class="haveBG">
                            优
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
let echarts = require('echarts');
export default {
    name: 'CityLeftContentOne',
    props: {
        weatherList: Object
    },
    methods: {
        weatherMouseOver: function(index){
            this.isIndex = index
            console.log(this.getCityName)
        },
        tiaozhuanF(){
            if(this.getCityName =="杭州"){
                this.tiaozhuan="西湖观测点"
            }
        },
        gaibianStation(stationName){
            this.$store.commit('changeStationName', stationName)
            $('#pupup-all-view').remove();
            this.$comjs.onCenter(120.155161,30.236581,80000.0)
            this.$comjs.addCSMarkerss();
        },
        getWeatherPic(type){
            switch(type)
                {
                    case "晴":
                    return "&#xe619;"
                    break;
                    case "多云":
                    return  "&#xe618;"
                    break;
                    default:
                }
        }
        
    },
    mounted(){
        this.tiaozhuanF()
    },
    data(){
        return{
            getCityName:this.$route.params.name,
            isIndex: 0,
            tiaozhuan: '',
            weatherPic: ''
        }
        
    }
   
}
</script>

<style lang="stylus" scoped>
    /* 样式穿透 */
    .leftContentOne >>> a
        color: white
        text-decoration :none
    /* 所有样式 */
    .leftContentOne
        width: 4.04rem
        height: 46.5vh
        color: white
        background :rgba(7,23,42,0.49)
        overflow: hidden
        .hangzhou
            width: 3.86rem 
            height: 8.24vh
            margin-left: .18rem
            margin-top: 2.59vh
            margin-bottom : 3.05vh
            .hangzhouImg
                width: 1.57rem
                height: 8.24vh
                border: 1px solid #FFF
                background : url('/jiang.jpg') no-repeat 
                background-size:cover
            .hangzhouD
                width: 2.19rem
                overflow: hidden
                margin-left: .1rem
                .hangzhouName
                    height: 2.13vh
                    font-size: .24rem
                .hangzhouAssess
                    margin-top: .83vh
                    margin-bottom: 1.1vh
                    width:.65rem
                    height: 2.22vh
                    line-height :2.22vh
                    font-size: 0.16rem
                    text-align :center
                    background :#0BD74E
                .hangzhouNum
                    width: 100%
                    font-size: .15rem
                    .bigNum
                        font-size: .2rem
                    .darkNum
                        font-size: .1rem
                        color: #ADADAD
                        margin-left: .1rem
        .onData
            height: 3.5vh
            .doubleLine
                width: .11rem
                height: 2.77vh
                .wide
                    width: .07rem
                    height: 2.77vh
                    background : #41E6FD
                .narrow
                    width: .02rem
                    height: 2.77vh
                    background : #41E6FD
                    margin-left: .02rem
            .zjProvince
                font-size: .18rem
                line-height: 2.77vh
                .provinceName
                    font-size: .18rem
                    font-family: FZZXHJW--GB1-0
                    margin-left: .12rem
            .nowTime
                float: right
                font-size: .16rem
                line-height: 2.77vh
                margin-right: .05rem
        .threeLine
            width: 100%
            height: .03px
            .firstLine
                width: 3.4rem
                height: .03rem
                background : #41E6FD
            .secondLine
                width: .08rem
                height: .03rem
                background: #333
                margin-left: .06rem
                margin-right: .04rem
            .thirdLine
                width: .44rem
                height: .03rem
                background: #FFFFFF
        .hbData
            display:flex
            justify-content: space-around
            margin: 0 auto
            margin-top:2.22vh
            height: 4.63vh
            font-size: .2rem
            .hbDataLi
                span:first-child
                    font-size:larger
                span:nth-child(2)
                    color:#58EBFF
                    font-size: small
            .hbDataPM
                text-align :center
                margin-left: 1vw
                margin-right: 1vw
                div:nth-child(1)
                    div
                        font-size: larger
                div:nth-child(2)
                    div:nth-child(1)
                        color:#58EBFF
                        font-size: small
                        line-height:2.5vh
                    div:nth-child(2)
                        color:#A9A9A9
                        margin-left:.05rem
                        font-size: .1rem
                div:nth-child(1)
                    div:nth-child(1)
                        height:2.5vh
                    div:nth-child(2)
                        color:#A9A9A9
                        font-size: small
            .hbDataO
                div:nth-child(1)
                    div
                        font-size: larger
                div:nth-child(2)
                    text-align :center
                    div:nth-child(1)
                        color:#58EBFF
                        font-size: small
                        line-height:2.5vh
                    div:nth-child(2)
                        color:#A9A9A9
                        margin-left:.05rem
                        font-size: .1rem
                div:nth-child(1)
                    div:nth-child(1)
                        height:2.5vh
                    div:nth-child(2)
                        color:#A9A9A9
                        font-size: .1rem
        .weatherData
            height:17.92vh
            margin-top: 3.9vh
            text-align :center
            // margin-left: .38rem
            display: flex
            justify-content : space-around
            .onDayWeather
                width: .54rem
                height: 16.4vh
                border-left: 1px solid #7D7D7D
                text-align :center
                flex:  1 
                .onDayWeatherDate
                    line-height: 2.4vh
                    font-size: .16rem 
                    text-align :center
                .onDayWeatherImg
                    height: 4.4vh
                    line-height: .4vh
                .onDayWeatherDu
                    line-height : 2.4vh
                    font-size: .1rem
                .onDayWeatherRain
                    font-size: .1rem
                    line-height : 2.4vh
                .onDayWeatherWind
                    line-height : 2.4vh
                    font-size: .1rem
                .onDayWeatherLevel
                    height:2.4vh
                    font-size: .12rem
                    overflow: hidden
                    .haveBG
                        width:.35rem
                        line-height: 1.7vh
                        margin: 0 auto
                        margin-top: 0.4vh
                        background : #22AC38
            .onDayWeather:first-child
                border:none  
                flex: 1.5     
            .onDayWeather.active
                text-align :center
                background:rgba(13,131,214,0.52)
                width:1.06rem
            .onDayWeather.active .onDayWeatherRain
                background : rgba(13,131,214,0.52)
            .onDayWeather.active .onDayWeatherLevel
                background : rgba(13,131,214,0.52)
        
        
                        
</style>


