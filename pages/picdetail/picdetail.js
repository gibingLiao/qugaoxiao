// pages/picdetail/picdetail.js
const Page = require('../../utils/alading/ald-stat.js').Page;
import sendcomment from '../template/sendcomment.js'

var emojiFn = require('../../utils/emoj.js');
const app = getApp();
var systemInfo = wx.getSystemInfoSync();

var timeout = undefined;

Page({
  ...sendcomment.options,
  /**
   * 页面的初始数据
   */
  data: {

    // isshowenmoji: true,
    // keyboardheight: 300,
    // emojiH: 300 * 0.8 / 3,
    // emojiW: systemInfo.windowWidth / 7,


    ...sendcomment.data,
    platform: systemInfo.platform,
    //页面的数据源
    artdata: {

    },
    //图片撑满样式
    imageStyle: 'pic-gif-style1',
    //评论的数据源
    pldata: {
      items: []
    },
    //是否展示enmoji
    isshowenmoji: false,
    //scrollview底部占位的高度
    zhanweiheight: 150,
    //点赞的动画
    clickLikeAnimation: {},
    isAnimatingLike: false, //点赞动画是否正在执行
    isAnimatingPlLike: false, //是否正在执行评论点赞动画
    isRequestCollection: false, //是否正在请求收藏接口

    showimg: "", //图片上方gif展示的数据字段
    showaddress: false, //是否正在展示gif，加载成功再展示，防止闪烁

    pagenum: 1, //加载页码
    isLoadingContent: false, //是否正在加载整体数据
    isLoadingPL: false, //是否正在加载评论数据
    hasMorePl: true, //有更多评论
    stime: '',

    dataIndex: -1, //点进来的索引值

    plcount: 0, //评论数量

    //是否展示登录覆盖的btn
    isShowBtnCover: true,

    artid: 0,

    disableinput: false, //页面滚动的时候禁用掉输入框
  },


  onPageScroll: function (event) {
    //滚动中，禁用输入框
    if (!this.data.disableinput) {
      this.setData({
        disableinput: true,
      });
    }
    clearTimeout(timeout);
    var that = this;
    timeout = setTimeout(() => {
      if (that.data.disableinput) {
        that.setData({
          disableinput: false,
        });
      }
    }, 100);
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.bindContext(this, systemInfo, emojiFn);
    this.data.artid = options.artid;
    this.data.dataIndex = options.dataindex;
    this.getContentData(false);
  },

  /**获取content数据 */
  getContentData: function(isLoadmore) {

    if (this.data.isLoadingContent) {
      return;
    }

    this.data.isLoadingContent = true;

    var that = this;

    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtInfo&artid=' + that.data.artid, // 仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.status != 0) {
          //接口状态码错误
          wx.showModal({
            title: '请求异常',
            content: '服务器繁忙，请稍后访问',
          });
          return;
        }

        //转码操作

        res.data.title = decodeURIComponent(res.data.title);
        res.data.imgurl = decodeURIComponent(res.data.imgurl);
        res.data.attadress = decodeURIComponent(res.data.attadress);

        var tags = res.data.tags;
        if (tags) {
          for (var i = 0; i < tags.length; i++) {
            if (i == tags.length - 1) {
              tags[i].TAG = decodeURIComponent(tags[i].TAG);
            } else {
              tags[i].TAG = decodeURIComponent(tags[i].TAG );
            }

          }
        }


        //计算图片比例
        var imgW = res.data.imgw;
        var imgH = res.data.imgh;
        var scale = imgW / imgH;

        var imgfitw = res.data.imgfitw
        if (scale < 0.8 && 1 != imgfitw) {
          //将图片宽度设置成60%，样式2
          that.setData({
            imageStyle: 'pic-gif-style2'
          })
        }

        //根据点赞状态设置点赞的图片显示
        if ('1' == res.data.zanstatus) {
          res.data.likepic = '../imgs/detail_btn_liked.png';
        } else {
          res.data.likepic = '../imgs/detail_btn_like.png';
        }


        that.setData({
          artdata: res.data
        });


        //播放gif
        if (that.data.artdata.atype == '4') {
          var showimg = "";
          if (!that.data.artdata.showaddress || !that.data.artdata.showimg || that.data.artdata.showimg == that.data.artdata.imgurl) {
            //开始播放gif
            showimg = that.data.artdata.attadress;
          }
          that.data.artdata.showaddress = false;
          that.data.artdata.showimg = showimg;
          //是否正在加载中,如果此时需要加载gif，点击显示加载状态，否则不显示加载状态
          var isloadinggif = false;
          if (showimg) {
            isloadinggif = true;
          }
          that.data.artdata.isloadinggif = isloadinggif;
          that.setData({
            artdata: that.data.artdata,
          });
        }




        //请求评论数据
        that.getPLData(isLoadmore);

      },
      complete: function(res) {
        that.data.isLoadingContent = false;
        wx.stopPullDownRefresh();
        that.chechLogin();
      },
    })
  },

  /**
   * 获取评论的数据
   */
  getPLData: function(isLoadmore) {

    if (this.data.isLoadingPL) {
      return
    }
    this.data.isLoadingPL = true;

    if (isLoadmore) {
      this.data.pagenum++;
    } else {
      this.data.pagenum = 1;
    }


    var that = this;
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/comment.ashx?action=QueryCommentList&pageno=' + that.data.pagenum + '&stime=' + that.data.stime + '&artid=' + that.data.artid,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },

      success(res) {
        if (res.data.status != 0) {
          return;
        }
        console.log(res.data);

        that.data.stime = res.data.stime;
        //解码操作
        var items = res.data.items;

        if (items && items.length > 0) {
          that.data.hasMorePl = true
        } else {
          that.data.hasMorePl = false;
        }

        if (items) {
          for (var i = 0; i < items.length; i++) {
            items[i].NICKNAME = decodeURIComponent(items[i].NICKNAME);
            items[i].HEADURL = decodeURIComponent(items[i].HEADURL);
            items[i].CONTENT = decodeURIComponent(items[i].CONTENT);
            items[i].emojiMsg = emojiFn.emojiAnalysis([items[i].CONTENT]);

            //保存个wxkey
            if (isLoadmore) {
              items[i].id = that.data.pldata.items.length + i;
            } else {
              items[i].id = i;
            }
            //根据点赞状态设置点赞的图片显示
            if ('1' == items[i].ZANSTATUS) {
              items[i].likepic = '../imgs/content_btn_liked.png';
            } else {
              items[i].likepic = '../imgs/content_btn_like.png';
            }
            //点赞动画的执行字段
            items[i].clickLikeAnimation = {};
          }

        }

        if (isLoadmore) {
          //加载下一页
          that.setData({
            ['pldata.items']: that.data.pldata.items.concat(items),
          });
        } else {
          //下拉刷新
          that.setData({
            pldata: res.data,
          });
        }

        //评论数量
        that.setData({
          plcount: that.data.artdata.plcnt, //that.data.pldata.items.length,
        });


      },
      complete: function(res) {
        that.chechLogin();
        that.data.isLoadingPL = false;
      }
    })
  },

  /**热点标签的点击 */
  onHotTagClick: function(event) {
    var tagid = event.currentTarget.dataset.tagid;
    if (!tagid) {
      return;
    }
    //拿到栈页面
    var arrPages = getCurrentPages();

    if (arrPages.length > 1 && arrPages[arrPages.length - 2].route == 'pages/index/index') {
      //从首页列表页打开的详情页
      wx.navigateBack({
        delta: 1, //回退到前一个页面
        success: function(res) {
          arrPages[arrPages.length - 2].data.showTagid = tagid;
          //调用上一个页面选择热点的方法
          arrPages[arrPages.length - 2].onItemTagClick({
            currentTarget: {
              dataset: {
                tagid: tagid,
              }
            }
          });
        },
      })
    } else if (arrPages.length > 3 && arrPages[arrPages.length - 4].route == 'pages/index/index') {
      //从我的收藏点赞评论打开的详情页
      wx.navigateBack({
        delta: 3, //回退到前三个个页面
        success: function(res) {
          arrPages[arrPages.length - 4].data.showTagid = tagid;
          //调用上一个页面选择热点的方法
          arrPages[arrPages.length - 4].onItemTagClick({
            currentTarget: {
              dataset: {
                tagid: tagid,
              }
            }
          });
        },
      })
    }
  },


  //点赞的点击
  onClickLike: function() {
    if (this.data.isAnimatingLike) {
      return;
    }

    //请求点赞接口
    var that = this;
    //调用点赞接口
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=SwitchArtZan&artid=' + that.data.artdata.artid,
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

        var zanStatus = that.data.artdata.zanstatus;
        var zanCount = that.data.artdata.zancnt; //点赞数
        if ('1' == zanStatus) {
          zanStatus = '0'
          that.data.artdata.likepic = '../imgs/detail_btn_like.png';

          if (zanCount > 0) {
            zanCount--;
          }

        } else {
          zanStatus = '1'
          that.data.artdata.likepic = '../imgs/detail_btn_liked.png';
          zanCount++;
        }

        //赋值动画
        var animation = wx.createAnimation({
          duration: 600,
          timingFunction: 'ease'
        })
        animation.opacity(0).scale(2, 2).step(); //修改透明度,放大


        that.setData({
          ['artdata.zanstatus']: zanStatus,
          ['artdata.zancnt']: zanCount,
          ['artdata.likepic']: that.data.artdata.likepic,
          clickLikeAnimation: animation.export(), //点赞动画
          isAnimatingLike: true,
        });

        //拿到栈页面
        var arrPages = getCurrentPages();
        if (-1 != that.data.dataIndex && arrPages.length > 1 && (arrPages[arrPages.length - 2].route == 'pages/index/index' || arrPages[arrPages.length - 2].route == 'pages/myzancollectioncomments/myzancollectioncomments')) {
          //从首页列表页打开的详情页,刷新首页数据
          arrPages[arrPages.length - 2].setData({
            ['CurListData.items[' + that.data.dataIndex + '].zanstatus']: zanStatus,
            ['CurListData.items[' + that.data.dataIndex + '].likepic']: that.data.artdata.likepic, //点赞的图片
            ['CurListData.items[' + that.data.dataIndex + '].zancnt']: zanCount,
          });
        }

      },
      complete: function(res) {
        that.chechLogin();
      }
    });



  },



  //点赞动画结束
  onLikeAnimationEnd: function() {
    //这个动画会执行两次，每个动画执行完毕阶段会进一次，一个放大，一个渐变，会进两次回调
    if (!this.data.isAnimatingLike) {
      return;
    }

    //赋值动画
    var animation = wx.createAnimation({
      duration: 0,
    })
    animation.opacity(1).scale(1, 1).step(); //修改透明度,放大

    //清除动画
    this.setData({
      clickLikeAnimation: animation.export(), //点赞动画
      isAnimatingLike: false, //执行点赞动画完毕
    });
  },


  /**
   * 收藏的点击
   */
  onCollectionClick: function() {

    if (this.data.isRequestCollection) {
      return;
    }
    this.data.isRequestCollection = true;
    //请求点赞接口
    var that = this;
    //调用点赞接口
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=SwitchArtCollect&artid=' + that.data.artdata.artid,
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

        var collectionStatus = that.data.artdata.collectstatus;
        if ('1' == collectionStatus) {
          collectionStatus = '0'
          that.data.artdata.collctionpic = '../imgs/content_btn_collect.png';
        } else {
          collectionStatus = '1'
          that.data.artdata.collctionpic = '../imgs/content_btn_collected.png';
        }

        // var artdata = that.data.artdata;
        // artdata.collectstatus = collectionStatus;

        that.setData({
          ['artdata.collectstatus']: collectionStatus,
        });
        //拿到栈页面
        var arrPages = getCurrentPages();
        if (-1 != that.data.dataIndex && arrPages.length > 1 && (arrPages[arrPages.length - 2].route == 'pages/index/index' || arrPages[arrPages.length - 2].route == 'pages/myzancollectioncomments/myzancollectioncomments')) {
          //从首页列表页打开的详情页,刷新首页数据

          arrPages[arrPages.length - 2].setData({
            ['CurListData.items[' + that.data.dataIndex + '].collectstatus']: collectionStatus,
            ['CurListData.items[' + that.data.dataIndex + '].collectionpic']: that.data.artdata.collctionpic, //点赞的图片
          });
        }

      },
      complete: function(res) {
        that.chechLogin();
        that.data.isRequestCollection = false;
      }
    });

  },




  //评论的点击
  onClickPlLike: function(event) {

    if (this.data.isAnimatingPlLike) {
      return;
    }


    var item = event.currentTarget.dataset.item;
    var index = event.currentTarget.dataset.index;
    if (!item) {
      return;
    }

    var that = this;
    //评论点赞接口
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/comment.ashx?action=SwitchCommentZan&plid=' + item.PLID,
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

        //获取点赞状态
        var zanstatus = item.ZANSTATUS;
        var likepic = item.likepic;
        var zanCount = item.ZANCNT;

        if (zanstatus == '1') {
          //取消点赞
          zanstatus = '0';
          likepic = '../imgs/content_btn_like.png';
          if (zanCount > 0) {
            zanCount--;
          }
        } else {
          //点赞
          zanstatus = '1';
          likepic = '../imgs/content_btn_liked.png';
          zanCount++;
        }

        //赋值动画
        var animation = wx.createAnimation({
          duration: 600,
          timingFunction: 'ease'
        })
        animation.opacity(0).scale(2, 2).step(); //修改透明度,放大

        //刷新点赞界面
        that.setData({
          ['pldata.items[' + index + '].ZANSTATUS']: zanstatus, //点赞状态
          ['pldata.items[' + index + '].likepic']: likepic, //点赞的图片
          ['pldata.items[' + index + '].ZANCNT']: zanCount, //点赞的图片
          ['pldata.items[' + index + '].clickLikeAnimation']: animation.export(), //点赞动画
          isAnimatingPlLike: true, //正在执行点赞动画
        });
      },
      complete: function(res) {
        that.chechLogin();
      }
    });

  },

  //评论点赞动画结束监听
  onPlLikeAnimationEnd: function(event) {
    //这个动画会执行两次，每个动画执行完毕阶段会进一次，一个放大，一个渐变，会进两次回调

    if (!this.data.isAnimatingPlLike) {
      return;
    }

    //将界面还原为动画开始状态
    //拿到此条数据源和索引
    var item = event.currentTarget.dataset.item;
    var index = event.currentTarget.dataset.index;
    if (!item) {
      return;
    }

    //赋值动画
    var animation = wx.createAnimation({
      duration: 0,
    })
    animation.opacity(1).scale(1, 1).step(); //修改透明度,放大

    //清除动画
    this.setData({
      ['pldata.items[' + index + '].clickLikeAnimation']: animation.export(), //点赞动画
      isAnimatingPlLike: false, //执行点赞动画完毕
    });
  },


  //图片的点击
  onPicClick: function(event) {

    var atype = this.data.artdata.atype;

    if ('4' == atype) {
      //播放与暂停gif
      var showimg = "";
      if (!this.data.artdata.showaddress || !this.data.artdata.showimg || this.data.artdata.showimg == this.data.artdata.imgurl) {
        //开始播放gif
        showimg = this.data.artdata.attadress;
      } else {
        //暂停gif
        showimg = "";
      }

      // this.data.artdata.showaddress = false;
      // this.data.artdata.showimg = showimg;
      //是否正在加载中,如果此时需要加载gif，点击显示加载状态，否则不显示加载状态
      var isloadinggif = false;
      if (showimg) {
        isloadinggif = true;
      }
      // this.data.artdata.isloadinggif = isloadinggif;
      this.setData({
        ['artdata.showaddress']: false,
        ['artdata.showimg']: showimg,
        ['artdata.isloadinggif']: isloadinggif,
        // artdata: this.data.artdata,
      });
    } else {
      //查看大图
      var src = this.data.artdata.imgurl;
      var imgList = [this.data.artdata.imgurl]; //获取data-list
      //图片预览
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
      });
    }

  },


  //gif加载回调
  gifImageLoad: function(event) {

    var atype = this.data.artdata.atype;

    if ('4' == atype) {
      var showaddress = false;
      if (this.data.artdata.showimg == this.data.artdata.imgurl) {
        //暂停gif，显示img，隐藏gif
        showaddress = false;
      } else {
        //播放gif，显示gif
        showaddress = true;
      }
      this.data.artdata.showaddress = showaddress;
      this.data.artdata.isloadinggif = false;

      this.setData({
        artdata: this.data.artdata,
      });

    }
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

    //请求接口
    if (!this.data.isLoadingContent && !this.data.isLoadingPL) {
      this.getContentData(false);
    } else {
      wx.stopPullDownRefresh();
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasMorePl) {
      //有更多评论
      this.getPLData(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {

    var shareObj = {
      title: "", // 转发后 所显示的title
      path: '/pages/index/index', // 相对的路径
      imageUrl: "",

      success: (res) => { // 成功后要做的事情

      },
      fail: function(res) {

      }
    }

    // 来自页面内的按钮的转发
    if (options) {
      // console.log(options.from);
      // if (options.from == 'button') {
      if (this.data.artdata.title) {

        if (2 == this.data.artdata.atype) {
          shareObj.title = "【趣图】" + this.data.artdata.title;
        } else {
          shareObj.title = "【动图】" + this.data.artdata.title;
        }


      }
      if (this.data.artdata.imgurl) {
        shareObj.imageUrl = this.data.artdata.imgurl;
      }

      if (this.data.artid && this.data.artdata.atype) {
        shareObj.path = shareObj.path + "?share_artid=" + this.data.artid + "&share_atype=" + this.data.artdata.atype;
      }

      //去分享的图片，如果有单独配置，覆盖分享图片
      if (this.data.artdata.xcximgurl) {
        shareObj.imageUrl = decodeURIComponent(this.data.artdata.xcximgurl);
      }


      //统计分享
      if (options.from == 'button') {
        app.reportUserShare(1, 1, this.data.artid);

      } else if (options.from == 'menu') {
        app.reportUserShare(1, 2, this.data.artid);
      }


    }

    return shareObj;
  },

  //获取用户信息回调
  getUserInfoCallBack: function(res) {

    if (res.detail.errMsg == "getUserInfo:ok") {
      var type = res.currentTarget.dataset.type
      app.globalData.userInfo = res.detail.userInfo;

      if (type == 0) {
        //点赞需要登录
        app.CheckLoginCallBack(this.onClickLike);
      } else if (type == 1) {
        //点赞评论需要登录
        app.CheckLoginCallBack(this.onClickPlLike, res);
      } else if (type == 3) {
        //收藏需要登录
        app.CheckLoginCallBack(this.onCollectionClick);
      } else if (type == 4) {
        //评论需要登录
        app.CheckLoginCallBack(this.chechLogin, type);
      }
    }
  },

  /**校验覆盖登录按钮 */
  chechLogin: function(type) {
    if (!app.globalData.requestParams.token || 0 == app.globalData.requestParams.token) {
      this.setData({
        isShowBtnCover: true,
      });

    } else {
      this.setData({
        isShowBtnCover: false,
      });
      if (type == 4) {
        //拉起键盘
        this.setData({
          isshowkeyboard: true,
          inputFocus: true,
        });

      }
    }
  },

  //键盘弹出监听
  // onKeyBoardFocus: function(event) {

  //   if (this.data.isshowenmoji) {
  //     //此时表情键盘是出来的，要收起表情出键盘，先将占位高度抹去
  //     var height = this.data.zhanweiheight;
  //     height = height - (this.data.keyboardheight * 750 / systemInfo.windowWidth);
  //     this.setData({
  //       zhanweiheight: height,
  //     });
  //   }


  //   var keyboardheight = event.detail.height

  //   this.setData({
  //     isshowkeyboard: true,
  //     keyboardheight: keyboardheight,
  //     emojiH: keyboardheight * 0.8 / 3,
  //     emojiW: systemInfo.windowWidth / 7,
  //     //收起表情
  //     isshowenmoji: false,
  //     inputFocus: true,

  //   });

  // },

  // // 键盘收起监听
  // onKeyBoardHidden: function(event) {

  //   //如果表情面板是展示状态,认为现在是需要键盘的状态
  //   if (this.data.isshowenmoji) {
  //     this.setData({
  //       isshowkeyboard: true,
  //     });
  //   } else {
  //     this.setData({
  //       isshowkeyboard: false,
  //       inputFocus: false,
  //     });
  //   }

  // },

  // //表情弹出键的点击
  // onEmojiClick: function() {
  //   if (!this.data.isshowenmoji) {
  //     //此时键盘弹出，点击出表情

  //     this.setData({
  //       isshowenmoji: true,
  //     });


  //     //如果表情展示，占位高度加上表情高度，如果表情收起，占位高度减去表情高度
  //     var height = this.data.zhanweiheight;

  //     height = height + (this.data.keyboardheight * 750 / systemInfo.windowWidth);


  //     this.setData({
  //       zhanweiheight: height
  //     });


  //   } else {

  //     var height = this.data.zhanweiheight;
  //     height = height - (this.data.keyboardheight * 750 / systemInfo.windowWidth);
  //     this.setData({
  //       zhanweiheight: height
  //     });


  //     //此时键盘收起状态
  //     this.setData({
  //       isshowenmoji: false,
  //       inputFocus: true,
  //     });

  //   }
  // },

  // /**只要输入发生变化就会触发这个事件，就能从这个事件中获取textare的输入值。 */
  // bindinput: function(e) {
  //   this.setData({
  //     inputvalue: e.detail.value
  //   });
  // },
  // //表情建点击
  // onEmojiSelect: function(event) {
  //   var index = event.currentTarget.dataset.index;
  //   var value = this.data.inputvalue;
  //   value = value ? value : '';
  //   this.setData({
  //     inputvalue: value + "[" + this.data.enmojis[index].content + "]"
  //   });
  //   //将光标移动到最后
  // },

  // //触摸关闭表情，键盘
  // onTouchHiddenEmoji: function() {

  //   if (this.data.isshowenmoji) {
  //     var height = this.data.zhanweiheight;
  //     height = height - (this.data.keyboardheight * 750 / systemInfo.windowWidth);
  //     this.setData({
  //       zhanweiheight: height
  //     });
  //   }

  //   this.setData({
  //     isshowenmoji: false,
  //     inputFocus: false,
  //     isshowkeyboard: false,
  //   });
  // },

  // //点击发送评论按钮
  // onClickSend: function() {
  //   //获取评论
  //   var content = this.data.inputvalue;
  //   if (!content) {
  //     this.toast.showToast("评论不能为空");
  //     return;
  //   }
  //   //去除首尾空格
  //   content = content.replace(/(^\s*)|(\s*$)/g, "");
  //   if (!content) {
  //     this.toast.showToast("评论不能为空");
  //     return;
  //   }


  //   if (this.data.isSendPl) {
  //     return;
  //   }
  //   this.data.isSendPl = true;

  //   var that = this;
  //   app.requestWithSessionId({
  //     url: 'https://app.xiaogechui.cn/webservice/article/comment.ashx?action=AddComment&artid=' + that.data.artid + "&toplid=0",
  //     needlogin: true,
  //     data: {
  //       comment: encodeURIComponent(content),
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       if (res.data.status != 0) {
  //         //接口状态码错误
  //         wx.showModal({
  //           title: '请求异常',
  //           content: '服务器繁忙，请稍后访问',
  //         });
  //         return;
  //       }

  //       if (res.data.msg) {
  //         that.toast.showToast(res.data.msg);
  //       }

  //       //评论成功
  //       //收起键盘，表情
  //       that.onTouchHiddenEmoji();
  //       //刷新界面,
  //       that.data.pldata.items.unshift({
  //         PLID: res.data.plid,
  //         CONTENT: decodeURIComponent(content),
  //         ZANCNT: 0,
  //         DLEVEL: 1,
  //         ZANSTATUS: 0,
  //         USERID: app.globalData.requestParams.userid,
  //         NICKNAME: app.globalData.userInfo.nickName,
  //         HEADURL: app.globalData.userInfo.avatarUrl,
  //         likepic: '../imgs/content_btn_like.png',
  //         emojiMsg: emojiFn.emojiAnalysis([content]),
  //         clickLikeAnimation: {},
  //       })
  //       var plcount = that.data.artdata.plcnt;
  //       if (!plcount){
  //         plcount = 0;
  //       }
  //       that.setData({
  //         inputvalue: "", //清空输入框
  //         ['pldata.items']: that.data.pldata.items,
  //         plcount: parseInt(plcount)+1,
  //         ['artdata.plcnt']: parseInt(plcount) + 1
  //       });

  //       // console.log(that.data.pldata.items[0]);

  //       //拿到栈页面
  //       var arrPages = getCurrentPages();
  //       if (-1 != that.data.dataIndex && arrPages.length > 1 && (arrPages[arrPages.length - 2].route == 'pages/index/index' || arrPages[arrPages.length - 2].route == 'pages/myzancollectioncomments/myzancollectioncomments')) {
  //         //从首页列表页打开的详情页,刷新首页数据
  //         var plcount = arrPages[arrPages.length - 2].data.CurListData.items[that.data.dataIndex].plcnt;
  //         arrPages[arrPages.length - 2].setData({
  //           ['CurListData.items[' + that.data.dataIndex + '].plcnt']: parseInt(plcount) + 1,
  //           ['CurListData.items[' + that.data.dataIndex + '].commentstatus']: 1,
  //         });
  //       }



  //     },
  //     complete: function() {
  //       that.data.isSendPl = false;
  //     }
  //   });


  // },

})