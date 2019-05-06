export default{ 
  data: {
    percentage: '',           //百分比
    animTime: '',             // 动画执行时间
    curProgress: 0,           //当前进度
    isAniming: false,         //是否正在执行动画
    animCompleteCB:undefined, //动画执行完成回调方法
  },
  options:{
    // 绘制圆形进度条方法
    run(c, w, h) {
      let that = this;
      var num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
      that.data.ctx2.arc(w, h, w - 10, -0.5 * Math.PI, num); //每个间隔绘制的弧度
      that.data.ctx2.setStrokeStyle("#ff5e7b");
      that.data.ctx2.setLineWidth("3");
      that.data.ctx2.setLineCap("round");
      that.data.ctx2.stroke();
      that.data.ctx2.beginPath();
      // that.data.ctx2.setFontSize(10); //注意不要加引号
      // that.data.ctx2.setFillStyle("#ff5000");
      // that.data.ctx2.setTextAlign("center");
      // that.data.ctx2.setTextBaseline("middle");
      // that.data.ctx2.fillText(c + "%", w, h);
      that.data.ctx2.draw();
    },
  /**
   * start 起始百分比
   * end 结束百分比
   * w,h 其实就是圆心横纵坐标
   */
  // 动画效果实现
  canvasTap(start, end, time, w, h) {
    var that = this;
    //start++;
    start = start + 0.01;  //绘制时每次绘制递增值也相应缩小100倍
    if (start > end) {
      that.setData({ curProgress: end, isAniming:false});
      if (that.data.animCompleteCB){
        that.data.animCompleteCB(end);
      }
      return false;
    }
    that.setData({ curProgress: start });
    that.run(start, w, h);
    setTimeout(function () {
      that.canvasTap(start, end, time, w, h);
    }, time);
  },
  /**
   * id----------------canvas画板id
   * percent-----------进度条百分比
   * time--------------画图动画执行的时间  
   * startFromCurPro---从当前进度开始
   * animCompleteCB----动画执行完成回调
   */
    draw: function (id, percent, animTime, startFromCurPro, animCompleteCB) {
      if (this.data.isAniming){
        return; //正在执行动画时，后续操作无效
      } 
      this.setData({ isAniming: true, animCompleteCB: animCompleteCB });
      var that = this;
      const ctx2 = wx.createCanvasContext(id);
      that.setData({
        ctx2:ctx2,
        percentage:percent,
        animTime: animTime
      });
      //1%的进度所需的时间
      var time = that.data.animTime / that.data.percentage;
      //时间缩小100倍，绘制时每次绘制递增值也相应缩小100倍
      time = time/100;
      wx.createSelectorQuery().select('#'+id).boundingClientRect(function (rect) { //监听canvas的宽高
        var w = parseInt(rect.width / 2); //获取canvas宽的的一半
        var h = parseInt(rect.height / 2); //获取canvas高的一半，
        if (startFromCurPro) {
          that.canvasTap(that.data.curProgress, that.data.percentage, time, w, h);
        }else{
          that.canvasTap(0, that.data.percentage, time, w, h);
        }
        
      }).exec();
    },
  } 
}