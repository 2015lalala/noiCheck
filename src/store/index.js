import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'

//使用插件
Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations
    //多个方法同时进行，出现异步时才使用action进行dispatch分发
    //actions: {
      //  changeXy(ctx, {x , y}){ //多值用对象传递
        //    ctx.commit('changeXy' , {x,y})
        //}
    //},
    //组件直接调用mutations
   
})