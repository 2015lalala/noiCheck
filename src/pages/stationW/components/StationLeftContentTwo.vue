<template>
    <div class="stationLeftContentTwo">
        <div class="assessDetail">
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
            <div class="lifeNum">
                <div class="lifeNumOne lf">
                    <div class="iconfont">&#xe600;</div>
                    <ul >
                        <li>穿衣：衬衫类</li>
                        <li>19-25</li>
                    </ul>
                </div>
                <div class="lifeNumTwo lf">
                    <div class="iconfont lf">&#xe600;</div>
                    <ul >
                        <li>穿衣：衬衫类</li>
                        <li>19-25</li>
                    </ul>
                </div>
                <div class="lifeNumThree lf">
                    <div class="iconfont lf">&#xe600;</div>
                    <ul >
                        <li>穿衣：衬衫类</li>
                        <li>19-25</li>
                    </ul>
                </div>
                <div class="lifeNumFour lf">
                    <div class="iconfont lf">&#xe600;</div>
                    <ul>
                        <li>穿衣：衬衫类</li>
                        <li>19-25</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'StationLeftContentTwo'
}
</script>
<style lang="stylus" scoped>
    /* 样式穿透 */
    .lifeNum >>> .iconfont
        width: .26rem
        font-size: .26rem
        height: 2.4vh
    .lifeNum >>> ul>li:first-child
        font-size: .14rem
    .lifeNum >>> ul>li:nth-child(2)
        font-size: .1rem
        color: #ccc
    /* 所有样式 */
    .stationLeftContentTwo
        width: 4.03rem
        height: 21.3vh
        color: white
        .assessDetail
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
        .lifeNum
            height: 17.7vh
            padding: 1.39vh .2rem
            div
                display: flex
                justify-content :center
                ul
                    display: flex
                    flex-direction: column
                    justify-content : center
                    li
                        width:100%
                    li:first-child
                        display: flex
                        flex-direction: column
                        align-items: center
                        justify-content : space-around
                        margin-bottom: 5px
                    li:nth-child(2)
                        text-align : left
                        margin-top: 5px
                        
            .lifeNumOne
                width: 1.8rem
                height: 7.59vh
                border-right:1px solid #41E6FD
                border-bottom: 1px solid #41E6FD
                div
                    align-self: center
                    margin-right:10px
            .lifeNumTwo
                width: 1.8rem
                height: 7.59vh
                border-bottom: 1px solid #41E6FD
                div
                    height: 7.59vh
                    line-height :7.59vh
                    margin-right:10px
            .lifeNumThree
                width: 1.79rem
                height: 7.59vh
                div
                    height: 7.59vh
                    line-height :7.59vh
                    margin-right:10px
            .lifeNumFour
                width: 1.79rem
                height: 7.59vh
                border-left:1px solid #41E6FD
                div
                    height: 7.59vh
                    line-height :7.59vh
                    margin-right:10px
</style>


