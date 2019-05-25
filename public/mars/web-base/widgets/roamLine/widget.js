/* 2017-12-6 11:11:44 | 修改 木遥（QQ：346819890） */
//模块：
// mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
//     options={
//         //弹窗
//         view={
//             type="window",
//             url="view.html",
//             windowOptions={
//                 width=250,
//                 position={
//                     "top"=5,
//                     "right"=5,
//                     "bottom"=5
//                 }
//             }
//         };
//     };
var widget = {};
widget.drawControl = null;
//初始化[仅执行1次]
widget.create = function (viewer) {
    var that = this;
    this.viewer = viewer;
    this.viewWindow=window;
    this.drawControl = new mars3d.Draw({
        viewer:this.viewer,
        hasEdit:true,
        dragIcon:'img/dragIcon.png',
        onStopDrawing:function (entity) {
            if (entity._attribute.attr.id == null || entity._attribute.attr.id == "")
                entity._attribute.attr.id = (new Date()).format("MMddHHmmss");

            that.viewWindow.plotlist.plotEnd();
            //that.saveEntity(entity);
        },
        onStartEditing:function (entity) {
            entity._polyline.show = true;
            entity._attribute.style.show = true;

            that.startEditing(entity);
        },
        onChangeEditing:function (entity) {
            that.startEditing(entity);
        },
        onStopEditing:function (entity) {
            if (entity == null) return;

            entity._polyline.show = false;
            entity._attribute.style.show = false;

            that.stopEditing(entity);
            that.saveEntity(entity);
        }
    });

   
};
widget.viewWindow = null;
//每个窗口创建完成后调用
widget.winCreateOK = function (opt, result) {
    this.viewWindow = result;
};
//激活插件
widget.activate = function () {
    this.drawControl.hasEdit(true);
    this.drawControl.setVisible(true);
};
//释放插件
widget.disable = function () {
    this.viewWindow = null;
    this.drawControl.stopDraw();

    this.drawControl.hasEdit(false);
    this.drawControl.setVisible(false);
};

//开始标记
widget.startDraw = function (defval) {
    //console.log(JSON.stringify(defval));
    this.drawControl.startDraw(defval);
};
widget.startEditingById = function (id) {
    var entity = this.drawControl.getEntityById(id);
    if (entity == null) return;

    this.viewer.flyTo(entity);

    entity.startEditing();
};
widget.startEditing = function (entity) {
    var lonlats = this.drawControl.getCoordinates(entity);
    this.viewWindow.plotEdit.startEditing(entity.attribute, lonlats);
};
widget.stopEditing = function (layer) {
    if (this.viewWindow)
        this.viewWindow.plotEdit.stopEditing();
};
//更新图上的属性
widget.updateAttr2map = function (attr) {
    this.drawControl.updateAttribute(attr);
};
//更新图上的几何形状、坐标等
widget.updateGeo2map = function (coords, withHeight) {
    var positions = coords;
    if (positions.length == 2) {
        positions = Cesium.Cartesian3.fromDegrees(Number(coords[0]).toFixed(6), Number(coords[1]).toFixed(6), Number(0));
    } else if (positions.length == 3) {
        positions = Cesium.Cartesian3.fromDegrees(Number(coords[0]).toFixed(6), Number(coords[1]).toFixed(6), Number(coords[2]).toFixed(2));
    } else if (positions.length > 3) {
        if (withHeight) {
            positions = Cesium.Cartesian3.fromDegreesArrayHeights(coords);
        } else {
            positions = Cesium.Cartesian3.fromDegreesArray(coords);
        }
    }
    this.drawControl.updateGeometry(positions);

    return positions;
};
//文件处理
widget.getGeoJson = function () {
    return this.drawControl.toGeoJSON();
};
widget.jsonToLayer = function (json, isClear, isFly) {
    return this.drawControl.jsonToEntity(json, isClear, isFly);
};
widget.deleteAll = function () {
    this.drawControl.deleteAll();
    this.deleteAllData();
};
widget.deleteEntity = function (id) {
    var entity = this.drawControl.getEntityById(id);
    if (entity == null) return;

    this.delEntity(id);
    this.drawControl.deleteEntity(entity);
};
widget.deleteCurrentEntity = function () {
    var entity = this.drawControl.getCurrentEntity();
    if (entity == null) return;

    this.drawControl.stopDraw(); 
    this.delEntity(entity._attribute.attr.id);
    this.drawControl.deleteEntity(entity);
};
widget.hasEdit = function (val) {
    this.drawControl.hasEdit(val);
};

