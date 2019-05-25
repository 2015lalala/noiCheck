<template>
    <div class="stationCount">
        <div class="bgColor">
            <div class="fylzCount lf">757</div>
            <div class="fcSta lf">
                <div class="baseStation">
                    功能站: {{baseStation}}
                </div>
                <div class="functionStation">
                    基本站: {{functionStation}}
                </div>
                <div class="stationAssess">
                    <dl class="stationD lf" v-for="(item , index ) of stationList" :key="index">
                        <dt >{{item.count}}</dt>
                        <dd :style="{background:item.background}"></dd>
                    </dl>
                </div>
            </div>
        </div>
        <div class="bgImg">
            
        </div>
    </div>
</template>
<script>
    export default {
        name: 'CityStationCount',
        data(){
            return{
                baseStation: 5,
                functionStation: 10,
                stationList:[{count: 4,background:'#27CB8F'},
                            {count: 5,background:'#0BD74E'},
                            {count: 2,background:'#0D83D6'},
                            {count: 6,background:'#FF680D'},
                            {count: 11,background:'#707070'}]
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .stationCount
        width: 370px
        height: 161px
        position: absolute
        left:38%
        top:71px
        font-size:20px
        overflow: hidden
        color: white
        .bgColor
            width:100%
            height:143px
            position: absolute
            z-index:100
            margin-top:18px
            background:rgba(0,0,0,0.55);
            .fylzCount
                width:54%
                line-height: 123px
                text-align : center
                color: #00FF00
                font-size: 30px
            .fcSta
                .baseStation
                    font-size: 16px
                    margin-top: 26px
                    margin-bottom: 16px
                .functionStation
                    font-size: 16px
                .stationAssess
                    margin-top: 10px
                    .stationD
                        margin-right: 5px
                        dt
                            width: 26px
                            line-height: 26px
                            text-align: center
                        dd
                            width: 26px
                            height: 7px

        .bgImg
            width:100%
            height:100%
            background:url('/station.png')
            position: absolute
            z-index:101
            
        
</style>


