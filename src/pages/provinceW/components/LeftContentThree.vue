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
                    <div class="bestCityName lf">{{threeName}}</div>
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
               threeName: "城市舒适度"
            }
            
        },
        mounted(){
         this.drawCharts()
    },
    methods: {
        drawCharts(){
            let bestCharts = echarts.init(document.getElementById('bestCharts'));
            bestCharts.setOption({
                    title: {
                        text: '空气清新等级',
                        textStyle: {
                            color: "#66C6D3",
                            fontSize : 14
                        },
                        left:20,
                        top:20
                    },
                    legend: {
                        width:'10%',
                        top:'8%',
                        data:['销量']
                    },
                    xAxis: {
                        position: 'bottom',
                        axisTick:{ // 隐藏刻度线
                            show: true
                        },
                        splitLine:{ //去掉背景水平网格线
                            show:true ,
                            lineStyle: {
                                color: '#2FDEFC',
                                type: 'dotted'
                            }
                        }, 
                        axisLine:{
                            show: true,
                            lineStyle:{
                                    color:'#2FDEFC',
                                    width:1,
                                    type: 'dotted'
                            }//这里是为了突出显示加上的
                        },
                        axisLabel : {
                            textStyle : {
                                fontSize : 12,
                                color : '#fff'
                            },
                            interval:0,
                            rotate:-40 //字体旋转
                        },
                        data: ["杭州","宁波","温州","湖州","嘉兴","绍兴","金华","衢州","舟山","台州","丽水"]
                    },
                    yAxis: {
                        //inverse:true,
                        type : 'value', //y轴逆序
                        axisLine:{
                            show: true,
                            lineStyle:{
                                color:'#2FDEFC',
                                width:1,
                                type: 'dotted'
                            }

                        },
                        splitLine:{ //去掉背景水平网格线
                            show:false 
                        }, 
                        axisTick:{ // 隐藏刻度线
                            show: true
                        },
                        min:0,
                        max:4,
                        axisLabel:{
                            textStyle : {
                                fontSize : 11,
                                color: '#FFF'
                            },
                        formatter: function (value) {
                            var texts = [];
                            switch(value){
                                case 4: 
                                    texts.push("舒适");
                                    break;
                                case 3:
                                    texts.push('较舒适');
                                    break;
                                case 2:
                                    texts.push('部分不适');
                                    break; 
                                case 1:
                                    texts.push('不适');
                                    break;
                            } 
                            return  texts;
                        },
                        rich: {
                            green: {
                                color: 'green'
                            }
                        }
                    }
                    },
                    series: [{ 
                        itemStyle:{
                            normal:{
                            color: function(params) {
                                var index_color = params.value;
                                    if(index_color == 3){
                                        return '#0BD74E';
                                    }
                                    else if(index_color == 1){
                                        return '#FF680D';
                                    }
                                    else if(index_color == 2){
                                        return '#0D83D6';
                                    }else if(index_color == 4){
                                        return '#27CB8F';
                                    }
                                } 
                            } 
                    },
                    type: 'bar',
                    data: [2, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3]
                    }]
                })
            window.addEventListener("resize", function () {
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


