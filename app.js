//app.js

// var loginTemplate = require('/pages/template/logintemplate.js');

var utilMd5 = require('/utils/md5.js');
App({
  globalData: {
    userInfo: {},
    // loginCB: undefined, //登录回调
    // loginCBParams: undefined, //登录参数
    //全局请求参数
    requestParams: {
      //基础参数拼接
      t: 3, //小程序专用
      v: '1.0.1', //版本号
      deviceid: '', //用户识别吗，随机生成保存本地，统计一定基础的日活，激活
      phonemodel: '',
      osversion: '',
      simtype: '',
      simid: '',
      package: '',
      pid: 102,
      userid: 0,
      token: '0',
    },


  },
  onLaunch: function() {
    try {
      let token = wx.getStorageSync('thirdSessionId');
      if (token) {
        this.globalData.requestParams.token = token;
      }
      let userid = wx.getStorageSync('userid');
      if (userid) {
        this.globalData.requestParams.userid = userid;
      }

    } catch (e) {}

  
  },

  // 对象转化为map
  objToStrMap: function(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  },


  //请求的封装 需要带上 thirdSessionId 的 request 请求
  //需要带上 thirdSessionId 的 request 请求
  requestWithSessionId: function(object) {

    var that = this;

    if (this.globalData.requestParams.userid || this.globalData.requestParams.token) {
      //需要登录校验
      if (0 != this.globalData.requestParams.userid && '0' != this.globalData.requestParams.token) {
        object.needlogin = true;
      }
    }

    if (!object.needlogin) {
      //如果不需要登录校验，直接请求
      //发起请求
      var url = object.url;
      var data = that.requestParamsJoin(url, object.data);
      var fail = object.fail;
      var complete = object.complete;

      // 打日志，获取最终请求链接 ----开始
      // var arrData = this.objToStrMap(data);
      // var needlianjiefuFirst = false;
      // if (url.indexOf('?') > 0) {
      //   //第一个拼接需要连接符
      //   needlianjiefuFirst = true;
      // } else {
      //   needlianjiefuFirst = false;
      // }
      // var tempParams = '';
      // for (var value of arrData) {
      //   tempParams = tempParams + "&" + value[0] + "=" + value[1];
      // }
      // if (!needlianjiefuFirst && tempParams) {
      //   tempParams = tempParams.substr(1);
      // }
      // console.log(url + tempParams);
      // 打日志，获取最终请求链接 ----结束

      wx.request({
        url: url,
        data: data,
        fail: fail,
        success: function(res) {

          //服务端用户信息缓存已丢失，则重新发起登录请求
          if (res.data.status == 1000) {
            that.WXLogin(that.requestWithSessionId, object);
            return;
          }
          if (object.success) {
            //调用原有成功回调函数
            object.success(res);

          }

        },
        complete: complete,

      });
      return;
    }

    //判断微信登录态是否过期
    wx.checkSession({
      success: function() {

        //登录态未过期
        //取本地 thirdSessionId
        var thirdSessionId = that.globalData.requestParams.token;
        if (!thirdSessionId || 0 == thirdSessionId) {
          thirdSessionId = that.getThirdSessionId();
        }

        // console.log('登录态未过期' + thirdSessionId);

        if (!thirdSessionId || 0 == thirdSessionId) {
          that.WXLogin(that.requestWithSessionId, object);
          return;
        }


        //发起请求
        var url = object.url;
        var data = that.requestParamsJoin(url, object.data);
        var fail = object.fail;
        var complete = object.complete;

        // 打日志，获取最终请求链接 ----开始
        // var arrData = that.objToStrMap(data);
        // var needlianjiefuFirst = false;
        // if (url.indexOf('?') > 0) {
        //   //第一个拼接需要连接符
        //   needlianjiefuFirst = true;
        // } else {
        //   needlianjiefuFirst = false;
        // }
        // var tempParams = '';
        // for (var value of arrData) {
        //   tempParams = tempParams + "&" + value[0] + "=" + value[1];
        // }
        // if (!needlianjiefuFirst && tempParams) {
        //   tempParams = tempParams.substr(1);
        // }
        // console.log(url + tempParams);
        // 打日志，获取最终请求链接 ----结束


        wx.request({
          url: url,
          data: data,
          fail: fail,
          success: function(res) {

            //服务端用户信息缓存已丢失，则重新发起登录请求
            if (res.data.status == 1000) {
              that.WXLogin(that.requestWithSessionId, object);
              return;
            }

            // console.log(res);
            if (object.success) {
              //调用原有成功回调函数
              object.success(res);

            }

          },
          complete: complete,

        });

      },
      fail: function() {
        //登录态过期
        console.log('登录态过期');

        that.WXLogin(that.requestWithSessionId, object);

      }
    })


  },

  //获取本地thirdSessionId
  getThirdSessionId: function() {
    try {
      var value = wx.getStorageSync('thirdSessionId')
      if (value) {
        return value;
      }
    } catch (e) {

    }
    return undefined;
  },


  /**
   * 微信登录
   * cb 回调函数 可不传
   * cbparam 回调函数中还需要回传的参数 可不传 主要是为了cb本身还需要参数的情况
   */
  WXLogin: function(cb, cbparam) {
    var that = this

    //调用登录接口
    wx.login({
      success: function(e) {

        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权过，可以获取头像昵称信息
              wx.getUserInfo({
                withCredentials: true,
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  that.globalData.userInfo = res.userInfo;

                  // console.log(res);
                  // console.log(e);

                  var code = e.code;
                  var rawData = encodeURIComponent(res.rawData);
                  var signature = encodeURIComponent(res.signature);
                  var encryptedData = encodeURIComponent(res.encryptedData);
                  var iv = encodeURIComponent(res.iv);
                  if (code) {
                    that.thirdLogin(code, rawData, signature, encryptedData, iv, cb, cbparam);
                  }

                },
                fail: e => {
                  console.log('用户信息获取失败！' + e);
                }
              })
            } else {
              // 未授权，引导去登录页
              // that.globalData.loginCB = cb;
              // that.globalData.loginCBParams = cbparam;
              // wx.navigateTo({
              //   url: '../login/login'
              // })
              console.log("漏掉了登录按钮");

            }
          },
          fail: function() {
            // 检查授权失败
            wx.showModal({
              title: '提示',
              content: '授权失败！请检查网络'
            })
          }
        })

      },

      fail: function(e) {
        // console.log(e + "  ....");
      }

    })

  },

  CheckLoginCallBack: function (loginCB, loginCBParams) {

    this.WXLogin(loginCB, loginCBParams);

  },


  //第三方登录方法
  thirdLogin: function(code, rawData, signature, encryptedData, iv, cb, cbparam) {

    var that = this;

    //拼接参数
    var data = {
      code: code,
      rawData: rawData,
      signature: signature,
      encryptedData: encryptedData,
      iv: iv,
    };
    data = this.requestParamsJoin('https://app.xiaogechui.cn/xcx/qgx/login.ashx', data);


    wx.request({
      url: 'https://app.xiaogechui.cn/xcx/qgx/login.ashx',
      data: data,
      fail: function(e) {
        console.log(e);
      },
      success: function(res) {
        // console.log(res.data);
        if (res.data.status != 0) {
          wx.showModal({
            title: '提示',
            content: '登录失败！请稍后再试'
          })
          return;
        }

        // wx.showModal({
        //   title: '登录结果',
        //   content: 'thirdsessionid:' + res.data.thirdsessionid,
        //   success: function(res) {

        //   }
        // })

        //存入token，userid
        wx.setStorageSync('thirdSessionId', res.data.thirdsessionid);
        wx.setStorageSync('userid', res.data.userid);
        that.globalData.requestParams.token = res.data.thirdsessionid;
        that.globalData.requestParams.userid = res.data.userid;

        if (cbparam) {
          typeof cb == "function" && cb(cbparam);
        } else {
          typeof cb == "function" && cb();
        }

      }
    });
  },


  //请求参数拼接工具
  requestParamsJoin: function(url, object) {


    var unixt = Date.parse(new Date());
    object.t = this.globalData.requestParams.t;
    object.v = this.globalData.requestParams.v;
    object.pid = this.globalData.requestParams.pid;
    object.simtype = '';
    object.simid = '';
    object.package = '';

    object.unixt = unixt;

    try {


      if (!this.globalData.requestParams.userid) {
        object.userid = 0;
      } else {
        object.userid = this.globalData.requestParams.userid
      }

      if (!this.globalData.requestParams.token) {
        object.token = 0;
      } else {
        object.token = this.globalData.requestParams.token
      }

      //赋值deviceid
      if (this.globalData.requestParams.deviceid) {
        object.deviceid = this.globalData.requestParams.deviceid;
      } else {
        //从内存空间中获取deviceid
        var deviceid = wx.getStorageSync('deviceid');
        if (!deviceid) {
          //如果没有，随机获取个16位的deviceid
          deviceid = this.randomDeviceid();
        }
        this.globalData.requestParams.deviceid = deviceid
        object.deviceid = this.globalData.requestParams.deviceid;
      }

      //phonemodel
      if (this.globalData.requestParams.phonemodel) {
        object.phonemodel = this.globalData.requestParams.phonemodel
      } else {
        let systeminfo = wx.getSystemInfoSync();
        this.globalData.requestParams.phonemodel = encodeURIComponent(systeminfo.model);
        object.phonemodel = this.globalData.requestParams.phonemodel

        this.globalData.requestParams.osversion = encodeURIComponent(systeminfo.system);
      }

      //osversion
      if (this.globalData.requestParams.osversion) {
        object.osversion = this.globalData.requestParams.osversion
      } else {
        let systeminfo = wx.getSystemInfoSync();
        this.globalData.requestParams.osversion = encodeURIComponent(systeminfo.system);
        object.osversion = this.globalData.requestParams.osversion
      }

      //keycode
      var tag = object.tag;
      var tempParam = '';
      var pagename = '';
      if (url) {
        pagename = this.getPagename(url);

      }

      if ('login' == tag) {
        pagename = '';
        tempParam = '';
      } else {
        tempParam = "t=" + this.globalData.requestParams.t + "&v=" + this.globalData.requestParams.v + "&userid=" + object.userid + "&token=" + object.token + "&unixt=" + object.unixt;
      }

      var keycode = utilMd5.hexMD5(tempParam + pagename + "qnEssMe6KWhRpII6");

      // console.log(tempParam + pagename + "qnEssMe6KWhRpII6" + "               " + keycode);
      object.keycode = keycode;

      return object;
    } catch (e) {
      // Do something when catch error
    }

  },


  /**
   * 截取链接的页面名
   */
  getPagename: function(url) {
    var name = '';
    try {
      if (url) {
        if (url.indexOf("?") >= 0) {
          name = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        } else {
          name = url.substring(url.lastIndexOf("/") + 1, url.length);
        }

      }
    } catch (e) {}
    return name;

  },


  /*
   生成16位随机码
   */

  randomDeviceid: function() {
    var str = "";
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for (var i = 0; i < 16; i++) {
      let pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }

    return str;
  }



})