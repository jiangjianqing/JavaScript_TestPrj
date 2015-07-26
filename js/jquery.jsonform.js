/**
 * Created by jiangjianqing on 2015/6/30.
 */
(function($){
    function JsonForm(){
      this.defaults={
          elementStyleName:'none',// object | none
          elementExecuteEvents:['checkbox','radio','select-one'],
          debug:true
      };
    };

    $.extend(JsonForm.prototype,{
            setDefaults:function(settings){
                this.defaults= $.extend({},this.defaults,settings);
                return this;
            },
            fill:function(obj,$formElement,settings){
                var opts=$.extend({},this.defaults,settings);
                if($formElement.prop("tagName")!='FORM'){
                    if(opts.debug)
                        printDebugInfo('JsonForm.fill发现参数错误：期望元素类型为form');
                    return false;
                }
                $formElement.find('input[name],select[name],textarea[name]').each(function(index,item){
                    try{
                        var $item=$(item);
                        var inputName=$item.prop('name');
                        var objName;
                        var arrayAttribute;
                        var arrayInputRE=/\[[0-9]+\]\./i;
                        if(inputName.match(arrayInputRE)){
                            if(opts.elementStyleName=='object'){
                                objName = inputName.replace(/^[0-9a-zA-Z]+\./i, 'obj.').replace(/\[[0-9]*\].*/i, "");
                            }else{
                                objName = 'obj.'+inputName.replace(/\[[0-9]*\].*/i, "");
                            }
                            arrayAttribute = inputName.match(/\[[0-9]*\]\.[a-z0-9]*/i) + "";
                            arrayAttribute = arrayAttribute.replace(/\[[0-9]*\]\./i, "");
                        }else{
                            if(opts.elementStyleName=='object'){
                                objName='obj.'+inputName.replace(/^[0-9a-zA-Z]+\./i,'');
                            }else{
                                objName='obj.'+inputName;
                            }
                        }

                        var value=eval(objName);

                    }catch(e){
                        if(opts.debug)
                            printDebugInfo(e.message);
                    }
                    if(value!=null){
                        printDebugInfo(objName+'= '+value+',type='+$item.prop('type'));
                        switch($item.prop('type')){
                            case "hidden":
                            case "password":
                            case "textarea":
                                $item.val(value);
                                break;

                            case "text":
                                if ($item.hasClass("hasDatepicker")) {

                                } else if ($item.attr("alt") == "double") {
                                    $item.val(value.toFixed(2));
                                } else {
                                    $item.val(value);
                                }
                                break;

                            case "select-one":
                                if (value) {
                                    $item.val(value);
                                }
                                break;
                            case "radio":
                                if ($item.val() == value) {
                                    $item.prop("checked", "checked");
                                }
                                break;
                            case "checkbox":
                                if ($.isArray(value)) {
                                    $.each(value, function(i, arrayItem) {
                                        if (typeof(arrayItem) == 'object') {
                                            arrayItemValue = eval("arrayItem." + arrayAttribute);
                                        } else {
                                            arrayItemValue = arrayItem;
                                        }
                                        if ($item.val() == arrayItemValue) {
                                            $item.prop("checked", "checked");
                                        }
                                    });
                                } else {
                                    if ($item.val() == value) {
                                        $item.prop("checked", "checked");
                                    }
                                }
                                break;
                        }
                        //executeEvents(item);
                    }
                });
                return true;
            },
            getJson:function($formElement,settings){
                var opts= $.extend({},this.defaults,settings);
                var obj={};
                if($formElement.prop('tagName')!='FORM'){
                    if(opts.debug)
                        printDebugInfo('JsonForm.getJson发现参数错误：期望元素类型为form');
                    return null;
                }
                $formElement.find('input[name],select[name],textarea[name]').each(function(index,item){
                    var $item=$(item);
                    var inputName=$item.prop('name');
                    var objName;
                    var isArrayAttribute=false;
                    var arrayAttribute;
                    var arrayInputRE=/\[[0-9]+\]\./i;
                    if(inputName.match(arrayInputRE)){
                        isArrayAttribute=true;
                        if(opts.elementStyleName=='object'){
                            objName=inputName.replace(/^[0-9a-zA-Z]+\./i,'obj.').replace(/\[[0-9]+\].*/i,'');
                        }else{
                            objName = 'obj.'+inputName.replace(/\[[0-9]*\].*/i, "");
                        }
                        arrayAttribute=inputName.match(/\[[0-9]+\]\.[0-9a-zA-Z]*/i) + "";
                        arrayAttribute=arrayAttribute.replace(/\[[0-9]+\]\./i,'');
                    }else{
                        if(opts.elementStyleName=='object'){
                            objName='obj.'+inputName.replace(/^[0-9a-zA-Z]+\./i,'');
                        }else{
                            objName='obj.'+inputName;
                        }
                    }


                    var value=$item.val();
                    switch($item.prop('type')){
                        case "hidden":
                        case "password":
                        case "textarea":
                            eval(objName+'="'+value+'"');
                            break;

                        case "text":
                            eval(objName+'="'+value+'"');
                            break;

                        case "select-one":
                            eval(objName+'="'+value+'"');
                            break;
                        case "radio":
                            if($item.prop('checked')==true)
                                eval(objName+'="'+value+'"');
                            break;
                        case "checkbox":
                            if(isArrayAttribute && $item.prop('checked')==true){
                                var str='if (typeof('+objName+')=="undefined") '+objName+'=[];  return '+objName;
                                var array=(new Function('obj',str))(obj);
                                var tmpArrayItem=eval('({'+arrayAttribute+':"'+$item.val()+'"})');
                                array.push(tmpArrayItem);
                                printDebugInfo(tmpArrayItem);
                            }else{

                            }
                            break;
                    }
                });
                return obj;
            }
        }

    );

    $.jsonform=new JsonForm();
    $.fn.JsonForm=function(obj,settings){
        $.jsonform.fill(obj,this,settings);
        return this;
    };

    function executeEvents($element) {
        if ($.inArray($element.attr('type'), $.jsonform.defaults.elementsExecuteEvents)) {
            if ($element.attr('onchange')) {
                $element.change();
            }

            if ($element.attr('onclick')) {
                $element.click();
            }
        }
    };


    function printDebugInfo(message){
        if(typeof debug=='object' && debug.warn){
            debug.warn(message);
        }else{
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        }
    }
})(jQuery);