<template>
  <div id="cesiumContainer"></div>
</template>

<script>
  export default {
    name: '',
    data(){
      return{
        x: 0,
        y: 0
      }
    },
    methods: {
        //实时显示坐标,注意缩进
        getXy: function(){
          var that = this;
          var handler3D = new Cesium.ScreenSpaceEventHandler(that.$comjs.viewer.scene.canvas);//初始化之后才能引入全局viewer,进入函数前初始化this,调用全局viewer
              handler3D.setInputAction(function(movement) {
              var pick= new Cesium.Cartesian2(movement.endPosition.x,movement.endPosition.y);
              if(pick){
                  var cartesian = that.$comjs.viewer.scene.globe.pick(that.$comjs.viewer.camera.getPickRay(pick), that.$comjs.viewer.scene);
                  if(cartesian){
                      //世界坐标转地理坐标（弧度）
                      var cartographic = that.$comjs.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                      if(cartographic){
                          //鼠标位置地球表面物体的真实海拔
                          var height =that.$comjs.viewer.scene.globe.getHeight(cartographic);
                          //视角海拔高度
                          var he = Math.sqrt(that.$comjs.viewer.scene.camera.positionWC.x * that.$comjs.viewer.scene.camera.positionWC.x + that.$comjs.viewer.scene.camera.positionWC.y * that.$comjs.viewer.scene.camera.positionWC.y + that.$comjs.viewer.scene.camera.positionWC.z * that.$comjs.viewer.scene.camera.positionWC.z);
                          var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
                          //地理坐标（弧度）转经纬度坐标
                          var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
                          if(!height){
                              height = 0;
                          }
                          if(!he){
                              he = 0;
                          }
                          if(!he2){
                              he2 = 0;
                          }
                          if(!point){
                              point = [0,0];
                          }
                          
                          let x = point[0].toFixed(6);  
                          let y = point[1].toFixed(6);
                          
                          that.$store.commit('changeXy', {x, y})//通过vuex传递给其他组件
                          //coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>"+"视角海拔高度:"+(he - he2).toFixed(2)+"米"+"&nbsp;&nbsp;&nbsp;&nbsp;海拔:"+height.toFixed(2)+"米"+"&nbsp;&nbsp;&nbsp;&nbsp;经度：" + point[0].toFixed(6) + "&nbsp;&nbsp;纬度：" + point[1].toFixed(6)+ "</span>";
                      }
                  }
              }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        },
        heightControl: function(){
            var that = this;
            var handler = new Cesium.ScreenSpaceEventHandler(that.$comjs.viewer.scene.canvas);
            handler.setInputAction(function(wheelment) {
                var height=that.$comjs.viewer.camera.positionCartographic.height;
                //滚动时事件穿透，鼠标在元素上时仍可缩放地球
                if(height<100000){
                    $('div[id^="popup-fylzStation2"]').show();
                    $('div[id^="popup-fylzStation1"]').hide();
                    $('div[id^="popup-fylzCity"]').hide();
                }
                if(height>100000 && height< 600000){
                    $('div[id^="popup-fylzStation2"]').hide();
                    $('div[id^="popup-fylzStation1"]').show();
                    $('div[id^="popup-fylzCity"]').hide();
                }
                if(height>600000){
                    $('div[id^="popup-fylzStation2"]').hide();
                    $('div[id^="popup-fylzStation1"]').hide();
                    $('div[id^="popup-fylzCity"]').show();
                }
            }, Cesium.ScreenSpaceEventType.WHEEL);
            //当鼠标在所加html上面之后，穿透元素，通过当前document对象的滚轮事件，控制球的缩放，同时不影响所加html正常事件执行
            document.onmousewheel = function(e){
                e = e || window.event;
                if (e.wheelDelta) {
                    if (e.wheelDelta > 0) { //当滑轮向上滚动时
                        console.log('放大', e.wheelDelta );
                        that.$comjs.zoomIn();
                    }
                    if (e.wheelDelta < 0) { //当滑轮向下滚动时  
                        console.log('缩小', e.wheelDelta);
                        that.$comjs.zoomOut();
                    }
                }

             }
             //另一思路为元素穿透，使用css属性pointer-events:none,使当前元素失去鼠标事件，从而实现该操作（会影响到原来html元素事件执行）
        }
    },
          
    mounted(){
        this.$comjs.cesiumInit()//初始化
        // 增加所有marker，控制通过视高控制marker显示隐藏
        this.getXy();//获取经纬度
        this.heightControl();//鼠标滚轮获取视高，动态控制
        //定位视角
        this.$comjs.onCenter(120.155161,30.236581,800000.0)
        this.$comjs.addMarkers();
        this.$comjs.addCityMarkers();
        this.$comjs.addStationMarkers();
        //初始化flyto调整视角,并不触发鼠标滚轮对地球的缩放，所以还是要隐藏第二和第三层的事件
        $('div[id^="popup-fylzStation1"]').hide();
        $('div[id^="popup-fylzStation2"]').hide();
    }
    
  }
</script>


<style  >
    #cesiumContainer{
        width:100vw;
        height:100vh;
        overflow: hidden;
    }
    .cesium-viewer-bottom{
        display:none;
    }
  
</style>
