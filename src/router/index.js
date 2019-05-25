import Vue from 'vue'
import Router from 'vue-router'
// import Province from '@/pages/province/Province'
// import City from '@/pages/city/City'
// import Station from '@/pages/station/Station'
// const Province = () => import( '@/pages/province/Province')
// const City = () => import( '@/pages/city/City')
// const Station = () => import( '@/pages/station/Station')

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [{
    path: '/',
    name: 'Province',
    component: () => import( '@/pages/province/Province')
  },{
    path: '/city/:name',
    name: 'City',
    component: () => import( '@/pages/city/City')
  },{
    path: '/station/:name',
    name: 'Station',
    component: () => import( '@/pages/station/Station')
  },{
    path: '/provinceW',
    name: 'ProvinceW',
    component: () => import( '@/pages/provinceW/ProvinceW')
  },{
    path: '/cityW/:name',
    name: 'CityW',
    component: () => import( '@/pages/cityW/CityW')
  },{
    path: '/stationW/:name',
    name: 'StationW',
    component: () => import( '@/pages/stationW/StationW')
  }]
})
