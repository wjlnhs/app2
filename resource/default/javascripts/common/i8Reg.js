/**
 * Created by jialin on 2014/12/11.
 */
define(function (require, exports,module) {
    var i8ui=require('/default/javascripts/common/i8ui');
    function checkIsEmpty(str) {
        var re  = /^\S+$/;
        return re.test(str);
    }
    function checkMail(str) {
        var re  = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
        return re.test(str);
    }
    function checkQQ(str){
        var  re=/^\d{5,14}$/;
        return re.test(str);
    }
    function checkMobile(str){
        var  re=/0?(13|14|15|18)[0-9]{9}/;
        return re.test(str);
    }
    function checkCID(str){
        var  re=/\d{17}[\d|x]|\d{15}/;
        return re.test(str);
    }
    function checkUname(str){
        var  re=/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/;
        return re.test(str);
    }
    function checktrueName(str){
        var  re=/^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        return re.test(str);
    }
    function checkDate(str){
        var  re=/^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/;
        return re.test(str);
    }

    function checkPhone(str){
        var  re=/[0-9-()（）]{7,18}/;
        return re.test(str);
    }

    function checkPsw(str){
        var re=/^[^ ]{8,20}$/;
        return re.test(str);
    }

    function checkYzm(str){
        var re=/^[a-zA-Z0-9_]{6}$/;
        return re.test(str);
    }

    function checkAll(parent,input){
        var through=true;
        console.log($(parent).find('[i8formtype]'))
        $(parent).find('[i8formtype]').each(function(){
            var $this=$(this);
            var _value= $.trim($this.val());
            var _attr=$this.attr('i8formtype').split(':');
            var _type=_attr[0];
            var _desc=_attr[1];
            switch (_type){
                case 'mail':
                    if(!checkMail(_value)){
                        _desc=_desc || '邮箱';
                        i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                        through=false;
                    }
                    break;
                case 'phone':
                    if(!checkPhone(_value)){
                        _desc=_desc || '座机';
                        i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                        through=false;
                    }
                    break;
                case 'date':
                    if(!checkDate(_value)){
                        _desc=_desc || '日期';
                        i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                        through=false;
                    }
                    break;
                case 'mobile':
                    if(!checkMobile(_value)){
                        _desc=_desc || '手机';
                        i8ui.simpleAlert(_desc+'的格式不正确，请重新输入!',$this);
                        through=false;
                    }
                    break;
                case 'required':
                    if(!checkIsEmpty(_value)){
                        i8ui.simpleAlert(_desc+'不能为空',$this);
                        through=false;
                    }
                    break;
                case 'psw':
                    if(!checkPsw(_value)){
                        _desc=_desc ||'';
                        i8ui.simpleAlert(_desc+'密码由8~20个字符组成，区分大小写且不能有空格',$this);
                        through=false;
                    }
                    break;

            }
            if(!through){
                return false;
            }
        })
        return through;
    }
    module.exports={
        checkIsEmpty:checkIsEmpty,
        checkMail:checkMail,
        checkDate:checkDate,
        checkPhone:checkPhone,
        checkMobile:checkMobile,
        checkQQ:checkQQ,
        checkCID:checkCID,
        checkUname:checkUname,
        checktrueName:checktrueName,
        checkPsw:checkPsw,
        checkYzm:checkYzm,
        checkAll:checkAll
    }
})