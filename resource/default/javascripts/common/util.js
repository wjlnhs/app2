/**
 * Created by kusion on 2014/12/25.
 */
define(function (require, exports, module) {
    //白名单
    var _white_list = /^[（）：\u4e00-\u9fa5_a-zA-Z0-9@,\s\!#\$%\(\)>"\.\:]+$/ig; //\uFE30-\uFFA0
    String.prototype.toDate = function () {
        return new Date(this.replace(/-/g, '/'));
    };
    var _workflowInputVerify = function (value) {
        var _retObj = {};
        var _flag = false;
        _white_list.lastIndex = 0;
        if (_white_list.test(value)) {
            _flag = true;
        }
        _retObj.result = true;// _flag;
        _retObj.tips = "输入名带非法字符，只允许输入中英文,空格,数字,_.\"%@,：:";
        return _retObj;
    }
    var util = function () {
        /*创建cookie*/
        var _setCookie = function (sName, sValue, days) {
            _delCookie(sName);
            if (!days) {
                document.cookie = sName + "=" + encodeURIComponent(sValue) + ';path=/;';
                return;
            }
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = sName + "=" + encodeURIComponent(sValue) + ";path=/; expires=" + exp.toGMTString();
        }
        /*获取cookies*/
        var _getCookie = function (sName) {
            var aCookie = document.cookie.split("; ");
            for (var i = 0; i < aCookie.length; i++) {
                var aCrumb = aCookie[i].split("=");
                if (sName == aCrumb[0])
                    return decodeURIComponent(aCrumb[1]);
            }
        }
        /*删除cookies*/
        var _delCookie = function (sName) {
            document.cookie = sName + "=" + encodeURIComponent("") + "; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
        }
        /*将json object对象转换成string*/
        var _toJsonString = function (obj) {
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                if (t == "string") obj = '"' + obj + '"'; /* simple data type*/
                return String(obj);
            }
            else {
                var n, v, json = [], arr = (obj && obj.constructor == Array); /* recurse array or object*/
                for (n in obj) {
                    v = obj[n]; t = typeof (v);
                    if (t == "function") continue; /*except function*/
                    if (t == "string") v = '"' + v + '"';
                    else if (t == "object" && v !== null) v = _toJsonString(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };
        var _urlParamToJson = function (url, key, replace) {
            url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
            var json = {};
            url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key, value) {
                if (!(key in json)) {
                    json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
                }
                else if (json[key] instanceof Array) {
                    json[key].push(value);
                }
                else {
                    json[key] = [json[key], value];
                }
            });
            return key ? json[key] : json;
        };
        /*
         *公用提示方法
         *btnobj:$对象,默认为空在屏幕中间显示，有传递对象则在按钮的上方显示,
         *str:提示消息内容,
         *type:1,提示类型，1为错误提示，2为警告，3为通过或者成功
         *stype:默认为空，false 自动关闭，true 则手动关闭
         *time:默认为2000(两秒)
         *cbk:function() 回调函数
         */
        var i8alert = function (json) {
            var time = 2000;
            var _color = " #FF690E";
            var stypehtml = "";
            if (!json.type) {
                json.type = 1;
            }
            //提示内容类型
            if (json.type != 1) {
                _color = " #717276";
            }
            //显示方式
            if (json.stype) {
                stypehtml = '<span class="lg_fm_close"></span>';
            }
            if (json.time) {
                time = json.time;
            }
            var domobj = document.getElementById("js_lg_tp_div");
            if (domobj) {
                domobj = $(document.getElementById("js_lg_tp_div"));
                domobj.html('<i class="lg_fm_' + json.type + '"></i>' + json.str + stypehtml);
            } else {
                var htmlstr = '<div id="js_lg_tp_div" style="position:absolute; z-index:1111; left:50%; top:50%;' +
                    'font-size:14px;color:' + _color + '; border:1px solid #CFD0D0; padding:8px 30px 8px 15px; background:#fff;' +
                    'font-weight:bold; box-shadow:2px 2px 2px -1px #C5C6C7; line-height:25px; display:none;">' +
                    '<i class="lg_fm_' + json.type + '"></i>' + json.str + stypehtml + '</div>';
                $("body").append(htmlstr);
                domobj = $(document.getElementById("js_lg_tp_div"));
            }
            domobj.css({ "margin-left": 0 - domobj.width() / 2, "margin-top": 0 - domobj.height() / 2, color: _color, "position": "fixed" });
            if (json.btnobj) {
                var _left = json.btnobj.offset().left;
                var _top = json.btnobj.offset().top - domobj.outerHeight() - 10;
                if (_top < 0)
                    _top = 1;
                var _right = "auto";
                var wdwidht = $(window).width();
                var boxwidth = domobj.width();
                if (_left > (wdwidht - boxwidth)) {
                    _left = "auto";
                    _right = 0;
                }
                domobj.css({ margin: 0, left: _left, top: _top,right:_right, position: "absolute" });
            }
            domobj.show();
            if (json.stype) {
                $(".lg_fm_close").click(function () {
                    $(this).parent().hide();
                });
                return;
            }
            setTimeout(function () {
                domobj.hide();
                if (json.cbk) {
                    json.cbk();
                }
            }, time);
        };
        /*全屏loading效果
         *btnobj:$对象,默认为空在屏幕中间显示，有传递对象则在按钮的上方显示,
         *str:提示消息内容,
         */
        var i8loaing = function (json) {
            if (!json.str) {
                json.str = "请稍等..."
            }
            var domobj = document.getElementById("js_lg_tp_div");
            if (domobj) {
                domobj = $(document.getElementById("js_lg_tp_div"));
                domobj.html('<i class="lg_loading' + json.type + '"></i>' + json.str );
            } else {
                var html = '<div id="js_lg_tp_div" style="position: absolute; z-index: 100; left:50%; top:50%; font-size: 12px; border: 1px solid rgb(207, 208, 208); padding: 8px 30px 8px 15px; background-color: rgb(255, 255, 255); box-shadow: rgb(197, 198, 199) 2px 2px 2px -1px; line-height: 25px; margin: 0px; background-position: initial initial; background-repeat: initial initial;"><i class="lg_loading"></i>' + json.str + '</div>';
                $("body").append(html);
                domobj = $(document.getElementById("js_lg_tp_div"));
            }
            if (document.getElementById("fw_zhezhaomaskmodel") == null) {
                var mask = "<div id ='fw_nomaskzhezhao' class='fw_mask0'></div>";
                $("body").append(mask);
            }
            $("#fw_nomaskzhezhao").show();
            domobj.css({ "margin-left": 0 - domobj.width() / 2, "margin-top": 0 - domobj.height() / 2, "position": "fixed" }).show();
            if (json.btnobj) {
                var _left = json.btnobj.offset().left;
                var _top = json.btnobj.offset().top - domobj.outerHeight() - 10;
                domobj.css({ margin: 0, left: _left, top: _top, position: "absolute" });
            }
        };

        /**
         * 截取字符串
         * @param str
         * @param len
         */
        var fnStringCut = function(str,len) {

            var _str = str || '',
                _len = len || 0;

            if(_str.length<len)
            {
                return str;
            }

            return _str.substr(0,len-2)+'..';
        }
        var replaceSpecial=function(str,es){
            var es=es||'';
            var keyword=new RegExp("[\\ ,\\。,\\`,\\~,\\!,\\@,\\#,\\$,\\%,\\^,\\+,\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\.,\\<,\\>,\\{,\\},\\(,\\),\\'',\\;,\\=,\"]","gi")
            return str.replace(keyword,function(word){
                return '\\'+word;
            })
        }

        //关闭loading方法
        var i8closeloading = function () {
            $("#js_lg_tp_div").hide();
            $("#fw_nomaskzhezhao").hide();
        }
        var oneDay = 3600 * 24 * 1000, oneHour = 3600 * 1000, oneMinute = 60 * 1000, week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

        //分钟处理函数  ，当分钟小于10时，自动在分钟前补0
        var fMinuteHandle = function (minute) {
            if (minute < 10) {
                return '0' + minute;
            }
            return minute;
        };
        var fDayHandle = function (day) {
            if (day < 10) {
                return '0' + day;
            }
            return day;
        };
        //日期处理函数
        var fDateHandle = function (date, currentDate) {
            var curDate = null;
            if (currentDate) {
                if (typeof currentDate === 'string') {
                    try {
                        curDate = currentDate.toDate(); //尝试转化为 datetime对象
                    }
                    catch (e) {
                        curDate = new Date();
                    }
                }
                else {
                    curDate = curDate || new Date();    //否则认为是传入的时间对象，此处可以考虑重构，判断curDate为 datetime对象
                }
            }
            curDate = curDate || new Date();
            var msgDate = null;
            try {
                msgDate = date.toDate();
            } catch (e) {
                alert(e);
                return;
            }
            var timeTick = curDate - msgDate;
            if (timeTick <= 0) {
                return '刚刚';
            }
            if ((timeTick / oneDay) >= 1 || (Math.abs((curDate.getDate() - msgDate.getDate())) >= 1)) {
                return msgDate.getFullYear() + '年' + (msgDate.getMonth() + 1) + '月' + msgDate.getDate() + '日' + " " + (msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes()));
            }
            if ((timeTick / oneHour) > 1) {
                return '今天 ' + msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes());
            }
            if ((timeTick / oneMinute) > 1) {
                return Math.ceil(timeTick / oneMinute) + '分钟前';
            }
            return '刚刚';
        };
        var _dateDiff = function (interval, date1, date2) {
            var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
            interval = interval.toUpperCase();
            if (typeof (data1) == "Object") {
                date1 = date1.toDate();
                date2 = date2.toDate();
            }
            try {
                return Math.round((date2 - date1) / eval('(objInterval.' + interval + ')'));
            }
            catch (e) {
                return e.message;
            }
        };
        var fw_request = function (paras) {
            var url = location.href.indexOf("#") > 0 ? location.href.substring(0, location.href.indexOf("#")) : location.href;
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var paraObj = {}
            for (i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1);
            }
            var returnValue = paraObj[paras.toLowerCase()];
            if (typeof (returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        }
        function _loadsinglejs(url, callback) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement('script');
            script.onload = script.onreadystatechange = script.onerror = function () {
                if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;
                script.onload = script.onreadystatechange = script.onerror = null;
                script.src = '';
                script.parentNode.removeChild(script);
                script = null;
                if (callback)
                    callback();
            }
            script.charset = "utf-8";
            script.src = url;
            try {
                head.appendChild(script);
            } catch (exp) { }
        }
        /*动态加载JS*/
        function _loadjs(url, callback) {
            if (Object.prototype.toString.call(url) === '[object Array]') {	//是否数组
                this.suc = 0;			//加载计数
                this.len = url.length;	//数组长度
                var a = this;
                for (var i = 0; i < url.length; i++) {
                    _loadsinglejs(url[i], function () { a.suc++; if (a.suc == a.len) try { callback(); } catch (e) { } });
                }
            } else if (typeof (url) == 'string') {
                _loadsinglejs(url, callback);
            }
        }
        /*文件大小转换_byte字节*/
        function _sizeFormat(_byte) {
            var i = 0;
            while (Math.abs(_byte) >= 1024) {
                _byte = _byte / 1024;
                i++;
                if (i == 4) break;
            }
            $units = new Array("Bytes", "KB", "MB", "GB", "TB");
            $newsize = Math.round(_byte, 2);
            return $newsize + $units[i];
        }
        function _dateConverter (_date) {
            var date = _date.replace(/\-/g, "/");
            var nDate = new Date(date);
            var time = (nDate.getHours().toString().length == 1 ? ("0" + nDate.getHours().toString()) : nDate.getHours().toString()) +":"+ (nDate.getMinutes().toString().length == 1 ? ("0" + nDate.getMinutes().toString()) : nDate.getMinutes().toString());
            var cn_str = (nDate.getYear().toString()).substr(1, 3) + "年" + (nDate.getMonth() + 1) + "月" + nDate.getDate() + "日 " + time;
            return cn_str;
        }
        var _subString = function (str, n) {
            var r = /[^\x00-\xff]/g;
            if (str.replace(r, "mm").length <= n) { return str; }
            var m = Math.floor(n / 2);
            for (var i = m; i < str.length; i++) {
                if (str.substr(0, i).replace(r, "mm").length >= n) {
                    return str.substr(0, i) + "...";
                }
            }
            return str;
        }
        var TxtBoxWarn = function (txtobj) {
            var colors = ["rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)"];
            var colorAnimate = function (cls) {
                var clrTimer = null;
                if (cls.length > 0) {
                    clrTimer = setTimeout(function () {
                        txtobj.css({ "background-color": cls.shift() });
                        colorAnimate(cls);
                    }, 100);
                } else {
                    clearTimeout(clrTimer);
                }
            }
            colorAnimate(colors);
        };
        var _strFormat = function () {
            var s = arguments[0];
            var args = arguments;
            if (s) {
                return s.replace(/\{(\d+)\}/ig, function (a, b) {
                    var ret = args[(b | 0) + 1];
                    return ret == null ? '' : ret;
                })
            }
            else {
                return "";
            }
        };
        var _strLength=function(str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                }
                else {
                    len += 2;
                }
            }
            return len;
        }


        /*import  重写window.alert*/
        window._alert = window.alert;
        window.alert = function (data) {
            i8alert({str:data});
        }
        //转换时间格式（用于ajax获取数据后执行格式转换）
        var dateformat=function dateformat(value, format) {
            var date=new Date(value);
            if(date=='Invalid Date'||isNaN(date)){
                date= new Date(value.replace(/-/g,'/'));
            }
            return date.format(format);
        }
        Date.prototype.format = function (format) {
            /*
             * eg:format="yyyy-MM-dd hh:mm:ss";
             */
            var o = {
                "M+": this.getMonth() + 1, // month
                "d+": this.getDate(), // day
                "h+": this.getHours(), // hour
                "m+": this.getMinutes(), // minute
                "s+": this.getSeconds(), // second
                "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
                "S": this.getMilliseconds()
                // millisecond
            }

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                    - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
        var _HtmlUtil = {
            /*1.用正则表达式实现html转码*/
            htmlEncodeByRegExp:function (str){
                var s = "";
                if(str.length == 0) return "";
                s = str.replace(/&/g,"&amp;");
                s = s.replace(/</g,"&lt;");
                s = s.replace(/>/g,"&gt;");
                s = s.replace(/ /g,"&nbsp;");
                s = s.replace(/\'/g,"&#39;");
                s = s.replace(/\"/g,"&quot;");
                return s;
            },
            /*2.用正则表达式实现html解码*/
            htmlDecodeByRegExp:function (str){
                var s = "";
                if(str.length == 0) return "";
                s = str.replace(/&amp;/g,"&");
                s = s.replace(/&lt;/g,"<");
                s = s.replace(/&gt;/g,">");
                s = s.replace(/&nbsp;/g," ");
                s = s.replace(/&#39;/g,"\'");
                s = s.replace(/&quot;/g,"\"");
                return s;
            }
        };

        var _fLoadCss = function (url) {
            var head = document.getElementsByTagName('head')[0] || document.documentElement,
                css = document.createElement('link');
            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.href = url;
            head.insertBefore(css, head.firstChild);
        }

        return {
            htmlUtil:_HtmlUtil,
            strLength:_strLength,
            bgFlicker:TxtBoxWarn,
            setCookies: _setCookie,
            getCookies: _getCookie,
            delCookies: _delCookie,
            toJsonString: _toJsonString,
            urlParamToJson: _urlParamToJson,
            i8alert: i8alert,
            formateDate: fDateHandle,
            dateformat:dateformat,
            getUrlParam: fw_request,
            i8loading: i8loaing,
            i8closeloading: i8closeloading,
            i8loadjs: _loadjs,
            dateDiff: _dateDiff,
            sizeFormat: _sizeFormat,
            dateConverter: _dateConverter,
            subString: _subString,
            strFormat: _strFormat,
            workflowInputVerify: _workflowInputVerify,
            workflowWhiteList :_white_list,
            stringCut:fnStringCut,
            loadCss:_fLoadCss,
            replaceSpecial:replaceSpecial
        };
    } ();
    module.exports = util;
})