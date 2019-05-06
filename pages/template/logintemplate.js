const app = getApp();




//展示登录浮层
function showLogin() {
  console.log('展示登录层');
  this
};



//获取用户信息回调
function getUserInfoCallBack(res) {
  console.log(res)
  app.globalData.userInfo = res.detail.userInfo;

  //调用登录接口
  wx.login({
    success: function(e) {

      var code = e.code;
      var rawData = encodeURIComponent(res.detail.rawData);
      var signature = encodeURIComponent(res.detail.signature);
      var encryptedData = encodeURIComponent(res.detail.encryptedData);
      var iv = encodeURIComponent(res.detail.iv);
      if (code) {
        app.thirdLogin(code, rawData, signature, encryptedData, iv, function() {
          wx.redirectTo({
            url: '../index/index'
          })
        }, undefined);
      }

    },

    fail: function(e) {
      console.log(e);
    }

  })
}

module.exports = {
  showLogin: showLogin,
  getUserInfoCallBack: getUserInfoCallBack,
}