define(function(require, exports){
    var i8ui = require('/default/javascripts/common/i8ui');
    var pubjs = require('/default/javascripts/modules/public.js');
    //获取生日列表
    function getBirthdayList(){
        $.ajax({
            url: '/modules/birthday?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{fn:'getlist',topn:10},
            success: function(result){
                if(result.Result){
                    var countNum = result.ReturnObject.length;
                    var datas = result.ReturnObject;
                    if(countNum <= 0){
                        $("#js_members_block").remove();
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
    function getBirthdayDate(birthday){
        if(birthday){
            var dtime = new Date(birthday);
            var month = dtime.getMonth() + 1;
            var day = dtime.getDate();
            return (month < 10 ? "0" + month : month) + '.' + (day < 10 ? '0' + day : day);
        }else{
            return '';
        }
    }
    function showPageCont(datas){
        var mdHtml = $('#js_birthday_tpl').html();
        var listHtml = '';
        for( var i = showPageCont.size; i < showPageCont.size + 2; i++){
            var _item = datas[i];
            if(_item){
                listHtml += mdHtml.replace('{name}', _item.Name)
                    .replace('{headimg}', _item.HeadImage)
                    .replace(/{birthday}/g, getBirthdayDate(_item.Birthday))
                    .replace('{imgs}',getZhufuimgs(_item.Pleasure))
                    .replace('{xingzuo}',pubjs.getXingZuo(_item.Birthday));
            }
        }
        $('#js_birthdays').html(listHtml);
    }
    //生日快乐
    $("#js_birthdays").on("click","span.zhu-fu",function(){
        $(this).nextAll('div.rt-birthday-persons').prepend('<img src="'+ cpec_session.uimage30 +'">').show();
    });
    //赠送礼物
    $("#js_birthdays").on("click","span.send-gift",function(){
        var gifBox = i8ui.showbox({
            title:'送TA礼物',
            noMask: true,
            cont: '<div style="width: 550px; height: 250px; padding: 10px;">赠送礼物的侃侃发布框</div>'
        });
        var giftDom = $(gifBox);
        giftDom.css({top: $(this).offset().top, left: $(this).offset().left - 580});
    });
    function getZhufuimgs(imgs){
        var classhide = 'hide';
        if(imgs && imgs.length > 0){
            classhide = '';
        }
        var imghtml = '<div class="rt-birthday-persons '+ classhide +'"><span class="rt-linj">◆<span>◆</span></span>';
        for(var i=0; i< imgs.length; i++){
            imghtml += '<img src="'+ imgs[i] +'">';
        }
        imghtml += '</div>';
        return imghtml;
    }
    getBirthdayList();
});