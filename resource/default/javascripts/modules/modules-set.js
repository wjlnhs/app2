define(function(require){
    var i8ui = require('/default/javascripts/common/i8ui');
    var mdSet = cpec_session.portal;
    function ladingclick(){
        var contDom = $("#js_block_set");
        $("div.app-rt").on('mouseover','div.rt-block',function(){
            var blockDoms = $("div.app-rt").find("div.rt-block");
            var thisDom = $(this);
            if(blockDoms.index(thisDom) == 0){
                $("#js_block_setcont").find("span").removeClass("ban");
                $("#js_block_setcont").find('span.set-first,span.set-up').addClass("ban");
            }else if(blockDoms.index(thisDom) == (blockDoms.length - 1)){
                $("#js_block_setcont").find("span").removeClass("ban");
                $("#js_block_setcont").find('span.set-last,span.set-down').addClass("ban");
            }else{
                $("#js_block_setcont").find("span").removeClass("ban");
            }
            contDom.css({left: thisDom.offset().left + 251, top: thisDom.offset().top})
                   .attr("showid",$(this).attr("id"))
                   .show();
            $("#js_block_setcont").find("div.block-set-cont").hide();
        });
        $("div.app-rt").on('mouseout','div.rt-block',function(){
            contDom.hide();
            $("#js_block_setcont").find("div.block-set-cont").hide();
        });
        $("#js_block_set").mouseover(function(){
            $("#js_block_set").show();
        });
        $("#js_block_set").mouseout(function(){
            $("#js_block_set").hide();
        });
        $("#js_block_setcont").on('click','.set-show',function(){
            if(mdSet){
                $("#js_block_setcont").find('div.block-set-op').each(function(){
                    var tname = $(this).attr("name");
                    if(mdSet.indexOf(tname)>=0){
                        $(this).removeClass("close");
                    }
                });
            }else{
                $("#js_block_setcont").find('div.block-set-op').removeClass("close");
            }
            $("#js_block_setcont").find("div.block-set-cont").show();
        });
        //上移
        $("#js_block_setcont").on('click','span.set-up',function(){
            if($(this).attr("class").indexOf("dbd") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var prevDom = thisDom.prev();
            var newDom = thisDom.clone(true);
            thisDom.remove();
            prevDom.before(newDom);
            $("#js_block_set").hide();
            updatePortal();
        });
        //下移
        $("#js_block_setcont").on('click','span.set-down',function(){
            if($(this).attr("class").indexOf("dbd") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var nextDom = thisDom.next();
            var newDom = thisDom.clone(true);
            thisDom.remove();
            nextDom.after(newDom);
            $("#js_block_set").hide();
            updatePortal();
        });
        //移动到最上面
        $("#js_block_setcont").on('click','span.set-first',function(){
            if($(this).attr("class").indexOf("dbd") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            thisDom.remove();
            $("div.app-rt").prepend(newDom);
            $("#js_block_set").hide();
            updatePortal();
        });
        //最下移
        $("#js_block_setcont").on('click','span.set-last',function(){
            if($(this).attr("class").indexOf("dbd") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            thisDom.remove();
            $("div.app-rt").append(newDom);
            $("#js_block_set").hide();
            updatePortal();
        });
        //打开或关闭
        $("#js_block_setcont").on('click','.block-set-op',function(){
            console.log(setForm());
            if(setForm() >=5){
                i8ui.error("最少必须保留一个组件！");
                return;
            }
            var this$ = $(this);
            if(this$.attr("class").indexOf("close") >=0 ){
                this$.removeClass("close");
            }else{
                this$.addClass("close");
            }
            var newArrs = [];
            $("#js_block_setcont").find("div.block-set-op").each(function(){
                if($(this).attr("class").indexOf("close") < 0){
                    newArrs.push($(this).attr("name"));
                }
            });
            upSet(newArrs);
        });
    }
    function setForm(){
        return $("div.block-set-cont").find("div.close").length;
    }
    ladingclick();
    function updatePortal(){
        var mds = $('div.app-rt').find('div.rt-block');
        var arrs = [];
        mds.each(function(i){
            var v = $(this).attr('id');
            var bol = true;
            for(var i = 0; i< arrs.length; i++){
                if(v == arrs[i]){
                    bol = false;
                    break;
                }else{
                    bol = true;
                }
            }
            if(bol){
                arrs.push(v);
            }
        });
        console.log(arrs);
        if(arrs.length <= 0 ){
            i8ui.error("最少要留一个组件");
            return;
        }
        upSet(arrs);
    }
    function upSet(arrs){
        $.ajax({
            url: '/modules/update-set',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{portal: arrs.join(',')},
            success: function(result){
                if(result.Result){
                    i8ui.write("更新成功");
                    //mdSet = arrs.join(',');
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
});