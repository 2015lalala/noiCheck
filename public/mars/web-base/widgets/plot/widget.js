var widget={};

widget.inintViewer=function(viewer){
        var that = this;
        this.viewer=viewer;
        this.viewWindow=window;
        this.drawControl = new mars3d.Draw({
            viewer: this.viewer,
            hasEdit: true,
            dragIcon: 'img/dragIcon.png',
            onStopDrawing  (entity) {
                that.viewWindow.plotlist.plotEnd();
                that.saveEntity(entity);
            },
            onStartEditing  (entity) {
                that.startEditing(entity);
            },
            onChangeEditing  (entity) {
                that.startEditing(entity);
            },
            onStopEditing  (entity) {
                that.stopEditing(entity);
                if (entity != null)
                    that.saveEntity(entity);
            }
        });
    }
    widget.viewWindow= null,
    //每个窗口创建完成后调用
    widget.winCreateOK= function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    widget.activate=function () {
        this.drawControl.hasEdit(true);
    },
    //释放插件
    widget.disable= function () {
        this.viewWindow = null;
        this.drawControl.hasEdit(false);
        //this.deleteAll();
    },

    //开始标记
    widget.startDraw= function (defval) {
        //console.log(JSON.stringify(defval));
        this.drawControl.startDraw(defval);
    },
    widget.startEditingById= function (id) { 
        var entity = this.drawControl.getEntityById(id);
        if (entity == null) return;

        this.viewer.flyTo(entity);
        
        entity.startEditing();
    },
    widget.startEditing= function (entity) {
        var lonlats = this.drawControl.getCoordinates(entity);
        this.viewWindow.plotEdit.startEditing(entity.attribute, lonlats);
    },
    widget.stopEditing= function (layer) {
        if (this.viewWindow)
            this.viewWindow.plotEdit.stopEditing();
    },
    //更新图上的属性
    widget.updateAttr2map= function (attr) {
        this.drawControl.updateAttribute(attr);
    },
    //更新图上的几何形状、坐标等
    widget. updateGeo2map= function (coords, withHeight) {
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

        if (positions.length <= 3) {
            this.centerCurrentEntity();
        }

        return positions;
    },
    widget.centerCurrentEntity= function () {
        var entity = this.drawControl.getCurrentEntity();
        if (entity == null) return;
        this.viewer.flyTo(entity); 
    },
    //文件处理
    widget.getGeoJson= function () {
        return this.drawControl.toGeoJSON();
    },
    widget.jsonToLayer= function (json, isClear, isFly) {
        return this.drawControl.jsonToEntity(json, isClear, isFly);
    },
    widget.deleteAll= function () {
        this.drawControl.deleteAll();
    },
    widget.deleteEntity= function (id) {
        var entity = this.drawControl.getEntityById(id);
        if (entity == null) return;

        this.drawControl.deleteEntity(entity);
    },
    widget.deleteCurrentEntity= function () {
        var entity = this.drawControl.getCurrentEntity();
        if (entity == null) return;

        this.drawControl.deleteCurrentEntity();

        //var that = this;
        //sendAjax({
        //    url: 'kjAirspace/del/' + entity._attribute.attr.id,
        //    type: 'get',
        //    success= function (id) { 
        //    }
        //}); 
    },
    widget.hasEdit= function (val) {
        this.drawControl.hasEdit(val);
    },

    //弹窗属性编辑处理
    widget.last_window_param= null,
    widget.showEditAttrWindow=function (param) {
        this.last_window_param = param;

        //layer.open({
        //    type: 2,
        //    title: '选择数据',
        //    fix: true,
        //    shadeClose: false,
        //    maxmin: true,
        //    area: ["100%", "100%"],
        //    content: "test.html?name=" + param.attrName + "&value=" + param.attrVal,
        //    success= function (layero) {

        //    }
        //});
    },
    widget.saveWindowEdit= function (attrVal) {
        this.viewWindow.plotEdit.updateAttr(this.last_window_param.parname, this.last_window_param.attrName, attrVal);
        layer.close(layer.index);
    },
    widget.getList= function () {
        var that = this;

        $.getJSON(this.path + "testdata/plot.json", function (result) {
            if (!that.isActivate) return;
            that.jsonToLayer(result, true, true);
        });

        //sendAjax({
        //    url: '/kjAirspace/getAll',
        //    type: 'get',
        //    success= function (arr) { 
        //        var arrjson = [];
        //        for (var i = 0; i < arr.length; i++) {
        //            var item = arr[i];
        //            var json = {
        //                type: "Feature",
        //                properties: JSON.parse(item.properties),
        //                geometry: JSON.parse(item.coordinates)
        //            };
        //            json.properties.attr.id = item.id;
        //            json.properties.attr.name = item.name;
        //            json.properties.attr.remark = item.remark;

        //            arrjson.push(json);
        //        }
        //        that.drawControl.jsonToEntity({ type: "FeatureCollection", features: arrjson }, true, false);
        //    }
        //});

    },
    widget.saveEntity= function (entity) {
        entity._attribute.attr.id = (new Date()).format("yyyyMMddHHmmss");

        //var json = this.drawControl.toGeoJSON(entity); 
        //sendAjax({
        //    url: '/kjAirspace/save',
        //    data: {
        //        id: json.properties.attr.id,
        //        name: json.properties.attr.name,
        //        remark: json.properties.attr.remark,
        //        type: json.properties.type,
        //        coordinates: JSON.stringify(json.geometry),
        //        properties: JSON.stringify(json.properties)
        //    },
        //    type: 'post',
        //    success= function (data) {
        //        entity._attribute.attr.id = data;
        //    }
        //});

    },

window.inintViewer=function(viewer){
    
     widget.inintViewer(viewer);
     initWidgetView(widget);     
 }
 window.clear=function(){
     widget.deleteAll();
 }
 window.getdata=function(){
     return widget.getGeoJson();
 }
 window.showdata=function(data){
     widget.jsonToLayer(data,true,false);
 }