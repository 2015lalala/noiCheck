<template>
    <div class="cityCenterContent">
        <div class="tabCharts lf">
            <div class="tabTitle">
                <div class="tabTitleName">
                    <div class="kuanLine lf"></div>
                    <div class="zhaiLine lf"></div>
                    <div class="historyData lf">历史数据</div>
                </div>
                <div class="tabTitleTabs lf">
                    <ul class="allNum lf">
                        <li class="lf" v-for="(item, index) of contentList" :key="index">
                            {{item.name}}
                        </li>
                    </ul>
                    <ul class="twoTime lf">
                        <li class="lf">24小时</li>
                        <li class="lf">7日</li>
                    </ul>
                </div>
            </div>
            <div class="threeLine">
                <div class="firstLine lf"></div>
                <div class="secondLine lf"></div>
                <div class="thirdLine lf"></div>
            </div>
            <div id="quxianCharts">
                
            </div>
        </div>
        <div class="numLook lf">
            <div class="numLookTitle">
                <div class="numLookKuanLine lf"></div>
                <div class="numLookZhaiLine lf"></div>
                <div class="numLookWord lf">按污染物影响的空气质量指数查看</div>
            </div>
            <div class="numThreeLine">
                <div class="numFirstLine lf"></div>
                <div class="numSecondLine lf"></div>
                <div class="numThirdLine lf"></div>
            </div>
            <div id="zhishuCharts"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CityCenterContent',
    data(){
        return{
            contentList: [{name: '清新指数'},{name: '负氧离子'},{name:'PM2.5'},{name: 'O3'}]
        }
    }

}
</script>
<style lang="stylus" scoped>
    .cityCenterContent
        width: 14.73rem
        height: 19.07vh
        border: 1px solid red
        position: absolute
        bottom: .61rem
        left: 4.03rem
        color:white
        .tabCharts
            width: 10.41rem
            .tabTitle
                height: 3.5vh
                font-size: .16rem
                .tabTitleName
                    margin-left : .02rem
                    padding-top : 0.74vh
                    .kuanLine   
                        width: 0.07rem
                        height: 1.95vh
                        background : #41E6FD
                    .zhaiLine
                        width: 0.02rem
                        height: 1.94vh
                        margin-left : .02rem
                        margin-right: .09rem
                        background : #41E6FD
                .tabTitleTabs
                    color:#fff
                    float:right
                    .allNum
                        li
                            width: .82rem
                            height: 2.22vh
                            line-height : 2.22vh
                            text-align : center
                            border: 1px solid #2FDEFC
                            font-size: .16rem
                        li:nth-child(2)
                            border-left: none 
                            border-right: none
                        li:nth-child(3)
                            border-right: none
                    .twoTime
                        margin-left: .55rem
                        li
                            width: .82rem
                            height: 2.22vh
                            line-height : 2.22vh
                            text-align : center
                            border: 1px solid #2FDEFC
                            font-size: .16rem
                        li:nth-child(2)
                            border-left: none
            .threeLine
                width: 10.41rem
                height: .03px
                .firstLine
                    width: 9.83rem
                    height: .03rem
                    background : #41E6FD
                .secondLine
                    width: .08rem
                    height: .03rem
                    background: #333
                    margin-right: .04rem
                .thirdLine
                    width: .44rem
                    height: .03rem
                    background: #FFFFFF
        .numLook
            width:4.06rem
            margin-left:.14rem
            margin-left:.13rem
            .numLookTitle
                height: 3.5vh
                font-size: .16rem
                margin-left : .02rem
                padding-top : 0.74vh
                .numLookKuanLine   
                    width: 0.07rem
                    height: 1.95vh
                    background : #41E6FD
                .numLookZhaiLine
                    width: 0.02rem
                    height: 1.94vh
                    margin-left : .02rem
                    margin-right: .09rem
                    background : #41E6FD
            .numThreeLine
                width: 4.06rem
                height: .03px
                .numFirstLine
                    width: 3.51rem
                    height: .03rem
                    background : #41E6FD
                .numSecondLine
                    width: .07rem
                    height: .03rem
                    background: #333
                    margin-right: .04rem
                .numThirdLine
                    width: .43rem
                    height: .03rem
                    background: #FFFFFF
</style>


