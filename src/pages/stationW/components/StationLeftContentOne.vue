<template>
    <div class="stationLeftContentOne">
        <div class="hangzhou">
            <div class="hangzhouImg lf">
            </div>
            <ul class="hangzhouD lf">
                <li class="hangzhouName">{{this.$store.state.headerStation}}</li>
                <li class="hangzhouAssess">II 清新</li>
                <li class="hangzhouNum">
                    <div class="bigNum">
                        757</div>
                    <div class="smallNum">/1140</div>
                    <div class="darkNum">
                        负氧离子(个/cm3)
                    </div>
                </li>
            </ul>
        </div>
        <div class="weatherData">
            <div class="onDayWeather lf"  v-for="(item, index) of weatherList" :key="index" :class="{active: isIndex==index}">
                <div class="onDayWeatherDate">
                    {{item.Date}}
                </div>
                <div class="onDayWeatherImg">
                    <img src="/tianqi.png" alt="" style="height:3.4vh">
                </div>
                <div class="onDayWeatherDu">
                    {{item.Du}}
                </div>
                <div class="onDayWeatherRain">
                    {{item.Rain}}
                </div>
                <div class="onDayWeatherWind">
                    {{item.Wind}}
                </div>
                <div class="onDayWeatherLevel">
                    <div class="haveBG">
                        {{item.Level}}
                    </div>
                </div>
            </div>
        </div>
        <div id="littleCharts"></div>
    </div>
