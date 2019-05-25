<template>
    <div class="stationLeftContentThree">
        <div class="bestCityTitle">
            <!--宽窄竖线-->
            <div class="doubleLine lf">
                <div class="wide lf"></div>
                <div class="narrow lf"></div>
            </div>
            <!--最优城市1-->
            <div class="bestCityP lf">
                <div class="bestCityName lf">生活气象指数</div>
            </div>
        </div>
        <div class="threeLine">
            <div class="firstLine lf"></div>
            <div class="secondLine lf"></div>
            <div class="thirdLine lf"></div>
        </div>
        <div class="onData">
            <!--宽窄竖线-->
            <div class="doubleLine lf">
                <div class="wide lf"></div>
            </div>
            <!--浙江省-->
            <div class="zjProvince lf">
                <div class="provinceName lf">实时数据</div>
            </div>
            <div class="nowTime ">
                    2018-09-26 10:10:10
            </div>
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
        <div class="onData" style="margin-top:0">
            <!--宽窄竖线-->
            <div class="doubleLine lf">
                <div class="wide lf"></div>
            </div>
            <!--浙江省-->
            <div class="zjProvince lf">
                <div class="provinceName lf">日均值</div>
            </div>
            <div class="nowTime ">
                    2018-09-26
            </div>
        </div>
        <div class="hbData" >
            <div class="hbDataLi lf">
                <span class="iconfont">&#xe8f2;</span>
                <span>10150/16772</span>  
            </div>
            <div class="hbDataPM lf">
                <div class="lf">
                    <div class="iconfont">&#xe60a;</div>
                    <div>PM2.5</div>
                </div>
                <div class="lf">
                    <div>20</div>
                    <div>(μg/m³)</div>
                </div>
                
            </div>
            <div class="hbDataO lf">
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
    </div>
</template>
<script>
export default {
    name: 'StationLeftContentThree'
}
</script>
<style lang="stylus" scoped>
    /* 样式穿透 .leftContentTwo >>> .littleLine */
    /* 所有样式 */
    .stationLeftContentThree
        width: 4.03rem
        height: 24.7vh
        color: white
        .bestCityTitle
            width: 100%
            height: 3.9vh
            padding-top: 1vh
            .doubleLine
                width: .11rem
                height: 1.94vh
                .wide
                    width: .07rem
                    height: 1.94vh
                    background : #41E6FD
                .narrow
                    width: .02rem
                    height: 1.94vh
                    background : #41E6FD
                    margin-left: .02rem
            .bestCityName
                font-size: .18rem
                font-family: FZZXHJW--GB1-0
                margin-left: .12rem
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
        .onData
            margin-top:2.22vh
            height: 3.5vh
            .doubleLine
                width: .11rem
                height: 2.77vh
                .wide
                    width: .02rem
                    height: 2.77vh
                    background : #41E6FD
                    margin-left: .09rem
                    margin-right: .06rem
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
        .hbData
            margin-top:vh
            height: 6.85vh
            font-size: .2rem
            display: flex
            justify-content : space-around
            .hbDataLi
                span:nth-child(2)
                    color:#58EBFF
            .hbDataPM
                text-align :center
                // margin-left: .3rem
                // margin-right: .3rem
                div:nth-child(2)
                    div:nth-child(1)
                        color:#58EBFF
                    div:nth-child(2)
                        color:#A9A9A9
                        margin-left:.05rem
                        font-size: .1rem
                div:nth-child(1)
                    div:nth-child(1)
                        height:2.04vh
                    div:nth-child(2)
                        
                        color:#A9A9A9
                        font-size: .1rem
            .hbDataO
                div:nth-child(2)
                    text-align :center
                    div:nth-child(1)
                        color:#58EBFF
                    div:nth-child(2)
                        color:#A9A9A9
                        margin-left:.05rem
                        font-size: .1rem
                div:nth-child(1)
                    div:nth-child(1)
                        height:2.04vh
                    div:nth-child(2)
                        color:#A9A9A9
                        font-size: .1rem
</style>


