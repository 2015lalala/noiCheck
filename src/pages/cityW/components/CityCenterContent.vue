<template>
    <div class="stationCenterContent">
        <div class="tabCharts lf">
            <div class="tabTitle">
                <div class="tabTitleName">
                    <div class="kuanLine lf"></div>
                    <div class="zhaiLine lf"></div>
                    <div class="historyData lf">历史数据</div>
                </div>
                <div class="tabTitleTabs lf">
                    <ul class="allNum lf">
                        <li class="lf" v-for="(item, index) of contentList" :key="index"
                            :class="{'numActive':isNumIndex==index}"  
                            @click="handleNumChange(index)"
                        >
                            {{item.name}}
                        </li>
                    </ul>
                    <ul class="twoTime lf">
                        <li v-for="(item, index) of dateList" :key="index" :class="{'dateActive':isDateIndex==index}"  
                        class="lf" @click="handleDateChange(index)"
                        >{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="threeLine">
                <div class="firstLine lf"></div>
                <div class="secondLine lf"></div>
                <div class="thirdLine lf"></div>
            </div>
            <div id="quxianCharts">
                
            </div>
        </div>
        <div class="numLook lf">
            <div class="numLookTitle">
                <div class="numLookKuanLine lf"></div>
                <div class="numLookZhaiLine lf"></div>
                <div class="numLookWord lf">各城市各类站点数量</div>
            </div>
            <div class="numThreeLine">
                <div class="numFirstLine lf"></div>
                <div class="numSecondLine lf"></div>
                <div class="numThirdLine lf"></div>
            </div>
            <div id="zhishuCharts">

            </div>
        </div>
    </div>
</template>
<script>
    let echarts = require('echarts');
    export default {
        name: 'CityCenterContent',
        data(){
            return{
                isNumIndex:0,
                isDateIndex:0,
                contentList: [{name: '负氧离子'},{name: 'CO'},{name:'PM2.5'},{name: 'O3'},{name: 'NO2'},{name: 'PM10'},{name: 'SO2'}],
                dateList: [{name: '24小时'},{name: '7日'}],
                val:[1],
                quxianChartsData: [['2016/12/18 01:00:00', 280], ['2016/12/18 02:00:00', 360], ['2016/12/18 03:00:00', 390], ['2016/12/18 04:00:00',546], ['2016/12/18 05:00:00', 326],['2016/12/18 06:00:00', 426],['2016/12/18 07:00:00', 426],['2016/12/18 08:00:00', 426],['2016/12/18 09:00:00', 426],['2016/12/18 10:00:00', 426],['2016/12/18 11:00:00', 426],['2016/12/18 12:00:00', 426],['2016/12/18 13:00:00', 426],['2016/12/18 14:00:00', 426],['2016/12/18 15:00:00', 426],['2016/12/18 16:00:00', 426],['2016/12/18 17:00:00', 426],['2016/12/18 18:00:00', 426],['2016/12/18 19:00:00', 426],['2016/12/18 20:00:00', 426],['2016/12/18 21:00:00', 426],['2016/12/18 22:00:00', 426],['2016/12/18 23:00:00', 426],['2016/12/19 00:00:00', 426]],
            }
        },
        methods:{
           
            drawFourCharts: function(){
                var myChart1 = echarts.init(document.getElementById('quxianCharts'));
                var option1 = {              
                    tooltip: {
                        trigger: 'axis',
                    },
                    grid: {
                        top: '8%',
                        left: '1%',
                        right: '2%',
                        bottom: '8%',
                        containLabel: true,
                    },
                    xAxis: [{
                        type: 'category',
                        //splitNumber: 5,
                        boundaryGap: false,
                        axisLine: { //坐标轴轴线相关设置。数学上的x轴
                            show: true,
                            lineStyle: {
                                color: '#233e64',
                                type: 'dashed'
                            },
                        },
                        axisLabel: { //坐标轴刻度标签的相关设置
                            textStyle: {
                                color: '#fff',
                                //margin:15,
                                fontWeight: 'bold' //加粗
                            },
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#5ACBAC',
                                type: 'dotted',
                                width: '1',
                                splitArea: '0'
                            }
                        },
                        axisTick: { show: false,},
                    }],
                    yAxis: [{
                        type: 'value',
                        min: 200,
                        //max:140,
                        //splitNumber: 7,
                        minInterval : 100,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#5ACBAC',
                                type: 'dotted',
                                width: '1',
                                //splitArea: '0.5'
                            }
                        },
                        axisLine: {show: false,},
                        axisLabel: {
                            margin:20,
                            textStyle: {
                                color: '#fff',
                                fontWeight: 'bold' //加粗
                                
                            },
                        },
                        
                        axisTick: { show: false,},  
                    }],
                    series: [{
                        name: '',
                        type: 'line',
                        smooth: true, //是否平滑曲线显示
                        symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆               
                        symbolSize: 10,   //折线点的大小 
                        itemStyle:{
                            normal:{                      
                                color: '#fff',
                                borderWidth:1,     
                                //borderType: 'dotted'                
                            },
                                
                        },   
                        lineStyle: {
                            normal: {
                                color: "#00FF7F"   // 线条颜色
                            }
                        },
                        areaStyle: { //区域填充样式
                            normal: {
                            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0,  color: '#5ACBAC'}, 
                                { offset: 1,  color: 'rgba(255, 255, 255, 0.3)'}
                            ], false),

                            //shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                            //shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                            }
                        },
                        data: []
                    }]
                };   
               
                //改时间格式还是在这改吧，
                // if(this.isDateIndex == 0){                
                //     for(let i=0;i<this.quxianChartsData.length;i++){
                //         option1.series[0].data[i][0]=this.quxianChartsData[i][0].slice(5,13);
                //         option1.series[0].data[i][1]=this.quxianChartsData[i][1];
                //     }             
                // }
                // else{
                //     for(let i=0;i<this.quxianChartsData.length;i++){
                //         option1.series[0].data[i][0]=this.quxianChartsData[i][0].slice(5,10);
                //         option1.series[0].data[i][1]=this.quxianChartsData[i][1];
                //     }       
                // }
                var datalist=[];  
                datalist=JSON.parse(JSON.stringify(this.quxianChartsData));
                if(this.isDateIndex == 0){                
                    for(let i=0;i<this.quxianChartsData.length;i++){
                        datalist[i][0]=this.quxianChartsData[i][0].slice(5,13);
                        datalist[i][1]=this.quxianChartsData[i][1];
                    }             
                }
                else{
                    for(let i=0;i<this.quxianChartsData.length;i++){
                        datalist[i][0]=this.quxianChartsData[i][0].slice(5,10);
                        datalist[i][1]=this.quxianChartsData[i][1];
                    }       
                }
                option1.series[0].data = datalist;
                myChart1.setOption(option1);
                //自适应
                window.addEventListener("resize", function () {
                    myChart1.resize();
                });      

            },
            drawZhiShu: function(){
                let myChart2 = echarts.init(document.getElementById('zhishuCharts'));
                let option2 = {
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
                        itemHeight: 12 ,
                        itemGap: 6,
                    },
                    grid: {
                        top: 30,
                        left: '0%',
                        right: '2%',
                        bottom: '6%',
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
                                fontSize : 9,
                                color: '#fff',
                                //margin:81,                               
                            },
                            interval:0,
                            rotate:-40 //字体旋转
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
                    option2.legend.itemWidth = 12;
                    option2.legend.itemHeight = 8;
                    option2.legend.itemGap=2;

                    option2.xAxis.axisLabel.textStyle.fontSize = 9;
                    option2.xAxis.axisLabel.rotate = -40;
                }else{
                    option2.legend.itemWidth = 24;
                    option2.legend.itemHeight = 12;
                    option2.legend.itemGap=6;

                    option2.xAxis.axisLabel.textStyle.fontSize = 12;
                    option2.xAxis.axisLabel.rotate = 0;
                }
                myChart2.setOption(option2);
                window.addEventListener("resize", function () {
                    if(document.documentElement.clientWidth <= 1594){
                        option2.legend.itemWidth = 12;
                        option2.legend.itemHeight = 8;
                        option2.legend.itemGap=2;

                        option2.xAxis.axisLabel.textStyle.fontSize = 9;
                        option2.xAxis.axisLabel.rotate = -40;
                    }else{
                        option2.legend.itemWidth = 24;
                        option2.legend.itemHeight = 12;
                        option2.legend.itemGap=6;

                        option2.xAxis.axisLabel.textStyle.fontSize = 12;
                        option2.xAxis.axisLabel.rotate = 0;
                    }
                    myChart2.setOption(option2);
                    myChart2.resize();
                });     
                
               
                // $.ajax({
                //     //请求方式为get
                //     type:"GET",
                //     //json文件位置
                //     url:"./aqi-beijing.json",
                //     //返回数据格式为json
                //     dataType: "json",
                //     //请求成功完成后要执行的方法
                //     success: function(data){
                //         //使用$.each方法遍历返回的数据date,插入到id为#result中
                //         option2.xAxis.data=data.map(function (item) {             
                //             return item[0];
                //         });
                //         for(var i=0;i < 7;i++){
                //             option2.series[i].data=data.map(function (item) {
                //                 return item[i+1];
                //             });
                //         }               
                //         myChart2.setOption(option2);
                //     }
                // });
                            
            },
            handleNumChange(index){
                this.isNumIndex = index;
                //请求数据
                //回调改变他的格式
                //时间格式修改          
                // for(let i=0;i<this.quxianChartsData.length;i++){                       
                //         this.quxianChartsData[i][0]=this.quxianChartsData[i][0].slice(5,13);
                //         this.quxianChartsData[i][1]=this.quxianChartsData[i][1];
                // } 
               this.drawFourCharts()    
            },
            handleDateChange(index){
                this.isDateIndex = index;
                // for(let i=0;i<this.quxianChartsData.length;i++){
                //     this.quxianChartsData[i][0]=this.quxianChartsData[i][0].slice(5,10);
                //     this.quxianChartsData[i][1]=this.quxianChartsData[i][1];
                // }
                this.drawFourCharts()
 
                //console.log(this.isNumIndex);
            }

        },
        mounted(){
            this.drawFourCharts();
            this.drawZhiShu();
            // this.$nextTick(function () {
            //     this.drawZhiShu();
            // })
        
        },
        watch:{
            //quxianChartsData: 'drawFourCharts'

            quxianChartsData:function (){
                this.drawFourCharts()               
            }           

            // quxianChartsData: {
            //     handler(newVal) {
            //        this.drawFourCharts()
            //     },
            //     immediate: true,
            //     deep: true
            // }
        }
    }
