/* 2017-10-27 16:55:42 | 修改 木遥（QQ：346819890） */
//模块：
var m=function(){


    //每个窗口创建完成后调用
    this.winCreateOK= function (html) {
        var that = this;

        if (this.config && this.config.style) {
            $(".mapSwipeBar").addClass(this.config.style);
        }


        var arrLayers = this.getBaseMaps();

        var inhtmlBaseLayer = "";
        var inhtmlSwipelayer = ""; 
        for (var i = 0; i < arrLayers.length; i++) {

            var item = arrLayers[i];
            if (item.type == "group" && item.layers == null) continue;
             
            inhtmlBaseLayer += ' <li><a href="javascript:mapSwipeWidget.changeSelectBaseLayer(' + i + ',true)">' + item.name + '</a></li>';
            inhtmlSwipelayer += ' <li><a href="javascript:mapSwipeWidget.changeSelectSwipeLayer(' + i + ',true)">' + item.name + '</a></li>';
        }
        $("#ddl_basemap").html(inhtmlBaseLayer);
        $("#ddl_swipelayer").html(inhtmlSwipelayer);
 
        $("#btn_mapSwipe_close").click(function () {
            window.view.close();
            // that.disableBase();
        }); 
    },
    this.arrOldLayers= [],
    //激活插件
    this.activate= function () {

        ////记录图层
        //this.arrOldLayers = [];
        //var imageryLayerCollection = this.viewer.imageryLayers;
        //var length = imageryLayerCollection.length;
        //for (var i = 0; i < length; i++) {
        //    var layer = imageryLayerCollection.get(0);
        //    this.arrOldLayers.push(layer);
        //    imageryLayerCollection.remove(layer, false);
        //}

        var scene = this.viewer.scene;

        var slider = $("<div id='slider' class='cesium-map-contrast-slider'></div>");
        // $("#cesiumContainer").append(slider);
        var cont=parent.document.getElementById("cesiumContainer");
        $(cont).append(slider);
        scene.imagerySplitPosition = (slider[0].offsetLeft) / slider[0].parentElement.offsetWidth;

        var dragStartX = 0;
        parent.document.getElementById('slider').addEventListener('mousedown', mouseDown, false);
        parent.window.addEventListener('mouseup', mouseUp, false);


        var arrLayers = this.getBaseMaps();
        var defbaseIdx = -1;
        var defoverIdx = -1;
        for (var i = 0; i < arrLayers.length; i++) {

            var item = arrLayers[i];
            if (item.type == "group" && item.layers == null) continue;

            if (defbaseIdx == -1)
                defbaseIdx = i;
            else if (defbaseIdx != -1 && defoverIdx == -1) {
                defoverIdx = i;
                break;
            }
        } 
        this.changeSelectBaseLayer(defbaseIdx, true);
        this.changeSelectSwipeLayer(defoverIdx, true);


        function mouseUp() {
            parent.window.removeEventListener('mousemove', sliderMove, true);
        }

        function mouseDown(e) {
            var slider = parent.document.getElementById('slider');
            dragStartX = e.clientX - slider.offsetLeft;
            parent.window.addEventListener('mousemove', sliderMove, true);
        }

        function sliderMove(e) {
            var slider = parent.document.getElementById('slider');
            var splitPosition = (e.clientX - dragStartX) / slider.parentElement.offsetWidth;
            slider.style.left = 100.0 * splitPosition + "%";

            scene.imagerySplitPosition = splitPosition;
        }
        window.addEventListener("unload",()=>{
            parent.window.removeEventListener('mousemove', sliderMove, true);
            parent.window.removeEventListener('mouseup', mouseUp, false);
            // parent.document.getElementById('slider').removeEventListener('mousedown', mouseDown, false);
        })

    },
    //释放插件
    this.disable=function () {
        var s=parent.document.getElementById("slider");
        $(s).remove();

        if (this.leftLayer != null) {
            this.leftLayer._layer.setVisible(false);
        }
        if (this.rightLayer != null) {
            this.rightLayer._layer.setVisible(false);
        }
        this.leftLayer = null;
        this.rightLayer = null;
        // parent.window.removeEventListener("mouseup",mouseUp);
        //var imageryLayerCollection = this.viewer.imageryLayers;
        //for (var i = 0; i < this.arrOldLayers.length; i++) {
        //    imageryLayerCollection.add(this.arrOldLayers[i]);
        //}
        //this.arrOldLayers = [];

        var arrLayers = this.getBaseMaps(); 
        for (var i = 0; i < arrLayers.length; i++) {
            var item = arrLayers[i];
            if (item.type == "group" && item.layers == null) continue;
            item._layer.setVisible(true);
            break;
        }

    },
    this. getBaseMaps= function () {
        return this.viewer.gisdata.config.basemaps;
    },
    this.leftLayer= null,
    this.updateLeftLayer= function (item) {
        if (item._layer == null) return;

        if (this.leftLayer != null) {
            this.leftLayer._layer.setVisible(false);
        }
        this.leftLayer = item;

        item._layer.setVisible(true);
        if (item.type == "group") {
            for (var i = 0; i < item._layers.length; i++) {
                var layer = item._layers[i].layer;
                layer.splitDirection = Cesium.ImagerySplitDirection.LEFT;
            }
        }
        else {
            item._layer.layer.splitDirection = Cesium.ImagerySplitDirection.LEFT;
        }
    },
    this.rightLayer= null,
    this.updateRightLayer= function (item) {
        if (item._layer == null) return;

        if (this.rightLayer != null) {
            this.rightLayer._layer.setVisible(false);
        }
        this.rightLayer = item;

        item._layer.setVisible(true);
        if (item.type == "group") {
            for (var i = 0; i < item._layers.length; i++) {
                var layer = item._layers[i].layer;
                layer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
            }
        }
        else {
            item._layer.layer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
        }
    },
    //view界面控制
    this._last_baselayer_id= null,
    this._last_swipeLayer_id= null,
    this.changeSelectBaseLayer=function (id, ischange) {
        if (this._last_swipeLayer_id == id) {
            toastr.warning('图层对比不能为同一图层！');
            return;
        }
        this._last_baselayer_id = id;

        var arrLayers = this.getBaseMaps();
        var thisLayer = arrLayers[id];
        //if (thisLayer == null || thisLayer._layer == null) return;

        $("#btnSelectBaseMap").html('已选:' + thisLayer.name + '<span class="caret"></span>');
        if (ischange)
            this.updateLeftLayer(thisLayer);
    },
    this.changeSelectSwipeLayer= function (id, ischange) {
        if (this._last_baselayer_id == id) {
            toastr.warning('图层对比不能为同一图层！');
            return;
        }
        this._last_swipeLayer_id = id;

        var arrLayers = this.getBaseMaps();
        var thisLayer = arrLayers[id];
        //if (thisLayer == null || thisLayer._layer == null) return;

        $("#btnSelectSwipelayer").html('已选:' + thisLayer.name + '<span class="caret"></span>');

        if (ischange)
            this.updateRightLayer(thisLayer);
    }

}
var mapSwipeWidget=new m();
function inintViewer(viewer){
    mapSwipeWidget.viewer=viewer;
    mapSwipeWidget.winCreateOK();
    mapSwipeWidget.activate();
}
function close(){
    mapSwipeWidget.disable();
}