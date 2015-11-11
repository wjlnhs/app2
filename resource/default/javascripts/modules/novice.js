define(function(require){
    var usernav = cpec_session.usernav;
    var userLi = '';
    var userNum = 0;
    if(!usernav){
        usernav = {};
    }
    for(var key in usernav){
        if(usernav[key]){
            userNum++;
        }
    }
    if(userNum <= 5 ){
        $("#js_novice_status").html("初入i8职场");
    }else if( userNum > 5 && userNum <= 8){
        $("#js_novice_status").html("i8职场高手");
    }else if( userNum >= 9){
        $("#js_novice_status").html("i8职场之星");
    }
    userLi = ['<li class="'+ usernav.sethead +'"><a>设置头像<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.setinfo +'"><a>完善个人资料<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addgroup +'"><a>创建/加入一个群组<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addblog +'"><a>发一条图片侃侃<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addwf +'"><a>发起一支流程<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addreport +'"><a>写一篇日报<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.adddoc +'"><a>上传一篇文档<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addtask +'"><a>新建任务<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.adddaily +'"><a>创建日程<i class="spbg1 sprite-87"></i></a></li>'
    ]
    $("#js_novice_ul").html(userLi);
});