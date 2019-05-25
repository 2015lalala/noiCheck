<template>
    <div class="leftContentTwo">
        <!--第二部分-->
        <div class="bestCity">
            <div class="bestCityTitle">
                <!--宽窄竖线-->
                <div class="doubleLine lf">
                    <div class="wide lf"></div>
                    <div class="narrow lf"></div>
                </div>
                <!--最优城市-->
                <div class="bestCityP lf">
                    <div class="bestCityName lf">最优城市</div>
                </div>
            </div>
            <div class="threeLine">
                <div class="firstLine lf"></div>
                <div class="secondLine lf"></div>
                <div class="thirdLine lf"></div>
            </div>
            <ul class="cityAssess">
                <li class="lf" v-for="(item, index) of cityList" :key="index" @click="activeAssess(index, item.x, item.y);">
                    <div class="timeAssess">{{item.timeAssess}}</div>
                    <div class="itemCity"  :class="{'active' : index ==isActive }">{{item.city}}</div>
                    <div class="assessNum" :class="{'active' : index ==isActive }"><span>{{item.assessNum}}</span>/{{item.assessNum1}}</div>
                </li>
            </ul>
            <div class="drakYLine"></div>
            <div class="cityImg">
                <div class="firstImg lf" @click="handleBannerClick">
                    <div class="zhezhao">图册</div>
                </div>
                <div class="secondImg lf" @click="handleBannerClick">
                    <div class="zhezhao">图册</div>
                </div>
            </div>
        </div>
        <common-swiper @swiper="handleSwiperClick" v-if="isSwiper"></common-swiper>
    </div>
</template>

<script>
    let echarts = require('echarts');
    import CommonSwiper from '../../commons/CommonSwiper'
    export default {
        name: 'LeftContentTwo',
        components: {
            CommonSwiper
        },
        data(){
            return{
                isActive: 0,
                isSwiper: false,
                cityList: [
                    
                        {timeAssess:'小时评价', city:'台州市', assessNum: '889',assessNum1: '1391',x:107.897559,y:35.497896},
                        {timeAssess:'日均评价', city:'衢州市', assessNum: '961',assessNum1: '1568',x:118.867747,y:28.976304},
                        {timeAssess:'月评价',   city:'宁波市', assessNum: '920',assessNum1: '1411',x:121.625122,y:29.867287},
                        {timeAssess:'季度评价', city:'舟山市', assessNum: '943',assessNum1: '1756',x:122.213557,y:29.991161}
                    ]
            }
            
        },
        methods: {
            //动态城市评价
            activeAssess: function(index,x,y){
                this.isActive = index
                this.$comjs.onCenter(x,y,50000)//定位到该城市。
            },
            handleBannerClick(){
                this.isSwiper = true
            },
            handleSwiperClick(a){
                this.isSwiper = false
                console.log(a);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    /* 样式穿透 .leftContentTwo >>> .littleLine */
    /* 所有样式 */
    .leftContentTwo
        width: 4.03rem
        height: 35.5vh
        color: white
        background :rgba(7,23,42,0.49)
        .bestCity
            .bestCityTitle
                width: 100%
                height: 5vh
                padding-top: 1.8vh
                .doubleLine
                    width: .11rem
                    height: 1.9vh
                    .wide
                        width: .07rem
                        height: 1.9vh
                        background : #41E6FD
                    .narrow
                        width: .02rem
                        height: 1.9vh
                        background : #41E6FD
                        margin-left: .02rem
                .bestCityName
                    font-size: .18rem
                    font-family: FZZXHJW--GB1-0
                    margin-left: .12rem
            .threeLine
                width: 100%
                height: .03rem
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
            .cityAssess
                width: 4.02rem
                height: 16.2vh
                margin-top: 1.2vh
                margin-bottom: 1.6vh
                cursor:pointer
                li
                    width: 0.99rem
                    height: 16.2vh
                    border-right: 2px solid #333
                    .timeAssess
                        Width :100%
                        height : 3.5vh
                        font-size: .18rem
                        line-height : 3.5vh
                        text-align :center
                    .itemCity
                        width: 100%
                        height: 6.3vh
                        line-height: 6.3vh
                        font-size: .24rem
                        text-align :center
                    .itemCity.active
                        background: #1E94E5
                    .assessNum.active
                        background: #1E94E5
                    .assessNum
                        width: 100%
                        height: 6.38vh
                        line-height: 6.38vh
                        font-size: .14rem
                        text-align :center
                        span 
                            font-size: .24rem
                li:last-child
                    border:none
            .drakYLine
                width: 100%
                height: .03rem
                background: #908A20
                margin-bottom: .09rem
            .cityImg
                width: 100%
                height: 10vh
                .firstImg
                    width: 1.96rem
                    height: 10vh
                    border: 2px solid #fff
                    margin-left: .06rem
                    margin-right: .09rem
                    background: url('/zhe.jpg') no-repeat 
                    background-size:cover
                    position: relative
                    cursor:pointer 
                    .zhezhao
                        width:100%
                        line-height:27px
                        text-align : center
                        position : absolute
                        left: 0
                        bottom: 0
                        font-size: 12px
                        background:rgba(28,28,28,.6)
                .secondImg
                    width: 1.78rem
                    height: 10vh
                    border: 2px solid #fff
                    background: url('/jiang.jpg') no-repeat 
                    background-size:cover  
                    position: relative   
                    cursor:pointer 
                    .zhezhao
                        width:100%
                        line-height: 27px
                        text-align : center
                        position: absolute   
                        left: 0
                        bottom: 0    
                        font-size: 12px 
                        background:rgba(28,28,28,.6)  
</style>


