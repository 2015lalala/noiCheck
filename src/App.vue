<template>
  <div id="app">
      <!--显示对应的路由-->
      <router-view/>
  </div>
</template>

<script>
import CesiumContainer from './pages/cesium/CesiumContainer.vue'

export default {
  name: 'app'
}
</script>

<style>
</style>