/* 2017-11-30 15:04:37 | 修改 木遥（QQ：346819890） */
//模块：
var addmarkerWidget = mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    viewer: null, //框架会自动对map赋值
    options: {
        resources: ['map.css'],
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 300,
                height: 400
            }
        }
    },
    drawControl: null,
    markers: [], //标记点存储器
    label_font_style: "",
    //初始化[仅执行1次]
    create: function () {
        var timetik=-1;

        var that = this;
        this.label_font_style = "normal small-caps normal 17px 黑体";
        this.drawControl = new mars3d.Draw({
            viewer: this.viewer,
            hasEdit: false,
            onStopDrawing: function (entity) {
                that.bindMarkerEx(entity);
            },
            onChangeEditing: function (entity) {
                if (timetik != -1)
                    clearTimeout(timetik);
                timetik = setTimeout(function () {
                    if (entity != null)
                        that.saveEntity(entity);
                }, 600);  
            },
        });

     
         
        //添加到图层控制 
        bindToLayerControl({
            pid: 0,
            name: '我的标记',
            visible: true,
            onAdd: function () {//显示回调
                $(that.markers).each(function (i, item) {
                    that.viewer.entities.add(item);
                });
            },
            onRemove: function () {//隐藏回调
                $(that.markers).each(function (i, item) {
                    that.viewer.entities.remove(item);
                });
            },
            onCenterAt: function (duration) {//定位回调
                that.viewer.flyTo(that.markers, { duration: duration });
            },
        });

        this.getList();
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () { 
        this.hasEdit(true);
    },
    //释放插件
    disable: function () {
        this.viewWindow = null;
        this.stopDraw();
        this.hasEdit(false);
    },
    stopDraw: function () {
        this.drawControl.stopDraw();
    },
    drawPoint: function () {
        this.stopDraw();
        this.drawControl.startDraw({
            type: "billboard",
            style: {
                scale: 1,
                image: this.path + "img/marker.png"
            }
        });
    },
    editable: false,
    hasEdit: function (val) {
        this.editable = val;
        this.drawControl.hasEdit(val);
        this.updateMarkerInhtml();
    }, 
    bindMarkerEx: function (entity) {
        if (entity == null || entity.position == null) return;

        this.markers.push(entity);
        entity.attribute.attr.name = "";
        entity.label = this.getLabelStyle(entity.attribute.attr.name);
    
        entity.billboard.scaleByDistance = new Cesium.NearFarScalar(1.5e2, 1, 8.0e6, 0.2); 
         
        var that = this;
        this.saveEntity(entity, function () {
            entity.popup = {
                html: that.getMarkerInhtml(entity.attribute.attr),
                anchor: [0, -35]
            };
            viewer.mars.popup.show(entity, entity.position._value);
        });
    },
    //========================   
    saveEditFeature: function (id) {
        var currentMarker;
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].attribute.attr.id == id) {
                currentMarker = this.markers[i];
                currentMarker.attribute.attr.name = $.trim($("#addmarker_attr_name").val());
                currentMarker.attribute.attr.remark = $.trim($("#addmarker_attr_remark").val());

                if (currentMarker.attribute.attr.name == "")
                    currentMarker.attribute.attr.name = "我的标记";
                break;
            }
        }

        currentMarker.label.text = currentMarker.attribute.attr.name;
        currentMarker.popup.html = this.getMarkerInhtml(currentMarker.attribute.attr);
        viewer.mars.popup.close();

        this.saveEntity(currentMarker);
    },
    deleteEditFeature: function (id) { 
        var currentMarker;
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].attribute.attr.id == id) {
                currentMarker = this.markers[i];
                this.markers.remove(currentMarker);
                break;
            }
        }
        if (currentMarker)
            this.viewer.entities.remove(currentMarker);

        viewer.mars.popup.close();

        this.viewWindow.refMarkerList();

        //var that = this;
        //sendAjax({
        //    url: 'kjCustomPoint/del/' + id,
        //    type: 'get',
        //    success: function (id) { 
        //    }
        //});
    },
    getMarkerDataList: function () {
        var arr = [];
        for (var i = 0; i < this.markers.length; i++) {
            var currentMarker = this.markers[i];
            arr.push(currentMarker.attribute.attr);
        }
        return arr;
    },
    updateMarkerInhtml: function () {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].popup.html = this.getMarkerInhtml(this.markers[i].attribute.attr);
        }
    },
    getMarkerInhtml: function (attr) {
        var inhtml;
        if (this.editable) {
            if (!attr.name)
                attr.name = "";
            if (!attr.remark)
                attr.remark = "";
            if (!attr.id)
                attr.id = "0";
            inhtml = '<div class="addmarker-popup-titile">添加标记</div><div class="addmarker-popup-content" ><form >' +
				'<div class="form-group">  <label for="addmarker_attr_name">名称</label><input type="text" id="addmarker_attr_name" class="form-control" value="' + attr.name + '" placeholder="请输入标记名称"    /> </div>' +
				'<div class="form-group">  <label for="addmarker_attr_remark">备注</label><textarea id="addmarker_attr_remark" class="form-control" rows="3" style="resize: none;" placeholder="请输入备注（可选填）"   >' + attr.remark + '</textarea></div>' +
				'<div class="form-group" style="text-align: center;"><input type="button" class="btn btn-primary  btn-sm" value="保存" onclick="addmarkerWidget.saveEditFeature(' + attr.id + ')" />' +
				'&nbsp;&nbsp;<input type="button" class="btn btn-danger  btn-sm" value="删除" onclick="addmarkerWidget.deleteEditFeature(' + attr.id + ')" /></div>' +
				'</form></div>';
        } else {
            inhtml = '<div class="addmarker-popup-titile">我的标记</div><div class="addmarker-popup-content" ><form >' +
				'<div class="form-group"><label>名称</label>：' + attr.name + '</div>' +
				'<div class="form-group"><label>备注</label>：' + attr.remark + '</div>' +
				'</form></div>';
        }
        return inhtml;
    },
    centerAt: function (id) {
        var currentMarker;
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].attribute.attr.id == id) {
                currentMarker = this.markers[i];
            }
        }
        if (currentMarker) {
            var position = currentMarker.position.getValue();
            var carto = Cesium.Cartographic.fromCartesian(position);

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height + 2500),
                duration: 3,
                orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 }
            });
        }
    },
    deleteAll: function () {
        for (var i = 0; i < this.markers.length; i++) {
            this.viewer.entities.remove(this.markers[i]);
        }
        this.markers = []; 
        if (this.viewWindow)
        this.viewWindow.refMarkerList();
    },
    getLabelStyle: function (name) {
        return new Cesium.LabelGraphics({
            text: name == "" ? "我的标记" : name,
            font: this.label_font_style,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -40), 
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000)
        });
    },
    getJsonData: function () {
        var data = [];
        for (var i = 0; i < this.markers.length; i++) {
            var attr = this.markers[i].attribute.attr;
            var markerPosition = this.markers[i].position._value;
            var markerCoord = mars3d.draw.utils.getCoordinates([markerPosition]);

            var tempObj = {
                id: attr.id,
                name: attr.name,
                remark: attr.remark,
                x: markerCoord[0][0],
                y: markerCoord[0][1],
                z: markerCoord[0][2]
            };
            data.push(tempObj);
        }

        return JSON.stringify(data);
    },
    jsonToLayer: function (json, isclear) {
        var arr = JSON.parse(json);
        if (arr == null || arr.length == 0) return;
        if (isclear) {
            this.deleteAll();
        }
        var attribute = {
            type: "billboard",
            style: {
                scale: 1,
                image: this.path + "img/marker.png"
            }
        };

        this.markers =  [].concat(this.drawControl.markersInfoToEntity(json, attribute, isclear));
        for (var i = 0; i < this.markers.length; i++) {
            var marker = this.markers[i];
            marker.popup = {
                html: this.getMarkerInhtml(marker.attribute.attr),
                anchor: [0, -35]
            };
            marker.billboard.scaleByDistance = new Cesium.NearFarScalar(1.5e2, 1, 8.0e6, 0.2);
            marker.label = this.getLabelStyle(marker.attribute.attr.name);
        }

        this.viewer.flyTo(this.markers, {
            duration: 2.0
        });
        this.viewWindow.refMarkerList();
    },
    getList: function () {
        this.deleteAll();
        
        //var that = this; 
        //sendAjax({
        //    url: '/kjCustomPoint/getAll',
        //    type: 'get',
        //    success: function (arr) {
        //        var attribute = {
        //            type: "billboard",
        //            style: {
        //                scale: 0.60,
        //                image: that.path + "img/marker.png"
        //            }
        //        };

        //        that.markers = [].concat(that.drawControl.markersInfoToEntity(arr, attribute, true));
        //        for (var i = 0; i < that.markers.length; i++) {
        //            var marker = that.markers[i];
        //            marker.popup = {
        //                html: that.getMarkerInhtml(marker.attribute.attr),
        //                anchor: [0, -25]
        //            };
        //            marker.label = that.getLabelStyle(marker.attribute.attr.name);
        //        }

        //        if (that.viewWindow)
        //            that.viewWindow.refMarkerList();
        //    }
        //});

    },
    saveEntity: function (entity, endfun) {
        //var attr = entity.attribute.attr;
        //var markerPosition = entity.position._value;
        //var markerCoord = mars3d.draw.utils.getCoordinates([markerPosition]);

        //var that = this;
        //sendAjax({
        //    url: '/kjCustomPoint/save',
        //    data: {
        //        id: attr.id == "0" ? "" : attr.id,
        //        name: attr.name,
        //        remark: attr.remark,
        //        x: markerCoord[0][0],
        //        y: markerCoord[0][1],
        //        z: markerCoord[0][2]
        //    },
        //    type: 'post',
        //    success: function (data) {
        //        entity.attribute.attr.id = data;
        //        if (endfun) endfun();
        //        that.viewWindow.refMarkerList();
        //    }
        //});

        entity.attribute.attr.id = this.markers.length + 1;
        if (endfun) endfun();
        this.viewWindow.refMarkerList();

    },




}));