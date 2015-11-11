define(function(require, exports){
    var i8ui = require('/default/javascripts/common/i8ui');
    console.log(cpec_session);
    var myLinkIDs = '';
    var appsJson = {
        "app_workflow":{id:'',name:"工作流",url:'',classname:'sprite-45'},
        "app_report":{id:'',name:"周日报",url:'',classname:'sprite-46'},
        "app_schedule":{id:'',name:"日程",url:'',classname:'sprite-47'},
        "app_task":{id:'',name:"任务",url:'',classname:'sprite-48'},
        "app_vmail":{id:'',name:"微邮",url:'',classname:'sprite-49'}
    }
    function getBegin(){
        if(cpec_session){
            $('#js-my-heading').attr('src',cpec_session.uimage30);
            $('#js-my-name').html(cpec_session.uname);
            $('#js-my-bumen').html(cpec_session.orgname);

            //加载应用列表
            var appsHtml = '';
            //debugger;
            for(var i=0; i< cpec_session.apps.length; i++){
                var _item = appsJson[cpec_session.apps[i]];
                if(_item){
                    appsHtml += '<a href="'+ _item.url +'"><i class="spbg1 '+ _item.classname +'"></i>'+ _item.name +'</a>'
                }
            }
            $('#js_lt_work_menu').html(appsHtml);
        }
        //读取工作协作列表
//        $.ajax({
//            url: '/modules/apps',
//            type: 'get',
//            dataType: 'json',
//            cache: false,
//            data:{},
//            success: function(result){
//                if(result.Result){
//                    var listHtml = '';
//                    if(result.ReturnObject.length <= 0){
//                        return;
//                    }
//                    for( var i = 0; i < result.ReturnObject.length; i++){
//                        var _item = result.ReturnObject[i];
//                        var numHtml = '';
//                        if(_item.num){
//                            numHtml = '<span class="lt-apps-num">'+ _item.num +'</span>';
//                        }
//                        listHtml += '<a><i class="spbg1 '+ _item.bgtype +'"></i>'+ _item.name + numHtml +'</a>';
//                    }
//                    $('#js_lt_work_menu').html(listHtml);
//                }
//            },
//            error: function(e1,e2,e3){
//
//            }
//        });
        //读取常用链接设置
        $.ajax({
            url: '/modules/links',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{fn:'byuid',uid: cpec_session.uid},
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    for( var i = 0; i < result.ReturnObject.length; i++){
                        var _item = result.ReturnObject[i];
                        listHtml += '<a href="'+ _item.url +'" target="_blank"><i class="spbg1 sprite-51"></i>'+ _item.name +'</a>';
                    }
                    $('#js_links_list').html(listHtml);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function bindClick(){
        //群组click事件
        $('#js_left_group').click(function(){
            $(this).next().toggle();
        });
        //常用链接设置
        $('#js_links_set').click(function(){
            var linksDom = i8ui.showbox({
                title:'常用应用设置',
                noMask: true,
                cont: $('#js_links_html').html()
            });
            var showDom = $(linksDom);
            showDom.css({top: $(this).offset().top, left: $(this).offset().left+ 40});

            getAllLinks(function(allLinksList){
                console.log(allLinksList);
                var listHtml = '';
                for( var i = 0; i < allLinksList.length; i++){
                    var _item = allLinksList[i];
                    listHtml += '<li><label><input type="checkbox" />'+ _item.name +'</label></li>';
                }
                showDom.find('ul.links-ul-list').html(listHtml);
            });
            //取消
            showDom.on('click','span.btn-gray96x32', linksDom.close);
            showDom.on('click','span.btn-blue96x32',function(){
                var ids = ''
                updateSet(ids,function(){
                    linksDom.close();
                });
            });

        });
    }
    //获取所有常用链接
    function getAllLinks(cbk){
        //读取常用链接设置
        $.ajax({
            url: '/modules/links',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{fn:'all'},
            success: function(result){
                if(result.Result){
                    cbk(result.ReturnObject);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("请求出错！");
            }
        });
    }
    //更新常用链接设置
    function updateSet(ids, callback){
        //读取常用链接设置
        $.ajax({
            url: '/modules/links',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{fn:'update',ids: ids},
            success: function(result){
                if(result.Result){
                    i8ui.write('设置成功')
                    callback();
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("请求出错！");
            }
        });
    }
    getBegin();
    bindClick();
})