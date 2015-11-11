define(function(require, exports){
    function getBBs(){
        $.ajax({
            url: '/modules/bbs?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{},
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    if(result.ReturnObject.length <= 0){
                        $("#js_bbs").html('<div class="block-no-ld">暂无话题</div>');
                        return;
                    }
                    for( var i = 0; i < result.ReturnObject.length; i++){
                        var _item = result.ReturnObject[i];
                        listHtml += '<li><a href="'+ _item.url +'">'+ _item.name +'</a></li>';
                    }
                    $('#js_bbs').html(listHtml);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    getBBs();
});