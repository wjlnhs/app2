define(function(require,exports){
    function getAstro(birthday) {
        var time = new Date(birthday.replace(/-/g,"/"));
        var v_month = time.getMonth() + 1;
        var v_day = time.getDay();
        if ((v_month == 12 && v_day >= 22)
            || (v_month == 1 && v_day <= 20)) {
            return "魔羯座";
        }
        else if ((v_month == 1 && v_day >= 21)
            || (v_month == 2 && v_day <= 19)) {
            return "水瓶座";
        }
        else if ((v_month == 2 && v_day >= 20)
            || (v_month == 3 && v_day <= 20)) {
            return "双鱼座";
        }
        else if ((v_month == 3 && v_day >= 21)
            || (v_month == 4 && v_day <= 20)) {
            return "白羊座";
        }
        else if ((v_month == 4 && v_day >= 21)
            || (v_month == 5 && v_day <= 21)) {
            return "金牛座";
        }
        else if ((v_month == 5 && v_day >= 22)
            || (v_month == 6 && v_day <= 21)) {
            return "双子座";
        }
        else if ((v_month == 6 && v_day >= 22)
            || (v_month == 7 && v_day <= 22)) {
            return "巨蟹座";
        }
        else if ((v_month == 7 && v_day >= 23)
            || (v_month == 8 && v_day <= 23)) {
            return "狮子座";
        }
        else if ((v_month == 8 && v_day >= 24)
            || (v_month == 9 && v_day <= 23)) {
            return "处女座";
        }
        else if ((v_month == 9 && v_day >= 24)
            || (v_month == 10 && v_day <= 23)) {
            return "天秤座";
        }
        else if ((v_month == 10 && v_day >= 24)
            || (v_month == 11 && v_day <= 22)) {
            return "天蝎座";
        }
        else if ((v_month == 11 && v_day >= 23)
            || (v_month == 12 && v_day <= 21)) {
            return "射手座";
        }
        return "";
    }
    exports.getXingZuo = getAstro;
});
