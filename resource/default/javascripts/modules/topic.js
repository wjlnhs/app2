define(function(require,exports){
    function getHotTopic(){
        $.ajax({
            url: '/modules/topic?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{},
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    if(result.ReturnObject.length <= 0){
                        $("#js_topic").html('<div class="block-no-ld">暂无话题</div>');
                        return;
                    }
                    for( var i = 0; i < result.ReturnObject.length; i++){
                        var _item = result.ReturnObject[i];
                        listHtml += '<li><a>#'+ _item.name +'#</a></li>';
                    }
                    $('#js_topic').html(listHtml);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    getHotTopic();
});