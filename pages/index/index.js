//index.js

import timer from 'timer.js'

//获取应用实例
const app = getApp();
var arrItemIndex = []; //记录页面显示的节点索引
var systemInfo = wx.getSystemInfoSync();
const TxvContext = requirePlugin("tencentvideo");
var emojiFn = require('../../utils/emoj.js');

Page({
  ...timer.options,
  data: {
    ...timer.data,
    userInfo: {},
    headurl: '../imgs/default-head.png',
    CurListData: {
      items: [],
    },
    timeConfigTimes: 4, //每圈分几段
    timeConfigSec: 8, //每段几秒钟
    isAnimatingLike: false, //是否正在执行点赞动画
    isAnimatingCollection: false, //是否正在执行收藏动画
    videoIndex: -1, //正在播放的video的索引
    videoHeight: 0, //播放器的高度
    vid: 0, //腾讯播放插件的vid
    // zhutiimg: 'http://ddzgg.dandanz.com/20190403/1049/636898853405533565.gif', //主题的图片
    // zhutiIds: '270', //主题点击id
    indicatorCurrentIndex: 0, //指示器当前位置
    indicatorAnimation: {}, //指示器动画
    isAnimationIndicator: false, //是否正在执行指示器动画
    //指示器的左边距
    indicatorLeft: (systemInfo.windowWidth - 280 / 750 * systemInfo.windowWidth) / 14,
    hasTranslate: 0, //移动的距离
    //各个选项的颜色
    tuijiancolor: '#2d2d2d',
    tuwencolor: '#979797',
    duanzicolor: '#979797',
    dongtucolor: '#979797',
    shipincolor: '#979797',
    repingcolor: '#979797',
    biaoqiancolor: '#979797',
    //加粗效果
    tuijianFontWeight: 600,
    tuwenFontWeight: 400,
    duanziFontWeight: 400,
    dongtuFontWeight: 400,
    shipinFontWeight: 400,
    repingFontWeight: 400,
    biaoqianFontWeight: 400,
    //加载的stime9999-01-01
    mStringStimeTuijian: '',
    mStringStimeTuwen: '',
    mStringStimeDuanzi: '',
    mStringStimeDongtu: '',
    mStringStimeShipin: '',
    mStringStimeReping: '',
    mStringStimeBiaoqian: '',
    mPage: 1,
    currentPageType: 0, //当前页面类型 0--推荐  1--图文  2--段子  3--动图  4--视频  5--热评  6--标签
    isLoadingData: false, //是否正在请求数据
    itemMaleHot: [], //标签男生热点
    itemFemaleHot: [], //女生热点
    isShowHotTags: false, //是否展示标签 
    selectHotTagId: '', //选中的标签id
    selectHotTag: '', //选中的标签id
    selectHotTagType: -1, //选中标签属于哪种类型0--男人热点  1--女生热点
    selectHotTagIndex: -1, //选中标签的索引
    isShowHorizontalTag: false, //是否展示水平标签选项
    // contentPaddingTop: 0, //列表内容距离顶部的距离163
    contentPaddingTop: 163,

    //到顶部浮动或者不浮动的样式，让android和ios的刷新样式一致
    // usertopstyle: 'container-head-zhuti-nofixed',
    // navtopstyle: 'nav-menu-nofixed',

    usertopstyle: 'container-head-zhuti',
    navtopstyle: 'nav-menu',

    //是否展示登录覆盖的btn
    isShowBtnCover: true,


  },


  onLoad: function(option) {



    wx.getSystemInfo({ // 获取页面可视区域的高度
      success: (res) => {
        this.setData({
          height: res.windowHeight,
        })
      },
    })

    // this.setData({
    //   userInfo: app.globalData.userInfo
    // });


    this.LoadNextPage(this.data.currentPageType, false);

    // this.ProgressStartNextSection();
    //获取主题信息
    this.getZhutiData();

    //判断是否是从分享进来
    if (option && option.share_artid && option.share_atype) {
      //去详情页
      var index = -1;
      var atype = option.share_atype;
      var url;
      if ('0' == atype) {
        //段子
        url = '../duanzidetail/duanzidetail?zhaiyao=' + option.share_zhaiyao + '&artid=' + option.share_artid;

      } else if ('5' == atype) {
        //图文
        url = '../tuwendetail/tuwendetail?artid=' + option.share_artid;
      } else if ('2' == atype || '4' == atype) {
        //图片和gif
        url = '../picdetail/picdetail?artid=' + option.share_artid;
      } else if ('1' == atype || '3' == atype) {
        //视频
        url = '../videodetail/videodetail?artid=' + option.share_artid;
      }
      if (url) {
        wx.navigateTo({
          url: url + '&index=' + index
        })
      }

    };


  },




  //主题的点击
  onZhuTiClick: function() {
    //跳转到标签对应的tagid
    if (!this.data.itemMaleHot || this.data.itemMaleHot.length <= 0) {
      return;
    }

    //如果现在正在标签页并且选中id对应上，return
    if (this.data.currentPageType == 6 && this.data.selectHotTagId == this.data.zhutiIds) {
      return;
    }


    //先将上次选中的置位不选中
    if (this.data.selectHotTag) {
      if (this.data.selectHotTagType == 0) {
        this.setData({
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].ISSELECTED']: '0',
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].showtextcolor']: this.data.itemMaleHot[this.data.selectHotTagIndex].textColor,
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].showbg']: this.data.itemMaleHot[this.data.selectHotTagIndex].colorBg,
        });
      } else if (1 == this.data.selectHotTagType) {
        this.setData({
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].ISSELECTED']: '0',
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].showtextcolor']: this.data.itemFemaleHot[this.data.selectHotTagIndex].textColor,
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].showbg']: this.data.itemFemaleHot[this.data.selectHotTagIndex].colorBg,
        });
      }
    }


    //找到对应的tagid
    var hasfind = false;
    var findIndex = -1;
    for (var i = 0; i < this.data.itemMaleHot.length; i++) {
      if (this.data.itemMaleHot[i].TAGID == this.data.zhutiIds) {
        hasfind = true;
        findIndex = i;
        break;
      }
    }

    if (!hasfind) {
      for (var i = 0; i < this.data.itemFemaleHot.length; i++) {
        if (this.data.itemFemaleHot[i].TAGID == this.data.zhutiIds) {
          hasfind = true;
          findIndex = i;
          break;
        }
      }

      if (hasfind) {
        //点击的女生热点
        this.setData({
          ['itemFemaleHot[' + findIndex + '].ISSELECTED']: '1',
          ['itemFemaleHot[' + findIndex + '].showtextcolor']: this.data.itemFemaleHot[findIndex].textSelectColor, //文字选中
          ['itemFemaleHot[' + findIndex + '].showbg']: this.data.itemFemaleHot[findIndex].sColorBg, //背景选中
          selectHotTagType: 1,
          selectHotTagIndex: findIndex,
          selectHotTagId: this.data.itemFemaleHot[findIndex].TAGID,
          selectHotTag: decodeURIComponent(this.data.itemFemaleHot[findIndex].TAG),
        });


        //找到，刷新界面
        if (this.data.currentPageType == 6) {
          //请求标签数据
          this.LoadNextPage(6, false);
        } else {
          this.SelectMenu({
            currentTarget: {
              dataset: {
                type: 6
              }
            }
          });
        }



      }

    } else {
      //找到，刷新界面

      this.setData({
        ['itemMaleHot[' + findIndex + '].ISSELECTED']: '1',
        ['itemMaleHot[' + findIndex + '].showtextcolor']: this.data.itemMaleHot[findIndex].textSelectColor, //文字选中
        ['itemMaleHot[' + findIndex + '].showbg']: this.data.itemMaleHot[findIndex].sColorBg, //背景选中
        selectHotTagType: 0,
        selectHotTagIndex: findIndex,
        selectHotTagId: this.data.itemMaleHot[findIndex].TAGID,
        selectHotTag: decodeURIComponent(this.data.itemMaleHot[findIndex].TAG),
      });
      //找到，刷新界面
      if (this.data.currentPageType == 6) {

        //请求标签数据
        this.LoadNextPage(6, false);
      } else {
        this.SelectMenu({
          currentTarget: {
            dataset: {
              type: 6
            }
          }
        });
      }

    }



  },

  // //获取主题图片
  getZhutiData: function() {
    var url = 'https://app.xiaogechui.cn/xcx/qgx/qgx.ashx?action=QueryProjectConfig';
    var that = this;
    app.requestWithSessionId({
      url: url,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          zhutiimg: decodeURIComponent(res.data.imgurl),
          zhutiIds: decodeURIComponent(res.data.tagids),
        });
      },
      fail: function(res) {},
      complete: function(res) {

      }
    })

  },


  //下拉刷新
  onPullDownRefresh: function() {
    // wx.showNavigationBarLoading() //在标题栏中显示加载

    //关闭视频
    //腾讯源视频不用处理，划出屏幕暂停播放
    if (-1 != this.data.videoIndex && this.data.CurListData.items[this.data.videoIndex].atype == '1') {
      var videoContext = wx.createVideoContext('video' + this.data.videoIndex)
      videoContext.stop();
      this.setData({
        videoIndex: -1,
      })
    }

    if (-1 != this.data.videoIndex && this.data.CurListData.items[this.data.videoIndex].atype == '3') {
      var currPlayerContxt = TxvContext.getTxvContext('video' + this.data.videoIndex) //获取当前播放视频的上下文，可进行play，pause等操作
      currPlayerContxt.pause();
      this.setData({
        videoIndex: -1,
      })
    }



    //请求接口
    if (this.data.currentPageType == 6 && !this.data.selectHotTag) {
      wx.stopPullDownRefresh();

    } else {
      this.LoadNextPage(this.data.currentPageType, false);
    }


  },

  //加载下一页
  onReachBottom: function() {
    if (this.data.currentPageType != 6) {
      this.LoadNextPage(this.data.currentPageType, true);
    } else {
      if (this.data.selectHotTag) {
        this.LoadNextPage(this.data.currentPageType, true);
      }
    }

  },



  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

  //选中导航菜单
  SelectMenu: function(e) {
    //如果正在请求数据不让切换
    if (this.data.isLoadingData) {
      return;
    }


    var tuijiancolor = '#979797';
    var tuwencolor = '#979797';
    var duanzicolor = '#979797';
    var dongtucolor = '#979797';
    var shipincolor = '#979797';
    var repingcolor = '#979797';
    var biaoqiancolor = '#979797';
    //加粗效果
    var tuijianFontWeight = 400;
    var tuwenFontWeight = 400;
    var duanziFontWeight = 400;
    var dongtuFontWeight = 400;
    var shipinFontWeight = 400;
    var repingFontWeight = 400;
    var biaoqianFontWeight = 400;

    var toTabIndex = e.currentTarget.dataset.type; //点击要切换到的idex

    //正在执行动画
    if (this.data.isAnimationIndicator) {
      return;
    }

    if (toTabIndex != 6) {
      if (toTabIndex == this.data.indicatorCurrentIndex) {
        return;
      }
    } else {

      //如果没有展示标签选择层，并且点击当前“标签“选项，可以return掉
      if (toTabIndex == this.data.indicatorCurrentIndex) {

        if (!this.data.isShowHotTags) {
          this.onHorizontalTagClick();
          return;
        } else if (this.data.isShowHotTags) {
          return;
        }
      }




    }




    //关闭视频
    //腾讯源视频不用处理，划出屏幕暂停播放
    if (-1 != this.data.videoIndex && this.data.CurListData.items[this.data.videoIndex].atype == '1') {
      var videoContext = wx.createVideoContext('video' + this.data.videoIndex)
      videoContext.stop();
      this.setData({
        videoIndex: -1,
      })
    }

    if (-1 != this.data.videoIndex && this.data.CurListData.items[this.data.videoIndex].atype == '3') {
      var currPlayerContxt = TxvContext.getTxvContext('video' + this.data.videoIndex) //获取当前播放视频的上下文，可进行play，pause等操作
      currPlayerContxt.pause();
      this.setData({
        videoIndex: -1,
      })
    }




    if (toTabIndex == 0) {
      //推荐
      tuijiancolor = '#2d2d2d';
      tuijianFontWeight = 600;
    } else if (toTabIndex == 1) {
      //图文
      tuwencolor = '#2d2d2d';
      tuwenFontWeight = 600;
    } else if (toTabIndex == 2) {
      //段子
      duanzicolor = '#2d2d2d';
      duanziFontWeight = 600;
    } else if (toTabIndex == 3) {
      //动图
      dongtucolor = '#2d2d2d';
      dongtuFontWeight = 600;
    } else if (toTabIndex == 4) {
      //视频
      shipincolor = '#2d2d2d';
      shipinFontWeight = 600;
    } else if (toTabIndex == 5) {
      //热评
      repingcolor = '#2d2d2d';
      repingFontWeight = 600;
    } else if (toTabIndex == 6) {
      //标签
      biaoqiancolor = '#2d2d2d';
      biaoqianFontWeight = 600;
    }

    //文字长度  80 / 750 * systemInfo.windowWidth;
    var textlength = systemInfo.windowWidth / 7;
    //移动距离
    var distance;
    if (toTabIndex > this.data.indicatorCurrentIndex) {
      //往右边移动
      distance = (toTabIndex - this.data.indicatorCurrentIndex - 1) * textlength + 2 * (systemInfo.windowWidth - 280 / 750 * systemInfo.windowWidth) / 14 + 40 / 750 * systemInfo.windowWidth;
    } else {
      //往左边移动
      distance = (toTabIndex - this.data.indicatorCurrentIndex + 1) * textlength - 2 * (systemInfo.windowWidth - 280 / 750 * systemInfo.windowWidth) / 14 - 40 / 750 * systemInfo.windowWidth;
    }

    distance = this.data.hasTranslate + distance;

    //赋值动画
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    animation.translate(distance).step();

    this.setData({
      indicatorCurrentIndex: toTabIndex, //指示器当前位置
      indicatorAnimation: animation.export(), //指示器动画
      isAnimationIndicator: true,
      hasTranslate: distance,
      tuijiancolor: tuijiancolor,
      tuijianFontWeight: tuijianFontWeight,
      tuwencolor: tuwencolor,
      tuwenFontWeight: tuwenFontWeight,
      duanzicolor: duanzicolor,
      duanziFontWeight: duanziFontWeight,
      dongtucolor: dongtucolor,
      dongtuFontWeight: dongtuFontWeight,
      shipincolor: shipincolor,
      shipinFontWeight: shipinFontWeight,
      repingcolor: repingcolor,
      repingFontWeight: repingFontWeight,
      biaoqiancolor: biaoqiancolor,
      biaoqianFontWeight: biaoqianFontWeight,
      currentPageType: toTabIndex,
    });

    //清空stime
    this.data.mStringStimeTuijian = '';
    this.data.mStringStimeTuwen = '';
    this.data.mStringStimeDuanzi = '';
    this.data.mStringStimeDongtu = '';
    this.data.mStringStimeShipin = '';
    this.data.mStringStimeReping = '';
    this.data.mStringStimeBiaoqian = '';
    //请求数据
    if (toTabIndex != 6) {
      this.LoadNextPage(this.data.currentPageType, false);

    } else {

      // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
      //清空列表
      this.setData({
        ['CurListData.items']: [],
      });
      //判断标签在不在如果在则去请求当前标签列表
      if (this.data.selectHotTag) {
        this.LoadNextPage(6, false);
      } else {
        //没有选中的tag。展现tag选择层
        var that = this;
        setTimeout(function() {
          that.setData({
            isShowHotTags: true,
          });
        }, 500);

      }
    }

  },


  //指示器动画执行完毕
  onIndicatorAnimationEnd: function() {

    this.setData({
      isAnimationIndicator: false,
    });
  },

  //加载下一页
  LoadNextPage: function(pageType, isLoadMore) {

    if (this.data.isLoadingData) {
      //如果正在请求数据，return掉
      return;
    }
    this.data.isLoadingData = true;

    //加载页码
    if (isLoadMore) {
      this.data.mPage = this.data.mPage + 1;
    } else {
      this.data.mPage = 1;
    }


    //加载链接
    var url;
    if (0 == pageType) {
      //推荐
      url = 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtList&tagid=&stime=' + this.data.mStringStimeTuijian + "&pageno=" + this.data.mPage;
    } else if (1 == pageType) {
      //图文
      url = 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtListByAtype&atype=5&stime=' + this.data.mStringStimeTuwen + "&pageno=" + this.data.mPage;
    } else if (2 == pageType) {
      //段子
      url = 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtListByAtype&atype=0&stime=' + this.data.mStringStimeDuanzi + "&pageno=" + this.data.mPage;
    } else if (3 == pageType) {
      //动图
      url = 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtListByAtype&atype=4&stime=' + this.data.mStringStimeDongtu + "&pageno=" + this.data.mPage;
    } else if (4 == pageType) {
      //视频
      url = 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtListByAtype&atype=3&stime=' + this.data.mStringStimeShipin + "&pageno=" + this.data.mPage;
    } else if (5 == pageType) {
      //热评
      url = 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryPLArtList&stime=' + this.data.mStringStimeReping + "&pageno=" + this.data.mPage;
    } else if (6 == pageType) {
      url = 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=QueryArtList&tagid=' + this.data.selectHotTagId + "&stime=" + this.data.mStringStimeBiaoqian + "&pageno=" + this.data.mPage;
    }

    var that = this;
    app.requestWithSessionId({
      url: url,
      data: {
        x: '',
        y: ''
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

        var items = res.data.items;
        for (var i = 0; i < items.length; i++) {
          items[i].title = decodeURIComponent(items[i].title);
          items[i].attadress = decodeURIComponent(items[i].attadress);
          items[i].imgurl = decodeURIComponent(items[i].imgurl);
          //用一个字段标明此刻的展示/播放
          items[i].showaddress = false;

          items[i].tag = decodeURIComponent(items[i].tag);
          items[i].zhaiyao = decodeURIComponent(items[i].zhaiyao);
          items[i].zhaiyao_seeall = '';
          if (items[i].zhaiyao.indexOf('查看全文') >= 0) {
            items[i].zhaiyao_seeall = '查看全文';
            items[i].zhaiyao = items[i].zhaiyao.replace('查看全文', '');
          }
          if (items[i].hotcomment) {
            for (var j = 0; j < items[i].hotcomment.length; j++) {
              items[i].hotcomment[j].HEADURL = decodeURIComponent(items[i].hotcomment[j].HEADURL);
              items[i].hotcomment[j].NICKNAME = decodeURIComponent(items[i].hotcomment[j].NICKNAME);
              items[i].hotcomment[j].CONTENT = decodeURIComponent(items[i].hotcomment[j].CONTENT);
              items[i].hotcomment[j].emojiMsg = emojiFn.emojiAnalysis([items[i].hotcomment[j].CONTENT]);

            }
          }

          //根据图片的宽高比例设置图片的样式
          var atype = items[i].atype;
          //  0 -- 文本  1 -- 视频  2--图片  3--web视频播放 4--gif 5--图文
          if ('0' != atype) {

            var imgW = items[i].imgw;
            var imgH = items[i].imgh;
            var scale = imgW / imgH;
            var imgfitw = items[i].imgfitw;
            items[i].imgstyle = 'art-item-con-img';
            //高度设置
            items[i].imgVideoHeight = (systemInfo.windowWidth - 80 / 750 * systemInfo.windowWidth) / scale;

            if (scale < 0.8 && 1 != imgfitw) {
              //将图片宽度设置成60%，样式2
              items[i].imgstyle = 'art-item-con-img-2';
              items[i].imgVideoHeight = (systemInfo.windowWidth - 80 / 750 * systemInfo.windowWidth) * 0.6 / scale;
            }
          }


          //根据点赞状态设置点赞的图片显示
          if ('1' == items[i].zanstatus) {
            items[i].likepic = '../imgs/content_btn_liked.png';
          } else {
            items[i].likepic = '../imgs/content_btn_like.png';
          }
          //点赞动画的执行字段
          items[i].clickLikeAnimation = {};

          //根据点赞状态设置收藏图片
          if ('1' == items[i].collectstatus) {
            items[i].collectionpic = '../imgs/content_btn_collected.png';
          } else {
            items[i].collectionpic = '../imgs/content_btn_collect.png';
          }
          //收藏动画的执行字段
          items[i].clickCollectionAnimation = {};

          //保存个wxkey
          if (isLoadMore) {
            items[i].id = that.data.CurListData.items.length + i;
          } else {
            items[i].id = i;
          }

        }


        //设置顶部padding值和标签的显示隐藏
        if (pageType != 6) {
          that.setData({
            contentPaddingTop: 163,
            isShowHorizontalTag: false,
          });
        } else {
          that.setData({
            contentPaddingTop: 163 + 88,
            isShowHorizontalTag: true,
          });
        }

        if (isLoadMore) {
          //加载下一页
          that.setData({
            ['CurListData.items']: that.data.CurListData.items.concat(items),
            isShowHotTags: false,
          });
        } else {
          //下拉刷新
          that.setData({
            ['CurListData.items']: [],
            isShowHotTags: false,
          });
          // 一键回到顶部
          if (wx.pageScrollTo) {
            wx.pageScrollTo({
              scrollTop: 0
            })
          }
          that.setData({
            ['CurListData.items']: items,
            isShowHotTags: false,
          });



        }


        //赋值stime
        if (pageType == 0) {
          //推荐
          that.data.mStringStimeTuijian = res.data.stime;
        } else if (pageType == 1) {
          //图文
          that.data.mStringStimeTuwen = res.data.stime;
        } else if (pageType == 2) {
          //段子
          that.data.mStringStimeDuanzi = res.data.stime;
        } else if (pageType == 3) {
          //动图
          that.data.mStringStimeDongtu = res.data.stime;
        } else if (pageType == 4) {
          //视频
          that.data.mStringStimeShipin = res.data.stime;
        } else if (pageType == 5) {
          //热评
          that.data.mStringStimeReping = res.data.stime;
        } else if (pageType == 6) {
          //标签
          that.data.mStringStimeBiaoqian = res.data.stime;
        }
      },
      fail: function(res) {},
      complete: function(res) {

        that.data.isLoadingData = false;
        //接口结束，取消下拉刷新
        if (!isLoadMore) {
          wx.stopPullDownRefresh();
        }
        that.chechLogin();
      }
    });

  },



  //开启下一段计时
  ProgressStartNextSection: function() {


    //正在执行动画，不处理
    if (this.data.isAniming) {
      return;
    }

    var perSection = 95 / this.data.timeConfigTimes;

    var progress = this.data.curProgress + perSection;
    var duration = this.data.timeConfigSec * 1000;

    if (progress > 95) {
      if (this.data.curProgress < 95) {
        progress = 95;
      } else {
        progress = 100;
        duration = 5 / perSection * this.data.timeConfigSec;
      }
    }

    if (progress > 100) {
      progress = 100;
    }

    this.draw('timerCanvas', progress, duration, true, this.ProgressArriveAtDelegate);

  },

  //到达指定进度代理
  ProgressArriveAtDelegate: function(progress) {
    console.log(progress);

    if (progress == 100) {
      this.draw('timerCanvas', 1, 10, false, this.ProgressArriveAtDelegate);

      //阅读奖励
      wx.showToast({
        title: '发放阅读奖励',
        icon: 'success',
        duration: 2000
      })
    }
  },




  //赞的点击
  onClickLike: function(event) {

    if (this.data.isAnimatingLike) {
      return;
    }

    //拿到此条数据源和索引
    var item = event.currentTarget.dataset.item;
    var index = event.currentTarget.dataset.index;

    if (!item) {
      return;
    }

    var that = this;
    //调用点赞接口
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=SwitchArtZan&artid=' + item.artid,
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
        var zanstatus = item.zanstatus;
        var zanCount = item.zancnt; //点赞数
        var likepic = item.likepic;
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
          zanCount++;
          likepic = '../imgs/content_btn_liked.png';
        }


        //赋值动画
        var animation = wx.createAnimation({
          duration: 600,
          timingFunction: 'ease'
        })
        animation.opacity(0).scale(2, 2).step(); //修改透明度,放大

        //刷新点赞界面
        that.setData({
          ['CurListData.items[' + index + '].zanstatus']: zanstatus, //点赞状态
          ['CurListData.items[' + index + '].likepic']: likepic, //点赞的图片
          ['CurListData.items[' + index + '].zancnt']: zanCount, //点赞的数量
          ['CurListData.items[' + index + '].clickLikeAnimation']: animation.export(), //点赞动画
          isAnimatingLike: true, //正在执行点赞动画
        });

      },
      complete: function(res) {
        that.chechLogin();
      }
    });


  },


  //点赞动画结束监听
  onLikeAnimationEnd: function(event) {
    //这个动画会执行两次，每个动画执行完毕阶段会进一次，一个放大，一个渐变，会进两次回调

    if (!this.data.isAnimatingLike) {
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
      ['CurListData.items[' + index + '].clickLikeAnimation']: animation.export(), //点赞动画
      isAnimatingLike: false, //执行点赞动画完毕
    });
  },


  //收藏的点击
  onClickCollection: function(event) {
    if (this.data.isAnimatingCollection) {
      return;
    }

    //拿到此条数据源和索引
    var item = event.currentTarget.dataset.item;
    var index = event.currentTarget.dataset.index;

    if (!item) {
      return;
    }

    var that = this;
    //收藏接口
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=SwitchArtCollect&artid=' + item.artid,
      needlogin: true,
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        if (res.data.status != 0) {
          return;
        }

        //获取收藏状态
        var collectstatus = item.collectstatus
        var collectionpic = item.collectionpic
        if (collectstatus == '1') {
          //取消收藏
          collectstatus = '0';
          collectionpic = '../imgs/content_btn_collect.png';
        } else {
          //收藏
          collectstatus = '1';
          collectionpic = '../imgs/content_btn_collected.png';
        }

        //赋值动画
        var animation = wx.createAnimation({
          duration: 600,
          timingFunction: 'ease'
        })
        animation.opacity(0).scale(2, 2).step(); //修改透明度,放大

        //刷新收藏按钮界面
        that.setData({
          ['CurListData.items[' + index + '].collectstatus']: collectstatus, //点赞状态
          ['CurListData.items[' + index + '].collectionpic']: collectionpic, //点赞的图片
          ['CurListData.items[' + index + '].clickCollectionAnimation']: animation.export(), //点赞动画
          isAnimatingCollection: true, //正在执行点赞动画
        });
      },
      complete: function(res) {
        that.chechLogin();
      }
    });

  },


  //收藏点击动画结束监听
  onCollectionAnimationEnd: function(event) {
    //这个动画会执行两次，每个动画执行完毕阶段会进一次，一个放大，一个渐变，会进两次回调
    if (!this.data.isAnimatingCollection) {
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
      ['CurListData.items[' + index + '].clickCollectionAnimation']: animation.export(), //点赞动画
      isAnimatingCollection: false, //执行收藏动画完毕
    });
  },


  //图片的点击
  onPicClick: function(event) {
    var index = event.currentTarget.dataset.index;
    var itemdata = this.data.CurListData.items[index];
    var atype = itemdata.atype;

    if ('4' == atype) {
      //播放与暂停gif
      var showimg = "";
      if (!itemdata.showaddress || !itemdata.showimg || itemdata.showimg == itemdata.imgurl) {
        //开始播放gif
        showimg = itemdata.attadress;
      } else {
        //暂停gif
        showimg = "";
      }

      //是否正在加载中,如果此时需要加载gif，点击显示加载状态，否则不显示加载状态
      var isloadinggif = false;
      if (showimg) {
        isloadinggif = true;
      }

      this.setData({
        ['CurListData.items[' + index + '].showimg']: showimg,
        ['CurListData.items[' + index + '].showaddress']: false,
        ['CurListData.items[' + index + '].isloadinggif']: isloadinggif,
      });

    } else {
      //进内页
      this.GoArtDetail(event);
    }

  },

  //gif加载回调
  gifImageLoad: function(event) {
    var index = event.currentTarget.dataset.index;
    var itemdata = this.data.CurListData.items[index];
    var atype = itemdata.atype;
    if ('4' == atype) {
      var showaddress = false;
      if (itemdata.showimg == itemdata.imgurl) {
        //暂停gif，显示img，隐藏gif
        showaddress = false;
      } else {
        //播放gif，显示gif
        showaddress = true;
      }
      this.setData({
        ['CurListData.items[' + index + '].showaddress']: showaddress,
        ['CurListData.items[' + index + '].isloadinggif']: false,
      });
    }
  },





  //点击视频、
  onVideoClick: function(event) {
    var index = event.currentTarget.dataset.index;
    var videoHeight = 0;
    var vid = 0;

    var imgW = this.data.CurListData.items[index].imgw;
    var imgH = this.data.CurListData.items[index].imgh;
    var scale = imgW / imgH;
    var imgfitw = this.data.CurListData.items[index].imgfitw;

    var width = systemInfo.windowWidth - 80 / 750 * systemInfo.windowWidth;
    if (scale < 0.8 && 1 != imgfitw) {
      //将图片宽度设置成60%，此时按60%获取高度
      videoHeight = width * 0.6 / scale;
    } else {
      videoHeight = width / scale;
    }

    console.log(videoHeight + "   videoHeight");
    if ("3" == this.data.CurListData.items[index].atype) {
      //腾讯源视频
      vid = this.getParam('vid', this.data.CurListData.items[index].attadress);
      if (-1 == this.data.videoIndex) { // 没有播放时播放视频
        this.setData({
          videoIndex: index,
          videoHeight: videoHeight,
          vid: vid,
        })

      } else {
        var videoContextPrev = TxvContext.getTxvContext('video' + this.data.videoIndex)
        videoContextPrev.pause();
        this.setData({
          videoIndex: index,
          videoHeight: videoHeight,
          vid: vid,
        })
        // var videoContextCurrent = TxvContext.getTxvContext('video' + index)
        // videoContextCurrent.play()
      }


      //将点击视频进行播放
      var currPlayerContxt = TxvContext.getTxvContext('video' + index) //获取当前播放视频的上下文，可进行play，pause等操作
      currPlayerContxt.play();

    } else {
      //mp4视频
      if (-1 != this.data.videoIndex) { // 没有播放时播放视频
        var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex)

        videoContextPrev.stop();
        // console.log("暂停" + this.data.videoIndex);
      }
      this.setData({
        videoIndex: index,
        videoHeight: videoHeight,
      })
      // console.log("播放" + index);
      var videoContext = wx.createVideoContext('video' + index)
      videoContext.play()
    }

    //开始加载
    this.setData({
      ['CurListData.items[' + index + '].isloadingvideo']: true,
    });

  },

  /**当开始/继续播放时触发play事件 */
  onVideoPlay: function(event) {
    var index = event.currentTarget.dataset.index
    console.log("onVideoPlay  " + index);
    //隐藏loading
    this.setData({
      ['CurListData.items[' + index + '].isloadingvideo']: false,
    });
  },

  /**当暂停播放时触发 pause 事件 */
  onVideoPause: function(event) {
    var index = event.currentTarget.dataset.index
    console.log("onVideoPause  " + index);
    //隐藏loading
    this.setData({
      ['CurListData.items[' + index + '].isloadingvideo']: false,
    });
  },

  /**视频发生缓冲时候调用 */
  onVideoWaiting: function() {

    console.log("onVideoWaiting");
  },

  /** 
   * 获取指定的URL参数值 
   * URL:http://www.quwan.com/index?name=tyler 
   * 参数：paramName URL参数 
   * 调用方法:getParam("name") 
   * 返回值:tyler 
   */
  getParam: function(name, url) {
    url = url.replace(new RegExp("&amp;", "gm"), "&");
    var num = url.indexOf("?")
    url = url.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },


  //点击文章进入详情
  GoArtDetail: function(event) {

    var index = event.currentTarget.dataset.index;
    var itemdata = this.data.CurListData.items[index];
    var atype = itemdata.atype;
    var url;
    if ('0' == atype) {
      //段子
      url = '../duanzidetail/duanzidetail?zhaiyao=' + encodeURIComponent(itemdata.zhaiyao) + '&artid=' + itemdata.artid + "&dataindex=" + index;

    } else if ('5' == atype) {
      //图文
      url = '../tuwendetail/tuwendetail?artid=' + itemdata.artid + "&dataindex=" + index;
    } else if ('2' == atype || '4' == atype) {
      //图片和gif
      url = '../picdetail/picdetail?artid=' + itemdata.artid + "&dataindex=" + index;
    } else if ('1' == atype || '3' == atype) {
      //视频
      url = '../videodetail/videodetail?artid=' + itemdata.artid + "&dataindex=" + index;
    }
    if (url) {
      wx.navigateTo({
        url: url + '&index=' + index
      })
    }
  },

  //页面滚动事件
  onPageScroll: function(event) {

    // if (event.scrollTop > 0) {
    //   //有不浮动变为浮动
    //   //变为浮动状态
    // console.log(event.scrollTop + "  00  " + this.data.usertopstyle);
    //   if (this.data.usertopstyle == 'container-head-zhuti-nofixed') {
    //     console.log(event.scrollTop + "    " + this.data.usertopstyle);
    //     this.setData({
    //       usertopstyle: 'container-head-zhuti',
    //       navtopstyle: 'nav-menu',
    //       contentPaddingTop: 163,
    //     });
    //   }

    // } else {
    //   if (this.data.usertopstyle == 'container-head-zhuti') {
    //     //由浮动变为不浮动
    //     //往下拉状态,变为不浮动
    //     console.log(event.scrollTop + "  ...   " + this.data.usertopstyle);
    //     this.setData({
    //       usertopstyle: 'container-head-zhuti-nofixed',
    //       navtopstyle: 'nav-menu-nofixed',
    //       contentPaddingTop: 0,
    //     });
    //   }

    // }


    let height = this.data.height // 页面的可视高度
    var that = this;
    wx.createSelectorQuery().selectAll('.art-item').boundingClientRect((ret) => {
      arrItemIndex.length = 0;
      ret.forEach((item, index) => {

        if (item.top <= height && item.top + item.height > 163 / 750 * systemInfo.windowWidth) {
          // 判断是否在显示范围内
          // console.log('在' + index + "      " + item.top + "    " + height);
          arrItemIndex.push(index)
        }
      })
      // console.log('======' + arrItemIndex[0] + "  " + arrItemIndex[arrItemIndex.length - 1]);
      //获取在屏幕范围内的最大索引和最小索引
      var maxIndex = arrItemIndex[arrItemIndex.length - 1];
      var minIndex = arrItemIndex[0];
      //刷新最大索引之后的两个item和最小索引之前的item，让播放状态都初始化
      var item1;
      var item2;

      if (minIndex - 1 >= 0) {
        item1 = this.data.CurListData.items[minIndex - 1];
        //取出gif播放状态,如果正在播放，停止播放
        if (item1.showaddress) {
          this.setData({
            ['CurListData.items[' + (minIndex - 1) + '].showaddress']: false,
            ['CurListData.items[' + (minIndex - 1) + '].showimg']: "",
          });
        }
        //腾讯源视频不用处理，划出屏幕暂停播放
        if (item1.atype == '1' && -1 != this.data.videoIndex && this.data.videoIndex == (minIndex - 1)) {

          var videoContext = wx.createVideoContext('video' + this.data.videoIndex)
          videoContext.stop();
          this.setData({
            videoIndex: -1,
          })
        }

        if (item1.atype == '3' && -1 != this.data.videoIndex && this.data.videoIndex == (minIndex - 1)) {
          var currPlayerContxt = TxvContext.getTxvContext('video' + this.data.videoIndex) //获取当前播放视频的上下文，可进行play，pause等操作
          currPlayerContxt.pause();
          this.setData({
            videoIndex: -1,
          })
        }

      }

      if (maxIndex + 1 < this.data.CurListData.items.length - 1) {
        item2 = this.data.CurListData.items[maxIndex + 1];
        //取出gif播放状态,如果正在播放，停止播放
        if (item2.showaddress) {
          this.setData({
            ['CurListData.items[' + (maxIndex + 1) + '].showaddress']: false,
            ['CurListData.items[' + (maxIndex + 1) + '].showimg']: "",
          });
        }
        //腾讯源视频不用处理，划出屏幕暂停播放
        if (item2.atype == '1' && -1 != this.data.videoIndex && this.data.videoIndex == (maxIndex + 1)) {
          var videoContext = wx.createVideoContext('video' + this.data.videoIndex)
          videoContext.stop();
          this.setData({
            videoIndex: -1,
          })
        }

        if (item2.atype == '3' && -1 != this.data.videoIndex && this.data.videoIndex == (maxIndex + 1)) {
          var currPlayerContxt = TxvContext.getTxvContext('video' + this.data.videoIndex) //获取当前播放视频的上下文，可进行play，pause等操作
          currPlayerContxt.pause();
          this.setData({
            videoIndex: -1,
          })
        }


      }

    }).exec()
  },


  //去我的界面
  GoMyInfo: function() {
    wx.navigateTo({
      url: '../myinfo/myinfo'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


    //请求标签数据
    var that = this;
    app.requestWithSessionId({
      url: 'https://app.xiaogechui.cn/webservice/article/tags.ashx?action=QueryHotTags',
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
          return;
        }

        //解码操作
        for (var i = 0; i < res.data.items.length; i++) {
          res.data.items[i].TAG = decodeURIComponent(res.data.items[i].TAG);
          //背景颜色和背景选中颜色
          res.data.items[i].colorBg = res.data.items[i].BGCOLOR ? decodeURIComponent(res.data.items[i].BGCOLOR) : "#ffffff";
          res.data.items[i].sColorBg = res.data.items[i].SBGCOLOR ? decodeURIComponent(res.data.items[i].SBGCOLOR) : "#ffffff";
          //文字颜色和选中色
          res.data.items[i].textColor = res.data.items[i].TEXTCOLOR ? decodeURIComponent(res.data.items[i].TEXTCOLOR) : "#656565";
          res.data.items[i].textSelectColor = res.data.items[i].STEXTCOLOR ? decodeURIComponent(res.data.items[i].STEXTCOLOR) : "#fd455d";

          if ('1' == res.data.items[i].ISSELECTED) {
            //选中
            res.data.items[i].showtextcolor = res.data.items[i].textSelectColor;
            res.data.items[i].showbg = res.data.items[i].sColorBg;
          } else {
            //不选中
            res.data.items[i].showtextcolor = res.data.items[i].textColor;
            res.data.items[i].showbg = res.data.items[i].colorBg;
          }
        }

        for (var i = 0; i < res.data.items2.length; i++) {
          res.data.items2[i].TAG = decodeURIComponent(res.data.items2[i].TAG);
          //背景颜色和背景选中颜色
          res.data.items2[i].colorBg = res.data.items2[i].BGCOLOR ? decodeURIComponent(res.data.items2[i].BGCOLOR) : "#ffffff";
          res.data.items2[i].sColorBg = res.data.items2[i].SBGCOLOR ? decodeURIComponent(res.data.items2[i].SBGCOLOR) : "#ffffff";
          //文字颜色和选中色
          res.data.items2[i].textColor = res.data.items2[i].TEXTCOLOR ? decodeURIComponent(res.data.items2[i].TEXTCOLOR) : "#656565";
          res.data.items2[i].textSelectColor = res.data.items2[i].STEXTCOLOR ? decodeURIComponent(res.data.items2[i].STEXTCOLOR) : "#fd455d";

          if ('1' == res.data.items[i].ISSELECTED) {
            //选中
            res.data.items2[i].showtextcolor = res.data.items2[i].textSelectColor;
            res.data.items2[i].showbg = res.data.items2[i].sColorBg;
          } else {
            //不选中
            res.data.items2[i].showtextcolor = res.data.items2[i].textColor;
            res.data.items2[i].showbg = res.data.items2[i].colorBg;
          }
        }


        that.setData({
          itemMaleHot: res.data.items,
          itemFemaleHot: res.data.items2,
        });

      },
      fail: function(res) {},
      complete: function(res) {}
    });

    //头像刷新
    this.getUserInfo();
  },



  /**获取用户信息 设置头像*/
  getUserInfo: function() {

    if (app.globalData.userInfo.avatarUrl) {
      this.setData({
        headurl: decodeURIComponent(app.globalData.userInfo.avatarUrl),
      });
      return;
    }

    if (!app.globalData.requestParams.token || 0 == app.globalData.requestParams.token) {
      return;
    }
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
          headurl: decodeURIComponent(res.data.headurl),
        });


      },
      complete: function(res) {
        that.chechLogin();
      }
    });
  },

  //在热点词汇层选中热点的点击事件
  onSelectHotTagClick: function(event) {

    //先将上次选中的置位不选中
    if (this.data.selectHotTag) {
      if (this.data.selectHotTagType == 0) {
        this.setData({
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].ISSELECTED']: '0',
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].showtextcolor']: this.data.itemMaleHot[this.data.selectHotTagIndex].textColor,
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].showbg']: this.data.itemMaleHot[this.data.selectHotTagIndex].colorBg,
        });
      } else if (1 == this.data.selectHotTagType) {
        this.setData({
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].ISSELECTED']: '0',
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].showtextcolor']: this.data.itemFemaleHot[this.data.selectHotTagIndex].textColor,
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].showbg']: this.data.itemFemaleHot[this.data.selectHotTagIndex].colorBg,
        });
      }
    }

    //改变正在选中的tag状态
    var index = event.currentTarget.dataset.index;
    var type = event.currentTarget.dataset.type;
    if (0 == type) {
      //点击的男生热点
      this.setData({
        ['itemMaleHot[' + index + '].ISSELECTED']: '1',
        ['itemMaleHot[' + index + '].showtextcolor']: this.data.itemMaleHot[index].textSelectColor, //文字选中
        ['itemMaleHot[' + index + '].showbg']: this.data.itemMaleHot[index].sColorBg, //背景选中
        selectHotTagType: 0,
        selectHotTagIndex: index,
        selectHotTagId: this.data.itemMaleHot[index].TAGID,
        selectHotTag: decodeURIComponent(this.data.itemMaleHot[index].TAG),
      });
    } else {
      //点击的女生热点
      this.setData({
        ['itemFemaleHot[' + index + '].ISSELECTED']: '1',
        ['itemFemaleHot[' + index + '].showtextcolor']: this.data.itemFemaleHot[index].textSelectColor, //文字选中
        ['itemFemaleHot[' + index + '].showbg']: this.data.itemFemaleHot[index].sColorBg, //背景选中
        selectHotTagType: 1,
        selectHotTagIndex: index,
        selectHotTagId: this.data.itemFemaleHot[index].TAGID,
        selectHotTag: decodeURIComponent(this.data.itemFemaleHot[index].TAG),
      });

    }
    //请求标签数据
    this.LoadNextPage(6, false);
  },

  //水平的标签tag的点击
  onHorizontalTagClick: function() {

    //清空列表
    this.setData({
      ['CurListData.items']: [],
    });
    // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }

    //先将上次选中的置位不选中
    if (this.data.selectHotTag) {
      if (this.data.selectHotTagType == 0) {
        this.setData({
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].ISSELECTED']: '0',
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].showtextcolor']: this.data.itemMaleHot[this.data.selectHotTagIndex].textColor,
          ['itemMaleHot[' + this.data.selectHotTagIndex + '].showbg']: this.data.itemMaleHot[this.data.selectHotTagIndex].colorBg,
        });
      } else if (1 == this.data.selectHotTagType) {
        this.setData({
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].ISSELECTED']: '0',
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].showtextcolor']: this.data.itemFemaleHot[this.data.selectHotTagIndex].textColor,
          ['itemFemaleHot[' + this.data.selectHotTagIndex + '].showbg']: this.data.itemFemaleHot[this.data.selectHotTagIndex].colorBg,
        });
      }
    }

    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHotTags: true, //是否展示标签 
        selectHotTagId: '', //选中的标签id
        selectHotTag: '', //选中的标签id
        selectHotTagType: -1, //选中标签属于哪种类型0--男人热点  1--女生热点
        selectHotTagIndex: -1, //选中标签的索引
        isShowHorizontalTag: false, //是否展示水平标签选项
      });
    }, 500);

  },

  /**分享的时候调用 */
  onShareAppMessage: function(options) {
    // console.log(options);

    let that = this;
    var shareObj = {
      title: "", // 转发后 所显示的title
      path: '/pages/index/index', // 相对的路径
      imageUrl: "",

      success: (res) => { // 成功后要做的事情
        // console.log(res.shareTickets[0])

        // wx.getShareInfo({
        //   shareTicket: res.shareTickets[0],
        //   success: (res) => {
        //     that.setData({
        //       isShow: true
        //     })
        //     console.log(that.setData.isShow)
        //   },
        //   fail: function(res) {
        //     console.log(res)
        //   },
        //   complete: function(res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function(res) {
        // 分享失败
        // console.log(res)
      }
    }

    // 来自页面内的按钮的转发
    if (options) {
      console.log(options.from);
      if (options.from == 'button') {
        var item = options.target.dataset.item;
        if (item) {
          if (item.title) {
            shareObj.title = item.title;
          }
          if (item.imgurl) {
            shareObj.imageUrl = item.imgurl;
          }

          if (item.artid && item.atype) {
            shareObj.path = shareObj.path + "?share_artid=" + item.artid + "&share_atype=" + item.atype;
          }

          if (item.zhaiyao) {
            shareObj.path = shareObj.path + "&share_zhaiyao=" + encodeURIComponent(item.zhaiyao);
          }
        }

      }
    }

    return shareObj;
  },


  /**右上角推荐的点击 */
  onTuijianClick: function() {
    //跳转推荐页面
    wx.navigateTo({
      url: "../tuijian/tuijian"
    })
  },



  /**分享的点击 */
  onShareClick: function() {},


  /**item前面的tag点击 */
  onItemTagClick: function(event) {

    var tagid = event.currentTarget.dataset.tagid;

    //跳转到标签对应的tagid
    if (!this.data.itemMaleHot || this.data.itemMaleHot.length <= 0) {
      return;
    }

    //如果当前页是标签页并且选中热点一样，return
    if (6 == this.data.currentPageType && tagid == this.data.selectHotTagId) {
      return;
    }

    //找到对应的tagid
    var hasfind = false;
    var findIndex = -1;
    for (var i = 0; i < this.data.itemMaleHot.length; i++) {
      if (this.data.itemMaleHot[i].TAGID == tagid) {
        hasfind = true;
        findIndex = i;
        break;
      }
    }

    if (!hasfind) {
      for (var i = 0; i < this.data.itemFemaleHot.length; i++) {
        if (this.data.itemFemaleHot[i].TAGID == tagid) {
          hasfind = true;
          findIndex = i;
          break;
        }
      }

      if (hasfind) {
        //点击的女生热点
        this.setData({
          ['itemFemaleHot[' + findIndex + '].ISSELECTED']: '1',
          ['itemFemaleHot[' + findIndex + '].showtextcolor']: this.data.itemFemaleHot[findIndex].textSelectColor, //文字选中
          ['itemFemaleHot[' + findIndex + '].showbg']: this.data.itemFemaleHot[findIndex].sColorBg, //背景选中
          selectHotTagType: 1,
          selectHotTagIndex: findIndex,
          selectHotTagId: this.data.itemFemaleHot[findIndex].TAGID,
          selectHotTag: decodeURIComponent(this.data.itemFemaleHot[findIndex].TAG),
        });


        if (this.data.showTagid && this.data.currentPageType == 6) {
          //从内页点击过来的
          this.onSelectHotTagClick({
            currentTarget: {
              dataset: {
                index: findIndex,
                type: 1,
              }
            }
          });
          this.data.showTagid = "";
        } else {
          //找到，刷新界面
          this.SelectMenu({
            currentTarget: {
              dataset: {
                type: 6
              }
            }
          });
        }



      }

    } else {
      //找到，刷新界面

      this.setData({
        ['itemMaleHot[' + findIndex + '].ISSELECTED']: '1',
        ['itemMaleHot[' + findIndex + '].showtextcolor']: this.data.itemMaleHot[findIndex].textSelectColor, //文字选中
        ['itemMaleHot[' + findIndex + '].showbg']: this.data.itemMaleHot[findIndex].sColorBg, //背景选中
        selectHotTagType: 0,
        selectHotTagIndex: findIndex,
        selectHotTagId: this.data.itemMaleHot[findIndex].TAGID,
        selectHotTag: decodeURIComponent(this.data.itemMaleHot[findIndex].TAG),
      });
      if (this.data.showTagid && this.data.currentPageType == 6) {
        //从内页点击过来的
        this.onSelectHotTagClick({
          currentTarget: {
            dataset: {
              index: findIndex,
              type: 0,
            }
          }
        });
        this.data.showTagid = "";
      } else {
        //找到，刷新界面
        this.SelectMenu({
          currentTarget: {
            dataset: {
              type: 6
            }
          }
        });
      }
    }

  },

  //获取用户信息回调
  getUserInfoCallBack: function(res) {

    if (res.detail.errMsg == "getUserInfo:ok") {
      var type = res.currentTarget.dataset.type
      app.globalData.userInfo = res.detail.userInfo;

      if (type == 0) {
        //点赞需要登录
        app.CheckLoginCallBack(this.onClickLikeAndRefresuserinfo, res);
      } else if (type == 1) {
        //收藏需要登录
        app.CheckLoginCallBack(this.onClickCollectionAndRefresuserinfo, res);
      }

    }
  },

  onClickLikeAndRefresuserinfo: function(res) {
    this.onClickLike(res);
    this.getUserInfo();
  },
  onClickCollectionAndRefresuserinfo: function(res) {
    this.onClickCollection(res);
    this.getUserInfo();
  },


  /**校验覆盖登录按钮 */
  chechLogin: function() {
    if (!app.globalData.requestParams.token || 0 == app.globalData.requestParams.token) {
      this.setData({
        isShowBtnCover: true,
      });

    } else {
      this.setData({
        isShowBtnCover: false,
      });

    }


  },

})