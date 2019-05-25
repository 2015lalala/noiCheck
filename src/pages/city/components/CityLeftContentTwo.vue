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
    //let echarts = require('echarts');
    import CommonSwiper from '../../commons/CommonSwiper'
    export default {
        name: 'CityLeftContentTwo',
        components: {
            CommonSwiper
        },
        data(){
            return{
                isActive: 0,
                isSwiper: false,
            }
            
        },
        methods: {
            //动态城市评价
            activeAssess: function(index){
                this.isActive = index
            },
            handleBannerClick(){
                this.isSwiper = true;
                //console.log("dianjile");
                
            },
            handleSwiperClick(){
                this.isSwiper = false;
                //console.log(a);
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
        overflow :invert
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
                height: 10vh
                padding-top: 15px;
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


