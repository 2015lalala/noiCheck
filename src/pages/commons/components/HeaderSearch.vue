<template>
    <div class="rightContent">
        <div class="searchD">
            <input type="text" style="color:white" placeholder="请输入城市或站点">
        </div>
        <div class="search-content" v-show="isResult">
            <ul v-show="isResult">
                <li class="search-item"

                >
                    <span class="iconfont">&#xe60b;</span>
                </li>
            </ul>
            <div class="noSearch" v-show="!isResult">
                没有搜索到你想要的结果 
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'HeaderSearch',
    data(){
        return{
            isResult: false
        }
    }
}
</script>
<style lang="stylus" scoped>
    .rightContent
            width: 6.38rem
            height: 6.48vh
            position: relative
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
                    width: 1.6rem
                    display:inline-block
                    height:80%
                    margin-top:-5px
                    background: transparent
                    border: none
                    outline : none
                    margin-top: .05rem
                    margin-left: .2rem
                    color:white
                    font-size: .16rem
                .lineY
                    display: inline-block
                    width:1px
                    height: 1.76vh
                    background :#7D7D7D
                    margin-top:5px
                    vertical-align: top
                .iconfont
                    color:#00CCFF
                    margin-left:11px
            .search-content
                width:260px
                height: 320px
                background: #1C2630
                border: 1px solid #59E1FE
                position: absolute
                top: .6rem
                right: .8rem
</style>


