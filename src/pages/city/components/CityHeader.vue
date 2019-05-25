<template>
    <div class="commonHeader">
        <div class="leftContent">
            <div class="backBtn">
                <router-link to="/">
                    <span class="iconfont backBtnA" @click="backToHome">&#xe602;</span>
                </router-link>
                <span class="iconfont cityIcon">&#xe68d;</span>
                <span class="pageName">{{this.$store.state.headerCity}}</span>
            </div>
            <div class="twoLevelTitle">
                <div class="twoLevelTitleName lf">
                    <ul class="lf">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <span class="iconfont cityIcon lf">&#xe68d;</span>
                    <span class="lf" style="margin-left:10px">城市评价</span>
                </div>
                <div class="zhishu lf">
                    <div>
                        <span class="iconfont">&#xe601;</span>
                    </div>
                    <div @click="changeToCheck">气候指数</div>
                </div>
            </div>
        </div>
        <header-center :proNameTitle = "proNameTitle"></header-center>
        <header-search></header-search>
    </div>
</template>
<script>
import HeaderCenter from '../../commons/components/HeaderCenter'
import HeaderSearch from '../../commons/components/HeaderSearch'
export default {
    name: 'CommonHeader',
    components: {
        HeaderCenter,
        HeaderSearch
    },
    data(){
        return{
            proNameTitle: '浙江省负氧离子服务平台'
        }
    },
    methods: {
        backToHome(){
            this.$comjs.onCenter(120.42918,29.498628,800000.0)
        },
        changeToCheck(){
            this.$router.push('/cityW/' + this.$store.state.headerCity)
        }
    }
    
}
</script>
<style lang="stylus" scoped>
    .commonHeader
        width :100%
        height : 6.57vh
        font-size : .20rem
        position : absolute
        top : 0
        left : 0
        z-index:2
        display: flex
        background :rgba(7,23,42,0.49)
        border-bottom : 1px solid #2FDEFC
        color : white
        .leftContent
            width: 6.38rem
            height: 6.48vh
            .backBtn
                height: 4.07vh
                border-bottom: 1px solid #59E1FE
                padding-left: .09rem
                padding-top : 0.74vh
                padding-bottom: 0.74vh
                .backBtnA
                    color: white
                    display: inline-block
                    width: .28rem
                    height: 2.5vh
                    line-height : 2.5vh
                    text-align : center
                    background : #3A536E
                    //background: url('/qian.png') no-repeat
                    background-size: contain
                    cursor: pointer
                .cityIcon
                    margin-left:.22rem   
                .pageName
                    margin-left:.08rem 
                    font-family: FZZXHJW--GB1-0  
                    font-size: .20rem
            .twoLevelTitle
                height: 2.4vh
                line-height : 2.4vh
                font-size: .14rem
                .twoLevelTitleName
                    width: 1.24rem
                    height: 24px
                    margin-left: .55rem
                    text-align :center
                    color: #2E4C59
                    background: url('/pingjia.png')
                    background-size: contain
                    background-repeat: no-repeat
                    ul
                        margin-left:1px
                        width:10px
                        height: 100%
                        margin-right:10px 
                        li
                            width:100%
                            height:2px
                            background: #000
                            margin-top:1.5px
                        li:nth-child(3)
                            margin-top:2px
                        li:nth-child(5)
                             margin-top:2px
                .zhishu
                    display:flex
                    justify-content : center
                    width:1.26rem
                    height: 90%
                    cursor: pointer
                    background: #3F484D
                    margin-left: 23px
        
</style>


