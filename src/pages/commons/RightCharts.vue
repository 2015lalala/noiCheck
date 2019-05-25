
   
<template>
    <div class= "rightCharts">
        <div id="wenchaCharts">
            <div class="panel">
                <div class="bestCityTitle">
                    <!--宽窄竖线-->
                    <div class="doubleLine lf">
                        <div class="wide lf"></div>
                        <div class="narrow lf"></div>
                    </div>
                    <!--最优城市-->
                    <div class="bestCityP lf">
                        <div class="bestCityName lf">站点有效数值</div>
                    </div>
                </div>
                <div class="threeLine">
                    <div class="firstLine lf"></div>
                    <div class="secondLine lf"></div>
                    <div class="thirdLine lf"></div>
                </div>
                <div class="tableHeader">
                    <div>序号</div>
                    <div>站点</div>
                    <div>有效值</div>
                </div>
                <div class="activity" id="J_Activity">
                    <ul>
                        <li v-for="(item,index) of youxiaoList" :key="index">
                            <div>{{item.id}}</div>
                            <div>{{item.station}}</div>
                            <div>{{item.value}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="wenduCharts">
            <div class="panel">
                <div class="bestCityTitle">
                    <!--宽窄竖线-->
                    <div class="doubleLine lf">
                        <div class="wide lf"></div>
                        <div class="narrow lf"></div>
                    </div>
                    <!--最优城市-->
                    <div class="bestCityP lf">
                        <div class="bestCityName lf">站点负氧离子排行（单位：个/cm3）</div>
                    </div>
                </div>
                <div class="threeLine">
                    <div class="firstLine lf"></div>
                    <div class="secondLine lf"></div>
                    <div class="thirdLine lf"></div>
                </div>
            </div>
            <div id="levelTen" style="width:410px;height:400px"></div>
            <div class="topName">
                <div v-for="(item , index) of topList" :key="index">{{item}}</div>
            </div>
        </div>
    </div> 
</template>
<script>
    let echarts = require('echarts');

    export default {
        name: 'RightCharts',
        data(){
            return{
                youxiaoList: [
                    {id:1,station: '黄岩区九峰站', value : 12155},
                    {id:2,station: '淳安千岛湖', value : 3214},
                    {id:3,station: '椒江区云西路站', value : 4521},
                    {id:4,station: '衢州柯城府山', value : 8224},
                    {id:5,station: '台州玉环坎山', value : 6455},
                    {id:6,station: '镇海骆驼街道', value : 7254},
                    {id:7,station: '乐清乐成', value : 7894}
                ],
                topList: ['Top1','Top2','Top3','Top4','Top5','Top6','Top7','Top8','Top9','Top10']
            }
        },
        methods:{
            drawcharts: function(){
                let myLevel = echarts.init(document.getElementById('levelTen'));
                var array1 = ["桐庐气象站","黄岩区九峰站","淳安千岛湖","椒江区云西路站","衢州柯城府山","台州玉环坎山","镇海骆驼街道","海盐绮园景区","温岭市虎山站","乐清乐成"];
                var array = array1.reverse();
                let option = {
                    tooltip: {
                        show:false,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        }
                    },
                    grid: {
                        top: '2%',
                        bottom: '1%',
                        left:'20%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                show: false,
                                interval: 1,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 12
                                }
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }

                        }
                    ],
                    yAxis:{
                        type: 'category',
                        data: ['0','1','2','3','4','5','6','7','8','9'],
                        axisLabel: {
                            color:"rgba(255,255,255,1)",
                            formatter: function (value) {
                                return '{' + value + '| }{value|'+array1[value]+'}';
                            },
                            rich: {
                                value: {
                                    align: 'center',
                                    padding:[0,0,0,-5],
                                    fontSize:14
                                }
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        zlevel: 99
                        },
                    series: [{
                        type: 'bar',
                        barWidth: '20%',
                        barCategoryGap: '60%',
                        itemStyle: {
                            normal: {
                                barBorderRadius:[10, 10, 10, 10],
                                color: new echarts.graphic.LinearGradient(
                                        0, 0, 1, 0,
                                        [
                                            {offset: 0, color: '#048BFE'},
                                            {offset: 1, color: '#00EEF1'}
                                        ]
                                ),
                                label: {
                                    show: true,
                                    position: 'right',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: '12'
                                    }
                                }
                            }
                        },
                        data: [99,85,74,63,63,61,56,35,23,15]
                    }]
                }
                option.series[0].data.reverse();
                myLevel.setOption(option);
                window.addEventListener("resize", function () {
                    myLevel.resize();
                });      
            }
        },
        mounted(){
            this.drawcharts();
            $(function () {
                var listPanel = $('#J_Activity ul');
                var z = 0;//向上滚动top值
                function up() {//向上滚动
                    listPanel.animate({//站点向上滑动一个
                        'top': (z - 34) + 'px'
                    }, 1500, 'linear', function () {
                        listPanel.css({'top': '0px'})
                        .find("li:first").appendTo(listPanel);
                        up();
                    });
                }

                up();

                listPanel.mouseover(function(){
                    listPanel.stop();
                })
                listPanel.mouseout(function(){
                    up();
                })
            });
        }
    }
</script>
<style lang="stylus" scoped>
    .rightCharts
        width: 4.25rem
        height: 75.52vh
        position: absolute
        top: 0
        right: .45rem      
        background :rgba(0,0,0,0.6)
        #wenchaCharts
            width: 4.25rem
            height: 24.84vh  
            margin-bottom: 50px        
            .panel
                margin:0 auto
                text-align: center
                .bestCityTitle
                    width: 100%
                    height: 5vh
                    padding-top: 1.8vh
                    color:white
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
                        color:#fff
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
                        width: .64rem
                        height: .03rem
                        background: rgba(255,255,255,1)
                .tableHeader
                    background: rgba(68,109,126,1)
                    line-height: 24px
                    display:flex
                    color: #fff
                    justify-content : space-around

                .activity
                    position: relative
                    overflow: hidden
                    ul
                        top: -15px
                        padding: 0
                        color: #666
                        position: relative
                        li
                            height: 34px
                            display:flex
                            padding:0
                            font-size: 12px
                            line-height: 34px
                            list-style: none
                            border-bottom: 1px solid #59E1FE
                            div 
                                width:33%
                                text-align :left
                                color:#fff
                            div:first-child
                                text-align:center
                            div:last-child
                                text-align:center
                        li:hover
                            background: rgba(47,222,252,0.4)
        #wenduCharts
            width:4.25rem
            position:relative
            font-family:FZZXHJW--GB1-0;
            .panel
                margin:0 auto
                text-align: center
                .bestCityTitle
                    width: 100%
                    height: 5vh
                    padding-top: 1.8vh
                    color:white
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
                        color:#fff
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
                        width: .64rem
                        height: .03rem
                        background: rgba(255,255,255,1)
            .topName
                width:50px
                height:86%
                position:absolute
                top:60px
                left:0
                display:flex
                flex-direction : column
                justify-content : space-around
                align-items : center
                color:white
                div 
                    flex:1
                    display:flex
                    flex-direction :column
                    align-items :center
                    justify-content : space-around
                div:first-child
                    font-size: .16rem



            
</style>




    
    