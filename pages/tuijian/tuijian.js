// pages/tuijian/tuijian.js
const Page = require('../../utils/alading/ald-stat.js').Page;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_title: "",
    share_path: '/pages/index/index',
    share_img: '',
    imgheight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/xcx/qgx/qgx.ashx?action=QueryShareInfo',
      data: {},
      success: function(res) {
        if (res.data.status != 0) {
          return;
        }
        that.data.share_title = decodeURIComponent(res.data.title);
        that.data.share_path = decodeURIComponent(res.data.path);
        that.data.share_img = decodeURIComponent(res.data.imgurl);

      }
    });

    var sysyeminfo = wx.getSystemInfoSync();
    var width = sysyeminfo.windowWidth;
    var scale = 750 / 1206;
    this.setData({
      imgheight: width / scale,
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

    var shareObj = {
      title: this.data.share_title, // 转发后 所显示的title
      path: this.data.share_path, // 相对的路径
      imageUrl: this.data.share_img,

      success: (res) => { // 成功后要做的事情

      },
      fail: function(res) {

      }
    }

    //分享统计
    if (options) {
      if (options.from == 'menu') {
        var arrPages = getCurrentPages();
        if (arrPages.length > 0) {
          app.reportUserShare(0, 2, arrPages[arrPages.length - 1].route);
        }

      } else if (options.from == 'button') {
        var arrPages = getCurrentPages();
        if (arrPages.length > 0) {
          app.reportUserShare(0, 0, arrPages[arrPages.length - 1].route);
        }

      }
    }



    return shareObj;
  }
})