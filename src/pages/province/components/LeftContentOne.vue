<template>
    <div class="leftContentOne">
        <!--第一部分-->
        <div class="province">
            <div class="provinceTitle">
                <!--宽窄竖线-->
                <div class="doubleLine lf">
                    <div class="wide lf"></div>
                    <div class="narrow lf"></div>
                </div>
                <!--浙江省-->
                <div class="zjProvince lf">
                    <div class="provinceName lf" @click="handleCityClick()">浙江省</div>
                    <div class="selectBtn lf" @click="handleCityClick()"></div>
                    <div class="shis" v-if="isShis">
                        <div class="provinceSelect">
                            <span>浙江省</span>
                        </div>
                        <div class="cityies">
                            <router-link 
                                v-for="(item, index) of shisList" 
                                :key="index"
                                :to="'/city/' + item.name">
                                <div style="color:white" 
                                    :class="{'cityActive': isCityActive == index }" 
                                    @click="toThisCity(item.name)"  
                                    @mousemove="handleCityActive(index)">{{item.name}}</div>
                            </router-link>
                            
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="threeLine">
                <div class="firstLine lf"></div>
                <div class="secondLine lf"></div>
                <div class="thirdLine lf"></div>
            </div>
            <div class="twoCharts">
                <!--第一个图标-->
                <div class="firstChart lf">
                    <div class="chartTitle1">
                        <div class="littleLine lf"></div>
                        <div class="chartTitle lf">站点类型统计</div>
                    </div>
                    <div id="chart1"></div>
                </div>
                <!--第二个图表-->
                <div class="secondChart lf">
                    <div class="chartTitle2">
                        <div class="littleLine lf"></div>
                        <div class="chartTitle lf">站点评价统计</div>
                    </div>
                    <div id="chart2"></div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
