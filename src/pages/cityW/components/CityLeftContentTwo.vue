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
                    <div class="bestCityName lf">景区推荐</div>
                </div>
            </div>
            <div class="threeLine">
                <div class="firstLine lf"></div>
                <div class="secondLine lf"></div>
                <div class="thirdLine lf"></div>
            </div>
            <!--景区推荐-->
            <div class="cityImg">
                <div class="firstImg lf"></div>
                <div class="secondImg lf"></div>
            </div>
        </div>
    </div>
</template>

<script>
    let echarts = require('echarts');
    export default {
        name: 'CityLeftContentTwo',
        data(){
            return{
                isActive: 0
            }
            
        },
        methods: {
            //动态城市评价
        activeAssess: function(index){
            this.isActive = index
        }
        }
    }
</script>

<style lang="stylus" scoped>
    /* 样式穿透 .leftContentTwo >>> .littleLine */
    /* 所有样式 */
    .leftContentTwo
        width: 4.03rem
        height: 19.7vh
        color: white
        background :rgba(7,23,42,0.49)
        .bestCity
            .bestCityTitle
                width: 100%
                height: 3vh
                .doubleLine
                    width: .11rem
                    height: 1.94vh
                    margin-left: .13rem
                    .wide
                        width: .07rem
                        height: 1.94vh
                        background : #41E6FD
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
            .cityImg
                width: 100%
                height: 14.5vh
                margin-top: 0.66vh
                .firstImg
                    width: 1.96rem
                    height: 14.5vh
                    border: 2px solid #fff
                    margin-left: .06rem
                    margin-right: .09rem
                    background: url('/zhe.jpg') no-repeat 
                    background-size:cover
                .secondImg
                    width: 1.78rem
                    height: 14.5vh
                    border: 2px solid #fff
                    background: url('/jiang.jpg') no-repeat 
                    background-size:cover
                
                   

                  
</style>


