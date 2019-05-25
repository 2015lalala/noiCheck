<template>
    <div>
        <cesium-container></cesium-container>
        <province-header>
        </province-header>
        <div class="provinceLeft">
            <left-contentOne></left-contentOne>
            <left-contentTwo></left-contentTwo>
            <left-contentThree></left-contentThree>   
        </div>
        <right-tool></right-tool>
        <common-bottom></common-bottom>
        <common-controlBtn></common-controlBtn>
    </div>
</template>
<script>
import CesiumContainer from '../cesium/CesiumContainer'
import ProvinceHeader from './components/ProvinceHeader'
import RightTool from '../commons/RightTool'
import LeftContentOne from './components/LeftContentOne'
import LeftContentTwo from './components/LeftContentTwo'
import LeftContentThree from './components/LeftContentThree'
import CommonBottom from '../commons/CommonBottom'
import CommonControlBtn from './components/CommonControlBtn'
import HeaderCenter from '../commons/components/HeaderCenter'

export default {
    name: 'Province',
    components: {
        CesiumContainer,
        ProvinceHeader,
        LeftContentOne,
        LeftContentTwo,
        LeftContentThree,
        RightTool,
        CommonBottom,
        CommonControlBtn,
        HeaderCenter
    },
    methods: {
        getHomeAllData(){
            //使用fetch
        }
    },
    mounted(){
        // 120.155161,30.236581
        // this.$comjs.onCenter(120.155161,30.236581,800000.0)
        // this.$comjs.addMarkers();
    }
}
</script>
<style >
    .provinceLeft{
        position: absolute;
        left: 0;
        top: 6.57vh;
        z-index: 2;
        width: 4.02rem;
        /*height: calc(100% - 1.32rem); 12.2vh*/
        height: 87.8vh;
    }
</style>