//数据保存处理
widget.storageName = "marsgis_roamLine",
    widget.arrFlyTable = [],
    widget.getList = function () {
        var that = this;

        var laststorage = haoutil.storage.get(this.storageName); //读取localStorage值 
        if (laststorage != null)
            this.arrFlyTable = eval(laststorage);

        if (this.arrFlyTable == null || this.arrFlyTable.length == 0) {
            this.arrFlyTable = [];

            var that = this;
            $.getJSON("data/fly.json", function (result) {
                that.arrFlyTable = that.arrFlyTable.concat(result);
                that.showData(that.arrFlyTable);
                if (that.viewWindow)
                    that.viewWindow.tableWork.loadData(that.arrFlyTable);
            });
        } else {
            this.showData(this.arrFlyTable);
            if (this.viewWindow)
                this.viewWindow.tableWork.loadData(this.arrFlyTable);
        }
    };
widget.showData = function (arr) { //加载历史保存数据
    var arrjson = [];
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        item.properties.style.show = false;

        var json = {
            type:"Feature",
            properties:item.properties,
            geometry:item.geometry
        };
        json.properties.attr.id = item.id;
        json.properties.attr.name = item.name;

        arrjson.push(json);
    }
    this.drawControl.jsonToEntity({ type:"FeatureCollection", features:arrjson }, true, false);
};
widget.deleteAllData = function () {
    this.arrFlyTable = [];
    haoutil.storage.add(this.storageName, JSON.stringify(this.arrFlyTable));
    if (this.isActivate && this.viewWindow != null)
        this.viewWindow.tableWork.loadData(this.arrFlyTable);
};
widget.delEntity = function (id) {
    for (var index = this.arrFlyTable.length - 1; index >= 0; index--) {
        if (this.arrFlyTable[index].id == id) {
            this.arrFlyTable.splice(index, 1);
            break;
        }
    }
    haoutil.storage.add(this.storageName, JSON.stringify(this.arrFlyTable));
    if (this.isActivate && this.viewWindow != null)
        this.viewWindow.tableWork.loadData(this.arrFlyTable);
};
widget.saveEntity = function (entity) {
    if (entity._attribute.attr.id == null || entity._attribute.attr.id == "")
        entity._attribute.attr.id = (new Date()).format("MMddHHmmss");

    if (entity._attribute.attr.name == null || entity._attribute.attr.name == "")
        entity._attribute.attr.name = '路线' + entity._attribute.attr.id;

    var json = this.drawControl.toGeoJSON(entity);
    var item = {
        id:json.properties.attr.id,
        name:json.properties.attr.name,

        geometry:json.geometry,
        properties:json.properties,
    };

    var isFind = false;
    for (var index = this.arrFlyTable.length - 1; index >= 0; index--) {
        if (this.arrFlyTable[index].id == item.id) {
            isFind = true;
            this.arrFlyTable[index] = item;
            break;
        }
    }

    if (!isFind)
        this.arrFlyTable.push(item);

    haoutil.storage.add(this.storageName, JSON.stringify(this.arrFlyTable));
    if (this.isActivate && this.viewWindow != null)
        this.viewWindow.tableWork.loadData(this.arrFlyTable);
};
widget.toRoamFly = function (data) {
    $("#fly").show();
    $(".mp_box").hide();
    var first=false;
    if(!window.flyWidget){
        first=true;
        window.flyWidget=new fl();
    }
    flyWidget.viewer=this.viewer;
    flyWidget.config={
        data:data
    }
    flyWidget.activate();
    if(first){
        initFlyWidgetView(flyWidget);
    }

    // mars3d.widget.activate({
    //     uri='widgets/roamFly/widget.js',
    //     data=data
    // });
}

function inintViewer(viewer) {
    widget.create(viewer);
    widget.isActivate=true;
    initWidgetView(widget);
    widget.getList();
  
  
}
function close(){
    widget.disable();
    if(window.flyWidget){
        window.flyWidget.disable();
    }

}

