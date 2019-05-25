import Vue from 'vue'
import App from './App.vue'
import router from './router'
import echarts from 'echarts'
import VueAwesomeSwiper from 'vue-awesome-swiper'


//使用vuex引入当前的store
import store from './store'
// import Cesium from "cesium/Cesium"
// import "cesium/Widgets/widgets.css"
import './assets/styles/reset.css'
import './assets/styles/iconfont.css'
import 'swiper/dist/css/swiper.css'

import comjs from './CesiumPlugin.js' //引入公用js
Vue.prototype.$comjs = comjs; //

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.Cesium = Cesium
Vue.prototype.bus = new Vue()
Vue.use(VueAwesomeSwiper)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
