/**
 * Created by kimmy on 2017/2/28.
 */
var Lottery = function (prizesCount) {
    this.prizesCount = 9;
    this.wonIndex = 1;
    this.startDrawIndex = 1;
    if (prizesCount) {
        this.setPrizesCount(prizesCount);
    }
};
Lottery.prototype = {
    speed:200,
    start: function (speedCtrlFn) {
        var that=this;
        // 速度控制函数  speedCtrlFn(this.speedState) ==> state = start | decay
        this.speedCtrlFn = speedCtrlFn || function(state){
                var speed = that.speed;
                switch (state) {
                    case "start":
                        break;
                    case "decay":
                        var maxInterval = 400;
                        speed = Math.min(speed + this.decayIndex * (maxInterval / this.decayDistance), 600);
                        break;
                };
                return speed;
            };

        this.startDraw();
    },
    startDraw: function(){
        this.drawIndex = this.startDrawIndex;
        this.isDrawing = true;

        this.startIndex = 1;
        this.speedState = "start";

        this.drawing(function(){
            this.startIndex++;
            if (this.isDrawing) {
                return true;
            } else {
                // 停止抽奖流程了~应该从 drawIndex --> wonIndex
                // 理论应该有一个衰变操作
                this.decay();
                return false;
            }
        });
    },
    decay: function(){
        // 开始衰变的索引
        // 如果 decayDistance > prizesCount，则 decayDistance % prizesCount = 真正需要衰变的索引
        var decayIndex = this.wonIndex - (this.decayDistance % this.prizesCount);
        if (decayIndex <= 0) {
            decayIndex += this.prizesCount;
        }

        // 一直 drawing，知道 drawIndex == decayIndex，则开始 decayDrawing
        this.drawing(function(){
            if (this.drawIndex == decayIndex) {
                this.decayDraw();
                return false;
            }
            return true;
        });
    },
    decayDraw: function(){
        // 当前开始衰变的索引
        this.decayIndex = 1;
        this.speedState = "decay";

        this.drawing(function(){
            this.decayIndex++;
            if (this.decayIndex >= this.decayDistance && this.drawIndex == this.wonIndex) {
                // 执行最后的回掉函数
                this.wonCallback && this.wonCallback(this.wonIndex);
                return false;
            }
            return true;
        });
    },
    setDecayDistance: function(distance){
        this.decayDistance = distance;
        return this;
    },
    drawing: function(sholdContinue, drawTime){
        var self = this;
        window.clearTimeout(self.drawTimer);
        var CostTime=drawTime || self.speedCtrlFn.call(this, this.speedState) || 200;
        self.drawingCallback && self.drawingCallback(self.drawIndex,CostTime);

        if (sholdContinue && sholdContinue.call(self)) {
            self.drawTimer = window.setTimeout(function(){
                self.increaseDrawIndex();
                self.drawing(sholdContinue);
            },CostTime);
        }
    },
    increaseDrawIndex: function(){
        this.drawIndex++;
        if (this.drawIndex > this.prizesCount) {
            this.drawIndex = 1;
        }
    },
    stop: function(){
        this.isDrawing = false;
    },
    cancel: function(){
        this.stop();
        window.clearTimeout(this.drawTimer);
        this.cancelCallback && this.cancelCallback();
    },
    setPrizesCount: function(count){
        this.prizesCount = count;

        // TODO 衰变距离，在这里计算
        this.setDecayDistance(Math.round(this.prizesCount / 4 + Math.random() * this.prizesCount / 4) || 1);

        return this;
    },
    setWonIndex: function(index){
        this.wonIndex = index;
        return this;
    },
    setDrawingCallback: function(callback){
        this.drawingCallback = callback;
        return this;
    },
    setWonCallback: function(callback){
        this.wonCallback = callback;
        return this;
    },
    setCancelCallback: function(callback){
        this.cancelCallback = callback;
        return this;
    },
    setspeedCallback: function(callback){

    },
    setInitSpeed: function(speed){
        this.speed = speed;

    }
};