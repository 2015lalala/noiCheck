// var measureControl;
var thisType = "";
var viewer;
var measureControl;
//当前页面业务
function initWidgetView(viewer) {
    viewer=viewer;
    measureControl = new mars3d.Measure({
        viewer:viewer
    })
    if (measureControl.config && measureControl.config.style) {
        $("body").addClass(measureControl.config.style);
    }

    $("#measure_area_danwei").val("auto"); //默认值
    $("#measure_length_danwei").val("auto"); //默认值


    $('#btn_measure_length').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisType = "length";
        lastVal = 0;
        measureControl.measuerLength({
            unit: $('#measure_length_danwei').val(),
            terrain: false,
            // addHeight: 3,  //在绘制点基础自动增加高度（单位：米）
            calback: showResult
        });
    });


    $('#btn_measure_length_td').bind('click', function () {
        //用户首次使用时，提醒一次
        haoutil.oneMsg('贴地需要地形服务支撑，部分区域可能无法贴地！', 'measure_length_tip');
         

        $("#lbl_measure_result").html("");
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisType = "length";
        lastVal = 0;
        measureControl.measuerLength({
            unit: $('#measure_length_danwei').val(),
            terrain: true,
            calback: showResult
        });
    });

    $('#btn_measure_area').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_length_danwei').hide();
        $('#measure_area_danwei').show();

        thisType = "area";
        lastVal = 0;
        measureControl.measureArea({
            unit: $('#measure_area_danwei').val(),
            calback: showResult
        });
    });

    $('#btn_measure_section').bind('click', function () {
        //用户首次使用时，提醒一次
        haoutil.oneMsg('剖面需要地形服务支撑，部分区域可能无法获取高程值！', 'measure_section_tip');
 
        $("#lbl_measure_result").html("");
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisType = "section";
        lastVal = 0;
        measureControl.measureSection({
            unit: $('#measure_length_danwei').val(),
            calback: showSectionResult
        });
    });


    $('#btn_measure_height').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisType = "height";
        lastVal = 0;
        measureControl.measureHeight({
            unit: $('#measure_length_danwei').val(),
            isSuper: false,
            calback: showResult
        });
    });

    $('#btn_measure_supHeight').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisType = "super_height";
        lastVal = 0;
        measureControl.measureHeight({
            unit: $('#measure_length_danwei').val(),
            isSuper: true,
            calback: showResult
        });
    });

    $('#btn_measure_clear').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisType = "";
        lastVal = 0;
        measureControl.clearMeasure();
    });

    //更换单位
    $("#measure_length_danwei").change(function (e) {
        var danwei = $('#measure_length_danwei').val();
        measureControl.updateUnit(thisType, danwei);

        if (lastVal > 0) {
            var valstr = measureControl.formatLength(lastVal, danwei);
            showResult(valstr);
        }
    });
    $("#measure_area_danwei").change(function (e) {
        var danwei = $('#measure_area_danwei').val();
        measureControl.updateUnit(thisType, danwei);

        if (lastVal > 0) {
            var valstr = measureControl.formatArea(lastVal, danwei);
            showResult(valstr);
        }
    });
}

var lastVal = 0;

//从父页面调用
function showResult(valstr, val) {
    if (val)
        lastVal = val;
    $("#lbl_measure_result").html(valstr);
}


function showSectionResult(param, val) {
    if (haoutil.isutil.isString(param)) {
        showResult(param, val);
        return;
    }
    showResult(param.distancestr, param.distance);
    measureControl.showSectionChars(param);
}