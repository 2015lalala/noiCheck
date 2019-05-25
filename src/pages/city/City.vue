<template>
    <div>
        <city-header></city-header>
        <cesium-container></cesium-container>
        <div class="cityLeftContent">
            <cityLeft-contentOne :weatherList="weatherList"></cityLeft-contentOne>
            <cityLeft-contentTwo></cityLeft-contentTwo>
            <cityLeft-contentThree></cityLeft-contentThree>   
        </div>
        <right-tool></right-tool>
        <common-bottom></common-bottom>
        <city-centerContent></city-centerContent>
        <city-stationCount></city-stationCount>
        <common-controlBtn></common-controlBtn>
    </div>
</template>
<script>
import CesiumContainer from '../cesium/CesiumContainer'
import CityHeader from './components/CityHeader'
import RightTool from '../commons/RightTool'
import CityLeftContentOne from './components/CityLeftContentOne'
import CityLeftContentTwo from './components/CityLeftContentTwo'
import CityLeftContentThree from './components/CityLeftContentThree'
import CityCenterContent    from './components/CityCenterContent'
import CommonBottom from '../commons/CommonBottom'
import CityStationCount from './components/CityStationCount'
import CommonControlBtn from '../commons/CommonControlBtn'
import axios from 'axios'
export default {
    name: 'City',
    data(){
        return{
           weatherList: null,
           city_code: '',
           timer: null
        }
    },
    watch: {
        city_code: function(){
            this.getWeather()
            if(this.timer){
                clearInterval(this.timer)
            } else {
                this.timer = setInterval(()=>{
                    this.getWeather()
                    console.log("执行中")
                },30000)
            }
        }
    },
    mounted(){
        
    },
    destroyed(){
        clearInterval(this.timer)
    },
    components: {
        CesiumContainer,
        CityHeader,
        RightTool,
        CityLeftContentOne,
        CityLeftContentTwo,
        CityLeftContentThree,
        CommonBottom,
        CommonControlBtn,
        CityCenterContent,
        CityStationCount
    },
    mounted(){
        this.$comjs.onCenter(120.155161,30.236581,80000.0)
        $('div[id^="popup-fylzStation2"]').hide();
        $('div[id^="popup-fylzStation1"]').show();
        $('div[id^="popup-fylzCity"]').hide();
        this.getCityCode();
    },
    methods: {
        getCityCode(){
            axios.get('/_city.json').then(
                (res) =>{
                    console.log(res);
                    var nameCode = res.data
                    for(var i=0;i<nameCode.length;i++){
                        if(nameCode[i].city_name == this.$route.params.name){
                            this.city_code = nameCode[i].city_code
                        }
                    }
                }
            )
        },
        getWeather(){
            axios.get('/api'+ this.city_code).then(
                this.getWeatherInfo
            )
        },
        getWeatherInfo(res){
            this.weatherList = res.data;
            console.log(this.weatherList);
            
        }
    }
}
</script>
<style scoped>
    .cityLeftContent{
        position: absolute;
        left: 0;
        top: 6.57vh;
        z-index: 2;
        width: 4.02rem;
        height: calc(100% - 12.3vh); 
        /* height: 87.7vh; */
        /* overflow: hidden */
    }
</style>

