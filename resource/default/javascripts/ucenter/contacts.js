define(function (require, exports) {
    var i8ui = require('/default/javascripts/common/i8ui');
    require('default/javascripts/plugins/i8ztree/jquery.ztree.all-3.5.min.js');
    //var util = require("special/js/assets/util.js");GetDefaultOrgTree
    var searchtxt = "";
    var app_document_pagepara = { pageIndex: 1, pageSize: 10 };
    template.helper("$FunLevels", function (Levels) {
        var userstyle = "";
        $.each(Levels, function (i, val) {
            var Level = val;
            if (Level.Type == 4) {
                userstyle += "<span class='app_contacts_userlevel4' title='超级管理员'></span>";
            }
            else if (Level.Type == 20) {
                userstyle += "<span class='app_contacts_userlevel20' title='设置中心管理员'></span>";
            }
            else if (Level.Type == 30) {
                userstyle += "<span class='app_contacts_userlevel30' title='信息管理员'></span>";
            }
        });
        return userstyle;
    });

    template.helper("$CheckContractStatus", function (Status) {
        if (Status) {
            return 1;
        } else {
            return 0;
        }

    });


    $(function () {
        LoadTree();
        //LoadContactsUser(1);

    });

    $("#SearchUser").click("click", function () {
        searchtxt = $("#txt_search").val();
        _orgid = "";
        LoadContactsUser(1);
        //树返回顶级
        var zTrees = $.fn.zTree.getZTreeObj("contacts_tree");
        var nodes = zTrees.getNodes();
        if (nodes != null && nodes.length > 0) {
            zTrees.selectNode(nodes[0], false);
        }

    });
    $("#ckbox_contacts").click("click", function () {
        searchtxt = $("#contacts_tree").val();
        LoadContactsUser(1);

    });

    var _orgid = "";
    //根据组织加载人员
    function LoadContactsUser(index, orgid) {

        if (index) {
            app_document_pagepara.pageIndex = index;
        }
        if (orgid) {
            _orgid = orgid;
        }
        //if (searchtxt) {
        //    app_document_pagepara = { pageIndex: 1, pageSize: 10 };
        //}
        $.ajax({
            url: "/handler/IUserRelationHandler.ashx?fn=getemplist&type=0",
            type: "post",
            dataType: "json",
            beforeSend: function () {
                $("#ContactsList").html("<tr><td colspan='5' class='tct'><div class='lg_loading'></div></td></tr>");
            },
            data: { "pageIndex": app_document_pagepara.pageIndex, "pageSize": app_document_pagepara.pageSize, "search": searchtxt, orgID: _orgid, "iscontacts": $("#ckbox_contacts").is(":checked") },
            success: function (data) {
                if (data.Result && data.ReturnObject.count > 0) {

                    var shtml = template.render('LoadContactsTemp', data.ReturnObject);

                    $("#ContactsList").html(shtml);
                    $("#ContactsList").show();
                    var PageCount = data.ReturnObject.count;
                    $("#allnum").html(PageCount);
                    if (PageCount > app_document_pagepara.pageSize) {
                        fw_CreateTurnPage("Paginations", PageCount, app_document_pagepara.pageIndex, Contacts_List_PageCallback, app_document_pagepara.pageSize);
                        $("#Paginations").show();
                    } else {
                        $("#Paginations").hide();
                    }
                }
                else {
                    $("#allnum").html("0");
                    $("#ContactsList").html("<tr style='border-bottom:none'><td colspan='5' style='text-align:center'><div class='fw_nocontent_tips_panl'><span>暂无数据</span></div></td></tr>");
                    $("#Paginations").hide();
                    if (data.Description && data.Description.length > 0) {
                        util.i8alert({
                            str: data.ReturnObject, type: 1
                        });
                    }

                }
            },
            error: function (e1, e2, e3) {
                util.i8alert({
                    str: e3, type: 1
                });
            }
        });
    }
    function Contacts_List_PageCallback(index, jq) {
        app_document_pagepara.pageIndex = index;
        LoadContactsUser(index);

    }

    var setting = {
        view: {
            showIcon: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                searchtxt = "";
                //清空搜索
                $("#txt_search").val("");
                LoadContactsUser(1, treeNode.id);

            }
        }
    };

    function LoadTree() {


        $.ajax({
            url: fw_globalConfig.root + "Handler/IUserRelationHandler.ashx?fn=getorgtrees",
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.Result) {
                    $.fn.zTree.init($("#contacts_tree"), setting, data.ReturnObject);

                    var zTrees = $.fn.zTree.getZTreeObj("contacts_tree");

                    //var nodes = zTrees.getCheckedNodes(true);
                    var nodes = zTrees.getNodes();
                    if (nodes != null && nodes.length > 0) {
                        LoadContactsUser(1, nodes[0].id);
                        zTrees.selectNode(nodes[0], false);
                    }

                } else {
                    util.i8alert({
                        str: "组织架构生成失败", type: 1
                    });
                }
            }
        });

    }

    //更新常用联系人
    $(".contractstatus").live("click", function () {
        var _this = $(this);
        var msg = "";
        var status = $(this).attr("status");
        if ($(this).attr("status") == "0") {

            msg = "已设为";
        } else {
            msg = "已取消";
        }
        $.ajax({
            url: fw_globalConfig.root + "Handler/IUserRelationHandler.ashx?fn=editcontract",
            type: 'post',
            data: { "contractID": $(this).attr("contractID"), "status": $(this).attr("status") },
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.Result) {
                    if (status == "0") {
                        _this.addClass("love-ck").attr("status", "1");
                    } else {
                        _this.removeClass("love-ck").attr("status", "0");
                    }
                    util.i8alert({
                        str: msg + "常用联系人", type: 3, btnobj: _this, time: 1000, cbk: function () {
                            // LoadContactsUser();

                        }
                    });

                } else {
                    util.i8alert({
                        str: data.Description, type: 1
                    });
                }
            }
        });
    });
    template.helper("$CheckValue", function (val) {
        if ($.trim(val) == "") {
            return false;
        } else {
            return true;
        }

    });
    $("#txt_search").keydown(function (e) {
        if ((e.keyCode || e.which) == 13) {
            searchtxt = $("#txt_search").val();
            _orgid = "";
            LoadContactsUser(1);
            //树返回顶级
            var zTrees = $.fn.zTree.getZTreeObj("contacts_tree");
            var nodes = zTrees.getNodes();
            if (nodes != null && nodes.length > 0) {
                zTrees.selectNode(nodes[0], false);
            }
        }
    });
})