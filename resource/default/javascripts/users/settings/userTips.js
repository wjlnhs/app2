/**
 * Created by jialin on 2014/12/19.
 */
    define(function (require, exports) {
        $('.reminding-setting').delegate('.app-checkbox', 'click', function () {
            $(this).toggleClass('checked')
        })
        $('.unread-prompt').delegate('.app-radio', 'click', function () {
            $('.unread-prompt').find('.app-radio').removeClass('checked');
            $(this).addClass('checked');
        })


    })
