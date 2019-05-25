/* 2017-9-28 16:04:24 | 修改 木遥（QQ：346819890） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 500,
                height: 200
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow:null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result; 
    },
    data:null,
    //打开激活
    activate: function () { 
        this.data = this.config.data;
        this.viewWindow.setEchartsData(this.data);
    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;


    },
    showData: function (data) { 
        this.data = data;
        this.viewWindow.setEchartsData(this.data);
    },
 
 


}));