</template>
<script>
let echarts = require('echarts');
export default {
    name: 'StationLeftContentOne',
    methods: {
        weatherMouseOver: function(index){
            this.isIndex = index
        },
        drawcharts: function(){
            let myChart1 = echarts.init(document.getElementById('littleCharts'));
            let option1 = {
                backgroundColor:'rgba(255, 255, 255,0.3)',
                title: {
                    text: ''
                },
                grid: {
                    left:'5%',
                    top:'15%',
                    bottom: '25%',
                    right:'6%'

                },
                tooltip: {
                    trigger: 'axis'
                },
                    
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    nameGap:'20',
                    axisLabel : {
                        margin:'3',
                        textStyle : {
                            fontSize : 10,
                            color: '#fff'
                        },
                    },
                    axisLine: {
                        show:false
                    },
                    axisTick: {
                        show: false
                    },
                    boundaryGap: ['20%', '20%'],//坐标轴两边留白
                    data: ['1','2','3','4','5','6','7','8']
                },
                yAxis: {
                    
                    axisLabel : {
                        margin:'3',
                        textStyle : {
                            fontSize : 10,
                            color: '#fff'
                        },
                    },      
                    axisLine: {
                        show:false
                    },
                    axisTick: {
                        show: false
                    },                      
                    interval: 10,
                    type: 'value'
                },
                series: [
                    {   
                        name:'温度',
                        type:'line',      
                        smooth: true, //是否平滑曲线显示
                        symbolSize: 5,   //折线点的大小 
                        itemStyle:{
                            normal:{
                                //根据数值范围不同而颜色不同
                                color: '#fff',
                                lineStyle:{  
                                    color:'#fff'  //线的颜色
                                },
                                borderWidth:2,    
                                label:{  //折点显示数值
                                    fontSize : 10,
                                    show: true,
                                    formatter:"{c}℃"
                                }                          
                            },
                            
                        },   
                        areaStyle: { //区域填充样式
                            normal: {                    
                                color: "rgba(255,255,255, 0.5)",                       
                            }
                        },   
                        data:[20, 12, 11, 13, 9, 30, 10,18, 36],   
                    }
                ]
            };
            //设置x轴刻度
            function setXtime(){
                var myDate = new Date();
                var Nowhour=myDate.getHours(); 
                var timeData = new Array;
                timeData[0]= "现在";
                for(var i=1;i<9 ;i++){
                    timeData[i]= (Nowhour+i*3)%24 + "点";
                    if((Nowhour+i*3)%24 < 10){
                        timeData[i]= '0'+(Nowhour+i*3)%24 + "点";
                    }
                }
                option1.xAxis.data=timeData;
            }
            setXtime();
            myChart1.setOption(option1);
            //自适应
            window.addEventListener("resize", function () {
                myChart1.resize();
            }); 
        }
    },
    mounted(){
        this.drawcharts()
    },
    data(){
        return {
            isIndex: 0,
            weatherList:[{Date:'1日',Img:'',Du:'18-19℃',Rain: '阵雨',Wind: '东北风', Level:'优'},
                    {Date:'2日',Img:'',Du:'18-19℃',Rain: '小雨',Wind: '东北风', Level:'优'},
                    {Date:'3日',Img:'',Du:'18-19℃',Rain: '晴',Wind: '东北风', Level:'优'},
                    {Date:'4日',Img:'',Du:'18-19℃',Rain: '多云',Wind: '东北风', Level:'优'},
                    {Date:'5日',Img:'',Du:'18-19℃',Rain: '大雨',Wind: '东北风', Level:'优'}]
            
        }
    }
}
</script>
<style lang="stylus" scoped>
    .stationLeftContentOne
        height:41.7vh
        overflow:hidden
        .hangzhou
            width: 3.86rem 
            height: 8.24vh
            margin-left: .18rem
            margin-top: 2.59vh
            margin-bottom : 3.05vh
            .hangzhouImg
                width: 1.57rem
                height: 8.24vh
                border: 1px solid #FFF
                background : url('/jiang.jpg') no-repeat 
                background-size:cover
            .hangzhouD
                width: 2.19rem
                overflow: hidden
                margin-left: .1rem
                .hangzhouName
                    height: 2.13vh
                    font-size: .24rem
                .hangzhouAssess
                    margin-top: .83vh
                    margin-bottom: 1.1vh
                    width:.65rem
                    height: 2.22vh
                    line-height :2.22vh
                    font-size: 0.16rem
                    text-align :center
                    background :#0BD74E
                .hangzhouNum
                    width: 100%
                    font-size: .15rem
                    display:flex
                    align-items: flex-start
                    align-content: flex-start
                    .bigNum
                        font-size: .24rem
                    .smallNum
                        margin-top:.10rem
                    .darkNum
                        font-size:12px
                        transform : scale(.8)
                        margin-left:-5px
                        margin-top:.12rem
                        color: #ADADAD

        .weatherData
            height:17.92vh
            margin-top: 3.9vh
            // margin-left: .38rem
            display: flex
            justify-content : space-around
            .onDayWeather
                width: .54rem
                height: 16.4vh
                border-left: 1px solid #7D7D7D
                text-align :center
                flex:1
                .onDayWeatherDate
                    line-height: 2.4vh
                    font-size: .16rem 
                .onDayWeatherImg
                    height: 4.4vh
                    line-height: .4vh
                .onDayWeatherDu
                    line-height : 2.4vh
                    font-size: .1rem
                .onDayWeatherRain
                    font-size: .1rem
                    line-height : 2.4vh
                .onDayWeatherWind
                    line-height : 2.4vh
                    font-size: .1rem
                .onDayWeatherLevel
                    height:2.4vh
                    font-size: .12rem
                    overflow: hidden
                    .haveBG
                        width:.35rem
                        line-height: 1.7vh
                        margin: 0 auto
                        margin-top: 0.4vh
                        background : #22AC38
            .onDayWeather:first-child
                border:none       
            .onDayWeather.active
                text-align :center
                background:rgba(13,131,214,0.52)
                width:1.06rem
                flex:1.5
            .onDayWeather.active .onDayWeatherRain
                background : rgba(13,131,214,0.52)
            .onDayWeather.active .onDayWeatherLevel
                background : rgba(13,131,214,0.52)
        #littleCharts
            width: 3.75rem
            height: 7.6vh
            border: 1px solid #ddd
            margin-left: .14rem
            margin-bottom: 2.31vh
</style>


