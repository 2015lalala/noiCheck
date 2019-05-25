<template>
    <div class="commonHeader">
        <div class="leftContent">
            <div class="backBtn">
                <span class="iconfont backBtnA">&#xe602;</span>
                <span class="iconfont cityIcon">&#xe68d;</span>
                <span class="pageName">浙江省</span>
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
                    <div @click="changeToCheck">{{title1}}</div>
                </div>
            </div>
        </div>
        <header-center :proNameTitle="proNameTitle"></header-center>
        <header-search></header-search>
        
    </div>
</template>
<script>
import HeaderCenter from '../../commons/components/HeaderCenter'
import HeaderSearch from '../../commons/components/HeaderSearch'
export default {
    name: 'ProvincHeader',
    components: {
        HeaderCenter,
        HeaderSearch
    },
    data(){
        return{
            isResult: true,
            title: '气候指数',
            title1: '负氧离子',
            proNameTitle: '浙江省气候指数服务平台'
        }
    },
    mounted() {
        //钩子涉及到dom，设置css时需要渲染后才能生效，一般不用beforeMounte
    },
    
    methods: {
        changeToCheck(){
            this.$router.push('/')
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
                    //background : url('/qian.png') no-repeat
                    background-size: contain

                    
                .cityIcon
                    margin-left:.22rem   
                .pageName
                    margin-left:.08rem 
                    font-family: FZZXHJW--GB1-0  
                    font-size: .20rem
            .twoLevelTitle
                height: 2.4vh
                line-height : 2.3vh
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
                .zhishu
                    display:flex
                    justify-content : center
                    width:1.26rem
                    cursor: pointer
                    background: #3F484D
                    margin-left: 23px
</style>


