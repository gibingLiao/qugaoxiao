// pages/myzancollectioncomments/myzancollectioncomments.js
const app = getApp();
var emojiFn = require('../../utils/emoj.js');
const TxvContext = requirePlugin("tencentvideo");
var arrItemIndex = []; //记录页面显示的节点索引
var systemInfo = wx.getSystemInfoSync();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    CurListData: {
      items: [],
    },
    isAnimatingLike: false, //是否正在执行点赞动画
    isAnimatingCollection: false, //是否正在执行收藏动画
    videoIndex: -1, //正在播放的video的索引
    videoHeight: 0, //播放器的高度
    vid: 0, //腾讯播放插件的vid

    mPage: 1,

    currentPageType: 0, //当前页面类型 1--我的赞  2--我的收藏  3--我的评论 
    isLoadingData: false, //是否正在请求数据

    hasMoreData: true, //是否可以加载下一页有更多数据

    showemptyzan: false, //赞数据为空
    showemptycollection: false, //收藏数据为空
    showemptycomments: false, //评论数据为空

    //是否展示登录覆盖的btn
    isShowBtnCover: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.height = systemInfo.windowHeight;
    this.data.currentPageType = options.type;
    //加载数据
    this.LoadNextPage(this.data.currentPageType, false);
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
    var url = "https://app.xiaogechui.cn/webservice/article/articles.ashx";
    if (1 == pageType) {
      //我的点赞
      url = url + "?action=QueryArtZanList&pageno=" + this.data.mPage
    } else if (2 == pageType) {
      //我的收藏
      url = url + "?action=QueryArtCollectList&pageno=" + this.data.mPage
    } else if (3 == pageType) {
      //我的评论
      url = url + "?action=QueryArtCommentList&pageno=" + this.data.mPage
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


        if (!isLoadMore && (!items || items.length <= 0)) {
          if (pageType == 1) {
            //赞数据为空
            that.setData({
              showemptyzan: true
            });
          } else if (pageType == 2) {
            //收藏数据为空
            that.setData({
              showemptycollection: true
            });
          } else if (pageType == 3) {
            //评论数据为空
            that.setData({
              showemptycomments: true,
            });
          }
        }

        if (items && items.length > 0) {
          that.data.hasMoreData = true
        } else {
          that.data.hasMoreData = false;
        }

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

        if (isLoadMore) {
          //加载下一页
          that.setData({
            ['CurListData.items']: that.data.CurListData.items.concat(items),
          });
        } else {
          //下拉刷新
          that.setData({
            ['CurListData.items']: [],
          });
          // 一键回到顶部
          if (wx.pageScrollTo) {
            wx.pageScrollTo({
              scrollTop: 0
            })
          }
          that.setData({
            ['CurListData.items']: items,
          });

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

    let height = this.data.height // 页面的可视高度
    wx.createSelectorQuery().selectAll('.art-item').boundingClientRect((ret) => {
      arrItemIndex.length = 0;
      ret.forEach((item, index) => {

        if (item.top <= height && item.top + item.height > 0) {
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

          var videoContextPrev = TxvContext.getTxvContext('video' + this.data.videoIndex)
          videoContextPrev.pause();
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
          var videoContextPrev = TxvContext.getTxvContext('video' + this.data.videoIndex)
          videoContextPrev.pause();
          this.setData({
            videoIndex: -1,
          })
        }

      }

    }).exec()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var title = '';
    if (this.data.currentPageType == 1) {
      title = '我的赞';
    } else if (this.data.currentPageType == 2) {
      title = '我的收藏';
    } else if (this.data.currentPageType == 3) {
      title = '我的评论';
    }

    wx.setNavigationBarTitle({
      title: title,
    })

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

      var videoContextPrev = TxvContext.getTxvContext('video' + this.data.videoIndex)
      videoContextPrev.pause();
      this.setData({
        videoIndex: -1,
      })

    }

    //请求接口
    this.LoadNextPage(this.data.currentPageType, false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      this.LoadNextPage(this.data.currentPageType, true);
    }
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

        }
        // shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;　　
      }
    }

    return shareObj;
  },

  /**分享的点击 */
  onShareClick: function() {},

  //获取用户信息回调
  getUserInfoCallBack: function(res) {

    if (res.detail.errMsg == "getUserInfo:ok") {
      var type = res.currentTarget.dataset.type
      app.globalData.userInfo = res.detail.userInfo;

      if (type == 0) {
        //点赞需要登录
        app.CheckLoginCallBack(this.onClickLike, res);
      } else if (type == 1) {
        //收藏需要登录
        app.CheckLoginCallBack(this.onClickCollection, res);
      }

    }
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