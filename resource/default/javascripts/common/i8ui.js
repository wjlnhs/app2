/**
 * Created by chenshanlian on 2014/10/21.
 */
define(function(require,exports){
	require('../../stylesheets/i8ui.css');
	//显示遮罩层
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
			divDom.parentNode.removeChild(divDom);
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
		var confirmHtml = '<div class="ct-ly-msg">'+ json.title +'</div>'+
			'<div class="tcenter">' +
			'<span class="ct-confirm ct-ly-btn col-blue">确定</span>'+
			'<span class="ct-cancel ct-ly-btn col-f1">取消</span>'+
			'</div>';
		var divDom = showbox({ cont: confirmHtml,btnDom:json.btnDom?json.btnDom: null});
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
	//浮层拖动功能
	var Ileft = 0;
	var Itop = 0;
	//禁用文字选择
	function disabledcheck() {
		document.unselectable = "on";
		document.onselectstart = function () {
			return false;
		}
		$("body").css("-moz-user-select", "none");
	}
	//恢复文字选中
	function huifucheck() {
		document.unselectable = "off";
		document.onselectstart = null;
		$("body").css("-moz-user-select", "text");
	}


	(function($){
		$.fn.setSelect = function(json){
			var options = $(this).find("option");
			var _height = $(this).outerHeight();
			var _width = (json && json.width) ? json.width : $(this).width();
			var _defaultValue = '';
			var _defualtHtml = '--请选择--';
			var selectedId = '';
			if(json && json._default){
				_defualtHtml = options[0].innerHTML
				_defaultValue = $(options[0]).attr('value');
			}
			var labelDom = document.createElement('label');
			labelDom.className = 'i8-select';
			labelDom.id = $(this).attr('id');


			var optionsHtml = '<i class="i8-select-drop"></i><span class="i8-select-cked" value="'+ _defaultValue +'">'+ _defualtHtml +'</span><span class="i8-sel-options">';
			options.each(function(i){
				var id = $(this).attr("value");
				if(this.selected){
					selectedId = id
				}
				optionsHtml += '<em value="'+ id +'">'+ this.innerHTML +'</em>';
			});
			optionsHtml += '</span>';
			labelDom.innerHTML = optionsHtml;

			$(this).replaceWith(labelDom);
			var $label = $(labelDom);
			$label.setValue(selectedId);
			//$label.css({'width':_width,'height': _height, lineHeight: _height+ 2+"px"});
			$label.css({'width':_width, lineHeight: _height+ 2 +"px"});
			$label.find('.i8-sel-options').css('top',_height + 1);
			$label.delegate('em','click',function(){
				var spanDom = $(this);
				$label.find('span.i8-select-cked').html(spanDom.html()).attr('value',spanDom.attr('value'));
				$label.find('span.i8-sel-options').hide();
				if(json && json.cbk)
					json.cbk(spanDom);
				return false;
			});
			$label.click(function(){
				var labs = $('label.i8-select');
				labs.each(function(){
					if(!(this == labelDom)){
						$(this).find('span.i8-sel-options').hide()
					}
				});
				$label.find('span.i8-sel-options').toggle();
				return false;
			});
			$(document).on('click',function(){
				$('span.i8-sel-options').hide();
			});
		}
		$.fn.getValue = function(){
			return $(this).find('span.i8-select-cked').attr('value');
		}
		$.fn.setValue = function(id){
			var selectDom = $(this).find('span.i8-select-cked');
			$(this).find('span.i8-sel-options em').each(function(){
				if($(this).attr('value') == id){
					selectDom.attr('value', $(this).attr('value')).html($(this).html());
					return;
				}
			});
		}
		$.fn.setKey = function(text){
			var selectDom = $(this).find('span.i8-select-cked');
			$(this).find('span.i8-sel-options em').each(function(){
				if($.trim($(this).html()) == text){
					selectDom.attr('value', $(this).attr('value')).html($(this).html());
					return;
				}
			});
		}
		$.fn.getKey = function(){
			return $(this).find('span.i8-select-cked').html();
		}
	})(jQuery);


    //处理低版本placeHolder
    (function($){
        $.fn.placeholder=function(all){
            if(all){
                var isAdvBrowser = false;
            }else{
                var isAdvBrowser=!/msie [6,7,8,9]/.test(navigator.userAgent.toLowerCase());
            }
            this.each(function(){
                var _this=$(this);
                if(isAdvBrowser){
                    return;
                }
                _this.placeVal=_this.attr('placeholder');
                _this.val(_this.placeVal);
                _this.focus(function(){
                    if(_this.val()==_this.placeVal){
                        _this.val('');
                    }
                }).blur(function(){
                    if(_this.val()=='' || _this.val()==null){
                        _this.val(_this.placeVal);
                    }
                })
            })
            return this;
        }
    })(jQuery);

    //滚动时固定元素
    (function($){
        $.fn.scrollFixed=function(dofixcallback,undofixcallback){
            var $this=$(this);
            var _this=this;
            var _iTop=this.offset().top;
            function doinputfix(){
                var _bscroll=document.body.scrollTop || document.documentElement.scrollTop;
                if(_bscroll>_iTop){
                    $this.removeClass('rel');
                    $this.addClass('fix');
                    dofixcallback && dofixcallback.call(_this);
                }else{
                    $this.removeClass('fix');
                    $this.addClass('rel');
                    undofixcallback && undofixcallback.call(_this);
                }
            }
            $(window).scroll(function(){
                doinputfix();
            })
            doinputfix();
            return this;
        }
    })(jQuery);

    //添加addinputclear
    (function($){
        $.fn.i8searchEvent=function(ops){
            ops=ops || {};
            //自定义事件列表
            /*
             * DelayKeyUp
             * */
            //初始化参数
            ops= $.extend({
                init:function(){},
                content:'body',
                doms:{
                    clearbtn:'.app_clear_txt_btn',
                    nodata:'.nodata',
                    searchdd:'.search-dd',
                    items:('.search-dd li a')
                },
                callbacks:{
                    onChange:function(){},
                    onNoDate:function(){},
                    onEmptyInput:function(){}
                },
                htmls:{
                    nodata:'<li class="nodata">未找到匹配的信息</li>'
                },
                keydownDelay:60
            },ops)

            //合并
            var _cbks =  ops.callbacks,
                _input =  this,
                _doms = ops.doms,
                _htmls = ops.htmls,
                _times= ops.times,
                _clearbtn  =  $(ops.content).find(ops.clearbtn);
            //限定doms
            for(var domskey in _doms){
                _doms[domskey]=$(ops.content).find(_doms[domskey]);
            }
            _doms.searchdd.noItem = false;
            //初始化
            _htmls.nodata && _doms.searchdd.append(_htmls.nodata);
            ops.init();
            //input绑定keyup
            _input.keydown(function(){
                _input.keyDownVal=_input.val();
            })
                .keyup(function(ev){
                    var _keycode=ev.keyCode;
                    clearTimeout(_input.timer);
                    _input.timer=setTimeout(function(){
                        _doms.searchdd.noItem =false;//是否触发_cbks.onNoDate；
                        _doms.items.show();
                        _input.keyUpVal=_input.val();
                        if(_input.keyUpVal==''){
                            _cbks.onEmptyInput();
                            return;
                        }
                        if(_input.keyDownVal==_input.keyUpVal){
                            return;
                        }
                        _cbks.onChange(_keycode);
                        _doms.searchdd.noItem && _cbks.onNoDate();
                    },ops.keydownDelay)
                })
            return this;
        }
    })(jQuery);

    exports.showNoTitle = showbox;
	exports.showbox = showbox;
	exports.confirm = i8Confirm;
	exports.alert = i8alert;
	exports.loading = listLoading;
	exports.error = function(message){
		i8alert({title: message});
	}
	exports.write= function(message){
		i8alert({title: message,type:2});
	}
    exports.simpleAlert= function(message,btnDom){
        i8alert({title: message,type:1,btnDom:btnDom});
    }
});