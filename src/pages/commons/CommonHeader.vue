<template>
    <div class="commonHeader">
        <div class="leftContent">
            <div class="backBtn">
                <span class=" backBtnA"></span>
                <span class="iconfont cityIcon">&#xe68d;</span>
                <span class="pageName">{{this.$store.state.headerStation}}</span>
            </div>
            <div class="twoLevelTitle">
                <div class="twoLevelTitleName">城市评价</div>
            </div>
        </div>
        
        <div class="rightContent">
            <div class="searchD">
                <input type="text" placeholder="请输入...">
                <span class="lineY"></span>
                <!-- <span class='iconfont'>&#xe60b;</span> -->
            </div>
            
        </div>
    </div>
</template>
<script>
export default {
    name: 'CommonHeader',
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
                    display: inline-block
                    width: .28rem
                    height: 2.5vh
                    line-height : 2.5vh
                    text-align : center
                    background : #3A536E
                    background :url('/qian.png')
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
                    width: 1rem
                    background: #2FDEFC
                    margin-left: .55rem
                    text-align :center
                    color: #2E4C59
        
        .rightContent
            width: 6.38rem
            height: 6.48vh
            .searchD
                width: 2.22rem
                height: 2.77vh
                margin-left: 3.16rem
                border : 1px solid #59E1FE
                margin-top: .21rem
                margin-bottom: .19rem
                border-top-left-radius: .15rem
                border-bottom-left-radius: .15rem
                border-top-right-radius: .15rem
                border-bottom-right-radius: .15rem
                input
                    width: 1.79rem
                    background: transparent
                    border:none
                    outline : none
                    margin-top: .05rem
                    margin-left: .2rem
                    color:white
                lineY
                    display: inline-block
                    width:1px
                    height: 1.76vh
                    background : #fff
            
</style>


