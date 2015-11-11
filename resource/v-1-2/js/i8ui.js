(function($){
    var showMask = function(){
		var jsMsk = "js_msk";
		//判断遮罩层是否存在
		if(document.getElementById(jsMsk)){
			document.getElementById(jsMsk).style.display = 'block';
		} else {
			var domMsk = document.createElement('div');
			domMsk.id = jsMsk;
			domMsk.className = 'ct-msk';
			document.body.appendChild(domMsk);
		}
	}
	var closeMask = function(){
		var jsMsk = "js_msk";
		document.getElementById(jsMsk).style.display = 'none';
	}
	/*
	 *基本弹出层方法
	 *参数格式为json
	 * title 弹出层标题
	 * cont 弹出层内容
	 * btnDom 控制显示弹出层显示位置的 $对象按钮】
	 * noMask 不现实弹出层 默认为false
	 */
	var showbox = function(json){
		var titleStr = '';
		var isalert = '';
		if(json.title){
			titleStr = '<span class="ct-close">×</span><div class="ct-ly-h1">'+json.title+'</div>';
		}
		if(json.isalert){
			isalert = ' is-alert'
		}
		var divDom = document.createElement('div');
		divDom.id = new Date().valueOf(); //初始化弹出层的ID
		divDom.className = 'ct-ly' + isalert;
		divDom.innerHTML = titleStr + json.cont;
		document.body.appendChild(divDom);

		if(json.btnDom){
			json.noMask = true;
		}
		if(!json.noMask){
			showMask();
		}

		if(typeof json.success ==='function') {
			json.success();
		}
		if(typeof json.error === 'function') {
			json.error();
		}
		//关闭方法
		divDom.close = function(){
			//divDom.parentNode.removeChild(divDom);
            $(divDom).remove();
			if(!json.noMask){
				closeMask();
			}
		};
		divDom.againShow = function () {
			var $box = $(divDom);
			var n_left = $(window).width() / 2 - $box.width() / 2;
			var n_top = $(window).height() / 2 - $box.height() / 2;
			$box.css({ top: n_top, left: n_left, margin: 0, position: "fixed" });
		};
		//定位方法
		divDom.position = function(){
			var $divDom = $(divDom);
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			var winScrollTop = $(window).scrollTop();
			if(location != top.location){
				winHeight = $(window.parent).height();
				winScrollTop = $(window.parent).scrollTop();
			}
			//控制弹出层的位置
			var leftNum = winWidth / 2 - $divDom.width() / 2;
			var topNum = (winHeight / 2 - $divDom.height() / 2) + winScrollTop;
			if(json.btnDom){
				leftNum = json.btnDom.offset().left;
                if(leftNum + $divDom.width() >= winWidth){
                    leftNum = winWidth - $divDom.width();
                }
				topNum = json.btnDom.offset().top - $divDom.height() - json.btnDom.height() + 10;
			}
			if (topNum < 0){
				topNum = 0;
			}
			if(leftNum < 0){
				leftNum = 0;
			}
			$divDom.css({left: parseInt(leftNum), top: parseInt(topNum)});
		}
		divDom.position();
		//关闭事件
		$(divDom).delegate('.ct-close','click',function(){
			divDom.close();
		});
		$(divDom).delegate('.ct-ly-h1','mousedown',function (e) {
			disabledcheck();
			var _$parent = $(divDom);
			var _oldpageX = e.pageX;
			var _oldpageY = e.pageY;
			var _oldLeft = parseInt(_$parent.css("left"));
			var _oldTop = parseInt(_$parent.css("top"));
			Ileft = _oldLeft;
			Itop = _oldTop;
			$("body").attr("onselectstart", "return false").css("user-select", "none");
			$(document).mousemove(function (e) {
				Ileft = e.pageX - _oldpageX + _oldLeft;
				Itop = e.pageY - _oldpageY + _oldTop;
				var _imaxLeft = $(document).width() - _$parent.outerWidth();
				if (Ileft <= 0) {
					Ileft = 0;
				}
				if (Ileft >= _imaxLeft) {
					Ileft = _imaxLeft;
				}
				if (Itop <= 0) {
					Itop = 0;
				}
				_$parent.css({ top: Itop, left: Ileft });
				$(document).css("cursor", "move");
			});
			$(document).mouseup(function () {
				_$parent.css({ top: Itop, left: Ileft, "margin": 0 });
				$(document).css("cursor", "auto").unbind("mousemove");
				huifucheck();
			});
		});
		return	divDom;
	};
	//确定提示框
	var i8Confirm = function(json,cbk){
        //json.body谁加的 我表示不知道干嘛的 先处理一下
		var confirmHtml = (json.body? json.body : "")+'<div class="ct-ly-msg">'+ json.title +'</div>'+
			'<div class="tcenter">' +
			'<span class="ct-confirm ct-ly-btn col-blue">确定</span>'+
			'<span class="ct-cancel ct-ly-btn col-f1">取消</span>'+
			'</div>';
		var divDom = showbox({ cont: confirmHtml,btnDom:json.btnDom?json.btnDom: null,title:json.bodytitle ? json.bodytitle : null});
		//确定事件
		$(divDom).delegate('.ct-confirm','click',function(){
			cbk(divDom);
            divDom.close();
		});
		//取消事件
		$(divDom).delegate('.ct-cancel','click',function(){
			divDom.close();
		});
		return divDom
	}
	var i8alert = function (json) {
		$('div.is-alert').remove();
		if(!json.type){
			json.type = 1;
		}
        /*if(Object.prototype.toString.call(json) === '[object String]'){
            var _json=json;
            json={};
            json.type = 1;
            json.title=_json;
        };*/

		var contHtml = '<div class="ct-alert ct-at-'+ json.type +'"><i></i>'+ json.title+'</div>';
		var divDom = showbox({noMask: json.noMask == undefined ? true : json.noMask,isalert:true, btnDom:json.btnDom?json.btnDom: null, cont:contHtml});
		setTimeout(function(){
			divDom.close();
			if(json.cbk){
				json.cbk();
			}
		},2000);
	}
    
    var listLoading = function(dom){
		dom.html('<span style="line-height: 30px; text-align: center; display: block;">加载中...</span>');
	}
    
    window.showbox = showbox;
})( window.jQuery || window.Zepto )