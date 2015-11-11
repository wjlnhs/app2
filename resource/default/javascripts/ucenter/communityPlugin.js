/**
 * Created by jialin on 2014/12/17.
 */
define(function (require, exports) {
    //第一层tab
    $('.kk-btn').click(function(){
        $('.schedule-tab, .weekofdaily-tab').hide();
        $('.kk-tab').show();
    })
   $('.schedule-btn').click(function(){
       $('.kk-tab, .weekofdaily-tab').hide();
       $('.schedule-tab').show();
   })
    $('.weekofdaily-btn').click(function(){
        $('.schedule-tab, .kk-tab').hide();
        $('.weekofdaily-tab').show();
    })
    //全局app-checkbox
    $('.app-checkbox').click(function(){
        $(this).toggleClass('checked');
    })

    //app-radio
    $('.schedule-cycle .app-radio').click(function(){
        $('.schedule-cycle .app-radio').removeClass('checked');
        $(this).addClass('checked');
    })
    $('.weekordaily .app-radio').click(function(){
        $('.weekordaily .app-radio').removeClass('checked');
        $(this).addClass('checked');
    })

    //kk附件提示
    $('.kk-body .attachment-btn').hover(function(){
        $('.kk-tab .attachment-tip').show();
    },function(){
        $('.kk-tab .attachment-tip').hide();
    })
    //kankan的tab
    $('.kk-tab .functions-btns-left li').click(function(){
        var $this=$(this)
        $('.kk-tab .functions-btns-left li').removeClass('active');
        $this.addClass('active');
        $('.kk-functions>div').hide();
        $('.kk-functions>div').eq($this.index()).show();
    })
    //选择发布范围
    $('.release-scope-title').click(function(){
        $('.release-scope-group').slideToggle(200);
        return false;
    });
    $(document).click(function(){
        $('.release-scope-group').slideUp(200);
    })

    //周日报tile
    $(document).on('click','.tile-nor i',function(){
        $(this).parent().remove();
    })

})