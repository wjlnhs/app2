/**
 * Created by jialin on 2014/12/15.
 */
define(function (require, exports) {
    var of=require('/default/javascripts/common/fw_form.js');
    var i8ui = require('/default/javascripts/common/i8ui');
    var fw_overification=of.fw_overification;
    var init = false;
    var ret_cur_AccountName = "";
    var globalPersonInfo;

    function SaveBaseInfoChange() {
        if (txt.result()) {
            var user_birth = $("#birthday").val();
            if (user_birth.length >= 0) {
                if (parseInt((user_birth.toDate() - new Date()) / (1000 * 60 * 60 * 24)) >= 0) {
                    i8ui.simpleAlert("生日必须小于当前日期");
                    return false;
                }
            }
            if ($.trim($("#personalEmailtxt").val()) == "") {
                i8ui.simpleAlert("邮箱为必填项!");
                $("#personalEmailtxt").focus();
                return false;
            }
            var subData={
                "Name": $.trim($("#username").val()),
                "EnName": $.trim($("#englishName").val()),
                //"OrgID": "",
                "Position": $.trim($("#position").val()),
                "Tel": $.trim($("#telephone").val()),
                "MPhone": $.trim($("#mobile").val()),
                "Email": $.trim($("#personalEmailtxt").val()),
                "QQ": $.trim($("#qq").val()),
                "Birthday": $.trim($("#birthday").val()),
                "BirthLocation": $.trim($(".birthlocation").attr('lev2code')),
                "Comment": $.trim($("#introduce").val()),
                "BirthLocationTxT":$(".birthlocation .citylev1").val() + "-" + $(".birthlocation .citylev2").val(),
                "Gender": $('#male').prev().hasClass('checked') ? true : false
            };
            //if($("#Orgunable").length<0){
                subData.OrgName=$("#department").val();
            //}
            $('.personaldata').html(LoadBaseInfoShow(subData));
            txt.matching({ obj: $("#username,#qq,#mobile,#telephone,#personalEmailtxt,#englishName,#jsCompany,#position,#introduce") });
            $('.personaldata>.cate-body').show();
            $('.personaldata .b-blue-sty1').hide();
            $('.personaldata .preview').show();
            $.ajax({
                url: "/settings/UpdateInfo?" + Math.random(),
                type: "post",
                dataType: "json",
                data: {subData:subData},
                success: function (data, textStatus) {
                    if (data.Result) {
                        i8ui.simpleAlert("保存成功");
                        init = false;
                        LoadBaseInfoShow();
                        $("#js_info").show();
                        $("#js_edit_info").show();
                        $("#content_1_1").hide();
                    }
                    else {
                        i8ui.simpleAlert(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.simpleAlert(data.Description);
                }
            });
        }
        return false;
    }

    function LoadBaseInfoShow(data){
        var personalInfoTemp=require('./template/personalInfo.tpl');
        var render=template.compile(personalInfoTemp);
        data.on= $.trim($("#department").val());
        var uu=render(data)
        return uu;
    }

    var txt = fw_overification.createNew();
//不需要回调的数据验证，可传递多个对象
    txt.matching({ obj: $("#username,#qq,#mobile,#telephone,#personalEmailtxt,#englishName,#jsCompany,#position,#introduce") });
    $("#js_edit_info").click(function () {
        $(this).hide();
        $("#js_info").hide();
        $("#content_1_1").show();
    });
    $("#js_mc_cancel_edit").click(function () {
        $("#js_info").show();
        $("#content_1_1").hide();
        $("#js_edit_info").show();
    });

    $('.personaldata').delegate('.confirm','click',function(){
        SaveBaseInfoChange();
    })

})