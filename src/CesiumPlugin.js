//定义cesium全局方法,cesium页面获取焦点时才能鼠标缩放，二维地图也一样。
const comjs  = {};
//cesium所需对象，容器，坐标，量测，marker
comjs.viewer = null;
comjs.url="";
comjs.x = null;
comjs.y = null;
comjs.measureSurface = null;
comjs.drawControl;
comjs.bindMarkerEx = null;
comjs.markers = [];
comjs.entity = null;
//三维球初始化
comjs.cesiumInit=function(){
        comjs.viewer = new Cesium.Viewer('cesiumContainer',{    
        animation : false,//是否创建动画小器件，左下角仪表    
        baseLayerPicker : false,//是否显示图层选择器    
        fullscreenButton : false,//是否显示全屏按钮    
        geocoder : false,//是否显示geocoder小器件，右上角查询按钮    
        homeButton : false,//是否显示Home按钮    
        infoBox : false,//是否显示信息框    
        sceneModePicker : false,//是否显示3D/2D选择器    
        selectionIndicator : false,//是否显示选取指示器组件    
        timeline : false,//是否显示时间轴    
        navigationHelpButton : false,//是否显示右上角的帮助按钮    
        scene3DOnly : true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源 );  
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
        })
    });
    //多层服务，追加显示
    comjs.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
        layer: "tdtAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
    }));
    //下列属性，只能控制鼠标滚轮的 放大缩小。无法控制zoomIn和zoomOut
    comjs.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50000;//相机的高度的最小值
    comjs.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000;  //相机高度的最大值
    // comjs.viewer.scene.screenSpaceCameraController._minimumZoomRate = 300000; // 设置相机缩小时的速率
    // comjs.viewer.scene.screenSpaceCameraController._maximumZoomRate=  272000    //设置相机放大时的速率

},
//2D,3D切换
comjs.threeTwo = function(){
    let scene = comjs.viewer.scene;
    scene.morphTo2D()
}
comjs.twoThree = function(){
    let scene = comjs.viewer.scene;
    scene.morphTo3D()
},
//向左旋转
comjs.rotate = function(){
    comjs.viewer.camera.rotateLeft(Cesium.Math.toDegrees(0.005).toFixed(2));
},
//放大
comjs.zoomIn=function(){
    comjs.viewer.camera.zoomIn(100000.0);
    var height=comjs.viewer.camera.positionCartographic.height;
    //滚动时事件穿透，鼠标在元素上时仍可缩放地球
    if(height<100000){
        $('div[id^="popup-fylzStation2"]').show();
        $('div[id^="popup-fylzStation1"]').hide();
        $('div[id^="popup-fylzCity"]').hide();
    //that.$comjs.viewer.camera.setView({
    //   destination : Cesium.Cartesian3.fromRadians(that.$comjs.viewer.camera.positionCartographic.longitude, that.$comjs.viewer.camera.positionCartographic.latitude, 100000)
    //});
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
    //  that.$comjs.viewer.camera.setView({
    //      destination : Cesium.Cartesian3.fromRadians(that.$comjs.viewer.camera.positionCartographic.longitude, that.$comjs.viewer.camera.positionCartographic.latitude, 10000000)
    //  });
    }
},
//缩小
comjs.zoomOut=function(){
    comjs.viewer.camera.zoomOut(100000.0);
    var height=comjs.viewer.camera.positionCartographic.height;
    console.log(height)
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
},
//定位及视角
comjs.onCenter = function(x,y,h){
    comjs.viewer.camera.flyTo({
        destination :  Cesium.Cartesian3.fromDegrees(x,y, h), // 设置位置
        orientation: {
            heading : Cesium.Math.toRadians(0), // 方向
            pitch : Cesium.Math.toRadians(-90.0),// 倾斜角度
            roll : 0
        },
        // duration:2, // 设置飞行持续时间，默认会根据距离来计算
        // complete: function () {
        //     // 到达位置后执行的回调函数
        //     console.log('到达目的地');
        // },
        // cancle: function () {
        //     // 如果取消飞行则会调用此函数
        //     console.log('飞行取消')
        // },
        // pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
        // maximumHeight:500000, // 相机最大飞行高度
        // flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
    });

}
//量测功能，距离测量
comjs.drawPolyline = function(){
    comjs.measureSurface = new mars3d.Measure({
        viewer: comjs.viewer,
        terrain: false
    }); 
    comjs.measureSurface.measuerLength();//测量长度
    //measureSurface.measureArea();//测量面积                                 
    //measureSurface.measureHeight();//测量高度
    //measureSurface.clearMeasure();//清除
},
//面积测量
comjs.measureArea = function(){
    let measureSurface = new mars3d.Measure({
        viewer: comjs.viewer,
        terrain: false
    }); 
    measureSurface.measureArea();//测量面积                                 
},
//高度测量
comjs.measureHeight= function(){
    let measureSurface = new mars3d.Measure({
        viewer: comjs.viewer,
        terrain: false
    }); 
    measureSurface.measureHeight();//测量高度
    //measureSurface.clearMeasure();//清除
},
//清除测量结果
comjs.clearMeasure = function(){
    comjs.measureSurface.clearMeasure();//清除测量结果                            
},
//添加marker及marker对应的弹窗(各市marker)
comjs.addMarkers = function(markerArr){
    //增加marker
    var markerArr=[
        {x:120.155161,y:30.236581,markerImg:'./mark.png',markerId:'hangzhou',name:'杭州',level:'869',level: '1568',htmlStr:''},
        {x:120.770034,y:30.770431,markerImg:'./mark.png',markerId:'jiaxing',name:'嘉兴',level:'852',level: '1268',htmlStr:''},
        {x:120.029758,y:30.869052,markerImg:'./mark.png',markerId:'huzhou',name:'湖州',level:'756',level: '1110',htmlStr:''},
        {x:120.562848,y:29.998565,markerImg:'./mark.png',markerId:'shaoxing',name:'绍兴',level:'423',level: '1652',htmlStr:''},
        {x:121.541642,y:29.869131,markerImg:'./mark.png',markerId:'ningbo',name:'宁波',level:'456',level: '1752',htmlStr:''},
        {x:121.427809,y:28.663282,markerImg:'./mark.png',markerId:'taizhou',name:'台州',level:'978',level: '1589',htmlStr:''},
        {x:120.705859,y:27.997299,markerImg:'./mark.png',markerId:'wenzhou',name:'温州',level:'756',level: '1456',htmlStr:''},
        {x:119.641762,y:29.117773,markerImg:'./mark.png',markerId:'jinhua',name:'金华',level:'986',level: '1685',htmlStr:''},
        {x:118.887113,y:28.93023,markerImg:'./mark.png',markerId:'quzhou',name:'衢州',level:'453',level: '1547',htmlStr:''},
        {x:119.92771,y:28.473243,markerImg:'./mark.png',markerId:'lishui',name:'丽水',level:'756',level: '1687',htmlStr:''},
        {x:122.170168,y:30.005134,markerImg:'./mark.png',markerId:'zhoushan',name:'舟山',level:'624',level: '1568',htmlStr:''}
        ];
    var objPopup = {};
    for(var i = 0;i<markerArr.length;i++){
        comjs.entity = comjs.viewer.entities.add({
            name :markerArr[i].name,
            position : Cesium.Cartesian3.fromDegrees(markerArr[i].x,markerArr[i].y,10),
            billboard : {
                image : markerArr[i].markerImg,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM
            },
        });
        //增加弹窗容器
        var infoDiv = '<div id="pupup-all-view" style=""></div>';
        //追加到cesium容器中
        $("#cesiumContainer").append(infoDiv);
        //绑定在球上
        comjs.viewer.scene.postRender.addEventListener(bind2scene);
        //获取实体
        var entity = comjs.entity;
        var position = entity._position._value;
        var cartesian;
        if (entity.billboard || entity.label || entity.point) {
            cartesian = position;
        } 
        show(entity, cartesian)
        function show(entity, cartesian, idName ) {
            var idName = markerArr[i].markerId;
            var eleId = 'popup-fylzCity-' + idName;
            objPopup[eleId] = {
                popup: entity.popup,
                cartesian: cartesian
            };
            //显示内容
            var inhtml;
            if (typeof entity.popup === 'object')
                inhtml = entity.popup.html;
            else
                inhtml = entity.popup;
            if (typeof inhtml === 'function') {
                inhtml = inhtml(entity);//回调方法
            }
            //各市marker
            inhtml = `<div id="${eleId}" class="cesium-popup" >
                        <div class="cesium-popup-content-wrapper" style="box-shadow: 0 0px 0px rgba(0,0,0,0);color:#fff;overflow:inherit">
                            <div class="cesium-popup-content">
                                <div style="float:left;user-select: none;">
                                    <div>
                                        <span style="font-size:20px">${markerArr[i].level}</span>
                                        <span>/2202</span>
                                    </div>
                                    <div  style="background:linear-gradient(90deg,rgba(68,169,190,0) 0%,rgba(39,203,143,1) 100%);text-align:right;">
                                        <a style="color:white;text-decoration:none" onclick="" href="http://192.168.1.103:8080/#/city/${markerArr[i].name}">    
                                            ${markerArr[i].name} 
                                        </a>
                                    </div>
                                    <div class="henqingxin">很清新</div>
                                    <div class="levelCir">II</div>
                                </div>
                                <div style="float:left;width:80px;margin-top:36px">
                                    <div style="float:left;width:50px;height:1px;background:#59E1FE"></div>
                                    <div style="float:left;width:30px;height:1px;background:#59E1FE;transform-origin:left;transform:rotate(30deg);"></div>
                                </div>
                                <div id="cubes" style="float:left;display：none;">
                                    <div class="wrap">
                                        <div class="cube">
                                            <div class="front"></div>
                                            <div class="back"></div>
                                            <div class="top"></div>
                                            <div class="bottom"></div>
                                            <div class="left"></div>
                                            <div class="right"></div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                         </div>`;
            $("#pupup-all-view").append(inhtml);
            
            //计算显示位置
            var result = updateViewPoint(eleId, cartesian, entity.popup);
            if (!result) {
                close(eleId);
                return;
            }
        }
        // $('div[id^="popup-fylzCity"]').mouseover(function(){
            
        //     $('div[id^="popup-fylzCity"]').css('pointer-events','none');
        //     $('div[id^="popup-fylzCity"]').click(function(){
        //         console.log('点击事件')
        //     })
        // })
        // $('.cesium-popup').mouseover(function(){
        //     console.log('BBBBBB')
        //     $('.cesium-popup').css('pointer-events','none');
        //     $(this).click(function(){
        //         console.log('aaa')
        //     })
        // })
        // $('.pupup-all-view').on('click','div[id^="popup-fylzCity"]',function(){
        //     console.log('click')
        //     $('div[id^="popup-fylzCity"]').css('pointer-events','none');
        // })
        // $('div[id^="popup-fylzCity"]').click(function(){
        //     console.log('点击事件')
        // })
        //计算实体位置，跟随三维球缩放和旋转
        function updateViewPoint(eleId, cartesian, popup) {
            var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(comjs.viewer.scene, cartesian);
            if (point == null) return false;
    
            var $view = $("#" + eleId);
            var x = point.x - ($view.width() / 2);
            var y = point.y - $view.height();
            if (popup && (typeof popup === 'object') && popup.anchor) {
                x += popup.anchor[0];
                y += popup.anchor[1];
            }
            $view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
            return true;
        }
        function bind2scene() {
            for (var i in objPopup) {
                var item = objPopup[i];
                updateViewPoint(i, item.cartesian, item.popup);
            }
        }
        function close(eleId) {
            if (!_isOnly && eleId) {
                $("#" + eleId).remove();
                delete objPopup[eleId];
            }
            else {
                $("#pupup-all-view").empty();
                objPopup = {};
            }
        }
    }
    

},
// 添加省边界
comjs.addPloy = function(){
  var en=  comjs.viewer.entities.add({
        name:"浙江省面",
        polygon:{
            hierarchy:{
                positions:Cesium.Cartesian3.fromDegreesArray(
                    [118.2129, 29.3994 , 118.7402, 29.707 , 118.916, 29.9707 , 118.916, 30.3223 , 119.3555, 30.4102 , 119.2676, 30.6299 , 119.4434, 30.6738 , 119.6191, 31.0693   ,   119.6191, 31.1133   ,   119.9707, 31.1572   ,   120.498, 30.8057   ,   120.9375, 31.0254   ,   121.2891, 30.6738   ,   121.9922, 30.8057   ,   122.6953, 30.8936   ,   122.8711, 30.7178   ,   122.959, 30.1465   ,   122.6074, 30.1025   ,   122.6074, 29.9268   ,   122.168, 29.5313   ,   122.3438, 28.8721   ,   121.9922, 28.8721   ,   121.9922, 28.4326   ,   121.7285, 28.3447   ,   121.7285, 28.2129   ,   121.4648, 28.2129   ,   121.5527, 28.0371   ,   121.2891, 27.9492   ,   121.1133, 27.4219   ,   120.6738, 27.334   ,   120.6738, 27.1582   ,   120.9375, 27.0264   ,   120.7617, 27.0264   ,   120.4102, 27.1582   ,   120.2344, 27.4219   ,   119.7949, 27.29   ,   119.6191, 27.6855   ,   119.2676, 27.4219   ,   118.916, 27.4658 , 118.7402, 28.0371 , 118.8281, 28.2568 , 118.4766, 28.3008 , 118.4766, 28.3447 , 118.3887, 28.7842 , 118.0371, 29.0479 , 118.0371, 29.1797 , 118.2129, 29.3994
                    
                    ]
            )},
            material: Cesium.Color.fromCssColorString('rgba(6,25,47,.6)')
        }
    })
}
//添加marker及marker对应的弹窗(站点)
comjs.addCityMarkers = function(markerArr){
    // var height=$comjs.viewer.camera.positionCartographic.height;
    // console.log(height);
    var timer;
    clearInterval(timer);
    var markerArr=[
        {x:120.107731,y:30.210118,markerImg:'./mark.png',markerId:'xihu',name:'西湖站点',level:10,fuyang:'1547'},
        {x:120.189513,y:30.249435,markerImg:'./mark.png',markerId:'hangzhouzhan',name:'杭州站',level:5,fuyang:'1689'}
        ];
    var objPopup = {};
    for(var i = 0;i<markerArr.length;i++){
        comjs.entity = comjs.viewer.entities.add({
            name :markerArr[i].name,
            position : Cesium.Cartesian3.fromDegrees(markerArr[i].x,markerArr[i].y,10),
            billboard : {
                image : markerArr[i].markerImg,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM
            },

        });
        // 添加市级页面时已上传
        // var infoDiv = '<div id="pupup-all-view"></div>';
        // $("#cesiumContainer").append(infoDiv);
        comjs.viewer.scene.postRender.addEventListener(bind2scene);
       
        var entity = comjs.entity;
        var position = entity._position._value;
            
        var cartesian;
        if (entity.billboard || entity.label || entity.point) {
            cartesian = position;
        } 
        show(entity, cartesian); 
        function show(entity, cartesian, idName ) {
            var idName = markerArr[i].markerId;
            var num = markerArr[i].level;
            var eleId = 'popup-fylzStation1' + idName;
            console.log(eleId);
            objPopup[eleId] = {
                popup: entity.popup,
                cartesian: cartesian
            };
            var inhtml;
            if (typeof entity.popup === 'object')
                inhtml = entity.popup.html;
            else
                inhtml = entity.popup;
            
            if (typeof inhtml === 'function') {
                inhtml = inhtml(entity);//回调方法
            }
            inhtml = `<div id="${eleId}" class="cesium-popup">
                              <div class="cesium-popup-content-wrapper" style="box-shadow: 0 0px 0px rgba(0,0,0,0);color:#fff;overflow:inherit">
                                <div class="cesium-popup-content">
                                    <div class="fuyangliziNum" data-name="${markerArr[i].name}">${markerArr[i].fuyang}个</div>
                                    <div class="fuyangCanvas">
                                        <div class="fuyanglizi">
                                            <canvas id="${eleId}canvas" width="76" height="87" style="background: transparent;"></canvas>
                                        </div>
                                        <div class="yuanquan">
                                            <div class="xiaoyuanquan"></div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                         </div>`;
            $("#pupup-all-view").append(inhtml);
            // $('div[id^="popup-fylzStation2"]').css('pointer-events','none')
            // $('div[id^="popup-fylzStation1"]').css('pointer-events','none')
            // $('div[id^="popup-fylzCity"]').css('pointer-events','none')
           setTimeout(function(){
                var id = eleId + 'canvas';
                var myMap = document.getElementById(id);
                var cxt = myMap.getContext('2d');
                var w = 76;
                var h = 87;
                function Random(min , max){
                    return Math.random()*(max-min)+min;
                }
                var newArr = [];
                for(let i=0;i<num;i++){
                    var img = new Image();
                    img.src = "/xuehua.png";
                    newArr.push(img)
                    cxt.drawImage(img,Random(0,w),Random(0,h),18,18)
                }
                function draw() {
                    cxt.clearRect(0, 0, w, h);
                    for(let j=0;j<num;j++){
                        var x = Random(0,w-18);//图片在画布上的位置
                        var y = Random(0,h);//图片在画布上的位置
                        var vX = Random(-1,1);
                        var vY = Random(1,2);
                        x += vX;
                        y -= vY;
                        if( x - 18 < 0) {  x = Random(0,w-18) }//图片左上角为图片位置
                        if( y  < 0 ) { y = Random(0,h) }
                        cxt.drawImage(newArr[j], x, y, 18, 18);
                    }
                }
                var timer = window.setInterval(draw, 300);
           },100)
            $('.cesium-popup').on('click','.fuyangliziNum', function(){
                localStorage.setItem('headerStation', $(this).attr('data-name'));
                window.location.href="http://192.168.45.99:8080/station/" + $(this).attr('data-name');
            })
            var result = updateViewPoint(eleId, cartesian, entity.popup);
            if (!result) {
                close(eleId);
                return;
            }
        }
        function updateViewPoint(eleId, cartesian, popup) {
            var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(comjs.viewer.scene, cartesian);
            if (point == null) return false;
    
            var $view = $("#" + eleId);
            var x = point.x - ($view.width() / 2);
            var y = point.y - $view.height();
            if (popup && (typeof popup === 'object') && popup.anchor) {
                x += popup.anchor[0];
                y += popup.anchor[1];
            }
            $view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
            return true;
        }
        function bind2scene() {
            for (var i in objPopup) {
                var item = objPopup[i];
                updateViewPoint(i, item.cartesian, item.popup);
            }
        }
        function close(eleId) {
            if (!_isOnly && eleId) {
                $("#" + eleId).remove();
                delete objPopup[eleId];
            }
            else {
                $("#pupup-all-view").empty();
                objPopup = {};
            }
        }
    }
}
//添加marker及marker对应的弹窗(市及站点样式)
comjs.addStationMarkers = function(markerArr){
    //增加marker
    var markerArr=[
            {x:120.240719,y:30.174003,markerImg:'./mark.png',markerId:'xihu',name:'西湖站点',level:10,fuyang:'6666'}
        ];
    var objPopup = {};
    //遍历
    for(var i = 0;i<markerArr.length;i++){
        comjs.entity = comjs.viewer.entities.add({
            name :markerArr[i].name,
            position : Cesium.Cartesian3.fromDegrees(markerArr[i].x,markerArr[i].y,10),
            billboard : {
                image : markerArr[i].markerImg,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM
            },

        });
        
        //增加弹窗容器
        // var infoDiv = '<div id="pupup-all-view" ></div>';
        // $("#cesiumContainer").append(infoDiv);
        comjs.viewer.scene.postRender.addEventListener(bind2scene);
       
        var entity = comjs.entity;
        var position = entity._position._value;
            
        var cartesian;
        if (entity.billboard || entity.label || entity.point) {
            // cartesian = pickedObject.primitive.position;
            cartesian = position;
        } 
        show(entity, cartesian); 
        function show(entity, cartesian, idName) {
            var idName = markerArr[i].markerId;
            var num = markerArr[i].level;//获取当前站点负氧离子的数量
            var eleId = 'popup-fylzStation2' + idName;
            console.log(eleId);
            objPopup[eleId] = {
                popup: entity.popup,
                cartesian: cartesian
            };
            console.log(objPopup);
            //显示内容
            var inhtml;
            if (typeof entity.popup === 'object')
                inhtml = entity.popup.html;
            else
                inhtml = entity.popup;
            
            if (typeof inhtml === 'function') {
                inhtml = inhtml(entity);//回调方法
            }
            inhtml = `<div id="${eleId}" class="cesium-popup">
                              <div class="cesium-popup-content-wrapper" style="box-shadow: 0 0px 0px rgba(0,0,0,0);color:#fff;overflow:inherit">
                                <div class="cesium-popup-content">
                                    <div class="fuyangliziNum" style="background:red" data-name="${markerArr[i].name}">${markerArr[i].fuyang}个</div>
                                    <div class="fuyangCanvas">
                                        <div class="fuyanglizi" style="background:transparent">
                                            <canvas id="${eleId}canvas" width="76" height="87" style="background: transparent;"></canvas>
                                        </div>
                                        <div class="yuanquan">
                                            <div class="xiaoyuanquan"></div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                         </div>`;
            $("#pupup-all-view").append(inhtml);
            // $('div[id^="popup-fylzStation2"]').css('pointer-events','none')
            // $('div[id^="popup-fylzStation1"]').css('pointer-events','none')
            // $('div[id^="popup-fylzCity"]').css('pointer-events','none')
            // 设置绘图环境
            setTimeout(function(){
                var id = eleId + 'canvas';
                var myMap = document.getElementById(id);
                var cxt = myMap.getContext('2d');
                var w = 76;
                var h = 87;
                
                function Random(min , max){
                    return Math.random()*(max-min)+min;
                }
                // 设置图像位置初始位置的变量
                // 创建绘图对象,并且画出来
                var newArr = [];
                for(let i=0;i<num;i++){
                    var img = new Image();
                    img.src = "/xuehua.png";
                    newArr.push(img)
                    cxt.drawImage(img,Random(0,w),Random(0,h),18,18)
                }
                function draw() {
                    cxt.clearRect(0, 0, w, h);
                    for(let j=0;j<num;j++){
                        var x = Random(0,w-18);//图片在画布上的位置
                        var y = Random(0,h);//图片在画布上的位置
                        var vX = Random(-1,1);
                        var vY = Random(1,2);
                        x += vX;
                        y -= vY;
                        if( x - 18 < 0) {  x = Random(0,w-18) }//图片左上角为图片位置
                        if( y  < 0 ) { y = Random(0,h) }
                        
                        cxt.drawImage(newArr[j], x, y, 18, 18);
                    }
                }
                window.setInterval(draw, 300);
            },100)
            
                
            //计算显示位置
            var result = updateViewPoint(eleId, cartesian, entity.popup);
                if (!result) {
                    close(eleId);
                    return;
                }
        }
        
        //计算实体位置，跟随三维球缩放和旋转
        function updateViewPoint(eleId, cartesian, popup) {
            var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(comjs.viewer.scene, cartesian);
            if (point == null) return false;
    
            var $view = $("#" + eleId);
            var x = point.x - ($view.width() / 2);
            var y = point.y - $view.height();
            if (popup && (typeof popup === 'object') && popup.anchor) {
                x += popup.anchor[0];
                y += popup.anchor[1];
            }
            $view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
            return true;
        }
    
    
        function bind2scene() {
            for (var i in objPopup) {
                var item = objPopup[i];
                updateViewPoint(i, item.cartesian, item.popup);
            }
        }
    
        function close(eleId) {
            if (!_isOnly && eleId) {
                $("#" + eleId).remove();
                delete objPopup[eleId];
            }
            else {
                $("#pupup-all-view").empty();
                objPopup = {};
            }
        }
    }
}
//绕点飞行测试
comjs.feixing = function(){
    var position=Cesium.Cartesian3.fromDegrees(112.315216, 39.5125612, 10000);
            comjs.viewer.scene.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(112.315216, 39.5125612, 20000),  //定位坐标点，建议使用谷歌地球坐标位置无偏差
			duration:1   //定位的时间间隔
		});
		setTimeout(function(){
			 flyExtent();
		},100);
		
		function  flyExtent(){
			// 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
		    var pitch = Cesium.Math.toRadians(-30);
		    // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
		    var angle = 360 / 5;
		    // 给定相机距离点多少距离飞行，这里取值为5000m
		    var distance = 15000;
		    var startTime = Cesium.JulianDate.fromDate(new Date());
		    var stopTime = Cesium.JulianDate.addSeconds(startTime, 5, new Cesium.JulianDate());
		    comjs.viewer.clock.startTime = startTime.clone();  // 开始时间
		    comjs.viewer.clock.stopTime = stopTime.clone();     // 结速时间
		    comjs.viewer.clock.currentTime = startTime.clone(); // 当前时间
		    comjs.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
		    comjs.viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
		    // 相机的当前heading
		    var initialHeading = comjs.viewer.camera.heading;
		    var Exection = function TimeExecution() {
		            // 当前已经过去的时间，单位s
		            var delTime = Cesium.JulianDate.secondsDifference(comjs.viewer.clock.currentTime, comjs.viewer.clock.startTime);
		            var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
		            comjs.viewer.scene.camera.setView({
		                destination : position, // 点的坐标
		                orientation: {
		                    heading : heading,
		                    pitch : pitch,
		                }
		            });
		            comjs.viewer.scene.camera.moveBackward(distance);
		            if (Cesium.JulianDate.compare(comjs.viewer.clock.currentTime, comjs.viewer.clock.stopTime) >= 0) {
		                comjs.viewer.clock.onTick.removeEventListener(Exection);
		            }
		 
		    };
		    comjs.viewer.clock.onTick.addEventListener(Exection);
			
		}
}

//统一导该模块，包含方法和所需变量
export default comjs;
