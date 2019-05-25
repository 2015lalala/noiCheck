<template>
    <div class="leftContentThree">
        <!--第二部分-->
        <div class="assessDetail">
            <div class="bestCityTitle">
                <!--宽窄竖线-->
                <div class="doubleLine lf">
                    <div class="wide lf"></div>
                    <div class="narrow lf"></div>
                </div>
                <!--最优城市-->
                <div class="bestCityP lf">
                    <div class="bestCityName lf">最优城市</div>
                </div>
            </div>
            <div class="threeLine">
                <div class="firstLine lf"></div>
                <div class="secondLine lf"></div>
                <div class="thirdLine lf"></div>
            </div>
            <div class="bestCharts">
                <div id="bestCharts"></div>
            </div>
        </div>
    </div>
</template>

<script>
    let echarts = require('echarts');
    export default {
        name: 'LeftContentThree',
        data(){
            return{
               
            }
            
        },
        mounted(){
         this.drawCharts()
    },
    methods: {
        drawCharts(){
            let bestCharts = echarts.init(document.getElementById('bestCharts'));
            let option1 = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                color:['#27CB8F', '#0BD74E', '#0D83D6', '#FF680D', '#A1A1A1'],
                legend: {
                    data: ['很清新', '清新','一般','不清新','未评价'],
                    textStyle :{
                        color: '#fff'
                    },
                    itemWidth: 24,
                    itemHeight: 16,
                    itemGap: 6,
                },
                    grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis:  {
                    type: 'category',
                    data: ["杭州","宁波","温州","湖州","嘉兴","绍兴","金华","衢州","舟山","台州","丽水"],
                    axisLine: { //坐标轴轴线相关设置。数学上的x轴
                        show: true,
                        lineStyle: {
                            color: '#fff',                               
                        },
                    },
                    axisLabel: { //坐标轴刻度标签的相关设置
                        textStyle: {
                            fontSize : 12,
                            color: '#fff',
                            //margin:81,                               
                        },
                        interval:0,
                        rotate:0 //字体旋转
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#fff',
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { //坐标轴刻度标签的相关设置
                        textStyle: {
                            color: '#fff',
                            //margin:15,                               
                        },
                    },
                    axisLine: { //坐标轴轴线相关设置。数学上的x轴
                        show: true,
                        lineStyle: {
                            color: '#fff',                               
                        },
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#fff',
                        }
                    },
                },
                series: [
                    {
                        name: '很清新',
                        type: 'bar',
                        stack: '总量',                          
                        data: [20, 32, 31, 34, 30, 33, 20, 34, 30, 33, 20]
                    },
                    {
                        name: '清新',
                        type: 'bar',
                        stack: '总量',                          
                        data: [20, 32, 31, 34, 30, 33, 20, 34, 30, 33, 20]
                    },
                    {
                        name: '一般',
                        type: 'bar',
                        stack: '总量',                           
                        data: [20, 32, 31, 34, 30, 33, 20, 34, 30, 33, 20]
                    },
                    {
                        name: '不清新',
                        type: 'bar',
                        stack: '总量',                            
                        data: [20, 32, 31, 34, 30, 33, 20, 34, 30, 33, 20]
                    },
                    {
                        name: '未评价',
                        type: 'bar',
                        stack: '总量',                          
                        data: [20, 32, 31, 34, 30, 33, 20, 34, 30, 33, 20]
                    }
                ]
            };
            if(document.documentElement.clientWidth <= 1594){
                option1.legend.itemWidth = 12;
                option1.legend.itemHeight = 8;
                option1.legend.itemGap=2;

                option1.xAxis.axisLabel.textStyle.fontSize = 9;
                option1.xAxis.axisLabel.rotate = -40;
                
            }else{
                option1.legend.itemWidth = 24;
                option1.legend.itemHeight = 16;
                option1.legend.itemGap=6;

                option1.xAxis.axisLabel.textStyle.fontSize = 12;
                option1.xAxis.axisLabel.rotate = 0;
            }
            bestCharts.setOption(option1);
            window.addEventListener("resize", function () {
                if(document.documentElement.clientWidth <= 1594){
                    option1.legend.itemWidth = 12;
                    option1.legend.itemHeight = 8;
                    option1.legend.itemGap=2;

                    option1.xAxis.axisLabel.textStyle.fontSize = 9;
                    option1.xAxis.axisLabel.rotate = -40;
                }else{
                    option1.legend.itemWidth = 24;
                    option1.legend.itemHeight = 16;
                    option1.legend.itemGap=6;

                    option1.xAxis.axisLabel.textStyle.fontSize = 12;
                    option1.xAxis.axisLabel.rotate = 0;
                }
                bestCharts.setOption(option1);
                bestCharts.resize();
            });           
        }
    }
    }
</script>

<style lang="stylus" scoped>
    /* 样式穿透 .leftContentTwo >>> .littleLine */
    /* 所有样式 */
    .leftContentThree
        width: 4.03rem
        height: 32.1vh
        color: white
        background :rgba(7,23,42,0.49)
        .assessDetail
            .bestCityTitle
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
                .bestCityName
                    font-size: .18rem
                    font-family: FZZXHJW--GB1-0
                    margin-left: .12rem
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
                    background: #333
                    margin-left: .06rem
                    margin-right: .04rem
                .thirdLine
                    width: .44rem
                    height: .03rem
                    background: #FFFFFF
            .bestCharts
                #bestCharts
                    width: 21vw
                    height: 27vh        
</style>


