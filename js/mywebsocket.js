/**
 * Created by jiangjianqing on 2015/7/16.
 */
(function($){
    function WebsocketManager(){

        this.defaults={
            url:"ws://192.168.3.141:8181/websocket/mywebsocket.do",
            onopen:function(){
                console.log("websocket.onopen触发");
            },
            onclose:function(){
                console.log("websocket.onclose触发");
            },
            onerror:function(){
                console.log("websocket.onerror触发");
            },
            onmessage:function(event){
                console.log("websocket.onmessage触发:"+event.data);
            }
        }
    };

    $.extend(WebsocketManager.prototype,{
        socket:null,
       setDefaults:function(settings){
           this.defaults= $.extend({},this.defaults,settings);
           return this;
       },
        start:function(settings){
            if(this.socket!=null){
                console.log("websocket已经打开!!不能重复调用start");
                return false;
            }
            var opts= $.extend({},this.defaults,settings);
            var clearSocket=function(){
                this.socket=null;
            };
            try {
                if('WebSocket' in window){
                    this.socket = new WebSocket(opts.url);
                }else if('MozWebSocket' in window){
                    this.socket = new MozWebSocket(opts.url);
                }else{
                    alert('websocket no supported ');
                    return false;
                }

                this.socket.onclose = function() {
                    opts.onclose();
                    clearSocket();
                };

                this.socket.onopen = function() {
                    opts.onopen();
                };
                this.socket.onerror=function(){
                    opts.onerror();
                };

                this.socket.onmessage = function(event) {
                    opts.onmessage(event)
                };
                return true;
            }
            catch(exception){
                alert(exception);
                return false;
            }
        },
        stop:function(){
            if(this.socket!=null){
                this.socket.close();
                this.socket=null;
            }
        },
        sendMessage:function(msg){
            if (this.socket===null){
                console.log("sendMessage非法调用，websocket还没有打开，请先调用start方法");
                return false;
            }else{
                this.socket.send(msg);
            }
        },
        isConnected:function(){
            return this.socket!=null;
        }

    });

    $.websocketManager=new WebsocketManager();
    //websocketManager=$.websocketManager;

})(jQuery);
