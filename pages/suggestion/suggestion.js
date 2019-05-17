// pages/suggestion/suggestion.js
const Page = require('../../utils/alading/ald-stat.js').Page;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggestionvalue: '', //输入框内容
    isUploadingAdvice: false, //正在请求接口
  },



  /**提交的点击 */
  onUploadClick: function() {

    if (this.data.isUploadingAdvice) {
      return
    }
    this.data.isUploadingAdvice = true;


    //去除首尾空格
    this.data.suggestionvalue = this.data.suggestionvalue.replace(/(^\s*)|(\s*$)/g, "");

    if (!this.data.suggestionvalue) {
      //输入框为空
      this.toast.showToast('意见建议不能为空');
      this.data.isUploadingAdvice = false;
      return;
    }

    var that = this;
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/advice/advice.ashx?action=AddAdvice',
      needlogin: true,
      data: {
        advice: encodeURIComponent(that.data.suggestionvalue),
      },
      success: function(res) {
        var msg = res.data.msg;
        if (res.data.status != 0) {
          if (msg) {
            that.toast.showToast(msg);
          }
          return;
        }

        if (msg) {

          that.toast.showToast(msg);
          setTimeout(function() {
            //关闭页面
            wx.navigateBack({
              delta: 1, //回退到前一个页面
              success: function(res) {

              },
            })
          }, 1500);
        }


      },
      complete: function(res) {
        that.data.isUploadingAdvice = false;
      }
    });

  },


  /**只要输入发生变化就会触发这个事件，就能从这个事件中获取textare的输入值。 */
  bindinput: function(e) {
    this.setData({
      suggestionvalue: e.detail.value
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.toast = this.selectComponent("#toast");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    if (options && options.from == 'menu') {
      var arrPages = getCurrentPages();
      if (arrPages.length > 0) {
        app.reportUserShare(0, 2, arrPages[arrPages.length - 1].route);
      }

    }
  }
})