</script>
<style lang="stylus" scoped>
    .stationCenterContent
        width: 14.73rem
        height: 19.07vh
        position: absolute
        bottom: .61rem
        left: 4.03rem
        color:white
        background :rgba(7,23,42,0.49)
        .tabCharts
            width: 10.41rem
            .tabTitle
                height: 3.5vh
                font-size: .16rem
                .tabTitleName
                    margin-left : .02rem
                    padding-top : 0.74vh
                    .kuanLine   
                        width: 0.07rem
                        height: 1.95vh0
                        background : #41E6FD
                    .zhaiLine
                        width: 0.02rem
                        height: 1.94vh
                        margin-left : .02rem
                        margin-right: .09rem
                        background : #41E6FD
                .tabTitleTabs
                    color:#fff
                    float:right
                    .allNum
                        li
                            width: .82rem
                            height: 2.22vh
                            line-height : 2.22vh
                            text-align : center
                            border: 1px solid #2FDEFC
                            font-size: .16rem
                        li:nth-child(2)
                            border-left: none 
                            border-right: none
                        li:nth-child(3)
                            border-right: none
                        li.numActive
                            background:#2FDEFC
                            color:black
                    .twoTime
                        margin-left: .55rem
                        li
                            width: .82rem
                            height: 2.22vh
                            line-height : 2.22vh
                            text-align : center
                            border: 1px solid #2FDEFC
                            font-size: .16rem
                        li:nth-child(2)
                            border-left: none
                        li.dateActive
                            background:#2FDEFC
                            color:black
            .threeLine
                width: 10.41rem
                height: .03px
                .firstLine
                    width: 9.83rem
                    height: .03rem
                    background : #41E6FD
                .secondLine
                    width: .08rem
                    height: .03rem
                    background: #333
                    margin-right: .04rem
                .thirdLine
                    width: .44rem
                    height: .03rem
                    background: #FFFFFF  
            #quxianCharts
                width:10.41rem
                height: 16.74vh        
        .numLook
            width:4.06rem
            margin-left:.14rem
            margin-left:.13rem
            .numLookTitle
                height: 3.5vh
                font-size: .16rem
                margin-left : .02rem
                padding-top : 0.74vh
                .numLookKuanLine   
                    width: 0.07rem
                    height: 1.95vh
                    background : #41E6FD
                .numLookZhaiLine
                    width: 0.02rem
                    height: 1.94vh
                    margin-left : .02rem
                    margin-right: .09rem
                    background : #41E6FD
            .numThreeLine
                width: 4.06rem
                height: .03px
                .numFirstLine
                    width: 3.51rem
                    height: .03rem
                    background : #41E6FD
                .numSecondLine
                    width: .07rem
                    height: .03rem
                    background: #333
                    margin-right: .04rem
                .numThirdLine
                    width: .43rem
                    height: .03rem
                    background: #FFFFFF
            #zhishuCharts
                width: 4.06rem
                height: 13.89vh
            
</style>


