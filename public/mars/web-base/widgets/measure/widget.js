/* 2017-11-30 16:56:24 | 修改 木遥（QQ：346819890） */
//模块：
// mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
//     options: {
//         //弹窗
//         view: {
//             type: "window",
//             url: "view.html",
//             windowOptions: {
//                 width: 320,
//                 height: 180
//             }
//         },
//     },

   var widget={};
    // measureControl: null,
    //初始化[仅执行1次]
    widget.initViewer= function (viewer) {
        this.measureControl = new mars3d.Measure({
            viewer:viewer
        })
    },
    //viewWindow: null,
    ////每个窗口创建完成后调用
    //winCreateOK= function (opt, result) {
    //    this.viewWindow = result;
    //},
    //激活插件
    widget.activate= function () {
        this.viewWindow = null;

    },
    //释放插件
    widget.isable= function () {
        this.clearDraw();
    },
    widget.drawPolyline= function (options) {
        this.measureControl.measuerLength(options);
    },
    widget.drawPolygon= function (options) {
        this.measureControl.measureArea(options);
    },
    widget.drawHeight= function (options) {
        this.measureControl.measureHeight(options);
    },
    widget.drawSection= function (options) {
        this.measureControl.measureSection(options);
    }, 
    widget.updateUnit= function (thisType, danwei) {
        this.measureControl.updateUnit(thisType, danwei);
    },
    widget.clearDraw= function () {
        this.measureControl.clearMeasure();
        mars3d.widget.disable(this.jkWidgetUri);
    },
    widget.formatArea= function (val, unit) {
        return this.measureControl.formatArea(val, unit);
    },
    widget.formatLength= function (val, unit) {
        return this.measureControl.formatLength(val, unit);
    },


    widget.jkWidgetUri= 'widgets/sectionChars/widget.js',
    widget.showSectionChars= function (data) {
        var roamingJK = mars3d.widget.getClass(this.jkWidgetUri); 
        if (roamingJK && roamingJK.isActivate) { 
            roamingJK.showData(data);
        }
        else {
            mars3d.widget.activate({
                uri: this.jkWidgetUri,
                data: data
            });
        }
    }
   function inintViewer(viewer){
        widget.initViewer(viewer);
        initWidgetView(widget);
    }