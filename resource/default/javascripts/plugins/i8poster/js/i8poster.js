define(function(require,exports){
    var util=require('../../../common/util');
    var postMain=function(_setting){
       var setting= $.extend({
           container:"#",
            header:{kankan:true,schedule:true,daily:true},
            kkConfig:{attachment:true,gift:false,face:true,topic:true,scope:true,kid:"ksn",kkplaceholder:"侃侃生活点滴..."},
            postBefore:function(){},
            postCompleted:function(){},
            postfailed:function(){}
        },_setting);
        var posterContainer= $(setting.container);
        var kankanSelectorCache=[];
        //初始化kankan Tab控件页
        var TabContent="";
        if(setting.header.kankan){
            var kankanHTML=tplRenderData.kankan(setting);
            TabContent+=kankanHTML;
        }
        if(setting.header.schedule){
            var scheduleHTML=tplRenderData.schedule(setting);
            TabContent+=scheduleHTML;
        }
        if(setting.header.daily){
            var dailyHTML=tplRenderData.daily(setting);
            TabContent+=dailyHTML;
        }
        setting['tabcontent']=TabContent;
        var frameHTML=tplRenderData.framebox(setting);
        //事件绑定
        var postEventBind=function(){
            $('.schedule-cycle .app-radio',posterContainer).click(function(){ $('.schedule-cycle .app-radio',posterContainer).removeClass('checked'); $(this).addClass('checked'); });
            $('.weekordaily .app-radio',posterContainer).click(function(){ $('.weekordaily .app-radio',posterContainer).removeClass('checked'); $(this).addClass('checked');});
            $('.kk-btn',posterContainer).click(function(){ $('.schedule-tab, .weekofdaily-tab',posterContainer).hide(); $('.kk-tab',posterContainer).show(); });
            $('.schedule-btn',posterContainer).click(function(){ $('.kk-tab, .weekofdaily-tab',posterContainer).hide(); $('.schedule-tab',posterContainer).show(); })
            $('.weekofdaily-btn',posterContainer).click(function(){ $('.schedule-tab, .kk-tab',posterContainer).hide(); $('.weekofdaily-tab',posterContainer).show(); });
            //全局app-checkbox
            $('.app-checkbox',posterContainer).click(function(){ $(this).toggleClass('checked');})
            if(setting.header.kankan){//侃侃相关事件
                var selector=require('../../i8selector/fw_selector');
                var kankanBox=$(".kk-content-text",posterContainer);
                selector.KSNSelector({ model: 0, element: "#"+kankanBox.attr("id"), selectCallback: function (uid, uname, uemail) {
                    kankanSelectorCache.push({ 'uid': uid, 'uname': '@' + uname });
                }
                });
                //发布范围
                $("ul.release-scope-group li",posterContainer).click(function(){
                    if($(this).hasClass("enterprise-community-btn")){
                        $(".scope-txt-title",posterContainer).text("企业社区");
                        $(".release-scope-title",posterContainer).removeClass("only-visible-btn-t");
                        $(".release-scope",posterContainer).attr("scope-value","1");
                    }else if($(this).hasClass("only-visible-btn")){
                        $(".scope-txt-title",posterContainer).text("仅@可见");
                        $(".release-scope-title",posterContainer).addClass("only-visible-btn-t");
                        $(".release-scope",posterContainer).attr("scope-value","2");
                    }else if($(this).hasClass("new-group-btn")){
                        window.open("#","_self");
                    }
                })
                $('.release-scope-title',posterContainer).click(function(){
                    $('.release-scope-group',posterContainer).slideToggle(200);
                    return false;
                });
                $(document).click(function(){
                    $('.release-scope-group',posterContainer).slideUp(200);
                });
                $('.kk-body .attachment-btn',posterContainer).hover(function(){
                    $('.kk-tab .attachment-tip',posterContainer).show();
                },function(){
                    $('.kk-tab .attachment-tip',posterContainer).hide();
                });
                //侃侃发布
                $(".kk-sub",posterContainer).click(function(){
                    var kankanContent= $.trim($(".kk-content-text",posterContainer).val()).replace(/<[^>]+>/g,"");
                    if(kankanContent.length==0){
                        emptyWarn($(".kk-content-text",posterContainer));
                        return;
                    }
                    var scope=$(".release-scope",posterContainer).attr("scope-value");
                    if(scope=="scope-null"){
                        boxHoverWarn($(".tab-content",posterContainer),"发布范围未选择!");
                        return;
                    }
                    if(setting.postBefore){
                        setting.postBefore();
                    }
                    $(this).addClass("post-btn-disabled").text("发布中...");
                    $.post('/webajax/kkcom/postblog',{scopeType:scope,kankanContent:kankanContent},function(response){
                        $(".kk-sub",posterContainer).removeClass("post-btn-disabled").text("发布");
                        if(response.Result){
                            if(setting.postCompleted){
                                setting.postCompleted(response.ReturnObject);
                            }
                            alert('发布成功！');
                        }else{
                            alert('发布失败!');
                        }
                    },"json")
                })
            }

        };
        return new function(){
            this.init=function(){
                posterContainer.html(frameHTML);
                //事件绑定
                postEventBind();
            };

        };
    };
    var emptyWarn= function (txtobj) {
        var colors = ["rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)"];
        var colorAnimate = function (cls) {
            var clrTimer = null;
            if (cls.length > 0) {
                clrTimer = setTimeout(function () {
                    txtobj.css({ "background-color": cls.shift() });
                    colorAnimate(cls);
                }, 100);
            } else {
                clearTimeout(clrTimer);
            }
        }
        colorAnimate(colors);
    };
    var boxHoverWarn=function (box, txt) {
        var stopPost = $('<div class="warnMsg"><span style="color:rgb(255,167,167)">' + txt + '</span></div>');
        box.append(stopPost);
        var tt=setTimeout(function () {
            stopPost.slideUp(100,function(){
                $(this).remove();
                clearTimeout(tt);
            })
        }, 1500);
    }
    var tplRenderData={
        "framebox":function(data){
            var paramData=data||{};
            var tpl=require('../template/frameBox.tpl');
            var frame_render=template(tpl);
            return frame_render(paramData);
        },
        "kankan":function(data){
            var paramData=data||{};
            var tpl=require('../template/kankan.tpl');
            var kankan_render=template(tpl);
            return kankan_render(paramData);
        },
        "schedule":function(data){
            var paramData=data||{};
            var tpl=require('../template/schedule.tpl');
            var schedule_render=template(tpl);
            return schedule_render(paramData);
        },
        "daily":function(data){
            var paramData=data||{};
            var tpl=require('../template/daily.tpl');
            var daily_render=template(tpl);
            return daily_render(paramData);
        }
    };
    return postMain;
})