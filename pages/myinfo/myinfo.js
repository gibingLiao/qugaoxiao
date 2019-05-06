// pages/myinfo/myinfo.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    userinfo: {
      //用户信息
      headurl: '../imgs/default-head.png',
      userid: '',
      nickname: '',
      commentscount: '(0)',
      collectioncount: '(0)',
      zancount: '(0)',
    },
    //是否展示登录覆盖的btn
    isShowBtnCover: true,

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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadData();
  },

  /**加载数据 type给登录操作用，在登录时传过去，回来连续操作 */
  loadData: function(type) {
    this.getUserInfo();

    //获取收藏,点赞，评论数量信息
    this.getCollectionCount(type);
  },

  /**获取用户信息 */
  getUserInfo: function() {
    if (!app.globalData.requestParams.token || 0 == app.globalData.requestParams.token) {
      this.setData({
        ['userinfo.userid']: '登录体验更多功能',
        ['userinfo.nickname']: '未登录',
      });
      return;
    }

    this.setData({
      isShowBtnCover: false,
    });

    var that = this;
    //获取信息
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/account/userinfo.ashx?action=QueryUserInfo',
      needlogin: true,
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.status != 0) {
          return;
        }


        that.setData({
          ['userinfo.userid']: "ID  " + res.data.userid,
          ['userinfo.nickname']: decodeURIComponent(res.data.nickname),
          ['userinfo.headurl']: decodeURIComponent(res.data.headurl),
        });


      }
    });
  },



  //获取用户信息回调
  getUserInfoCallBack: function(res) {
    console.log(res.detail.errMsg);

    if (res.detail.errMsg == "getUserInfo:ok") {
      var type = res.currentTarget.dataset.type
      app.globalData.userInfo = res.detail.userInfo;
     
      app.CheckLoginCallBack(this.loadData, type);
    }
  },


  //获取收藏数量信息
  getCollectionCount: function(type) {
    if (!app.globalData.requestParams.token || 0 == app.globalData.requestParams.token) {
      //如果是游客模式，不调用
      return;
    }
    var that = this;
    //获取信息
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtCollectZanCnt',
      needlogin: true,
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.status != 0) {
          return;
        }


        that.setData({
          ['userinfo.zancount']: "(" + res.data.zan + ")",
          ['userinfo.collectioncount']: "(" + res.data.collect + ")",
          ['userinfo.commentscount']: "(" + res.data.comment + ")",
        });

        if (type == 1 || type == 2 || type == 3) {
          //1 -- 跳转我的赞  2--跳转我的收藏  3--跳转我的评论
          var url = '../myzancollectioncomments/myzancollectioncomments?type=' + type;
          wx.navigateTo({
            url: url
          })
        }
      }
    });

  },


  /**我的赞，收藏，评论的点击 */
  onMyZanCollectionCommentsClick: function(event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1 || type == 2 || type == 3) {
      //1 -- 跳转我的赞  2--跳转我的收藏  3--跳转我的评论
      var url = '../myzancollectioncomments/myzancollectioncomments?type=' + type;
      wx.navigateTo({
        url: url
      })
    }

  },

  /**推荐的点击 */
  onTuijianClick: function() {
    //跳转推荐页面
    wx.navigateTo({
      url: "../tuijian/tuijian"
    })
  },

  /**意见反馈的点击 */
  onSuggestionClick:function(){
    //跳转意见页面
    wx.navigateTo({
      url: "../suggestion/suggestion"
    })
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
  onShareAppMessage: function() {

  }
})