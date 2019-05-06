// pages/detail/detail.js

var WxParse = require('../../utils/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dkheight: 300,
    dkcontent: "你好<br/>你好<br/>你好<br/>你好<br/>你好<br/>nihao, <br/><br/><br/><br/><br/><br/><br/>这个是测试<br/><br/>你同意了吗<br/><br/><br/>hehe<b>n你好啊，我加粗了kk</b ><img  src=\"http://xgc-img.xiaogechui.cn/20181029/1814/636764336619047496.png\" />",
    vid: 'f142631tnzo',
    vsrc: 'http://txmov2.a.yximgs.com/upic/2019/01/13/15/BMjAxOTAxMTMxNTQ3MjFfNDE3MjI4NTFfOTkwNjQzMDMyMF8xXzM=_b_B200dad3c297041554560c3378b45ba6a.mp4?tag=1-1547366269-p-1-yophu72cb3-910bb46a9b1256a6'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获得高度
    let winPage = this;
    wx.getSystemInfo({
      success: function (res) {
        let winHeight = res.windowHeight;
        console.log(winHeight);
        winPage.setData({
          dkheight: winHeight
        })
      }
    })

    WxParse.wxParse('dkcontent', 'html', this.data.dkcontent, this, 5);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})