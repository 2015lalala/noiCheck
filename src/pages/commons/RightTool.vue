<template>
    <div class="rightTool">
        <div class="toolBar">
            <!--上方工具条-->
            <div class="toolBtn">
                <dl :class="{active : isIndex == index}" 
                    @click="handleBtnActive(index)"
                    v-for="(item, index) of toolList" :key="index"
                >
                    <dt><span class="iconfont" v-html="item.iconCode"></span></dt>
                    <dd>{{item.name}}</dd>
                </dl>
            </div>
            <!--下方工具条-->
            <div class="defaultTool">
                <div class="iconfont" @click="zoomIn">&#xe614;</div>
                <div class="iconfont" @click="zoomOut">&#xe664;</div>
                <div class="iconfont" @click="onCenter(120.42918,29.498628,800000.0)">&#xe65b;</div>
                <div class="iconfont" @click="threeTwo">&#xe606;</div>
                <div class="iconfont" >&#xe75a;</div>
                <div class="iconfont" >&#xe82e;</div>
            </div>
        </div>
       <right-charts v-show="chartsShow"></right-charts>
    </div>
</template>
<script>
    import RightCharts from './RightCharts'
    export default {
        name: '',
        components:{
            RightCharts
        },
        data(){
            return{
                sanwei: true,
                isIndex: 0,
                chartsShow: false,
                toolList: [{name:'待定', iconCode: '&#xe62c;'},
                        // {name:'分析', iconCode: '&#xe608;'},
                        // {name:'白板', iconCode: '&#xe609;'},
                        {name:'气象', iconCode: '&#xe6fe;'}]
            }
        },
        mounted(){
            
        },
        methods: {
            // 二三维切换
            qiehuan: function(){
                if(this.sanwei){
                    this.threeTwo()
                    this.sanwei = false 
                }else if(!this.sanwei){
                    this.twoThree()
                }
            },
            handleBtnActive: function(index){
                //this.isActive = !this.isActive
                this.isIndex = index
                if(this.isIndex  == 1){
                    this.chartsShow = !this.chartsShow;
                }
                else{
                    this.chartsShow = false;
                }
            },
            //地图缩放
            zoomIn: function(){
                this.$comjs.zoomIn();
                
            },
            zoomOut: function(){
                this.$comjs.zoomOut();
            },
            //定位，视角
            onCenter: function(){
                this.$comjs.onCenter(120.42918,29.498628,800000.0);
            },
            //量测
            drawPolyline: function(){
                this.$comjs.drawPolyline();
            },
            measureArea: function(){
                this.$comjs.measureArea();
            },
            //清除
            clearMeasure: function(){
                this.$comjs.clearMeasure();
            },
            //增加marker
            addMarkers: function(){
                this.$comjs.addMarkers();
            },
            addPloy: function(){
                this.$comjs.addPloy();
            },
            //测试23D切换
            threeTwo: function(){
                this.$comjs.threeTwo();
            },
            twoThree: function(){
                this.$comjs.twoThree();
            },
            rotate: function(){
                this.$comjs.rotate();
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .rightTool
        width:.46rem
        height:calc(100% - 1.33rem)
        position: absolute
        top:.71rem
        right:0
        background: rgba(7,23,42,0.49)
        font-size: .12rem
        cursor:pointer
        .toolBar
            .toolBtn
                width:100%
                font-size:.12rem
                dl.active
                    color: #4A4A4A
                    background: #16D0FF
                dl
                    width:100%
                    height : .6rem
                    background : #3A536E
                    padding-top: .1rem
                    margin-bottom : .01rem 
                    color: #fff
                    dt
                        width: 0.24rem
                        height: 0.24rem
                        line-height :0.24rem
                        font-size: .24rem
                        margin: 0 auto
                        margin-bottom: .07rem 
                        text-align : center
                    dd
                        width: 100%
                        text-align : center
                        margin-bottom:.07rem
        .defaultTool
            position: absolute
            bottom: 0
            color: #fff
            div
                width: .45rem
                height: .45rem
                line-height : .45rem
                text-align : center
                background : #3A536E
                margin-bottom : .01rem
</style>



