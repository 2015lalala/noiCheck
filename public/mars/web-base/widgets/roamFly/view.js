﻿var thisFlyWidget;

//当前页面业务
function initFlyWidgetView(_thisWidget) {
    thisFlyWidget = _thisWidget;

    if (thisFlyWidget.config && thisFlyWidget.config.style) {//适应不同样式
        $("body").addClass(thisFlyWidget.config.style);
    }



    $("#btnFlyStop").click(function (event) {
        thisFlyWidget.toRoamLine();
    });

    $("#btnSelChars").click(function (event) {
        thisFlyWidget.showHeightChars();
    });

    var attr = thisFlyWidget.getAttr();
    $('#cameraType').attr('data-value', attr.cameraType);
    $("#followedX").val(attr.followedX);
    $("#followedZ").val(attr.followedZ);

    //改变视角模式
    $('#cameraType').select();   //绑定样式
    $('#cameraType').change(function () {
        $("#tr_followedX").hide();
        $("#tr_followedZ").hide();

        var attrVal = $(this).attr('data-value');
        switch (attrVal) {
            case "dy"://锁定第一视角
                $("#tr_followedX").show();
                $("#tr_followedZ").show();

                $("#followedX").val(200);
                $("#followedZ").val(50);
                 
                break;
            case "sd"://锁定上帝视角   
                $("#tr_followedZ").show();

                var followedZ = Number($("#followedZ").val());
                if (followedZ < 500)
                    $("#followedZ").val(500);
                break;
        }
        updateCameraSetting();
    });
    $('#cameraType').change();

    //第一视角
    $("#followedX").change(function () {
        updateCameraSetting();
    });
    $("#followedZ").change(function () {
        updateCameraSetting();
    });

}

//改变视角模式
function updateCameraSetting() {
    var cameraType = $("#cameraType").attr('data-value');
    var followedX = Number($("#followedX").val());
    var followedZ = Number($("#followedZ").val());

    thisFlyWidget.updateAttr({
        cameraType: cameraType,
        followedX: followedX,
        followedZ: followedZ
    });
}

//显示基本信息，名称、总长、总时间
var _alltime = 100;
function showAllInfo(params) {
    _alltime = params.alltime;

    $("#td_name").html(params.name);
    $("#td_alltimes").html(haoutil.str.formatTime(params.alltime));
    $("#td_alllength").html(haoutil.str.formatLength(params.alllen));
}

//显示实时坐标和时间
function showRealTimeInfo(params) {
    var val = Math.ceil(params.time * 100 / _alltime);
    $(".progress-bar").css("width", val + '%').attr('aria-valuenow', val).html(val + '%');

    $("#td_jd").html(params.x);
    $("#td_wd").html(params.y);
    $("#td_gd").html(haoutil.str.formatLength(params.z));

    $("#td_times").html(haoutil.str.formatTime(params.time));
    $("#td_length").html(haoutil.str.formatLength(params.len));
}

//显示当前海拔高程信息
function showHeightInfo(params) {
    if (params) {
        $("#td_dmhb").html(params.hbgd_str);
        if (params.showHeightWarn) {
            $("#tr_ldgd").show();
            var inhtml = params.ldgd_str;
            if (params.hasWarn) {
                inhtml += "&nbsp;<label style='color:red;'>低于报警高度</label>";
            }
            $("#td_ldgd").html(inhtml);
        }
        else {
            $("#tr_ldgd").hide();
        };
    }
    else {
        $("#td_dmhb").html('未知');
        $("#td_ldgd").html('未知');
    }
}












//下拉框
(function ($) {
    //下拉菜单默认参数
    var defaluts = {
        select: "mp_select",
        select_text: "mp_select_text",
        select_ul: "mp_select_ul"
    };

    $.fn.extend({
        // 下拉菜单
        // 下拉菜单
        "select": function (options) {
            var opts = $.extend({}, defaluts, options);
            return this.each(function () {
                var that = $(this);
                //模拟下拉列表
                if (that.data("value") !== undefined && that.data("value") !== '') {
                    that.val(that.data("value"));
                }
                var _html = [];
                _html.push("<div class=\"" + that.attr('class') + "\">");
                _html.push("<div class=\"" + opts.select_text + "\">" + that.find(":selected").text() + "</div>");
                _html.push("<ul class=\"" + opts.select_ul + "\">");
                that.children("option").each(function () {
                    var option = $(this);
                    if (that.data("value") == option.val()) {
                        _html.push("<li data-value=\"" + option.val() + "\">" + option.text() + "</li>");
                    } else {
                        _html.push("<li data-value=\"" + option.val() + "\">" + option.text() + "</li>");
                    }
                });
                _html.push("</ul>");
                _html.push("</div>");
                var select = $(_html.join(""));
                var select_text = select.find("." + opts.select_text);
                var select_ul = select.find("." + opts.select_ul);
                that.after(select);
                that.hide();

                that.change(function () {
                    var val = that.attr("data-value");
                    that.children("option").each(function () {
                        var option = $(this);
                        if (val == option.val()) {
                            select_text.text(option.text());
                        }
                    });
                });

                //下拉列表操作
                select.click(function (event) {
                    $(this).toggleClass('mp_selected');
                    $(this).find("." + opts.select_ul).slideToggle().end().siblings("div." + opts.select).find("." + opts.select_ul).slideUp();
                    event.stopPropagation();
                });
                $("body").click(function () {
                    select_ul.slideUp();
                });
                select_ul.on("click", "li", function () {
                    var li = $(this);
                    var val = li.addClass("selecton").siblings("li").removeClass("selecton").end().data("value").toString();
                    if (val !== that.attr("data-value")) {
                        select_text.text(li.text());
                        that.attr("data-value", val);
                        that.change();
                    }
                });
            });
        },

    });
})(jQuery);

