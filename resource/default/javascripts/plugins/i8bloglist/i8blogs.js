/**
 * Created by kusion on 2015/1/4.
 */
define(function(require,exports){
    var util_com=require('../../common/util');
    var getTplLib={
        listContainer:function(data){
            var param=data||{};
            var list_render=template(require('./template/blogs-container.tpl'));
            return list_render(data);
        },
        listCellTpl:function(data){
            var param=data||{};
            var cell_render=template(require('./template/kk-cell-frame.tpl'));
            return cell_render(param);
        }
    };
    function blogsList(_setting){
        var settings= $.extend({
            container:"#",
            locadItemsCompleted:function(){}
        },_setting);
        return new function(){
            var container=$(settings.container);
            this.init=function(){
                var container_html= getTplLib.listContainer();
                container.html(container_html);
                loadBlogs(1,container)//
            };
            this.appendBefore=function(data){
                var newItem=builderSingleItem(data);
                container.find("li.blist-cell:eq(0)").before(newItem);
            }
        }
    }
    function loadBlogs(index,container){
        var params={
            pageSize:20,
            pageIndex:index
        };
        $.get('/webajax/kkcom/getblogslist',params,function(response){
            if(response.Result){
              var curPageHtml= builderBlogs(response.ReturnObject,container);//构建侃侃
                $(".blogs-list-items",container).append(curPageHtml);
            }
        },"json");
    }
    //批量构建侃侃
    function builderBlogs(datasource){
        var blogsHtml="";
        _.each(datasource.listItems,function(item){
            blogsHtml+=builderSingleItem(item);
        });
        return blogsHtml;
    }
    //单篇侃侃分类构建
    function builderSingleItem(item){
        if(!_.isEmpty(item)) {
            item=dataFormate(item);//数据转换
            if (item.MessageType == 1) {
                var cell_html = getTplLib.listCellTpl(item);
                return cell_html;
            } else if (item.MessageType == 2) {
                return "";
            }
        }
    }
    //渲染模板前，数据转换
    function dataFormate(item){
        //权限转换,1-全员公开，2-At人可见，3-参与人可见
        item.ScopeType=item.ScopeType==1?"全员公开":(item.ScopeType==2?"仅At可见":"参与人可见") ;
        //内容@人转换
        item.Message = item.Message.replace(/\$%\$(\S+)\$%\$/g, function (str, info) {
            var infosry = info.split(',');
            var enType = infosry[2];//enType为0,人员；1，群组；2，组织；
            var newStr = '<a href="/user/' + infosry[1] + '">@' + infosry[0] + '</a>';
            switch (enType) {
                case 1:
                    newStr = '<a href="/group/' + infosry[1] + '">@' + infosry[0] + '</a>';
                    break;
                case 2:
                    newStr = '<a>@' + infosry[0] + '</a>';
            }
            return newStr;
        });
        //更新时间转换
        item.LastUpdateTime=util_com.formateDate(item.LastUpdateTime);
        return item;
    }
    return blogsList;
})