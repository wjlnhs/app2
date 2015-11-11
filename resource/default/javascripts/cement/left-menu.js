define(function(require){
    var i8ui = require('/default/javascripts/common/i8ui');
    $("#js_cement_ltmenu").on("click",".nav-a1",function(){
        var sbox = i8ui.showbox({title: '添加分类',cont: $("#js_cement_addtype").html()});
        //确定事件
        $(sbox).on("click",".btn-blue96x32",function(){
            var typename = $.trim($(sbox).find("input").val());
            if(typename == ""){
                i8ui.error("请输入分类名称！");
                return;
            }
            if(typename.length > 50){
                i8ui.error("分类名称太长，不能超过50字符！");
                return;
            }
            addType(typename,function(){
                sbox.close();
            });
        });
        //取消事件
        $(sbox).on("click",".btn-gray96x32",function(){
            sbox.close();
        });
    });
    function addType(name,cbk){
        $.ajax({
            url: '/cement/add-type',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{name: name},
            success: function(result){
                if(result.Result){
                    i8ui.write("更新成功");
                    if(cbk){
                        cbk();
                    }
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
});