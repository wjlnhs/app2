/**
 * Created by jialin on 2014/12/10.
 */
define(function (require, exports) {
    var i8Reg = require('/default/javascripts/common/i8Reg');
    var i8ui = require('/default/javascripts/common/i8ui');
    var i8City = require('/default/javascripts/plugins/i8city/i8city');
    require('/default/javascripts/common/fw_cpec');
    require('/default/javascripts/common/wdatepicker');
    require('/default/javascripts/users/settings/userInfo/personalInfo.js');
    require('/default/javascripts/users/settings/userInfo/jobInfo');
    require('/default/javascripts/common/underscore-min-cmd');

    //pageload
    function loadMailandMobile(type){
        $.post('/settings/GetPassportEntity?'+ Math.random(),function(data){
            var data= $.parseJSON(data);
            if(data.Result){
                var Identitys=data.ReturnObject.Identitys;
                var Email=null,Mobile=null,EmailHtml='',MobileHtml='';
                for(var i=0;i<Identitys.length;i++){
                    if(Identitys[i].Type==0){
                        Email=Identitys[i].Passport;
                    }
                    if(Identitys[i].Type==1){
                        Mobile=Identitys[i].Passport;
                    }
                }
                function rendermobile(){
                    require.async('/default/javascripts/users/settings/userInfo/template/mobile.tpl', function (mobileTemp) {
                        var render = template.compile(mobileTemp);
                        MobileHtml=render({Mobile:Mobile});
                        $('.mobile').replaceWith(MobileHtml);
                    })
                }
                function rendermail(){
                    require.async('/default/javascripts/users/settings/userInfo/template/mail.tpl', function (mailTemp) {
                        var render = template.compile(mailTemp);
                        EmailHtml=render({Email:Email});
                        $('.mail').replaceWith(EmailHtml);
                    })
                }
                if(type=='all'){
                    rendermobile();
                    rendermail();
                }else if(type=='mobile'){
                    rendermobile();
                }else if(type=='mail'){
                    rendermail();
                }
            }
        })
    }
    loadMailandMobile('all');

    //按钮切换
    $(document).delegate('.app-checkbox', 'click', function () {
        $(this).toggleClass('checked');
    })
    //展开编辑
    //获取parent $('..b-gray-sty1')(最外面框)
    function getparent(children) {
        return children.parents('.b-gray-sty1').eq(0);
    }

    //1.展开动作
    function expansion(parent, $this, showedit) {
        parent.find('>a').show();
        parent.find('.editing').hide();
        parent.find('>.cate-body').slideDown(100, function () {
            parent[0].isExpansion = true;
        });
        //是否打开初始化只显示编辑状态
        if (showedit) {
            parent.find('.preview').hide();
            parent.find('.b-blue-sty1').show();
        }
    }

    //2.收起动作
    function retract(parent, $this) {
        parent.find('>a').hide();
        parent.find('.editing').show();
        parent.find('>.cate-body').slideUp(100, function () {
            parent[0].isExpansion = false;
        });
    }

    //展开编辑实现
    $(document).delegate('.edu-info .edit, .job-info .edit, .personaldata .edit, .personaltag .edit', 'click', function () {
        var $this = $(this);
        var parent = getparent($this);
        if (!parent[0].isExpansion) {
            expansion(parent, $this, true);
        } else {
            retract(parent, $this);
        }
    })

    $(document).delegate('.mail .edit, .mobile .edit','click',function () {
        var $this = $(this);
        var parent = getparent($this);
        if (!parent[0].isExpansion) {
            expansion(parent, $this);
        } else {
            retract(parent, $this);
        }
    })

    $(document).delegate('.retract', 'click', function () {
        var $this = $(this);
        var parent = getparent($this);
        retract(parent, $this)
    })

    //确认按钮事件及其回调
    function confirm(parent, $this, cbk) {
        var _editbox = parent.find('.b-blue-sty1');
        var _previewbox = parent.find('.preview');
        _previewbox.show();
        _editbox.hide();
        confirm_common(parent, $this);
        cbk ? cbk() : '';

    }

    //第二层折叠职业和教育
    $('.personal-info').delegate('.btn-fold', 'click', function () {
        var parent = $(this).parents('.cate-body').eq(0);
        $(this).toggleClass('active');
        parent.find('.cate-item').slideToggle(50);
    })

    //修改邮箱
    //获取验证码
    function getVcode(passport){
        $.ajax({//验证验证码是否相同
            url: "/settings/addValidInfo?" + Math.random(),
            type: "post",
            dataType: "json",
            data: { passport:passport},
            success: function (data, textStatus) {
                if (data.Result) {
                    i8ui.simpleAlert('发送验证码成功');
                }
                else {
                    i8ui.simpleAlert(data.Message)
                }
            },
            error: function () {
                i8ui.simpleAlert('发送验证码失败,请检查网络！');
            }
        });
    }
    //新增凭证
    function SetNewPassport(newPassport,type,cbk){
        $.ajax({
            url: "/settings/SetNewPassport?" + Math.random(),
            type: "post",
            dataType: "json",
            data: {newPassport:newPassport},
            success: function (data, textStatus) {
                if (data.Result) {
                    i8ui.alert({//恭喜，#新的凭证#
                        title: '恭喜，您新增加了登录帐号' + newPassport + '！', type: 3, cbk: function (newPassport) {
                            if(type=='mobile'){
                                retract($('.mobile'), $('.mobile' .confirm));
                                loadMailandMobile('mobile');
                            }else if(type=='mail'){
                                retract($('.mail'), $('.mail' .confirm));
                                loadMailandMobile('mail');
                            }
                        }
                    });
                }
                else {
                    i8ui.simpleAlert(data.Message)
                }
            },
            error: function () {

            }
        });
    }
    //删除凭证
    function DeletePassport(oldPassport,password,type){
        $.post("/settings/DeletePassport?" + Math.random(),{oldPassport:oldPassport,password:password},function(data){
            var data= $.parseJSON(data);
            if(data.Result){
                i8ui.alert({//恭喜，#新的凭证#
                    title: '恭喜，您的登录帐号' + oldPassport + '已删除成功！',
                    type: 3,
                    cbk: function(){
                        if(type=='mobile'){
                            retract($('.mobile'), $('.mobile' .confirm));
                            loadMailandMobile('mobile');
                        }else if(type=='mail'){
                            retract($('.mail'), $('.mail' .confirm));
                            loadMailandMobile('mail');
                        }
                    }
                });
            }else{
                i8ui.simpleAlert(data.Message)
            }
        })
    }
    //修改凭证
    function ChangePassport(oldPassport,newPassport,password,vcode,type,cbk){
        $.ajax({
            url: "/settings/ChangePassport?" + Math.random(),
            type: "post",
            dataType: "json",
            data: { oldPassport: oldPassport, newPassport: newPassport, password: password,vcode:vcode},
            success: function (data, textStatus) {
                if (data.Result) {
                    if($('#ckb_chg_pass_new_passport').hasClass('checked') && type=="mail"){
                        $.post("/settings/UpdatePassport?" + Math.random(),{newPassport: newPassport},function(data){
                            var data= $.parseJSON(data);
                            if(data.Result){
                                i8ui.alert({//恭喜，#新的凭证#
                                    title: '恭喜，您的登录帐号已修改为' + newPassport + '！',
                                    type: 3,
                                    cbk: cbk(newPassport)
                                });
                            }else{
                                i8ui.simpleAlert(data.Message)
                            }
                        })
                    }else{
                        i8ui.alert({//恭喜，#新的凭证#
                            title: '恭喜，您的登录帐号已修改为' + newPassport + '！',
                            type: 3,
                            cbk: cbk(newPassport)
                        });
                    }
                }
                else {
                    i8ui.simpleAlert(data.Message)
                }
            },
            error: function () {

            }
        });
    }
    //邮箱验证码按钮点击
    $(document).delegate('#mail_v_code','click',function () {
        if (i8Reg.checkAll('.mail')) {
            var passport = $.trim($('#chg_pass_new_passport').val());
            getVcode(passport)
            //alert('可以请求密码验证了。。。。。。。。。。。。。')
        }
    });

    //邮箱确认按钮提交
    $(document).delegate('.mail .confirm','click',function () {
        if (i8Reg.checkAll('.mail')) {
            var vcode = $.trim($('#chg_pass_new_passport_yzm').val());
            //开始提交
            var oldPassport = $('#current_mail').text();
            var newPassport = $.trim($('#chg_pass_new_passport').val());
            var password = $.trim($('#chg_pass_passsword').val());
            if(!$('#mail_v_code').length){
                SetNewPassport(newPassport,'mail');
            }else{
                ChangePassport(oldPassport,newPassport,password,vcode,'mail',function (newPassport) {
                    $('#current_mail').text(newPassport);
                    $('#mail_title').text(newPassport);
                    retract($('.mail'), $('.mail .confirm'));
                })
            }
        }
    });
    //邮件删除按钮
    $(document).delegate('.mail .deletemail','click',function () {
        var oldPassport = $('#current_mail').text();
        var password = $.trim($('#chg_pass_passsword').val());
        i8ui.confirm({title: '确定删除邮箱帐号'+oldPassport+'吗？'}, function () {
            DeletePassport(oldPassport,password,'mail');
        })
    })
    //邮件取消按钮
    $(document).delegate('.mail .cancel','click',function () {
        $('#chg_pass_new_passport').val('');
        $('#chg_pass_passsword').val('');
        $('#chg_pass_new_passport_yzm').val('');
        retract($('.mail'), $('.mail .confirm'));
    })
    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //手机账号
    $(document).delegate('#mobile_v_code_btn','click',function () {
        if (i8Reg.checkAll('.mobile')) {
            var oldMobile = $('#current_mobile').text();
            var passport = $.trim($('#new_mobile').val());
            getVcode(passport)
            //alert('可以请求密码验证了。。。。。。。。。。。。。')
        }
    });

    //手机确认按钮提交
    $(document).delegate('.mobile .confirm','click',function () {
        if (i8Reg.checkAll('.mobile')) {
            var vcode = $.trim($('#mobile_v_code').val());
            var newMobile = $.trim($('#new_mobile').val());
            //开始提交
            var oldPassport = $('#current_mobile').text();
            var newPassport = $.trim($('#new_mobile').val());
            var password = $.trim($('#current_mobile_psw').val());
            //新增凭证
            if(!$('#mobile_v_code').length){
                SetNewPassport(newPassport,'mobile');
            }else{
                //更新凭证
                ChangePassport(oldPassport,newPassport,password,vcode,'mobile',function (newPassport) {
                    $('#current_mobile').text(newMobile);
                    $('#mobile_title').text(newMobile);
                    retract($('.mobile'), $('.mobile .confirm'));
                })

            }
        }
    });
    //手机删除按钮
    $(document).delegate('.mobile .deletemobile','click',function () {
        var oldPassport = $('#current_mobile').text();
        var password = $.trim($('#current_mobile_psw').val());
        i8ui.confirm({title: '确定删除手机帐号'+oldPassport+'吗？'}, function () {
            DeletePassport(oldPassport,password,'mobile');
        })
    })
    //手机取消按钮
    $(document).delegate('.mobile .cancel','click',function () {
        $('#chg_pass_new_passport').val('');
        $('#chg_pass_passsword').val('');
        $('#chg_pass_new_passport_yzm').val('');
        retract($('.mobile'), $('.mobile .confirm'));
    })

    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //个人资料
    $('.personaldata').delegate('.app-radio', 'click', function () {
        $('.personaldata .app-radio').removeClass('checked');
        $(this).addClass('checked')
    })
    /*$('.personaldata .confirm').click(function(){
     if(i8Reg.checkAll('.personaldata')){
     alert('前台验证完成可以发送ajax了....................................................')
     }
     });*/

    //个人资料取消按钮,
    $('.personaldata').delegate('.cancel', 'click', function () {
        $('.personaldata').find("[defaultvalue]").each(function () {
            $(this).val($(this).attr('defaultvalue'));
        })
        retract($('.personaldata'), $('.personaldata .cancel'));
    })


    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //个人标签
    //获取建议标签
    function getSuggestLables(except,cbk){
        $.post("/settings/SuggestLables?" + Math.random(),{"except":except},function(data){
            var data= $.parseJSON(data);
            if(data.Result){
                cbk(data.ReturnObject)
            }else{
                i8ui.simpleAlert(data.Message)
            }
        })
    }
    //获取浏览器标签
    function getBrowserLables(){
        var labels=[];
        if($('.cate-body .tile-nor').length>0){
            $('.cate-body .tile-nor').each(function(index,item){
                labels.push($(item).text())
            })
        }else{
            labels=[""];
        }
        return labels;
    }
    //保存标签
    function UpdateLabel(labels,cbk){
        $.post("/settings/UpdateLabel?" + Math.random(),{"labels":labels},function(data){
            var data= $.parseJSON(data);
            if(data.Result){
                cbk(data.ReturnObject)
            }else{
                i8ui.simpleAlert(data.Message)
            }
        })
    }
    function removeClass_active() {
        $('#mytag .tile-nor').each(function () {
            var _value = $(this).text();
            var yourLikes = $('.tile-add.active');
            //if(yourLikes.length>0){
            yourLikes.each(function () {
                if ($(this).text() == _value) {
                    $(this).removeClass('active')
                }
            })
            //}
        })
    }

    //初始化tile-add
    function addClass_active() {
        $('#mytag .tile-nor').each(function () {
            var _value = $(this).text();
            var yourLikes = $('.tile-add');
            yourLikes.each(function () {
                if ($(this).text() == _value) {
                    $(this).addClass('active')
                }
            })
        })
    }

    addClass_active();
    $('#newTagInput').keydown(function (e) {
        if (e.keyCode == 13) {
            var _value = $.trim($('#newTagInput').val());
            $('#mytag').append('<span class="tile-nor">' + _value + '<i class="icon"></i></span>');
        }
    })
    getSuggestLables([""],function(data){
        console.log(data)
    })

    $('.personaltag').delegate('.tile-nor i', 'click', function () {
        removeClass_active();
        $(this).parent().remove();
    })
    $('.personaltag').delegate('.tile-add', 'click', function () {
        if ($(this).hasClass('active')) {
            return;
        }
        $(this).addClass('active');
        $('#mytag').append($(this).clone(true).attr('class', 'tile-nor'))
    })

    $('.personaltag .app-radio').click(function () {
        $('.personaldata .app-radio').removeClass('checked');
        $(this).addClass('checked')
    })
    $('.personaltag .confirm').click(function () {
        var labels=getBrowserLables();
        UpdateLabel(labels,function(){
            i8ui.simpleAlert("保存成功")
        })

    });
    //个人标签取消按钮
    $('.personaltag .cancel').click(function () {
        $('.personaltag .retract').trigger('click')
    });


    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //工作信息
    //初始化工作城市
    function jobCityLoad(){
        $('.job-info .b-blue-sty1').each(function(index,item){
            var _val=$(item).find('.citylev1').val()+ "-" +$(item).find('.citylev2').val();
            $(item).prev().find('.citytxt').text(_val)
        })
    }
    jobCityLoad();
    $('.job-info').on('click', '.btn-edit-one', function () {
        var itembox = $(this).parents('.cate-body').eq(0);
        itembox.find('.cate-item').show();
        itembox.find('.preview').hide().next().show();
    })

    ///取消按钮
    $('.job-info').on('click', '.cancel', function () {
        var itemparent = $(this).parents('.b-blue-sty1').eq(0);
        itemparent.find("[defaultvalue]").each(function () {
            $(this).val($(this).attr('defaultvalue'));
        })
        itemparent.hide().prev().show();
    })
    //删除
    function DeleteExperience($this,id){
        $.post("/settings/DeleteExperience?" + Math.random(),{id: id},function(data){
            var data= $.parseJSON(data);
            if(data.Result){
                i8ui.alert({//恭喜，#新的凭证#
                    title: '删除成功！',
                    type: 3,
                    cbk: function(){
                    }
                });
                $this.parents('.cate-body').eq(0).remove();
            }else{
                i8ui.simpleAlert(data.Message)
            }
        })
    }
    //删除按钮
    $('.job-info').on('click', '.btn-delete', function () {
        var $this = $(this);
        var id=$this.parents('.cate-body').eq(0).attr('cid');
        i8ui.confirm({title: '确定删除本条工作信息吗'}, function () {
            DeleteExperience($this,id)
        })

    })
    //增加一条工作信息
    $('.job-info').delegate('.add-job', 'click', function () {
        require.async('/default/javascripts/users/settings/userInfo/template/jobInfo.tpl', function (jobInfoTemp) {
            var render = template.compile(jobInfoTemp),
                StartTime = new Date().format('yyyy-MM-dd'),
                EndTime = new Date().format('yyyy-MM-dd');
            var subDate = {
                ID:"",
                MainName: "",
                Position: "",
                Location: "",
                StartTime: StartTime,
                EndTime: EndTime
            }
            var _html = render({List: [subDate]});
            _html=$(_html).find('.btn-fold').addClass('active').end().find('.preview').hide().end().find('.b-blue-sty1').show().end();
            $('.add-job').parent().before(_html)

            //itemparent.hide().prev().show();
        })
        window.addgrowthIndex++;
    })

    //增加或者修改
    function SaveExperience($this,itemparent,render,subDate,expType){
        var cbktitle="添加成功";
        if(itemparent.attr('cid')){
            cbktitle='修改成功!';
            subDate.ID=itemparent.attr('cid')
        }
        $.post("/settings/SaveExperience?" + Math.random(),{entity:subDate},function(data){
            var data= $.parseJSON(data);
            if(data.Result){
                i8ui.alert({//恭喜，#新的凭证#
                    title: cbktitle,
                    type: 3,
                    cbk: function(){
                    }
                });
                $.post("/settings/GetExperience?" + Math.random(),{expType:expType},function(data){
                    var data= $.parseJSON(data);
                    if(data.Result){
                        var result=data.ReturnObject
                        var _data=_.max(result,function(result){return new Date(result.LastUpdateTime).getTime()});
                        if(expType==1){
                            _data.CityTxt=$(itemparent).find('.citylev1').val()+ "-" +$(itemparent).find('.citylev2').val();
                        }
                        var uu = render({List: [_data]})
                        itemparent.replaceWith(uu);
                    }else{
                        i8ui.simpleAlert(data.Message)
                    }
                })
            }else{
                i8ui.simpleAlert(data.Message)
            }
        })
    }

    ///提交按钮
    $('.job-info').on('click','.confirm', function () {
        var $this=$(this);
        var itemparent = $this.parents('.cate-body').eq(0);
        require.async('/default/javascripts/users/settings/userInfo/template/jobInfo.tpl', function (jobInfoTemp) {
            var render = template.compile(jobInfoTemp);
            var subDate = {
                MainName: itemparent.find('.company').val(),
                Position: itemparent.find('.position').val(),
                Location: itemparent.find('.city-group').attr('lev2code'),
                StartTime: itemparent.find('.startTime').val(),
                EndTime: itemparent.find('.endTime').val(),
                ExperienceType:1
            }
            SaveExperience($this,itemparent,render,subDate,1);
        })
        window.addgrowthIndex++;
    })


    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //教育信息
    $('.edu-info').delegate('.btn-edit-one', 'click', function () {
        var itembox = $(this).parents('.cate-body').eq(0);
        itembox.find('.cate-item').show();
        itembox.find('.preview').hide().next().show();
    })

    ///取消按钮
    $('.edu-info').delegate('.cancel', 'click', function () {
        var itemparent = $(this).parents('.b-blue-sty1').eq(0);
        itemparent.find("[defaultvalue]").each(function () {
            $(this).val($(this).attr('defaultvalue'));
        })
        itemparent.hide().prev().show();
    })
    //删除按钮
    $('.edu-info').on('click', '.btn-delete', function () {
        var $this = $(this);
        var id=$this.parents('.cate-body').eq(0).attr('cid');
        i8ui.confirm({title: '确定删除本条教育信息吗'}, function () {
            DeleteExperience($this,id);
            $this.parents('.cate-body').eq(0).remove();
        })
    })

    //增加一条教育信息
    $('.edu-info').delegate('.add-edu', 'click', function () {
        require.async('/default/javascripts/users/settings/userInfo/template/edu.tpl', function (eduInfoTemp) {
            var render = template.compile(eduInfoTemp);
            var StartTime = new Date().format('yyyy-MM');
            var EndTime = new Date().format('yyyy-MM');
            var subDate = {
                MainName: "",
                Position: "",
                StartTime: StartTime,
                EndTime: EndTime
            }
            var _html = render({List: [subDate]});
            _html=$(_html).find('.btn-fold').addClass('active').end().find('.preview').hide().end().find('.b-blue-sty1').show().end();
            $('.add-edu').parent().before(_html);
            //itemparent.replaceWith(_html).show();
        })
    })
    ///提交按钮
    $('.edu-info').delegate('.confirm', 'click', function () {
        var $this=$(this);
        var itemparent = $this.parents('.cate-body').eq(0);
        require.async('/default/javascripts/users/settings/userInfo/template/edu.tpl', function (eduInfoTemp) {
            var render = template.compile(eduInfoTemp);
            var StartTime = itemparent.find('.start-year').val() + '-' + itemparent.find('.start-month').val();
            var EndTime = itemparent.find('.end-year').val() + '-' + itemparent.find('.end-month').val();
            var subDate = {
                MainName: itemparent.find('.school').val(),
                Position: itemparent.find('.position').val(),
                StartTime: StartTime,
                EndTime: EndTime,
                ExperienceType:2
            }
            SaveExperience($this,itemparent,render,subDate,2)
            //itemparent.hide().prev().show();
        })
        window.addgrowthIndex++;
    })

    //时间控件
    $('.edu-info').delegate('.icon_select_gray','click',function () {
        $(this).prev()[0].focus();
    })

})