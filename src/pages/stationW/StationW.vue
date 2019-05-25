<template>
    <div class="station">
        <station-header></station-header>
        <cesium-container></cesium-container>
        <div class="stationLeftContent">
            <stationLeft-contentOne></stationLeft-contentOne>
            <stationLeft-contentTwo></stationLeft-contentTwo>
            <stationLeft-contentThree></stationLeft-contentThree>   
        </div>
        <right-tool></right-tool>
        <common-bottom></common-bottom>
        <city-centerContent></city-centerContent>
    </div>
</template>
<script>
import CesiumContainer from '../cesium/CesiumContainer'
import StationHeader from './components/StationHeader'
import RightTool from '../commons/RightTool'
import StationLeftContentOne from './components/StationLeftContentOne'
import StationLeftContentTwo from './components/StationLeftContentTwo'
import StationLeftContentThree from './components/StationLeftContentThree'
import CityCenterContent    from '../city/components/CityCenterContent'
import CommonBottom from '../commons/CommonBottom'
export default {
    name: 'Station',
    components: {
        CesiumContainer,
        StationHeader,
        RightTool,
        StationLeftContentOne,
        StationLeftContentTwo,
        StationLeftContentThree,
        CommonBottom,
        CityCenterContent
    },
    mounted(){
        $('#pupup-all-view').remove();
        this.$comjs.onCenter(120.155161,30.236581,80000.0)
        this.$comjs.addCSMarkerss();
    }
}
</script>
<style>
    .stationLeftContent{
        position: absolute;
        left: 0;
        color:white;
        top: 6.57vh;
        z-index: 2;
        width: 4.02rem;
        /* height: calc(100% - 1.32rem); 12.2vh*/
        height: 87.7vh;
        overflow: hidden;
        background: rgba(7,23,42,0.49);
    }
    .stationLeftContent a{
        color: white;
        text-decoration :none;
    }
</style>


