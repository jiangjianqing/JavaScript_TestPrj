/**
 * Created by jiangjianqing on 2015/7/2.
 * @version     0.1
 * @since       2015.07.01
 * @author      jiangjianqing
 * @package     jQuery Plugins
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function($){
    function Themehelper(){
      this.defaults={
          themeLocation:"css/themes",
          cssFilename:"jquery-ui.css",
          allThemeNames:[
            "smoothness","black-tie","le-frog","overcast","start"
          ],
          defaultThemeName:"black-tie",
          cssLinkId:"#theme",
          cookieName:"theme",
          debug:false
      };

    }
    $.extend(Themehelper.prototype,{
        setDefaults:function(settings){
            this.defaults= $.extend({},this.defaults,settings);
           return this;
       },
        changeTheme:function (themeName){
            var opts= $.extend({},this.defaults);
            var themeUrl=function getThemeUrl(){
                return opts.themeLocation+"/"+themeName+"/"+opts.cssFilename;
            };
            $(this.defaults.cssLinkId).attr("href",themeUrl);
            $.cookie(this.defaults.cookieName,themeName) ;
            if(this.defaults.debug)
                printDebugInfo("改变主题为："+themeName);
        },
        initThemehelper:function(obj,$element,setting){
            var thishelper=this;
            var opts= $.extend({},this.defaults,setting);
            if($element.prop("tagName")!='SELECT'){
                    printDebugInfo('ThemeHelper.initThemehelper发现参数错误：期望元素类型为select');
                return false;
            }
            $element.empty();
            $.each(opts.allThemeNames,function(index,item){
                var $option=$('<option>').val(item).text(item);
                $element.append($option);
            });
            var currentThemeName=$.cookie(this.defaults.cookieName);

            if(currentThemeName==null){
                currentThemeName=thishelper.defaults.defaultThemeName;
            }else{
                if(this.defaults.debug)
                printDebugInfo('上次记录的主题='+currentThemeName);
            }


            $element.change(function(){
                var themeName = $(this).find("option:selected").val();
                if (themeName!=null)
                    thishelper.changeTheme(themeName);
            });
            /*用下面的表达式代替显式迭代
            $element.find("*").each(function(index,item){
                $item=$(item);
                if($item.val()==currentThemeName)
                    $item.prop("selected","selected");
            });*/
            var $nowthemeitem=$element.find("option[value="+currentThemeName+"]");
            if ($nowthemeitem.length==0){
                $nowthemeitem=$element.find(":eq(0)");
                if(this.defaults.debug)
                    printDebugInfo('ThemeHelper没有找到准备使用的主题='+currentThemeName+',改为使用第一个主题='+$nowthemeitem.val());
            }
            $nowthemeitem.prop("selected","selected");
            $element.change();
            return true;
        }
    });

    $.themehelper=new Themehelper();
    $.fn.Themehelper=function(obj,setting){
        $.themehelper.initThemehelper(obj,this,setting);
        return this;
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
}));
