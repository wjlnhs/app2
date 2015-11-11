define(function(require, exports){
    var pubjs = require('/default/javascripts/modules/public.js');
    function getMembers(){
        $.ajax({
            url: '/modules/members?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{},
            success: function(result){
                if(result.Result){
                    var countNum = result.ReturnObject.length;
                    var datas = result.ReturnObject;
                    if(countNum <= 0){
                        //$("#members").remove();
                        return;
                    }
                    showPageCont.size = 0;
                    if(countNum > 2){
                        $("#js_members_page").show();
                        var prevBtn = $("#js_members_prev");
                        var nextBtn = $("#js_members_next")
                        //上一页
                        prevBtn.click(function(){
                            if(prevBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size - 2;
                            nextBtn.removeClass('disabled');
                            if(showPageCont.size <= 0){
                                prevBtn.addClass('disabled');
                            }else{
                                prevBtn.removeClass('disabled');
                            }
                            showPageCont(datas);
                        });
                        //下一页
                        nextBtn.click(function(){
                            if(nextBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size + 2;
                            prevBtn.removeClass('disabled');
                            if(showPageCont.size < countNum - 2){
                                nextBtn.removeClass('disabled');
                            }else{
                                nextBtn.addClass('disabled');
                            }
                            showPageCont(datas);
                        });
                    }
                    showPageCont(datas);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getInfohtml(item){
        var rtHtml = '';
        if(item.BirthLocation !=""){
            rtHtml += '<p><i class="spbg1 sprite-55"><b></b></i> 籍贯 '+ item.BirthLocation +'</p>';
        }
        if(item.Birthday){
            rtHtml += '<p><i class="spbg1 sprite-56"><b></b></i> 星座 '+ pubjs.getXingZuo(item.Birthday) +'</p>';
        }
        if(item.Labels.length > 0){
            rtHtml += '<p><i class="spbg1 sprite-57"></i> 爱好 '+ item.Labels.join('、') +'</p>';
        }
        if(rtHtml == ""){
            rtHtml = '这个人很懒~<a>邀请TA尽快完善吧！</a>'
        }
        return  rtHtml;
    }
    function getTimestring(timestr){
        var newstr = timestr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        if(newstr){
            return newstr[0].replace("-","年").replace("-","月") + "日";
        }
    }
    function getBirthday(timestr){
        if(timestr){
            var newstr = timestr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
            return newstr[0].replace("-","年").replace("-","月") + "日";
        }else{
            return '暂缺';
        }
    };
    function showPageCont(datas){
        var mdHtml = $('#js-members-tpl').html();
        var listHtml = '';
        for( var i = showPageCont.size; i < showPageCont.size + 2; i++){
            var _item = datas[i];
            if(_item){
                listHtml += mdHtml.replace('{name}', _item.Name)
                    .replace('{headimg}', _item.HeadImage)
                    .replace('{datetime}', getTimestring(_item.CreateTime))
                    .replace('{birthday}',getBirthday(_item.Birthday))
                    .replace('{perinfo}',getInfohtml(_item));
            }
        }
        $('#js-members-list').html(listHtml);
    }
    getMembers();
});