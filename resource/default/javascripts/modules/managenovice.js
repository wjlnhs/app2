define(function(require){
    var adminnav = cpec_session.adminnav ;
    var adminLi = $("#js_manage_novice_ul").html();
    var adminNum = 0;
    if(!adminnav){
        adminnav = {};
    }
    for(var key in adminnav){
        if(adminnav[key]){
            adminnav++;
        }
    }
    adminLi = adminLi.replace('{setcomp}',adminnav.setcomp)
                    .replace('{setcomp}',adminnav.setcomp)
                    .replace('{invitemate}',adminnav.invitemate)
                    .replace('{addlevel}',adminnav.addlevel)
                    .replace('{addorg}',adminnav.addorg)
                    .replace('{designwf}',adminnav.designwf)
                    .replace('{addadmin}',adminnav.addadmin)
                    .replace('{addcontact}',adminnav.addcontact);

    var statusDom = $("#js_manage_novice_status");
    if(adminNum <= 4 ){
        statusDom.html('<i class="spbg1 sprite-91"></i>初掌i8');
    }else if( adminNum > 4 && adminNum <= 7){
        statusDom.html('<i class="spbg1 sprite-92"></i>管理高手');
    }else if( adminNum >= 8){
        statusDom.html('<i class="spbg1 sprite-93"></i>管理之星');
    }
    $("#js_manage_novice_ul").html(adminLi).show();
});