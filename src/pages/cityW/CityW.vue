<template>
    <div>
        <city-header></city-header>
        <cesium-container></cesium-container>
        <div class="cityLeftContent">
            <cityLeft-contentOne></cityLeft-contentOne>
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
           
        }
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
        $('#pupup-all-view').remove();
        this.$comjs.onCenter(120.155161,30.236581,80000.0)
        this.$comjs.addCityMarkers();
        
    },
    methods: {
        getWeather(){
            axios.get('/api'+ "101030100").then(
                this.getWeatherInfo
            )
        },
        getWeatherInfo(res){
            this.weatherList = res.data
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
        /* height: calc(100% - 1.32rem); 12.2vh*/
        height: 87.7vh;
        overflow: hidden
    }
</style>

