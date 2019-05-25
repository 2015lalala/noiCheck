(function (modules) { // webpackBootstrap
    // The module cache
    var installedModules = {};

    // The require function
    function __webpack_require__(moduleId) {

        // Check if module is in cache
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache)
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };

        // Execute the module function
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded
        module.l = true;

        // Return the exports of the module
        return module.exports;
    }


    // expose the modules object (__webpack_modules__)
    __webpack_require__.m = modules;

    // expose the module cache
    __webpack_require__.c = installedModules;

    // identity function for calling harmony imports with the correct context
    __webpack_require__.i = function (value) { return value; };

    // define getter function for harmony exports
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };

    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

    // __webpack_public_path__
    __webpack_require__.p = "";

    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = 59);
})
/************************************************************************/
([
/* 0 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 15:28:45 | 修改 木遥（QQ：346819890） */
    var drawutils = {
        /**
         * 创建Dragger拖动点的公共方法
         */
        createDragger: function (dataSource, options) {
            var dragger;
            if (options.dragger) {
                dragger = options.dragger;
            } else {
                var position = Cesium.defaultValue(options.position, Cesium.Cartesian3.ZERO);
                var icon = Cesium.defaultValue(options.dragIcon, "dragIcon.png");
                dragger = dataSource.entities.add({
                    position: position,
                    billboard: {
                        scale: 1,
                        heightReference: options.heightReference ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE,
                        image: icon
                    }
                });
            }

            dragger._isDragger = true;
            dragger.onDrag = Cesium.defaultValue(options.onDrag, null);
            dragger.horizontal = Cesium.defaultValue(options.horizontal, true);
            dragger.vertical = Cesium.defaultValue(options.vertical, false);
            dragger.verticalCtrl = Cesium.defaultValue(options.vertical, false);

            return dragger;
        },
        /**
         * 将Cartesian坐标数组  转换为  经纬度坐标数组
         * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
         */
        getCoordinates: function (positions) {
            var coordinates = [];
            for (var i = 0; i < positions.length; i++) {
                var carto = Cesium.Cartographic.fromCartesian(positions[i]);

                var lng = Number(Cesium.Math.toDegrees(carto.longitude).toFixed(6));
                var lat = Number(Cesium.Math.toDegrees(carto.latitude).toFixed(6));
                var height = Number(carto.height.toFixed(1));

                coordinates.push([lng, lat, height]);
            }
            return coordinates;
        },
        /**
         * 获取坐标数组中最高高程值
         * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
         * @param {Number} defaultVal 默认高程值
         */
        getMaxHeightForPositions: function (positions, defaultVal) {
            if (defaultVal == null) defaultVal = 0;

            var maxHeight = defaultVal;
            if (positions == null || positions.length == 0) return maxHeight;

            var extrudedPosition = positions[0];
            for (var i = 0; i < positions.length; i++) {
                var tempCarto = Cesium.Cartographic.fromCartesian(positions[i]);
                if (tempCarto.height > maxHeight) {
                    maxHeight = tempCarto.height;
                }
            }
            return maxHeight;
        },
        /**
         * 设定带有高度的坐标,参数positions为Cartesian3类型,返回类型为Cartesian3类型(的数组)
         * @param {Array} positions Cartesian3类型的数组
         * @param {Number} height 高度值
         * @return {Array} Cartesian3类型的数组
         */
        getPositionsWithHeight: function (positions, height) {
            console.log("aaaa---");
            if (positions instanceof Array) {
                var lonlats = [];
                for (var i = 0; i < positions.length; i++) {
                    var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions[i]);
                    var tempcarto = {
                        lon: Cesium.Math.toDegrees(cartographic.longitude),
                        lat: Cesium.Math.toDegrees(cartographic.latitude),
                        hgt: Math.ceil(Number(cartographic.height) + Number(height))
                    };
                    var lonlat = ([tempcarto.lon, tempcarto.lat, tempcarto.hgt]);
                    lonlats = lonlats.concat(lonlat);
                }
                return Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
            } else {
                var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions);
                var lon = Cesium.Math.toDegrees(cartographic.longitude);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                return Cesium.Cartesian3.fromDegrees(lon, lat, Number(cartographic.height) + Number(height));
            }
        },

        /**
         * 带有高度差的两点，判断其直角点
         * @param {Cartesian3} cartesian1
         * @param {Cartesian3} cartesian2
         * @return {Cartesian3}
         */
        getZHeightPosition: function (cartesian1, cartesian2) {
            var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
            var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
            var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
            var height1 = Number(carto1.height.toFixed(2));

            var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
            var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
            var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
            var height2 = Number(carto2.height.toFixed(2));

            if (height1 > height2)
                return Cesium.Cartesian3.fromDegrees(lng2, lat2, height1);
            else
                return Cesium.Cartesian3.fromDegrees(lng1, lat1, height2)
        },

        /**
         * 带有高度差的两点，计算两点间的水平距离
         * @param {Cartesian3} cartesian1
         * @param {Cartesian3} cartesian2
         * @return {Number}
         */
        getHDistance: function (cartesian1, cartesian2) {
            var zCartesian = this.getZHeightPosition(cartesian1, cartesian2);

            var carto1 = Cesium.Cartographic.fromCartesian(cartesian2);
            var cartoZ = Cesium.Cartographic.fromCartesian(zCartesian);

            var hDistance = Cesium.Cartesian3.distance(cartesian1, zCartesian);

            if (Math.abs(Number(cartoZ.height) - Number(carto1.height)) < 0.01) {
                hDistance = Cesium.Cartesian3.distance(cartesian2, zCartesian);
            }

            return hDistance;
        },

        /**
         * 计算两点之间的中点
         * @param {Cartesian3} cartesian1
         * @param {Cartesian3} cartesian2
         * @return {Cartesian3}
         */
        getMidPosition: function (cartesian1, cartesian2) {
            var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
            var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
            var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
            var height1 = Number(carto1.height.toFixed(2));

            var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
            var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
            var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
            var height2 = Number(carto2.height.toFixed(2));

            var newLng = (lng1 + lng2) / 2;
            var newLat = (lat1 + lat2) / 2;
            var newHeight = (height1 + height2) / 2;

            return Cesium.Cartesian3.fromDegrees(newLng, newLat, newHeight)
        },

        getPositionsFromJson: function (geometry) {
            if (!geometry) {
                return null;
            }
            switch (geometry.type) {
                case 'Point':
                    return this.lonLatToCartesian(geometry.coordinates[0]);
                case 'MultiPoint':
                    return this.lonLatsToCartesians(geometry.coordinates);
                case 'LineString':
                    return this.lonLatsToCartesians(geometry.coordinates);
                case "MultiLineString":
                    return this.lonLatsToCartesians(geometry.coordinates[0]);
                case 'Polygon':
                    return this.lonLatsToCartesians(geometry.coordinates[0]);
                case 'MultiPolygon':
                    return this.lonLatsToCartesians(geometry.coordinates[0][0]);
                default:
                    throw new Error('Invalid GeoJSON object.');
            }
        },

        /**
         * 根据单个经纬度坐标值数组,求出笛卡尔坐标
         * @param {Array} [coords=[longitude,latitude,height]] 值数组
         * @return {Cartesian3}
         */
        lonLatToCartesian: function (coords) {
            return Cesium.Cartesian3.fromDegrees(Number(coords[0]), Number(coords[1]), Number(coords[2] || 0));
        },

        /**
         * 根据多个经纬度坐标值数组,求出笛卡尔坐标
         * @param {Array} [coords=[[longitude,latitude,height],[longitude,latitude,height],...]]
         * @return {Array} Cartesian3类型的数组
         */
        lonLatsToCartesians: function (coords) {
            var lonlats = [];
            for (var i = 0; i < coords.length; i++) {
                var lonlat = [Number(coords[i][0]), Number(coords[i][1]), Number(coords[i][2] || 0)];
                lonlats = lonlats.concat(lonlat);
            }
            return Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
        },

        //格式化为业务格式数据
        normalizeJsonData: function (businessData) {
            var jsonData = {};
            jsonData.type = "FeatureCollection";
            jsonData.features = [];
            var _businessData;
            if (typeof businessData == "string") {
                _businessData = JSON.parse(businessData);
            } else
                _businessData = businessData;
            if (_businessData instanceof Array) {
                for (var i = 0; i < _businessData.length; i++) {
                    var tempObj = {
                        type: "Feature"
                    };
                    tempObj.properties = _businessData[i].properties || _businessData[i].PROPERTIES;
                    tempObj.geometry = _businessData[i].geometry || _businessData[i].GEOMETRY;
                    jsonData.features.push(tempObj);
                }
                return JSON.stringify(jsonData);
            } else if (businessData.features && (businessData.features instanceof Array)) {
                return businessData;
            }
        },
        //格式化为geojson数据
        normalizeBusinessData: function (jsonData) {
            var jsonObjs = {};
            try {
                jsonObjs = JSON.parse(jsonData);
            } catch (e) {
                haoutil.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
                return;
            }
            var features = jsonObjs.features;
            var terminalObjs = [];
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var tempObj = {
                    dataID: feature.properties.attr.id,
                    dataType: feature.properties.attr.type,
                    properties: feature.properties,
                    geometry: feature.geometry
                };
                terminalObjs.push(tempObj);
            }
            return JSON.stringify(terminalObjs);
        },

    };

    /* harmony default export */ __webpack_exports__["default"] = (drawutils);

    /***/
}),
/* 1 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 11:29:57 | 修改 木遥（QQ：346819890） */
    /**
     * A {@link Property} whose value does not change with respect to simulation time.
     *
     * @alias DynamicProperty
     * @constructor
     *
     * @param {Object} [value] The property value.
     *
     * @see DynamicProperty
     *
     * @exception {DeveloperError} value.clone is a required function.
     * @exception {DeveloperError} value.equals is a required function.
     */
    var DynamicProperty = function (value) {
        this._value = undefined;
        this._hasClone = false;
        this._hasEquals = false;
        this._definitionChanged = new Cesium.Event();
        this._constant = false;
        this.setValue(value);
    };

    Cesium.defineProperties(DynamicProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.
         * This property always returns <code>true</code>.
         * @memberof DynamicProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant: {
            get: function () {
                return this._constant;
            },
            set: function (value) {
                if (this._constant !== value) {
                    this._constant = value;
                    this._definitionChanged.raiseEvent(this);
                }
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever setValue is called with data different
         * than the current value.
         * @memberof DynamicProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        }
    });

    /**
     * Gets the value of the property.
     *
     * @param {JulianDate} [time] The time for which to retrieve the value.  This parameter is unused since the value does not change with respect to time.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    DynamicProperty.prototype.getValue = function (time, result) {
        return this._hasClone ? this._value.clone(result) : this._value;
    };

    /**
     * Sets the value of the property.
     *
     * @param {Object} value The property value.
     *
     * @exception {DeveloperError} value.clone is a required function.
     * @exception {DeveloperError} value.equals is a required function.
     */
    DynamicProperty.prototype.setValue = function (value) {
        var oldValue = this._value;
        if (oldValue !== value) {
            var isDefined = Cesium.defined(value);
            var hasClone = isDefined && typeof value.clone === 'function';
            var hasEquals = isDefined && typeof value.equals === 'function';

            this._hasClone = hasClone;
            this._hasEquals = hasEquals;

            var changed = !hasEquals || !value.equals(oldValue);
            if (changed) {
                this._value = !hasClone ? value : value.clone();
                this._definitionChanged.raiseEvent(this);
            }
        }
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    DynamicProperty.prototype.equals = function (other) {
        return this === other || //
               (other instanceof DynamicProperty && //
                ((!this._hasEquals && (this._value === other._value)) || //
                (this._hasEquals && this._value.equals(other._value))));
    };

    DynamicProperty.prototype.valueOf = function (other) {
        return this._value;
    };

    DynamicProperty.prototype.toString = function (other) {
        return String(this._value);
    };


    /* harmony default export */ __webpack_exports__["default"] = (DynamicProperty);

    /***/
}),
/* 2 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:18 | 修改 木遥（QQ：346819890） */
    var BaseLayer = L.Class.extend({
        config: {},     //配置的config信息 
        viewer: null,
        initialize: function (cfg, viewer) {
            this.viewer = viewer;
            this.config = cfg;

            this.name = cfg.name;
            if (this.config.alpha)
                this._opacity = this.config.alpha;

            this.create();
            if (cfg.visible)
                this.setVisible(true);
            else
                this._visible = false;

            if (cfg.visible && cfg.flyTo) {
                this.centerAt(0);
            }
        },
        create: function () {

        },
        showError: function (title, error) {
            if (!error) error = '未知错误';

            if (this.viewer)
                this.viewer.cesiumWidget.showErrorPanel(title, undefined, error);

            console.log('layer错误:' + title + error);
        },
        //显示隐藏控制
        _visible: null,
        getVisible: function () {
            return this._visible;
        },
        setVisible: function (val) {
            if (this._visible != null && this._visible == val) return;
            this._visible = val;

            if (val)
                this.add();
            else
                this.remove();
        },
        //添加 
        add: function () {
            this._visible = true;

            if (this.config.onAdd) {
                this.config.onAdd();
            }
        },
        //移除
        remove: function () {
            this._visible = false;

            if (this.config.onRemove) {
                this.config.onRemove();
            }
        },
        //定位至数据区域
        centerAt: function (duration) {
            if (this.config.extent || this.config.center) {
                this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
            }
            else if (this.config.onCenterAt) {
                this.config.onCenterAt(duration);
            }
        },
        hasOpacity: false,
        //设置透明度
        setOpacity: function (value) {
            if (this.config.onSetOpacity) {
                this.config.onSetOpacity(value);
            }
        },
        hasZIndex: false,
        //设置叠加顺序
        setZIndex: function (value) {
            if (this.config.onSetZIndex) {
                this.config.onSetZIndex(value);
            }
        },


    });

    /* harmony default export */ __webpack_exports__["default"] = (BaseLayer);

    /***/
}),
/* 3 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentMousePosition", function () { return getCurrentMousePosition; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCenter", function () { return getCenter; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExtent", function () { return getExtent; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCameraView", function () { return getCameraView; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatPositon", function () { return formatPositon; });


    //格式化坐标点为可显示的可理解格式（如：经度x:123.345345、纬度y:31.324324、高度z:123.1）。
    function formatPositon(position) {
        var carto = Cesium.Cartographic.fromCartesian(position);
        var result = {};
        result.y = Number(Cesium.Math.toDegrees(carto.latitude).toFixed(6));
        result.x = Number(Cesium.Math.toDegrees(carto.longitude).toFixed(6));
        result.z = Number(carto.height.toFixed(1));
        return result;
    }



    /**
     * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
     * @param {Cesium.Scene} scene 
     * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
     */
    function getCurrentMousePosition(scene, position) {
        var cartesian;

        //在模型上提取坐标
        var pickobject = scene.pick(position); //取模型
        if (scene.pickPositionSupported && Cesium.defined(pickobject)) {   //!scene.pickPositionSupported : 不支持深度拾取,无法进行鼠标交互绘制
            cartesian = scene.pickPosition(position);
            if (cartesian) {
                var pgeo = scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                if (pgeo.height > 0)
                    return cartesian;
            }
        }

        //提取鼠标点的地理坐标
        var pickRay = scene.camera.getPickRay(position);
        cartesian = scene.globe.pick(pickRay, scene);
        return cartesian;
    }

    //提取地球中心点坐标
    function getCenter(viewer, isToWgs) {
        var scene = viewer.scene;
        var target = pickCenterPoint(scene);
        var bestTarget = target;
        if (!bestTarget) {
            var globe = scene.globe;
            var carto = scene.camera.positionCartographic.clone();
            var height = globe.getHeight(carto);
            carto.height = height || 0;
            bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        }
        var result = formatPositon(bestTarget);
        if (isToWgs)
            result = viewer.mars.point2wgs(result); //坐标转换为wgs

        return result;
    }
    function pickCenterPoint(scene) {
        var canvas = scene.canvas;
        var center = new Cesium.Cartesian2(
            canvas.clientWidth / 2,
            canvas.clientHeight / 2);

        var ray = scene.camera.getPickRay(center);
        var target = scene.globe.pick(ray, scene);
        return target || scene.camera.pickEllipsoid(center);
    }

    //提取地球视域边界
    function getExtent(viewer, isToWgs) {
        // 范围对象
        var extent = { xmin: 70, xmax: 140, ymin: 0, ymax: 55 }; //默认值：中国区域

        // 得到当前三维场景
        var scene = viewer.scene;

        // 得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var canvas = scene.canvas;

        // canvas左上角
        var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
        if (car3_lt) {// 在椭球体上
            var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
            extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
        }
        else {// 不在椭球体上 
            var xMax = canvas.width / 2;
            var yMax = canvas.height / 2;

            var car3_lt2;
            // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
            for (var yIdx = 0 ; yIdx <= yMax; yIdx += 10) {
                var xIdx = yIdx <= xMax ? yIdx : xMax;
                car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
                if (car3_lt2) break;
            }
            if (car3_lt2) {
                var carto_lt = ellipsoid.cartesianToCartographic(car3_lt2);
                extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
                extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
            }
        }

        // canvas右下角
        var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);
        if (car3_rb) {   // 在椭球体上
            var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
            extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
        }
        else {// 不在椭球体上
            var xMax = canvas.width / 2;
            var yMax = canvas.height / 2;

            var car3_rb2;
            // 这里每次10像素递减，一是10像素相差不大，二是为了提高程序运行效率
            for (var yIdx = canvas.height ; yIdx >= yMax; yIdx -= 10) {
                var xIdx = yIdx >= xMax ? yIdx : xMax;
                car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
                if (car3_rb2) break;
            }
            if (car3_rb2) {
                var carto_rb = ellipsoid.cartesianToCartographic(car3_rb2);
                extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
                extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
            }
        }

        if (isToWgs) {//坐标转换为wgs
            var pt1 = viewer.mars.point2wgs({ x: extent.xmin, y: extent.ymin });
            extent.xmin = pt1.x;
            extent.ymin = pt1.y;

            var pt2 = viewer.mars.point2wgs({ x: extent.xmax, y: extent.ymax });
            extent.xmax = pt2.x;
            extent.ymax = pt2.y;
        }

        return extent;
    }

    //提取相机视角范围参数 
    function getCameraView(viewer, isToWgs) {
        var camera = viewer.camera;
        var position = camera.positionCartographic;

        var bookmark = {};
        bookmark.y = Number(Cesium.Math.toDegrees(position.latitude).toFixed(6));
        bookmark.x = Number(Cesium.Math.toDegrees(position.longitude).toFixed(6));
        bookmark.z = Number(position.height.toFixed(1));
        bookmark.heading = Number(Cesium.Math.toDegrees(camera.heading).toFixed(1));
        bookmark.pitch = Number(Cesium.Math.toDegrees(camera.pitch).toFixed(1));
        bookmark.roll = Number(Cesium.Math.toDegrees(camera.roll).toFixed(1));

        if (isToWgs)
            bookmark = viewer.mars.point2wgs(bookmark); //坐标转换为wgs

        return bookmark;
    }




    /***/
}),
/* 4 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */

    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(9).default

    var BillboardControl = {
        typename: "billboard",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);


            var entity = dataSource.entities.add({
                billboard: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};

            if (entityattr == null) {
                //默认值
                entityattr = {
                    scale: 1,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                }
            }


            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "scaleByDistance_near":     //跳过扩展其他属性的参数
                    case "scaleByDistance_nearValue":
                    case "scaleByDistance_far":
                    case "scaleByDistance_farValue":
                    case "distanceDisplayCondition_far":
                    case "distanceDisplayCondition_near":
                        break;
                    case "opacity":    //透明度
                        entityattr.color = new Cesium.Color.fromCssColorString("#FFFFFF")
                                  .withAlpha(Number(value || 1.0));
                        break;
                    case "rotation":   //旋转角度
                        entityattr.rotation = Cesium.Math.toRadians(value);
                        break;
                    case "scaleByDistance":   //是否按视距缩放
                        if (value) {
                            entityattr.scaleByDistance = new Cesium.NearFarScalar(
                                Number(attribute.style.scaleByDistance_near || 1000),
                                Number(attribute.style.scaleByDistance_nearValue || 1.0),
                                Number(attribute.style.scaleByDistance_far || 1000000),
                                Number(attribute.style.scaleByDistance_farValue || 0.1));
                        } else {
                            entityattr.scaleByDistance = null;
                        }
                        break;
                    case "distanceDisplayCondition":   //是否按视距显示
                        if (value) {
                            entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
                                Number(attribute.style.distanceDisplayCondition_near || 0),
                                Number(attribute.style.distanceDisplayCondition_far || 100000));
                        } else {
                            entityattr.distanceDisplayCondition = null;
                        }
                        break;
                }
            }


            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, position) {
            entity.position = new _DynamicProperty(position);
        },
        getPositions: function (entity) {
            return [entity.position._value];
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: { type: "Point", coordinates: coordinates }
            };
        }
    };


    /* harmony default export */ __webpack_exports__["default"] = (BillboardControl);

    /***/
}),
/* 5 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(9).default


    var LabelControl = {
        typename: "label",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                //name: 'Entity ' + arrEntity.length,
                label: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                //默认值
                entityattr = {
                    scale: 1.0,
                    //disableDepthTestDistance:Number.POSITIVE_INFINITY,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                };
            }

            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "font_style":    //跳过扩展其他属性的参数
                    case "font_weight":
                    case "font_size":
                    case "font_family":
                    case "text":
                    case "scaleByDistance_near":
                    case "scaleByDistance_nearValue":
                    case "scaleByDistance_far":
                    case "scaleByDistance_farValue":
                    case "distanceDisplayCondition_far":
                    case "distanceDisplayCondition_near":
                        break;
                    case "color": //颜色
                        entityattr.fillColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;

                    case "border": //是否衬色
                        entityattr.style = (value ? Cesium.LabelStyle.FILL_AND_OUTLINE : Cesium.LabelStyle.FILL);
                        break;
                    case "border_color":    //衬色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "border_width":
                        entityattr.outlineWidth = value;
                        break;
                    case "background": //是否背景色
                        entityattr.showBackground = value;
                        break;
                    case "background_color": //背景色
                        entityattr.backgroundColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "pixelOffset": //偏移量
                        entityattr.pixelOffset = new Cesium.Cartesian2(attribute.style.pixelOffset[0], attribute.style.pixelOffset[1]);
                        break;
                    case "scaleByDistance":   //是否按视距缩放
                        if (value) {
                            entityattr.scaleByDistance = new Cesium.NearFarScalar(
                                Number(attribute.style.scaleByDistance_near || 1000),
                                Number(attribute.style.scaleByDistance_nearValue || 1.0),
                                Number(attribute.style.scaleByDistance_far || 1000000),
                                Number(attribute.style.scaleByDistance_farValue || 0.1));
                        } else {
                            entityattr.scaleByDistance = null;
                        }
                        break;
                    case "distanceDisplayCondition":   //是否按视距显示
                        if (value) {
                            entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
                                Number(attribute.style.distanceDisplayCondition_near || 0),
                                Number(attribute.style.distanceDisplayCondition_far || 100000));
                        } else {
                            entityattr.distanceDisplayCondition = null;
                        }
                        break;
                }
            }


            //文字内容
            entityattr.text = (attribute.style.text || '文字').replace(new RegExp("<br />", "gm"), "\n");

            //样式（倾斜、加粗等）
            var fontStyle = (attribute.style.font_style || "normal") + " small-caps "
                + (attribute.style.font_weight || "normal") + " " +
                (attribute.style.font_size || "30") + "px " + (attribute.style.font_family || "黑体");
            entityattr.font = fontStyle;

            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, position) {
            entity.position = new _DynamicProperty(position);
        },
        getPositions: function (entity) {
            return [entity.position._value];
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: {
                    type: "Point",
                    coordinates: coordinates
                }
            };
        }

    };


    /* harmony default export */ __webpack_exports__["default"] = (LabelControl);

    /***/
}),
/* 6 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor1 = __webpack_require__(30).default
    var _Editor2 = __webpack_require__(31).default


    var PolygonControl = {
        typename: "polygon",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                //name: 'Entity ' + arrEntity.length,
                polygon: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                entityattr = {
                    fill: true,
                    classificationType: Cesium.ClassificationType.BOTH,
                    hierarchy: new _DynamicProperty([])
                }
            }

            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "opacity":     //跳过扩展其他属性的参数
                    case "outlineOpacity":
                        break;
                    case "outlineColor":    //边框颜色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                        break;
                    case "color":   //填充颜色
                        entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "extrudedHeight":  //高度 
                        var maxHight = _drawutils.getMaxHeightForPositions(entityattr.hierarchy._value);
                        entityattr.extrudedHeight = Number(value) + maxHight;
                        break;
                    case "clampToGround"://贴地
                        entityattr.perPositionHeight = !value;
                        break;
                }
            }

            //如果未设置任何material，默认设置随机颜色
            if (attribute.style.color == null) {
                entityattr.material = Cesium.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: Number(attribute.style.opacity || 1.0)
                });
            }

            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            if (entity.polygon.extrudedHeight) {
                return new _Editor1(dataSource, entity, options);
            } else {
                return new _Editor2(dataSource, entity, options);
            }
        },
        setPositions: function (entity, position) {
            entity.polygon.hierarchy = new _DynamicProperty(position);
            if (entity.attribute.style.extrudedHeight) {
                //存在extrudedHeight高度设置时
                var maxHight = _drawutils.getMaxHeightForPositions(position);
                entity.polygon.extrudedHeight = maxHight + Number(entity.attribute.style.extrudedHeight);
            }
        },
        getPositions: function (entity) {
            var arr = entity.polygon.hierarchy._value;

            if (arr.positions && this.isArray(arr.positions))
                return arr.positions;
            return arr;
        },
        isArray: function (obj) {
            return (typeof obj == 'object') && obj.constructor == Array;
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            if (coordinates.length > 0) {
                var first = coordinates[0];
                var last = coordinates[coordinates.length - 1];
                if (first[0] != last[0] || first[1] != last[1] || first[2] != last[2]) {
                    coordinates.push(first);
                }
            }

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: {
                    type: "Polygon",
                    coordinates: [coordinates]
                }
            };
        }

    };


    /* harmony default export */ __webpack_exports__["default"] = (PolygonControl);

    /***/
}),
/* 7 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRequest", function () { return getRequest; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRequestByName", function () { return getRequestByName; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumber", function () { return isNumber; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function () { return isString; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPCBroswer", function () { return isPCBroswer; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clone", function () { return clone; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "webglreport", function () { return webglreport; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "terrainPolyline", function () { return terrainPolyline; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createModel", function () { return createModel; });
    /* 2017-9-18 15:04:56 | 修改 木遥（QQ：346819890） */
    function isNumber(obj) {
        return (typeof obj == 'number') && obj.constructor == Number;
    }

    function isString(str) {
        return (typeof str == 'string') && str.constructor == String;
    }


    //url参数获取
    function getRequest() {
        var url = location.search; //获取url中"?"符后的字串   
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    function getRequestByName(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    //function clone(from, to) {
    //    if (from == null || typeof from != "object") return from;
    //    if (from.constructor != Object && from.constructor != Array) return from;
    //    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
    //        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
    //        return new from.constructor(from);

    //    to = to || new from.constructor();

    //    for (var name in from) {
    //        to[name] = typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
    //    }

    //    return to;
    //}
    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (typeof obj === 'object') {
            var copy = {};
            for (var attr in obj) {
                if (attr == "_layer" || attr == "_layers" || attr == "_parent") continue;

                if (obj.hasOwnProperty(attr))
                    copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        return obj;
    }


    function isPCBroswer() {
        var sUserAgent = navigator.userAgent.toLowerCase();

        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return false;
        } else {
            return true;
        }
    }

    //检测浏览器webgl支持
    function webglreport() {
        var exinfo = haoutil.system.getExplorerInfo();
        if (exinfo.type == "IE" && exinfo.version < 11) {
            return false;
        }

        try {
            var glContext;
            var canvas = document.createElement('canvas');
            var requestWebgl2 = (typeof WebGL2RenderingContext !== 'undefined');
            if (requestWebgl2) {
                glContext = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2') || undefined;
            }
            if (glContext == null) {
                glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || undefined;
            }
            if (glContext == null) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    //计算贴地路线
    function terrainPolyline(params) {
        var viewer = params.viewer;
        var positions = params.positions;
        if (positions == null || positions.length == 0) {
            if (params.calback)
                params.calback(positions);
            return;
        }

        var flatPositions = Cesium.PolylinePipeline.generateArc({
            positions: positions,
            granularity: params.granularity || 0.00001
        });


        var cartographicArray = [];
        var ellipsoid = viewer.scene.globe.ellipsoid;
        for (var i = 0; i < flatPositions.length; i += 3) {
            var cartesian = Cesium.Cartesian3.unpack(flatPositions, i);
            cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
        }

        //用于缺少地形数据时，赋值的高度
        var tempHeight = Cesium.Cartographic.fromCartesian(positions[0]).height;

        Cesium.when(Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, cartographicArray), function (samples) {
            var noHeight = false;
            var offset = params.offset || 2; //增高高度，便于可视

            for (var i = 0; i < samples.length; ++i) {
                if (samples[i].height == null) {
                    noHeight = true;
                    samples[i].height = tempHeight;
                }
                else {
                    samples[i].height = offset + (samples[i].height * viewer.scene._terrainExaggeration);
                }
            }

            var raisedPositions = ellipsoid.cartographicArrayToCartesianArray(samples);
            if (params.calback)
                params.calback(raisedPositions, noHeight);
            else if (positions.setValue)
                positions.setValue(raisedPositions);
        });


    }


    //创建模型
    function createModel(cfg, viewer) {
        cfg = viewer.mars.point2map(cfg);//转换坐标系

        var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
        var heading = Cesium.Math.toRadians(cfg.heading || 0)
        var pitch = Cesium.Math.toRadians(cfg.pitch || 0)
        var roll = Cesium.Math.toRadians(cfg.roll || 0);
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        var model = viewer.entities.add({
            name: cfg.name || "",
            position: position,
            orientation: orientation,
            model: cfg,
            tooltip: cfg.tooltip,
            popup: cfg.popup,
        });
        return model;
    }

    //===========模块对外公开的属性及方法=========


    /***/
}),
/* 8 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 11:29:45 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(32).default



    var PolylineControl = {
        typename: "polyline",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                //name: 'Entity ' + arrEntity.length,
                polyline: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                entityattr = {
                    followSurface: true,
                    positions: new _DynamicProperty([])
                }
            }


            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "lineType":    //跳过扩展其他属性的参数
                    case "color":
                    case "opacity":
                    case "outline":
                    case "outlineWidth":
                    case "outlineColor":
                    case "outlineOpacity":
                        break;
                }
            }

            var color = new Cesium.Color.fromCssColorString(attribute.style.color || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));

            switch (attribute.style.lineType) {
                default:
                case "solid"://实线

                    if (attribute.style.outline) {
                        //存在衬色时
                        entityattr.material = new Cesium.PolylineOutlineMaterialProperty({
                            color: color,
                            outlineWidth: Number(attribute.style.outlineWidth || 1.0),
                            outlineColor: new Cesium.Color.fromCssColorString(attribute.style.outlineColor || "#FFFF00")
                                .withAlpha(Number(attribute.style.outlineOpacity || attribute.style.opacity || 1.0))
                        });
                    } else {
                        entityattr.material = color;
                    }
                    break;
                case "dash"://虚线
                    entityattr.material = new Cesium.PolylineDashMaterialProperty({
                        color: color
                    })
                    break;
            }




            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, positions) {
            entity.polyline.positions.setValue(positions);
        },
        getPositions: function (entity) {
            return entity.polyline.positions._value;
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: {
                    type: "LineString",
                    coordinates: coordinates
                }
            };
        }
    };


    /* harmony default export */ __webpack_exports__["default"] = (PolylineControl);

    /***/
}),
/* 9 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-9 15:37:42 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default

    /**
     * An editor that allows you to edit an Point
     */
    var PointEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var dragger = _drawutils.createDragger(this.dataSource, {
            dragger: entity,
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, entity.position._value, diff);
                entity.position._value = newPosition;

                entity.changeEditing();
            }
        });
        //this.draggers.push(dragger);
    };

    PointEditor.prototype.updateDraggers = function () {

    };

    PointEditor.prototype.destroy = function () {
        this.draggers = [];
    };


    /* harmony default export */ __webpack_exports__["default"] = (PointEditor);

    /***/
}),
/* 10 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-29 09:26:29 | 修改 木遥（QQ：346819890） */
    var _util = __webpack_require__(7)
    var _BaseLayer = __webpack_require__(2).default;

    var _BillboardControl = __webpack_require__(4).default
    var _LabelControl = __webpack_require__(5).default
    var _PolylineControl = __webpack_require__(8).default
    var _PolygonControl = __webpack_require__(6).default

    var GeoJsonLayer = _BaseLayer.extend({
        dataSource: null,
        //添加 
        add: function () {
            if (this.dataSource) {
                this.viewer.dataSources.add(this.dataSource);
            }
            else {
                this.queryData();
            }
        },
        //移除
        remove: function () {
            this.viewer.dataSources.remove(this.dataSource);
        },
        //定位至数据区域
        centerAt: function (duration) {
            if (this.config.extent || this.config.center) {
                this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
            }
            else {
                if (this.dataSource == null) return;
                //this.viewer.zoomTo(this.dataSource.entities.values); 
                this.viewer.flyTo(this.dataSource.entities.values, { duration: duration });
            }
        },
        //设置透明度
        hasOpacity: true,
        _opacity: 0.9,
        setOpacity: function (value) {
            this._opacity = value;
            if (this.dataSource == null) return;

            var entities = this.dataSource.entities.values;
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];

                if (entity.polygon && entity.polygon.material && entity.polygon.material.color) {
                    this._updatEntityAlpha(entity.polygon.material.color, this._opacity);
                    if (entity.polygon.outlineColor) {
                        this._updatEntityAlpha(entity.polygon.outlineColor, this._opacity);
                    }
                }
                else if (entity.polyline && entity.polyline.material && entity.polyline.material.color) {
                    this._updatEntityAlpha(entity.polyline.material.color, this._opacity);
                }
                else if (entity.billboard) {
                    entity.billboard.color = new Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity);

                    if (entity.label) {
                        if (entity.label.fillColor)
                            this._updatEntityAlpha(entity.label.fillColor, this._opacity);
                        if (entity.label.outlineColor)
                            this._updatEntityAlpha(entity.label.outlineColor, this._opacity);
                        if (entity.label.backgroundColor)
                            this._updatEntityAlpha(entity.label.backgroundColor, this._opacity);
                    }
                }
            }
        },
        _updatEntityAlpha: function (color, opacity) {
            var newclr = color.getValue().withAlpha(opacity);
            color.setValue(newclr);
        },
        queryData: function () {
            var that = this;

            var dataSource = Cesium.GeoJsonDataSource.load(this.config.url, {
                clampToGround: true
            });
            dataSource.then(function (dataSource) {
                that.showResult(dataSource);

            }).otherwise(function (error) {
                that.showError("服务出错", error);
            });
        },
        showResult: function (dataSource) {
            var that = this;

            this.dataSource = dataSource;
            this.viewer.dataSources.add(dataSource);

            if (this.config.flyTo)
                this.centerAt();

            //===========设置样式============= 
            var entities = dataSource.entities.values;
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];

                //样式

                if (this.config.symbol) {
                    if (this.config.symbol == "default")
                        this.setDefSymbol(entity);
                    else
                        this.setConfigSymbol(entity, this.config.symbol);
                }

                //popup弹窗
                if (this.config.columns || this.config.popup) {
                    entity.popup = {
                        html: function (entity) {
                            var attr = that.getEntityAttr(entity);
                            if (_util.isString(attr))
                                return attr;
                            else
                                return that.viewer.mars.popup.getPopupForConfig(that.config, attr);
                        },
                        anchor: this.config.popupAnchor || [0, -15],
                    };
                }
                if (this.config.tooltip) {
                    entity.tooltip = {
                        html: function (entity) {
                            var attr = that.getEntityAttr(entity);
                            if (_util.isString(attr))
                                return attr;
                            else
                                return that.viewer.mars.popup.getPopupForConfig({ popup: that.config.tooltip }, attr);
                        },
                        anchor: this.config.tooltipAnchor || [0, -15],
                    };
                }
            }
        },

        getEntityAttr: function (entity) {
            return entity.properties;
        },
        //默认symbol
        colorHash: {},
        setDefSymbol: function (entity) {
            if (entity.polygon) {
                var name = entity.properties.OBJECTID;
                var color = this.colorHash[name];
                if (!color) {
                    color = Cesium.Color.fromRandom({
                        minimumGreen: 0.75,
                        maximumBlue: 0.75,
                        alpha: this._opacity
                    });
                    this.colorHash[name] = color;
                }
                entity.polygon.material = color;
                entity.polygon.outline = true;
                entity.polygon.outlineColor = Cesium.Color.WHITE;
            }
            else if (entity.polyline) {

                var name = entity.properties.OBJECTID;
                var color = this.colorHash[name];
                if (!color) {
                    color = Cesium.Color.fromRandom({
                        minimumGreen: 0.75,
                        maximumBlue: 0.75,
                        alpha: this._opacity
                    });
                    this.colorHash[name] = color;
                }
                entity.polyline.material = color;
                entity.polyline.width = 2;
            }
            else if (entity.billboard) {
                entity.billboard.scale = 0.5;
                entity.billboard.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            }
        },
        //外部配置的symbol
        setConfigSymbol: function (entity, symbol) {
            var attr = entity.properties;
            var styleOpt = symbol.styleOptions;

            if (symbol.styleField) {//存在多个symbol，按styleField进行分类
                var styleFieldVal = attr[symbol.styleField];
                var styleOptField = symbol.styleFieldOptions[styleFieldVal];
                if (styleOptField != null) {
                    styleOpt = haoutil.system.clone(styleOpt);
                    styleOpt = $.extend(styleOpt, styleOptField);
                }
            }
            styleOpt = styleOpt || {};

            this._opacity = styleOpt.opacity || 1; //透明度

            if (entity.polygon) {
                _PolygonControl.attribute2Entity({ style: styleOpt }, entity.polygon);

                //加上线宽
                if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
                    entity.polygon.outline = false;

                    var newopt = {
                        "color": styleOpt.outlineColor,
                        "width": styleOpt.outlineWidth,
                        "opacity": styleOpt.outlineOpacity,
                        "lineType": "solid",
                        "clampToGround": true,
                        "outline": false,
                    };
                    var polyline = _PolylineControl.attribute2Entity({ style: newopt });
                    polyline.positions = entity.polygon.hierarchy._value.positions;
                    this.dataSource._entityCollection.add({
                        polyline: polyline,
                    });
                }
            }
            else if (entity.polyline) {
                _PolylineControl.attribute2Entity({ style: styleOpt }, entity.polyline);
            }
            else if (entity.billboard) {
                entity.billboard.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;

                _BillboardControl.attribute2Entity({ style: styleOpt }, entity.billboard);

                //加上文字标签 
                if (styleOpt.label && styleOpt.label.field) {
                    styleOpt.label.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;

                    entity.label = _LabelControl.attribute2Entity({ style: styleOpt.label });
                    entity.label.text = attr[styleOpt.label.field];
                }
            }
            entity.attribute = styleOpt;
        },




    });


    /* harmony default export */ __webpack_exports__["default"] = (GeoJsonLayer);

    /***/
}),
/* 11 */
/***/ (function (module, exports, __webpack_require__) {

    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿/**  
 * 提供了百度坐标（BD09）、国测局坐标（GCJ02）、WGS84坐标系、Web墨卡托 4类坐标之间的转换
 *  Created by 木遥（QQ：346819890）  
 *  传入参数 和 返回结果 均是数组：[经度,纬度] 
 */
    (function (a, b) {
        if (true) {
            !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
                            __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
                            (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
                            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
        } else { if (typeof module === "object" && module.exports) { module.exports = b() } else { a.pointconvert = b() } }
    }(this, function () { var b = 3.141592653589793 * 3000 / 180; var p = 3.141592653589793; var m = 6378245; var g = 0.006693421622965943; var k = function k(a) { var v = Number(a[0]); var r = Number(a[1]); var B = 3.141592653589793 * 3000 / 180; var A = v - 0.0065; var w = r - 0.006; var u = Math.sqrt(A * A + w * w) - 0.00002 * Math.sin(w * B); var q = Math.atan2(w, A) - 0.000003 * Math.cos(A * B); var t = u * Math.cos(q); var s = u * Math.sin(q); t = Number(t.toFixed(6)); s = Number(s.toFixed(6)); return [t, s] }; var l = function l(s) { var q = Number(s[0]); var u = Number(s[1]); var v = Math.sqrt(q * q + u * u) + 0.00002 * Math.sin(u * b); var r = Math.atan2(u, q) + 0.000003 * Math.cos(q * b); var a = v * Math.cos(r) + 0.0065; var t = v * Math.sin(r) + 0.006; a = Number(a.toFixed(6)); t = Number(t.toFixed(6)); return [a, t] }; var d = function d(a) { var x = Number(a[0]); var w = Number(a[1]); if (e(x, w)) { return [x, w] } else { var t = f(x - 105, w - 35); var v = i(x - 105, w - 35); var q = w / 180 * p; var y = Math.sin(q); y = 1 - g * y * y; var u = Math.sqrt(y); t = (t * 180) / ((m * (1 - g)) / (y * u) * p); v = (v * 180) / (m / u * Math.cos(q) * p); var r = w + t; var s = x + v; s = Number(s.toFixed(6)); r = Number(r.toFixed(6)); return [s, r] } }; var n = function n(a) { var w = Number(a[0]); var v = Number(a[1]); if (e(w, v)) { return [w, v] } else { var s = f(w - 105, v - 35); var u = i(w - 105, v - 35); var q = v / 180 * p; var y = Math.sin(q); y = 1 - g * y * y; var t = Math.sqrt(y); s = (s * 180) / ((m * (1 - g)) / (y * t) * p); u = (u * 180) / (m / t * Math.cos(q) * p); mglat = v + s; mglng = w + u; var x = w * 2 - mglng; var r = v * 2 - mglat; x = Number(x.toFixed(6)); r = Number(r.toFixed(6)); return [x, r] } }; var c = function c(a) { return n(k(a)) }; var o = function o(a) { return l(d(a)) }; var f = function f(q, r) { var a = -100 + 2 * q + 3 * r + 0.2 * r * r + 0.1 * q * r + 0.2 * Math.sqrt(Math.abs(q)); a += (20 * Math.sin(6 * q * p) + 20 * Math.sin(2 * q * p)) * 2 / 3; a += (20 * Math.sin(r * p) + 40 * Math.sin(r / 3 * p)) * 2 / 3; a += (160 * Math.sin(r / 12 * p) + 320 * Math.sin(r * p / 30)) * 2 / 3; return a }; var i = function i(q, r) { var a = 300 + q + 2 * r + 0.1 * q * q + 0.1 * q * r + 0.1 * Math.sqrt(Math.abs(q)); a += (20 * Math.sin(6 * q * p) + 20 * Math.sin(2 * q * p)) * 2 / 3; a += (20 * Math.sin(q * p) + 40 * Math.sin(q / 3 * p)) * 2 / 3; a += (150 * Math.sin(q / 12 * p) + 300 * Math.sin(q / 30 * p)) * 2 / 3; return a }; var e = function e(a, q) { return (a < 72.004 || a > 137.8347) || ((q < 0.8293 || q > 55.8271) || false) }; var h = function h(r) { var q = Number(r[0]); var s = Number(r[1]); var a = q * 20037508.34 / 180; var t = Math.log(Math.tan((90 + s) * p / 360)) / (p / 180); t = t * 20037508.34 / 180; a = Number(a.toFixed(2)); t = Number(t.toFixed(2)); return [a, t] }; var j = function j(r) { var q = Number(r[0]); var s = Number(r[1]); var a = q / 20037508.34 * 180; var t = s / 20037508.34 * 180; t = 180 / p * (2 * Math.atan(Math.exp(t * p / 180)) - p / 2); a = Number(a.toFixed(6)); t = Number(t.toFixed(6)); return [a, t] }; return { jwd2mct: h, mct2jwd: j, bd2gcj: k, gcj2bd: l, bd2wgs: c, wgs2bd: o, wgs2gcj: d, gcj2wgs: n } }));

    /***/
}),
/* 12 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(9).default


    var PointControl = {
        typename: "point",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                point: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                //默认值
                entityattr = {
                }
            }


            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "opacity":     //跳过扩展其他属性的参数
                    case "outlineOpacity":
                    case "scaleByDistance_near":
                    case "scaleByDistance_nearValue":
                    case "scaleByDistance_far":
                    case "scaleByDistance_farValue":
                    case "distanceDisplayCondition_far":
                    case "distanceDisplayCondition_near":
                        break;
                    case "outlineColor":    //边框颜色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                        break;
                    case "color":   //填充颜色
                        entityattr.color = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "scaleByDistance":   //是否按视距缩放
                        if (value) {
                            entityattr.scaleByDistance = new Cesium.NearFarScalar(
                                Number(attribute.style.scaleByDistance_near || 1000),
                                Number(attribute.style.scaleByDistance_nearValue || 1.0),
                                Number(attribute.style.scaleByDistance_far || 1000000),
                                Number(attribute.style.scaleByDistance_farValue || 0.1));
                        } else {
                            entityattr.scaleByDistance = null;
                        }
                        break;
                    case "distanceDisplayCondition":   //是否按视距显示
                        if (value) {
                            entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
                                Number(attribute.style.distanceDisplayCondition_near || 0),
                                Number(attribute.style.distanceDisplayCondition_far || 100000));
                        } else {
                            entityattr.distanceDisplayCondition = null;
                        }
                        break;
                }
            }



            //无边框时，需设置宽度为0
            if (!attribute.style.outline)
                entityattr.outlineWidth = 0.0;

            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, position) {
            entity.position = new _DynamicProperty(position);
        },
        getPositions: function (entity) {
            return [entity.position._value];
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: { type: "Point", coordinates: coordinates }
            };
        }
    };


    /* harmony default export */ __webpack_exports__["default"] = (PointControl);

    /***/
}),
/* 13 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    //分块加载矢量数据公共类
    var _FeatureGridLayer = __webpack_require__(45).default;

    var _BillboardControl = __webpack_require__(4).default
    var _LabelControl = __webpack_require__(5).default
    var _PolylineControl = __webpack_require__(8).default
    var _PolygonControl = __webpack_require__(6).default

    var CustomFeatureGridLayer = _FeatureGridLayer.extend({
        _cacheGrid: {},     //网格缓存,存放矢量对象id集合
        _cacheFeature: {},  //矢量对象缓存,存放矢量对象和其所对应的网格集合

        _addImageryCache: function (opts) {
            this._cacheGrid[opts.key] = { opts: opts, isLoading: true };

            var that = this;

            this.getDataForGrid(opts, function (arrdata) {
                if (that._visible)
                    that._showData(opts, arrdata);
            });

        },
        getDataForGrid: function (opts, calback) {
            //子类可继承, calback为回调方法,参数传数据数组 

            //直接使用本类,传参方式
            if (this.config.getDataForGrid) {
                this.config.getDataForGrid(opts, calback);
            }
        },
        checkHasBreak: function (cacheKey) {
            if (!this._visible || !this._cacheGrid[cacheKey]) {
                return true;
            }
            return false;
        },
        _showData: function (opts, arrdata) {
            var cacheKey = opts.key;
            if (this.checkHasBreak[cacheKey]) {
                return; //异步请求结束时,如果已经卸载了网格就直接跳出。
            }

            var arrIds = [];
            for (var i = 0, len = arrdata.length; i < len; i++) {
                var attributes = arrdata[i];
                var id = attributes[this.config.IdName || 'id'];

                var layer = this._cacheFeature[id];
                if (layer) {//已存在
                    layer.grid.push(cacheKey);
                    this.updateEntity(layer.entity, attributes);
                }
                else {
                    var that = this;
                    function createEntityOk(entity) {
                        that._cacheFeature[id] = {
                            grid: [cacheKey],
                            entity: entity
                        };
                    }
                    var entity = this.createEntity(opts, attributes, createEntityOk);
                    if (entity != null)
                        createEntityOk(entity);
                }
                arrIds.push(id);
            }

            this._cacheGrid[cacheKey] = this._cacheGrid[cacheKey] || {};
            this._cacheGrid[cacheKey].ids = arrIds;
            this._cacheGrid[cacheKey].isLoading = false;
        },

        createEntity: function (opts, attributes) {
            //子类可以继承,根据数据创造entity

            //直接使用本类,传参方式
            if (this.config.createEntity) {
                return this.config.createEntity(opts, attributes);
            }
            return null;
        },
        updateEntity: function (enetity, attributes) {
            //子类可以继承,更新entity（动态数据时有用）

            //直接使用本类,传参方式
            if (this.config.updateEntity) {
                this.config.updateEntity(enetity, attributes);
            }

        },
        _removeImageryCache: function (opts) {
            var cacheKey = opts.key;
            var layers = this._cacheGrid[cacheKey];
            if (layers) {
                if (layers.ids) {
                    for (var i = 0; i < layers.ids.length; i++) {
                        var id = layers.ids[i];
                        var layer = this._cacheFeature[id];
                        if (layer) {
                            layer.grid.remove(cacheKey);
                            if (layer.grid.length == 0) {
                                this.dataSource.entities.remove(layer.entity);
                                delete this._cacheFeature[id];
                            }
                        }
                    }
                }
                delete this._cacheGrid[cacheKey];
            }
        },
        //移除 
        removeEx: function () {
            this.dataSource.entities.removeAll();
            this._cacheFeature = {};
            this._cacheGrid = {};

            this.viewer.dataSources.remove(this.dataSource);
        },
        //重新加载数据
        reload: function () {
            var that = this;
            for (var i in this._cacheGrid) {
                var item = this._cacheGrid[i];
                if (item == null || item.opts == null || item.isLoading) continue;

                var opts = item.opts;
                this.getDataForGrid(opts, function (arrdata) {
                    that._showData(opts, arrdata);
                });
            }
        },

        //设置透明度
        hasOpacity: true,
        _opacity: 1,
        setOpacity: function (value) {
            this._opacity = value;

            for (var i in this._cacheFeature) {
                var entity = this._cacheFeature[i].entity;

                if (entity.polygon && entity.polygon.material && entity.polygon.material.color) {
                    this._updatEntityAlpha(entity.polygon.material.color, this._opacity);
                    if (entity.polygon.outlineColor) {
                        this._updatEntityAlpha(entity.polygon.outlineColor, this._opacity);
                    }
                }
                else if (entity.polyline && entity.polyline.material && entity.polyline.material.color) {
                    this._updatEntityAlpha(entity.polyline.material.color, this._opacity);
                }
                else if (entity.billboard) {
                    entity.billboard.color = new Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity);

                    if (entity.label) {
                        if (entity.label.fillColor)
                            this._updatEntityAlpha(entity.label.fillColor, this._opacity);
                        if (entity.label.outlineColor)
                            this._updatEntityAlpha(entity.label.outlineColor, this._opacity);
                        if (entity.label.backgroundColor)
                            this._updatEntityAlpha(entity.label.backgroundColor, this._opacity);
                    }
                }
            }
        },
        _updatEntityAlpha: function (color, opacity) {
            var newclr = color.getValue().withAlpha(opacity);
            color.setValue(newclr);
        },



        //默认symbol
        colorHash: {},
        setDefSymbol: function (entity) {
            if (entity.polygon) {
                var name = entity.properties.OBJECTID;
                var color = this.colorHash[name];
                if (!color) {
                    color = Cesium.Color.fromRandom({
                        minimumGreen: 0.75,
                        maximumBlue: 0.75,
                        alpha: this._opacity
                    });
                    this.colorHash[name] = color;
                }
                entity.polygon.material = color;
                entity.polygon.outline = true;
                entity.polygon.outlineColor = Cesium.Color.WHITE;
            }
            else if (entity.polyline) {

                var name = entity.properties.OBJECTID;
                var color = this.colorHash[name];
                if (!color) {
                    color = Cesium.Color.fromRandom({
                        minimumGreen: 0.75,
                        maximumBlue: 0.75,
                        alpha: this._opacity
                    });
                    this.colorHash[name] = color;
                }
                entity.polyline.material = color;
                entity.polyline.width = 2;
            }
            else if (entity.billboard) {
                entity.billboard.scale = 0.5;
                entity.billboard.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            }
        },
        //外部配置的symbol
        setConfigSymbol: function (entity, symbol) {
            var attr = entity.properties;
            var styleOpt = symbol.styleOptions;

            if (symbol.styleField) {//存在多个symbol,按styleField进行分类
                var styleFieldVal = attr[symbol.styleField];
                var styleOptField = symbol.styleFieldOptions[styleFieldVal];
                if (styleOptField != null) {
                    styleOpt = haoutil.system.clone(styleOpt);
                    styleOpt = $.extend(styleOpt, styleOptField);
                }
            }
            styleOpt = styleOpt || {};

            this._opacity = styleOpt.opacity || 1; //透明度

            if (entity.polygon) {
                _PolygonControl.attribute2Entity({ style: styleOpt }, entity.polygon);

                //加上线宽
                if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
                    entity.polygon.outline = false;

                    var newopt = {
                        "color": styleOpt.outlineColor,
                        "width": styleOpt.outlineWidth,
                        "opacity": styleOpt.outlineOpacity,
                        "lineType": "solid",
                        "outline": false,
                    };
                    var polyline = _PolylineControl.attribute2Entity({ style: newopt });
                    polyline.positions = entity.polygon.hierarchy._value.positions;
                    this.dataSource.entities.add({
                        polyline: polyline,
                    });
                }
            }
            else if (entity.polyline) {
                _PolylineControl.attribute2Entity({ style: styleOpt }, entity.polyline);
            }
            else if (entity.billboard) {
                entity.billboard.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;

                _BillboardControl.attribute2Entity({ style: styleOpt }, entity.billboard);

                //加上文字标签 
                if (styleOpt.label && styleOpt.label.field) {
                    styleOpt.label.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;

                    entity.label = _LabelControl.attribute2Entity({ style: styleOpt.label });
                    entity.label.text = attr[styleOpt.label.field];
                }
            }

        },






    });


    /* harmony default export */ __webpack_exports__["default"] = (CustomFeatureGridLayer);

    /***/
}),
/* 14 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 修改 木遥（QQ：346819890） */

    var _BillboardControl = __webpack_require__(4).default
    var _LabelControl = __webpack_require__(5).default
    var _EllipseControl = __webpack_require__(15).default
    var _PolylineControl = __webpack_require__(8).default
    var _PolylineVolumeControl = __webpack_require__(18).default
    var _PolygonControl = __webpack_require__(6).default
    var _EllipsoidControl = __webpack_require__(16).default
    var _PointControl = __webpack_require__(12).default
    var _RectangleControl = __webpack_require__(19).default
    var _ModelControl = __webpack_require__(17).default
    var _WallControl = __webpack_require__(20).default


    var _EventControl = __webpack_require__(37).default
    var _util = __webpack_require__(7)
    var _drawutils = __webpack_require__(0).default

    //标绘控制器，总入口
    var Draw = (function (options) {

        //各实体的控制类 type:类名
        var control = {
            billboard: _BillboardControl,
            label: _LabelControl,
            ellipse: _EllipseControl,
            polyline: _PolylineControl,
            polylineVolume: _PolylineVolumeControl,
            polygon: _PolygonControl,

            ellipsoid: _EllipsoidControl,
            wall: _WallControl,
            point: _PointControl,
            rectangle: _RectangleControl,
            model: _ModelControl
        };

        var viewer = options.viewer;
        var scene = viewer.scene;
        var dragIcon = options.dragIcon;


        var dataSource = new Cesium.CustomDataSource();
        viewer.dataSources.add(dataSource);

        var currentEntity = null;
        var arrEntity = [];

        var eventCortol = new _EventControl(viewer);

        //是否可以编辑
        var _hasEdit;

        function hasEdit(val) {
            if (_hasEdit != null && _hasEdit == val) return;

            _hasEdit = val;
            if (val) {
                //初始化编辑相关事件
                eventCortol.createEditSelectHandler(function (pickedEntity) {

                    //正在绘制中跳出
                    if (currentEntity && currentEntity.inProgress)
                        return;
                    if (pickedEntity !== currentEntity) {
                        if (currentEntity && currentEntity.stopEditing) {
                            currentEntity.stopEditing();
                            currentEntity = null;
                        }
                        currentEntity = pickedEntity;
                        if (currentEntity && currentEntity.startEditing) {
                            currentEntity.startEditing();
                        }
                    } else {
                        if (options.onStopEditing && typeof (options.onStopEditing) == "function") {
                            options.onStopEditing(pickedEntity);
                        }
                    }
                });
                eventCortol.createEditDraggerHandler();
            } else {
                stopDraw();
                eventCortol.destroyEditHandler();
            }
        }
        hasEdit(options.hasEdit);

        //开始绘制
        function startDraw(attribute) {
            stopDraw();
            if (attribute == null || attribute.type == null) {
                throw '请传入需要绘制的类型参数';
                return;
            }

            attribute.style = attribute.style || {};
            attribute.attr = attribute.attr || {};

            var type = attribute.type;
            if (control[type] == null) {
                throw '传入的[' + type + ']类型参数有误';
                return;
            }
            var entity = control[type].startDraw(dataSource, attribute);


            switch (type) {
                case "label":
                case "point":
                case "billboard":
                case "model":
                case "ellipse":
                case "ellipsoid"://点
                    eventCortol.createDrawPointHandler(entity);
                    break;
                case "polyline":
                case "polylineVolume"://线
                    eventCortol.createDrawPolylineHandler(entity, control[type].getPositions(entity));
                    break;
                case "polygon"://面
                    eventCortol.createDrawPolygonHandler(entity, control[type].getPositions(entity));
                    break;
                case "rectangle":
                case "extrudedRectangle":
                case "measureHeight"://两个点的对象
                    eventCortol.createTwoPointsModelHandler(entity, control[type].getPositions(entity));
                    break;
                case "wall"://墙
                    var ePositions = control[type].getPositions(entity);
                    var eMinimumHeights = control[type].getMinimumHeights(entity);
                    var eMaximumHeights = control[type].getMaximumHeights(entity);
                    eventCortol.createDrawWallHandler(entity, ePositions, eMinimumHeights, eMaximumHeights);
                    break;
            }
            extendEntity(entity);
            arrEntity.push(entity);

            entity.startDrawing();
            currentEntity = entity;

            return entity;
        }

        //停止编辑
        function stopDraw(noevent) {
            //释放上次未完成的绘制
            eventCortol.destroyDrawHandler();
            if (currentEntity && currentEntity.inProgress) {
                currentEntity.stopDrawing(noevent);
                dataSource.entities.remove(currentEntity);
                removeArrayOne(arrEntity, currentEntity);//arrEntity.remove(currentEntity);
            }

            //释放在编辑的对象
            if (currentEntity && currentEntity.stopEditing) {
                currentEntity.stopEditing(noevent);
                currentEntity = null;
            }
            return this;
        }

        //修改了属性
        function updateAttribute(attribute, entity) {
            if (entity != null)
                currentEntity = entity;

            if (currentEntity == null || attribute == null) return;
            //		attribute.minMaxPoints = attribute.minMaxPoints || {};
            attribute.style = attribute.style || {};
            attribute.attr = attribute.attr || {};

            var type = currentEntity.attribute.type;
            control[type].attribute2Entity(attribute, currentEntity[type]);
            if (type == "model")
                control[type].attribute2Model(attribute, currentEntity);
            currentEntity.attribute = attribute;

            if (type == "ellipse" || type == "polygon" || type == "wall" || type == "rectangle") {
                currentEntity.editor.updateDraggers();
            }
            return currentEntity;
        }

        //修改坐标、高程
        function updateGeometry(positions, entity) {
            if (entity == null) entity = currentEntity;
            if (entity == null || positions == null) return;
            var type = entity.attribute.type;

            control[type].setPositions(entity, positions);

            if (entity.editor && entity.editor.destroy) {
                //entity.editor.updateDraggers();

                entity.editor.destroy();
                var type = entity.attribute.type;
                entity.editor = control[type].getEditor(dataSource, entity, {
                    dragIcon: dragIcon
                });
            }

            return entity;
        }

        /**
         * 扩展entity实体，绑定一些方法
         */
        function extendEntity(entity) {
            //绘制开始、修改、结束
            entity.startDrawing = function () {
                $('.cesium-viewer').css('cursor', 'crosshair');

                var entity = this;
                if (options.onStartDrawing && typeof (options.onStartDrawing) == "function") {
                    options.onStartDrawing(entity);
                }
            };
            entity.changeDrawing = function () {
                var entity = this;
                if (options.onChangeDrawing && typeof (options.onChangeDrawing) == "function") {
                    options.onChangeDrawing(entity);
                }
            };
            entity.moveDrawing = function () {
                var entity = this;
                if (options.onMoveDrawing && typeof (options.onMoveDrawing) == "function") {
                    options.onMoveDrawing(entity);
                }
            };
            entity.stopDrawing = function () {
                $('.cesium-viewer').css('cursor', '');

                var entity = this;
                if (options.onStopDrawing && typeof (options.onStopDrawing) == "function") {
                    options.onStopDrawing(entity);
                }
            };

            //编辑开始、修改、结束
            entity.startEditing = function () {
                if (!_hasEdit) return;

                var entity = this;
                currentEntity = entity;

                //绑定编辑器
                if (entity.editor == null) {
                    var type = entity.attribute.type;
                    entity.editor = control[type].getEditor(dataSource, entity, {
                        dragIcon: dragIcon
                    });
                }

                if (options.onStartEditing && typeof (options.onStartEditing) == "function") {
                    options.onStartEditing(entity);
                }
            };

            entity.stopEditing = function (noevent) {
                var entity = this;

                //释放编辑器
                if (entity.editor) {
                    entity.editor.destroy();
                    entity.editor = null;
                }

                if (!noevent && options.onStopEditing && typeof (options.onStopEditing) == "function") {
                    options.onStopEditing(entity);
                }
            };

            entity.changeEditing = function () {
                var entity = this;
                if (options.onChangeEditing && typeof (options.onChangeEditing) == "function") {
                    options.onChangeEditing(entity);
                }
            };

            entity.updatePositions = function (positions) {
                var entity = this;
                var type = entity.attribute.type;
                if (type == "ellipse") {
                    var height = Cesium.Cartographic.fromCartesian(positions).height;
                    entity.attribute.style.height = Number(height.toFixed(2));
                    if (entity.ellipse.height)
                        entity.ellipse.height._value = entity.attribute.style.height;
                    else
                        entity.ellipse.height = entity.attribute.style.height;

                    if (entity.attribute.style.extrudedHeight) {
                        var extrudedHeight = Number(height) + Number(entity.attribute.style.extrudedHeight);
                        entity.ellipse.extrudedHeight._value = Number(extrudedHeight.toFixed(2));
                        entity.attribute.style.extrudedHeight = Number(extrudedHeight.toFixed(2));
                    }
                }
                control[type].setPositions(currentEntity, positions);
            }
        };

        //删除单个
        function deleteEntity(entity) {
            if (entity == null) return;
            entity.stopEditing(true);

            removeArrayOne(arrEntity, entity); //arrEntity.remove(entity);

            dataSource.entities.remove(entity);
        }

        //删除当前entity
        function deleteCurrentEntity() {
            if (currentEntity) {
                currentEntity.stopEditing(true);
                removeArrayOne(arrEntity, currentEntity); //arrEntity.remove(currentEntity); 
                dataSource.entities.remove(currentEntity);
                currentEntity = null;
            }
        }

        //删除所有
        function deleteAll() {
            stopDraw();

            dataSource.entities.removeAll();
            arrEntity = [];
        }

        function setVisible(visible) {
            //if(visible)
            //    viewer.dataSources.add(dataSource);
            //else
            //    viewer.dataSources.remove(dataSource,false); 

            $(arrEntity).each(function (i, item) {
                if (visible) {
                    if (!dataSource.entities.contains(item))
                        dataSource.entities.add(item);
                }
                else {
                    if (dataSource.entities.contains(item))
                        dataSource.entities.remove(item);
                }
            });
        }

        //获取实体的经纬度值 坐标数组
        function getCoordinates(entity) {
            var type = entity.attribute.type;
            var positions = control[type].getCoordinates(entity);
            return positions;
        }

        //获取实体的坐标数组
        function getPositions(entity) {
            var type = entity.attribute.type;
            var positions = control[type].getPositions(entity);
            return positions;
        }

        function setPositions(entity, positions) {
            var type = entity.attribute.type;
            var positions = control[type].setPositions(entity, positions);
        }

        //是否存在绘制
        function hasDraw() {
            return arrEntity.length > 0;
        }

        //获取所有绘制的实体对象列表
        function getEntitys() {
            return arrEntity;
        }

        function getDataSource() {
            return dataSource;
        }

        function getEntityById(id) {
            for (var i = 0; i < arrEntity.length; i++) {
                var entity = arrEntity[i];
                if (id == entity.attribute.attr.id) {
                    return entity;
                }
            }
            return null;
        }


        function getCurrentEntity() {
            return currentEntity;
        }

        //转换当前所有为geojson
        function toGeoJSON(entity) {
            if (entity == null) {//全部数据
                if (arrEntity.length == 0) return null;

                var features = [];
                for (var i = 0; i < arrEntity.length; i++) {
                    var entity = arrEntity[i];

                    var type = entity.attribute.type;
                    var geojson = control[type].toGeoJSON(entity);
                    features.push(geojson);
                }
                var geojson = {
                    type: "FeatureCollection",
                    features: features
                };
                return geojson;
            } else {
                var type = entity.attribute.type;
                var geojson = control[type].toGeoJSON(entity);
                return geojson;
            }
        }

        /**
         * 加载goejson数据
         * @param {Object} json geojson字符串
         * @param {Object} isClear 是否清空已有的模型
         */
        function jsonToEntity(json, isClear, isFly) {
            var jsonObjs = json;
            try {
                if (_util.isString(json))
                    jsonObjs = JSON.parse(json);
            } catch (e) {
                haoutil.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
                return;
            }

            if (isClear) {
                deleteAll();
            }
            var arrthis = [];
            var jsonFeatures = jsonObjs.features;
            for (var i = 0; i < jsonFeatures.length; i++) {
                var feature = jsonFeatures[i];

                if (!feature.properties || !feature.properties.type) {
                    //非本身保存的外部其他geojson数据
                    feature.properties = feature.properties || {};
                    debugger
                    switch (feature.geometry.type) {
                        case "MultiPolygon":
                        case "Polygon":
                            feature.properties.type = "polygon";
                            break;
                        case "MultiLineString":
                        case "LineString":
                            feature.properties.type = "polyline";
                            break;
                        case "MultiPoint":
                        case "Point":
                            feature.properties.type = "point";
                            break;
                    }

                }

                var type = feature.properties.type;
                if (control[type] == null) {
                    throw '数据无法识别或者数据的[' + type + ']类型参数有误';
                    return;
                }
                feature.properties.style = feature.properties.style || {};

                var entity = control[type].startDraw(dataSource, feature.properties);
                var positions = _drawutils.getPositionsFromJson(feature.geometry);
                control[type].setPositions(entity, positions);
                extendEntity(entity);
                arrEntity.push(entity);

                arrthis.push(entity);
            }

            if (isFly)
                viewer.flyTo(arrthis);

            return arrthis;
        }



        /**
         * 加载标记信息json文件，一数组的字符串Array<Object>，
         * @param {Object} json Arrray<Object> Object {id:"abcd",name:"abcd",x:"117.22",y:"31.22"}
         * @param {Object} style Object 标记的样式
         * @param {Object} isClear boolean 是否清空已有模型 
         */
        function markersInfoToEntity(json, style, isClear) {
            var arr = json;
            try {
                if (_util.isString(json))
                    arr = JSON.parse(json);
            } catch (e) {
                haoutil.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
                return;
            }

            if (!(arr instanceof Array)) {
                haoutil.alert("请确认json文件格式正确!!!");
                return;
            }
            if (isClear) {
                deleteAll();
            }

            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (!(item.x) || !(item.y)) {
                    haoutil.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
                    return;
                }
                var attr = {
                    id: item.id || item.ID || "",
                    name: item.name || item.NAME || "",
                    remark: item.remark || item.REMA || ""
                };
                var attribute = {
                    type: style.type || "billboard",
                    attr: attr,
                    style: style.style
                };

                var markerPosition = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z || 0.0);
                var entity = control[attribute.type].startDraw(dataSource, attribute);
                control[attribute.type].setPositions(entity, markerPosition);
                extendEntity(entity);
                arrEntity.push(entity);
            }

            return arrEntity;
        }

        //删除数组的1个
        function removeArrayOne(arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        };


        return {
            startDraw: startDraw,
            stopDraw: stopDraw,
            updateAttribute: updateAttribute,
            updateGeometry: updateGeometry,
            toGeoJSON: toGeoJSON,
            jsonToEntity: jsonToEntity,
            markersInfoToEntity: markersInfoToEntity,
            deleteEntity: deleteEntity,
            deleteCurrentEntity: deleteCurrentEntity,
            deleteAll: deleteAll,
            setVisible: setVisible,
            hasDraw: hasDraw,
            hasEdit: hasEdit,
            getEntitys: getEntitys,
            getDataSource: getDataSource,
            getEntityById: getEntityById,
            getCurrentEntity: getCurrentEntity,
            getCoordinates: getCoordinates,
            getPositions: getPositions,
            setPositions: setPositions
        };
    });

    /* harmony default export */ __webpack_exports__["default"] = (Draw);

    /***/
}),
/* 15 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(28).default


    var EllipseControl = {
        typename: "ellipse",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                //name: 'Entity ' + arrEntity.length,
                ellipse: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                //默认值
                entityattr = {
                    fill: true
                };
            }


            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "opacity":     //跳过扩展其他属性的参数
                    case "outlineOpacity":
                        break;
                    case "outlineColor":    //边框颜色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                        break;
                    case "color":       //填充颜色
                        entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "rotation":    //旋转角度
                        entityattr.rotation = Cesium.Math.toRadians(value);
                        break;
                    case "radius":    //半径
                        entityattr.semiMinorAxis = value;
                        entityattr.semiMajorAxis = value;
                        break;

                }
            }



            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, position) {
            entity.position = new _DynamicProperty(position);
        },
        getPositions: function (entity) {
            return [entity.position._value];
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: { type: "Point", coordinates: coordinates }
            };
        }





    };


    /* harmony default export */ __webpack_exports__["default"] = (EllipseControl);

    /***/
}),
/* 16 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(29).default


    var EllipsoidControl = {
        typename: "ellipsoid",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                //name: 'Entity ' + arrEntity.length,
                ellipsoid: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                //默认值
                entityattr = {
                    fill: true
                };
            }



            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "opacity":     //跳过扩展其他属性的参数
                    case "outlineOpacity":
                    case "widthRadii":
                    case "heightRadii":
                        break;
                    case "outlineColor":    //边框颜色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                        break;
                    case "color":       //填充颜色
                        entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "extentRadii":    //球体长宽高半径
                        var extentRadii = attribute.style.extentRadii || 100;
                        var widthRadii = attribute.style.widthRadii || 100;
                        var heightRadii = attribute.style.heightRadii || 100;
                        entityattr.radii = new Cesium.Cartesian3(extentRadii, widthRadii, heightRadii);
                        break;
                }
            }


            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, position) {
            entity.position = new _DynamicProperty(position);
        },
        getPositions: function (entity) {
            return [entity.position._value];
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: { type: "Point", coordinates: coordinates }
            };
        }
    };

    /* harmony default export */ __webpack_exports__["default"] = (EllipsoidControl);

    /***/
}),
/* 17 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(9).default

    var ModelControl = {
        typename: "model",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                model: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                //默认值
                entityattr = {
                }
            }

            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "silhouette":    //跳过扩展其他属性的参数
                    case "silhouetteColor":
                    case "silhouetteAlpha":
                    case "silhouetteSize":
                    case "fill":
                    case "color":
                    case "opacity":
                        break;
                    case "modelUrl": //模型uri
                        entityattr.uri = value;
                        break;
                }
            }




            //轮廓
            if (attribute.style.silhouette) {
                entityattr.silhouetteColor = new Cesium.Color.fromCssColorString(attribute.style.silhouetteColor || "#FFFFFF")
                    .withAlpha(Number(attribute.style.silhouetteAlpha || 1.0));
                entityattr.silhouetteSize = Number(attribute.style.silhouetteSize || 1.0);
            } else
                entityattr.silhouetteSize = 0.0;

            //透明度、颜色
            if (attribute.style.fill)
                entityattr.color = new Cesium.Color.fromCssColorString(attribute.style.color || "#FFFFFF")
                    .withAlpha(Number(attribute.style.opacity || 1.0));
            else
                entityattr.color = new Cesium.Color.fromCssColorString("#FFFFFF")
                    .withAlpha(Number(attribute.style.opacity || 1.0));


            return entityattr;
        },
        attribute2Model: function (attribute, model) {
            //角度控制
            var heading = Cesium.Math.toRadians(Number(model.attribute.style.heading || 0.0));
            var pitch = Cesium.Math.toRadians(Number(model.attribute.style.pitch || 0.0));
            var roll = Cesium.Math.toRadians(Number(model.attribute.style.roll || 0.0));
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

            if (model.orientation) {
                model.orientation = Cesium.Transforms.headingPitchRollQuaternion(model.position._value, hpr);
            }
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, position) {
            entity.position = new _DynamicProperty(position);
            var heading = Cesium.Math.toRadians(Number(entity.attribute.style.heading || 0.0));
            var pitch = Cesium.Math.toRadians(Number(entity.attribute.style.pitch || 0.0));
            var roll = Cesium.Math.toRadians(Number(entity.attribute.style.roll || 0.0));
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(entity.position._value, hpr);
        },
        getPositions: function (entity) {
            return [entity.position._value];
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: { type: "Point", coordinates: coordinates }
            };
        }
    };


    /* harmony default export */ __webpack_exports__["default"] = (ModelControl);

    /***/
}),
/* 18 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 11:55:55 | 修改 木遥（QQ：346819890） */

    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(33).default


    var PolylineVolumeControl = {
        typename: "polylineVolume",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                polylineVolume: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                entityattr = {
                    positions: new _DynamicProperty([])
                    //positions: new Cesium.ConstantProperty([])
                }
            }

            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "opacity":     //跳过扩展其他属性的参数
                    case "outlineOpacity":
                    case "radius":
                    case "shape":
                        break;
                    case "outlineColor":    //边框颜色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                        break;
                    case "color":   //填充颜色
                        entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                }
            }

            //管道样式 
            attribute.style.radius = attribute.style.radius || 10;
            switch (attribute.style.shape) {
                default:
                case "pipeline":
                    entityattr.shape = this._getCorridorShape1(attribute.style.radius);//（厚度固定为半径的1/3）
                    break;
                case "circle":
                    entityattr.shape = this._getCorridorShape2(attribute.style.radius);
                    break;
                case "star":
                    entityattr.shape = this._getCorridorShape3(attribute.style.radius);
                    break;
            }

            return entityattr;
        },
        //管道形状1【内空管道】 radius整个管道的外半径 
        _getCorridorShape1: function (radius) {
            var hd = radius / 3;
            var startAngle = 0;
            var endAngle = 360;

            var pss = [];
            for (var i = startAngle; i <= endAngle; i++) {
                var radians = Cesium.Math.toRadians(i);
                pss.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
            }
            for (var i = endAngle; i >= startAngle; i--) {
                var radians = Cesium.Math.toRadians(i);
                pss.push(new Cesium.Cartesian2((radius - hd) * Math.cos(radians), (radius - hd) * Math.sin(radians)));
            }
            return pss;
        },
        //管道形状2【圆柱体】 radius整个管道的外半径 
        _getCorridorShape2: function (radius) {
            var startAngle = 0;
            var endAngle = 360;

            var pss = [];
            for (var i = startAngle; i <= endAngle; i++) {
                var radians = Cesium.Math.toRadians(i);
                pss.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
            }
            return pss;
        },
        //管道形状2【星状】 radius整个管道的外半径 ,arms星角的个数（默认6个角）
        _getCorridorShape3: function (radius, arms) {
            var arms = arms || 6;
            var angle = Math.PI / arms;
            var length = 2 * arms;
            var pss = new Array(length);
            for (var i = 0; i < length; i++) {
                var r = (i % 2) === 0 ? radius : radius / 3;
                pss[i] = new Cesium.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r);
            }
            return pss;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, positions) {
            //entity.polylineVolume.positions = new _DynamicProperty(positions);
            entity.polylineVolume.positions = positions;
        },
        getPositions: function (entity) {
            return entity.polylineVolume.positions._value;
        },
        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);
            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: {
                    type: "LineString",
                    coordinates: coordinates
                }
            };
        }

    };


    /* harmony default export */ __webpack_exports__["default"] = (PolylineVolumeControl);

    /***/
}),
/* 19 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-5 15:18:51 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor1 = __webpack_require__(35).default
    var _Editor2 = __webpack_require__(34).default


    var RectangleControl = {
        typename: "rectangle",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                rectangle: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};

            if (!entityattr) {
                var coor = Cesium.Rectangle.fromDegrees(78.654473, 34.878143, 78.654673, 34.878316);
                entityattr = {
                    fill: true,
                    closeTop: true,
                    closeBottom: true,
                    coordinates: coor
                }
            }

            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "opacity":     //跳过扩展其他属性的参数
                    case "outlineOpacity":
                        break;
                    case "outlineColor":    //边框颜色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                        break;
                    case "height":
                        entityattr.height = Number(value);
                        entityattr.extrudedHeight = Number(attribute.style.extrudedHeight) + Number(value);
                        break;
                    case "extrudedHeight":
                        entityattr.extrudedHeight = Number(entityattr.height) + Number(value);
                        break;
                    case "color":   //填充颜色
                        entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "image":   //填充图片
                        entityattr.material = attribute.style.image;
                        break;
                    case "rotation":   //旋转角度 
                        entityattr.rotation = Cesium.Math.toRadians(value);
                        if (!attribute.style.stRotation)
                            entityattr.stRotation = Cesium.Math.toRadians(value);
                        break;
                    case "stRotation":
                        entityattr.stRotation = Cesium.Math.toRadians(value);
                        break;
                }
            }

            //如果未设置任何material，设置默认颜色
            if (entityattr.material == null) {
                entityattr.material = Cesium.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: Number(attribute.style.opacity || 1.0)
                });
            }

            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            if (entity.rectangle.extrudedHeight) {
                return new _Editor1(dataSource, entity, options);
            } else {
                return new _Editor2(dataSource, entity, options);
            }
        },
        setPositions: function (entity, position) {
            if (position instanceof Array) {
                position = Cesium.Rectangle.fromCartesianArray(position);
            }
            entity.rectangle.coordinates.setValue(position);// = new _DynamicProperty(position);
        },
        getPositions: function (entity) {
            return entity.rectangle.coordinates;
        },
        getCoordinates: function (entity) {
            var positions = this.getDiagonalPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        getDiagonalPositions: function (entity) {
            var rectangle = entity.rectangle.coordinates._value;
            var nw = Cesium.Rectangle.northwest(rectangle);
            var se = Cesium.Rectangle.southeast(rectangle);
            return Cesium.Cartesian3.fromRadiansArray([nw.longitude, nw.latitude, se.longitude, se.latitude]);
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: {
                    type: "MultiPoint",
                    coordinates: coordinates
                }
            };
        }
    };


    /* harmony default export */ __webpack_exports__["default"] = (RectangleControl);

    /***/
}),
/* 20 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:21 | 修改 木遥（QQ：346819890） */
    var _DynamicProperty = __webpack_require__(1).default
    var _drawutils = __webpack_require__(0).default
    var _Editor = __webpack_require__(36).default


    var WallControl = {
        typename: "wall",
        startDraw: function (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                //name: 'Entity ' + arrEntity.length,
                wall: entityattr,
                attribute: attribute
            });

            return entity;
        },
        attribute2Entity: function (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};

            if (!entityattr) {
                entityattr = {
                    fill: true,
                    minimumHeights: [],
                    maximumHeights: [],
                    positions: new _DynamicProperty([])
                }
            }


            //Style赋值值Entity
            for (var key in attribute.style) {
                var value = attribute.style[key];
                switch (key) {
                    default:    //直接赋值
                        entityattr[key] = value;
                        break;
                    case "opacity":     //跳过扩展其他属性的参数
                    case "outlineOpacity":
                        break;
                    case "outlineColor":    //边框颜色
                        entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                        break;
                    case "color":   //填充颜色
                        entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                }
            }

            //如果未设置任何material，设置默认颜色
            if (entityattr.material == null) {
                entityattr.material = Cesium.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: Number(attribute.style.opacity || 1.0)
                });
            }

            return entityattr;
        },
        getEditor: function (dataSource, entity, options) {
            return new _Editor(dataSource, entity, options);
        },
        setPositions: function (entity, position) {
            entity.wall.positions = new _DynamicProperty(position);

            if (entity.wall.maximumHeights && entity.wall.minimumHeights) {
                for (var i = 0; i < position.length; i++) {
                    var carto = Cesium.Cartographic.fromCartesian(position[i]);
                    entity.wall.minimumHeights._value[i] = Number(carto.height);
                    entity.wall.maximumHeights._value[i] = Number(carto.height) + Number(entity.attribute.style.extrudedHeight);
                }
            }
        },
        getPositions: function (entity) {
            return entity.wall.positions._value;
        },

        setMaximumHeights: function (entity, maximumHeights) {
            entity.wall.maximumHeights = new _DynamicProperty(maximumHeights);
        },
        getMaximumHeights: function (entity) {
            return entity.wall.maximumHeights._value;
        },
        setMinimumHeights: function (entity, minimumHeights) {
            entity.wall.minimumHeights = new _DynamicProperty(minimumHeights);
        },
        getMinimumHeights: function (entity) {
            return entity.wall.minimumHeights._value;
        },

        getCoordinates: function (entity) {
            var positions = this.getPositions(entity);
            var coordinates = _drawutils.getCoordinates(positions);
            return coordinates;
        },
        toGeoJSON: function (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: {
                    type: "LineString",
                    coordinates: coordinates
                }
            };
        }
    };

    /* harmony default export */ __webpack_exports__["default"] = (WallControl);

    /***/
}),
/* 21 */
/***/ (function (module, exports, __webpack_require__) {

    /* 2017-11-28 08:17:32 | 修改 木遥（QQ：346819890） */

    var _BaseLayer = __webpack_require__(2).default;
    var _GroupLayer = __webpack_require__(43).default;

    var _TileLayer = __webpack_require__(22).default;
    var _GraticuleLayer = __webpack_require__(49).default;


    var _CustomFeatureGridLayer = __webpack_require__(13).default;
    var _ArcFeatureGridLayer = __webpack_require__(44).default;
    var _POILayer = __webpack_require__(46).default;

    var _GeoJsonLayer = __webpack_require__(10).default;
    var _ArcFeatureLayer = __webpack_require__(38).default;
    var _GltfLayer = __webpack_require__(40).default;
    var _Tiles3dLayer = __webpack_require__(42).default;
    var _KmlLayer = __webpack_require__(41).default;
    var _CzmlLayer = __webpack_require__(39).default;

    var _ArcTileImageryProvider = __webpack_require__(47).default;
    var _FeatureGridImageryProvider = __webpack_require__(48).default;

    //创建图层
    function createLayer(item, viewer, serverURL, layerToMap) {
        var layer;

        if (item.url) {
            if (serverURL) {
                item.url = item.url.replace('$serverURL$', serverURL);
            }
            item.url = item.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
        }

        switch (item.type) {
            //===============地图数组====================
            case "group":
                //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
                if (item.layers && item.layers.length > 0) {
                    var arrVec = [];
                    for (var index = 0; index < item.layers.length; index++) {
                        var temp = createLayer(item.layers[index], viewer, serverURL, layerToMap);
                        if (temp == null) continue;
                        arrVec.push(temp);
                    }
                    item._layers = arrVec;
                    layer = new _GroupLayer(item, viewer);
                }
                break;
            case "www_bing": //bing地图 
            case "www_osm": //OSM开源地图 
            case "www_google": //谷歌国内
            case "www_gaode": //高德
            case "www_tdt"://天地图
            case "arcgis_cache":
            case "arcgis":
            case "arcgis_tile":
            case "arcgis_dynamic":
            case "wmts":
            case "tms":
            case "wms":
            case "xyz":
            case "tile":
            case "single":
            case "image":
            case "custom_tilecoord": //瓦片信息
            case "custom_grid":     //网格线 
                //瓦片图层
                layer = new _TileLayer(item, viewer);
                break;
            case "www_poi"://在线poi数据
                layer = new _POILayer(item, viewer);
                break;
            case "custom_featuregrid": //自定义矢量网格图层 
                layer = new _CustomFeatureGridLayer(item, viewer);
                break;
            case "custom_graticule":
                layer = new _GraticuleLayer(item, viewer);
                break;

            case "3dtiles":
                layer = new _Tiles3dLayer(item, viewer);
                break;
            case "gltf":
                layer = new _GltfLayer(item, viewer);
                break;
            case "arcgis_feature"://分网格加载
                layer = new _ArcFeatureGridLayer(item, viewer);
                break;
            case "arcgis_feature2"://一次加载，不分网格
                layer = new _ArcFeatureLayer(item, viewer);
                break;
            case "geojson":
                layer = new _GeoJsonLayer(item, viewer);
                break;
            case "kml":
                layer = new _KmlLayer(item, viewer);
                break;
            case "czml":
                layer = new _CzmlLayer(item, viewer);
                break;
            default:
                break;
        }

        if (layerToMap) {
            var _temp = layerToMap(item, viewer, layer);
            if (_temp)
                layer = _temp;
        }

        if (layer == null) {
            if (item.type != "group")
                console.log("配置中的图层未处理：" + JSON.stringify(item));
        }
        else {
            //这句话，vue或部分架构中要注释，会造成内存溢出。
            item._layer = layer;
        }

        return layer;
    }


    //创建地图底图
    function createImageryProvider(item, serverURL) {
        if (item.url) {
            if (serverURL) {
                item.url = item.url.replace('$serverURL$', serverURL);
            }
            item.url = item.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
        }

        var opts = {};
        for (var key in item) {
            var value = item[key];
            if (value == null) continue;

            switch (key) {
                default:    //直接赋值
                    opts[key] = value;
                    break;
                case "crs":
                    if (value == "4326" || value.toUpperCase() == "EPSG4326")
                        opts.tilingScheme = new Cesium.GeographicTilingScheme({
                            numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 2,
                            numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1
                        });
                    else
                        opts.tilingScheme = new Cesium.WebMercatorTilingScheme({
                            numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 1,
                            numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1
                        });
                    break;
                case "proxy":
                    opts.proxy = new Cesium.DefaultProxy(value);
                    break;
                case "rectangle":
                    opts.rectangle = Cesium.Rectangle.fromDegrees(value.xmin, value.ymin, value.xmax, value.ymax);
                    break;
            }
        }

        if (opts.proxy) {
            opts.url = new Cesium.Resource({
                url: opts.url,
                proxy: opts.proxy
            });
        }


        var layer;
        switch (opts.type_new || opts.type) {
            //===============地图底图==================== 
            case "single":
            case "image":
                layer = new Cesium.SingleTileImageryProvider(opts);
                break;
            case "xyz":
            case "tile":
                layer = new Cesium.UrlTemplateImageryProvider(opts);
                break;
            case "wms":
                layer = new Cesium.WebMapServiceImageryProvider(opts);
                break;
            case "tms":
                if (!opts.url)
                    opts.url = Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII');
                layer = new Cesium.createTileMapServiceImageryProvider(opts);
                break;
            case "wmts":
                layer = new Cesium.WebMapTileServiceImageryProvider(opts);
                break;
            case "arcgis":
            case "arcgis_tile":
            case "arcgis_dynamic":
                layer = new Cesium.ArcGisMapServerImageryProvider(opts);
                break;
            case "arcgis_cache":
                layer = new _ArcTileImageryProvider(opts);
                break;

                //===============互联网常用地图==================== 

            case "www_tdt"://天地图
                var _layer;
                switch (opts.layer) {
                    default:
                    case "vec_d":
                        _layer = "vec";
                        break;
                    case "vec_z":
                        _layer = "cva";
                        break;
                    case "img_d":
                        _layer = "img";
                        break;
                    case "img_z":
                        _layer = "cia";
                        break;
                    case "ter_d":
                        _layer = "ter";
                        break;
                    case "ter_z":
                        _layer = "cta";
                        break;
                }

                var maxLevel = 18;
                if (item.crs == '4326') {//wgs84   
                    var matrixIds = new Array(maxLevel);
                    for (var z = 0; z <= maxLevel; z++) {
                        matrixIds[z] = (z + 1).toString();
                    }
                    var _url = 'http://t{s}.tianditu.com/' + _layer + '_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles';

                    layer = new Cesium.WebMapTileServiceImageryProvider({
                        url: opts.proxy ? new Cesium.Resource({ url: _url, proxy: opts.proxy }) : _url,
                        layer: _layer,
                        style: 'default',
                        format: 'tiles',
                        tileMatrixSetID: 'c',
                        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                        tileMatrixLabels: matrixIds,
                        tilingScheme: new Cesium.GeographicTilingScheme(), //WebMercatorTilingScheme、GeographicTilingScheme
                        maximumLevel: maxLevel
                    });
                }
                else {  //墨卡托  
                    var matrixIds = new Array(maxLevel);
                    for (var z = 0; z <= maxLevel; z++) {
                        matrixIds[z] = (z).toString();
                    }
                    var _url = 'http://t{s}.tianditu.com/' + _layer + '_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles';

                    layer = new Cesium.WebMapTileServiceImageryProvider({
                        url: opts.proxy ? new Cesium.Resource({ url: _url, proxy: opts.proxy }) : _url,
                        layer: _layer,
                        style: 'default',
                        format: 'tiles',
                        tileMatrixSetID: 'w',
                        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                        tileMatrixLabels: matrixIds,
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: maxLevel
                    });
                }
                break;
            case "www_gaode": //高德
                var _url;
                switch (opts.layer) {
                    case "vec":
                    default://style=7是立体的，style=8是灰色平面的
                        _url = 'http://' + (opts.bigfont ? 'wprd' : 'webrd') + '0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}';
                        break;
                    case "img_d":
                        _url = 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
                        break;
                    case "img_z":
                        _url = 'http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8';
                        break;
                    case "time":
                        var time = new Date().getTime();
                        _url = 'http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=' + time;
                        break;
                }

                layer = new Cesium.UrlTemplateImageryProvider({
                    url: opts.proxy ? new Cesium.Resource({ url: _url, proxy: opts.proxy }) : _url,
                    subdomains: ['1', '2', '3', '4'],
                    maximumLevel: 18
                });
                break;
            case "www_google": //谷歌国内
                var _url;
                switch (opts.layer) {
                    case "vec":
                    default:
                        _url = 'http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile';
                        break;
                    case "img_d":
                        _url = 'http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali';
                        break;
                    case "img_z":
                        _url = 'http://mt{s}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil';
                        break;
                    case "ter":
                        _url = 'http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile';
                        break;
                }

                layer = new Cesium.UrlTemplateImageryProvider({
                    url: opts.proxy ? new Cesium.Resource({ url: _url, proxy: opts.proxy }) : _url,
                    subdomains: ['1', '2', '3'],
                    maximumLevel: 20
                });
                break;
            case "www_osm": //OSM开源地图 
                var _url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                layer = new Cesium.UrlTemplateImageryProvider({
                    url: opts.proxy ? new Cesium.Resource({ url: _url, proxy: opts.proxy }) : _url,
                    subdomains: "abc",
                    maximumLevel: 18
                });
                break;
            case "www_bing": //bing地图 

                var _url = 'https://dev.virtualearth.net';
                //无标记影像 Aerial,
                //有英文标记影像   AerialWithLabels,
                //矢量道路  Road 
                //OrdnanceSurvey,
                //CollinsBart
                var style = opts.layer || Cesium.BingMapsStyle.Aerial;
                layer = new Cesium.BingMapsImageryProvider({
                    url: opts.proxy ? new Cesium.Resource({ url: _url, proxy: opts.proxy }) : _url,
                    key: opts.key || 'AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc',
                    mapStyle: style,
                });
                break;



                //===============内部定义的图层====================
            case "custom_grid":     //网格线 
                layer = new Cesium.GridImageryProvider();
                break;
            case "custom_tilecoord": //瓦片信息
                layer = new Cesium.TileCoordinatesImageryProvider();
                break;
            case "custom_featuregrid": //自定义矢量网格图层
                layer = new _FeatureGridImageryProvider(opts);
                break;
            default:
                console.log("config配置图层未处理:" + item);
                break;
        }
        layer.config = opts;

        return layer;
    }



    //===========模块对外公开的属性及方法=========


    exports.createLayer = createLayer;
    exports.createImageryProvider = createImageryProvider;

    exports.BaseLayer = _BaseLayer;
    exports.GroupLayer = _GroupLayer;

    exports.TileLayer = _TileLayer;
    exports.GltfLayer = _GltfLayer;
    exports.Tiles3dLayer = _Tiles3dLayer;
    exports.GeoJsonLayer = _GeoJsonLayer;
    exports.ArcFeatureLayer = _ArcFeatureLayer;

    exports.CustomFeatureGridLayer = _CustomFeatureGridLayer;
    exports.ArcFeatureGridLayer = _ArcFeatureGridLayer;
    exports.POILayer = _POILayer;

    exports.KmlLayer = _KmlLayer;
    exports.CzmlLayer = _CzmlLayer;


    /***/
}),
/* 22 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-3 14:50:53 | 修改 木遥（QQ：346819890） */
    var _BaseLayer = __webpack_require__(2).default;
    var _layer = __webpack_require__(21)

    var TileLayer = _BaseLayer.extend({
        layer: null,
        //添加 
        add: function () {
            if (this.layer != null) {
                this.remove();
            }
            this.addEx();
            //  liangfan ignored 
            var imageryProvider = _layer.createImageryProvider(this.config); 
            if (imageryProvider == null) return;
            // return;
            var options = this.config;

            var imageryOpt = {
                show: true, alpha: this._opacity
            };
            if (options.rectangle && options.rectangle.xmin && options.rectangle.xmax && options.rectangle.ymin && options.rectangle.ymax) {
                var xmin = options.rectangle.xmin;
                var xmax = options.rectangle.xmax;
                var ymin = options.rectangle.ymin;
                var ymax = options.rectangle.ymax;
                imageryOpt.rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
            }
            if (options.brightness) imageryOpt.brightness = options.brightness;
            if (options.contrast) imageryOpt.contrast = options.contrast;
            if (options.hue) imageryOpt.hue = options.hue;
            if (options.saturation) imageryOpt.saturation = options.saturation;
            if (options.gamma) imageryOpt.gamma = options.gamma;
            if (options.maximumAnisotropy) imageryOpt.maximumAnisotropy = options.maximumAnisotropy;
            if (options.minimumTerrainLevel) imageryOpt.minimumTerrainLevel = options.minimumTerrainLevel;
            if (options.maximumTerrainLevel) imageryOpt.maximumTerrainLevel = options.maximumTerrainLevel;

            this.layer = new Cesium.ImageryLayer(imageryProvider, imageryOpt);
            this.layer.config = this.config;

            this.viewer.imageryLayers.add(this.layer);

            this.setZIndex(this.config.order);
        },
        addEx: function () {
            //子类使用

        },
        //移除
        remove: function () {
            if (this.layer == null) return;

            this.removeEx();
            this.viewer.imageryLayers.remove(this.layer, true);
            this.layer = null;
        },
        removeEx: function () {
            //子类使用

        },
        //设置透明度
        hasOpacity: true,
        _opacity: 1,
        setOpacity: function (value) {
            this._opacity = value;
            if (this.layer == null) return;

            this.layer.alpha = value;
        },
        //设置叠加顺序
        hasZIndex: true,
        setZIndex: function (order) {
            if (this.layer == null || order == null) return;

            //先移动到最顶层
            this.viewer.imageryLayers.raiseToTop(this.layer);

            var layers = this.viewer.imageryLayers._layers;
            for (var i = layers.length - 1; i >= 0; i--) {
                if (layers[i] == this.layer) continue;
                var _temp = layers[i].config;
                if (_temp && _temp.order) {
                    if (order < _temp.order) {
                        this.viewer.imageryLayers.lower(this.layer);

                    }
                }
            }
        },


    });

    /* harmony default export */ __webpack_exports__["default"] = (TileLayer);

    /***/
}),
/* 23 */
/***/ (function (module, exports, __webpack_require__) {

    /* 修改 木遥（QQ：346819890） */


    //leaflet
    __webpack_require__(27);
    __webpack_require__(26);


    __webpack_require__(24)

    var MarsGIS = __webpack_require__(50);


    //widget
    __webpack_require__(57)
    __webpack_require__(25)
    MarsGIS['widget'] = __webpack_require__(58).default;
    MarsGIS['widget']['BaseWidget'] = __webpack_require__(56).default;



    /*global self*/
    var scope = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {};
    scope.mars3d = MarsGIS;

    //delete scope.L; 
    console.log('当前Cesium版本：' + (scope.Cesium && scope.Cesium.VERSION ? Cesium.VERSION : '未知') + " ， MarsGIS版本：" + MarsGIS.version);

    /***/
}),
/* 24 */
/***/ (function (module, exports) {

    // removed by extract-text-webpack-plugin

    /***/
}),
/* 25 */
/***/ (function (module, exports) {

    // removed by extract-text-webpack-plugin

    /***/
}),
/* 26 */
/***/ (function (module, exports) {

    /* 2017-9-28 14:03:17 | 修改 木遥（QQ：346819890） */


    /* esri-leaflet - v2.0.8 - Tue Mar 21 2017 16:09:38 GMT-0700 (PDT)
     * Copyright (c) 2017 Environmental Systems Research Institute, Inc.
     * Apache-2.0 */
    (function () {
        'use strict';

        var L$1 = window.L;
        var L$1__default = 'default' in L$1 ? L$1['default'] : L$1;

        var version = "2.0.8";

        var cors = ((window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest()));
        var pointerEvents = document.documentElement.style.pointerEvents === '';

        var Support = {
            cors: cors,
            pointerEvents: pointerEvents
        };

        var options = {
            attributionWidthOffset: 55
        };

        var callbacks = 0;

        function serialize(params) {
            var data = '';

            params.f = params.f || 'json';

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var param = params[key];
                    var type = Object.prototype.toString.call(param);
                    var value;

                    if (data.length) {
                        data += '&';
                    }

                    if (type === '[object Array]') {
                        value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
                    } else if (type === '[object Object]') {
                        value = JSON.stringify(param);
                    } else if (type === '[object Date]') {
                        value = param.valueOf();
                    } else {
                        value = param;
                    }

                    data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                }
            }

            return data;
        }

        function createRequest(callback, context) {
            var httpRequest = new window.XMLHttpRequest();

            httpRequest.onerror = function (e) {
                httpRequest.onreadystatechange = L$1.Util.falseFn;

                callback.call(context, {
                    error: {
                        code: 500,
                        message: 'XMLHttpRequest error'
                    }
                }, null);
            };

            httpRequest.onreadystatechange = function () {
                var response;
                var error;

                if (httpRequest.readyState === 4) {
                    try {
                        response = JSON.parse(httpRequest.responseText);
                    } catch (e) {
                        response = null;
                        error = {
                            code: 500,
                            message: 'Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.'
                        };
                    }

                    if (!error && response.error) {
                        error = response.error;
                        response = null;
                    }

                    httpRequest.onerror = L$1.Util.falseFn;

                    callback.call(context, error, response);
                }
            };

            httpRequest.ontimeout = function () {
                this.onerror();
            };

            return httpRequest;
        }

        function xmlHttpPost(url, params, callback, context) {
            var httpRequest = createRequest(callback, context);
            httpRequest.open('POST', url);

            if (typeof context !== 'undefined' && context !== null) {
                if (typeof context.options !== 'undefined') {
                    httpRequest.timeout = context.options.timeout;
                }
            }
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequest.send(serialize(params));

            return httpRequest;
        }

        function xmlHttpGet(url, params, callback, context) {
            var httpRequest = createRequest(callback, context);
            httpRequest.open('GET', url + '?' + serialize(params), true);

            if (typeof context !== 'undefined' && context !== null) {
                if (typeof context.options !== 'undefined') {
                    httpRequest.timeout = context.options.timeout;
                }
            }
            httpRequest.send(null);

            return httpRequest;
        }

        // AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
        function request(url, params, callback, context) {
            var paramString = serialize(params);
            var httpRequest = createRequest(callback, context);
            var requestLength = (url + '?' + paramString).length;

            // ie10/11 require the request be opened before a timeout is applied
            if (requestLength <= 2000 && Support.cors) {
                httpRequest.open('GET', url + '?' + paramString);
            } else if (requestLength > 2000 && Support.cors) {
                httpRequest.open('POST', url);
                httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }

            if (typeof context !== 'undefined' && context !== null) {
                if (typeof context.options !== 'undefined') {
                    httpRequest.timeout = context.options.timeout;
                }
            }

            // request is less than 2000 characters and the browser supports CORS, make GET request with XMLHttpRequest
            if (requestLength <= 2000 && Support.cors) {
                httpRequest.send(null);

                // request is more than 2000 characters and the browser supports CORS, make POST request with XMLHttpRequest
            } else if (requestLength > 2000 && Support.cors) {
                httpRequest.send(paramString);

                // request is less  than 2000 characters and the browser does not support CORS, make a JSONP request
            } else if (requestLength <= 2000 && !Support.cors) {
                return jsonp(url, params, callback, context);

                // request is longer then 2000 characters and the browser does not support CORS, log a warning
            } else {
                warn('a request to ' + url + ' was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html');
                return;
            }

            return httpRequest;
        }

        function jsonp(url, params, callback, context) {
            window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {};
            var callbackId = 'c' + callbacks;
            params.callback = 'window._EsriLeafletCallbacks.' + callbackId;

            window._EsriLeafletCallbacks[callbackId] = function (response) {
                if (window._EsriLeafletCallbacks[callbackId] !== true) {
                    var error;
                    var responseType = Object.prototype.toString.call(response);

                    if (!(responseType === '[object Object]' || responseType === '[object Array]')) {
                        error = {
                            error: {
                                code: 500,
                                message: 'Expected array or object as JSONP response'
                            }
                        };
                        response = null;
                    }

                    if (!error && response.error) {
                        error = response;
                        response = null;
                    }

                    callback.call(context, error, response);
                    window._EsriLeafletCallbacks[callbackId] = true;
                }
            };

            var script = L$1.DomUtil.create('script', null, document.body);
            script.type = 'text/javascript';
            script.src = url + '?' + serialize(params);
            script.id = callbackId;

            callbacks++;

            return {
                id: callbackId,
                url: script.src,
                abort: function () {
                    window._EsriLeafletCallbacks._callback[callbackId]({
                        code: 0,
                        message: 'Request aborted.'
                    });
                }
            };
        }

        var get = ((Support.cors) ? xmlHttpGet : jsonp);
        get.CORS = xmlHttpGet;
        get.JSONP = jsonp;

        // export the Request object to call the different handlers for debugging
        var Request = {
            request: request,
            get: get,
            post: xmlHttpPost
        };

        /*
         * Copyright 2015 Esri
         *
         * Licensed under the Apache License, Version 2.0 (the "License");
         * you may not use this file except in compliance with the License.
         * You may obtain a copy of the License at
         *
         *     http://www.apache.org/licenses/LICENSE-2.0
         *
         * Unless required by applicable law or agreed to in writing, software
         * distributed under the License is distributed on an "AS IS" BASIS,
         * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         * See the License for the specific language governing permissions and
         * limitations under the Liscense.
         */

        // checks if 2 x,y points are equal
        function pointsEqual(a, b) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        }

        // checks if the first and last points of a ring are equal and closes the ring
        function closeRing(coordinates) {
            if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
                coordinates.push(coordinates[0]);
            }
            return coordinates;
        }

        // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
        // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
        // points-are-in-clockwise-order
        function ringIsClockwise(ringToTest) {
            var total = 0;
            var i = 0;
            var rLength = ringToTest.length;
            var pt1 = ringToTest[i];
            var pt2;
            for (i; i < rLength - 1; i++) {
                pt2 = ringToTest[i + 1];
                total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
                pt1 = pt2;
            }
            return (total >= 0);
        }

        // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L504-L519
        function vertexIntersectsVertex(a1, a2, b1, b2) {
            var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
            var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
            var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

            if (uB !== 0) {
                var ua = uaT / uB;
                var ub = ubT / uB;

                if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                    return true;
                }
            }

            return false;
        }

        // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L521-L531
        function arrayIntersectsArray(a, b) {
            for (var i = 0; i < a.length - 1; i++) {
                for (var j = 0; j < b.length - 1; j++) {
                    if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
                        return true;
                    }
                }
            }

            return false;
        }

        // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L470-L480
        function coordinatesContainPoint(coordinates, point) {
            var contains = false;
            for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
                if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
                     (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
                    (point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])) {
                    contains = !contains;
                }
            }
            return contains;
        }

        // ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L106-L113
        function coordinatesContainCoordinates(outer, inner) {
            var intersects = arrayIntersectsArray(outer, inner);
            var contains = coordinatesContainPoint(outer, inner[0]);
            if (!intersects && contains) {
                return true;
            }
            return false;
        }

        // do any polygons in this array contain any other polygons in this array?
        // used for checking for holes in arcgis rings
        // ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L117-L172
        function convertRingsToGeoJSON(rings) {
            var outerRings = [];
            var holes = [];
            var x; // iterator
            var outerRing; // current outer ring being evaluated
            var hole; // current hole being evaluated

            // for each ring
            for (var r = 0; r < rings.length; r++) {
                var ring = closeRing(rings[r].slice(0));
                if (ring.length < 4) {
                    continue;
                }
                // is this ring an outer ring? is it clockwise?
                if (ringIsClockwise(ring)) {
                    var polygon = [ring];
                    outerRings.push(polygon); // push to outer rings
                } else {
                    holes.push(ring); // counterclockwise push to holes
                }
            }

            var uncontainedHoles = [];

            // while there are holes left...
            while (holes.length) {
                // pop a hole off out stack
                hole = holes.pop();

                // loop over all outer rings and see if they contain our hole.
                var contained = false;
                for (x = outerRings.length - 1; x >= 0; x--) {
                    outerRing = outerRings[x][0];
                    if (coordinatesContainCoordinates(outerRing, hole)) {
                        // the hole is contained push it into our polygon
                        outerRings[x].push(hole);
                        contained = true;
                        break;
                    }
                }

                // ring is not contained in any outer ring
                // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320
                if (!contained) {
                    uncontainedHoles.push(hole);
                }
            }

            // if we couldn't match any holes using contains we can try intersects...
            while (uncontainedHoles.length) {
                // pop a hole off out stack
                hole = uncontainedHoles.pop();

                // loop over all outer rings and see if any intersect our hole.
                var intersects = false;

                for (x = outerRings.length - 1; x >= 0; x--) {
                    outerRing = outerRings[x][0];
                    if (arrayIntersectsArray(outerRing, hole)) {
                        // the hole is contained push it into our polygon
                        outerRings[x].push(hole);
                        intersects = true;
                        break;
                    }
                }

                if (!intersects) {
                    outerRings.push([hole.reverse()]);
                }
            }

            if (outerRings.length === 1) {
                return {
                    type: 'Polygon',
                    coordinates: outerRings[0]
                };
            } else {
                return {
                    type: 'MultiPolygon',
                    coordinates: outerRings
                };
            }
        }

        // This function ensures that rings are oriented in the right directions
        // outer rings are clockwise, holes are counterclockwise
        // used for converting GeoJSON Polygons to ArcGIS Polygons
        function orientRings(poly) {
            var output = [];
            var polygon = poly.slice(0);
            var outerRing = closeRing(polygon.shift().slice(0));
            if (outerRing.length >= 4) {
                if (!ringIsClockwise(outerRing)) {
                    outerRing.reverse();
                }

                output.push(outerRing);

                for (var i = 0; i < polygon.length; i++) {
                    var hole = closeRing(polygon[i].slice(0));
                    if (hole.length >= 4) {
                        if (ringIsClockwise(hole)) {
                            hole.reverse();
                        }
                        output.push(hole);
                    }
                }
            }

            return output;
        }

        // This function flattens holes in multipolygons to one array of polygons
        // used for converting GeoJSON Polygons to ArcGIS Polygons
        function flattenMultiPolygonRings(rings) {
            var output = [];
            for (var i = 0; i < rings.length; i++) {
                var polygon = orientRings(rings[i]);
                for (var x = polygon.length - 1; x >= 0; x--) {
                    var ring = polygon[x].slice(0);
                    output.push(ring);
                }
            }
            return output;
        }

        // shallow object clone for feature properties and attributes
        // from http://jsperf.com/cloning-an-object/2
        function shallowClone$1(obj) {
            var target = {};
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    target[i] = obj[i];
                }
            }
            return target;
        }

        function arcgisToGeoJSON$1(arcgis, idAttribute) {
            var geojson = {};

            if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
                geojson.type = 'Point';
                geojson.coordinates = [arcgis.x, arcgis.y];
            }

            if (arcgis.points) {
                geojson.type = 'MultiPoint';
                geojson.coordinates = arcgis.points.slice(0);
            }

            if (arcgis.paths) {
                if (arcgis.paths.length === 1) {
                    geojson.type = 'LineString';
                    geojson.coordinates = arcgis.paths[0].slice(0);
                } else {
                    geojson.type = 'MultiLineString';
                    geojson.coordinates = arcgis.paths.slice(0);
                }
            }

            if (arcgis.rings) {
                geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
            }

            if (arcgis.geometry || arcgis.attributes) {
                geojson.type = 'Feature';
                geojson.geometry = (arcgis.geometry) ? arcgisToGeoJSON$1(arcgis.geometry) : null;
                geojson.properties = (arcgis.attributes) ? shallowClone$1(arcgis.attributes) : null;
                if (arcgis.attributes) {
                    geojson.id = arcgis.attributes[idAttribute] || arcgis.attributes.OBJECTID || arcgis.attributes.FID;
                }
            }

            return geojson;
        }

        function geojsonToArcGIS$1(geojson, idAttribute) {
            idAttribute = idAttribute || 'OBJECTID';
            var spatialReference = { wkid: 4326 };
            var result = {};
            var i;

            switch (geojson.type) {
                case 'Point':
                    result.x = geojson.coordinates[0];
                    result.y = geojson.coordinates[1];
                    result.spatialReference = spatialReference;
                    break;
                case 'MultiPoint':
                    result.points = geojson.coordinates.slice(0);
                    result.spatialReference = spatialReference;
                    break;
                case 'LineString':
                    result.paths = [geojson.coordinates.slice(0)];
                    result.spatialReference = spatialReference;
                    break;
                case 'MultiLineString':
                    result.paths = geojson.coordinates.slice(0);
                    result.spatialReference = spatialReference;
                    break;
                case 'Polygon':
                    result.rings = orientRings(geojson.coordinates.slice(0));
                    result.spatialReference = spatialReference;
                    break;
                case 'MultiPolygon':
                    result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
                    result.spatialReference = spatialReference;
                    break;
                case 'Feature':
                    if (geojson.geometry) {
                        result.geometry = geojsonToArcGIS$1(geojson.geometry, idAttribute);
                    }
                    result.attributes = (geojson.properties) ? shallowClone$1(geojson.properties) : {};
                    if (geojson.id) {
                        result.attributes[idAttribute] = geojson.id;
                    }
                    break;
                case 'FeatureCollection':
                    result = [];
                    for (i = 0; i < geojson.features.length; i++) {
                        result.push(geojsonToArcGIS$1(geojson.features[i], idAttribute));
                    }
                    break;
                case 'GeometryCollection':
                    result = [];
                    for (i = 0; i < geojson.geometries.length; i++) {
                        result.push(geojsonToArcGIS$1(geojson.geometries[i], idAttribute));
                    }
                    break;
            }

            return result;
        }

        function geojsonToArcGIS(geojson, idAttr) {
            return geojsonToArcGIS$1(geojson, idAttr);
        }

        function arcgisToGeoJSON(arcgis, idAttr) {
            return arcgisToGeoJSON$1(arcgis, idAttr);
        }

        // shallow object clone for feature properties and attributes
        // from http://jsperf.com/cloning-an-object/2
        function shallowClone(obj) {
            var target = {};
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    target[i] = obj[i];
                }
            }
            return target;
        }

        // convert an extent (ArcGIS) to LatLngBounds (Leaflet)
        function extentToBounds(extent) {
            // "NaN" coordinates from ArcGIS Server indicate a null geometry
            if (extent.xmin !== 'NaN' && extent.ymin !== 'NaN' && extent.xmax !== 'NaN' && extent.ymax !== 'NaN') {
                var sw = L$1.latLng(extent.ymin, extent.xmin);
                var ne = L$1.latLng(extent.ymax, extent.xmax);
                return L$1.latLngBounds(sw, ne);
            } else {
                return null;
            }
        }

        // convert an LatLngBounds (Leaflet) to extent (ArcGIS)
        function boundsToExtent(bounds) {
            bounds = L$1.latLngBounds(bounds);
            return {
                'xmin': bounds.getSouthWest().lng,
                'ymin': bounds.getSouthWest().lat,
                'xmax': bounds.getNorthEast().lng,
                'ymax': bounds.getNorthEast().lat,
                'spatialReference': {
                    'wkid': 4326
                }
            };
        }

        function responseToFeatureCollection(response, idAttribute) {
            var objectIdField;
            var features = response.features || response.results;
            var count = features.length;

            if (idAttribute) {
                objectIdField = idAttribute;
            } else if (response.objectIdFieldName) {
                objectIdField = response.objectIdFieldName;
            } else if (response.fields) {
                for (var j = 0; j <= response.fields.length - 1; j++) {
                    if (response.fields[j].type === 'esriFieldTypeOID') {
                        objectIdField = response.fields[j].name;
                        break;
                    }
                }
            } else if (count) {
                /* as a last resort, check for common ID fieldnames in the first feature returned
                not foolproof. identifyFeatures can returned a mixed array of features. */
                for (var key in features[0].attributes) {
                    if (key.match(/^(OBJECTID|FID|OID|ID)$/i)) {
                        objectIdField = key;
                        break;
                    }
                }
            }

            var featureCollection = {
                type: 'FeatureCollection',
                features: []
            };

            if (count) {
                for (var i = features.length - 1; i >= 0; i--) {
                    var feature = arcgisToGeoJSON(features[i], objectIdField);
                    featureCollection.features.push(feature);
                }
            }

            return featureCollection;
        }

        // trim url whitespace and add a trailing slash if needed
        function cleanUrl(url) {
            // trim leading and trailing spaces, but not spaces inside the url
            url = L$1.Util.trim(url);

            // add a trailing slash to the url if the user omitted it
            if (url[url.length - 1] !== '/') {
                url += '/';
            }

            return url;
        }

        function isArcgisOnline(url) {
            /* hosted feature services support geojson as an output format
            utility.arcgis.com services are proxied from a variety of ArcGIS Server vintages, and may not */
            return (/^(?!.*utility\.arcgis\.com).*\.arcgis\.com.*FeatureServer/i).test(url);
        }

        function geojsonTypeToArcGIS(geoJsonType) {
            var arcgisGeometryType;
            switch (geoJsonType) {
                case 'Point':
                    arcgisGeometryType = 'esriGeometryPoint';
                    break;
                case 'MultiPoint':
                    arcgisGeometryType = 'esriGeometryMultipoint';
                    break;
                case 'LineString':
                    arcgisGeometryType = 'esriGeometryPolyline';
                    break;
                case 'MultiLineString':
                    arcgisGeometryType = 'esriGeometryPolyline';
                    break;
                case 'Polygon':
                    arcgisGeometryType = 'esriGeometryPolygon';
                    break;
                case 'MultiPolygon':
                    arcgisGeometryType = 'esriGeometryPolygon';
                    break;
            }

            return arcgisGeometryType;
        }

        function warn() {
            if (console && console.warn) {
                console.warn.apply(console, arguments);
            }
        }

        function calcAttributionWidth(map) {
            // either crop at 55px or user defined buffer
            return (map.getSize().x - options.attributionWidthOffset) + 'px';
        }

        function setEsriAttribution(map) {
            if (map.attributionControl && !map.attributionControl._esriAttributionAdded) {
                map.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Powered by <a href="https://www.esri.com">Esri</a>');

                var hoverAttributionStyle = document.createElement('style');
                hoverAttributionStyle.type = 'text/css';
                hoverAttributionStyle.innerHTML = '.esri-truncated-attribution:hover {' +
                  'white-space: normal;' +
                '}';

                document.getElementsByTagName('head')[0].appendChild(hoverAttributionStyle);
                L$1.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution:hover');

                // define a new css class in JS to trim attribution into a single line
                var attributionStyle = document.createElement('style');
                attributionStyle.type = 'text/css';
                attributionStyle.innerHTML = '.esri-truncated-attribution {' +
                  'vertical-align: -3px;' +
                  'white-space: nowrap;' +
                  'overflow: hidden;' +
                  'text-overflow: ellipsis;' +
                  'display: inline-block;' +
                  'transition: 0s white-space;' +
                  'transition-delay: 1s;' +
                  'max-width: ' + calcAttributionWidth(map) + ';' +
                '}';

                document.getElementsByTagName('head')[0].appendChild(attributionStyle);
                L$1.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution');

                // update the width used to truncate when the map itself is resized
                map.on('resize', function (e) {
                    map.attributionControl._container.style.maxWidth = calcAttributionWidth(e.target);
                });

                map.attributionControl._esriAttributionAdded = true;
            }
        }

        function _getAttributionData(url, map) {
            jsonp(url, {}, L$1.Util.bind(function (error, attributions) {
                if (error) { return; }
                map._esriAttributions = [];
                for (var c = 0; c < attributions.contributors.length; c++) {
                    var contributor = attributions.contributors[c];

                    for (var i = 0; i < contributor.coverageAreas.length; i++) {
                        var coverageArea = contributor.coverageAreas[i];
                        var southWest = L$1.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
                        var northEast = L$1.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
                        map._esriAttributions.push({
                            attribution: contributor.attribution,
                            score: coverageArea.score,
                            bounds: L$1.latLngBounds(southWest, northEast),
                            minZoom: coverageArea.zoomMin,
                            maxZoom: coverageArea.zoomMax
                        });
                    }
                }

                map._esriAttributions.sort(function (a, b) {
                    return b.score - a.score;
                });

                // pass the same argument as the map's 'moveend' event
                var obj = { target: map };
                _updateMapAttribution(obj);
            }, this));
        }

        function _updateMapAttribution(evt) {
            var map = evt.target;
            var oldAttributions = map._esriAttributions;

            if (map && map.attributionControl && oldAttributions) {
                var newAttributions = '';
                var bounds = map.getBounds();
                var wrappedBounds = L$1.latLngBounds(
                  bounds.getSouthWest().wrap(),
                  bounds.getNorthEast().wrap()
                );
                var zoom = map.getZoom();

                for (var i = 0; i < oldAttributions.length; i++) {
                    var attribution = oldAttributions[i];
                    var text = attribution.attribution;

                    if (!newAttributions.match(text) && attribution.bounds.intersects(wrappedBounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
                        newAttributions += (', ' + text);
                    }
                }

                newAttributions = newAttributions.substr(2);
                var attributionElement = map.attributionControl._container.querySelector('.esri-dynamic-attribution');

                attributionElement.innerHTML = newAttributions;
                attributionElement.style.maxWidth = calcAttributionWidth(map);

                map.fire('attributionupdated', {
                    attribution: newAttributions
                });
            }
        }

        var EsriUtil = {
            shallowClone: shallowClone,
            warn: warn,
            cleanUrl: cleanUrl,
            isArcgisOnline: isArcgisOnline,
            geojsonTypeToArcGIS: geojsonTypeToArcGIS,
            responseToFeatureCollection: responseToFeatureCollection,
            geojsonToArcGIS: geojsonToArcGIS,
            arcgisToGeoJSON: arcgisToGeoJSON,
            boundsToExtent: boundsToExtent,
            extentToBounds: extentToBounds,
            calcAttributionWidth: calcAttributionWidth,
            setEsriAttribution: setEsriAttribution,
            _getAttributionData: _getAttributionData,
            _updateMapAttribution: _updateMapAttribution
        };

        var Task = L$1.Class.extend({

            options: {
                proxy: false,
                useCors: cors
            },

            // Generate a method for each methodName:paramName in the setters for this task.
            generateSetter: function (param, context) {
                return L$1.Util.bind(function (value) {
                    this.params[param] = value;
                    return this;
                }, context);
            },

            initialize: function (endpoint) {
                // endpoint can be either a url (and options) for an ArcGIS Rest Service or an instance of EsriLeaflet.Service
                if (endpoint.request && endpoint.options) {
                    this._service = endpoint;
                    L$1.Util.setOptions(this, endpoint.options);
                } else {
                    L$1.Util.setOptions(this, endpoint);
                    this.options.url = cleanUrl(endpoint.url);
                }

                // clone default params into this object
                this.params = L$1.Util.extend({}, this.params || {});

                // generate setter methods based on the setters object implimented a child class
                if (this.setters) {
                    for (var setter in this.setters) {
                        var param = this.setters[setter];
                        this[setter] = this.generateSetter(param, this);
                    }
                }
            },

            token: function (token) {
                if (this._service) {
                    this._service.authenticate(token);
                } else {
                    this.params.token = token;
                }
                return this;
            },

            request: function (callback, context) {
                if (this._service) {
                    return this._service.request(this.path, this.params, callback, context);
                }

                return this._request('request', this.path, this.params, callback, context);
            },

            _request: function (method, path, params, callback, context) {
                var url = (this.options.proxy) ? this.options.proxy + '?' + this.options.url + path : this.options.url + path;

                if ((method === 'get' || method === 'request') && !this.options.useCors) {
                    return Request.get.JSONP(url, params, callback, context);
                }

                return Request[method](url, params, callback, context);
            }
        });

        function task(options) {
            return new Task(options);
        }

        var Query = Task.extend({
            setters: {
                'offset': 'resultOffset',
                'limit': 'resultRecordCount',
                'fields': 'outFields',
                'precision': 'geometryPrecision',
                'featureIds': 'objectIds',
                'returnGeometry': 'returnGeometry',
                'token': 'token'
            },

            path: 'query',

            params: {
                returnGeometry: true,
                where: '1=1',
                outSr: 4326,
                outFields: '*'
            },

            // Returns a feature if its shape is wholly contained within the search geometry. Valid for all shape type combinations.
            within: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelContains'; // to the REST api this reads geometry **contains** layer
                return this;
            },

            // Returns a feature if any spatial relationship is found. Applies to all shape type combinations.
            intersects: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelIntersects';
                return this;
            },

            // Returns a feature if its shape wholly contains the search geometry. Valid for all shape type combinations.
            contains: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelWithin'; // to the REST api this reads geometry **within** layer
                return this;
            },

            // Returns a feature if the intersection of the interiors of the two shapes is not empty and has a lower dimension than the maximum dimension of the two shapes. Two lines that share an endpoint in common do not cross. Valid for Line/Line, Line/Area, Multi-point/Area, and Multi-point/Line shape type combinations.
            crosses: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelCrosses';
                return this;
            },

            // Returns a feature if the two shapes share a common boundary. However, the intersection of the interiors of the two shapes must be empty. In the Point/Line case, the point may touch an endpoint only of the line. Applies to all combinations except Point/Point.
            touches: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelTouches';
                return this;
            },

            // Returns a feature if the intersection of the two shapes results in an object of the same dimension, but different from both of the shapes. Applies to Area/Area, Line/Line, and Multi-point/Multi-point shape type combinations.
            overlaps: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelOverlaps';
                return this;
            },

            // Returns a feature if the envelope of the two shapes intersects.
            bboxIntersects: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelEnvelopeIntersects';
                return this;
            },

            // if someone can help decipher the ArcObjects explanation and translate to plain speak, we should mention this method in the doc
            indexIntersects: function (geometry) {
                this._setGeometry(geometry);
                this.params.spatialRel = 'esriSpatialRelIndexIntersects'; // Returns a feature if the envelope of the query geometry intersects the index entry for the target geometry
                return this;
            },

            // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
            nearby: function (latlng, radius) {
                latlng = L$1.latLng(latlng);
                this.params.geometry = [latlng.lng, latlng.lat];
                this.params.geometryType = 'esriGeometryPoint';
                this.params.spatialRel = 'esriSpatialRelIntersects';
                this.params.units = 'esriSRUnit_Meter';
                this.params.distance = radius;
                this.params.inSr = 4326;
                return this;
            },

            where: function (string) {
                // instead of converting double-quotes to single quotes, pass as is, and provide a more informative message if a 400 is encountered
                this.params.where = string;
                return this;
            },

            between: function (start, end) {
                this.params.time = [start.valueOf(), end.valueOf()];
                return this;
            },

            simplify: function (map, factor) {
                var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
                this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
                return this;
            },

            orderBy: function (fieldName, order) {
                order = order || 'ASC';
                this.params.orderByFields = (this.params.orderByFields) ? this.params.orderByFields + ',' : '';
                this.params.orderByFields += ([fieldName, order]).join(' ');
                return this;
            },

            run: function (callback, context) {
                this._cleanParams();

                // services hosted on ArcGIS Online and ArcGIS Server 10.3.1+ support requesting geojson directly
                if (this.options.isModern || isArcgisOnline(this.options.url)) {
                    this.params.f = 'geojson';

                    return this.request(function (error, response) {
                        this._trapSQLerrors(error);
                        callback.call(context, error, response, response);
                    }, this);

                    // otherwise convert it in the callback then pass it on
                } else {
                    return this.request(function (error, response) {
                        this._trapSQLerrors(error);
                        callback.call(context, error, (response && responseToFeatureCollection(response)), response);
                    }, this);
                }
            },

            count: function (callback, context) {
                this._cleanParams();
                this.params.returnCountOnly = true;
                return this.request(function (error, response) {
                    callback.call(this, error, (response && response.count), response);
                }, context);
            },

            ids: function (callback, context) {
                this._cleanParams();
                this.params.returnIdsOnly = true;
                return this.request(function (error, response) {
                    callback.call(this, error, (response && response.objectIds), response);
                }, context);
            },

            // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
            bounds: function (callback, context) {
                this._cleanParams();
                this.params.returnExtentOnly = true;
                return this.request(function (error, response) {
                    if (response && response.extent && extentToBounds(response.extent)) {
                        callback.call(context, error, extentToBounds(response.extent), response);
                    } else {
                        error = {
                            message: 'Invalid Bounds'
                        };
                        callback.call(context, error, null, response);
                    }
                }, context);
            },

            // only valid for image services
            pixelSize: function (rawPoint) {
                var castPoint = L$1.point(rawPoint);
                this.params.pixelSize = [castPoint.x, castPoint.y];
                return this;
            },

            // only valid for map services
            layer: function (layer) {
                this.path = layer + '/query';
                return this;
            },

            _trapSQLerrors: function (error) {
                if (error) {
                    if (error.code === '400') {
                        warn('one common syntax error in query requests is encasing string values in double quotes instead of single quotes');
                    }
                }
            },

            _cleanParams: function () {
                delete this.params.returnIdsOnly;
                delete this.params.returnExtentOnly;
                delete this.params.returnCountOnly;
            },

            _setGeometry: function (geometry) {
                this.params.inSr = 4326;

                // convert bounds to extent and finish
                if (geometry instanceof L$1.LatLngBounds) {
                    // set geometry + geometryType
                    this.params.geometry = boundsToExtent(geometry);
                    this.params.geometryType = 'esriGeometryEnvelope';
                    return;
                }

                // convert L.Marker > L.LatLng
                if (geometry.getLatLng) {
                    geometry = geometry.getLatLng();
                }

                // convert L.LatLng to a geojson point and continue;
                if (geometry instanceof L$1.LatLng) {
                    geometry = {
                        type: 'Point',
                        coordinates: [geometry.lng, geometry.lat]
                    };
                }

                // handle L.GeoJSON, pull out the first geometry
                if (geometry instanceof L$1.GeoJSON) {
                    // reassign geometry to the GeoJSON value  (we are assuming that only one feature is present)
                    geometry = geometry.getLayers()[0].feature.geometry;
                    this.params.geometry = geojsonToArcGIS(geometry);
                    this.params.geometryType = geojsonTypeToArcGIS(geometry.type);
                }

                // Handle L.Polyline and L.Polygon
                if (geometry.toGeoJSON) {
                    geometry = geometry.toGeoJSON();
                }

                // handle GeoJSON feature by pulling out the geometry
                if (geometry.type === 'Feature') {
                    // get the geometry of the geojson feature
                    geometry = geometry.geometry;
                }

                // confirm that our GeoJSON is a point, line or polygon
                if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
                    this.params.geometry = geojsonToArcGIS(geometry);
                    this.params.geometryType = geojsonTypeToArcGIS(geometry.type);
                    return;
                }

                // warn the user if we havn't found an appropriate object
                warn('invalid geometry passed to spatial query. Should be L.LatLng, L.LatLngBounds, L.Marker or a GeoJSON Point, Line, Polygon or MultiPolygon object');

                return;
            }
        });

        function query(options) {
            return new Query(options);
        }

        var Find = Task.extend({
            setters: {
                // method name > param name
                'contains': 'contains',
                'text': 'searchText',
                'fields': 'searchFields', // denote an array or single string
                'spatialReference': 'sr',
                'sr': 'sr',
                'layers': 'layers',
                'returnGeometry': 'returnGeometry',
                'maxAllowableOffset': 'maxAllowableOffset',
                'precision': 'geometryPrecision',
                'dynamicLayers': 'dynamicLayers',
                'returnZ': 'returnZ',
                'returnM': 'returnM',
                'gdbVersion': 'gdbVersion',
                'token': 'token'
            },

            path: 'find',

            params: {
                sr: 4326,
                contains: true,
                returnGeometry: true,
                returnZ: true,
                returnM: false
            },

            layerDefs: function (id, where) {
                this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
                this.params.layerDefs += ([id, where]).join(':');
                return this;
            },

            simplify: function (map, factor) {
                var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
                this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
                return this;
            },

            run: function (callback, context) {
                return this.request(function (error, response) {
                    callback.call(context, error, (response && responseToFeatureCollection(response)), response);
                }, context);
            }
        });

        function find(options) {
            return new Find(options);
        }

        var Identify = Task.extend({
            path: 'identify',

            between: function (start, end) {
                this.params.time = [start.valueOf(), end.valueOf()];
                return this;
            }
        });

        function identify(options) {
            return new Identify(options);
        }


        L.esri = {};
        L.esri.VERSION = version;
        L.esri.Support = Support;
        L.esri.options = options;
        L.esri.Util = EsriUtil;
        L.esri.get = get;
        L.esri.post = xmlHttpPost;
        L.esri.request = request;
        L.esri.Task = Task;
        L.esri.task = task;
        L.esri.Query = Query;
        L.esri.query = query;
        L.esri.Find = Find;
        L.esri.find = find;
        L.esri.Identify = Identify;
        L.esri.identify = identify;

    })();



    /***/
}),
/* 27 */
/***/ (function (module, exports, __webpack_require__) {

    /* 2017-9-30 11:32:09 | 修改 木遥（QQ：346819890） */

    (function (global, factory) {
        true ? factory(exports) :
       typeof define === 'function' && define.amd ? define(['exports'], factory) :
       (factory((global.L = {})));
    }(this, (function (exports) {
        'use strict';

        var version = "1.2.0+HEAD.1ac320b";

        /*
         * @namespace Util
         *
         * Various utility functions, used by Leaflet internally.
         */

        var freeze = Object.freeze;
        Object.freeze = function (obj) { return obj; };

        // @function extend(dest: Object, src?: Object): Object
        // Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
        function extend(dest) {
            var i, j, len, src;

            for (j = 1, len = arguments.length; j < len; j++) {
                src = arguments[j];
                for (i in src) {
                    dest[i] = src[i];
                }
            }
            return dest;
        }

        // @function create(proto: Object, properties?: Object): Object
        // Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
        var create = Object.create || (function () {
            function F() { }
            return function (proto) {
                F.prototype = proto;
                return new F();
            };
        })();

        // @function bind(fn: Function, …): Function
        // Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
        // Has a `L.bind()` shortcut.
        function bind(fn, obj) {
            var slice = Array.prototype.slice;

            if (fn.bind) {
                return fn.bind.apply(fn, slice.call(arguments, 1));
            }

            var args = slice.call(arguments, 2);

            return function () {
                return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
            };
        }

        // @property lastId: Number
        // Last unique ID used by [`stamp()`](#util-stamp)
        var lastId = 0;

        // @function stamp(obj: Object): Number
        // Returns the unique ID of an object, assiging it one if it doesn't have it.
        function stamp(obj) {
            /*eslint-disable */
            obj._leaflet_id = obj._leaflet_id || ++lastId;
            return obj._leaflet_id;
            /*eslint-enable */
        }

        // @function throttle(fn: Function, time: Number, context: Object): Function
        // Returns a function which executes function `fn` with the given scope `context`
        // (so that the `this` keyword refers to `context` inside `fn`'s code). The function
        // `fn` will be called no more than one time per given amount of `time`. The arguments
        // received by the bound function will be any arguments passed when binding the
        // function, followed by any arguments passed when invoking the bound function.
        // Has an `L.throttle` shortcut.
        function throttle(fn, time, context) {
            var lock, args, wrapperFn, later;

            later = function () {
                // reset lock and call if queued
                lock = false;
                if (args) {
                    wrapperFn.apply(context, args);
                    args = false;
                }
            };

            wrapperFn = function () {
                if (lock) {
                    // called too soon, queue to call later
                    args = arguments;

                } else {
                    // call and lock until later
                    fn.apply(context, arguments);
                    setTimeout(later, time);
                    lock = true;
                }
            };

            return wrapperFn;
        }

        // @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
        // Returns the number `num` modulo `range` in such a way so it lies within
        // `range[0]` and `range[1]`. The returned value will be always smaller than
        // `range[1]` unless `includeMax` is set to `true`.
        function wrapNum(x, range, includeMax) {
            var max = range[1],
                min = range[0],
                d = max - min;
            return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
        }

        // @function falseFn(): Function
        // Returns a function which always returns `false`.
        function falseFn() { return false; }

        // @function formatNum(num: Number, digits?: Number): Number
        // Returns the number `num` rounded to `digits` decimals, or to 5 decimals by default.
        function formatNum(num, digits) {
            var pow = Math.pow(10, digits || 5);
            return Math.round(num * pow) / pow;
        }

        // @function trim(str: String): String
        // Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
        function trim(str) {
            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
        }

        // @function splitWords(str: String): String[]
        // Trims and splits the string on whitespace and returns the array of parts.
        function splitWords(str) {
            return trim(str).split(/\s+/);
        }

        // @function setOptions(obj: Object, options: Object): Object
        // Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
        function setOptions(obj, options) {
            if (!obj.hasOwnProperty('options')) {
                obj.options = obj.options ? create(obj.options) : {};
            }
            for (var i in options) {
                obj.options[i] = options[i];
            }
            return obj.options;
        }

        // @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
        // Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
        // translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
        // be appended at the end. If `uppercase` is `true`, the parameter names will
        // be uppercased (e.g. `'?A=foo&B=bar'`)
        function getParamString(obj, existingUrl, uppercase) {
            var params = [];
            for (var i in obj) {
                params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
            }
            return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
        }

        var templateRe = /\{ *([\w_\-]+) *\}/g;

        // @function template(str: String, data: Object): String
        // Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
        // and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
        // `('Hello foo, bar')`. You can also specify functions instead of strings for
        // data values — they will be evaluated passing `data` as an argument.
        function template(str, data) {
            if (str == null || data == null) return;
            return str.replace(templateRe, function (str, key) {

                var value = data[key];

                if (value === undefined) {
                    throw new Error('No value provided for variable ' + str);

                } else if (typeof value === 'function') {
                    value = value(data);
                }
                return value;
            });
        }

        // @function isArray(obj): Boolean
        // Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
        var isArray = Array.isArray || function (obj) {
            return (Object.prototype.toString.call(obj) === '[object Array]');
        };

        // @function indexOf(array: Array, el: Object): Number
        // Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
        function indexOf(array, el) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === el) { return i; }
            }
            return -1;
        }

        // @property emptyImageUrl: String
        // Data URI string containing a base64-encoded empty GIF image.
        // Used as a hack to free memory from unused images on WebKit-powered
        // mobile devices (by setting image `src` to this string).
        var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

        // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

        function getPrefixed(name) {
            return window['webkit' + name] || window['moz' + name] || window['ms' + name];
        }

        var lastTime = 0;

        // fallback for IE 7-8
        function timeoutDefer(fn) {
            var time = +new Date(),
                timeToCall = Math.max(0, 16 - (time - lastTime));

            lastTime = time + timeToCall;
            return window.setTimeout(fn, timeToCall);
        }

        var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
        var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
                getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

        // @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
        // Schedules `fn` to be executed when the browser repaints. `fn` is bound to
        // `context` if given. When `immediate` is set, `fn` is called immediately if
        // the browser doesn't have native support for
        // [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
        // otherwise it's delayed. Returns a request ID that can be used to cancel the request.
        function requestAnimFrame(fn, context, immediate) {
            if (immediate && requestFn === timeoutDefer) {
                fn.call(context);
            } else {
                return requestFn.call(window, bind(fn, context));
            }
        }

        // @function cancelAnimFrame(id: Number): undefined
        // Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
        function cancelAnimFrame(id) {
            if (id) {
                cancelFn.call(window, id);
            }
        }


        var Util = (Object.freeze || Object)({
            freeze: freeze,
            extend: extend,
            create: create,
            bind: bind,
            lastId: lastId,
            stamp: stamp,
            throttle: throttle,
            wrapNum: wrapNum,
            falseFn: falseFn,
            formatNum: formatNum,
            trim: trim,
            splitWords: splitWords,
            setOptions: setOptions,
            getParamString: getParamString,
            template: template,
            isArray: isArray,
            indexOf: indexOf,
            emptyImageUrl: emptyImageUrl,
            requestFn: requestFn,
            cancelFn: cancelFn,
            requestAnimFrame: requestAnimFrame,
            cancelAnimFrame: cancelAnimFrame
        });

        // @class Class
        // @aka L.Class

        // @section
        // @uninheritable

        // Thanks to John Resig and Dean Edwards for inspiration!

        function Class() { }

        Class.extend = function (props) {

            // @function extend(props: Object): Function
            // [Extends the current class](#class-inheritance) given the properties to be included.
            // Returns a Javascript function that is a class constructor (to be called with `new`).
            var NewClass = function () {

                // call the constructor
                if (this.initialize) {
                    this.initialize.apply(this, arguments);
                }

                // call all constructor hooks
                this.callInitHooks();
            };

            var parentProto = NewClass.__super__ = this.prototype;

            var proto = create(parentProto);
            proto.constructor = NewClass;

            NewClass.prototype = proto;

            // inherit parent's statics
            for (var i in this) {
                if (this.hasOwnProperty(i) && i !== 'prototype' && i !== '__super__') {
                    NewClass[i] = this[i];
                }
            }

            // mix static properties into the class
            if (props.statics) {
                extend(NewClass, props.statics);
                delete props.statics;
            }

            // mix includes into the prototype
            if (props.includes) {
                checkDeprecatedMixinEvents(props.includes);
                extend.apply(null, [proto].concat(props.includes));
                delete props.includes;
            }

            // merge options
            if (proto.options) {
                props.options = extend(create(proto.options), props.options);
            }

            // mix given properties into the prototype
            extend(proto, props);

            proto._initHooks = [];

            // add method for calling all hooks
            proto.callInitHooks = function () {

                if (this._initHooksCalled) { return; }

                if (parentProto.callInitHooks) {
                    parentProto.callInitHooks.call(this);
                }

                this._initHooksCalled = true;

                for (var i = 0, len = proto._initHooks.length; i < len; i++) {
                    proto._initHooks[i].call(this);
                }
            };

            return NewClass;
        };


        // @function include(properties: Object): this
        // [Includes a mixin](#class-includes) into the current class.
        Class.include = function (props) {
            extend(this.prototype, props);
            return this;
        };

        // @function mergeOptions(options: Object): this
        // [Merges `options`](#class-options) into the defaults of the class.
        Class.mergeOptions = function (options) {
            extend(this.prototype.options, options);
            return this;
        };

        // @function addInitHook(fn: Function): this
        // Adds a [constructor hook](#class-constructor-hooks) to the class.
        Class.addInitHook = function (fn) { // (Function) || (String, args...)
            var args = Array.prototype.slice.call(arguments, 1);

            var init = typeof fn === 'function' ? fn : function () {
                this[fn].apply(this, args);
            };

            this.prototype._initHooks = this.prototype._initHooks || [];
            this.prototype._initHooks.push(init);
            return this;
        };

        function checkDeprecatedMixinEvents(includes) {
            if (!L || !L.Mixin) { return; }

            includes = isArray(includes) ? includes : [includes];

            for (var i = 0; i < includes.length; i++) {
                if (includes[i] === L.Mixin.Events) {
                    console.warn('Deprecated include of L.Mixin.Events: ' +
                        'this property will be removed in future releases, ' +
                        'please inherit from L.Evented instead.', new Error().stack);
                }
            }
        }

        /*
         * @class Evented
         * @aka L.Evented
         * @inherits Class
         *
         * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
         *
         * @example
         *
         * ```js
         * map.on('click', function(e) {
         * 	alert(e.latlng);
         * } );
         * ```
         *
         * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
         *
         * ```js
         * function onClick(e) { ... }
         *
         * map.on('click', onClick);
         * map.off('click', onClick);
         * ```
         */

        var Events = {
            /* @method on(type: String, fn: Function, context?: Object): this
             * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
             *
             * @alternative
             * @method on(eventMap: Object): this
             * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
             */
            on: function (types, fn, context) {

                // types can be a map of types/handlers
                if (typeof types === 'object') {
                    for (var type in types) {
                        // we don't process space-separated events here for performance;
                        // it's a hot path since Layer uses the on(obj) syntax
                        this._on(type, types[type], fn);
                    }

                } else {
                    // types can be a string of space-separated words
                    types = splitWords(types);

                    for (var i = 0, len = types.length; i < len; i++) {
                        this._on(types[i], fn, context);
                    }
                }

                return this;
            },

            /* @method off(type: String, fn?: Function, context?: Object): this
             * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
             *
             * @alternative
             * @method off(eventMap: Object): this
             * Removes a set of type/listener pairs.
             *
             * @alternative
             * @method off: this
             * Removes all listeners to all events on the object.
             */
            off: function (types, fn, context) {

                if (!types) {
                    // clear all listeners if called without arguments
                    delete this._events;

                } else if (typeof types === 'object') {
                    for (var type in types) {
                        this._off(type, types[type], fn);
                    }

                } else {
                    types = splitWords(types);

                    for (var i = 0, len = types.length; i < len; i++) {
                        this._off(types[i], fn, context);
                    }
                }

                return this;
            },

            // attach listener (without syntactic sugar now)
            _on: function (type, fn, context) {
                this._events = this._events || {};

                /* get/init listeners for type */
                var typeListeners = this._events[type];
                if (!typeListeners) {
                    typeListeners = [];
                    this._events[type] = typeListeners;
                }

                if (context === this) {
                    // Less memory footprint.
                    context = undefined;
                }
                var newListener = { fn: fn, ctx: context },
                    listeners = typeListeners;

                // check if fn already there
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i].fn === fn && listeners[i].ctx === context) {
                        return;
                    }
                }

                listeners.push(newListener);
            },

            _off: function (type, fn, context) {
                var listeners,
                    i,
                    len;

                if (!this._events) { return; }

                listeners = this._events[type];

                if (!listeners) {
                    return;
                }

                if (!fn) {
                    // Set all removed listeners to noop so they are not called if remove happens in fire
                    for (i = 0, len = listeners.length; i < len; i++) {
                        listeners[i].fn = falseFn;
                    }
                    // clear all listeners for a type if function isn't specified
                    delete this._events[type];
                    return;
                }

                if (context === this) {
                    context = undefined;
                }

                if (listeners) {

                    // find fn and remove it
                    for (i = 0, len = listeners.length; i < len; i++) {
                        var l = listeners[i];
                        if (l.ctx !== context) { continue; }
                        if (l.fn === fn) {

                            // set the removed listener to noop so that's not called if remove happens in fire
                            l.fn = falseFn;

                            if (this._firingCount) {
                                /* copy array in case events are being fired */
                                this._events[type] = listeners = listeners.slice();
                            }
                            listeners.splice(i, 1);

                            return;
                        }
                    }
                }
            },

            // @method fire(type: String, data?: Object, propagate?: Boolean): this
            // Fires an event of the specified type. You can optionally provide an data
            // object — the first argument of the listener function will contain its
            // properties. The event can optionally be propagated to event parents.
            fire: function (type, data, propagate) {
                if (!this.listens(type, propagate)) { return this; }

                var event = extend({}, data, { type: type, target: this });

                if (this._events) {
                    var listeners = this._events[type];

                    if (listeners) {
                        this._firingCount = (this._firingCount + 1) || 1;
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            var l = listeners[i];
                            l.fn.call(l.ctx || this, event);
                        }

                        this._firingCount--;
                    }
                }

                if (propagate) {
                    // propagate the event to parents (set with addEventParent)
                    this._propagateEvent(event);
                }

                return this;
            },

            // @method listens(type: String): Boolean
            // Returns `true` if a particular event type has any listeners attached to it.
            listens: function (type, propagate) {
                var listeners = this._events && this._events[type];
                if (listeners && listeners.length) { return true; }

                if (propagate) {
                    // also check parents for listeners if event propagates
                    for (var id in this._eventParents) {
                        if (this._eventParents[id].listens(type, propagate)) { return true; }
                    }
                }
                return false;
            },

            // @method once(…): this
            // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
            once: function (types, fn, context) {

                if (typeof types === 'object') {
                    for (var type in types) {
                        this.once(type, types[type], fn);
                    }
                    return this;
                }

                var handler = bind(function () {
                    this
                        .off(types, fn, context)
                        .off(types, handler, context);
                }, this);

                // add a listener that's executed once and removed after that
                return this
                    .on(types, fn, context)
                    .on(types, handler, context);
            },

            // @method addEventParent(obj: Evented): this
            // Adds an event parent - an `Evented` that will receive propagated events
            addEventParent: function (obj) {
                this._eventParents = this._eventParents || {};
                this._eventParents[stamp(obj)] = obj;
                return this;
            },

            // @method removeEventParent(obj: Evented): this
            // Removes an event parent, so it will stop receiving propagated events
            removeEventParent: function (obj) {
                if (this._eventParents) {
                    delete this._eventParents[stamp(obj)];
                }
                return this;
            },

            _propagateEvent: function (e) {
                for (var id in this._eventParents) {
                    this._eventParents[id].fire(e.type, extend({ layer: e.target }, e), true);
                }
            }
        };

        // aliases; we should ditch those eventually

        // @method addEventListener(…): this
        // Alias to [`on(…)`](#evented-on)
        Events.addEventListener = Events.on;

        // @method removeEventListener(…): this
        // Alias to [`off(…)`](#evented-off)

        // @method clearAllEventListeners(…): this
        // Alias to [`off()`](#evented-off)
        Events.removeEventListener = Events.clearAllEventListeners = Events.off;

        // @method addOneTimeEventListener(…): this
        // Alias to [`once(…)`](#evented-once)
        Events.addOneTimeEventListener = Events.once;

        // @method fireEvent(…): this
        // Alias to [`fire(…)`](#evented-fire)
        Events.fireEvent = Events.fire;

        // @method hasEventListeners(…): Boolean
        // Alias to [`listens(…)`](#evented-listens)
        Events.hasEventListeners = Events.listens;

        var Evented = Class.extend(Events);

        /*
         * @class Point
         * @aka L.Point
         *
         * Represents a point with `x` and `y` coordinates in pixels.
         *
         * @example
         *
         * ```js
         * var point = L.point(200, 300);
         * ```
         *
         * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
         *
         * ```js
         * map.panBy([200, 300]);
         * map.panBy(L.point(200, 300));
         * ```
         */

        function Point(x, y, round) {
            // @property x: Number; The `x` coordinate of the point
            this.x = (round ? Math.round(x) : x);
            // @property y: Number; The `y` coordinate of the point
            this.y = (round ? Math.round(y) : y);
        }

        Point.prototype = {

            // @method clone(): Point
            // Returns a copy of the current point.
            clone: function () {
                return new Point(this.x, this.y);
            },

            // @method add(otherPoint: Point): Point
            // Returns the result of addition of the current and the given points.
            add: function (point) {
                // non-destructive, returns a new point
                return this.clone()._add(toPoint(point));
            },

            _add: function (point) {
                // destructive, used directly for performance in situations where it's safe to modify existing point
                this.x += point.x;
                this.y += point.y;
                return this;
            },

            // @method subtract(otherPoint: Point): Point
            // Returns the result of subtraction of the given point from the current.
            subtract: function (point) {
                return this.clone()._subtract(toPoint(point));
            },

            _subtract: function (point) {
                this.x -= point.x;
                this.y -= point.y;
                return this;
            },

            // @method divideBy(num: Number): Point
            // Returns the result of division of the current point by the given number.
            divideBy: function (num) {
                return this.clone()._divideBy(num);
            },

            _divideBy: function (num) {
                this.x /= num;
                this.y /= num;
                return this;
            },

            // @method multiplyBy(num: Number): Point
            // Returns the result of multiplication of the current point by the given number.
            multiplyBy: function (num) {
                return this.clone()._multiplyBy(num);
            },

            _multiplyBy: function (num) {
                this.x *= num;
                this.y *= num;
                return this;
            },

            // @method scaleBy(scale: Point): Point
            // Multiply each coordinate of the current point by each coordinate of
            // `scale`. In linear algebra terms, multiply the point by the
            // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
            // defined by `scale`.
            scaleBy: function (point) {
                return new Point(this.x * point.x, this.y * point.y);
            },

            // @method unscaleBy(scale: Point): Point
            // Inverse of `scaleBy`. Divide each coordinate of the current point by
            // each coordinate of `scale`.
            unscaleBy: function (point) {
                return new Point(this.x / point.x, this.y / point.y);
            },

            // @method round(): Point
            // Returns a copy of the current point with rounded coordinates.
            round: function () {
                return this.clone()._round();
            },

            _round: function () {
                this.x = Math.round(this.x);
                this.y = Math.round(this.y);
                return this;
            },

            // @method floor(): Point
            // Returns a copy of the current point with floored coordinates (rounded down).
            floor: function () {
                return this.clone()._floor();
            },

            _floor: function () {
                this.x = Math.floor(this.x);
                this.y = Math.floor(this.y);
                return this;
            },

            // @method ceil(): Point
            // Returns a copy of the current point with ceiled coordinates (rounded up).
            ceil: function () {
                return this.clone()._ceil();
            },

            _ceil: function () {
                this.x = Math.ceil(this.x);
                this.y = Math.ceil(this.y);
                return this;
            },

            // @method distanceTo(otherPoint: Point): Number
            // Returns the cartesian distance between the current and the given points.
            distanceTo: function (point) {
                point = toPoint(point);

                var x = point.x - this.x,
                    y = point.y - this.y;

                return Math.sqrt(x * x + y * y);
            },

            // @method equals(otherPoint: Point): Boolean
            // Returns `true` if the given point has the same coordinates.
            equals: function (point) {
                point = toPoint(point);

                return point.x === this.x &&
                       point.y === this.y;
            },

            // @method contains(otherPoint: Point): Boolean
            // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
            contains: function (point) {
                point = toPoint(point);

                return Math.abs(point.x) <= Math.abs(this.x) &&
                       Math.abs(point.y) <= Math.abs(this.y);
            },

            // @method toString(): String
            // Returns a string representation of the point for debugging purposes.
            toString: function () {
                return 'Point(' +
                        formatNum(this.x) + ', ' +
                        formatNum(this.y) + ')';
            }
        };

        // @factory L.point(x: Number, y: Number, round?: Boolean)
        // Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

        // @alternative
        // @factory L.point(coords: Number[])
        // Expects an array of the form `[x, y]` instead.

        // @alternative
        // @factory L.point(coords: Object)
        // Expects a plain object of the form `{x: Number, y: Number}` instead.
        function toPoint(x, y, round) {
            if (x instanceof Point) {
                return x;
            }
            if (isArray(x)) {
                return new Point(x[0], x[1]);
            }
            if (x === undefined || x === null) {
                return x;
            }
            if (typeof x === 'object' && 'x' in x && 'y' in x) {
                return new Point(x.x, x.y);
            }
            return new Point(x, y, round);
        }

        /*
         * @class Bounds
         * @aka L.Bounds
         *
         * Represents a rectangular area in pixel coordinates.
         *
         * @example
         *
         * ```js
         * var p1 = L.point(10, 10),
         * p2 = L.point(40, 60),
         * bounds = L.bounds(p1, p2);
         * ```
         *
         * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
         *
         * ```js
         * otherBounds.intersects([[10, 10], [40, 60]]);
         * ```
         */

        function Bounds(a, b) {
            if (!a) { return; }

            var points = b ? [a, b] : a;

            for (var i = 0, len = points.length; i < len; i++) {
                this.extend(points[i]);
            }
        }

        Bounds.prototype = {
            // @method extend(point: Point): this
            // Extends the bounds to contain the given point.
            extend: function (point) { // (Point)
                point = toPoint(point);

                // @property min: Point
                // The top left corner of the rectangle.
                // @property max: Point
                // The bottom right corner of the rectangle.
                if (!this.min && !this.max) {
                    this.min = point.clone();
                    this.max = point.clone();
                } else {
                    this.min.x = Math.min(point.x, this.min.x);
                    this.max.x = Math.max(point.x, this.max.x);
                    this.min.y = Math.min(point.y, this.min.y);
                    this.max.y = Math.max(point.y, this.max.y);
                }
                return this;
            },

            // @method getCenter(round?: Boolean): Point
            // Returns the center point of the bounds.
            getCenter: function (round) {
                return new Point(
                        (this.min.x + this.max.x) / 2,
                        (this.min.y + this.max.y) / 2, round);
            },

            // @method getBottomLeft(): Point
            // Returns the bottom-left point of the bounds.
            getBottomLeft: function () {
                return new Point(this.min.x, this.max.y);
            },

            // @method getTopRight(): Point
            // Returns the top-right point of the bounds.
            getTopRight: function () { // -> Point
                return new Point(this.max.x, this.min.y);
            },

            // @method getTopLeft(): Point
            // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
            getTopLeft: function () {
                return this.min; // left, top
            },

            // @method getBottomRight(): Point
            // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
            getBottomRight: function () {
                return this.max; // right, bottom
            },

            // @method getSize(): Point
            // Returns the size of the given bounds
            getSize: function () {
                return this.max.subtract(this.min);
            },

            // @method contains(otherBounds: Bounds): Boolean
            // Returns `true` if the rectangle contains the given one.
            // @alternative
            // @method contains(point: Point): Boolean
            // Returns `true` if the rectangle contains the given point.
            contains: function (obj) {
                var min, max;

                if (typeof obj[0] === 'number' || obj instanceof Point) {
                    obj = toPoint(obj);
                } else {
                    obj = toBounds(obj);
                }

                if (obj instanceof Bounds) {
                    min = obj.min;
                    max = obj.max;
                } else {
                    min = max = obj;
                }

                return (min.x >= this.min.x) &&
                       (max.x <= this.max.x) &&
                       (min.y >= this.min.y) &&
                       (max.y <= this.max.y);
            },

            // @method intersects(otherBounds: Bounds): Boolean
            // Returns `true` if the rectangle intersects the given bounds. Two bounds
            // intersect if they have at least one point in common.
            intersects: function (bounds) { // (Bounds) -> Boolean
                bounds = toBounds(bounds);

                var min = this.min,
                    max = this.max,
                    min2 = bounds.min,
                    max2 = bounds.max,
                    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
                    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

                return xIntersects && yIntersects;
            },

            // @method overlaps(otherBounds: Bounds): Boolean
            // Returns `true` if the rectangle overlaps the given bounds. Two bounds
            // overlap if their intersection is an area.
            overlaps: function (bounds) { // (Bounds) -> Boolean
                bounds = toBounds(bounds);

                var min = this.min,
                    max = this.max,
                    min2 = bounds.min,
                    max2 = bounds.max,
                    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
                    yOverlaps = (max2.y > min.y) && (min2.y < max.y);

                return xOverlaps && yOverlaps;
            },

            isValid: function () {
                return !!(this.min && this.max);
            }
        };


        // @factory L.bounds(corner1: Point, corner2: Point)
        // Creates a Bounds object from two corners coordinate pairs.
        // @alternative
        // @factory L.bounds(points: Point[])
        // Creates a Bounds object from the given array of points.
        function toBounds(a, b) {
            if (!a || a instanceof Bounds) {
                return a;
            }
            return new Bounds(a, b);
        }

        /*
         * @class LatLngBounds
         * @aka L.LatLngBounds
         *
         * Represents a rectangular geographical area on a map.
         *
         * @example
         *
         * ```js
         * var corner1 = L.latLng(40.712, -74.227),
         * corner2 = L.latLng(40.774, -74.125),
         * bounds = L.latLngBounds(corner1, corner2);
         * ```
         *
         * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
         *
         * ```js
         * map.fitBounds([
         * 	[40.712, -74.227],
         * 	[40.774, -74.125]
         * ]);
         * ```
         *
         * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
         */

        function LatLngBounds(corner1, corner2) { // (LatLng, LatLng) or (LatLng[])
            if (!corner1) { return; }

            var latlngs = corner2 ? [corner1, corner2] : corner1;

            for (var i = 0, len = latlngs.length; i < len; i++) {
                this.extend(latlngs[i]);
            }
        }

        LatLngBounds.prototype = {

            // @method extend(latlng: LatLng): this
            // Extend the bounds to contain the given point

            // @alternative
            // @method extend(otherBounds: LatLngBounds): this
            // Extend the bounds to contain the given bounds
            extend: function (obj) {
                var sw = this._southWest,
                    ne = this._northEast,
                    sw2, ne2;

                if (obj instanceof LatLng) {
                    sw2 = obj;
                    ne2 = obj;

                } else if (obj instanceof LatLngBounds) {
                    sw2 = obj._southWest;
                    ne2 = obj._northEast;

                    if (!sw2 || !ne2) { return this; }

                } else {
                    return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
                }

                if (!sw && !ne) {
                    this._southWest = new LatLng(sw2.lat, sw2.lng);
                    this._northEast = new LatLng(ne2.lat, ne2.lng);
                } else {
                    sw.lat = Math.min(sw2.lat, sw.lat);
                    sw.lng = Math.min(sw2.lng, sw.lng);
                    ne.lat = Math.max(ne2.lat, ne.lat);
                    ne.lng = Math.max(ne2.lng, ne.lng);
                }

                return this;
            },

            // @method pad(bufferRatio: Number): LatLngBounds
            // Returns bigger bounds created by extending the current bounds by a given percentage in each direction.
            pad: function (bufferRatio) {
                var sw = this._southWest,
                    ne = this._northEast,
                    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
                    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

                return new LatLngBounds(
                        new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
                        new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
            },

            // @method getCenter(): LatLng
            // Returns the center point of the bounds.
            getCenter: function () {
                return new LatLng(
                        (this._southWest.lat + this._northEast.lat) / 2,
                        (this._southWest.lng + this._northEast.lng) / 2);
            },

            // @method getSouthWest(): LatLng
            // Returns the south-west point of the bounds.
            getSouthWest: function () {
                return this._southWest;
            },

            // @method getNorthEast(): LatLng
            // Returns the north-east point of the bounds.
            getNorthEast: function () {
                return this._northEast;
            },

            // @method getNorthWest(): LatLng
            // Returns the north-west point of the bounds.
            getNorthWest: function () {
                return new LatLng(this.getNorth(), this.getWest());
            },

            // @method getSouthEast(): LatLng
            // Returns the south-east point of the bounds.
            getSouthEast: function () {
                return new LatLng(this.getSouth(), this.getEast());
            },

            // @method getWest(): Number
            // Returns the west longitude of the bounds
            getWest: function () {
                return this._southWest.lng;
            },

            // @method getSouth(): Number
            // Returns the south latitude of the bounds
            getSouth: function () {
                return this._southWest.lat;
            },

            // @method getEast(): Number
            // Returns the east longitude of the bounds
            getEast: function () {
                return this._northEast.lng;
            },

            // @method getNorth(): Number
            // Returns the north latitude of the bounds
            getNorth: function () {
                return this._northEast.lat;
            },

            // @method contains(otherBounds: LatLngBounds): Boolean
            // Returns `true` if the rectangle contains the given one.

            // @alternative
            // @method contains (latlng: LatLng): Boolean
            // Returns `true` if the rectangle contains the given point.
            contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
                if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
                    obj = toLatLng(obj);
                } else {
                    obj = toLatLngBounds(obj);
                }

                var sw = this._southWest,
                    ne = this._northEast,
                    sw2, ne2;

                if (obj instanceof LatLngBounds) {
                    sw2 = obj.getSouthWest();
                    ne2 = obj.getNorthEast();
                } else {
                    sw2 = ne2 = obj;
                }

                return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
                       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
            },

            // @method intersects(otherBounds: LatLngBounds): Boolean
            // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
            intersects: function (bounds) {
                bounds = toLatLngBounds(bounds);

                var sw = this._southWest,
                    ne = this._northEast,
                    sw2 = bounds.getSouthWest(),
                    ne2 = bounds.getNorthEast(),

                    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
                    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

                return latIntersects && lngIntersects;
            },

            // @method overlaps(otherBounds: Bounds): Boolean
            // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
            overlaps: function (bounds) {
                bounds = toLatLngBounds(bounds);

                var sw = this._southWest,
                    ne = this._northEast,
                    sw2 = bounds.getSouthWest(),
                    ne2 = bounds.getNorthEast(),

                    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
                    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

                return latOverlaps && lngOverlaps;
            },

            // @method toBBoxString(): String
            // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
            toBBoxString: function () {
                return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
            },

            // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
            // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overriden by setting `maxMargin` to a small number.
            equals: function (bounds, maxMargin) {
                if (!bounds) { return false; }

                bounds = toLatLngBounds(bounds);

                return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
                       this._northEast.equals(bounds.getNorthEast(), maxMargin);
            },

            // @method isValid(): Boolean
            // Returns `true` if the bounds are properly initialized.
            isValid: function () {
                return !!(this._southWest && this._northEast);
            }
        };

        // TODO International date line?

        // @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
        // Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

        // @alternative
        // @factory L.latLngBounds(latlngs: LatLng[])
        // Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
        function toLatLngBounds(a, b) {
            if (a instanceof LatLngBounds) {
                return a;
            }
            return new LatLngBounds(a, b);
        }

        /* @class LatLng
         * @aka L.LatLng
         *
         * Represents a geographical point with a certain latitude and longitude.
         *
         * @example
         *
         * ```
         * var latlng = L.latLng(50.5, 30.5);
         * ```
         *
         * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
         *
         * ```
         * map.panTo([50, 30]);
         * map.panTo({lon: 30, lat: 50});
         * map.panTo({lat: 50, lng: 30});
         * map.panTo(L.latLng(50, 30));
         * ```
         */

        function LatLng(lat, lng, alt) {
            if (isNaN(lat) || isNaN(lng)) {
                throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
            }

            // @property lat: Number
            // Latitude in degrees
            this.lat = +lat;

            // @property lng: Number
            // Longitude in degrees
            this.lng = +lng;

            // @property alt: Number
            // Altitude in meters (optional)
            if (alt !== undefined) {
                this.alt = +alt;
            }
        }

        LatLng.prototype = {
            // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
            // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overriden by setting `maxMargin` to a small number.
            equals: function (obj, maxMargin) {
                if (!obj) { return false; }

                obj = toLatLng(obj);

                var margin = Math.max(
                        Math.abs(this.lat - obj.lat),
                        Math.abs(this.lng - obj.lng));

                return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
            },

            // @method toString(): String
            // Returns a string representation of the point (for debugging purposes).
            toString: function (precision) {
                return 'LatLng(' +
                        formatNum(this.lat, precision) + ', ' +
                        formatNum(this.lng, precision) + ')';
            },

            // @method distanceTo(otherLatLng: LatLng): Number
            // Returns the distance (in meters) to the given `LatLng` calculated using the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula).
            distanceTo: function (other) {
                return Earth.distance(this, toLatLng(other));
            },

            // @method wrap(): LatLng
            // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
            wrap: function () {
                return Earth.wrapLatLng(this);
            },

            // @method toBounds(sizeInMeters: Number): LatLngBounds
            // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
            toBounds: function (sizeInMeters) {
                var latAccuracy = 180 * sizeInMeters / 40075017,
                    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

                return toLatLngBounds(
                        [this.lat - latAccuracy, this.lng - lngAccuracy],
                        [this.lat + latAccuracy, this.lng + lngAccuracy]);
            },

            clone: function () {
                return new LatLng(this.lat, this.lng, this.alt);
            }
        };



        // @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
        // Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

        // @alternative
        // @factory L.latLng(coords: Array): LatLng
        // Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

        // @alternative
        // @factory L.latLng(coords: Object): LatLng
        // Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

        function toLatLng(a, b, c) {
            if (a instanceof LatLng) {
                return a;
            }
            if (isArray(a) && typeof a[0] !== 'object') {
                if (a.length === 3) {
                    return new LatLng(a[0], a[1], a[2]);
                }
                if (a.length === 2) {
                    return new LatLng(a[0], a[1]);
                }
                return null;
            }
            if (a === undefined || a === null) {
                return a;
            }
            if (typeof a === 'object' && 'lat' in a) {
                return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
            }
            if (b === undefined) {
                return null;
            }
            return new LatLng(a, b, c);
        }

        /*
         * @namespace CRS
         * @crs L.CRS.Base
         * Object that defines coordinate reference systems for projecting
         * geographical points into pixel (screen) coordinates and back (and to
         * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
         * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
         *
         * Leaflet defines the most usual CRSs by default. If you want to use a
         * CRS not defined by default, take a look at the
         * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
         */

        var CRS = {
            // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
            // Projects geographical coordinates into pixel coordinates for a given zoom.
            latLngToPoint: function (latlng, zoom) {
                var projectedPoint = this.projection.project(latlng),
                    scale = this.scale(zoom);

                return this.transformation._transform(projectedPoint, scale);
            },

            // @method pointToLatLng(point: Point, zoom: Number): LatLng
            // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
            // zoom into geographical coordinates.
            pointToLatLng: function (point, zoom) {
                var scale = this.scale(zoom),
                    untransformedPoint = this.transformation.untransform(point, scale);

                return this.projection.unproject(untransformedPoint);
            },

            // @method project(latlng: LatLng): Point
            // Projects geographical coordinates into coordinates in units accepted for
            // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
            project: function (latlng) {
                return this.projection.project(latlng);
            },

            // @method unproject(point: Point): LatLng
            // Given a projected coordinate returns the corresponding LatLng.
            // The inverse of `project`.
            unproject: function (point) {
                return this.projection.unproject(point);
            },

            // @method scale(zoom: Number): Number
            // Returns the scale used when transforming projected coordinates into
            // pixel coordinates for a particular zoom. For example, it returns
            // `256 * 2^zoom` for Mercator-based CRS.
            scale: function (zoom) {
                return 256 * Math.pow(2, zoom);
            },

            // @method zoom(scale: Number): Number
            // Inverse of `scale()`, returns the zoom level corresponding to a scale
            // factor of `scale`.
            zoom: function (scale) {
                return Math.log(scale / 256) / Math.LN2;
            },

            // @method getProjectedBounds(zoom: Number): Bounds
            // Returns the projection's bounds scaled and transformed for the provided `zoom`.
            getProjectedBounds: function (zoom) {
                if (this.infinite) { return null; }

                var b = this.projection.bounds,
                    s = this.scale(zoom),
                    min = this.transformation.transform(b.min, s),
                    max = this.transformation.transform(b.max, s);

                return new Bounds(min, max);
            },

            // @method distance(latlng1: LatLng, latlng2: LatLng): Number
            // Returns the distance between two geographical coordinates.

            // @property code: String
            // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
            //
            // @property wrapLng: Number[]
            // An array of two numbers defining whether the longitude (horizontal) coordinate
            // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
            // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
            //
            // @property wrapLat: Number[]
            // Like `wrapLng`, but for the latitude (vertical) axis.

            // wrapLng: [min, max],
            // wrapLat: [min, max],

            // @property infinite: Boolean
            // If true, the coordinate space will be unbounded (infinite in both axes)
            infinite: false,

            // @method wrapLatLng(latlng: LatLng): LatLng
            // Returns a `LatLng` where lat and lng has been wrapped according to the
            // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
            wrapLatLng: function (latlng) {
                var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
                    lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
                    alt = latlng.alt;

                return new LatLng(lat, lng, alt);
            },

            // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
            // Returns a `LatLngBounds` with the same size as the given one, ensuring
            // that its center is within the CRS's bounds.
            // Only accepts actual `L.LatLngBounds` instances, not arrays.
            wrapLatLngBounds: function (bounds) {
                var center = bounds.getCenter(),
                    newCenter = this.wrapLatLng(center),
                    latShift = center.lat - newCenter.lat,
                    lngShift = center.lng - newCenter.lng;

                if (latShift === 0 && lngShift === 0) {
                    return bounds;
                }

                var sw = bounds.getSouthWest(),
                    ne = bounds.getNorthEast(),
                    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
                    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

                return new LatLngBounds(newSw, newNe);
            }
        };

        /*
         * @namespace CRS
         * @crs L.CRS.Earth
         *
         * Serves as the base for CRS that are global such that they cover the earth.
         * Can only be used as the base for other CRS and cannot be used directly,
         * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
         * meters.
         */

        var Earth = extend({}, CRS, {
            wrapLng: [-180, 180],

            // Mean Earth Radius, as recommended for use by
            // the International Union of Geodesy and Geophysics,
            // see http://rosettacode.org/wiki/Haversine_formula
            R: 6371000,

            // distance between two geographical points using spherical law of cosines approximation
            distance: function (latlng1, latlng2) {
                var rad = Math.PI / 180,
                    lat1 = latlng1.lat * rad,
                    lat2 = latlng2.lat * rad,
                    a = Math.sin(lat1) * Math.sin(lat2) +
                        Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);

                return this.R * Math.acos(Math.min(a, 1));
            }
        });

        /*
         * @namespace Projection
         * @projection L.Projection.SphericalMercator
         *
         * Spherical Mercator projection — the most common projection for online maps,
         * used by almost all free and commercial tile providers. Assumes that Earth is
         * a sphere. Used by the `EPSG:3857` CRS.
         */

        var SphericalMercator = {

            R: 6378137,
            MAX_LATITUDE: 85.0511287798,

            project: function (latlng) {
                var d = Math.PI / 180,
                    max = this.MAX_LATITUDE,
                    lat = Math.max(Math.min(max, latlng.lat), -max),
                    sin = Math.sin(lat * d);

                return new Point(
                        this.R * latlng.lng * d,
                        this.R * Math.log((1 + sin) / (1 - sin)) / 2);
            },

            unproject: function (point) {
                var d = 180 / Math.PI;

                return new LatLng(
                    (2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
                    point.x * d / this.R);
            },

            bounds: (function () {
                var d = 6378137 * Math.PI;
                return new Bounds([-d, -d], [d, d]);
            })()
        };

        /*
         * @class Transformation
         * @aka L.Transformation
         *
         * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
         * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
         * the reverse. Used by Leaflet in its projections code.
         *
         * @example
         *
         * ```js
         * var transformation = L.transformation(2, 5, -1, 10),
         * 	p = L.point(1, 2),
         * 	p2 = transformation.transform(p), //  L.point(7, 8)
         * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
         * ```
         */


        // factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
        // Creates a `Transformation` object with the given coefficients.
        function Transformation(a, b, c, d) {
            if (isArray(a)) {
                // use array properties
                this._a = a[0];
                this._b = a[1];
                this._c = a[2];
                this._d = a[3];
                return;
            }
            this._a = a;
            this._b = b;
            this._c = c;
            this._d = d;
        }

        Transformation.prototype = {
            // @method transform(point: Point, scale?: Number): Point
            // Returns a transformed point, optionally multiplied by the given scale.
            // Only accepts actual `L.Point` instances, not arrays.
            transform: function (point, scale) { // (Point, Number) -> Point
                return this._transform(point.clone(), scale);
            },

            // destructive transform (faster)
            _transform: function (point, scale) {
                scale = scale || 1;
                point.x = scale * (this._a * point.x + this._b);
                point.y = scale * (this._c * point.y + this._d);
                return point;
            },

            // @method untransform(point: Point, scale?: Number): Point
            // Returns the reverse transformation of the given point, optionally divided
            // by the given scale. Only accepts actual `L.Point` instances, not arrays.
            untransform: function (point, scale) {
                scale = scale || 1;
                return new Point(
                        (point.x / scale - this._b) / this._a,
                        (point.y / scale - this._d) / this._c);
            }
        };

        // factory L.transformation(a: Number, b: Number, c: Number, d: Number)

        // @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
        // Instantiates a Transformation object with the given coefficients.

        // @alternative
        // @factory L.transformation(coefficients: Array): Transformation
        // Expects an coeficients array of the form
        // `[a: Number, b: Number, c: Number, d: Number]`.

        function toTransformation(a, b, c, d) {
            return new Transformation(a, b, c, d);
        }

        /*
         * @namespace CRS
         * @crs L.CRS.EPSG3857
         *
         * The most common CRS for online maps, used by almost all free and commercial
         * tile providers. Uses Spherical Mercator projection. Set in by default in
         * Map's `crs` option.
         */

        var EPSG3857 = extend({}, Earth, {
            code: 'EPSG:3857',
            projection: SphericalMercator,

            transformation: (function () {
                var scale = 0.5 / (Math.PI * SphericalMercator.R);
                return toTransformation(scale, 0.5, -scale, 0.5);
            }())
        });

        var EPSG900913 = extend({}, EPSG3857, {
            code: 'EPSG:900913'
        });

        // @namespace SVG; @section
        // There are several static functions which can be called without instantiating L.SVG:

        // @function create(name: String): SVGElement
        // Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
        // corresponding to the class name passed. For example, using 'line' will return
        // an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
        function svgCreate(name) {
            return document.createElementNS('http://www.w3.org/2000/svg', name);
        }

        // @function pointsToPath(rings: Point[], closed: Boolean): String
        // Generates a SVG path string for multiple rings, with each ring turning
        // into "M..L..L.." instructions
        function pointsToPath(rings, closed) {
            var str = '',
            i, j, len, len2, points, p;

            for (i = 0, len = rings.length; i < len; i++) {
                points = rings[i];

                for (j = 0, len2 = points.length; j < len2; j++) {
                    p = points[j];
                    str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
                }

                // closes the ring for polygons; "x" is VML syntax
                str += closed ? (svg ? 'z' : 'x') : '';
            }

            // SVG complains about empty path strings
            return str || 'M0 0';
        }

        /*
         * @namespace Browser
         * @aka L.Browser
         *
         * A namespace with static properties for browser/feature detection used by Leaflet internally.
         *
         * @example
         *
         * ```js
         * if (L.Browser.ielt9) {
         *   alert('Upgrade your browser, dude!');
         * }
         * ```
         */

        var style$1 = document.documentElement.style;

        // @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
        var ie = 'ActiveXObject' in window;

        // @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
        var ielt9 = ie && !document.addEventListener;

        // @property edge: Boolean; `true` for the Edge web browser.
        var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

        // @property webkit: Boolean;
        // `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
        var webkit = userAgentContains('webkit');

        // @property android: Boolean
        // `true` for any browser running on an Android platform.
        var android = userAgentContains('android');

        // @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
        var android23 = userAgentContains('android 2') || userAgentContains('android 3');

        // @property opera: Boolean; `true` for the Opera browser
        var opera = !!window.opera;

        // @property chrome: Boolean; `true` for the Chrome browser.
        var chrome = userAgentContains('chrome');

        // @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
        var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

        // @property safari: Boolean; `true` for the Safari browser.
        var safari = !chrome && userAgentContains('safari');

        var phantom = userAgentContains('phantom');

        // @property opera12: Boolean
        // `true` for the Opera browser supporting CSS transforms (version 12 or later).
        var opera12 = 'OTransition' in style$1;

        // @property win: Boolean; `true` when the browser is running in a Windows platform
        var win = navigator.platform.indexOf('Win') === 0;

        // @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
        var ie3d = ie && ('transition' in style$1);

        // @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
        var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

        // @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
        var gecko3d = 'MozPerspective' in style$1;

        // @property any3d: Boolean
        // `true` for all browsers supporting CSS transforms.
        var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

        // @property mobile: Boolean; `true` for all browsers running in a mobile device.
        var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

        // @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
        var mobileWebkit = mobile && webkit;

        // @property mobileWebkit3d: Boolean
        // `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
        var mobileWebkit3d = mobile && webkit3d;

        // @property msPointer: Boolean
        // `true` for browsers implementing the Microsoft touch events model (notably IE10).
        var msPointer = !window.PointerEvent && window.MSPointerEvent;

        // @property pointer: Boolean
        // `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
        var pointer = !!(window.PointerEvent || msPointer);

        // @property touch: Boolean
        // `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
        // This does not necessarily mean that the browser is running in a computer with
        // a touchscreen, it only means that the browser is capable of understanding
        // touch events.
        var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
                (window.DocumentTouch && document instanceof window.DocumentTouch));

        // @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
        var mobileOpera = mobile && opera;

        // @property mobileGecko: Boolean
        // `true` for gecko-based browsers running in a mobile device.
        var mobileGecko = mobile && gecko;

        // @property retina: Boolean
        // `true` for browsers on a high-resolution "retina" screen.
        var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;


        // @property canvas: Boolean
        // `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
        var canvas = (function () {
            return !!document.createElement('canvas').getContext;
        }());

        // @property svg: Boolean
        // `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
        var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

        // @property vml: Boolean
        // `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
        var vml = !svg && (function () {
            try {
                var div = document.createElement('div');
                div.innerHTML = '<v:shape adj="1"/>';

                var shape = div.firstChild;
                shape.style.behavior = 'url(#default#VML)';

                return shape && (typeof shape.adj === 'object');

            } catch (e) {
                return false;
            }
        }());


        function userAgentContains(str) {
            return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
        }


        var Browser = (Object.freeze || Object)({
            ie: ie,
            ielt9: ielt9,
            edge: edge,
            webkit: webkit,
            android: android,
            android23: android23,
            opera: opera,
            chrome: chrome,
            gecko: gecko,
            safari: safari,
            phantom: phantom,
            opera12: opera12,
            win: win,
            ie3d: ie3d,
            webkit3d: webkit3d,
            gecko3d: gecko3d,
            any3d: any3d,
            mobile: mobile,
            mobileWebkit: mobileWebkit,
            mobileWebkit3d: mobileWebkit3d,
            msPointer: msPointer,
            pointer: pointer,
            touch: touch,
            mobileOpera: mobileOpera,
            mobileGecko: mobileGecko,
            retina: retina,
            canvas: canvas,
            svg: svg,
            vml: vml
        });

        /*
         * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
         */


        var POINTER_DOWN = msPointer ? 'MSPointerDown' : 'pointerdown';
        var POINTER_MOVE = msPointer ? 'MSPointerMove' : 'pointermove';
        var POINTER_UP = msPointer ? 'MSPointerUp' : 'pointerup';
        var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';
        var TAG_WHITE_LIST = ['INPUT', 'SELECT', 'OPTION'];
        var _pointers = {};
        var _pointerDocListener = false;

        // DomEvent.DoubleTap needs to know about this
        var _pointersCount = 0;

        // Provides a touch events wrapper for (ms)pointer events.
        // ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

        function addPointerListener(obj, type, handler, id) {
            if (type === 'touchstart') {
                _addPointerStart(obj, handler, id);

            } else if (type === 'touchmove') {
                _addPointerMove(obj, handler, id);

            } else if (type === 'touchend') {
                _addPointerEnd(obj, handler, id);
            }

            return this;
        }

        function removePointerListener(obj, type, id) {
            var handler = obj['_leaflet_' + type + id];

            if (type === 'touchstart') {
                obj.removeEventListener(POINTER_DOWN, handler, false);

            } else if (type === 'touchmove') {
                obj.removeEventListener(POINTER_MOVE, handler, false);

            } else if (type === 'touchend') {
                obj.removeEventListener(POINTER_UP, handler, false);
                obj.removeEventListener(POINTER_CANCEL, handler, false);
            }

            return this;
        }

        function _addPointerStart(obj, handler, id) {
            var onDown = bind(function (e) {
                if (e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
                    // In IE11, some touch events needs to fire for form controls, or
                    // the controls will stop working. We keep a whitelist of tag names that
                    // need these events. For other target tags, we prevent default on the event.
                    if (TAG_WHITE_LIST.indexOf(e.target.tagName) < 0) {
                        preventDefault(e);
                    } else {
                        return;
                    }
                }

                _handlePointer(e, handler);
            });

            obj['_leaflet_touchstart' + id] = onDown;
            obj.addEventListener(POINTER_DOWN, onDown, false);

            // need to keep track of what pointers and how many are active to provide e.touches emulation
            if (!_pointerDocListener) {
                // we listen documentElement as any drags that end by moving the touch off the screen get fired there
                document.documentElement.addEventListener(POINTER_DOWN, _globalPointerDown, true);
                document.documentElement.addEventListener(POINTER_MOVE, _globalPointerMove, true);
                document.documentElement.addEventListener(POINTER_UP, _globalPointerUp, true);
                document.documentElement.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

                _pointerDocListener = true;
            }
        }

        function _globalPointerDown(e) {
            _pointers[e.pointerId] = e;
            _pointersCount++;
        }

        function _globalPointerMove(e) {
            if (_pointers[e.pointerId]) {
                _pointers[e.pointerId] = e;
            }
        }

        function _globalPointerUp(e) {
            delete _pointers[e.pointerId];
            _pointersCount--;
        }

        function _handlePointer(e, handler) {
            e.touches = [];
            for (var i in _pointers) {
                e.touches.push(_pointers[i]);
            }
            e.changedTouches = [e];

            handler(e);
        }

        function _addPointerMove(obj, handler, id) {
            var onMove = function (e) {
                // don't fire touch moves when mouse isn't down
                if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

                _handlePointer(e, handler);
            };

            obj['_leaflet_touchmove' + id] = onMove;
            obj.addEventListener(POINTER_MOVE, onMove, false);
        }

        function _addPointerEnd(obj, handler, id) {
            var onUp = function (e) {
                _handlePointer(e, handler);
            };

            obj['_leaflet_touchend' + id] = onUp;
            obj.addEventListener(POINTER_UP, onUp, false);
            obj.addEventListener(POINTER_CANCEL, onUp, false);
        }

        /*
         * Extends the event handling code with double tap support for mobile browsers.
         */

        var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
        var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
        var _pre = '_leaflet_';

        // inspired by Zepto touch code by Thomas Fuchs
        function addDoubleTapListener(obj, handler, id) {
            var last, touch$$1,
                doubleTap = false,
                delay = 250;

            function onTouchStart(e) {
                var count;

                if (pointer) {
                    if ((!edge) || e.pointerType === 'mouse') { return; }
                    count = _pointersCount;
                } else {
                    count = e.touches.length;
                }

                if (count > 1) { return; }

                var now = Date.now(),
                    delta = now - (last || now);

                touch$$1 = e.touches ? e.touches[0] : e;
                doubleTap = (delta > 0 && delta <= delay);
                last = now;
            }

            function onTouchEnd(e) {
                if (doubleTap && !touch$$1.cancelBubble) {
                    if (pointer) {
                        if ((!edge) || e.pointerType === 'mouse') { return; }
                        // work around .type being readonly with MSPointer* events
                        var newTouch = {},
                            prop, i;

                        for (i in touch$$1) {
                            prop = touch$$1[i];
                            newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
                        }
                        touch$$1 = newTouch;
                    }
                    touch$$1.type = 'dblclick';
                    handler(touch$$1);
                    last = null;
                }
            }

            obj[_pre + _touchstart + id] = onTouchStart;
            obj[_pre + _touchend + id] = onTouchEnd;
            obj[_pre + 'dblclick' + id] = handler;

            obj.addEventListener(_touchstart, onTouchStart, false);
            obj.addEventListener(_touchend, onTouchEnd, false);

            // On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
            // the browser doesn't fire touchend/pointerup events but does fire
            // native dblclicks. See #4127.
            // Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
            obj.addEventListener('dblclick', handler, false);

            return this;
        }

        function removeDoubleTapListener(obj, id) {
            var touchstart = obj[_pre + _touchstart + id],
                touchend = obj[_pre + _touchend + id],
                dblclick = obj[_pre + 'dblclick' + id];

            obj.removeEventListener(_touchstart, touchstart, false);
            obj.removeEventListener(_touchend, touchend, false);
            if (!edge) {
                obj.removeEventListener('dblclick', dblclick, false);
            }

            return this;
        }

        /*
         * @namespace DomEvent
         * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
         */

        // Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

        // @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
        // Adds a listener function (`fn`) to a particular DOM event type of the
        // element `el`. You can optionally specify the context of the listener
        // (object the `this` keyword will point to). You can also pass several
        // space-separated types (e.g. `'click dblclick'`).

        // @alternative
        // @function on(el: HTMLElement, eventMap: Object, context?: Object): this
        // Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
        function on(obj, types, fn, context) {

            if (typeof types === 'object') {
                for (var type in types) {
                    addOne(obj, type, types[type], fn);
                }
            } else {
                types = splitWords(types);

                for (var i = 0, len = types.length; i < len; i++) {
                    addOne(obj, types[i], fn, context);
                }
            }

            return this;
        }

        var eventsKey = '_leaflet_events';

        // @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
        // Removes a previously added listener function. If no function is specified,
        // it will remove all the listeners of that particular DOM event from the element.
        // Note that if you passed a custom context to on, you must pass the same
        // context to `off` in order to remove the listener.

        // @alternative
        // @function off(el: HTMLElement, eventMap: Object, context?: Object): this
        // Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`

        // @alternative
        // @function off(el: HTMLElement): this
        // Removes all known event listeners
        function off(obj, types, fn, context) {

            if (typeof types === 'object') {
                for (var type in types) {
                    removeOne(obj, type, types[type], fn);
                }
            } else if (types) {
                types = splitWords(types);

                for (var i = 0, len = types.length; i < len; i++) {
                    removeOne(obj, types[i], fn, context);
                }
            } else {
                for (var j in obj[eventsKey]) {
                    removeOne(obj, j, obj[eventsKey][j]);
                }
                delete obj[eventsKey];
            }

            return this;
        }

        function addOne(obj, type, fn, context) {
            var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

            if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

            var handler = function (e) {
                return fn.call(context || obj, e || window.event);
            };

            var originalHandler = handler;

            if (pointer && type.indexOf('touch') === 0) {
                // Needs DomEvent.Pointer.js
                addPointerListener(obj, type, handler, id);

            } else if (touch && (type === 'dblclick') && addDoubleTapListener &&
                       !(pointer && chrome)) {
                // Chrome >55 does not need the synthetic dblclicks from addDoubleTapListener
                // See #5180
                addDoubleTapListener(obj, handler, id);

            } else if ('addEventListener' in obj) {

                if (type === 'mousewheel') {
                    obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

                } else if ((type === 'mouseenter') || (type === 'mouseleave')) {
                    handler = function (e) {
                        e = e || window.event;
                        if (isExternalTarget(obj, e)) {
                            originalHandler(e);
                        }
                    };
                    obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

                } else {
                    if (type === 'click' && android) {
                        handler = function (e) {
                            filterClick(e, originalHandler);
                        };
                    }
                    obj.addEventListener(type, handler, false);
                }

            } else if ('attachEvent' in obj) {
                obj.attachEvent('on' + type, handler);
            }

            obj[eventsKey] = obj[eventsKey] || {};
            obj[eventsKey][id] = handler;
        }

        function removeOne(obj, type, fn, context) {

            var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
                handler = obj[eventsKey] && obj[eventsKey][id];

            if (!handler) { return this; }

            if (pointer && type.indexOf('touch') === 0) {
                removePointerListener(obj, type, id);

            } else if (touch && (type === 'dblclick') && removeDoubleTapListener) {
                removeDoubleTapListener(obj, id);

            } else if ('removeEventListener' in obj) {

                if (type === 'mousewheel') {
                    obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

                } else {
                    obj.removeEventListener(
                        type === 'mouseenter' ? 'mouseover' :
                        type === 'mouseleave' ? 'mouseout' : type, handler, false);
                }

            } else if ('detachEvent' in obj) {
                obj.detachEvent('on' + type, handler);
            }

            obj[eventsKey][id] = null;
        }

        // @function stopPropagation(ev: DOMEvent): this
        // Stop the given event from propagation to parent elements. Used inside the listener functions:
        // ```js
        // L.DomEvent.on(div, 'click', function (ev) {
        // 	L.DomEvent.stopPropagation(ev);
        // });
        // ```
        function stopPropagation(e) {

            if (e.stopPropagation) {
                e.stopPropagation();
            } else if (e.originalEvent) {  // In case of Leaflet event.
                e.originalEvent._stopped = true;
            } else {
                e.cancelBubble = true;
            }
            skipped(e);

            return this;
        }

        // @function disableScrollPropagation(el: HTMLElement): this
        // Adds `stopPropagation` to the element's `'mousewheel'` events (plus browser variants).
        function disableScrollPropagation(el) {
            addOne(el, 'mousewheel', stopPropagation);
            return this;
        }

        // @function disableClickPropagation(el: HTMLElement): this
        // Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
        // `'mousedown'` and `'touchstart'` events (plus browser variants).
        function disableClickPropagation(el) {
            on(el, 'mousedown touchstart dblclick', stopPropagation);
            addOne(el, 'click', fakeStop);
            return this;
        }

        // @function preventDefault(ev: DOMEvent): this
        // Prevents the default action of the DOM Event `ev` from happening (such as
        // following a link in the href of the a element, or doing a POST request
        // with page reload when a `<form>` is submitted).
        // Use it inside listener functions.
        function preventDefault(e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return this;
        }

        // @function stop(ev): this
        // Does `stopPropagation` and `preventDefault` at the same time.
        function stop(e) {
            preventDefault(e);
            stopPropagation(e);
            return this;
        }

        // @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
        // Gets normalized mouse position from a DOM event relative to the
        // `container` or to the whole page if not specified.
        function getMousePosition(e, container) {
            if (!container) {
                return new Point(e.clientX, e.clientY);
            }

            var rect = container.getBoundingClientRect();

            return new Point(
                e.clientX - rect.left - container.clientLeft,
                e.clientY - rect.top - container.clientTop);
        }

        // Chrome on Win scrolls double the pixels as in other platforms (see #4538),
        // and Firefox scrolls device pixels, not CSS pixels
        var wheelPxFactor =
            (win && chrome) ? 2 * window.devicePixelRatio :
            gecko ? window.devicePixelRatio : 1;

        // @function getWheelDelta(ev: DOMEvent): Number
        // Gets normalized wheel delta from a mousewheel DOM event, in vertical
        // pixels scrolled (negative if scrolling down).
        // Events from pointing devices without precise scrolling are mapped to
        // a best guess of 60 pixels.
        function getWheelDelta(e) {
            return (edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
                   (e.deltaY && e.deltaMode === 0) ? -e.deltaY / wheelPxFactor : // Pixels
                   (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
                   (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
                   (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
                   e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
                   (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
                   e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
                   0;
        }

        var skipEvents = {};

        function fakeStop(e) {
            // fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
            skipEvents[e.type] = true;
        }

        function skipped(e) {
            var events = skipEvents[e.type];
            // reset when checking, as it's only used in map container and propagates outside of the map
            skipEvents[e.type] = false;
            return events;
        }

        // check if element really left/entered the event target (for mouseenter/mouseleave)
        function isExternalTarget(el, e) {

            var related = e.relatedTarget;

            if (!related) { return true; }

            try {
                while (related && (related !== el)) {
                    related = related.parentNode;
                }
            } catch (err) {
                return false;
            }
            return (related !== el);
        }

        var lastClick;

        // this is a horrible workaround for a bug in Android where a single touch triggers two click events
        function filterClick(e, handler) {
            var timeStamp = (e.timeStamp || (e.originalEvent && e.originalEvent.timeStamp)),
                elapsed = lastClick && (timeStamp - lastClick);

            // are they closer together than 500ms yet more than 100ms?
            // Android typically triggers them ~300ms apart while multiple listeners
            // on the same event should be triggered far faster;
            // or check if click is simulated on the element, and if it is, reject any non-simulated events

            if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
                stop(e);
                return;
            }
            lastClick = timeStamp;

            handler(e);
        }




        var DomEvent = (Object.freeze || Object)({
            on: on,
            off: off,
            stopPropagation: stopPropagation,
            disableScrollPropagation: disableScrollPropagation,
            disableClickPropagation: disableClickPropagation,
            preventDefault: preventDefault,
            stop: stop,
            getMousePosition: getMousePosition,
            getWheelDelta: getWheelDelta,
            fakeStop: fakeStop,
            skipped: skipped,
            isExternalTarget: isExternalTarget,
            addListener: on,
            removeListener: off
        });

        /*
         * @namespace DomUtil
         *
         * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
         * tree, used by Leaflet internally.
         *
         * Most functions expecting or returning a `HTMLElement` also work for
         * SVG elements. The only difference is that classes refer to CSS classes
         * in HTML and SVG classes in SVG.
         */


        // @property TRANSFORM: String
        // Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
        var TRANSFORM = testProp(
            ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

        // webkitTransition comes first because some browser versions that drop vendor prefix don't do
        // the same for the transitionend event, in particular the Android 4.1 stock browser

        // @property TRANSITION: String
        // Vendor-prefixed transition style name.
        var TRANSITION = testProp(
            ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

        // @property TRANSITION_END: String
        // Vendor-prefixed transitionend event name.
        var TRANSITION_END =
            TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';


        // @function get(id: String|HTMLElement): HTMLElement
        // Returns an element given its DOM id, or returns the element itself
        // if it was passed directly.
        function get(id) {
            return typeof id === 'string' ? document.getElementById(id) : id;
        }

        // @function getStyle(el: HTMLElement, styleAttrib: String): String
        // Returns the value for a certain style attribute on an element,
        // including computed values or values set through CSS.
        function getStyle(el, style) {
            var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

            if ((!value || value === 'auto') && document.defaultView) {
                var css = document.defaultView.getComputedStyle(el, null);
                value = css ? css[style] : null;
            }
            return value === 'auto' ? null : value;
        }

        // @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
        // Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
        function create$1(tagName, className, container) {
            var el = document.createElement(tagName);
            el.className = className || '';

            if (container) {
                container.appendChild(el);
            }
            return el;
        }

        // @function remove(el: HTMLElement)
        // Removes `el` from its parent element
        function remove(el) {
            var parent = el.parentNode;
            if (parent) {
                parent.removeChild(el);
            }
        }

        // @function empty(el: HTMLElement)
        // Removes all of `el`'s children elements from `el`
        function empty(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }

        // @function toFront(el: HTMLElement)
        // Makes `el` the last child of its parent, so it renders in front of the other children.
        function toFront(el) {
            var parent = el.parentNode;
            if (parent.lastChild !== el) {
                parent.appendChild(el);
            }
        }

        // @function toBack(el: HTMLElement)
        // Makes `el` the first child of its parent, so it renders behind the other children.
        function toBack(el) {
            var parent = el.parentNode;
            if (parent.firstChild !== el) {
                parent.insertBefore(el, parent.firstChild);
            }
        }

        // @function hasClass(el: HTMLElement, name: String): Boolean
        // Returns `true` if the element's class attribute contains `name`.
        function hasClass(el, name) {
            if (el.classList !== undefined) {
                return el.classList.contains(name);
            }
            var className = getClass(el);
            return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
        }

        // @function addClass(el: HTMLElement, name: String)
        // Adds `name` to the element's class attribute.
        function addClass(el, name) {
            if (el.classList !== undefined) {
                var classes = splitWords(name);
                for (var i = 0, len = classes.length; i < len; i++) {
                    el.classList.add(classes[i]);
                }
            } else if (!hasClass(el, name)) {
                var className = getClass(el);
                setClass(el, (className ? className + ' ' : '') + name);
            }
        }

        // @function removeClass(el: HTMLElement, name: String)
        // Removes `name` from the element's class attribute.
        function removeClass(el, name) {
            if (el.classList !== undefined) {
                el.classList.remove(name);
            } else {
                setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
            }
        }

        // @function setClass(el: HTMLElement, name: String)
        // Sets the element's class.
        function setClass(el, name) {
            if (el.className.baseVal === undefined) {
                el.className = name;
            } else {
                // in case of SVG element
                el.className.baseVal = name;
            }
        }

        // @function getClass(el: HTMLElement): String
        // Returns the element's class.
        function getClass(el) {
            return el.className.baseVal === undefined ? el.className : el.className.baseVal;
        }

        // @function setOpacity(el: HTMLElement, opacity: Number)
        // Set the opacity of an element (including old IE support).
        // `opacity` must be a number from `0` to `1`.
        function setOpacity(el, value) {
            if ('opacity' in el.style) {
                el.style.opacity = value;
            } else if ('filter' in el.style) {
                _setOpacityIE(el, value);
            }
        }

        function _setOpacityIE(el, value) {
            var filter = false,
                filterName = 'DXImageTransform.Microsoft.Alpha';

            // filters collection throws an error if we try to retrieve a filter that doesn't exist
            try {
                filter = el.filters.item(filterName);
            } catch (e) {
                // don't set opacity to 1 if we haven't already set an opacity,
                // it isn't needed and breaks transparent pngs.
                if (value === 1) { return; }
            }

            value = Math.round(value * 100);

            if (filter) {
                filter.Enabled = (value !== 100);
                filter.Opacity = value;
            } else {
                el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
            }
        }

        // @function testProp(props: String[]): String|false
        // Goes through the array of style names and returns the first name
        // that is a valid style name for an element. If no such name is found,
        // it returns false. Useful for vendor-prefixed styles like `transform`.
        function testProp(props) {
            var style = document.documentElement.style;

            for (var i = 0; i < props.length; i++) {
                if (props[i] in style) {
                    return props[i];
                }
            }
            return false;
        }

        // @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
        // Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
        // and optionally scaled by `scale`. Does not have an effect if the
        // browser doesn't support 3D CSS transforms.
        function setTransform(el, offset, scale) {
            var pos = offset || new Point(0, 0);

            el.style[TRANSFORM] =
                (ie3d ?
                    'translate(' + pos.x + 'px,' + pos.y + 'px)' :
                    'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
                (scale ? ' scale(' + scale + ')' : '');
        }

        // @function setPosition(el: HTMLElement, position: Point)
        // Sets the position of `el` to coordinates specified by `position`,
        // using CSS translate or top/left positioning depending on the browser
        // (used by Leaflet internally to position its layers).
        function setPosition(el, point) {

            /*eslint-disable */
            el._leaflet_pos = point;
            /*eslint-enable */

            if (any3d) {
                setTransform(el, point);
            } else {
                el.style.left = point.x + 'px';
                el.style.top = point.y + 'px';
            }
        }

        // @function getPosition(el: HTMLElement): Point
        // Returns the coordinates of an element previously positioned with setPosition.
        function getPosition(el) {
            // this method is only used for elements previously positioned using setPosition,
            // so it's safe to cache the position for performance

            return el._leaflet_pos || new Point(0, 0);
        }

        // @function disableTextSelection()
        // Prevents the user from generating `selectstart` DOM events, usually generated
        // when the user drags the mouse through a page with text. Used internally
        // by Leaflet to override the behaviour of any click-and-drag interaction on
        // the map. Affects drag interactions on the whole document.

        // @function enableTextSelection()
        // Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
        var disableTextSelection;
        var enableTextSelection;
        var _userSelect;
        if ('onselectstart' in document) {
            disableTextSelection = function () {
                on(window, 'selectstart', preventDefault);
            };
            enableTextSelection = function () {
                off(window, 'selectstart', preventDefault);
            };
        } else {
            var userSelectProperty = testProp(
                ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

            disableTextSelection = function () {
                if (userSelectProperty) {
                    var style = document.documentElement.style;
                    _userSelect = style[userSelectProperty];
                    style[userSelectProperty] = 'none';
                }
            };
            enableTextSelection = function () {
                if (userSelectProperty) {
                    document.documentElement.style[userSelectProperty] = _userSelect;
                    _userSelect = undefined;
                }
            };
        }

        // @function disableImageDrag()
        // As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
        // for `dragstart` DOM events, usually generated when the user drags an image.
        function disableImageDrag() {
            on(window, 'dragstart', preventDefault);
        }

        // @function enableImageDrag()
        // Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
        function enableImageDrag() {
            off(window, 'dragstart', preventDefault);
        }

        var _outlineElement;
        var _outlineStyle;
        // @function preventOutline(el: HTMLElement)
        // Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
        // of the element `el` invisible. Used internally by Leaflet to prevent
        // focusable elements from displaying an outline when the user performs a
        // drag interaction on them.
        function preventOutline(element) {
            while (element.tabIndex === -1) {
                element = element.parentNode;
            }
            if (!element.style) { return; }
            restoreOutline();
            _outlineElement = element;
            _outlineStyle = element.style.outline;
            element.style.outline = 'none';
            on(window, 'keydown', restoreOutline);
        }

        // @function restoreOutline()
        // Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
        function restoreOutline() {
            if (!_outlineElement) { return; }
            _outlineElement.style.outline = _outlineStyle;
            _outlineElement = undefined;
            _outlineStyle = undefined;
            off(window, 'keydown', restoreOutline);
        }


        var DomUtil = (Object.freeze || Object)({
            TRANSFORM: TRANSFORM,
            TRANSITION: TRANSITION,
            TRANSITION_END: TRANSITION_END,
            get: get,
            getStyle: getStyle,
            create: create$1,
            remove: remove,
            empty: empty,
            toFront: toFront,
            toBack: toBack,
            hasClass: hasClass,
            addClass: addClass,
            removeClass: removeClass,
            setClass: setClass,
            getClass: getClass,
            setOpacity: setOpacity,
            testProp: testProp,
            setTransform: setTransform,
            setPosition: setPosition,
            getPosition: getPosition,
            disableTextSelection: disableTextSelection,
            enableTextSelection: enableTextSelection,
            disableImageDrag: disableImageDrag,
            enableImageDrag: enableImageDrag,
            preventOutline: preventOutline,
            restoreOutline: restoreOutline
        });

        /*
         * @class PosAnimation
         * @aka L.PosAnimation
         * @inherits Evented
         * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
         *
         * @example
         * ```js
         * var fx = new L.PosAnimation();
         * fx.run(el, [300, 500], 0.5);
         * ```
         *
         * @constructor L.PosAnimation()
         * Creates a `PosAnimation` object.
         *
         */

        var PosAnimation = Evented.extend({

            // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
            // Run an animation of a given element to a new position, optionally setting
            // duration in seconds (`0.25` by default) and easing linearity factor (3rd
            // argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
            // `0.5` by default).
            run: function (el, newPos, duration, easeLinearity) {
                this.stop();

                this._el = el;
                this._inProgress = true;
                this._duration = duration || 0.25;
                this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

                this._startPos = getPosition(el);
                this._offset = newPos.subtract(this._startPos);
                this._startTime = +new Date();

                // @event start: Event
                // Fired when the animation starts
                this.fire('start');

                this._animate();
            },

            // @method stop()
            // Stops the animation (if currently running).
            stop: function () {
                if (!this._inProgress) { return; }

                this._step(true);
                this._complete();
            },

            _animate: function () {
                // animation loop
                this._animId = requestAnimFrame(this._animate, this);
                this._step();
            },

            _step: function (round) {
                var elapsed = (+new Date()) - this._startTime,
                    duration = this._duration * 1000;

                if (elapsed < duration) {
                    this._runFrame(this._easeOut(elapsed / duration), round);
                } else {
                    this._runFrame(1);
                    this._complete();
                }
            },

            _runFrame: function (progress, round) {
                var pos = this._startPos.add(this._offset.multiplyBy(progress));
                if (round) {
                    pos._round();
                }
                setPosition(this._el, pos);

                // @event step: Event
                // Fired continuously during the animation.
                this.fire('step');
            },

            _complete: function () {
                cancelAnimFrame(this._animId);

                this._inProgress = false;
                // @event end: Event
                // Fired when the animation ends.
                this.fire('end');
            },

            _easeOut: function (t) {
                return 1 - Math.pow(1 - t, this._easeOutPower);
            }
        });










        /*
         * @namespace LineUtil
         *
         * Various utility functions for polyine points processing, used by Leaflet internally to make polylines lightning-fast.
         */

        // Simplify polyline with vertex reduction and Douglas-Peucker simplification.
        // Improves rendering performance dramatically by lessening the number of points to draw.

        // @function simplify(points: Point[], tolerance: Number): Point[]
        // Dramatically reduces the number of points in a polyline while retaining
        // its shape and returns a new array of simplified points, using the
        // [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
        // Used for a huge performance boost when processing/displaying Leaflet polylines for
        // each zoom level and also reducing visual noise. tolerance affects the amount of
        // simplification (lesser value means higher quality but slower and with more points).
        // Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
        function simplify(points, tolerance) {
            if (!tolerance || !points.length) {
                return points.slice();
            }

            var sqTolerance = tolerance * tolerance;

            // stage 1: vertex reduction
            points = _reducePoints(points, sqTolerance);

            // stage 2: Douglas-Peucker simplification
            points = _simplifyDP(points, sqTolerance);

            return points;
        }

        // @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
        // Returns the distance between point `p` and segment `p1` to `p2`.
        function pointToSegmentDistance(p, p1, p2) {
            return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
        }

        // @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
        // Returns the closest point from a point `p` on a segment `p1` to `p2`.
        function closestPointOnSegment(p, p1, p2) {
            return _sqClosestPointOnSegment(p, p1, p2);
        }

        // Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
        function _simplifyDP(points, sqTolerance) {

            var len = points.length,
                ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
                markers = new ArrayConstructor(len);

            markers[0] = markers[len - 1] = 1;

            _simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

            var i,
                newPoints = [];

            for (i = 0; i < len; i++) {
                if (markers[i]) {
                    newPoints.push(points[i]);
                }
            }

            return newPoints;
        }

        function _simplifyDPStep(points, markers, sqTolerance, first, last) {

            var maxSqDist = 0,
            index, i, sqDist;

            for (i = first + 1; i <= last - 1; i++) {
                sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }

            if (maxSqDist > sqTolerance) {
                markers[index] = 1;

                _simplifyDPStep(points, markers, sqTolerance, first, index);
                _simplifyDPStep(points, markers, sqTolerance, index, last);
            }
        }

        // reduce points that are too close to each other to a single point
        function _reducePoints(points, sqTolerance) {
            var reducedPoints = [points[0]];

            for (var i = 1, prev = 0, len = points.length; i < len; i++) {
                if (_sqDist(points[i], points[prev]) > sqTolerance) {
                    reducedPoints.push(points[i]);
                    prev = i;
                }
            }
            if (prev < len - 1) {
                reducedPoints.push(points[len - 1]);
            }
            return reducedPoints;
        }

        var _lastCode;

        // @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
        // Clips the segment a to b by rectangular bounds with the
        // [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
        // (modifying the segment points directly!). Used by Leaflet to only show polyline
        // points that are on the screen or near, increasing performance.
        function clipSegment(a, b, bounds, useLastCode, round) {
            var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
                codeB = _getBitCode(b, bounds),

                codeOut, p, newCode;

            // save 2nd code to avoid calculating it on the next segment
            _lastCode = codeB;

            while (true) {
                // if a,b is inside the clip window (trivial accept)
                if (!(codeA | codeB)) {
                    return [a, b];
                }

                // if a,b is outside the clip window (trivial reject)
                if (codeA & codeB) {
                    return false;
                }

                // other cases
                codeOut = codeA || codeB;
                p = _getEdgeIntersection(a, b, codeOut, bounds, round);
                newCode = _getBitCode(p, bounds);

                if (codeOut === codeA) {
                    a = p;
                    codeA = newCode;
                } else {
                    b = p;
                    codeB = newCode;
                }
            }
        }

        function _getEdgeIntersection(a, b, code, bounds, round) {
            var dx = b.x - a.x,
                dy = b.y - a.y,
                min = bounds.min,
                max = bounds.max,
                x, y;

            if (code & 8) { // top
                x = a.x + dx * (max.y - a.y) / dy;
                y = max.y;

            } else if (code & 4) { // bottom
                x = a.x + dx * (min.y - a.y) / dy;
                y = min.y;

            } else if (code & 2) { // right
                x = max.x;
                y = a.y + dy * (max.x - a.x) / dx;

            } else if (code & 1) { // left
                x = min.x;
                y = a.y + dy * (min.x - a.x) / dx;
            }

            return new Point(x, y, round);
        }

        function _getBitCode(p, bounds) {
            var code = 0;

            if (p.x < bounds.min.x) { // left
                code |= 1;
            } else if (p.x > bounds.max.x) { // right
                code |= 2;
            }

            if (p.y < bounds.min.y) { // bottom
                code |= 4;
            } else if (p.y > bounds.max.y) { // top
                code |= 8;
            }

            return code;
        }

        // square distance (to avoid unnecessary Math.sqrt calls)
        function _sqDist(p1, p2) {
            var dx = p2.x - p1.x,
                dy = p2.y - p1.y;
            return dx * dx + dy * dy;
        }

        // return closest point on segment or distance to that point
        function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
            var x = p1.x,
                y = p1.y,
                dx = p2.x - x,
                dy = p2.y - y,
                dot = dx * dx + dy * dy,
                t;

            if (dot > 0) {
                t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

                if (t > 1) {
                    x = p2.x;
                    y = p2.y;
                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }

            dx = p.x - x;
            dy = p.y - y;

            return sqDist ? dx * dx + dy * dy : new Point(x, y);
        }


        // @function isFlat(latlngs: LatLng[]): Boolean
        // Returns true if `latlngs` is a flat array, false is nested.
        function isFlat(latlngs) {
            return !isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
        }

        function _flat(latlngs) {
            console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
            return isFlat(latlngs);
        }


        var LineUtil = (Object.freeze || Object)({
            simplify: simplify,
            pointToSegmentDistance: pointToSegmentDistance,
            closestPointOnSegment: closestPointOnSegment,
            clipSegment: clipSegment,
            _getEdgeIntersection: _getEdgeIntersection,
            _getBitCode: _getBitCode,
            _sqClosestPointOnSegment: _sqClosestPointOnSegment,
            isFlat: isFlat,
            _flat: _flat
        });

        /*
         * @namespace PolyUtil
         * Various utility functions for polygon geometries.
         */

        /* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
         * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgeman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
         * Used by Leaflet to only show polygon points that are on the screen or near, increasing
         * performance. Note that polygon points needs different algorithm for clipping
         * than polyline, so there's a seperate method for it.
         */
        function clipPolygon(points, bounds, round) {
            var clippedPoints,
                edges = [1, 4, 2, 8],
                i, j, k,
                a, b,
                len, edge, p;

            for (i = 0, len = points.length; i < len; i++) {
                points[i]._code = _getBitCode(points[i], bounds);
            }

            // for each edge (left, bottom, right, top)
            for (k = 0; k < 4; k++) {
                edge = edges[k];
                clippedPoints = [];

                for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
                    a = points[i];
                    b = points[j];

                    // if a is inside the clip window
                    if (!(a._code & edge)) {
                        // if b is outside the clip window (a->b goes out of screen)
                        if (b._code & edge) {
                            p = _getEdgeIntersection(b, a, edge, bounds, round);
                            p._code = _getBitCode(p, bounds);
                            clippedPoints.push(p);
                        }
                        clippedPoints.push(a);

                        // else if b is inside the clip window (a->b enters the screen)
                    } else if (!(b._code & edge)) {
                        p = _getEdgeIntersection(b, a, edge, bounds, round);
                        p._code = _getBitCode(p, bounds);
                        clippedPoints.push(p);
                    }
                }
                points = clippedPoints;
            }

            return points;
        }


        var PolyUtil = (Object.freeze || Object)({
            clipPolygon: clipPolygon
        });

        /*
         * @namespace Projection
         * @section
         * Leaflet comes with a set of already defined Projections out of the box:
         *
         * @projection L.Projection.LonLat
         *
         * Equirectangular, or Plate Carree projection — the most simple projection,
         * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
         * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
         * `EPSG:4326` and `Simple` CRS.
         */

        var LonLat = {
            project: function (latlng) {
                return new Point(latlng.lng, latlng.lat);
            },

            unproject: function (point) {
                return new LatLng(point.y, point.x);
            },

            bounds: new Bounds([-180, -90], [180, 90])
        };

        /*
         * @namespace Projection
         * @projection L.Projection.Mercator
         *
         * Elliptical Mercator projection — more complex than Spherical Mercator. Takes into account that Earth is a geoid, not a perfect sphere. Used by the EPSG:3395 CRS.
         */

        var Mercator = {
            R: 6378137,
            R_MINOR: 6356752.314245179,

            bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

            project: function (latlng) {
                var d = Math.PI / 180,
                    r = this.R,
                    y = latlng.lat * d,
                    tmp = this.R_MINOR / r,
                    e = Math.sqrt(1 - tmp * tmp),
                    con = e * Math.sin(y);

                var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
                y = -r * Math.log(Math.max(ts, 1E-10));

                return new Point(latlng.lng * d * r, y);
            },

            unproject: function (point) {
                var d = 180 / Math.PI,
                    r = this.R,
                    tmp = this.R_MINOR / r,
                    e = Math.sqrt(1 - tmp * tmp),
                    ts = Math.exp(-point.y / r),
                    phi = Math.PI / 2 - 2 * Math.atan(ts);

                for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
                    con = e * Math.sin(phi);
                    con = Math.pow((1 - con) / (1 + con), e / 2);
                    dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
                    phi += dphi;
                }

                return new LatLng(phi * d, point.x * d / r);
            }
        };

        /*
         * @class Projection
        
         * An object with methods for projecting geographical coordinates of the world onto
         * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).
        
         * @property bounds: Bounds
         * The bounds (specified in CRS units) where the projection is valid
        
         * @method project(latlng: LatLng): Point
         * Projects geographical coordinates into a 2D point.
         * Only accepts actual `L.LatLng` instances, not arrays.
        
         * @method unproject(point: Point): LatLng
         * The inverse of `project`. Projects a 2D point into a geographical location.
         * Only accepts actual `L.Point` instances, not arrays.
        
         */




        var index = (Object.freeze || Object)({
            LonLat: LonLat,
            Mercator: Mercator,
            SphericalMercator: SphericalMercator
        });

        /*
         * @namespace CRS
         * @crs L.CRS.EPSG3395
         *
         * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
         */
        var EPSG3395 = extend({}, Earth, {
            code: 'EPSG:3395',
            projection: Mercator,

            transformation: (function () {
                var scale = 0.5 / (Math.PI * Mercator.R);
                return toTransformation(scale, 0.5, -scale, 0.5);
            }())
        });

        /*
         * @namespace CRS
         * @crs L.CRS.EPSG4326
         *
         * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
         *
         * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
         * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
         * with this CRS, ensure that there are two 256x256 pixel tiles covering the
         * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
         * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
         */

        var EPSG4326 = extend({}, Earth, {
            code: 'EPSG:4326',
            projection: LonLat,
            transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
        });

        /*
         * @namespace CRS
         * @crs L.CRS.Simple
         *
         * A simple CRS that maps longitude and latitude into `x` and `y` directly.
         * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
         * axis should still be inverted (going from bottom to top). `distance()` returns
         * simple euclidean distance.
         */

        var Simple = extend({}, CRS, {
            projection: LonLat,
            transformation: toTransformation(1, 0, -1, 0),

            scale: function (zoom) {
                return Math.pow(2, zoom);
            },

            zoom: function (scale) {
                return Math.log(scale) / Math.LN2;
            },

            distance: function (latlng1, latlng2) {
                var dx = latlng2.lng - latlng1.lng,
                    dy = latlng2.lat - latlng1.lat;

                return Math.sqrt(dx * dx + dy * dy);
            },

            infinite: true
        });

        CRS.Earth = Earth;
        CRS.EPSG3395 = EPSG3395;
        CRS.EPSG3857 = EPSG3857;
        CRS.EPSG900913 = EPSG900913;
        CRS.EPSG4326 = EPSG4326;
        CRS.Simple = Simple;




        // misc

        var oldL = window.L;
        function noConflict() {
            window.L = oldL;
            return this;
        }

        // Always export us to window global (see #2364)
        window.L = exports;

        Object.freeze = freeze;

        exports.version = version;
        exports.noConflict = noConflict;
        exports.Browser = Browser;
        exports.Evented = Evented;
        exports.Util = Util;
        exports.Class = Class;
        exports.extend = extend;
        exports.bind = bind;
        exports.stamp = stamp;
        exports.setOptions = setOptions;
        exports.DomEvent = DomEvent;
        exports.DomUtil = DomUtil;
        exports.PosAnimation = PosAnimation;
        exports.Point = Point;
        exports.point = toPoint;
        exports.Bounds = Bounds;
        exports.bounds = toBounds;
        exports.Transformation = Transformation;
        exports.transformation = toTransformation;
        exports.LatLng = LatLng;
        exports.latLng = toLatLng;
        exports.LatLngBounds = LatLngBounds;
        exports.latLngBounds = toLatLngBounds;
        exports.CRS = CRS;

    })));


    /***/
}),
/* 28 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 15:26:05 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default

    /**
     * An editor that allows you to edit an ellipse
     */
    var EllipseEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.options = options;
        this.draggers = [];
        this.heightDraggers = [];
        this.initDraggers();
    };

    EllipseEditor.prototype.initDraggers = function () {
        var that = this;
        // Create a dragger that just modifies the entities position.
        var dragger = _drawutils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            //      position: _drawutils.getPositionsWithHeight(this.entity.position._value,Number(this.entity.attribute.style.height || 0)),
            position: this.entity.position._value,
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, that.entity.position._value, diff);
                var cartoLoc = Cesium.Cartographic.fromCartesian(newPosition);
                var modelHeight = Number(cartoLoc.height).toFixed(2);
                that.entity.ellipse.height = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.height = modelHeight;
                that.entity.position._value = newPosition;

                var newPos = new Cesium.Cartesian3();
                Cesium.Cartesian3.add(dragger.majorDragger.position._value, diff, newPos)
                dragger.majorDragger.position = new Cesium.ConstantProperty(newPos);

                Cesium.Cartesian3.add(dragger.minorDragger.position._value, diff, newPos)
                dragger.minorDragger.position = new Cesium.ConstantProperty(newPos);

                if (that.entity.attribute.style.extrudedHeight != undefined)
                    that.updateHeightDraggers();
                that.entity.changeEditing();
            }
        });
        this.draggers.push(dragger);

        //获取椭圆上的坐标点数组
        var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions({
            center: this.entity.position._value,
            semiMinorAxis: this.entity.ellipse.semiMinorAxis._value,
            semiMajorAxis: this.entity.ellipse.semiMajorAxis._value,
            rotation: Cesium.Math.toRadians(Number(this.entity.attribute.style.rotation || 0)),
            granularity: 2.0
        }, true, false);

        //长半轴上的坐标点
        var majorPos = new Cesium.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);

        var majorDragger = _drawutils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: majorPos,
            onDrag: function (dragger, newPosition) {
                var majorRadius = Cesium.Cartesian3.distance(that.entity.position._value, newPosition);
                var thisradius = Number(majorRadius.toFixed(2));
                that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(thisradius);
                if (that.entity.attribute.style.radius) {
                    that.entity.attribute.style.radius = thisradius;
                    that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(thisradius);
                }
                else {
                    that.entity.attribute.style.semiMajorAxis = thisradius;
                }
                if (that.entity.attribute.style.extrudedHeight != undefined)
                    that.updateHeightDraggers();
                that.entity.changeEditing();
            }
        });
        dragger.majorDragger = majorDragger;
        this.draggers.push(majorDragger);

        //短半轴上的坐标点
        var minorPos = new Cesium.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
        var minorDragger = _drawutils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: minorPos,
            onDrag: function (dragger, newPosition) {
                var minorRadius = Cesium.Cartesian3.distance(that.entity.position._value, newPosition);
                var thisradius = Number(minorRadius.toFixed(2));
                that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(thisradius);
                if (that.entity.attribute.style.radius) {
                    that.entity.attribute.style.radius = thisradius;
                    that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(thisradius);
                }
                else {
                    that.entity.attribute.style.semiMinorAxis = thisradius;
                }
                if (that.entity.attribute.style.extrudedHeight != undefined)
                    that.updateHeightDraggers();
                that.entity.changeEditing();
            }
        });
        dragger.minorDragger = minorDragger;
        this.draggers.push(minorDragger);

        if (this.entity.attribute.style.extrudedHeight != undefined)
            this.initHeightDraggers();
    };

    //创建高程拖拽点
    EllipseEditor.prototype.initHeightDraggers = function () {
        var that = this;
        // Create a dragger that just modifies the entities position.
        var extrudedHeight = Number(this.entity.attribute.style.extrudedHeight) - Number(this.entity.attribute.style.height);
        var hDragger = _drawutils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: _drawutils.getPositionsWithHeight(this.entity.position._value, extrudedHeight),
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, that.entity.position._value, diff);
                var cartoLoc = Cesium.Cartographic.fromCartesian(newPosition);
                var modelHeight = Number(cartoLoc.height).toFixed(2);
                that.entity.position._value = newPosition;
                that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(Number(modelHeight) + Number(extrudedHeight));
                that.entity.ellipse.height = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.extrudedHeight = Number(modelHeight) + Number(extrudedHeight);
                that.entity.attribute.style.height = modelHeight;
                that.updateDraggers();
                that.entity.changeEditing();
            }
        });

        this.heightDraggers.push(hDragger);

        var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions({
            center: this.entity.position._value,
            semiMinorAxis: this.entity.ellipse.semiMinorAxis._value,
            semiMajorAxis: this.entity.ellipse.semiMajorAxis._value,
            rotation: Cesium.Math.toRadians(Number(this.entity.attribute.style.rotation || 0)),
            granularity: 2.0
        }, true, false);
        var majorPos = new Cesium.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);

        var majorHDragger = _drawutils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: _drawutils.getPositionsWithHeight(majorPos, extrudedHeight),
            onDrag: function (dragger, position) {
                var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.extrudedHeight = Number(cartoLoc.height).toFixed(2);
                that.updateHeightDraggers();
                that.entity.changeEditing();
            },
            vertical: true,
            horizontal: false
        });
        this.heightDraggers.push(majorHDragger);

        var minorPos = new Cesium.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
        var minorHDragger = _drawutils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: _drawutils.getPositionsWithHeight(minorPos, extrudedHeight),
            onDrag: function (dragger, position) {
                var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.extrudedHeight = Number(cartoLoc.height).toFixed(2);
                that.updateHeightDraggers();
                that.entity.changeEditing();
            },
            vertical: true,
            horizontal: false
        });
        this.heightDraggers.push(minorHDragger);
    };

    //更新拖拽点
    EllipseEditor.prototype.updateDraggers = function () {
        this.destroy();
        this.initDraggers();
    };

    //更新高程拖拽点
    EllipseEditor.prototype.updateHeightDraggers = function () {
        for (var i = 0; i < this.heightDraggers.length; i++) {
            this.dataSource.entities.remove(this.heightDraggers[i]);
        }
        this.heightDraggers = [];
        this.initHeightDraggers();
    };

    EllipseEditor.prototype.destroy = function () {
        var i = 0;
        for (i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
        if (this.entity.attribute.style.extrudedHeight != undefined) {
            for (i = 0; i < this.heightDraggers.length; i++) {
                this.dataSource.entities.remove(this.heightDraggers[i]);
            }
            this.heightDraggers = [];
        }
    };

    /* harmony default export */ __webpack_exports__["default"] = (EllipseEditor);


    /***/
}),
/* 29 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 15:26:05 | 修改 木遥（QQ：346819890） */
    var _drawutils = __webpack_require__(0).default
    /**
     * 编辑椭球
     * An editor that allows you to edit an ellipsoid
     */
    var EllipsoidEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.options = options;
        this.draggers = [];
        this.initDraggers();
    };

    //创建拖拽点
    EllipsoidEditor.prototype.initDraggers = function () {
        var that = this;
        var ellipsoidPs = this.entity.position._value;
        var radii = Number(this.entity.attribute.style.heightRadii) || 0;
        var carto = Cesium.Cartographic.fromCartesian(ellipsoidPs);
        carto.height += radii;
        var draggerPs = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
        // Create a dragger that just modifies the entities position.
        var dragger = _drawutils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: draggerPs,
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, that.entity.position._value, diff);

                var carto = Cesium.Cartographic.fromCartesian(newPosition);
                var radii = Number(that.entity.attribute.style.heightRadii) || 0;
                carto.height -= radii;
                var draggerPs = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);

                that.entity.position._value = draggerPs;//newPosition;

                that.entity.changeEditing();
            }
        });
        this.draggers.push(dragger);
    };

    EllipsoidEditor.prototype.updateDraggers = function () {
        this.destroy();
        this.initDraggers();
    };

    EllipsoidEditor.prototype.destroy = function () {
        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    };


    /* harmony default export */ __webpack_exports__["default"] = (EllipsoidEditor);

    /***/
}),
/* 30 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 15:26:05 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default
    /**
     * 编辑规则立面体
     * ExtrudedPolygon editor.
     */
    var ExtrudedPolygonEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];
        this.heightDraggers = [];

        var that = this;
        var i = 0;
        var positions = entity.polygon.hierarchy._value;
        //entity.polygon.hierarchy.isConstant = false;
        for (i = 0; i < positions.length; i++) {
            var loc = positions[i];
            if (entity.polygon.height != undefined) {
                var carto = Cesium.Cartographic.fromCartesian(loc);
                carto.height += entity.polygon.height._value;
                loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            }

            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;

                    var entityPositions = entity.polygon.hierarchy._value;
                    var extrudedPs = entityPositions[0];
                    for (var i = 1; i < entityPositions.length; i++) {
                        var tempCarto1 = Cesium.Cartographic.fromCartesian(extrudedPs);
                        var tempCarto2 = Cesium.Cartographic.fromCartesian(entityPositions[i]);
                        if (Number(tempCarto2.height) > Number(tempCarto1.height)) {
                            extrudedPs = entityPositions[i];
                        }
                    }
                    var extrHeight = Number(entity.polygon.extrudedHeight) - Number(Cesium.Cartographic.fromCartesian(extrudedPs).height);
                    entity.attribute.style.extrudedHeight = Number(extrHeight).toFixed(2);

                    that.updateDraggers();
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }

        // Add a dragger that will change the extruded height on the polygon.
        //创建高程拖拽点
        if (entity.polygon.extrudedHeight) {
            for (i = 0; i < positions.length; i++) {
                var position = positions[i];
                var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                cartoLoc.height = entity.polygon.extrudedHeight._value;
                var draggerPs = Cesium.Cartesian3.fromRadians(cartoLoc.longitude, cartoLoc.latitude, cartoLoc.height);

                var dragger = _drawutils.createDragger(this.dataSource, {
                    dragIcon: options.dragIcon,
                    position: draggerPs,
                    onDrag: function (dragger, position) {
                        var entityPositions = that.entity.polygon.hierarchy._value;
                        var extrudedPs = entityPositions[0];
                        for (var i = 1; i < entityPositions.length; i++) {
                            var tempCarto1 = Cesium.Cartographic.fromCartesian(extrudedPs);
                            var tempCarto2 = Cesium.Cartographic.fromCartesian(entityPositions[i]);
                            if (Number(tempCarto2.height) > Number(tempCarto1.height)) {
                                extrudedPs = entityPositions[i];
                            }
                        }
                        var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                        entity.polygon.extrudedHeight = new Cesium.ConstantProperty(Number(cartoLoc.height));
                        var extrHeight = Number(cartoLoc.height) - Number(Cesium.Cartographic.fromCartesian(extrudedPs).height);
                        entity.attribute.style.extrudedHeight = Number(extrHeight).toFixed(2);
                        that.updateDraggers();
                        entity.changeEditing();
                    },
                    vertical: true,
                    horizontal: false
                });
                dragger.index = i;
                this.heightDraggers.push(dragger);
            }
        }
    };

    //更新拖拽点（编辑点）
    ExtrudedPolygonEditor.prototype.updateDraggers = function () {
        var positions = this.entity.polygon.hierarchy._value;
        var extrudedHeight = this.entity.polygon.extrudedHeight._value;
        var height = 0;
        if (this.entity.polygon.height != undefined) {
            height = this.entity.polygon.height._value;
        }
        for (var i = 0; i < this.heightDraggers.length; i++) {
            var position = positions[i];
            var heightDragger = this.heightDraggers[i];
            var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
            extrudedCarto.height = extrudedHeight;
            var loc = Cesium.Cartesian3.fromRadians(extrudedCarto.longitude, extrudedCarto.latitude, extrudedCarto.height);
            heightDragger.position = loc;

            var dragger = this.draggers[i];
            var carto = Cesium.Cartographic.fromCartesian(position);
            carto.height += height;
            loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            dragger.position = loc;
        }
    };

    ExtrudedPolygonEditor.prototype.destroy = function () {
        var i = 0;

        for (i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];

        for (i = 0; i < this.heightDraggers.length; i++) {
            this.dataSource.entities.remove(this.heightDraggers[i]);
        }
        this.heightDraggers = [];
    };


    /* harmony default export */ __webpack_exports__["default"] = (ExtrudedPolygonEditor);


    /***/
}),
/* 31 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-28 08:25:36 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default
    /**
     * Polygon editor.
     */
    var PolygonEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = entity.polygon.hierarchy._value;
        //entity.polygon.hierarchy.isConstant = false;
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                heightReference: !entity.attribute.style.perPositionHeight,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }
    };

    PolygonEditor.prototype.updateDraggers = function () {
        var positions = this.entity.polygon.hierarchy._value;
        for (var i = 0; i < this.draggers.length; i++) {
            var position = positions[i];
            this.draggers[i].position = position;
        }
    };

    PolygonEditor.prototype.destroy = function () {
        // Mark the position properties as being constant since we are done editing.
        // You will see a flash as the geometry rebuilds, but rendering performance of the static geometries will
        // be faster.
        //this.entity.polygon.hierarchy.isConstant = true;

        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    };



    /* harmony default export */ __webpack_exports__["default"] = (PolygonEditor);

    /***/
}),
/* 32 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 10:36:01 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default
    /**
     * An editor that allows you to edit a polyline.
     */
    var PolylineEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = entity.polyline.positions._value;
        //entity.polyline.positions.isConstant = false;
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    positions[dragger.index] = position;
                    entity.polyline.positions = positions;
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            //dragger.positions = positions;
            this.draggers.push(dragger);
        }
    };

    PolylineEditor.prototype.updateDraggers = function () {
        var positions = this.entity.polyline.positions.getValue();
        for (var i = 0; i < this.draggers.length; i++) {
            var position = positions[i];
            this.draggers[i].position = position;
        }
    };

    PolylineEditor.prototype.destroy = function () {
        //this.entity.polyline.positions.isConstant = true;

        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    };


    /* harmony default export */ __webpack_exports__["default"] = (PolylineEditor);

    /***/
}),
/* 33 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-5 17:23:42 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default
    /**
     * Cooridor editor
     */
    var PolylineVolumeEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = entity.polylineVolume.positions.getValue();
        //entity.polylineVolume.positions.isConstant = false;
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    positions[dragger.index] = position;
                    entity.polylineVolume.positions = positions;
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            //dragger.positions = positions;
            this.draggers.push(dragger);
        }
    };

    PolylineVolumeEditor.prototype.updateDraggers = function () {
        var positions = this.entity.polylineVolume.positions.getValue();
        for (var i = 0; i < this.draggers.length; i++) {
            var position = positions[i];
            this.draggers[i].position = position;
        }
    };

    PolylineVolumeEditor.prototype.destroy = function () {
        //this.entity.polylineVolume.positions.isConstant = true;
        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    };




    /* harmony default export */ __webpack_exports__["default"] = (PolylineVolumeEditor);

    /***/
}),
/* 34 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-28 08:25:36 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default
    /**
     * Rectangle editor.
     */
    var RectangleEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = this.getDraggersPositions();
        //entity.rectangle.coordinates.isConstant = false;
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                heightReference: !entity.attribute.style.perPositionHeight,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    var coord;
                    if (dragger.index == 0) {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[1]]);
                    } else {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[0]]);
                    }
                    entity.rectangle.coordinates.setValue(coord);
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }
    };

    RectangleEditor.prototype.updateDraggers = function () {
        var positions = this.getDraggersPositions()
        for (var i = 0; i < this.draggers.length; i++) {
            var position = positions[i];
            this.draggers[i].position = position;
        }
    };

    RectangleEditor.prototype.getDraggersPositions = function () {
        var rectangle = this.entity.rectangle.coordinates._value;

        var nw = Cesium.Rectangle.northwest(rectangle);
        var se = Cesium.Rectangle.southeast(rectangle);

        return Cesium.Cartesian3.fromRadiansArray([nw.longitude, nw.latitude, se.longitude, se.latitude]);
    };

    RectangleEditor.prototype.destroy = function () {
        //this.entity.rectangle.coordinates.isConstant = true;
        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    };



    /* harmony default export */ __webpack_exports__["default"] = (RectangleEditor);

    /***/
}),
/* 35 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 15:26:05 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default
    /**
     * RectangleExtruded editor.
     */
    var RectangleExtrudedEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];
        this.heightDraggers = [];

        var that = this;
        var i = 0;

        var positions = this.getDraggersPositions();// entity.rectangle.coordinates._value;
        //entity.rectangle.coordinates.isConstant = false;
        for (i = 0; i < positions.length; i++) {
            var loc = positions[i];
            if (entity.rectangle.height != undefined) {
                var carto = Cesium.Cartographic.fromCartesian(loc);
                carto.height += entity.rectangle.height._value;
                loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            }

            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    var coord;
                    if (dragger.index == 0) {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[1]]);
                    } else {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[0]]);
                    }
                    entity.rectangle.coordinates.setValue(coord);
                    that.updateDraggers();
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }

        // Add a dragger that will change the extruded height on the rectangle.
        if (entity.rectangle.extrudedHeight) {
            for (i = 0; i < positions.length; i++) {
                var position = positions[i];
                var carto = Cesium.Cartographic.fromCartesian(position);
                carto.height += entity.rectangle.extrudedHeight._value;

                var loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);

                var dragger = _drawutils.createDragger(this.dataSource, {
                    dragIcon: options.dragIcon,
                    position: loc,
                    onDrag: function (dragger, position) {
                        var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                        entity.rectangle.extrudedHeight = new Cesium.ConstantProperty(cartoLoc.height);
                        var extrudedHeight = Number(cartoLoc.height) - Number(entity.rectangle.height);
                        entity.attribute.style.extrudedHeight = Number(extrudedHeight).toFixed(2);
                        that.updateDraggers();
                        entity.changeEditing();
                    },
                    vertical: true,
                    horizontal: false
                });
                dragger.index = i;
                this.heightDraggers.push(dragger);
            }
        }
    };

    //获取矩形的西北、东南两个点的坐标，以创建拖拽点
    RectangleExtrudedEditor.prototype.getDraggersPositions = function () {
        var rectangle = this.entity.rectangle.coordinates._value;

        var nw = Cesium.Rectangle.northwest(rectangle);
        var se = Cesium.Rectangle.southeast(rectangle);

        return Cesium.Cartesian3.fromRadiansArray([nw.longitude, nw.latitude, se.longitude, se.latitude]);
    };

    //更新
    RectangleExtrudedEditor.prototype.updateDraggers = function () {
        var positions = this.getDraggersPositions();
        var extrudedHeight = this.entity.rectangle.extrudedHeight._value;
        var height = 0;
        if (this.entity.rectangle.height != undefined) {
            height = this.entity.rectangle.height._value;
        }
        for (var i = 0; i < this.heightDraggers.length; i++) {
            var position = positions[i];
            var heightDragger = this.heightDraggers[i];
            var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
            extrudedCarto.height += extrudedHeight;
            var loc = Cesium.Cartesian3.fromRadians(extrudedCarto.longitude, extrudedCarto.latitude, extrudedCarto.height);
            heightDragger.position = loc;

            var dragger = this.draggers[i];
            var carto = Cesium.Cartographic.fromCartesian(position);
            carto.height += height;
            loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            dragger.position = loc;
        }
    };

    RectangleExtrudedEditor.prototype.destroy = function () {
        var i = 0;

        for (i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];

        for (i = 0; i < this.heightDraggers.length; i++) {
            this.dataSource.entities.remove(this.heightDraggers[i]);
        }
        this.heightDraggers = [];
    };


    /* harmony default export */ __webpack_exports__["default"] = (RectangleExtrudedEditor);

    /***/
}),
/* 36 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-6 15:26:05 | 修改 木遥（QQ：346819890） */

    var _drawutils = __webpack_require__(0).default

    /**
     * Wall editor.
     */
    var WallEditor = function (dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];
        this.heightDraggers = [];

        var that = this;
        var i = 0;
        var positions = entity.wall.positions._value;
        //entity.wall.positions.isConstant = false;
        for (i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    that.updateDraggers();
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }

        // Add a dragger that will change the extruded height on the wall.
        //创建高程拖拽点
        if (entity.wall.maximumHeights) {
            for (i = 0; i < positions.length; i++) {
                var position = positions[i];
                var carto = Cesium.Cartographic.fromCartesian(position.clone());
                carto.height = entity.wall.maximumHeights._value[i];
                var loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);

                var dragger = _drawutils.createDragger(this.dataSource, {
                    dragIcon: options.dragIcon,
                    position: loc,
                    onDrag: function (dragger, position) {
                        var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                        var minimumHeights = that.entity.wall.minimumHeights._value;
                        var extrudedHeight = Number(cartoLoc.height) - Number(minimumHeights[dragger.index]);
                        entity.attribute.style.extrudedHeight = extrudedHeight.toFixed(2);
                        that.updateDraggers();
                        entity.changeEditing();
                    },
                    vertical: true,
                    horizontal: false
                });
                dragger.index = i;
                this.heightDraggers.push(dragger);
            }
        }
    };

    WallEditor.prototype.updateDraggers = function () {
        var positions = this.entity.wall.positions._value;
        var minimumHeights = this.entity.wall.minimumHeights._value;
        var maximumHeights = this.entity.wall.maximumHeights._value;
        var miniHeights;
        for (var i = 0; i < this.heightDraggers.length; i++) {
            var position = positions[i].clone();
            var heightDragger = this.heightDraggers[i];
            var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
            minimumHeights[i] = extrudedCarto.height;
            maximumHeights[i] = Number(extrudedCarto.height) + Number(this.entity.attribute.style.extrudedHeight);

            heightDragger.position = _drawutils.getPositionsWithHeight(position, this.entity.attribute.style.extrudedHeight);

            this.draggers[i].position = position;
        }
    };

    WallEditor.prototype.destroy = function () {
        var i = 0;

        for (i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];

        for (i = 0; i < this.heightDraggers.length; i++) {
            this.dataSource.entities.remove(this.heightDraggers[i]);
        }
        this.heightDraggers = [];
    };



    /* harmony default export */ __webpack_exports__["default"] = (WallEditor);

    /***/
}),
/* 37 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

    var _latlng = __webpack_require__(3);
    var _drawutils = __webpack_require__(0).default;


    /**
     * 创建一个编辑器，用于管理查看器的整体绘图和编辑功能。
     */
    var EventControl = function (viewer) {
        this.viewer = viewer;
        // 禁用默认的实体双击动作。
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    EventControl.prototype.setCursor = function (style) {
        $("#" + this.viewer._container.id).css('cursor', style || '');
    }
    /**
      * 【绘制】单个坐标点的对象（点、字）绘制处理程序，绑定单击事件 
      */
    EventControl.prototype.createDrawPointHandler = function (entity) {
        this.setCursor('crosshair');

        var that = this;
        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (event) {
            var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                that.setCursor();

                entity.updatePositions(cartesian);
                entity.inProgress = false;
                entity.stopDrawing();
                entity.startEditing();
                handler.destroy();
                that.drawHandler = null;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //记录最近一次值 
        this.drawHandler = handler;
        return handler;
    };

    /**
     * 【绘制】多个坐标点的对象（线）绘制处理程序，绑定单击、鼠标移动、双击事件
     * Creates a handler that lets you modify a list of positions.
     */
    EventControl.prototype.createDrawPolylineHandler = function (entity, positions) {
        this.setCursor('crosshair');
        var that = this;

        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Adds a point to the positions list.
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                }
                if (entity.attribute && entity.attribute.addHeight)////在绘制点基础自动增加高度
                    cartesian = _drawutils.getPositionsWithHeight(cartesian, entity.attribute.addHeight);

                positions.push(cartesian);

                handler.lastPointTemporary = false;
                if (entity.attribute && entity.attribute.minMaxPoints) {
                    if ((positions.length == entity.attribute.minMaxPoints.min &&
                        positions.length == entity.attribute.minMaxPoints.max) ||
                        (entity.attribute.minMaxPoints.isSuper && positions.length == 4)) {
                        entity.inProgress = false;
                        handler.destroy();
                        that.drawHandler = null;
                        entity.stopDrawing();
                        entity.startEditing();
                        that.setCursor();
                    }

                }
                entity.changeDrawing();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                    }
                    positions.push(cartesian);
                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (event) {
            entity.inProgress = false;
            handler.destroy();
            that.drawHandler = null;

            positions.pop();//必要代码 消除双击带来的多余经纬度 

            entity.stopDrawing();
            entity.startEditing();
            that.setCursor();

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //记录最近一次值 
        this.drawHandler = handler;

        return handler;
    };

    /**
     * 【绘制】面绘制处理程序，绑定单击、鼠标移动、双击事件
     * Creates a handler that lets you modify a list of positions.
     */
    EventControl.prototype.createDrawPolygonHandler = function (entity, positions) {
        this.setCursor('crosshair');
        var that = this;

        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Adds a point to the positions list.
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                }
                positions.push(cartesian);

                if (entity.attribute.style.extrudedHeight) {
                    //存在extrudedHeight高度设置时
                    var maxHight = _drawutils.getMaxHeightForPositions(positions);
                    entity.polygon.extrudedHeight = maxHight + Number(entity.attribute.style.extrudedHeight);
                }

                handler.lastPointTemporary = false;
                entity.changeDrawing();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                    }
                    positions.push(cartesian);

                    if (entity.attribute.style.extrudedHeight) {
                        //存在extrudedHeight高度设置时
                        var maxHight = _drawutils.getMaxHeightForPositions(positions);
                        entity.polygon.extrudedHeight = maxHight + Number(entity.attribute.style.extrudedHeight);
                    }

                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (event) {
            entity.inProgress = false;
            handler.destroy();
            that.drawHandler = null;

            positions.pop();//必要代码 消除双击带来的多余经纬度 

            entity.stopDrawing();
            entity.startEditing();
            that.setCursor();

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //记录最近一次值 
        this.drawHandler = handler;

        return handler;
    };

    /**
     * 【绘制】Cesium矩形，绑定单击、鼠标移动、双击事件;
     * Creates a handler that lets you modify a list of positions.
     */
    EventControl.prototype.createTwoPointsModelHandler = function (entity, coordinates) {
        this.setCursor('crosshair');
        var that = this;
        entity.inProgress = true;
        var positions = [];
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                }
                positions.push(cartesian);
                if (positions.length == 1 && entity.attribute.style.extrudedHeight) {
                    var modelHeight = Number(Cesium.Cartographic.fromCartesian(cartesian).height).toFixed(2);
                    entity.rectangle.height = Number(modelHeight);
                    entity.rectangle.extrudedHeight = Number(modelHeight) + Number(entity.attribute.style.extrudedHeight);
                    entity.attribute.style.height = Number(modelHeight);
                }

                if (positions.length == 2) {
                    var coord = Cesium.Rectangle.fromCartesianArray(positions);
                    coordinates.setValue(coord);
                }
                handler.lastPointTemporary = false;
                entity.changeDrawing();

                if (positions.length == 2) {
                    entity.inProgress = false;
                    handler.destroy();
                    that.drawHandler = null;
                    //				positions.pop();//必要代码 消除双击带来的多余经纬度 
                    entity.stopDrawing();
                    entity.startEditing();
                    that.setCursor();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                    }
                    positions.push(cartesian);
                    if (positions.length == 2) {
                        var coord = Cesium.Rectangle.fromCartesianArray(positions);
                        coordinates.setValue(coord);
                    }
                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //记录最近一次值 
        this.drawHandler = handler;
        return handler;
    };

    /**
     * 【绘制】Cesium墙体，绑定单击、鼠标移动、双击事件;
     * 除记录墙体的鼠标拾取的坐标外,还需记录顶部和底部的高程,并赋值给墙体Entity
     * Creates a handler that lets you modify a list of positions.
     */
    EventControl.prototype.createDrawWallHandler = function (entity, positions, minimumHeights, maximumHeights) {
        this.setCursor('crosshair');
        var that = this;

        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Adds a point to the positions list.
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                    minimumHeights.pop();
                    maximumHeights.pop();
                }
                positions.push(cartesian);
                var cartoPs = Cesium.Cartographic.fromCartesian(cartesian);
                var minHeight = Number(cartoPs.height).toFixed(2);
                var maxHeight = Number(minHeight) + Number(entity.attribute.style.extrudedHeight);
                minimumHeights.push(minHeight);
                maximumHeights.push(maxHeight);
                handler.lastPointTemporary = false;

                entity.changeDrawing();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                //var cartesian = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);
                var cartesian = _latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                        minimumHeights.pop();
                        maximumHeights.pop();
                    }
                    positions.push(cartesian);
                    var cartoPs = Cesium.Cartographic.fromCartesian(cartesian);
                    var minHeight = Number(cartoPs.height).toFixed(2);
                    var maxHeight = Number(minHeight) + Number(entity.attribute.style.extrudedHeight);
                    minimumHeights.push(minHeight);
                    maximumHeights.push(maxHeight);

                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (event) {
            entity.inProgress = false;
            handler.destroy();
            that.drawHandler = null;

            positions.pop();//必要代码 消除双击带来的多余经纬度 
            minimumHeights.pop();
            maximumHeights.pop();

            entity.stopDrawing();
            entity.startEditing();
            that.setCursor();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //记录最近一次值 
        this.drawHandler = handler;

        return handler;
    };

    /**
     * 【绘制】 释放未完成的创建绘制
     */
    EventControl.prototype.destroyDrawHandler = function () {
        this.setCursor();
        if (this.drawHandler) {
            this.setCursor();
            this.drawHandler.destroy();
            this.drawHandler = null;
        }
    };

    /**
     * 【编辑】 绑定左键单击事件[选中激活编辑+单击空白处取消编辑]
     */
    EventControl.prototype.createEditSelectHandler = function (calback) {

        var that = this;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        handler.setInputAction(function (e) {
            var picked = that.viewer.scene.pick(e.position);
            var pickedEntity = null;
            if (Cesium.defined(picked)) {
                var id = Cesium.defaultValue(picked.id, picked.primitive.id);
                if (id instanceof Cesium.Entity) {
                    var inProgress = Cesium.defaultValue(id.inProgress, false);
                    if (!inProgress) {
                        pickedEntity = id;
                    }
                }
            }

            calback(pickedEntity);//回调

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.selectHandler = handler;
    };

    /**
     * 【编辑】将协助选择和拖动编辑绑定的拖动到，实体对象 
     * Initialize the utility handler that will assist in selecting and manipulating Dragger billboards.
     */
    EventControl.prototype.createEditDraggerHandler = function () {
        var draggerHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        draggerHandler.dragger = null;

        var that = this;
        // Left down selects a dragger
        draggerHandler.setInputAction(function (click) {
            var pickedObject = that.viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                var entity = pickedObject.id;
                if (entity && Cesium.defaultValue(entity._isDragger, false)) {
                    // Resize the dragger.
                    if (entity.billboard) {
                        entity.billboard.scale_src = entity.billboard.scale._value;
                        entity.billboard.scale._value = entity.billboard.scale_src * 1.2;
                    }

                    draggerHandler.dragger = entity;
                    that.viewer.scene.screenSpaceCameraController.enableRotate = false;
                    that.viewer.scene.screenSpaceCameraController.enableTilt = false;
                    that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // Left down selects a dragger
        draggerHandler.setInputAction(function (click) {
            var pickedObject = that.viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                var entity = pickedObject.id;
                if (entity && Cesium.defaultValue(entity._isDragger, false)) {
                    // Resize the dragger.    
                    if (entity.billboard) {
                        entity.billboard.scale_src = entity.billboard.scale._value;
                        entity.billboard.scale._value = entity.billboard.scale_src * 1.2;
                    }

                    draggerHandler.dragger = entity;
                    that.viewer.scene.screenSpaceCameraController.enableRotate = false;
                    that.viewer.scene.screenSpaceCameraController.enableTilt = false;
                    that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.CTRL);

        // Mouse move drags the draggers and calls their onDrag callback.
        draggerHandler.setInputAction(function (event) {
            if (draggerHandler.dragger) {
                if (draggerHandler.dragger.horizontal) {

                    var hit;
                    if (draggerHandler.dragger.model) {  //点

                        //在模型上提取坐标
                        var scene = that.viewer.scene;
                        var pickobject = scene.pick(event.endPosition);
                        if (Cesium.defined(pickobject) && pickobject.id == draggerHandler.dragger) {
                            var pickRay = scene.camera.getPickRay(event.endPosition); //提取鼠标点的地理坐标
                            hit = scene.globe.pick(pickRay, scene);
                        }
                    }

                    //var hit = this.viewer.camera.pickEllipsoid(event.endPosition);
                    if (hit == null)
                        hit = _latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);

                    if (hit) {
                        draggerHandler.dragger.position = hit;
                        if (draggerHandler.dragger.onDrag) {
                            draggerHandler.dragger.onDrag(draggerHandler.dragger, hit);
                        }
                    }
                }

                if (draggerHandler.dragger.vertical) {
                    var dy = event.endPosition.y - event.startPosition.y;
                    var position = draggerHandler.dragger.position._value;
                    var tangentPlane = new Cesium.EllipsoidTangentPlane(position);

                    scratchBoundingSphere.center = position;
                    scratchBoundingSphere.radius = 1;

                    var metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(scratchBoundingSphere,
                                that.viewer.scene.frameState.context.drawingBufferWidth,
                                that.viewer.scene.frameState.context.drawingBufferHeight);

                    var zOffset = new Cesium.Cartesian3();

                    Cesium.Cartesian3.multiplyByScalar(tangentPlane.zAxis, -dy * metersPerPixel, zOffset);
                    var newPosition = Cesium.Cartesian3.clone(position);
                    Cesium.Cartesian3.add(position, zOffset, newPosition);

                    draggerHandler.dragger.position = newPosition;
                    if (draggerHandler.dragger.onDrag) {
                        draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        var scratchBoundingSphere = new Cesium.BoundingSphere();

        // Mouse move drags the draggers and calls their onDrag callback.
        draggerHandler.setInputAction(function (event) {
            if (draggerHandler.dragger && draggerHandler.dragger.verticalCtrl) {
                var dy = event.endPosition.y - event.startPosition.y;
                var position = draggerHandler.dragger.position._value;
                var tangentPlane = new Cesium.EllipsoidTangentPlane(position);

                scratchBoundingSphere.center = position;
                scratchBoundingSphere.radius = 1;

                var metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(scratchBoundingSphere,
                                                                                 that.viewer.scene.frameState.context.drawingBufferWidth,
                                                                                that.viewer.scene.frameState.context.drawingBufferHeight);

                var zOffset = new Cesium.Cartesian3();

                Cesium.Cartesian3.multiplyByScalar(tangentPlane.zAxis, -dy * metersPerPixel, zOffset);
                var newPosition = Cesium.Cartesian3.clone(position);
                Cesium.Cartesian3.add(position, zOffset, newPosition);

                draggerHandler.dragger.position = newPosition;
                if (draggerHandler.dragger.onDrag) {
                    draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.CTRL);

        // Left up stops dragging.
        draggerHandler.setInputAction(function () {
            if (draggerHandler.dragger) {
                if (draggerHandler.dragger.billboard) {
                    draggerHandler.dragger.billboard.scale._value = draggerHandler.dragger.billboard.scale_src;
                }

                draggerHandler.dragger = null;
                that.viewer.scene.screenSpaceCameraController.enableRotate = true;
                that.viewer.scene.screenSpaceCameraController.enableTilt = true;
                that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        // Left up stops dragging.
        draggerHandler.setInputAction(function () {
            if (draggerHandler.dragger) {
                if (draggerHandler.dragger.billboard) {
                    draggerHandler.dragger.billboard.scale._value = draggerHandler.dragger.billboard.scale_src;
                }

                draggerHandler.dragger = null;
                that.viewer.scene.screenSpaceCameraController.enableRotate = true;
                that.viewer.scene.screenSpaceCameraController.enableTilt = true;
                that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.CTRL);

        this.draggerHandler = draggerHandler;
    };

    /**
     * 【编辑】 释放编辑相关事件
     */
    EventControl.prototype.destroyEditHandler = function () {

        if (this.selectHandler) {
            this.selectHandler.destroy();
            this.selectHandler = null;
        }

        if (this.draggerHandler) {
            this.draggerHandler.destroy();
            this.draggerHandler = null;
        }
    };


    /* harmony default export */ __webpack_exports__["default"] = (EventControl);

    /***/
}),
/* 38 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-28 08:16:56 | 修改 木遥（QQ：346819890） */
    var _GeoJsonLayer = __webpack_require__(10).default;

    var ArcFeatureLayer = _GeoJsonLayer.extend({

        queryData: function () {
            var that = this;

            var url = this.config.url;

            if (this.config.layers && this.config.layers.length > 0)
                url += "/" + this.config.layers[0];

            var query = L.esri.query({
                url: url
            });
            if (this.config.where)
                query.where(this.config.where);

            query.run(function (error, featureCollection, response) {
                if (error != null && error.code > 0) {
                    haoutil.alert(error.message, '服务访问出错');
                    return;
                }

                if (featureCollection == undefined || featureCollection == null || featureCollection.features.length == 0) {
                    haoutil.msg("未找到符合查询条件的要素！")
                    return;
                } else {
                    //剔除有问题数据 
                    var featuresOK = [];
                    for (var i = 0; i < featureCollection.features.length; i++) {
                        var feature = featureCollection.features[i];
                        if (feature == null || feature.geometry == null) continue;
                        if (feature.geometry.coordinates && feature.geometry.coordinates.length == 0)
                            continue;
                        featuresOK.push(feature);
                    }
                    featureCollection.features = featuresOK;

                    var dataSource = Cesium.GeoJsonDataSource.load(featureCollection, {
                        clampToGround: true
                    });
                    dataSource.then(function (dataSource) {
                        that.showResult(dataSource);
                    }).otherwise(function (error) {
                        that.showError("服务出错", error);
                    });
                }
            });
        },




    });

    /* harmony default export */ __webpack_exports__["default"] = (ArcFeatureLayer);

    /***/
}),
/* 39 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-29 09:26:29 | 修改 木遥（QQ：346819890） */
    var _GeoJsonLayer = __webpack_require__(10).default;


    var CzmlLayer = _GeoJsonLayer.extend({
        queryData: function () {
            var that = this;

            var dataSource = Cesium.CzmlDataSource.load(this.config.url);
            dataSource.then(function (dataSource) {
                that.showResult(dataSource);

            }).otherwise(function (error) {
                that.showError("服务出错", error);
            });
        },
        getEntityAttr: function (entity) {

            return entity._description._value;
        },

    });


    /* harmony default export */ __webpack_exports__["default"] = (CzmlLayer);

    /***/
}),
/* 40 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-28 08:17:15 | 修改 木遥（QQ：346819890） */
    var _BaseLayer = __webpack_require__(2).default;

    var GltfLayer = _BaseLayer.extend({
        model: null,
        //添加 
        add: function () {
            if (this.model) {
                this.viewer.entities.add(this.model);
            }
            else {
                this.initData();
            }
        },
        //移除
        remove: function () {
            this.viewer.entities.remove(this.model);
        },
        //定位至数据区域
        centerAt: function (duration) {
            if (this.model == null) return;

            if (this.config.extent || this.config.center) {
                this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
            }
            else {
                var cfg = this.config.position;
                this.viewer.mars.centerAt(cfg, { duration: duration, isWgs84: true });
            }
        },

        initData: function () {
            var cfg = this.config.position;
            cfg = this.viewer.mars.point2map(cfg);//转换坐标系

            var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
            var heading = Cesium.Math.toRadians(cfg.heading || 0)
            var pitch = Cesium.Math.toRadians(cfg.pitch || 0)
            var roll = Cesium.Math.toRadians(cfg.roll || 0);
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

            var modelopts = { uri: this.config.url };
            for (var key in this.config) {
                if (key == "url" || key == "name" || key == "position" || key == "center" || key == "tooltip" || key == "popup") continue;
                modelopts[key] = this.config[key];
            }


            this.model = this.viewer.entities.add({
                name: this.config.name,
                position: position,
                orientation: orientation,
                model: modelopts,
                tooltip: this.config.tooltip,
                popup: this.config.popup,
            });
        }


    });
    /* harmony default export */ __webpack_exports__["default"] = (GltfLayer);

    /***/
}),
/* 41 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-29 09:26:29 | 修改 木遥（QQ：346819890） */
    var _GeoJsonLayer = __webpack_require__(10).default;


    var KmlLayer = _GeoJsonLayer.extend({
        queryData: function () {
            var that = this;

            var dataSource = Cesium.KmlDataSource.load(this.config.url, {
                camera: this.viewer.scene.camera,
                canvas: this.viewer.scene.canvas
            });
            dataSource.then(function (dataSource) {
                that.showResult(dataSource);

            }).otherwise(function (error) {
                that.showError("服务出错", error);
            });
        },
        getEntityAttr: function (entity) {
            var attr = { name: entity._name };
            var extendedData = entity._kml.extendedData;
            for (var key in extendedData) {
                attr[key] = extendedData[key].value;
            }

            return attr;
        },

    });


    /* harmony default export */ __webpack_exports__["default"] = (KmlLayer);

    /***/
}),
/* 42 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-5 09:16:51 | 修改 木遥（QQ：346819890） */
    var _BaseLayer = __webpack_require__(2).default;
    var _util = __webpack_require__(7)
    var _latlng = __webpack_require__(3);

    var Tiles3dLayer = _BaseLayer.extend({
        model: null,
        originalCenter: null,
        boundingSphere: null,
        //添加 
        add: function () {
            if (this.model) {
                this.viewer.scene.primitives.add(this.model);
            }
            else {
                this.initData();
            }
        },
        //移除
        remove: function () {
            this.viewer.scene.primitives.remove(this.model);
            this.model = null;
        },
        //定位至数据区域
        centerAt: function (duration) {
            if (this.config.extent || this.config.center) {
                this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
            }
            else if (this.boundingSphere) {
                this.viewer.camera.flyToBoundingSphere(this.boundingSphere, {
                    offset: new Cesium.HeadingPitchRange(0.0, -0.5, this.boundingSphere.radius * 2),
                    duration: duration
                });
            }
        },

        initData: function () {
            //默认值
            this.config.maximumScreenSpaceError = this.config.maximumScreenSpaceError || 1;

            this.model = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset(this.config));
            this.model._config = this.config;
            this.model.tooltip = this.config.tooltip;
            this.model.popup = this.config.popup;

            var that = this;
            this.model.readyPromise.then(function (tileset) {
                //记录模型原始的中心点
                var boundingSphere = tileset.boundingSphere;
                that.boundingSphere = boundingSphere;

                var position = boundingSphere.center; //模型原始的中心点
                var catographic = Cesium.Cartographic.fromCartesian(position);

                var height = Number(catographic.height.toFixed(2));
                var longitude = Number(Cesium.Math.toDegrees(catographic.longitude).toFixed(6));
                var latitude = Number(Cesium.Math.toDegrees(catographic.latitude).toFixed(6));
                that.originalCenter = { x: longitude, y: latitude, z: height };
                console.log((that.config.name || "") + " 模型原始位置:" + JSON.stringify(that.originalCenter));

                //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
                var rawCenter = that.viewer.mars.point2map(that.originalCenter);
                if (rawCenter.x != that.originalCenter.x || rawCenter.y != that.originalCenter.y
                    || that.config.offset != null) {

                    that.config.offset = that.config.offset || {};//配置信息中指定的坐标信息或高度信息
                    if (that.config.offset.x && that.config.offset.y) {
                        that.config.offset = that.viewer.mars.point2map(that.config.offset); //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
                    }
                    var offsetopt = {
                        x: that.config.offset.x || rawCenter.x,
                        y: that.config.offset.y || rawCenter.y,
                        z: that.config.offset.z || 0
                    };

                    if (that.config.offset.z == "-height") {
                        offsetopt.z = -height + 5;
                        that.updateMatrix(offsetopt);
                    }
                    else if (that.config.offset.z == "auto") {
                        that.autoHeight(position, offsetopt);
                    }
                    else {
                        that.updateMatrix(offsetopt);
                    }
                }

                if (!that.viewer.mars.isFlyAnimation() && that.config.flyTo) {
                    that.centerAt(0);
                }
            });
        },

        //offsetopt.x，y不能多次更改
        updateMatrix: function (offsetopt) {
            if (this.model == null) return;

            console.log(" 模型修改后位置:" + JSON.stringify(offsetopt));

            var boundingSphere = this.model.boundingSphere;
            var catographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
            var surface = Cesium.Cartesian3.fromRadians(catographic.longitude, catographic.latitude, 0.0);
            var offset = Cesium.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);

            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            this.model.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            //this.model.update();
        },
        autoHeight: function (position, offsetopt) {
            var that = this;
            //求地面海拔
            _util.terrainPolyline({
                viewer: this.viewer,
                positions: [position, position],
                calback: function (raisedPositions, noHeight) {
                    if (raisedPositions == null || raisedPositions.length == 0 || noHeight) return;

                    var point = _latlng.formatPositon(raisedPositions[0]);
                    var offsetZ = point.z - that.originalCenter.z + 1;
                    offsetopt.z = offsetZ;

                    that.updateMatrix(offsetopt);
                }
            });

        }




    });


    /* harmony default export */ __webpack_exports__["default"] = (Tiles3dLayer);

    /***/
}),
/* 43 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-28 08:03:29 | 修改 木遥（QQ：346819890） */

    var _BaseLayer = __webpack_require__(2).default;

    var GroupLayer = _BaseLayer.extend({
        create: function () {
            var arr = this.config._layers;
            for (var i = 0; i < arr.length; i++) {
                this.hasOpacity = arr[i].hasOpacity;
                this.hasZIndex = arr[i].hasZIndex;
            }
        },
        setVisible: function (val) {
            var arr = this.config._layers;
            for (var i = 0; i < arr.length; i++) {
                arr[i].setVisible(val);
            }
        },
        //添加 
        add: function () {
            var arr = this.config._layers;
            for (var i = 0; i < arr.length; i++) {
                arr[i].setVisible(true);
            }
        },
        //移除
        remove: function () {
            var arr = this.config._layers;
            for (var i = 0; i < arr.length; i++) {
                arr[i].setVisible(false);
            }
        },
        //定位至数据区域
        centerAt: function (duration) {
            var arr = this.config._layers;
            for (var i = 0; i < arr.length; i++) {
                arr[i].centerAt(duration);
            }
        },
        //设置透明度
        setOpacity: function (value) {
            var arr = this.config._layers;
            for (var i = 0; i < arr.length; i++) {
                arr[i].setOpacity(value);
            }
        },

        //设置叠加顺序
        //setZIndex: function (value) {
        //    var arr = this.config._layers;
        //    for (var i = 0; i < arr.length; i++) {
        //        arr[i].setZIndex(value);
        //    }
        //},


    });

    /* harmony default export */ __webpack_exports__["default"] = (GroupLayer);

    /***/
}),
/* 44 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    var _CustomFeatureGridLayer = __webpack_require__(13).default;

    var ArcFeatureGridLayer = _CustomFeatureGridLayer.extend({
        //获取网格内的数据，calback为回调方法，参数传数据数组 
        getDataForGrid: function (opts, calback) {
            var that = this;

            var url = this.config.url;
            if (this.config.layers && this.config.layers.length > 0)
                url += "/" + this.config.layers[0];

            var query = L.esri.query({ url: url });

            //网格
            var bounds = L.latLngBounds(
                L.latLng(opts.rectangle.ymin, opts.rectangle.xmin),
                L.latLng(opts.rectangle.ymax, opts.rectangle.xmax));
            query.within(bounds);

            if (this.config.where)
                query.where(this.config.where);

            query.run(function (error, featureCollection, response) {
                if (!that._visible || !that._cacheGrid[opts.key]) {
                    return; //异步请求结束时,如果已经卸载了网格就直接跳出。
                }

                if (error != null && error.code > 0) {
                    console.log('arcgis服务访问出错' + error.message);
                    return;
                }

                if (featureCollection == undefined || featureCollection == null) {
                    return;//数据为空
                }

                if (featureCollection.type == "Feature")
                    featureCollection = { "type": "FeatureCollection", "features": [featureCollection] }

                calback(featureCollection.features);
            });
        },
        //根据数据创造entity
        createEntity: function (opts, item, calback) {
            var that = this;
            var dataSource = Cesium.GeoJsonDataSource.load(item, {
                clampToGround: true
            });
            dataSource.then(function (dataSource) {
                if (that.checkHasBreak[opts.key]) {
                    return; //异步请求结束时，如果已经卸载了网格就直接跳出。
                }

                if (dataSource.entities.values.length == 0) return null;
                var entity = dataSource.entities.values[0];
                entity._id = that.config.id + "_" + opts.key + "_" + entity.id;

                that._addEntity(entity, calback);

            }).otherwise(function (error) {
                that.showError("服务出错", error);
            });


            return null;
        },
        //更新entity，并添加到地图上
        _addEntity: function (entity, calback) {
            var that = this;

            //样式
            var symbol = this.config.symbol;
            if (symbol) {
                if (typeof symbol === 'function') {
                    symbol(entity, entity.properties);//回调方法
                }
                else if (symbol == "default") {
                    this.setDefSymbol(entity);
                }
                else {
                    this.setConfigSymbol(entity, symbol);
                }
            }

            //popup弹窗
            if (this.config.columns || this.config.popup) {
                entity.popup = {
                    html: function (entity) {
                        return that.viewer.mars.popup.getPopupForConfig(that.config, entity.properties);
                    },
                    anchor: this.config.popupAnchor || [0, -15],
                };
            }
            if (this.config.tooltip) {
                entity.tooltip = {
                    html: function (entity) {
                        return that.viewer.mars.popup.getPopupForConfig({ popup: that.config.tooltip }, entity.properties);
                    },
                    anchor: this.config.tooltipAnchor || [0, -15],
                };
            }
            this.dataSource.entities.add(entity);

            calback(entity);
        }



    });

    /* harmony default export */ __webpack_exports__["default"] = (ArcFeatureGridLayer);

    /***/
}),
/* 45 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2018-6-6 08:16:56 | 修改 木遥（QQ：346819890） */
    var _TileLayer = __webpack_require__(22).default;

    var FeatureGridLayer = _TileLayer.extend({
        dataSource: null,
        hasOpacity: false,
        create: function () {
            this.dataSource = new Cesium.CustomDataSource();

            var that = this;
            this.config.type_new = "custom_featuregrid";
            this.config.addImageryCache = function (opts) {
                return that._addImageryCache(opts);
            };
            this.config.removeImageryCache = function (opts) {
                return that._removeImageryCache(opts);
            };
        },
        addEx: function () {
            this.viewer.dataSources.add(this.dataSource);
        },
        removeEx: function () {
            this.viewer.dataSources.remove(this.dataSource);
        },
        _addImageryCache: function (opts) {

        },
        _removeImageryCache: function (opts) {

        }



    });

    /* harmony default export */ __webpack_exports__["default"] = (FeatureGridLayer);

    /***/
}),
/* 46 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    var pointconvert = __webpack_require__(11)
    var _CustomFeatureGridLayer = __webpack_require__(13).default;

    var _PointControl = __webpack_require__(12).default
    var _BillboardControl = __webpack_require__(4).default
    var _LabelControl = __webpack_require__(5).default

    var POILayer = _CustomFeatureGridLayer.extend({
        //查询POI服务
        _keys: null,
        _key_index: 0,
        getKey: function () {
            if (!this._keys) {
                this._keys = this.config.key || [
                    "c95467d0ed2a3755836e37dc27369f97",
                    "4320dda936d909d73ab438b4e29cf2a2",
                    "e64a96ed7e361cbdc0ebaeaf3818c564",
                    "df3247b7df64434adecb876da94755d7",
                    "d4375ec477cb0a473c448fb1f83be781",
                    "13fdd7b2b90a9d326ae96867ebcc34ce",
                    "c34502450ae556f42b21760faf6695a0",
                    "57f8ebe12797a73fc5b87f5d4ef859b1"
                ];
            }

            var thisidx = (this._key_index++) % (this._keys.length);
            return this._keys[thisidx];
        },


        //获取网格内的数据，calback为回调方法，参数传数据数组 
        getDataForGrid: function (opts, calback) {
            var jwd1 = pointconvert.wgs2gcj([opts.rectangle.xmin, opts.rectangle.ymax]); //加偏
            var jwd2 = pointconvert.wgs2gcj([opts.rectangle.xmax, opts.rectangle.ymin]); //加偏
            var polygon = jwd1[0] + "," + jwd1[1] + "|" + jwd2[0] + "," + jwd2[1];

            var filter = this.config.filter || {};
            filter.output = "json";
            filter.key = this.getKey();
            filter.polygon = polygon;
            if (!filter.offset)
                filter.offset = 25;
            if (!filter.types)
                filter.types = "120000|130000|190000";


            var that = this;
            $.ajax({
                url: 'http://restapi.amap.com/v3/place/polygon',
                type: "get",
                dataType: "json",
                timeout: "5000",
                data: filter,
                success: function (data) {
                    if (data.infocode !== "10000") {
                        console.log("POI 请求失败(" + data.infocode + ")：" + data.info);
                        return;
                    }
                    var arrdata = data.pois;
                    calback(arrdata);
                },
                error: function (data) {
                    console.log("POI 请求出错(" + data.status + ")：" + data.statusText);
                }
            });
        },
        //根据数据创造entity
        createEntity: function (opts, attributes) {
            var inthtml = "<div>名称：" + attributes.name + "</div>"
                 + "<div>地址：" + attributes.address + "</div>"
                 + "<div>区域：" + attributes.pname + attributes.cityname + attributes.adname + "</div>"
                 + "<div>类别：" + attributes.type + "</div>";

            var arrjwd = attributes.location.split(",");
            arrjwd = pointconvert.gcj2wgs(arrjwd); //纠偏
            var lnglat = this.viewer.mars.point2map({ x: arrjwd[0], y: arrjwd[1] });

            var entityOptions = {
                name: attributes.name,
                position: Cesium.Cartesian3.fromDegrees(lnglat.x, lnglat.y, this.config.height || 3),
                popup: {
                    html: inthtml,
                    anchor: [0, -15],
                },
                properties: attributes
            };

            var symbol = this.config.symbol;
            if (symbol) {
                var styleOpt = symbol.styleOptions;
                if (symbol.styleField) {//存在多个symbol，按styleField进行分类
                    var styleFieldVal = attr[symbol.styleField];
                    var styleOptField = symbol.styleFieldOptions[styleFieldVal];
                    if (styleOptField != null) {
                        styleOpt = $.extend({}, styleOpt);
                        styleOpt = $.extend(styleOpt, styleOptField);
                    }
                }
                styleOpt = styleOpt || {};

                if (styleOpt.image) {
                    entityOptions.billboard = _BillboardControl.attribute2Entity({ style: styleOpt });
                    entityOptions.billboard.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                }
                else {
                    entityOptions.point = _PointControl.attribute2Entity({ style: styleOpt });
                }

                //加上文字标签 
                if (styleOpt.label) {
                    entityOptions.label = _LabelControl.attribute2Entity({ style: styleOpt.label });
                    entityOptions.label.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                    entityOptions.label.text = attributes.name;
                }

            }
            else { //无配置时的默认值
                entityOptions.point = {
                    color: new Cesium.Color.fromCssColorString("#3388ff"),
                    pixelSize: 10,
                    outlineColor: new Cesium.Color.fromCssColorString("#ffffff"),
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    scaleByDistance: new Cesium.NearFarScalar(1000, 1, 20000, 0.5)
                };
                entityOptions.label = {
                    text: attributes.name,
                    font: '16px Helvetica',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.AZURE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量   
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, //是地形上方的高度 
                    scaleByDistance: new Cesium.NearFarScalar(1000, 1, 5000, 0.8),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000)
                };
            }

            var entity = this.dataSource.entities.add(entityOptions);
            return entity;
        },




    });

    /* harmony default export */ __webpack_exports__["default"] = (POILayer);

    /***/
}),
/* 47 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

    function ArcTileImageryProvider(options) {
        if (!Cesium.defined(options)) {
            throw new DeveloperError('options is required.');
        }
        if (!Cesium.defined(options.url)) {
            throw new DeveloperError('options.url is required.');
        }

        this._url = options.url + "/_alllayers/";
        this._isUpper = Cesium.defaultValue(options.isUpper, true);
        this._imgType = Cesium.defaultValue(options.imgType, ".jpg");


        this._subdomains = options.subdomains;
        if (Cesium.isArray(this._subdomains)) {
            this._subdomains = this._subdomains.slice();
        } else if (Cesium.defined(this._subdomains) && this._subdomains.length > 0) {
            this._subdomains = this._subdomains.split('');
        } else {
            this._subdomains = ['a', 'b', 'c'];
        }

        this._tileWidth = Cesium.defaultValue(options.tileWidth, 256);
        this._tileHeight = Cesium.defaultValue(options.tileHeight, 256);
        this._minimumLevel = Cesium.defaultValue(options.minimumLevel, 0);
        this._maximumLevel = options.maximumLevel;


        if (options.rectangle && options.rectangle.xmin && options.rectangle.xmax && options.rectangle.ymin && options.rectangle.ymax) {
            var xmin = options.rectangle.xmin;
            var xmax = options.rectangle.xmax;
            var ymin = options.rectangle.ymin;
            var ymax = options.rectangle.ymax;
            options.rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
        }


        this._tilingScheme = Cesium.defaultValue(options.tilingScheme, new Cesium.WebMercatorTilingScheme({ ellipsoid: options.ellipsoid }));
        this._rectangle = Cesium.defaultValue(options.rectangle, this._tilingScheme.rectangle);
        this._rectangle = Cesium.Rectangle.intersection(this._rectangle, this._tilingScheme.rectangle);
        this._hasAlphaChannel = Cesium.defaultValue(options.hasAlphaChannel, true);


        this._credit = undefined;
        this._ready = true;
    }


    Cesium.defineProperties(ArcTileImageryProvider.prototype, {
        url: {
            get: function () {
                return this._url;
            }
        },

        token: {
            get: function () {
                return this._token;
            }
        },

        proxy: {
            get: function () {
                return this._proxy;
            }
        },


        tileWidth: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileWidth;
            }
        },

        tileHeight: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileHeight;
            }
        },

        maximumLevel: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._maximumLevel;
            }
        },

        minimumLevel: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return 0;
            }
        },

        tilingScheme: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tilingScheme;
            }
        },

        rectangle: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._rectangle;
            }
        },

        tileDiscardPolicy: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileDiscardPolicy;
            }
        },

        errorEvent: {
            get: function () {
                return this._errorEvent;
            }
        },

        ready: {
            get: function () {
                return this._ready;
            }
        },

        readyPromise: {
            get: function () {
                return this._readyPromise.promise;
            }
        },

        credit: {
            get: function () {
                return this._credit;
            }
        },

        usingPrecachedTiles: {
            get: function () {
                return this._useTiles;
            }
        },

        hasAlphaChannel: {
            get: function () {
                return true;
            }
        },

        layers: {
            get: function () {
                return this._layers;
            }
        }
    });

    ArcTileImageryProvider.prototype.getTileCredits = function (x, y, level) {
        return undefined;
    };


    /** 
    * 高位补全方法 
    * @param {Object} 数字类型字符串 
    * @param {Object} 总位数，不足则高位补0 
    */
    ArcTileImageryProvider.prototype.padLeft0 = function (numStr, n) {
        numStr = String(numStr);
        var len = numStr.length;
        while (len < n) {
            numStr = "0" + numStr;
            len++;
        }
        return numStr;
    }

    //新建瓦片（首次，无缓存时）
    ArcTileImageryProvider.prototype.requestImage = function (x, y, level) {
        if (!this._ready) {
            throw new DeveloperError('requestImage must not be called before the imagery provider is ready.');
        }

        var strz = "L" + this.padLeft0(level.toString(), 2);
        var strx = "R" + this.padLeft0(y.toString(16), 8);
        var stry = "C" + this.padLeft0(x.toString(16), 8);

        if (this._isUpper) {
            strz = strz.toUpperCase();
            strx = strx.toUpperCase();
            stry = stry.toUpperCase();
        }

        var url = this._url + strz + "/" + strx + "/" + stry + this._imgType;
        //console.log(url); 

        return Cesium.ImageryProvider.loadImage(this, url);
    };

    /* harmony default export */ __webpack_exports__["default"] = (ArcTileImageryProvider);


    /***/
}),
/* 48 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

    function FeatureGridImageryProvider(options) {
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this.options = options;


        this._tileWidth = Cesium.defaultValue(options.tileWidth, 256);
        this._tileHeight = Cesium.defaultValue(options.tileHeight, 256);
        this._minimumLevel = Cesium.defaultValue(options.minimumLevel, 0);
        this._maximumLevel = options.maximumLevel;


        if (options.rectangle && options.rectangle.xmin && options.rectangle.xmax && options.rectangle.ymin && options.rectangle.ymax) {
            var xmin = options.rectangle.xmin;
            var xmax = options.rectangle.xmax;
            var ymin = options.rectangle.ymin;
            var ymax = options.rectangle.ymax;
            options.rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
        }
        this._tilingScheme = Cesium.defaultValue(options.tilingScheme, new Cesium.GeographicTilingScheme({ ellipsoid: options.ellipsoid }));
        this._rectangle = Cesium.defaultValue(options.rectangle, this._tilingScheme.rectangle);
        this._rectangle = Cesium.Rectangle.intersection(this._rectangle, this._tilingScheme.rectangle);
        this._hasAlphaChannel = Cesium.defaultValue(options.hasAlphaChannel, true);

        this._errorEvent = new Cesium.Event();
        this._readyPromise = Cesium.when.resolve(true);
        this._credit = undefined;
        this._ready = true;
    }


    Cesium.defineProperties(FeatureGridImageryProvider.prototype, {
        url: {
            get: function () {
                return this._url;
            }
        },

        token: {
            get: function () {
                return this._token;
            }
        },

        proxy: {
            get: function () {
                return this._proxy;
            }
        },


        tileWidth: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileWidth;
            }
        },

        tileHeight: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileHeight;
            }
        },

        maximumLevel: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._maximumLevel;
            }
        },

        minimumLevel: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug'); 
                return 0;
            }
        },

        tilingScheme: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tilingScheme;
            }
        },

        rectangle: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._rectangle;
            }
        },

        tileDiscardPolicy: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileDiscardPolicy;
            }
        },

        errorEvent: {
            get: function () {
                return this._errorEvent;
            }
        },

        ready: {
            get: function () {
                return this._ready;
            }
        },

        readyPromise: {
            get: function () {
                return this._readyPromise.promise;
            }
        },

        credit: {
            get: function () {
                return this._credit;
            }
        },

        usingPrecachedTiles: {
            get: function () {
                return this._useTiles;
            }
        },

        hasAlphaChannel: {
            get: function () {
                return true;
            }
        },

        layers: {
            get: function () {
                return this._layers;
            }
        }
    });

    FeatureGridImageryProvider.prototype.getTileCredits = function (x, y, level) {
        return undefined;
    };


    //显示瓦片信息
    FeatureGridImageryProvider.prototype.requestImage = function (x, y, level) {
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;

        if (level < this._minimumLevel) return canvas;

        if (this.options.debuggerTileInfo) {
            var context = canvas.getContext('2d');

            context.strokeStyle = '#ffff00';
            context.lineWidth = 2;
            context.strokeRect(1, 1, 255, 255);

            var label = 'L' + level + 'X' + x + 'Y' + y;
            context.font = 'bold 25px Arial';
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText(label, 127, 127);
            context.fillStyle = '#ffff00';
            context.fillText(label, 124, 124);
        }
        return canvas;
    };

    FeatureGridImageryProvider.prototype._getGridKey = function (opts) {
        return opts.level + "_x" + opts.x + "_y" + opts.y;
    };

    FeatureGridImageryProvider.prototype.addImageryCache = function (opts) {
        if (opts.level < this._minimumLevel || opts.level < opts.maxLevel - 1) return;

        //console.log('新增' + JSON.stringify(opts));
        if (this.options.addImageryCache) {
            opts.key = this._getGridKey(opts);
            this.options.addImageryCache(opts);
        }
    };

    FeatureGridImageryProvider.prototype.removeImageryCache = function (opts) {
        if (opts.level < this._minimumLevel) return;

        //console.log('删除' + JSON.stringify(opts));
        if (this.options.removeImageryCache) {
            opts.key = this._getGridKey(opts);
            this.options.removeImageryCache(opts);
        }
    };


    /* harmony default export */ __webpack_exports__["default"] = (FeatureGridImageryProvider);

    /***/
}),
/* 49 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-11-28 08:15:34 | 修改 木遥（QQ：346819890） */
    var _BaseLayer = __webpack_require__(2).default;

    var GraticuleLayer = _BaseLayer.extend({
        model: null,
        //添加 
        add: function () {
            if (this.model == null) {
                this.initData();
            }
            this.model.setVisible(true);
        },
        //移除
        remove: function () {
            if (this.model == null) return;

            this.model.setVisible(false);
        },

        initData: function () {
            function GraticuleLayer(description, scene) {

                description = description || {};

                this._tilingScheme = description.tilingScheme || new Cesium.GeographicTilingScheme();

                this._color = description.color || new Cesium.Color(1.0, 1.0, 1.0, 0.4);

                this._tileWidth = description.tileWidth || 256;
                this._tileHeight = description.tileHeight || 256;

                this._ready = true;

                // default to decimal intervals
                this._sexagesimal = description.sexagesimal || false;
                this._numLines = description.numLines || 50;

                this._scene = scene;
                this._labels = new Cesium.LabelCollection();
                scene.primitives.add(this._labels);
                this._polylines = new Cesium.PolylineCollection();
                scene.primitives.add(this._polylines);
                this._ellipsoid = scene.globe.ellipsoid;

                var canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 256;
                this._canvas = canvas;

                var that = this;
                scene.camera.moveEnd.addEventListener(function () {
                    if (!that._show) return;

                    that._polylines.removeAll();
                    that._labels.removeAll();
                    that._currentExtent = null;
                    that._drawGrid(that._getExtentView());
                });
                scene.imageryLayers.addImageryProvider(this);
            };

            var definePropertyWorks = (function () {
                try {
                    return 'x' in Object.defineProperty({}, 'x', {});
                } catch (e) {
                    return false;
                }
            })();

            /**
             * Defines properties on an object, using Object.defineProperties if available,
             * otherwise returns the object unchanged.  This function should be used in
             * setup code to prevent errors from completely halting JavaScript execution
             * in legacy browsers.
             *
             * @private
             *
             * @exports defineProperties
             */
            var defineProperties = Object.defineProperties;
            if (!definePropertyWorks || !defineProperties) {
                defineProperties = function (o) {
                    return o;
                };
            }

            defineProperties(GraticuleLayer.prototype, {
                url: {
                    get: function () {
                        return undefined;
                    }
                },

                proxy: {
                    get: function () {
                        return undefined;
                    }
                },

                tileWidth: {
                    get: function () {
                        return this._tileWidth;
                    }
                },

                tileHeight: {
                    get: function () {
                        return this._tileHeight;
                    }
                },

                maximumLevel: {
                    get: function () {
                        return 18;
                    }
                },

                minimumLevel: {
                    get: function () {
                        return 0;
                    }
                },
                tilingScheme: {
                    get: function () {
                        return this._tilingScheme;
                    }
                },
                rectangle: {
                    get: function () {
                        return this._tilingScheme.rectangle;
                    }
                },
                tileDiscardPolicy: {
                    get: function () {
                        return undefined;
                    }
                },
                errorEvent: {
                    get: function () {
                        return this._errorEvent;
                    }
                },
                ready: {
                    get: function () {
                        return this._ready;
                    }
                },
                credit: {
                    get: function () {
                        return this._credit;
                    }
                },
                hasAlphaChannel: {
                    get: function () {
                        return true;
                    }
                }
            });

            GraticuleLayer.prototype.makeLabel = function (lng, lat, text, top, color) {
                this._labels.add({
                    position: this._ellipsoid.cartographicToCartesian(new Cesium.Cartographic(lng, lat, 10.0)),
                    text: text,
                    //font: 'normal',
                    //style: Cesium.LabelStyle.FILL,
                    //fillColor: 'white',
                    //outlineColor: 'white',
                    font: '16px Helvetica',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.AZURE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,

                    pixelOffset: new Cesium.Cartesian2(5, top ? 5 : -5),
                    eyeOffset: Cesium.Cartesian3.ZERO,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: top ? Cesium.VerticalOrigin.BOTTOM : Cesium.VerticalOrigin.TOP,
                    scale: 1.0
                });
            };

            GraticuleLayer.prototype._drawGrid = function (extent) {

                if (this._currentExtent && this._currentExtent.equals(extent)) {
                    return;
                }
                this._currentExtent = extent;

                this._polylines.removeAll();
                this._labels.removeAll();

                var minPixel = 0;
                var maxPixel = this._canvasSize;

                var dLat = 0, dLng = 0, index;
                // get the nearest to the calculated value
                for (index = 0; index < mins.length && dLat < ((extent.north - extent.south) / 10) ; index++) {
                    dLat = mins[index];
                }
                for (index = 0; index < mins.length && dLng < ((extent.east - extent.west) / 10) ; index++) {
                    dLng = mins[index];
                }

                // round iteration limits to the computed grid interval
                var minLng = (extent.west < 0 ? Math.ceil(extent.west / dLng) : Math.floor(extent.west / dLng)) * dLng;
                var minLat = (extent.south < 0 ? Math.ceil(extent.south / dLat) : Math.floor(extent.south / dLat)) * dLat;
                var maxLng = (extent.east < 0 ? Math.ceil(extent.east / dLat) : Math.floor(extent.east / dLat)) * dLat;
                var maxLat = (extent.north < 0 ? Math.ceil(extent.north / dLng) : Math.floor(extent.north / dLng)) * dLng;

                // extend to make sure we cover for non refresh of tiles
                minLng = Math.max(minLng - 2 * dLng, -Math.PI);
                maxLng = Math.min(maxLng + 2 * dLng, Math.PI);
                minLat = Math.max(minLat - 2 * dLat, -Math.PI / 2);
                maxLat = Math.min(maxLat + 2 * dLng, Math.PI / 2);

                var ellipsoid = this._ellipsoid;
                var lat, lng, granularity = Cesium.Math.toRadians(1);

                // labels positions
                var latitudeText = minLat + Math.floor((maxLat - minLat) / dLat / 2) * dLat;
                for (lng = minLng; lng < maxLng; lng += dLng) {
                    // draw meridian
                    var path = [];
                    for (lat = minLat; lat < maxLat; lat += granularity) {
                        path.push(new Cesium.Cartographic(lng, lat))
                    }
                    path.push(new Cesium.Cartographic(lng, maxLat));
                    this._polylines.add({
                        positions: ellipsoid.cartographicArrayToCartesianArray(path),
                        width: 1
                    });
                    var degLng = Cesium.Math.toDegrees(lng);
                    this.makeLabel(lng, latitudeText, this._sexagesimal ? this._decToSex(degLng) : degLng.toFixed(gridPrecision(dLng)), false);
                }

                // lats
                var longitudeText = minLng + Math.floor((maxLng - minLng) / dLng / 2) * dLng;
                for (lat = minLat; lat < maxLat; lat += dLat) {
                    // draw parallels
                    var path = [];
                    for (lng = minLng; lng < maxLng; lng += granularity) {
                        path.push(new Cesium.Cartographic(lng, lat))
                    }
                    path.push(new Cesium.Cartographic(maxLng, lat));
                    this._polylines.add({
                        positions: ellipsoid.cartographicArrayToCartesianArray(path),
                        width: 1
                    });
                    var degLat = Cesium.Math.toDegrees(lat);
                    this.makeLabel(longitudeText, lat, this._sexagesimal ? this._decToSex(degLat) : degLat.toFixed(gridPrecision(dLat)), true);
                }
            };

            GraticuleLayer.prototype.requestImage = function (x, y, level) {

                if (this._show) {
                    this._drawGrid(this._getExtentView());
                }

                return this._canvas;
            };

            GraticuleLayer.prototype.setVisible = function (visible) {
                this._show = visible;
                if (!visible) {
                    this._polylines.removeAll();
                    this._labels.removeAll();
                } else {
                    this._currentExtent = null;
                    this._drawGrid(this._getExtentView());
                }
            }

            GraticuleLayer.prototype.isVisible = function () {
                return this._show;
            }

            GraticuleLayer.prototype._decToSex = function (d) {
                var degs = Math.floor(d);
                var mins = ((Math.abs(d) - degs) * 60.0).toFixed(2);
                if (mins == "60.00") { degs += 1.0; mins = "0.00"; }
                return [degs, ":", mins].join('');
            };

            GraticuleLayer.prototype._getExtentView = function () {
                var camera = this._scene.camera;
                var canvas = this._scene.canvas;
                var corners = [
                    camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), this._ellipsoid),
                    camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, 0), this._ellipsoid),
                    camera.pickEllipsoid(new Cesium.Cartesian2(0, canvas.height), this._ellipsoid),
                    camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), this._ellipsoid)
                ];
                for (var index = 0; index < 4; index++) {
                    if (corners[index] === undefined) {
                        return Cesium.Rectangle.MAX_VALUE;
                    }
                }
                return Cesium.Rectangle.fromCartographicArray(this._ellipsoid.cartesianArrayToCartographicArray(corners));
            }

            function gridPrecision(dDeg) {
                if (dDeg < 0.01) return 2;
                if (dDeg < 0.1) return 1;
                if (dDeg < 1) return 0;
                return 0;
            }

            var mins = [
                Cesium.Math.toRadians(0.05),
                Cesium.Math.toRadians(0.1),
                Cesium.Math.toRadians(0.2),
                Cesium.Math.toRadians(0.5),
                Cesium.Math.toRadians(1.0),
                Cesium.Math.toRadians(2.0),
                Cesium.Math.toRadians(5.0),
                Cesium.Math.toRadians(10.0)
            ];

            function loggingMessage(message) {
                var logging = document.getElementById('logging');
                logging.innerHTML += message;
            }

            this.model = new GraticuleLayer({ numLines: 10 }, this.viewer.scene);
        }


    });

    /* harmony default export */ __webpack_exports__["default"] = (GraticuleLayer);

    /***/
}),
/* 50 */
/***/ (function (module, exports, __webpack_require__) {

    /* 2017-11-29 16:28:15 | 修改 木遥（QQ：346819890） */
    var _layer = __webpack_require__(21)
    var _util = __webpack_require__(7)
    var pointconvert = __webpack_require__(11)

    var _latlng = __webpack_require__(3);
    var _popup = __webpack_require__(54)
    var _tooltip = __webpack_require__(55)
    var _firstPerson = __webpack_require__(53)

    function createMap(opt) {
        if (opt.url) {
            $.ajax({
                type: "get",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: opt.url,
                timeout: 0, //永不超时
                success: function (config) {
                    //map初始化
                    var configdata = config.map3d;
                    if (config.serverURL)
                        configdata.serverURL = config.serverURL;
                    if (opt.serverURL)
                        configdata.serverURL = opt.serverURL;

                    createMapByData(opt, configdata, config);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Json文件" + opt.url + "加载失败！");
                    haoutil.alert("Json文件" + opt.url + "加载失败！");
                }
            });
            return null;
        }
        else {
            if (opt.serverURL && opt.data)
                opt.data.serverURL = opt.serverURL;
            return createMapByData(opt, opt.data);
        }
    }


    function createMapByData(opt, configdata, jsondata) {
        if (configdata == null) {
            console.log("配置信息不能为空！")
            return;
        }

        if (!configdata.hasOwnProperty('copyright') || configdata.copyright) {
            try {
                eval(function (p, a, c, k, e, r) { e = function (c) { return c.toString(a) }; if (!''.replace(/^/, String)) { while (c--) r[e(c)] = k[c] || e(c); k = [function (e) { return r[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('1(g(){2.3("\\4\\5\\6\\7\\8\\9\\a\\b d e\\f\\0\\h\\i %c \\j\\k\\l\\m\\n://o.p.q","r:s")},t);', 30, 30, 'u67b6|setTimeout|console|log|u5f53|u524d|u4e09|u7ef4|u5730|u56fe|u4f7f|u7528MarsGIS||for|Cesium|u6846|function|u5b9e|u73b0|u5b98|u65b9|u7f51|u7ad9|uff1ahttp|cesium|marsgis|cn|color|red|6E4'.split('|'), 0, {}))
            } catch (e) { }
        }


        var viewer = _map(opt.id, configdata, opt);
        //记录到全局变量，其他地方使用
        var gisdata = {};
        gisdata.config = configdata;

        viewer.gisdata = gisdata;

        if (opt.success)
            opt.success(viewer, gisdata, jsondata);

        return viewer;
    }



    function _map(id, config, options) {

        //============模块内部私有属性及方法============ 


        //类内部使用
        var viewer;
        var viewerDivId;
        var configdata;
        var crs;//坐标系


        viewerDivId = id;
        configdata = config;

        //如果options未设置时的默认参数
        var defoptions = {
            animation : false,//是否创建动画小器件，左下角仪表    
            baseLayerPicker : true,//是否显示图层选择器    
            fullscreenButton : false,//是否显示全屏按钮    
            geocoder : false,//是否显示geocoder小器件，右上角查询按钮    
            homeButton : false,//是否显示Home按钮    
            infoBox : false,//是否显示信息框    
            sceneModePicker : false,//是否显示3D/2D选择器    
            selectionIndicator : false,//是否显示选取指示器组件    
            timeline : false,//是否显示时间轴    
            navigationHelpButton : false,//是否显示右上角的帮助按钮    
            scene3DOnly : true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源 );  
            // animation: false,       //是否创建动画小器件，左下角仪表   
            // timeline: false,        //是否显示时间线控件   
            // fullscreenButton: false, //右下角全屏按钮
            // vrButton: false,         //右下角vr虚拟现实按钮

            // geocoder: false,         //是否显示地名查找控件   
            // sceneModePicker: false,  //是否显示投影方式控件  
            // homeButton: false,        //回到默认视域按钮
            // navigationHelpButton: false,    //是否显示帮助信息控件  
            // navigationInstructionsInitiallyVisible: false, //在用户明确单击按钮之前是否自动显示

            // infoBox: false,             //是否显示点击要素之后显示的信息 
            // selectionIndicator: false,  //选择模型是是否显示绿色框, 
            // shouldAnimate: true,

            // baseLayerPicker: true, //地图底图
        };

        //config中可以配置map所有options
        for (var key in configdata) {
            if (key === "crs" || key === "controls" || key === "minzoom" || key === "maxzoom" || key === "center"
                || key === "style" || key === "terrain" || key === "basemaps" || key === "operationallayers")
                continue;
            defoptions[key] = configdata[key];
        }


        // //赋默认值（如果已存在设置值跳过）
        if (options == null) options = {};
        for (var i in defoptions) {
            if (!options.hasOwnProperty(i)) {
                options[i] = defoptions[i];
            }
        }

        // //默认 key 【by 木遥】
        // Cesium.BingMapsApi.defaultKey = 'AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc';
        // if (Cesium.Ion)
        //     Cesium.Ion.defaultAccessToken = configdata.ionToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjM5MjMxOS1lMWVkLTQyNDQtYTM4Yi0wZjA4ZDMxYTlmNDMiLCJpZCI6MTQ4MiwiaWF0IjoxNTI4Njc3NDQyfQ.vVoSexHMqQhKK5loNCv6gCA5d5_z3wE2M0l_rWnIP_w';

        // //坐标系
        // configdata.crs = configdata.crs || '3857';
        // crs = configdata.crs;

        // //自定义搜索栏Geocoder
        // if (options.geocoder === true) {
        //     var _GaodePOIGeocoder = __webpack_require__(52).default
        //     options.geocoder = new _GaodePOIGeocoder(options.geocoderConfig);
        // }

        // //地形
        // if (configdata.terrain && configdata.terrain.visible) {
        //     options.terrainProvider = getTerrainProvider();
        // }

        // //地图底图图层预处理   
        // var hasremoveimagery = false;
        // if (options.imageryProvider == null) {
        //     // hasremoveimagery = true;          liangfan ignored
        //     // options.imageryProvider = Cesium.createTileMapServiceImageryProvider({
        //     //     url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        //     // });
        // }


        //地球初始化
        viewer = new Cesium.Viewer(id, options);// mars-old
        viewer=window.deViewer;// liangfan edit 传入 主程序 定义的 Cesium.Viewer 
        //viewer.cesiumWidget.creditContainer.style.display = "none";     //去cesium logo
       
        //====绑定方法到viewer上====
        viewer.mars = {
            popup: _popup,
            tooltip: _tooltip,
            keyboard: function (isbind) {
                if (isbind)
                    _firstPerson.bind(viewer);
                else
                    _firstPerson.unbind(viewer);
            },
            getLayer: getLayer,
            centerAt: centerAt,
            isFlyAnimation: isFlyAnimation,
            openFlyAnimation: openFlyAnimation,
            rotateAnimation: rotateAnimation,
            hasTerrain: hasTerrain,
            updateTerrainProvider: updateTerrainProvider,
            getCrs: getCrs,
            point2map: point2map,
            point2wgs: point2wgs,
            getConfig: getConfig
        }

        // if (options.geocoder) {
        //     options.geocoder.viewer = viewer;
        // }

        //地图底图图层   liangfan  ignored
        if (hasremoveimagery) {
            var imageryLayerCollection = viewer.imageryLayers;
            var length = imageryLayerCollection.length;
            for (var i = 0; i < length; i++) {
                var layer = imageryLayerCollection.get(0);
                imageryLayerCollection.remove(layer, true);
            }
        }

        var layersCfg = configdata.basemaps;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item.visible && item.crs)
                    crs = item.crs;

                _layer.createLayer(item, viewer, config.serverURL, options.layerToMap);
            }
        }

        return viewer;
        // //默认定位地点相关设置，默认home键和初始化镜头视角  
        if (viewer.homeButton) {
            viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (commandInfo) {
                centerAt();
                commandInfo.cancel = true;
            });
        }
        // // centerAt(null, { duration: 0 }); //liangfan ignored 防止初始化时 定位
        // //  console.log("ddddddd");
        // //切换场景
        // var lastCameraView;
        // viewer.scene.morphStart.addEventListener(function (event) {//切换场景前事件
        //     lastCameraView = _latlng.getCameraView(viewer);
        // });

        // viewer.scene.morphComplete.addEventListener(function (event) {//切换场景后事件
        //     setTimeout(function () {
        //         centerAt(lastCameraView);
        //     }, 100);
        // });


        //可叠加图层  
        var layersCfg = configdata.operationallayers;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                _layer.createLayer(item, viewer, config.serverURL, options.layerToMap);
            }
        }
        return viewer;
        var hasMouseZomm = false;
        //地图控件  
        var controlsCfg = configdata.controls;
        if (controlsCfg) {
            for (var i = 0; i < controlsCfg.length; i++) {
                var item = controlsCfg[i];
                if (item.hasOwnProperty("visible") && !item.visible) continue;

                switch (item.type) {
                    case "navigation"://导航工具栏
                        addNavigationWidget(item);
                        break;
                    case "location": //鼠标提示
                        addLocationWidget(item);
                        break;
                    case "msgbar": //提示信息 
                        addMsgBarWidget(item);
                        break;
                    case "mousezoom"://鼠标滚轮特效 
                        hasMouseZomm = true;
                        break;
                }

            }
        }

        //绑定popup
        _popup.init(viewer);

        //绑定tooltip
        _tooltip.init(viewer);


        //地球一些属性设置
        var scene = viewer.scene;
        scene.globe.baseColor = Cesium.Color.SILVER; //背景改为灰色 
        if (configdata.style) {
            scene.globe.depthTestAgainstTerrain = configdata.style.testTerrain;   //深度监测
            scene.globe.enableLighting = configdata.style.lighting;      //光照渲染（阳光照射区域高亮）
            if (scene.skyAtmosphere)
                scene.skyAtmosphere.show = configdata.style.atmosphere;      //大气渲染
            if (scene.fog)
                scene.fog.enabled = configdata.style.fog;                    //雾化效果
        }

        //限制缩放级别
        scene.screenSpaceCameraController.maximumZoomDistance = configdata.maxzoom || 20000000;  //变焦时相机位置的最大值（以米为单位） 
        scene.screenSpaceCameraController.minimumZoomDistance = configdata.minzoom || 1;         //变焦时相机位置的最小量级（以米为单位）。默认为1.0。

        //scene.screenSpaceCameraController.enableCollisionDetection = true;    //启用地形相机碰撞检测。
        //scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 1;  //在测试与地形碰撞之前摄像机必须达到的最小高度。


        //鼠标滚轮缩放美化样式
        if (hasMouseZomm && _util.isPCBroswer()) {
            $("#" + viewerDivId).append('<div class="cesium-mousezoom"><div class="zoomimg"/></div>');
            var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (evnet) {
                $('.cesium-mousezoom').addClass('cesium-mousezoom-visible');
                setTimeout(function () {
                    $('.cesium-mousezoom').removeClass('cesium-mousezoom-visible');
                }, 200);

            }, Cesium.ScreenSpaceEventType.WHEEL);
            handler.setInputAction(function (evnet) {
                $('.cesium-mousezoom').css({
                    top: evnet.endPosition.y + 'px',
                    left: evnet.endPosition.x + 'px'
                });
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }


        //获取指定图层 keyname默认为名称
        function getLayer(key, keyname) {
            if (keyname == null) keyname = "name";

            var layersCfg = configdata.basemaps;
            if (layersCfg && layersCfg.length > 0) {
                for (var i = 0; i < layersCfg.length; i++) {
                    var item = layersCfg[i];
                    if (item == null || item[keyname] != key) continue;
                    return item._layer;
                }
            }

            layersCfg = configdata.operationallayers;
            if (layersCfg && layersCfg.length > 0) {
                for (var i = 0; i < layersCfg.length; i++) {
                    var item = layersCfg[i];
                    if (item == null || item[keyname] != key) continue;
                    return item._layer;
                }
            }
            return null;
        }

        function getConfig() {
            return _util.clone(configdata);
        }


        var stkTerrainProvider;
        function getTerrainProvider() {
            if (stkTerrainProvider == null) {
                var cfg = configdata.terrain || {};
                if (!cfg.hasOwnProperty("requestWaterMask")) cfg.requestWaterMask = true;
                if (!cfg.hasOwnProperty("requestVertexNormals")) cfg.requestVertexNormals = true;

                if (cfg.url) {
                    if (configdata.serverURL) {
                        cfg.url = cfg.url.replace('$serverURL$', configdata.serverURL);
                    }
                    cfg.url = cfg.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
                    stkTerrainProvider = new Cesium.CesiumTerrainProvider(cfg);
                }
                else {
                    cfg.url = Cesium.IonResource.fromAssetId(1);
                    stkTerrainProvider = new Cesium.CesiumTerrainProvider(cfg);
                }
            }

            return stkTerrainProvider;
        }
        function hasTerrain() {
            if (stkTerrainProvider == null)
                return false;
            return viewer.terrainProvider == stkTerrainProvider;
        }
        function updateTerrainProvider(isStkTerrain) {
            if (isStkTerrain) {
                viewer.terrainProvider = getTerrainProvider();
            }
            else {
                viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({
                    ellipsoid: Cesium.Ellipsoid.WGS84
                });
            }
        }



        function centerAt(centeropt, options) {
            if (options == null)
                options = {};
            else if (_util.isNumber(options))
                options = { duration: options };//兼容旧版本
 

            if (centeropt == null) {//让镜头飞行（动画）到配置默认区域 
                options.isWgs84 = true;
                centeropt = configdata.extent || configdata.center;
            }

            if (centeropt.xmin && centeropt.xmax && centeropt.ymin && centeropt.ymax) {
                //使用extent配置
                var xmin = centeropt.xmin;
                var xmax = centeropt.xmax;
                var ymin = centeropt.ymin;
                var ymax = centeropt.ymax;

                if (options.isWgs84) {//坐标转换为wgs
                    var pt1 = point2map({ x: xmin, y: ymin });
                    xmin = pt1.x;
                    ymin = pt1.y;

                    var pt2 = point2map({ x: xmax, y: ymax });
                    xmax = pt2.x;
                    ymax = pt2.y;
                }

                var rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
                viewer.camera.flyTo({
                    destination: rectangle,
                    duration: options.duration,
                    complete: options.complete
                });
            }
            else {
                //使用xyz 
                if (options.isWgs84)
                    centeropt = point2map(centeropt);

                var height = options.minz || 2500;
                if (viewer.camera.positionCartographic.height < height)
                    height = viewer.camera.positionCartographic.height;
                if (centeropt.z != null && centeropt.z != 0)
                    height = centeropt.z;

                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(centeropt.x, centeropt.y, height), //经度、纬度、高度 
                    orientation: {
                        heading: Cesium.Math.toRadians(centeropt.heading || 0),    //绕垂直于地心的轴旋转
                        pitch: Cesium.Math.toRadians(centeropt.pitch || -90),      //绕纬度线旋转
                        roll: Cesium.Math.toRadians(centeropt.roll || 0)           //绕经度线旋转
                    },
                    duration: options.duration,
                    complete: options.complete
                });
            }
        }



        //开场动画 
        var _isFlyAnimation = false;
        function isFlyAnimation() {
            return _isFlyAnimation;
        }
        function openFlyAnimation(endfun, centeropt) {
            var view = centeropt || _latlng.getCameraView(viewer); //默认为原始视角

            _isFlyAnimation = true;
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(-85.16, 13.71, 23000000.0)
            });
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(view.x, view.y, 23000000.0),
                duration: 2,
                easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                complete: function () {
                    var z = (view.z || 90000) * 1.2 + 8000;
                    if (z > 23000000) z = 23000000;

                    viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(view.x, view.y, z),
                        complete: function () {
                            centerAt(view, {
                                duration: 2,
                                complete: function () {
                                    _isFlyAnimation = false;
                                    if (endfun) endfun();
                                }
                            });
                        }
                    });
                }
            });
        }
        //旋转地球 
        function rotateAnimation(endfun, duration) {
            var first = _latlng.getCameraView(viewer); //默认为原始视角
            var duration3 = duration / 3;

            //动画 1/3
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(first.x + 120, first.y, first.z),
                orientation: {
                    heading: Cesium.Math.toRadians(first.heading),
                    pitch: Cesium.Math.toRadians(first.pitch),
                    roll: Cesium.Math.toRadians(first.roll)
                },
                duration: duration3,
                easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                complete: function () {

                    //动画 2/3
                    viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(first.x + 240, first.y, first.z),
                        orientation: {
                            heading: Cesium.Math.toRadians(first.heading),
                            pitch: Cesium.Math.toRadians(first.pitch),
                            roll: Cesium.Math.toRadians(first.roll)
                        },
                        duration: duration3,
                        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                        complete: function () {

                            //动画 3/3
                            viewer.camera.flyTo({
                                destination: Cesium.Cartesian3.fromDegrees(first.x, first.y, first.z),
                                orientation: {
                                    heading: Cesium.Math.toRadians(first.heading),
                                    pitch: Cesium.Math.toRadians(first.pitch),
                                    roll: Cesium.Math.toRadians(first.roll)
                                },
                                duration: duration3,
                                easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                                complete: function () {
                                    if (endfun)
                                        endfun();
                                }
                            });
                            //动画3/3 end 
                        }
                    });
                    //动画2/3 end
                }
            });
            //动画1/3 end
        }

        //添加“鼠标经纬度提示”控件
        function addLocationWidget(item) {
            var inhtml = '<div id="location_mars_jwd"  class="location-bar animation-slide-bottom no-print" >\
                        <div id="location_mars_camera" ></div>\
                        <div id="location_mars_height" ></div>\
                        <div id="location_mars_lat" ></div>\
                        <div id="location_mars_lon" ></div>\
                        <div id="mars_msgbar" style="min-width: 0px;" ></div>\
                      </div>';
            $("#" + viewerDivId).prepend(inhtml);

            if (item.style)
                $("#location_mars_jwd").css(item.style);
            else {
                $("#location_mars_jwd").css({
                    "left": (viewer.animation ? "170px" : "0"),
                    "right": "0",
                    "bottom": (viewer.timeline ? "25px" : "0"),
                });
            }

            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                var cartesian = _latlng.getCurrentMousePosition(viewer.scene, movement.endPosition);
                if (cartesian) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

                    var jd = Cesium.Math.toDegrees(cartographic.longitude);
                    var wd = Cesium.Math.toDegrees(cartographic.latitude);
                    var height = cartographic.height;

                    if (item.coordinate && item.coordinate == "wgs") {
                        var wgsPoint = point2wgs({ x: jd, y: wd }); //坐标转换为wgs
                        jd = wgsPoint.x;
                        wd = wgsPoint.y;
                    }

                    $("#location_mars_lon").html("经度：" + jd.toFixed(6));
                    $("#location_mars_lat").html("纬度：" + wd.toFixed(6));
                    if (height > 0)
                        $("#location_mars_height").html("海拔：" + height.toFixed(1) + "米");
                } else {
                    $("#location_mars_lon").html("");
                    $("#location_mars_lat").html("");
                    $("#location_mars_height").html("");
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            //相机移动结束事件
            viewer.scene.camera.changed.addEventListener(function (event) {
                var positionCartographic = viewer.camera.positionCartographic;
                var inhtml = "视点高：" + positionCartographic.height.toFixed(1) + "米";

                $("#location_mars_camera").html(inhtml);
            });
        }


        //添加“信息提示栏”控件
        function addMsgBarWidget(item) {
            if (item.data == null || item.data.length == 0) return;

            if (!document.getElementById('mars_msgbar')) {
                $("#" + viewerDivId).prepend('<div id="mars_msgbar" class="location-bar animation-slide-bottom no-print" ></div>');
                if (item.style) $("#mars_msgbar").css(item.style);
            }

            function refMsgBar() {
                var point = _latlng.getCenter(viewer);
                if (point) {
                    var isFind = false;
                    for (var i in item.data) {
                        var extent = item.data[i];
                        if (point.x >= extent.xmin && point.x <= extent.xmax && point.y >= extent.ymin && point.y <= extent.ymax) {
                            $("#mars_msgbar").html(extent.msg);
                            isFind = true;
                            break;
                        }
                    }
                }
                if (!isFind)
                    $("#mars_msgbar").html("");
            }


            //相机移动结束事件
            viewer.scene.camera.moveEnd.addEventListener(refMsgBar);
        }


        //添加“导航”控件
        function addNavigationWidget(item) {
            if (!Cesium.viewerCesiumNavigationMixin) return;

            viewer.extend(Cesium.viewerCesiumNavigationMixin, {
                defaultResetView: Cesium.Rectangle.fromDegrees(110, 20, 120, 30),
                enableZoomControls: true
            });

            if (viewer.animation) {
                $(".distance-legend").css({
                    "left": "150px",
                    "bottom": "25px",
                    "border": "none",
                    "background": "rgba(0, 0, 0, 0)",
                    "z-index": "992",
                });
            }
            else {
                $(".distance-legend").css({
                    "left": "-10px",
                    "bottom": "-1px",
                    "border": "none",
                    "background": "rgba(0, 0, 0, 0)",
                    "z-index": "992",
                });
            }

            //$(".navigation-controls").css({
            //    "right": "5px",
            //    "bottom": "30px",
            //    "top": "auto"
            //});
            $(".navigation-controls").hide();

            if (item.style)
                $(".compass").css(item.style);
            else
                $(".compass").css({ "top": "10px", "left": "10px" });
        }



        function getCrs() {
            return crs;
        }

        function point2map(point) {
            if (crs == "gcj") {
                var point_clone = _util.clone(point);

                var newpoint = pointconvert.wgs2gcj([point_clone.x, point_clone.y]);
                point_clone.x = newpoint[0];
                point_clone.y = newpoint[1];
                return point_clone;
            }
            else {
                return point;
            }
        }
        function point2wgs(point) {
            if (crs == "gcj") {
                var point_clone = _util.clone(point);
                var newpoint = pointconvert.gcj2wgs([point_clone.x, point_clone.y]);
                point_clone.x = newpoint[0];
                point_clone.y = newpoint[1];
                return point_clone;
            }
            else {
                return point;
            }
        }


        return viewer;
    };



    //===========模块对外公开的属性及方法=========
    //静态方法和类
    // exports.name = "Cesium三维地球框架";
    // exports.version = "1.4";
    // exports.author = "木遥（QQ 516584683，微信 marsgis）";
    // exports.website = "http://cesium.marsgis.cn";

    exports.createMap = createMap;
    exports.layer = _layer;
    exports.pointconvert = pointconvert;
    exports.latlng = _latlng;
    exports.util = _util;

    //draw静态类 
    exports.draw = {};
    exports.draw.utils = __webpack_require__(0).default;
    exports.draw.DynamicProperty = __webpack_require__(1).default;
    exports.draw.BillboardControl = __webpack_require__(4).default;
    exports.draw.LabelControl = __webpack_require__(5).default;
    exports.draw.EllipseControl = __webpack_require__(15).default;
    exports.draw.PolylineControl = __webpack_require__(8).default;
    exports.draw.PolylineVolumeControl = __webpack_require__(18).default;
    exports.draw.PolygonControl = __webpack_require__(6).default;
    exports.draw.EllipsoidControl = __webpack_require__(16).default;
    exports.draw.PointControl = __webpack_require__(12).default;
    exports.draw.RectangleControl = __webpack_require__(19).default;
    exports.draw.ModelControl = __webpack_require__(17).default;
    exports.draw.WallControl = __webpack_require__(20).default;

    //需要new的类 
    exports.Draw = __webpack_require__(14).default;
    exports.Measure = __webpack_require__(51).default;



    /***/
}),
/* 51 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    //提供测量长度、面积等[绘制基于draw]
    var _Draw = __webpack_require__(14).default;
    var _drawutils = __webpack_require__(0).default
    var _util = __webpack_require__(7)
    var _latlng = __webpack_require__(3);

    var Measure = (function (opts) {

        var viewer = opts.viewer;
        var _font = opts.font || "16px SimHei"; //显示测量结果文本的字体


        var thisType = "";//当前正在绘制的类别 
        var drawControl = new _Draw({
            viewer: viewer,
            hasEdit: false,
            onChangeDrawing: function (entity) {
                switch (thisType) {
                    case "length":
                    case "section":
                        workLength.showAddPointLength(entity);
                        break;
                    case "area":
                        workArea.showAddPointLength(entity);
                        break;
                    case "height":
                        workHeight.showAddPointLength(entity);
                        break;
                    case "super_height":
                        workSuperHeight.showAddPointLength(entity);
                        break;
                }
            },
            onMoveDrawing: function (entity) {
                switch (thisType) {
                    case "length":
                    case "section":
                        workLength.showMoveDrawing(entity);
                        break;
                    case "area":
                        workArea.showMoveDrawing(entity);
                        break;
                    case "height":
                        workHeight.showMoveDrawing(entity);
                        break;
                    case "super_height":
                        workSuperHeight.showMoveDrawing(entity);
                        break;
                }
            },
            onStopDrawing: function (entity) {
                switch (thisType) {
                    case "length":
                    case "section":
                        workLength.showDrawEnd(entity);
                        break;
                    case "area":
                        workArea.showDrawEnd(entity);
                        break;
                    case "height":
                        workHeight.showDrawEnd(entity);
                        break;
                    case "super_height":
                        workSuperHeight.showDrawEnd(entity);
                        break;
                }
            }
        });

        var dataSource = drawControl.getDataSource();

        /*长度测量*/
        function measuerLength(options) {
            endLastDraw();

            thisType = "length";
            options = options || {};
            options.type = thisType;
            if (!options.hasOwnProperty("terrain")) options.terrain = true;

            workLength.start(options);
        }


        /*剖面分析*/
        function measureSection(options) {
            endLastDraw();

            thisType = "section";
            options = options || {};
            options.type = thisType;
            options.terrain = true;

            workLength.start(options);
        }


        /*面积测量*/
        function measureArea(options) {
            endLastDraw();

            thisType = "area";
            options = options || {};
            options.type = thisType;

            workArea.start(options);
        };

        /*高度测量*/
        function measureHeight(options) {
            endLastDraw();

            options = options || {};

            if (options.hasOwnProperty("isSuper") && !options.isSuper) {
                thisType = "height";
                options.type = thisType;
                workHeight.start(options);
            }
            else {
                thisType = "super_height";
                options.type = thisType;
                workSuperHeight.start(options);
            }
        };


        //如果上次未完成绘制就单击了新的，清除之前未完成的。
        function endLastDraw() {
            workLength.clearLastNoEnd();
            workArea.clearLastNoEnd();
            workHeight.clearLastNoEnd();
            workSuperHeight.clearLastNoEnd();

            drawControl.stopDraw();
        }


        /*清除测量*/
        function clearMeasure() {
            thisType = "";
            endLastDraw();

            //dataSource.entities.removeAll();
            drawControl.deleteAll();
        };


        /** 更新量测结果的单位  */
        function updateUnit(thisType, unit) {
            var arr = dataSource.entities.values;
            for (var i in arr) {
                var entity = arr[i];
                if (entity.label && entity.isMarsMeasureLabel && entity.attribute && entity.attribute.value) {
                    if (entity.attribute.type != thisType) continue;
                    if (thisType == "area") {
                        entity.label.text._value = (entity.attribute.textEx || "") + formatArea(entity.attribute.value, unit);
                    }
                    else {
                        entity._label.text._value = (entity.attribute.textEx || "") + formatLength(entity.attribute.value, unit);
                    }
                }
            }
        }



        var workLength = {
            options: null,
            arrLables: [],      //各线段label
            totalLable: null,   //总长label 
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                if (this.arrLables && this.arrLables.length > 0) {
                    var arrLables = this.arrLables;
                    if (arrLables && arrLables.length > 0) {
                        for (var i in arrLables) {
                            dataSource.entities.remove(arrLables[i]);
                        }
                    }
                }
                this.totalLable = null;
                this.arrLables = [];
            },
            //开始绘制
            start: function (options) {
                this.options = options;

                //总长label 
                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量    
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: _font,
                        show: false
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
                this.arrLables = [];


                drawControl.startDraw({
                    type: "polyline",
                    addHeight: options.addHeight,
                    style: {
                        color: "#ffff00",
                        clampToGround: (this.options.type == "section" || this.options.terrain),//是否贴地
                        width: 3
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {
                var positions = drawControl.getPositions(entity);

                var tempSingleLabel = dataSource.entities.add({
                    position: positions[positions.length - 1],
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                        font: _font,
                        show: true
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });

                if (positions.length == 1) {
                    tempSingleLabel.label.text = "起点";
                    //tempSingleLabel.attribute.value = 0;
                }
                else {
                    var distance = this.getLength(positions);
                    var distancestr = formatLength(distance, this.options.unit);

                    tempSingleLabel.label.text = distancestr;
                    tempSingleLabel.attribute.value = distance;

                    //屏蔽比较小的数值
                    if (this.getLength([positions[positions.length - 2], positions[positions.length - 1]]) < 5)
                        tempSingleLabel.show = false;
                }
                this.arrLables.push(tempSingleLabel);
            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var positions = drawControl.getPositions(entity);
                if (positions.length < 2) return;

                var distance = this.getLength(positions);
                var distancestr = formatLength(distance, this.options.unit);

                this.totalLable.position = positions[positions.length - 1];
                this.totalLable.label.text = "全长:" + distancestr;
                this.totalLable.label.show = true;

                this.totalLable.attribute.value = distance;
                this.totalLable.attribute.textEx = "全长:";

                if (this.options.calback)
                    this.options.calback(distancestr, distance);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                var positions = drawControl.getPositions(entity);
                var count = this.arrLables.length - positions.length;
                if (count >= 0) {
                    for (var i = this.arrLables.length - 1; i >= positions.length - 1; i--) {
                        dataSource.entities.remove(this.arrLables[i]);
                    }
                    this.arrLables.splice(positions.length - 1, count + 1);
                }
                entity._totalLable = this.totalLable;
                entity._arrLables = this.arrLables;

                this.totalLable = null;
                this.arrLables = [];

                if (entity.polyline == null) return;

                if (this.options.type == "section")
                    this.updateSectionForTerrain(entity);
                else if (this.options.terrain)
                    this.updateLengthForTerrain(entity);

            },
            //计算贴地线
            updateLengthForTerrain: function (entity) {
                var that = this;
                var positions = entity.polyline.positions.getValue();
                var arrLables = entity._arrLables;
                var totalLable = entity._totalLable;
                var unit = totalLable && totalLable.unit;

                var index = 0;
                var positionsNew = [];

                function getLineFD() {
                    index++;

                    var arr = [positions[index - 1], positions[index]];
                    _util.terrainPolyline({
                        viewer: viewer,
                        positions: arr,
                        calback: function (raisedPositions, noHeight) {
                            if (noHeight) {
                                if (index == 1)
                                    positionsNew = positionsNew.concat(arr);
                                else
                                    positionsNew = positionsNew.concat([positions[index]]);
                            }
                            else {
                                positionsNew = positionsNew.concat(raisedPositions);
                            }

                            if (index >= positions.length - 1) {
                                entity.polyline.positions.setValue(positionsNew);
                                if (totalLable) {
                                    var distance = that.getLength(positionsNew);
                                    var distancestr = formatLength(distance, unit);

                                    totalLable.label.text = "全长:" + distancestr;
                                    totalLable.attribute.value = distance;

                                    if (that.options.calback)
                                        that.options.calback(distancestr, distance);
                                }
                            }
                            else {
                                var distance = that.getLength(raisedPositions);
                                var distancestr = formatLength(distance, unit);

                                var thisLabel = arrLables[index];
                                thisLabel.label.text = distancestr;
                                thisLabel.attribute.value = distance;

                                getLineFD();
                            }
                        }
                    });
                }
                getLineFD();
            },

            //计算剖面
            updateSectionForTerrain: function (entity) {
                var positions = entity.polyline.positions.getValue();
                if (positions.length < 2) return;

                var arrLables = entity._arrLables;
                var totalLable = entity._totalLable;
                var unit = totalLable && totalLable.unit;

                var index = 0;
                var positionsNew = [];

                var alllen = 0;
                var arrLen = [];
                var arrHB = [];
                var arrLX = [];
                var arrPoint = [];


                var that = this;
                function getLineFD() {
                    index++;

                    var arr = [positions[index - 1], positions[index]];
                    _util.terrainPolyline({
                        viewer: viewer,
                        positions: arr,
                        calback: function (raisedPositions, noHeight) {
                            if (noHeight) {
                                if (index == 1)
                                    positionsNew = positionsNew.concat(arr);
                                else
                                    positionsNew = positionsNew.concat([positions[index]]);
                            }
                            else {
                                positionsNew = positionsNew.concat(raisedPositions);
                            }

                            var h1 = Cesium.Cartographic.fromCartesian(positions[index - 1]).height;
                            var h2 = Cesium.Cartographic.fromCartesian(positions[index]).height;
                            var hstep = (h2 - h1) / raisedPositions.length;

                            for (var i = 0; i < raisedPositions.length; i++) {
                                //长度
                                if (i != 0) {
                                    alllen += Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
                                }
                                arrLen.push(Number(alllen.toFixed(1)));

                                //海拔高度
                                var point = _latlng.formatPositon(raisedPositions[i]);
                                arrHB.push(point.z);
                                arrPoint.push(point);

                                //路线高度
                                var fxgd = Number((h1 + hstep * i).toFixed(1));
                                arrLX.push(fxgd);
                            }


                            if (index >= positions.length - 1) {
                                if (totalLable) {
                                    var distance = that.getLength(positionsNew);
                                    var distancestr = formatLength(distance, unit);

                                    totalLable.label.text = "全长:" + distancestr;
                                    totalLable.attribute.value = distance;
                                }
                                if (that.options.calback)
                                    that.options.calback({
                                        distancestr: distancestr,
                                        distance: distance,
                                        arrLen: arrLen,
                                        arrLX: arrLX,
                                        arrHB: arrHB,
                                        arrPoint: arrPoint,
                                    });
                            }
                            else {
                                var distance = that.getLength(raisedPositions);
                                var distancestr = formatLength(distance, unit);

                                var thisLabel = arrLables[index];
                                thisLabel.label.text = distancestr;
                                thisLabel.attribute.value = distance;

                                getLineFD();
                            }
                        }
                    });
                }
                getLineFD();
            },
            //计算长度，单位：米
            getLength: function (positions) {
                var distance = 0;
                for (var i = 0, len = positions.length - 1; i < len; i++) {
                    distance += Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
                }
                return distance;
            }
        };


        var workArea = {
            options: null,
            totalLable: null,  //面积label
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                this.totalLable = null;
            },
            //开始绘制
            start: function (options) {
                this.options = options;

                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                        font: _font,
                        show: false
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });

                drawControl.startDraw({
                    type: "polygon",
                    style: {
                        color: "#ffff00",
                        outline: true,
                        outlineColor: "#ffff00",
                        outlineWidth: 4,
                        opacity: 0.4,
                        perPositionHeight: false //贴地
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {

            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var positions = drawControl.getPositions(entity);
                if (positions.length < 3) return;

                var _PolygonControl = __webpack_require__(6).default
                var polygon = _PolygonControl.toGeoJSON(entity);
                for(var item of polygon.geometry.coordinates){
                   for(var t of item){
                       t[2]=0;
                   }
                }
                var area = turf.area(polygon);
                var areastr = formatArea(area, this.options.unit);

                //求中心点 
                var center = turf.centerOfMass(polygon);
                var maxHeight = _drawutils.getMaxHeightForPositions(positions);
                var ptcenter = Cesium.Cartesian3.fromDegrees(
                    center.geometry.coordinates[0],
                    center.geometry.coordinates[1],
                    maxHeight + 1);
                    // var ptcenter = Cesium.Cartesian3.fromDegrees(
                    //     center.geometry.coordinates[0],
                    //     center.geometry.coordinates[1]);

                this.totalLable.position = ptcenter;
                this.totalLable.label.text = "面积:" + areastr;
                this.totalLable.label.show = true;

                this.totalLable.attribute.value = area;
                this.totalLable.attribute.textEx = "面积:";

                if (this.options.calback)
                    this.options.calback(areastr, area);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                if (entity.polygon == null) return;

                var polyPositions = entity.polygon.hierarchy.getValue();
                $.each(polyPositions, function (i, val) {
                    val.z = val.z + 1; //最后的高程加1，以确保端点显示在模型上面
                });

                entity._totalLable = this.totalLable;
                this.totalLable = null;
            },
        };


        var workHeight = {
            options: null,
            totalLable: null,   //高度label  
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                this.totalLable = null;
            },
            //开始绘制
            start: function (options) {
                this.options = options;

                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                        font: _font,
                        show: false
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });

                drawControl.startDraw({
                    type: "polyline",
                    minMaxPoints: { min: 2, max: 2, isSuper: false },
                    style: {
                        color: "#ffff00",
                        width: 3
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {


            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var positions = drawControl.getPositions(entity);
                if (positions.length < 2) return;

                var cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
                var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
                var height = Math.abs(cartographic1.height - cartographic.height);
                var heightstr = formatLength(height, this.options.unit);

                this.totalLable.position = _drawutils.getMidPosition(positions[0], positions[1]);
                this.totalLable.label.text = "高度差:" + heightstr;
                this.totalLable.label.show = true;

                this.totalLable.attribute.value = height;
                this.totalLable.attribute.textEx = "高度差:";

                if (this.options.calback)
                    this.options.calback(heightstr, height);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                entity._totalLable = this.totalLable;
                this.totalLable = null;

            }
        };


        var workSuperHeight = {
            options: null,
            totalLable: null,   //高度差label
            xLable: null,       //水平距离label
            hLable: null,       //水平距离label
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                if (this.xLable != null)
                    dataSource.entities.remove(this.xLable);
                if (this.hLable != null)
                    dataSource.entities.remove(this.hLable);

                this.totalLable = null;
                this.xLable = null;
                this.hLable = null;
            },
            //开始绘制
            start: function (options) {
                this.options = options;

                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: _font,
                        show: false,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
                        pixelOffset: new Cesium.Cartesian2(10, 0),   //偏移量  
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });

                this.xLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: _font,
                        show: false,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量   
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });

                this.hLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: _font,
                        show: false,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });

                drawControl.startDraw({
                    type: "polyline",
                    minMaxPoints: { min: 2, max: 2, isSuper: true },
                    style: {
                        color: "#ffff00",
                        width: 3
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {
                var lonlats = drawControl.getPositions(entity);
                if (lonlats.length == 4) {
                    var mouseEndPosition = lonlats[3].clone();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.push(mouseEndPosition);
                }

                if (lonlats.length == 2) {
                    var zCartesian = _drawutils.getZHeightPosition(lonlats[0], lonlats[1])
                    var hDistance = _drawutils.getHDistance(lonlats[0], lonlats[1]);
                    if (hDistance > 3.0) {
                        lonlats.push(zCartesian);
                        lonlats.push(lonlats[0]);
                    }
                }

                this.showSuperHeight(lonlats);
            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var lonlats = drawControl.getPositions(entity);
                if (lonlats.length == 4) {
                    var mouseEndPosition = lonlats[3].clone();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.push(mouseEndPosition);
                }

                if (lonlats.length == 2) {
                    var zCartesian = _drawutils.getZHeightPosition(lonlats[0], lonlats[1])
                    var hDistance = _drawutils.getHDistance(lonlats[0], lonlats[1]);
                    if (hDistance > 3.0) {
                        lonlats.push(zCartesian);
                        lonlats.push(lonlats[0]);
                    }
                }
                this.showSuperHeight(lonlats);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                entity._arrLables = [
                    this.totalLable,
                    this.hLable,
                    this.xLable
                ];

                this.totalLable = null;
                this.hLable = null;
                this.xLable = null;
            },

            /**
             * 超级 高程测量
             * 由4个点形成的三角形（首尾点相同），计算该三角形三条线段的长度
             * @param {Array} positions 4个点形成的点数组
             */
            showSuperHeight: function (positions) {
                var vLength; //垂直距离
                var hLength; //水平距离
                var lLength; //长度
                var height;
                if (positions.length == 4) {
                    var midLPoint = _drawutils.getMidPosition(positions[0], positions[1]);
                    var midXPoint, midHPoint;
                    var cartographic0 = Cesium.Cartographic.fromCartesian(positions[0]);
                    var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
                    var cartographic2 = Cesium.Cartographic.fromCartesian(positions[2]);
                    var tempHeight = cartographic1.height - cartographic2.height;
                    height = cartographic1.height - cartographic0.height;
                    lLength = Cesium.Cartesian3.distance(positions[0], positions[1]);
                    if (height > -1 && height < 1) {
                        midHPoint = positions[1];
                        this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差", height);
                        this.updateSuperHeightLabel(this.hLable, midLPoint, "长度", lLength);
                    } else {
                        if (tempHeight > -0.1 && tempHeight < 0.1) {
                            midXPoint = _drawutils.getMidPosition(positions[2], positions[1]);
                            midHPoint = _drawutils.getMidPosition(positions[2], positions[3]);
                            hLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
                            vLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
                        } else {
                            midHPoint = _drawutils.getMidPosition(positions[2], positions[1]);
                            midXPoint = _drawutils.getMidPosition(positions[2], positions[3]);
                            hLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
                            vLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
                        }
                        this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差", vLength);
                        this.updateSuperHeightLabel(this.xLable, midXPoint, "水平距离", hLength);
                        this.updateSuperHeightLabel(this.hLable, midLPoint, "长度", lLength);
                    }
                } else if (positions.length == 2) {
                    vLength = Cesium.Cartesian3.distance(positions[1], positions[0]);
                    var midHPoint = _drawutils.getMidPosition(positions[0], positions[1]);
                    if (xLable.label.show) {
                        xLable.label.show = false;
                        hLable.label.show = false;
                    }
                    this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差", vLength);
                }

                var heightstr = formatLength(vLength, this.options.unit);
                if (this.options.calback)
                    this.options.calback(heightstr, vLength);
            },
            /**
             * 超级 高程测量 显示标签
             * @param {Cesium.Label} currentLabel 显示标签
             * @param {Cesium.Cartesian3} postion 坐标位置
             * @param {String} type 类型("高度差"，"水平距离"，"长度")
             * @param {Object} value 值
             */
            updateSuperHeightLabel: function (currentLabel, postion, type, value) {
                if (currentLabel == null) return;

                currentLabel.position = postion;
                currentLabel.label.text = type + ":" + formatLength(value, this.options.unit);
                currentLabel.label.show = true;

                currentLabel.attribute.value = value;
                currentLabel.attribute.textEx = type + ":";
            }

        };


        /**  进行单位换算，格式化显示面积    */
        function formatArea(val, unit) {
            if (val == null) return "";

            if (unit == null || unit == "auto") {
                if (val < 1000000)
                    unit = "m";
                else
                    unit = "km";
            }

            var valstr = "";
            switch (unit) {
                default:
                case "m":
                    valstr = val.toFixed(2) + ' 平方米';
                    break;
                case "km":
                    valstr = (val / 1000000).toFixed(2) + ' 平方公里';
                    break;
                case "mu":
                    valstr = (val * 0.0015).toFixed(2) + ' 亩';
                    break;
                case "ha":
                    valstr = (val * 0.0001).toFixed(2) + ' 公顷';
                    break;
            }

            return valstr;
        }

        /**  单位换算，格式化显示长度     */
        function formatLength(val, unit) {
            if (val == null) return "";

            if (unit == null || unit == "auto") {
                if (val < 1000)
                    unit = "m";
                else
                    unit = "km";
            }

            var valstr = "";
            switch (unit) {
                default:
                case "m":
                    valstr = val.toFixed(2) + ' 米';
                    break;
                case "km":
                    valstr = (val * 0.001).toFixed(2) + ' 公里';
                    break;
                case "mile":
                    valstr = (val * 0.00054).toFixed(2) + ' 海里';
                    break;
                case "zhang":
                    valstr = (val * 0.3).toFixed(2) + ' 丈';
                    break;
            }
            return valstr;
        }



        return {
            measuerLength: measuerLength,
            measureHeight: measureHeight,
            measureArea: measureArea,
            measureSection: measureSection,
            updateUnit: updateUnit,
            clearMeasure: clearMeasure,

            formatArea: formatArea,
            formatLength: formatLength,
        };
    });

    /* harmony default export */ __webpack_exports__["default"] = (Measure);

    /***/
}),
/* 52 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    var pointconvert = __webpack_require__(11)


    function GaodePOIGeocoder(options) {
        options = options || {};
        this.citycode = options.citycode || '';
        //内置高德地图服务key，建议后期修改为自己申请的
        this.gaodekey = options.key || [
            "c95467d0ed2a3755836e37dc27369f97",
            "4320dda936d909d73ab438b4e29cf2a2",
            "e64a96ed7e361cbdc0ebaeaf3818c564",
            "df3247b7df64434adecb876da94755d7",
            "d4375ec477cb0a473c448fb1f83be781",
            "13fdd7b2b90a9d326ae96867ebcc34ce",
            "c34502450ae556f42b21760faf6695a0",
            "57f8ebe12797a73fc5b87f5d4ef859b1"
        ];
    }
    GaodePOIGeocoder.prototype.getOneKey = function () {
        var arr = this.gaodekey;
        var n = Math.floor(Math.random() * arr.length + 1) - 1;
        return arr[n];
    }

    GaodePOIGeocoder.prototype.geocode = function (query, geocodeType) {
        var that = this;

        var key = this.getOneKey();

        var resource = new Cesium.Resource({
            url: 'http://restapi.amap.com/v3/place/text',
            queryParameters: {
                key: key,
                city: this.citycode,
                //citylimit: true,
                keywords: query
            }
        });

        return resource.fetchJson().then(function (results) {
            if (results.status == 0) {
                haoutil.msg("请求失败(" + results.infocode + ")：" + results.info);
                return;
            }
            if (results.pois.length === 0) {
                haoutil.msg("未查询到“" + query + "”相关数据！");
                return;
            }

            var height = 3000;
            if (that.viewer.camera.positionCartographic.height < height)
                height = that.viewer.camera.positionCartographic.height;

            return results.pois.map(function (resultObject) {
                var arrjwd = resultObject.location.split(",");
                arrjwd = pointconvert.gcj2wgs(arrjwd); //纠偏
                var lnglat = that.viewer.mars.point2map({ x: arrjwd[0], y: arrjwd[1] });

                return {
                    displayName: resultObject.name,
                    destination: Cesium.Cartesian3.fromDegrees(lnglat.x, lnglat.y, height)
                };
            });
        });
    };

    //===========模块对外公开的属性及方法=========
    /* harmony default export */ __webpack_exports__["default"] = (GaodePOIGeocoder);

    /***/
}),
/* 53 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function () { return bind; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unbind", function () { return unbind; });
    //键盘漫游  第一人称漫游
    var cameraFunc;

    function bind(viewer) {
        var scene = viewer.scene;
        var canvas = viewer.canvas;
        canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
        canvas.onclick = function () {
            canvas.focus();
        };
        var ellipsoid = scene.globe.ellipsoid;

        // disable the default event handlers
        scene.screenSpaceCameraController.enableRotate = false;
        scene.screenSpaceCameraController.enableTranslate = false;
        scene.screenSpaceCameraController.enableZoom = false;
        scene.screenSpaceCameraController.enableTilt = false;
        scene.screenSpaceCameraController.enableLook = false;

        var startMousePosition;
        var mousePosition;
        var flags = {
            looking: false,
            moveForward: false,
            moveBackward: false,
            moveUp: false,
            moveDown: false,
            moveLeft: false,
            moveRight: false
        };


        var speedRatio = 100;

        var handler = new Cesium.ScreenSpaceEventHandler(canvas);

        handler.setInputAction(function (movement) {
            flags.looking = true;
            mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function (movement) {
            mousePosition = movement.endPosition;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (position) {
            flags.looking = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction(function (delta) {

            if (delta > 0) {
                speedRatio = speedRatio * 0.8;
            }
            else {
                speedRatio = speedRatio * 1.2;
            }
            console.log(delta);

        }, Cesium.ScreenSpaceEventType.WHEEL);


        function getFlagForKeyCode(keyCode) {
            switch (keyCode) {
                case 38: //镜头前进
                case 'W'.charCodeAt(0):
                    return 'moveForward';
                case 'S'.charCodeAt(0):
                case 40: //镜头后退
                    return 'moveBackward';
                case 'D'.charCodeAt(0):
                case 39: //向右平移镜头
                    return 'moveRight';
                case 'A'.charCodeAt(0):
                case 37: //向左平移镜头
                    return 'moveLeft';
                case 'Q'.charCodeAt(0):
                    return 'moveUp';
                case 'E'.charCodeAt(0):
                    return 'moveDown';
                default:
                    return undefined;
            }
        }

        document.addEventListener('keydown', function (e) {
            var flagName = getFlagForKeyCode(e.keyCode);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = true;
            }
        }, false);

        document.addEventListener('keyup', function (e) {
            var flagName = getFlagForKeyCode(e.keyCode);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = false;
            }
        }, false);


        function moveForward(distance) {
            //和模型的相机移动不太一样  不是沿着相机目标方向，而是默认向上方向 和 向右 方向的插值方向
            var camera = viewer.camera;
            var direction = camera.direction;
            //获得此位置默认的向上方向  
            var up = Cesium.Cartesian3.normalize(camera.position, new Cesium.Cartesian3());

            // right = direction * up  
            var right = Cesium.Cartesian3.cross(direction, up, new Cesium.Cartesian3());

            direction = Cesium.Cartesian3.cross(up, right, new Cesium.Cartesian3());

            direction = Cesium.Cartesian3.normalize(direction, direction);
            direction = Cesium.Cartesian3.multiplyByScalar(direction, distance, direction);


            camera.position = Cesium.Cartesian3.add(camera.position, direction, camera.position);

        }

        cameraFunc = function (clock) {
            var camera = viewer.camera;

            if (flags.looking) {
                var width = canvas.clientWidth;
                var height = canvas.clientHeight;

                // Coordinate (0.0, 0.0) will be where the mouse was clicked.
                var x = (mousePosition.x - startMousePosition.x) / width;
                var y = -(mousePosition.y - startMousePosition.y) / height;

                //这计算了，分别向右 和 向上移动的
                var lookFactor = 0.05;
                camera.lookRight(x * lookFactor);
                camera.lookUp(y * lookFactor);

                //获得direction 方向
                var direction = camera.direction;
                //获得此位置默认的向上方向  
                var up = Cesium.Cartesian3.normalize(camera.position, new Cesium.Cartesian3());

                // right = direction * up  
                var right = Cesium.Cartesian3.cross(direction, up, new Cesium.Cartesian3());
                // up = right * direction
                up = Cesium.Cartesian3.cross(right, direction, new Cesium.Cartesian3());

                camera.up = up;
                camera.right = right;
            }

            // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
            var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
            var moveRate = cameraHeight / speedRatio;

            if (flags.moveForward) {
                moveForward(moveRate);
            }
            if (flags.moveBackward) {
                moveForward(-moveRate);
            }
            if (flags.moveUp) {
                camera.moveUp(moveRate);
            }
            if (flags.moveDown) {
                camera.moveDown(moveRate);
            }
            if (flags.moveLeft) {
                camera.moveLeft(moveRate);
            }
            if (flags.moveRight) {
                camera.moveRight(moveRate);
            }
        };

        viewer.clock.onTick.addEventListener(cameraFunc);
    }


    function unbind(viewer) {
        var scene = viewer.scene;
        var canvas = viewer.canvas;
        scene.screenSpaceCameraController.enableRotate = true;
        scene.screenSpaceCameraController.enableTranslate = true;
        scene.screenSpaceCameraController.enableZoom = true;
        scene.screenSpaceCameraController.enableTilt = true;
        scene.screenSpaceCameraController.enableLook = true;

        if (cameraFunc) {
            viewer.clock.onTick.removeEventListener(cameraFunc);
            cameraFunc = undefined;
        }
    }




    /***/
}),
/* 54 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isOnly", function () { return isOnly; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function () { return init; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "show", function () { return show; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "close", function () { return close; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPopupForConfig", function () { return getPopupForConfig; });
    /* 2017-12-4 08:27:23 | 修改 木遥（QQ：346819890） */

    var _latlng = __webpack_require__(3);

    var viewer;
    var objPopup = {};

    function init(_viewer) {
        viewer = _viewer;

        //添加弹出框 
        var infoDiv = '<div id="pupup-all-view" ></div>';
        $("#" + viewer._container.id).append(infoDiv);

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        //单击事件
        handler.setInputAction(mousePickingClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //移动事件
        viewer.scene.postRender.addEventListener(bind2scene);
    }

    //鼠标点击事件
    function mousePickingClick(event) {
        close();

        var position = event.position;
        var pickedObject = viewer.scene.pick(position);

        //普通entity对象 && viewer.scene.pickPositionSupported
        if (pickedObject && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.popup)) {
            var entity = pickedObject.id;

            var cartesian;
            if (entity.billboard || entity.label || entity.point) {
                cartesian = pickedObject.primitive.position;
            } else {
                cartesian = _latlng.getCurrentMousePosition(viewer.scene, position);
            }
            show(entity, cartesian);
            return;
        }

        //primitive对象 
        if (pickedObject && Cesium.defined(pickedObject.primitive) && Cesium.defined(pickedObject.primitive.popup)) {

            var cartesian = _latlng.getCurrentMousePosition(viewer.scene, position);
            show(pickedObject.primitive, cartesian);
            return;
        }

        pickImageryLayerFeatures(position);
    }

    //瓦片图层上的矢量对象(获取实体)，动态获取
    function pickImageryLayerFeatures(position) {
        var scene = viewer.scene;
        var pickRay = scene.camera.getPickRay(position);
        var imageryLayerFeaturePromise = scene.imageryLayers.pickImageryLayerFeatures(pickRay, scene);
        if (!Cesium.defined(imageryLayerFeaturePromise)) {
            return;
        }

        Cesium.when(imageryLayerFeaturePromise, function (features) {
            if (!Cesium.defined(features) || features.length === 0) {
                return;
            }

            // Select the first feature.
            var feature = features[0];

            if (feature.imageryLayer && feature.imageryLayer.config) {
                var result = getPopupForConfig(feature.imageryLayer.config, feature.properties);
                if (result) {
                    var cartesian = _latlng.getCurrentMousePosition(viewer.scene, position);
                    show({
                        id: 'imageryLayerFeaturePromise',
                        popup: {
                            html: result,
                            anchor: feature.imageryLayer.config.popupAnchor || [0, -12],
                        },
                    }, cartesian);
                }
            }

        }, function () {

        });
    }

    function show(entity, cartesian) {
        if (entity == null || entity.popup == null) return;

        var eleId = 'popup-' + ((entity.id || "") + "").replace(new RegExp(".", "gm"), "_");

        close(eleId);


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
        if (!inhtml) return;

        if (typeof inhtml === 'function') {
            inhtml = inhtml(entity);//回调方法
        }

        inhtml = '<div id="' + eleId + '" class="cesium-popup">'
              + '            <a class="cesium-popup-close-button cesium-popup-color" href="javascript:viewer.mars.popup.close(\'' + eleId + '\')">×</a>'
              + '            <div class="cesium-popup-content-wrapper cesium-popup-background">'
              + '                <div class="cesium-popup-content cesium-popup-color">' + inhtml + '</div>'
              + '            </div>'
              + '            <div class="cesium-popup-tip-container"><div class="cesium-popup-tip cesium-popup-background"></div></div>'
              + '        </div>';
        $("#pupup-all-view").append(inhtml);


        //计算显示位置
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

    var _isOnly = true;

    function isOnly(value) {
        _isOnly = value;
    }

    function template(str, data) {
        for (var col in data) {
            var showval = data[col];
            if (showval == null || showval == 'Null' || showval == 'Unknown') showval = "";

            if (col.substr(0, 1) == "_") {
                col = col.substring(1); //cesium 内部属性
            }
            str = str.replace(new RegExp('{' + col + '}', "gm"), showval);
        }
        return str;
    }


    //通用，统一配置popup方式
    function getPopupForConfig(cfg, attr) {
        if (cfg.popup) {
            if (typeof cfg.popup === 'object') {

                if (cfg.popup.type == "iframe") {
                    var _url = L.Util.template(cfg.popup.url, attr);

                    var inhtml = '<iframe id="ifarm" src="'
                        + _url + '"  style="width:'
                        + (cfg.popup.width || '300') + 'px;height:'
                        + (cfg.popup.height || '300')
                        + 'px;overflow:hidden;margin:0;" scrolling="no" frameborder="0" ></iframe>';
                    return inhtml;
                }

            }
            else {
                if (cfg.popup == "all") {
                    var inhtml = '<table>';
                    for (var col in attr) {
                        if (attr[col] == null || typeof attr[col] === 'function') continue;

                        var showval = $.trim(attr[col]);
                        if (showval == '' || showval == 'Null' || showval == 'Unknown' || showval == '0' || showval.length == 0) continue;

                        inhtml += '<tr>  <td  style="text-align: right;min-width: 80px;">' + col + '：</td> <td>' + showval + '</td>   </tr>';
                    }
                    inhtml += "</table>"

                    if (inhtml == '<table></table>') return false;
                    return '<div   style="text-align: center;width:100%;margin: 5px;"><b>' + cfg.name + '</b></div>' + inhtml;
                }
                else {
                    return template(cfg.popup, attr);
                }
            }
        }
        else if (cfg.columns) {

            var inhtml = '<table>';
            for (var i = 0; i < cfg.columns.length; i++) {
                var thisfield = cfg.columns[i];

                var showval = attr[thisfield.field];
                if (showval == null) continue;

                showval = $.trim(showval);
                if (showval == null || showval == '' || showval == 'Null' || showval == 'Unknown' || showval == '0' || showval.length == 0) continue;

                inhtml += '<tr>  <td  style="text-align: right;min-width: 80px;">' + thisfield.name + '：</td> <td>' + showval + '</td>   </tr>';
            }

            inhtml += "</table>"

            if (inhtml == '<table></table>') return false;
            return inhtml;
        }
        return false;
    }

    //===========模块对外公开的属性及方法=========



    /***/
}),
/* 55 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isOnly", function () { return isOnly; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function () { return init; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "show", function () { return show; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "close", function () { return close; });
    /* 2017-12-4 08:27:18 | 修改 木遥（QQ：346819890） */

    var _latlng = __webpack_require__(3);

    var viewer;


    function init(_viewer) {
        viewer = _viewer;

        //添加弹出框  
        var infoDiv = '<div id="tooltip-view" class="cesium-popup" style="display:none;">'
                    + '     <div class="cesium-popup-content-wrapper  cesium-popup-background">'
                    + '         <div id="tooltip-content" class="cesium-popup-content cesium-popup-color"></div>'
                    + '     </div>'
                    + '     <div class="cesium-popup-tip-container"><div class="cesium-popup-tip  cesium-popup-background"></div></div>'
                    + '</div> ';
        $("#" + viewer._container.id).append(infoDiv);

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        //鼠标移动事件
        handler.setInputAction(mouseMovingPicking, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    var lastEntity;

    //鼠标移动事件
    function mouseMovingPicking(event) {
        $('.cesium-viewer').css('cursor', '');

        var position = event.endPosition;
        var pickedObject = viewer.scene.pick(position);
        if (pickedObject && Cesium.defined(pickedObject.id)) {//普通entity对象 && viewer.scene.pickPositionSupported
            var entity = pickedObject.id;

            if (entity.popup || entity.cursorCSS) {
                $('.cesium-viewer').css('cursor', entity.cursorCSS || 'pointer');
            }

            if (!entity.tooltip) { close(); return; }

            if (entity.billboard || entity.label || entity.point) {
                if (lastEntity == entity) return;
                lastEntity = entity;
            }

            var cartesian = _latlng.getCurrentMousePosition(viewer.scene, position);
            show(entity, cartesian, position);
        }
        else if (pickedObject && Cesium.defined(pickedObject.primitive)) {//primitive对象 && viewer.scene.pickPositionSupported
            var primitive = pickedObject.primitive;
            if (primitive.popup || primitive.cursorCSS) {
                $('.cesium-viewer').css('cursor', primitive.cursorCSS || 'pointer');
            }

            if (!primitive.tooltip) { close(); return; }

            var cartesian = _latlng.getCurrentMousePosition(viewer.scene, position);
            show(primitive, cartesian, position);
        }
        else {
            close();
        }
    }

    function show(entity, cartesian, position) {
        if (entity == null || entity.tooltip == null) return;

        //计算显示位置 
        if (position == null)
            position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);
        if (position == null) {
            close();
            return;
        }

        var $view = $("#tooltip-view");

        //显示内容
        var inhtml;
        if (typeof entity.tooltip === 'object')
            inhtml = entity.tooltip.html;
        else
            inhtml = entity.tooltip;

        if (typeof inhtml === 'function') {
            inhtml = inhtml(entity);//回调方法
        }
        if (!inhtml) return;

        $("#tooltip-content").html(inhtml);
        $view.show();


        //定位位置
        var x = position.x - ($view.width() / 2);
        var y = position.y - $view.height();

        var tooltip = entity.tooltip;
        if (tooltip && (typeof tooltip === 'object') && tooltip.anchor) {
            x += tooltip.anchor[0];
            y += tooltip.anchor[1];
        }
        $view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
    }



    function close() {
        $("#tooltip-content").empty();
        $("#tooltip-view").hide();
        lastEntity = null;
    }

    //===========模块对外公开的属性及方法=========


    /***/
}),
/* 56 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-5 13:18:20 | 修改 木遥（QQ：346819890） */
    var BaseWidget = L.Class.extend({
        viewer: null,
        options: {},
        config: {},     //配置的config信息 
        path: "",       //当前widget目录相对路径 
        isActivate: false,  //是否激活状态
        isCreate: false,
        initialize: function (cfg, map) {
            this.viewer = map;
            this.config = cfg;
            this.path = cfg.path || '';
            this.init();
        },
        addCacheVersion: function (_resource) {
            if (_resource == null) return _resource;

            var cacheVersion = mars3d.widget.getCacheVersion();
            if (cacheVersion) {
                if (_resource.indexOf('?') == -1)
                    _resource += "?time=" + cacheVersion;
                else if (_resource.indexOf('time=' + cacheVersion) == -1)
                    _resource += "&time=" + cacheVersion;
            }
            return _resource;
        },
        //激活插件
        activateBase: function () {
            this.beforeActivate();

            var that = this;

            if (this.isActivate) {
                //已激活状态时跳出 
                this.changeWidgetView(function (viewopts) {
                    if (viewopts._dom) {

                        //将层置顶
                        $(".layui-layer").each(function () {
                            $(this).css("z-index", 19891000);
                        });
                        $(viewopts._dom).css("z-index", 19891014);
                    }
                });
                //已激活时，重启
                this.disable();
                this._startActivate();
                return;
            }
            this.isActivate = true;

            if (!this.isCreate) {
                //首次进行创建 
                if (this.options.resources && this.options.resources.length > 0) {
                    var resources = [];
                    var time = new Date().getTime();

                    mars3d.widget._resources_cache = mars3d.widget._resources_cache || [];//不加重复资源

                    for (var i = 0; i < this.options.resources.length; i++) {
                        var _resource = this.options.resources[i];
                        _resource = this._getUrl(_resource);

                        if (mars3d.widget._resources_cache.indexOf(_resource) != -1) continue;//不加重复资源

                        resources.push(_resource);
                    }
                    mars3d.widget._resources_cache = mars3d.widget._resources_cache.concat(resources);//不加重复资源

                    Loader.async(resources, function () {
                        var result = that.create(function () {
                            that._createWidgetView();
                            that.isCreate = true;
                        });
                        if (result) return;
                        if (that.config.createAtStart) {
                            that.config.createAtStart = false;
                            that.isActivate = false;
                            that.isCreate = true;
                            return;
                        }
                        that._createWidgetView();
                        that.isCreate = true;
                    });
                    return;
                }
                else {
                    var result = this.create(function () {
                        that._createWidgetView();
                        this.isCreate = true;
                    });
                    if (result) return;
                    if (that.config.createAtStart) {
                        that.config.createAtStart = false;
                        that.isActivate = false;
                        that.isCreate = true;
                        return;
                    }
                }
                this.isCreate = true;
            }
            this._createWidgetView();

            return this;
        },
        //创建插件的view
        _createWidgetView: function () {
            var viewopts = this.options.view;
            if (viewopts === undefined || viewopts === null) {
                this._startActivate();
            }
            else if (L.Util.isArray(viewopts)) {
                this._viewcreate_allcount = viewopts.length;
                this._viewcreate_okcount = 0;

                for (var i = 0; i < viewopts.length; i++) {
                    this.createItemView(viewopts[i]);
                }
            }
            else {
                this._viewcreate_allcount = 1;
                this._viewcreate_okcount = 0;
                this.createItemView(viewopts);
            }
        },
        changeWidgetView: function (calback) {
            var viewopts = this.options.view;
            if (viewopts === undefined || viewopts === null) {
                return false;
            }
            else if (L.Util.isArray(viewopts)) {
                var hascal = false;
                for (var i = 0; i < viewopts.length; i++) {
                    hascal = hascal || calback(viewopts[i]);
                }
                return hascal;
            }
            else {
                return calback(viewopts);
            }
        },
        createItemView: function (viewopt) {
            switch (viewopt.type) {
                default:
                case "window":
                    this._openWindow(viewopt);
                    break;
                case "divwindow":
                    this._openDivWindow(viewopt);
                    break;
                case "append":
                    this._appendView(viewopt);
                    break;
                case "custom"://自定义 
                    var view_url = this._getUrl(viewopt.url);

                    var that = this;
                    viewopt.open(view_url, function (html) {
                        that.winCreateOK(viewopt, html);

                        that._viewcreate_okcount++;
                        if (that._viewcreate_okcount >= that._viewcreate_allcount) {
                            that._startActivate(html);
                        }
                    }, this);
                    break;
            }
        },
        _viewcreate_allcount: 0,
        _viewcreate_okcount: 0,
        //==============layer弹窗================= 
        _openWindow: function (viewopt) {
            var that = this;
            var view_url = this._getUrl(viewopt.url);

            var opts = {
                type: 2,
                content: [view_url, 'no'],
                success: function (layero) {
                    viewopt._dom = layero;

                    //得到iframe页的窗口对象，执行iframe页的方法：viewWindow.method();
                    var viewWindow = window[layero.find('iframe')[0]['name']];

                    //隐藏弹窗
                    if (that.config.hasOwnProperty("visible") && !that.config.visible)
                    {
                        $(layero).hide();
                    }
                    else{
                        $(layero).show();
                    }
                        

                    layer.setTop(layero);
                    that.winCreateOK(viewopt, viewWindow);

                    that._viewcreate_okcount++;
                    if (that._viewcreate_okcount >= that._viewcreate_allcount)
                        that._startActivate(layero);

                    //通知页面,页面需要定义initWidgetView方法
                    if (viewWindow && viewWindow.initWidgetView)
                        viewWindow.initWidgetView(that);
                    else
                        console.error("" + view_url + "页面没有定义function initWidgetView(widget)方法，无法初始化widget页面!");
                }
            };

            viewopt._layerIdx = layer.open(this._getWinOpt(viewopt, opts));
        },
        _openDivWindow: function (viewopt) {
            var view_url = this._getUrl(viewopt.url);
            //div弹窗
            var that = this;
            this.getHtml(view_url, function (data) {
                var opts = {
                    type: 1,
                    content: data,
                    success: function (layero) {
                        viewopt._dom = layero;

                        //隐藏弹窗
                        if (that.config.hasOwnProperty("visible") && !that.config.visible)
                            $(layero).hide();

                        layer.setTop(layero);
                        that.winCreateOK(viewopt, layero);


                        that._viewcreate_okcount++;
                        if (that._viewcreate_okcount >= that._viewcreate_allcount)
                            that._startActivate(layero);
                    }
                };
                viewopt._layerIdx = layer.open(that._getWinOpt(viewopt, opts));
            });
        },
        _getUrl: function (url) {
            url = this.addCacheVersion(url);

            if (url.startsWith("/")
                || url.startsWith(".")
                || url.startsWith("http"))
                return url;
            else
                return this.path + url;
        },
        _getWinOpt: function (viewopt, opts) {
            //优先使用cofig中配置，覆盖js中的定义 
            var def = mars3d.widget.getDefWindowOptions();
            var windowOptions = $.extend(def, viewopt.windowOptions);
            windowOptions = $.extend(windowOptions, this.config.windowOptions);
            viewopt.windowOptions = windowOptions;//赋值 

            var that = this;
            var _size = this._getWinSize(windowOptions);

            //默认值
            var defOpts = {
                title: windowOptions.noTitle ? false : (this.config.name || ' '),
                area: _size.area,
                offset: _size.offset,
                shade: 0,
                maxmin: false,
                zIndex: layer.zIndex,
                end: function () {// 销毁后触发的回调
                    viewopt._layerIdx = -1;
                    that.disableBase();
                    window.postMessage({
                        type:"marswidgetclose",
                        url:that.config.path
                    },"*")
                    // if(window.marswidgetclose){
                    //     window.marswidgetclose(that.config.path);
                    // }
                },
                full: function (dom) { //最大化后触发的回调
                    that.winFull(dom);
                },
                min: function (dom) {//最小化后触发的回调
                    that.winMin(dom);
                },
                restore: function (dom) {//还原 后触发的回调
                    that.winRestore(dom);
                }
            };
            var cfgOpts = $.extend(defOpts, windowOptions);
            return $.extend(cfgOpts, opts || {});
        },
        //计算弹窗大小和位置
        _getWinSize: function (windowOptions) {
            //获取高宽 
            var _width = windowOptions.width;
            var _height = windowOptions.height;

            //if (typeof _width == "string") {//百分比时候

            //}

            //计算位置offset
            var offset = '';
            var position = windowOptions.position;
            if (position) {
                if (typeof position == "string") {
                    //t顶部,b底部,r右边缘,l左边缘,lt左上角,lb左下角,rt右上角,rb右下角
                    offset = position;
                }
                else if (typeof position == "object") {
                    var _top;
                    var _left;

                    if (position.hasOwnProperty("top") && position.top != null)
                        _top = position.top;
                    if (position.hasOwnProperty("bottom") && position.bottom != null) {
                        windowOptions._hasresize = true;
                        _top = document.documentElement.clientHeight - _height - position.bottom;

                        if (position.hasOwnProperty("top")) {//!viewopt.hasOwnProperty("height") && 
                            _top = position.top;
                            _height = document.documentElement.clientHeight - _top - position.bottom;
                        }
                    }

                    if (position.hasOwnProperty("left") && position.left != null)
                        _left = position.left;
                    if (position.hasOwnProperty("right") && position.right != null) {
                        windowOptions._hasresize = true;
                        _left = document.documentElement.clientWidth - _width - position.right;

                        if (position.hasOwnProperty("left")) {//!viewopt.hasOwnProperty("width") && 
                            _left = position.left;
                            _width = document.documentElement.clientWidth - _left - position.right;
                        }
                    }


                    if (_top == null)
                        _top = (document.documentElement.clientHeight - _height) / 2;
                    if (_left == null)
                        _left = (document.documentElement.clientWidth - _width) / 2;

                    offset = [_top + 'px', _left + 'px'];
                }
            }
            var area;
            if (_width && _height)
                area = [_width + 'px', _height + 'px'];
            else
                area = _width + 'px';

            return { area: area, offset: offset };
        },
        //==============直接添加到index上=================  
        _appendView: function (viewopt) {

            if (this.isCreate && viewopt._dom) {
                $(viewopt._dom).show({
                    duration: 500,
                });
                this._startActivate(viewopt._dom);
            } else {
                var view_url = this._getUrl(viewopt.url);
                var that = this;
                that.getHtml(view_url, function (html) {

                    viewopt._dom = $(html).appendTo((viewopt.parent || 'body'));

                    that.winCreateOK(viewopt, html);

                    that._viewcreate_okcount++;
                    if (that._viewcreate_okcount >= that._viewcreate_allcount)
                        that._startActivate(html);
                });

            }
        },

        //释放插件
        disableBase: function () {
            if (!this.isActivate)
                return;
                window.postMessage({
                    type:"marswidgetclose",
                    url:this.config.path
                },"*")
                // if(window.marswidgetclose){
                //     window.marswidgetclose(this.config.path);
                // }
            var has = this.changeWidgetView(function (viewopts) {
                if (viewopts._layerIdx != null && viewopts._layerIdx != -1) {
                    layer.close(viewopts._layerIdx);
                    viewopts._layerIdx = -1;
                    return true
                }
                else {
                    if (viewopts.type == "append" && viewopts._dom)
                        $(viewopts._dom).hide({
                            duration: 1000,
                        });
                    if (viewopts.type == "custom" && viewopts.close)
                        viewopts.close();
                    return false;
                }
            });
            if (has)
                return;

            this.disable();
            this.isActivate = false;
        },
        //主窗体改变大小后触发
        indexResize: function () {
            var that = this;
            this.changeWidgetView(function (viewopts) {
                if (viewopts._layerIdx == null || viewopts._layerIdx == -1 || viewopts.windowOptions == null || !viewopts.windowOptions._hasresize)
                    return;

                var _size = that._getWinSize(viewopts.windowOptions);
                var _style = {
                    width: _size.area[0],
                    height: _size.area[1],
                    top: _size.offset[0],
                    left: _size.offset[1]
                };
                $(viewopts._dom).attr("myTopLeft", true);

                layer.style(viewopts._layerIdx, _style);

                if (viewopts.type == "divwindow")
                    layer.iframeAuto(viewopts._layerIdx);
            });

        },
        _startActivate: function (layero) {
            this.activate(layero);
            if (this.config.success) {
                this.config.success(this);
            }
        },
        //子类继承后覆盖 
        init: function () {
        },
        //子类继承后覆盖 
        create: function (endfun) {
        },
        //子类继承后覆盖
        beforeActivate: function () {
        },
        activate: function (layero) {
        },

        //子类继承后覆盖
        disable: function () {
        },


        //子类继承后覆盖 
        winCreateOK: function (opt, result) {
        },
        //窗口最大化后触发
        winFull: function () {
        },
        //窗口最小化后触发
        winMin: function () {
        },
        //窗口还原 后触发
        winRestore: function () {
        },


        //公共方法
        getHtml: function (url, callback) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: 'html',
                timeout: 0, //永不超时
                success: function (data) {
                    callback(data);
                }
            });
        },

    });

    /* harmony default export */ __webpack_exports__["default"] = (BaseWidget);

    /***/
}),
/* 57 */
/***/ (function (module, exports) {

    /* 2017-9-28 13:16:08 | 修改 木遥（QQ：346819890） */

    (function (window, document) {
        'use strict';
        // cssExpr 用于判断资源是否是css
        var cssExpr = new RegExp('\\.css');
        var nHead = document.head || document.getElementsByTagName('head')[0];
        // `onload` 在WebKit < 535.23， Firefox < 9.0 不被支持
        var isOldWebKit = +navigator.userAgent
            .replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, '$1') < 536;

        // 判断对应的node节点是否已经载入完成
        function isReady(node) {
            return node.readyState === 'complete' || node.readyState === 'loaded';
        }

        // loadCss 用于载入css资源
        function loadCss(url, setting, callback) {
            var node = document.createElement('link');

            // if(!url.startsWith("assets"))
            //     url="assets/mars/"+url;
            node.rel = 'stylesheet';
            // addOnload(node, callback, 'css');
            node.async = true;
            node.href = url;
            addOnload(node, callback, 'css');
            nHead.appendChild(node);
        }

        // loadJs 用于载入js资源
        function loadJs(url, setting, callback) {
            var node = document.createElement('script');

            // if(!url.startsWith("assets"))
            // url="assets/mars/"+url;

            node.charset = 'utf-8';
            // addOnload(node, callback, 'js');
            node.async = !setting.sync;
            node.src = url;
            addOnload(node, callback, 'js');
            nHead.appendChild(node);
        }

        // 在老的webkit中，因不支持load事件，这里用轮询sheet来保证
        function pollCss(node, callback) {
            var isLoaded;

            if (node.sheet) {
                isLoaded = true;
            }

            setTimeout(function () {
                if (isLoaded) {
                    // 在这里callback 是为了让样式有足够的时间渲染
                    callback();
                } else {
                    pollCss(node, callback);
                }
            }, 20);
        }

        // 用于给指定的节点绑定onload回调
        // 监听元素载入完成事件
        function addOnload(node, callback, type) {
            var supportOnload = 'onload' in node;
            var isCSS = type === 'css';

            // 对老的webkit和老的firefox的兼容
            if (isCSS && (isOldWebKit || !supportOnload)) {
                setTimeout(function () {
                    pollCss(node, callback);
                }, 1);
                return;
            }

            if (supportOnload) {
                node.onload = onload;
                node.onerror = function () {
                    node.onerror = null;
                    //window._cdnFallback(node);
                    if (type == "css")
                        console.error("该css文件不存在：" + node.href);
                    else
                        console.error("该js文件不存在：" + node.src);
                    onload();
                };
            } else {
                node.onreadystatechange = function () {
                    if (isReady(node)) {
                        onload();
                    }
                };
            }

            function onload() {

                // 执行一次后清除，防止重复执行
                node.onload = node.onreadystatechange = null;

                node = null;

                callback();
            }
        }

        // 资源下载入口，根绝文件类型的不同，调用loadCss或者loadJs
        function loadItem(url, list, setting, callback) {
            // 如果加载的url为空，就直接成功返回
            if (!url) {
                setTimeout(function () {
                    onFinishLoading();
                });
                return;
            }

            if (cssExpr.test(url)) {
                loadCss(url, setting, onFinishLoading);
            } else {
                loadJs(url, setting, onFinishLoading);
            }

            // 每次资源下载完成后，检验是否结束整个list下载过程
            // 若已经完成所有下载，执行回调函数
            function onFinishLoading() {
                var urlIndex = list.indexOf(url);
                if (urlIndex > -1) {
                    list.splice(urlIndex, 1);
                }

                if (list.length === 0) {
                    callback();
                }
            }
        }

        function doInit(list, setting, callback) {
            var cb = function () {
                callback && callback();
            };

            list = Array.prototype.slice.call(list || []);

            if (list.length === 0) {
                cb();
                return;
            }

            for (var i = 0, len = list.length; i < len; i++) {
                loadItem(list[i], list, setting, cb);
            }
        }

        // 判断当前页面是否加载完
        // 加载完，立刻执行下载
        // 未加载完，等待页面load事件以后再进行下载
        function ready(node, callback) {
            if (isReady(node)) {
                callback();
            } else {
                // 1500ms 以后，直接开始下载资源文件，不再等待load事件
                var timeLeft = 1500;
                var isExecute = false;
                window.addEventListener('load', function () {
                    if (!isExecute) {
                        callback();
                        isExecute = true;
                    }
                });

                setTimeout(function () {
                    if (!isExecute) {
                        callback();
                        isExecute = true;
                    }
                }, timeLeft);
            }
        }

        // 暴露出去的Loader
        // 提供async, sync两个函数
        // async 用作异步下载执行用，不阻塞页面渲染
        // sync  用作异步下载，顺序执行，保证下载的js按照数组顺序执行
        var Loader = {
            async: function (list, callback) {

                ready(document, function () {
                    doInit(list, {}, callback);
                });
            },

            sync: function (list, callback) {

                ready(document, function () {
                    doInit(list, {
                        sync: true
                    }, callback);
                });
            }
        };

        window.Loader = Loader;

        return Loader;
    })(window, document);


    /***/
}),
/* 58 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* 2017-12-4 08:27:24 | 修改 木遥（QQ：346819890） */
    //widget模块公共处理类，勿轻易修改

    var widget = (function () {
        var cacheVersion;

        //============模块内部私有属性及方法============
        var defoptions;
        var widgetsdata = [];

        var basePath = "";//widgets目录统一前缀，如果widgets目录不在当前页面的同级目录，在其他处时可以传入basePath参数，参数值为：widgets目录相对于当前页面的路径

        var thismap;

        //初始化插件
        function init(map, widgetcfg, _basePath) {
            thismap = map;
            widgetcfg = widgetcfg || {};
            basePath = _basePath || "";

            widgetsdata = [];
            defoptions = widgetcfg.defaultOptions || { "windowOptions": { "position": "rt", "maxmin": false, "resize": true }, "autoDisable": true, "disableOhter": true };

            cacheVersion = widgetcfg.version;
            if (cacheVersion == "time")
                cacheVersion = new Date().getTime();


            //将自启动的加入
            var arrtemp = widgetcfg.widgetsAtStart;
            if (arrtemp && arrtemp.length > 0) {
                for (var i = 0; i < arrtemp.length; i++) {
                    var item = arrtemp[i];
                    if (!item.hasOwnProperty("uri") || item.uri == "") {
                        console.log('widget未配置uri：' + JSON.stringify(item));
                        continue;
                    }
                    if (item.hasOwnProperty("visible") && !item.visible) continue;

                    item.autoDisable = false;
                    item.openAtStart = true;
                    item._nodebug = true;

                    bindDefOptions(item);
                    widgetsdata.push(item);
                }
            }

            //显示测试栏
            //为了方便测试，所有widget会在页面下侧生成一排按钮，每个按钮对应一个widget，单击后激活对应widget
            var isdebuger = widgetcfg["debugger"];
            if (isdebuger) {
                var inhtml = '<div id="widget-testbar" class="widgetbar animation-slide-bottom no-print-view" > '
                        + '     <div style="height: 30px; line-height:30px;"><b style="color: #4db3ff;">widget测试栏</b>&nbsp;&nbsp;<button type="button" onclick="mars3d.widget.removeDebugeBar();" class="btn btn-link btn-xs">关闭</button> </div>'
                        + '     <button type="button" class="btn btn-info"  onclick="mars3d.widget.disableAll()" ><i class="fa fa-globe"></i>漫游</button>'
                        + '</div>';
                $("body").append(inhtml);
            }

            //将配置的加入
            arrtemp = widgetcfg.widgets;
            if (arrtemp && arrtemp.length > 0) {
                for (var i = 0; i < arrtemp.length; i++) {
                    var item = arrtemp[i];
                    if (item.type == "group") {
                        var inhtml = ' <div class="btn-group dropup">  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-align-justify"></i>' +
                            item.name + ' <span class="caret"></span></button> <ul class="dropdown-menu">';
                        for (var j = 0; j < item.children.length; j++) {
                            var childItem = item.children[j];
                            bindDefOptions(childItem);

                            inhtml += ' <li onclick="mars3d.widget.activate(\''
                                + childItem.uri + '\',' + (childItem.disableOhter ? false : true) + ')" ><a href="#"><i class="fa fa-star"></i>' + childItem.name + '</a></li>';

                            if (!childItem.hasOwnProperty("uri") || childItem.uri == "") {
                                console.log('widget未配置uri：' + JSON.stringify(childItem));
                                continue;
                            }
                            widgetsdata.push(childItem);//将配置的加入
                        }
                        inhtml += "</ul></div>";

                        if (isdebuger && !item._nodebug) {
                            $("#widget-testbar").append(inhtml);
                        }
                    }
                    else {
                        bindDefOptions(item);

                        //显示测试栏 
                        if (isdebuger && !item._nodebug) {
                            var inhtml = '   <button type="button" class="btn btn-primary" onclick="mars3d.widget.activate(\''
                                + item.uri + '\',' + (item.disableOhter ? false : true) + ')"  > <i class="fa fa-globe"></i>' + item.name + ' </button>';
                            $("#widget-testbar").append(inhtml);
                        }

                        if (!item.hasOwnProperty("uri") || item.uri == "") {
                            console.log('widget未配置uri：' + JSON.stringify(item));
                            continue;
                        }
                        widgetsdata.push(item);//将配置的加入
                    }
                }
            }

            //if (widgetsdata.length == 0) return;

            for (var i = 0; i < widgetsdata.length; i++) {
                var item = widgetsdata[i];

                if (item.openAtStart || item.createAtStart) {
                    _arrLoadWidget.push(item);
                }
            }

            $(window).resize(function () {
                for (var i = 0; i < widgetsdata.length; i++) {
                    var item = widgetsdata[i];
                    if (item._class) {
                        item._class.indexResize(); //BaseWidget: indexResize
                    }
                }
            });


            loadWidgetJs();
        }


        function getDefWindowOptions() {
            return clone(defoptions.windowOptions); //haoutil.system.clone
        }


        function clone(from, to) {
            if (from == null || typeof from != "object") return from;
            if (from.constructor != Object && from.constructor != Array) return from;
            if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
                from.constructor == String || from.constructor == Number || from.constructor == Boolean)
                return new from.constructor(from);

            to = to || new from.constructor();

            for (var name in from) {
                to[name] = typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
            }

            return to;
        }

        function bindDefOptions(item) {
            //赋默认值至options（跳过已存在设置值） 
            if (defoptions) {
                for (var aa in defoptions) {
                    if (aa == "windowOptions") {
                        //for (var jj in defoptions['windowOptions']) {
                        //    if (!item['windowOptions'].hasOwnProperty(jj)) {
                        //        item['windowOptions'][jj] = defoptions['windowOptions'][jj];
                        //    }
                        //}
                    }
                    else if (!item.hasOwnProperty(aa)) {
                        item[aa] = defoptions[aa];
                    }
                }
            }

            //赋值内部使用属性 
            item.path = getFilePath(basePath + item.uri);
            item.name = item.name || item.label; //兼容name和label命名
        }




        //激活指定模块
        function activate(item, noDisableOther) {
            if (thismap == null && item.viewer) {
                init(item.viewer);
            }

            //参数是字符串id或uri时
            if (typeof item === 'string') {
                item = { uri: item };

                if (noDisableOther != null)
                    item.disableOhter = !noDisableOther;  //是否释放其他已激活的插件 
            }

            var thisItem;
            for (var i = 0; i < widgetsdata.length; i++) {
                var othitem = widgetsdata[i];
                if (item.uri == othitem.uri || (othitem.id && item.uri == othitem.id)) {
                    thisItem = othitem;
                    //赋值
                    for (var aa in item) {
                        if (aa == "uri") continue;
                        thisItem[aa] = item[aa];
                    }
                    break;
                }
            }
            if (thisItem == null) {
                bindDefOptions(item);
                thisItem = item;
                //非config中配置的，外部传入，首次激活
                widgetsdata.push(item);
            }

            //释放其他已激活的插件 
            if (thisItem.disableOhter) {
                if (thisItem.reStart)
                    disableAll();
                else
                    disableAll(thisItem.uri);
            }

            //激活本插件
            if (thisItem._class) {
                thisItem._class.activateBase(); // BaseWidget: activateBase
            }
            else {
                for (var i = 0; i < _arrLoadWidget.length; i++) {
                    if (_arrLoadWidget[i].uri == thisItem.uri)
                        return _arrLoadWidget[i];
                }
                _arrLoadWidget.push(thisItem);

                if (_arrLoadWidget.length == 1) {
                    loadWidgetJs();
                }
            }

            return thisItem;
        }

        function getWidget(id) {
            for (var i = 0; i < widgetsdata.length; i++) {
                var item = widgetsdata[i];

                if (id == item.uri || id == item.id) {
                    return item;
                }
            }
        }
        function getClass(id) {
            var item = getWidget(id);
            if (item)
                return item._class;
            else
                return null;
        }



        function isActivate(id) {
            var _class = getClass(id);
            if (_class == null) return false;
            return _class.isActivate;
        }

        function disable(id) {
            if (id == null) return;
            for (var i = 0; i < widgetsdata.length; i++) {
                var item = widgetsdata[i];

                if (item._class && (id == item.uri || id == item.id)) {
                    item._class.disableBase();
                    break;
                }
            }
        }
        //释放所有widget
        function disableAll(nodisable) {

            for (var i = 0; i < widgetsdata.length; i++) {
                var item = widgetsdata[i];
                if (!item.autoDisable) continue;
                //指定不释放的跳过
                if (nodisable && (nodisable == item.uri || nodisable == item.id)) continue;

                if (item._class) {
                    item._class.disableBase();////BaseWidget: disableBase
                }
            }
        }

        function eachWidget(calback) {
            for (var i = 0; i < widgetsdata.length; i++) {
                var item = widgetsdata[i];
                calback(item);
            }
        }

        var _arrLoadWidget = [];
        var loadItem;
        var isloading;
        function loadWidgetJs() {
            if (_arrLoadWidget.length == 0) return;

            if (isloading) {
                setTimeout(loadWidgetJs, 500);
                return;
            }
            isloading = true;


            loadItem = _arrLoadWidget[0];
            var _uri = loadItem.uri;
            if (cacheVersion) {
                if (_uri.indexOf('?') == -1)
                    _uri += "?time=" + cacheVersion;
                else
                    _uri += "&time=" + cacheVersion;
            }

            if (window.NProgress) {
                NProgress.start();
            }

            Loader.async([basePath + _uri], function () {
                isloading = false;
                if (window.NProgress) {
                    NProgress.done(true);
                }

                _arrLoadWidget.shift();
                loadWidgetJs();
            });
        }


        function bindClass(_class) {
            if (loadItem == null) {
                var _jspath = getThisJSPath();
                for (var i = 0; i < widgetsdata.length; i++) {
                    var item = widgetsdata[i];
                    if (_jspath.endsWith(item.uri)) {
                        item._class = new _class(item, thismap);
                        item._class.activateBase();// BaseWidget: activateBase
                        return item._class;
                    }
                }
            }
            else {
                loadItem._class = new _class(loadItem, thismap);
                loadItem._class.activateBase();// BaseWidget: activateBase
                return loadItem._class;
            }
        }
        function getThisJSPath() {
            var jsPath;
            var js = document.scripts;
            for (var i = js.length - 1; i >= 0; i--) {
                jsPath = js[i].src;
                if (jsPath == null || jsPath == "") continue;
                if (jsPath.indexOf("widgets") == -1) continue;
                //jsPath = jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
                return jsPath;
            }
            return "";
        }

        //获取路径
        function getFilePath(file) {
            var pos = file.lastIndexOf("/");
            return file.substring(0, pos + 1);
        }


        //function evalFun(funname, param) {
        //    if (param == null)
        //        return eval(funname + '()');
        //    else
        //        return eval(funname + '(' + JSON.stringify(param) + ')');
        //}


        function removeDebugeBar() {
            $("#widget-testbar").remove();
        }

        function getCacheVersion() {
            return cacheVersion;
        }
        function getBasePath() {
            return basePath;
        }


        //===========模块对外公开的属性及方法=========
        return {
            init: init,
            isActivate: isActivate,
            activate: activate,
            disable: disable,
            disableAll: disableAll,
            eachWidget: eachWidget,
            getWidget: getWidget,
            getClass: getClass,
            removeDebugeBar: removeDebugeBar,
            bindClass: bindClass,
            getDefWindowOptions: getDefWindowOptions,
            getCacheVersion: getCacheVersion,
            getBasePath: getBasePath,
        };
    })();


    /* harmony default export */ __webpack_exports__["default"] = (widget);

    /***/
}),
/* 59 */
/***/ (function (module, exports, __webpack_require__) {

    module.exports = __webpack_require__(23);


    /***/
})
]);