
$(function () {
    window.api.getName(function (name) {
      console.log(name)
    })
    var menu=['云吞面', 'M记', '烧腊饭', '煲仔饭', '汤饭', '猪脚饭', '饺子', '辣子鸡'];
    for (var i = menu.length; i-- ; ){
        localStorage.getItem('food'+i)||localStorage.setItem('food'+i, menu[i]||'food');
    }
    localStorage.obj || localStorage.setItem('obj','[]');
    localStorage.plan || localStorage.setItem('plan','[]');
    localStorage.hasDone || localStorage.setItem('hasDone','[]');

    // 抽奖转盘逻辑 fis3引入
    __inline('抽奖.js');

    var pageManager = {
        $container: $('#content'),
        _pageStack: [],
        _configs: [],
        _defaultPage: null,
        _isGo: false,
        default: function (defaultPage) {
            this._defaultPage = defaultPage;
            return this;
        },
        init: function () {
            var self = this;

            $(window).on('hashchange', function (e) {

                var _isBack = !self._isGo;
                self._isGo = false;
                if (!_isBack) {
                    return;
                }

                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var found = null;

                for(var i = 0, len = self._pageStack.length; i < len; i++){
                    var stack = self._pageStack[i];
                    if (stack.config.url === url) {
                        found = stack;
                        break;
                    }
                }
                if (found) {
                    self.back();
                }
                else {
                    goDefault();
                }
            });

            function goDefault(){
                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var page = self._find('url', url) || self._find('name', self._defaultPage);
                switch (page.name){
                    case 'home':self.go(page.name,{'#Name':localStorage.uName||"你的昵称"});break;
                    case 'eat':self.go(page.name,self.goEat());break;
                    case 'note':self.go(page.name,{'#event':self.goPlan()});break;
                    case "dataPlan":self.go(page.name,{'.goingToDo':self.goDatePlan(),'.ThingHasDone':self.goDatePlanHasDone()});break;
                    case "holiday": self.go(page.name,{'.pageTitle':self.getDate(true),'.pageSecondTitle':self.getDate()});break;
                    default : self.go(page.name);break;
                }
            }


            goDefault();
            console.log(self._pageStack);
            return this;
        },
        push: function (config) {
            this._configs.push(config);
            return this;
        },
        go: function (to,editObj) {
            var config = this._find('name', to);
            if (!config) {
                return;
            }

            var html = $(config.template).html();
            var $html = $(html).addClass('slideIn').addClass(config.name);
            if(editObj){
                this.matchStorage($html,editObj);
            }
            this.$container.append($html);
            this._pageStack.push({
                config: config,
                dom: $html
            });

            this._isGo = true;
            location.hash = config.url;

            if (!config.isBind) {
                this._bind(config);
            }

            return this;
        },
        matchStorage:function(html,obj){
            //todo:优化呀
            for( var i in obj){
                //处理食物页
                switch (i){
                    case "foodId":
                        console.log(obj[i]);
                        var temp=localStorage.foodId=obj[i];
                        html.find('#testEdit').val(localStorage.getItem('food'+localStorage.foodId)||"无");
                        break;
                    case "menuId":
                        $('#pageEat .weui_grid:not(.begin)')
                            .eq(localStorage.foodId)
                            .find('.weui_grid_label')
                            .html(localStorage.getItem('food'+localStorage.foodId));
                        break;
                    case  "thingId":
                        html.find('#DayPlanEdit3').val(obj[i][2]);
                        html.find('#DayPlanEdit4').val(obj[i][3]);
                        if(obj[i][0]){
                            html.find('.confirm').data('id',obj[i][1]);
                        }
                        else{
                            html.find('.confirm').data('idDone',obj[i][1]);

                        }

                        break;
                    default : html.find(i).html(obj[i]);break;
                }
            }
            return html;
        },
        back: function (refresh) {
            var stack = this._pageStack.pop();
            if (!stack) {
                return;
            }
            stack.dom.addClass('slideOut').on('animationend', function () {
                stack.dom.remove();
            }).on('webkitAnimationEnd', function () {
                stack.dom.remove();
            });
            var target=this._pageStack[this._pageStack.length-1];
            switch (target.config.name){
                case 'home':this.matchStorage(target.dom,{'#Name':localStorage.uName||"你的昵称"});break;
                case 'eat':this.matchStorage(target.dom,{'menuId':localStorage.foodId||0});break;
                case 'note':this.matchStorage(target.dom,{'#event':this.goPlan()});break;
                case "dataPlan":this.matchStorage(target.dom,{'.goingToDo':this.goDatePlan(),'.ThingHasDone':this.goDatePlanHasDone()});break;
                case "holiday": this.matchStorage(target.dom,{'.pageTitle':this.getDate(true),'.pageSecondTitle':this.getDate()});break;

                default :break;
            }
            return this;
        },
        _find: function (key, value) {
            var page = null;
            for (var i = 0, len = this._configs.length; i < len; i++) {
                if (this._configs[i][key] === value) {
                    page = this._configs[i];
                    break;
                }
            }
            return page;
        },
        _bind: function (page) {
            var events = page.events || {};
            for (var t in events) {
                for (var type in events[t]) {
                    this.$container.on(type, t, events[t][type]);
                }
            }
            page.isBind = true;
        },
        goEat:function(){
        var result={};
        for(var i=8;i--;){
            result['.food'+(i+1)]=localStorage.getItem('food'+i);
        }
        return result;
        },
        goPlan:function(){
            var result="";

            var test = JSON.parse(localStorage.obj);
            for(var i= 0,max=test.length;i<max;i++){
                result+='<a class="weui_cell NoteThing" href="javascript:;">\
                    <div class="weui_cell_bd weui_cell_primary">\
                    <p>'+test[i].content+'</p>\
                    </div>\
                    <div class="weui_cell_ft">\
                    </div>\
                    </a>';
            }
            return result;
        },
        goDatePlan:function(){
            var result="";

            var test = JSON.parse(localStorage.plan);
            if(test.length===0){
                result+='&nbsp;&nbsp;&nbsp;&nbsp;找点事做╮(╯▽╰)╭';
            }
            for(var i= 0,max=test.length;i<max;i++){

                result+='<a class="weui_cell ThingItem" href="javascript:;">\
                 <div class="weui_cell_hd">\
                    <i class="weui_icon_waiting"></i>\
                    </div>\
                    <div class="weui_cell_bd weui_cell_primary">\
                    <p>'+test[i].content+'</p>\
                    </div>\
                    <div class="weui_cell_ft">'+test[i].content2+'</div>\
                    </a>';
            }
            return result;
        },
        goDatePlanHasDone:function(){
            var result="";

            var test = JSON.parse(localStorage.hasDone);
            for(var i= 0,max=test.length;i<max;i++){

                result+='<a class="weui_cell ThingItemDone" href="javascript:;">\
                 <div class="weui_cell_hd">\
                    <i class="weui_icon_success"></i>\
                    </div>\
                    <div class="weui_cell_bd weui_cell_primary">\
                    <p>'+test[i].content+'</p>\
                    </div>\
                    <div class="weui_cell_ft">'+test[i].content2+'</div>\
                    </a>';
            }
            return result;
        },
        getDate:function(isTitle){
            var time = new Date();
            var day=time.getDay();
            if(isTitle){
                var dayNames = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
                return '今天是'+dayNames[day];
            }else{
                if(day>=1&&day<=5)
                return '理论上还有'+(6-day)+'天放假';
                return '今天放假啦~~！！'
            }
        }
    };
    var getNoteEvent=function(){
        var result=localStorage.getItem('obj')||"";
        if(result)
            return JSON.parse(result);
        return [];
    };
    var getPlanEvent=function(){
        var result=localStorage.getItem('plan')||"";
        if(result)
        return JSON.parse(result);
        return [];
    };
    var getPlanDoneEvent=function(){
        var result=localStorage.getItem('hasDone')||"";
        if(result)
            return JSON.parse(result);
        return [];
    };
    var hideActionSheet=function(weuiActionsheet, mask) {
        weuiActionsheet.removeClass('weui_actionsheet_toggle');
        mask.removeClass('weui_fade_toggle');
        weuiActionsheet.on('transitionend', function () {
            mask.hide();
        }).on('webkitTransitionEnd', function () {
            mask.hide();
        })
    };
    var showAlert=function(title,txt,cb){
        var $dialog = $('#dialog1');
        $dialog.find('.weui_dialog_title').html(title);
        $dialog.find('.weui_dialog_bd').html(txt);
        $dialog.removeClass('hide');
        $dialog.find('.default').off('click').on('click', function () {
            $dialog.addClass('hide');
        });
        $dialog.find('.primary').off('click').on('click', function () {
            $dialog.addClass('hide');
            cb && cb();
        });
    };

    var home = {
        name: 'home',
        url: '#',
        template: '#tpl_home',
        events: {
            '.weui_grid': {
                click: function (e) {
                    var id = $(this).data('id');
                    switch (id){
                        case "eat": pageManager.go(id,pageManager.goEat());break;
                        case "note": pageManager.go(id,{'#event':pageManager.goPlan()});break;
                        case "dataPlan": pageManager.go(id,{'.goingToDo':pageManager.goDatePlan(),'.ThingHasDone':pageManager.goDatePlanHasDone()});break;
                        case "holiday": pageManager.go(id,{'.pageTitle':pageManager.getDate(true),'.pageSecondTitle':pageManager.getDate()});break;
                        default :pageManager.go(id);break;
                    }

                }
            },
            '#Name':{
                click: function(e){
                    pageManager.go('edit',{'#editTitle':'编辑昵称'});
                }
            }

        }
    };
    var eat = {
        name: 'eat',
        url: '#eat',
        template: '#tpl_eat',
        events: {
            '.begin': {
                click: function (e) {
                    var self=this;
                    var lottery = new Lottery(8);
                    lottery.setDrawingCallback(function(index,speed){
                        var target='.icon'+index;
                        console.log(target,speed);
                        $(self).siblings(target).addClass('active').siblings().removeClass('active');
                             });

                    lottery.setInitSpeed(100);
                    lottery.setDecayDistance(10 + Math.round(Math.random() * 3));
                    lottery.start();
                    setTimeout(function(){

                        console.log("finish!")
                        lottery.setWonIndex((Math.random() * 8+1)<<0);
                        lottery.stop();
                    }, 2000);

                }
            },
            '#pageEat .weui_grid:not(.begin)': {
                click: function (e) {
                    console.log($(this).index());
                    pageManager.go('edit',{'#editTitle':'编辑食物','foodId':$(this).index()});

                }
            }
        }
    };
    var dataPlan = {
        name: 'dataPlan',
        url: '#dataPlan',
        template: '#tpl_dataPlan',
        events: {
            '#commitMenu': {
                click: function (e) {
                    var mask = $('#mask');
                    var weuiActionsheet = $('#weui_actionsheet');
                    weuiActionsheet.addClass('weui_actionsheet_toggle');
                    mask.show().addClass('weui_fade_toggle').off('click').on('click',function () {
                        hideActionSheet(weuiActionsheet, mask);
                    });
                    $('#actionsheet_cancel').off('click').on('click',function () {
                        console.log("h");
                        hideActionSheet(weuiActionsheet, mask);
                    });

                    weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');


                }
            },
            '#actionsheet_add': {
                click: function (e) {
                    var mask = $('#mask');
                    var weuiActionsheet = $('#weui_actionsheet');
                    pageManager.go('editPlan');
                    hideActionSheet(weuiActionsheet, mask);
                }
            },
            '#actionsheet_deleteAll': {
                click: function (e) {
                    var mask = $('#mask');
                    var weuiActionsheet = $('#weui_actionsheet');
                    hideActionSheet(weuiActionsheet, mask);
                    showAlert('清空计划','确定清空所有日程计划？',function(){
                        localStorage.setItem('plan','[]');
                        localStorage.setItem('hasDone','[]');
                        pageManager.matchStorage($('#DATA'),{'.goingToDo':pageManager.goDatePlan()});
                        pageManager.matchStorage($('#DATA'),{'.ThingHasDone':pageManager.goDatePlanHasDone()});
                    });

                }
            },
            '.ThingItem': {
                click: function (e) {
                    pageManager.go('editPlanItem',{'thingId':[1,$(this).index(),$(this).find('p').html(),$(this).find('.weui_cell_ft').html()]});
                }
            },
            '.ThingItemDone': {
                click: function (e) {
                    pageManager.go('editPlanItem',{'#ItemDone':'NotDone','thingId':[0,$(this).index(),$(this).find('p').html(),$(this).find('.weui_cell_ft').html()]});
                }
            }

        }
    };
    var editPlan = {
        name: 'editPlan',
        url: '#editPlan',
        template: '#tpl_editPlan',
        events: {
            '#DayPlanCommit': {
                click: function (e) {
                    var val=$.trim($('#DayPlanEdit').val());
                    var val2=$.trim($('#DayPlanEdit2').val());
                    console.log("step1 ",val);

                    if(val){
                        //todo:优化
                        var temp=getPlanEvent();
                        console.log("step2 ",val);
                        temp.push({'content':val,'content2':val2||""});
                        localStorage.plan=JSON.stringify(temp);
                        window.history.go(-1);
                    }
                }
            }
        }
    };
    var editPlanItem = {
        name: 'editPlanItem',
        url: '#editPlanItem',
        template: '#tpl_editPlanItem',
        events: {
            '#ItemDelete': {
                click: function (e) {
                    var parent=$(this).closest('.confirm');
                    var array=getPlanEvent()||[];
                    var array2=getPlanDoneEvent()||[];
                    if(parent.data('id')||parent.data('id')===0){
                        array.splice(parent.data('id'),1);
                            localStorage.setItem('plan',JSON.stringify(array));
                    }else{
                        array2.splice(parent.data('idDone'),1)
                        localStorage.setItem('hasDone',JSON.stringify(array2));
                    }
                   // console.log(array);
                    window.history.go(-1);
                }
            },
            '#ItemDone': {
                click: function (e) {
                    var parent=$(this).closest('.confirm');
                    var array=getPlanEvent()||[];
                    var array2=getPlanDoneEvent()||[];

                    if(parent.data('id')||parent.data('id')===0){
                        var temp=array.splice(parent.data('id'),1)[0];
                        array2.push(temp);
                        localStorage.setItem('hasDone',JSON.stringify(array2)) ;
                            localStorage.setItem('plan',JSON.stringify(array));
                    }else{
                        array.push(array2.splice(parent.data('idDone'),1)[0]);
                        localStorage.setItem('hasDone',JSON.stringify(array2)) ;
                        localStorage.setItem('plan',JSON.stringify(array));
                    }
                     //console.log(array,array2,temp);
                    window.history.go(-1);

                }
            },
            '#ItemCommit': {
                click: function (e) {
                    var parent=$(this).closest('.confirm');
                    var array=getPlanEvent()||[];
                    var array2=getPlanDoneEvent()||[];
                    var val=$.trim($('#DayPlanEdit3').val());
                    var val2=$.trim($('#DayPlanEdit4').val());
                    console.log(parent.data('id'));

                    if(parent.data('id')||parent.data('id')===0){
                        console.log('修改notDone');
                        if(val){
                            console.log(val,val2,parent.data('id'),array);
                            array[parent.data('id')]={'content':val,'content2':val2||""};
                            localStorage.setItem('plan',JSON.stringify(array));
                        }
                    }else{
                        console.log('修改done');
                        if(val){
                            console.log('修改done2');
                            array2[parent.data('idDone')]={'content':val,'content2':val2||""};
                            localStorage.setItem('hasDone',JSON.stringify(array2));

                        }
                    }
                    window.history.go(-1);


                }
            }

        }
    };
   var note = {
        name: 'note',
        url: '#note',
        template: '#tpl_note',
        events: {
           '#AddEvent': {
               click: function (e) {
                   var val=$.trim($('#eventInput').val());
                   if(val){
                       //todo:优化
                            var temp=getNoteEvent();
                            temp.push({'content':val});
                           localStorage.obj=JSON.stringify(temp);
                       pageManager.matchStorage($('#notePage'),{'#event':pageManager.goPlan()});
                       $('#eventInput').val('');
                   }
               }
           },
            '.NoteThing': {
                click: function (e) {
                    var index=$(this).index();
                    showAlert('删除事项','确定删除此备忘项？',function(){
                        var array=getNoteEvent()||[];
                        array.splice(index,1);
                        localStorage.setItem('obj',JSON.stringify(array));
                        pageManager.matchStorage($('#notePage'),{'#event':pageManager.goPlan()});

                    });

                }
            }

        }
    };
    var holiday = {
        name: 'holiday',
        url: '#holiday',
        template: '#tpl_holiday'
    };
   var mirror = {
        name: 'mirror',
        url: '#mirror',
        template: '#tpl_mirror',
        events: {
           '#showDialog': {
               click: function (e) {
                   showAlert('镜子功能','请按下锁屏键，激活系统镜子功能');
               }
           }
        }
    };
    var edit = {
        name: 'edit',
        url: '#edit',
        template: '#tpl_edit',
        events: {
            '#commit': {
                click: function (e) {
                    //console.log(pageManager._pageStack);
                    var target=pageManager._pageStack[pageManager._pageStack.length-2];
                    if(target){
                        var val=$('#testEdit').val();
                        if($.trim(val)){
                            switch (target.config.name){
                                case "home":localStorage.uName=val||"your name";break;
                                case "eat":localStorage.setItem('food'+localStorage.foodId, val||'food');break;
                            }
                        }
                        //console.log(target.config.url);
                        window.history.go(-1);
                    }else{
                        return false;
                    }

                }
            }
        }
    };

    var chooser = {
        name: 'chooser',
        url: '#chooser',
        template: '#tpl_chooser',
        events: {
            '.center': {
                click: function (e) {
                        if(window.doing){
                            return false;
                        }
                        var $Out=$('.circleOut');
                        var $In=$('.circleIn');
                        var $Btn=$(".C-btn");
                        var className=Math.random()>0.45?'left':'right';
                        console.log(className);
                        window.doing=true;
                        $Out.removeClass("left right");
                        $In.removeClass('S-left S-right');
                        window.clock2=setTimeout(function(){
                            clearTimeout(window.clock2);
                            $Btn.html("Wait");
                            $Out.addClass(className);
                            $In.addClass('S-'+className);
                        },50);
                        window.clock=setTimeout(function(){
                            clearTimeout(window.clock);
                            $Btn.html("Click");
                            window.doing=false;
                        },4000);



                }
            }
        }
    };


    pageManager.push(home)
        .push(eat)
        .push(dataPlan)
        .push(note)
        .push(holiday)
        .push(mirror)
        .push(edit)
        .push(editPlan)
        .push(editPlanItem)
        .push(chooser)

        .default('home')
        .init();
});