let echarts = require('echarts');
export default {
    name: 'LeftContentOne',
    data(){
        return{
            isShis:false,
            isCityActive: 0,
            city: '杭州',
            shisList:[{name:'杭州'},{name:'宁波'},{name:'温州'},{name:'湖州'},{name:'嘉兴'},{name:'绍兴'},{name:'金华'},{name:'衢州'},{name:'舟山'},{name:'台州'},{name:'丽水'}]
        }
    },
    mounted(){
        this.drawCharts()
       
    },
    methods: {
        handleCityClick(city){
            this.isShis = !this.isShis
        },
        handleCityActive(index){
            this.isCityActive = index
        },
        toThisCity(cityName){
            this.$comjs.onCenter(120.155161,30.236581,800000.0)//定位到该城市。
            this.$store.commit('changeCityName', cityName)
            this.isShis = false
        },
        drawCharts(){
            let myChart1 = echarts.init(document.getElementById('chart1'));
            let myChart2 = echarts.init(document.getElementById('chart2'));
            
                let option1 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                    position: [20, 20]
                },
                color:['#37A2DA', '#9FE6B8'],
                legend: {
                    itemHeight: 10,
                    itemWidth: 14,
                    orient: 'vertical',
                    x : '',
                    y : 'top',
                    data:[{name:'基本站',icon: 'rect'},{name:'功能站',icon:'rect'}],
                    textStyle:{
                        color:'#fff',
                        fontSize: 12
                    }
                },
                calculable : true,
                series : [
                    {
                        name:'站点类型统计',
                        type:'pie',
                        radius : [10,'77%'] ,
                        hoverAnimation: false,
                        center : ['68%', '44%'],//圆心距离容器边缘的距离
                        roseType : 'radius',
                        label: {
                            normal: {
                                show: false,
                                position: 'inside'
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:[
                            {value:5, name:'功能站'},
                            {value:10, name:'基本站'}
                        
                        ]
                    }
                ]
            }
            

           
                
                let option2 = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color:['#27CB8F', '#0BD74E', '#0D83D6', '#FF680D', '#A1A1A1'],
                legend: {
                    orient: 'vertical',
                    itemWidth: 12,//图例大小
                    itemHeight: 8,
                    itemGap: 2,//图例之间的间距
                    left: -5,//图例距离容器距离
                    x : '',
                    y : 'top',
                    textStyle:{
                        color:'#fff',
                        fontSize: 12
                    },
                    data: [ { name:'很清新',icon: 'rect'},
                            {name:'清新',   icon: 'rect'},
                            {name:'一般',   icon: 'rect'},
                            {name:'不清新',   icon: 'rect'},
                            {name:'未评价',   icon: 'rect'}
                        ]
                },
                calculable : true,
                series : [
                    {
                        name: '站点评价统计',
                        type: 'pie',
                        radius : [0,'79%'],
                        center: ['68%', '44%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'inside'
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:[
                            {value:335, name:'很清新'},
                            {value:310, name:'清新'},
                            {value:234, name:'一般'},
                            {value:135, name:'不清新'},
                            {value:1548, name:'未评价'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
            myChart1.setOption(option1);
            if(document.documentElement.clientHeight <= 768){
                    option2.legend.itemWidth = 10;
                    option2.legend.itemHeight = 6;
                    option2.legend.itemGap=0;
            }else{
                    option2.legend.itemWidth = 12;
                    option2.legend.itemHeight = 8;
                    option2.legend.itemGap=2;
            }
            myChart2.setOption(option2)
            window.addEventListener("resize", function () {
                if(document.documentElement.clientHeight <= 768){
                        option2.legend.itemWidth = 5;
                        option2.legend.itemHeight = 3;
                        option2.legend.itemGap=0;
                }else{
                    option2.legend.itemWidth = 12;
                    option2.legend.itemHeight = 8;
                    option2.legend.itemGap=2;
                }
                myChart2.setOption(option2);
                myChart1.resize();
                myChart2.resize();
            });   
            
        }
    }
}
</script>

<style lang="stylus" scoped>
    /* 样式穿透 */
    .leftContentOne >>> .littleLine
        width: .02rem
        height: .16rem
        background : #41E6FD
        margin-left: .11rem
        margin-right: .05rem
    .leftContentOne >>> .secondChart
        .littleLine
            margin-left: .06rem
    .leftContentOne >>> .chartTitle
            height: .16rem
            line-height : .16rem
    /* 所有样式 */
    .leftContentOne
        width: 4.03rem
        height: 20vh
        color: white
        background :rgba(7,23,42,0.49)
        .province
            height: 20vh
            .provinceTitle
                width: 100%
                height: 5vh
                padding-top: 1.8vh
                .doubleLine
                    width: .11rem
                    height: 1.9vh
                    .wide
                        width: .07rem
                        height: 1.9vh
                        background : #41E6FD
                    .narrow
                        width: .02rem
                        height: 1.9vh
                        background : #41E6FD
                        margin-left: .02rem
                .zjProvince
                    font-size: .18rem
                    font-family: FZZXHJW--GB1-0
                    margin-left: .12rem
                    position: relative
                    .provinceName
                        color: white
                        cursor :pointer
                        padding-right:.1rem
                    .selectBtn
                        width: 0
                        height: 0
                        border: 8px solid transparent;
                        border-top:  8px solid #41E6FD
                        margin-top: .05rem
                        cursor :pointer
                    .shis
                        width:3.2rem
                        height:18.9vh
                        position:absolute
                        left:0px
                        top:30px
                        background: black
                        z-index:100
                        background :#1C2630
                        padding:20px
                        cursor :pointer
                        .provinceSelect
                            width:100%
                            height:31px
                            padding-bottom:30px
                            border-bottom: 1px solid #59E1FE
                            span
                                background:#59E1FE
                                padding:0px 10px
                                font-size:.18rem
                                color:black
                        .cityies
                            padding:7px
                            div
                                float:left
                                width:.60rem
                                height:.4rem

            .threeLine
                width: 100%
                height: .03rem
                .firstLine
                    width: 3.4rem
                    height: .03rem
                    background : #41E6FD
                .secondLine
                    width: .08rem
                    height: .03rem
                    background: rgba(255,255,255,.54)
                    margin-left: .06rem
                    margin-right: .04rem
                .thirdLine
                    width: .44rem
                    height: .03rem
                    background: #FFFFFF
            .twoCharts
                height:15vh
                .firstChart
                    width: 1.94rem
                    height: 15vh
                    padding-top: 2.3vh
                    .chartTitle1
                        width: 2.01rem
                        height: 3.5vh
                        font-size: .14rem
                    #chart1
                        width: 10.64875vw
                        height: 11.48vh
                .secondChart
                    width: 1.76rem
                    height: 15vh
                    padding-top: .25rem
                    margin-left: .20rem
                    .chartTitle2
                        width: 1.81rem
                        height: 3.5vh
                        font-size: .14rem
                    #chart2
                        width: 9.427vw
                        height: 11.48vh
                        
</style>


