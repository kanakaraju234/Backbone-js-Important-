(function (global) {
    'use strict';

    var _TemplateManager = global.TemplateManager;

    function TemplateManager() {
        var cache = {};

        return {
            get: function (path) {

                var deferred = new $.Deferred(),
                    resolvePromise = function (template) {
                        deferred.resolveWith( null, [   template  ] );
                    };

                if (cache[path]) {
                    resolvePromise( cache[path] );
                } else {
                    $.ajax({
//                        url: ( "/"+path + ".html?_="+$.now()),
                        url: ( "/"+path + "?_="+$.now()),
                        success: function (data) {
//                        	data = Base64.decode(data);
                            cache[path] = data;
                            resolvePromise( data );
                        },
                        error: function () {
                            deferred.reject();
                        }
                    });
                }

                return deferred.promise();
            },

            noConflict: function () {
                global.TemplateManager = _TemplateManager;
                return TemplateManager;
            }
        };
    }

    global.TemplateManager = new TemplateManager();

})(window);





var Service = Backbone.View.extend({
    el:$("#container"),
    
    render:function(){
        var template = _.template($("#service").html());
        this.$el.html(template);
    }
});

var Classes = Backbone.View.extend({
    el:$("#container"),
    
    render:function(){
        var template = _.template($("#classes").html());
    
        this.$el.html(template);
    }
});
var Resources = Backbone.View.extend({
    el:$("#container"),
    
    render:function(){
        var template = _.template($("#resources").html());
        this.$el.html(template);
    }
});

//Team view

var Team = Backbone.View.extend({
    el:$("#container"),
    template:_.template($("#team").html()),
    render:function()
    
    {
        this.$el.html(this.template);
    }
    
});

var Location = Backbone.View.extend({
    el:$("#container"),
//    template:_.template("location rendered"),
    render:function()    
    {
        var _this = this;
        var complete = [];
		complete.push(TemplateManager.get('template/location.html'));
		$.when.apply($, complete).done(function(template){
            _this.$el.html(template);
        });
    }
    
});

var Router = Backbone.Router.extend({
    routes:{
        "":"Service",
        "Service/:id":"services",
        "Team":"Team",
        "Location":"Location"
    },
    Service:function(){
        console.log("hai")
    },
    Team:function(){
        console.log("hai team..");
        var team = new Team();
        team.render();
    },
    
    Location:function(){
        console.log("hai2")
        var location = new Location();
        location.render();
    },
     services:function(id){
        console.log("name:"+id)
         if(id == "services")
        {
         var service = new Service();
         service.render();
            
         } else if(id == "classes")
             
         {
             console.log('classes..');
             var classes = new Classes();
             classes.render();
         }else
             
         {
             console.log("resources...");
             var resources = new Resources();
             resources.render();
         }
    }
    
    
});

var router = new Router();

Backbone.history.start();