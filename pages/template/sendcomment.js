const app = getApp();
export default {
  data: {

    currentContext: undefined, //用于更新界面的上下文
    systeminfo: undefined,
    emojiFn: undefined,

    //表情的集合
    enmojis: [

      {
        index: 0,
        name: "00.png",
        content: '微笑',
      },
      {
        index: 1,
        name: "01.png",
        content: '撇嘴',
      },
      {
        index: 2,
        name: "02.png",
        content: '色',
      },
      {
        index: 3,
        name: "03.png",
        content: '发呆',

      },
      {
        index: 4,
        name: "04.png",
        content: '得意',
      },
      {
        index: 5,
        name: "06.png",
        content: '害羞',
      },
      {
        index: 6,
        name: "08.png",
        content: '睡',
      },
      {
        index: 7,
        name: "09.png",
        content: '流泪',
      },
      {
        index: 8,
        name: "10.png",
        content: '尴尬',
      },
      {
        index: 9,
        name: "11.png",
        content: '发火',
      },
      {
        index: 10,
        name: "12.png",
        content: '调皮',
      },
      {
        index: 11,
        name: "13.png",
        content: '呲牙',
      },
      {
        index: 12,
        name: "14.png",
        content: '惊讶',
      },
      {
        index: 13,
        name: "15.png",
        content: '难过',
      },
      {
        index: 14,
        name: "16.png",
        content: '酷',
      },

      {
        index: 15,
        name: "17.png",
        content: '冷汗',
      },
      {
        index: 16,
        name: "18.png",
        content: '抓狂',
      },
      {
        index: 17,
        name: "19.png",
        content: '吐',
      },
      {
        index: 18,
        name: "20.png",
        content: '偷笑',
      },
      {
        index: 19,
        name: "21.png",
        content: '可爱',
      },
      {
        index: 20,
        name: "22.png",
        content: '白眼',
      },
      {
        index: 21,
        name: "23.png",
        content: '傲慢',
      },
      {
        index: 22,
        name: "26.png",
        content: '惊恐',
      },
      {
        index: 23,
        name: "27.png",
        content: '汗',
      },

      {
        index: 24,
        name: "28.png",
        content: '憨笑',
      },
      {
        index: 25,
        name: "29.png",
        content: '大兵',
      },
      {
        index: 26,
        name: "30.png",
        content: '奋斗',
      },
      {
        index: 27,
        name: "32.png",
        content: '疑问',
      },
      {
        index: 28,
        name: "33.png",
        content: '嘘',
      },
      {
        index: 29,
        name: "34.png",
        content: '晕',
      },
      {
        index: 30,
        name: "36.png",
        content: '衰',
      },
      {
        index: 31,
        name: "38.png",
        content: '打你',
      },
      {
        index: 32,
        name: "39.png",
        content: '拜拜',
      },
      {
        index: 33,
        name: "40.png",
        content: '擦汗',
      },
      {
        index: 34,
        name: "44.png",
        content: '坏笑',
      },
      {
        index: 35,
        name: "46.png",
        content: '右哼哼',
      },
      {
        index: 36,
        name: "48.png",
        content: '鄙视',
      },
      {
        index: 37,
        name: "49.png",
        content: '委屈',
      },
      {
        index: 38,
        name: "50.png",
        content: '快哭了',
      },
      {
        index: 39,
        name: "51.png",
        content: '奸笑',
      },
      {
        index: 40,
        name: "52.png",
        content: '亲亲',
      },
      {
        index: 41,
        name: "54.png",
        content: '拜托',
      },
      {
        index: 42,
        name: "55.png",
        content: '菜刀',
      },
      {
        index: 43,
        name: "56.png",
        content: '西瓜',
      },
      {
        index: 44,
        name: "57.png",
        content: '啤酒',
      },
      {
        index: 45,
        name: "60.png",
        content: '咖啡',
      },
      {
        index: 46,
        name: "61.png",
        content: '米饭',
      },
      {
        index: 47,
        name: "62.png",
        content: '猪头',
      },
      {
        index: 48,
        name: "63.png",
        content: '玫瑰',
      },
      {
        index: 49,
        name: "64.png",
        content: '枯萎',
      },
      {
        index: 50,
        name: "66.png",
        content: '心',
      },
      {
        index: 51,
        name: "68.png",
        content: '蛋糕',
      },
      {
        index: 52,
        name: "70.png",
        content: '炸弹',
      },
      {
        index: 53,
        name: "71.png",
        content: '匕首',
      },
      {
        index: 54,
        name: "73.png",
        content: '瓢虫',
      },
      {
        index: 55,
        name: "74.png",
        content: '屎',
      },
      {
        index: 56,
        name: "75.png",
        content: '月亮',
      },
      {
        index: 57,
        name: "78.png",
        content: '抱抱',
      },
      {
        index: 58,
        name: "79.png",
        content: '强',
      },
      {
        index: 59,
        name: "80.png",
        content: '垃圾',
      },
      {
        index: 60,
        name: "81.png",
        content: '握手',
      },
      {
        index: 61,
        name: "82.png",
        content: '胜利',
      },
      {
        index: 62,
        name: "83.png",
        content: '抱拳',
      },
      {
        index: 63,
        name: "84.png",
        content: '勾引',
      },
      {
        index: 64,
        name: "85.png",
        content: '拳头',
      },
      {
        index: 65,
        name: "86.png",
        content: '菜',
      },
      // 
      // 
      // 
      // '': '',
      {
        index: 66,
        name: "87.png",
        content: '手势',
      },
      {
        index: 67,
        name: "89.png",
        content: '哦了',
      },
      {
        index: 68,
        name: "90.png",
        content: '爱情',
      },
      {
        index: 69,
        name: "91.png",
        content: '企鹅亲',
      },
      {
        index: 70,
        name: "93.png",
        content: '发抖',

      },
      {
        index: 71,
        name: "116.png",
        content: '嘴唇',
      }

    ],
    enmojipages: [0, 1, 2, 3],
  },
  options: {

    //绑定上下文,在引入文件后的onload方法绑定
    bindContext: function(context, systeminfo, emojiFn) {
      this.data.currentContext = context;
      this.data.systeminfo = systeminfo;
      this.data.emojiFn = emojiFn;
    },

    //键盘弹出监听
    onKeyBoardFocus: function(event) {

      var that = this;

      if (that.data.currentContext.data.isshowenmoji) {
        //此时表情键盘是出来的，要收起表情出键盘，先将占位高度抹去
        var height = that.data.currentContext.data.zhanweiheight;
        height = height - (that.data.currentContext.data.keyboardheight * 750 / that.data.systeminfo.windowWidth);
        that.data.currentContext.setData({
          zhanweiheight: height,
        });
      }


      var keyboardheight = event.detail.height;


      that.data.currentContext.setData({
        isshowkeyboard: true,
        keyboardheight: keyboardheight,
        emojiH: keyboardheight * 0.8 / 3,
        emojiW: that.data.systeminfo.windowWidth / 7,
        //收起表情
        isshowenmoji: false,
        inputFocus: true,
      });

    },

    // 键盘收起监听
    onKeyBoardHidden: function(event) {

      var that = this;

      //如果表情面板是展示状态,认为现在是需要键盘的状态
      if (that.data.currentContext.data.isshowenmoji) {
        that.data.currentContext.setData({
          isshowkeyboard: true,
        });
      } else {
        that.data.currentContext.setData({
          isshowkeyboard: false,
          inputFocus: false,
        });
      }

    },

    //表情弹出键的点击
    onEmojiClick: function() {
      var that = this;

      //如果键盘禁用时，不让点击
      if (that.data.currentContext.data.disableinput) {
        return;
      }


      //如果没表情和键盘弹出，此时点击，应该拉起键盘
      if (!that.data.currentContext.data.isshowenmoji && !that.data.currentContext.data.inputFocus) {
        //拉起键盘
        that.data.currentContext.setData({
          isshowkeyboard: true,
          inputFocus: true,
        });
        return;
      }


      if (!that.data.currentContext.data.isshowenmoji) {
        //此时键盘弹出，点击出表情

        that.data.currentContext.setData({
          isshowenmoji: true,
        });


        //如果表情展示，占位高度加上表情高度，如果表情收起，占位高度减去表情高度
        var height = that.data.currentContext.data.zhanweiheight;

        height = height + (that.data.currentContext.data.keyboardheight * 750 / that.data.systeminfo.windowWidth);


        that.data.currentContext.setData({
          zhanweiheight: height
        });


      } else {

        var height = that.data.currentContext.data.zhanweiheight;
        height = height - (that.data.currentContext.data.keyboardheight * 750 / that.data.systeminfo.windowWidth);
        that.data.currentContext.setData({
          zhanweiheight: height
        });


        //此时键盘收起状态
        that.data.currentContext.setData({
          isshowenmoji: false,
          inputFocus: true,
        });

      }
    },

    /**只要输入发生变化就会触发这个事件，就能从这个事件中获取textare的输入值。 */
    bindinput: function(e) {

      var that = this;


      if (e.detail.cursor == e.detail.value.length && that.data.currentContext.data.inputvalue && that.data.currentContext.data.inputvalue.length > e.detail.value.length) {
        //用户点击了回删操作
        if (that.data.currentContext.data.inputvalue.endsWith("]")) {
          var lastindex = e.detail.value.lastIndexOf("[");
          if (lastindex >= 0) {
            //截取两个索引之间的字符，判断是否是表情
            var enmojiStr = e.detail.value.substring(lastindex) + "]";
            //遍历表情，判断是否是表情
            for (var i = 0; i < that.data.enmojis.length; i++) {
              if (("[" + that.data.enmojis[i].content + "]") == enmojiStr) {
                // console.log("找到表情了" + enmojiStr);
                that.data.currentContext.setData({
                  inputvalue: e.detail.value.substring(0, lastindex),
                });
                return;
              }
            }

          }
        }
      }

      that.data.currentContext.setData({
        inputvalue: e.detail.value
      });



    },



    //表情建点击
    onEmojiSelect: function(event) {

      var that = this;


      var index = event.currentTarget.dataset.index;
      var value = that.data.currentContext.data.inputvalue;
      value = value ? value : '';
      that.data.currentContext.setData({
        inputvalue: value + "[" + that.data.enmojis[index].content + "]"
      });
      //将光标移动到最后
    },

    //触摸关闭表情，键盘
    onTouchHiddenEmoji: function() {
      var that = this;
      if (that.data.currentContext.data.isshowenmoji) {
        var height = that.data.currentContext.data.zhanweiheight;
        height = height - (that.data.currentContext.data.keyboardheight * 750 / that.data.systeminfo.windowWidth);
        that.data.currentContext.setData({
          zhanweiheight: height
        });
      }

      that.data.currentContext.setData({
        isshowenmoji: false,
        inputFocus: false,
        isshowkeyboard: false,
      });
    },

    //点击发送评论按钮
    onClickSend: function() {
      //获取评论
      var that = this;
      var content = that.data.currentContext.data.inputvalue;
      if (!content) {
        that.data.currentContext.toast.showToast("评论不能为空");
        return;
      }
      //去除首尾空格
      content = content.replace(/(^\s*)|(\s*$)/g, "");
      if (!content) {
        that.data.currentContext.toast.showToast("评论不能为空");
        return;
      }


      if (that.data.currentContext.data.isSendPl) {
        return;
      }
      that.data.currentContext.data.isSendPl = true;

      app.requestWithSessionId({
        url: 'https://app.xiaogechui.cn/webservice/article/comment.ashx?action=AddComment&artid=' + that.data.currentContext.data.artid + "&toplid=0",
        needlogin: true,
        data: {
          comment: encodeURIComponent(content),
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
          if (res.data.status != 0) {
            //接口状态码错误
            // wx.showModal({
            //   title: '请求异常',
            //   content: '服务器繁忙，请稍后访问',
            // });
            if (res.data.msg) {
              that.data.currentContext.toast.showToast(res.data.msg);
            }
            return;
          }


          if (res.data.msg) {
            that.data.currentContext.toast.showToast(res.data.msg);
          }
          // that.data.currentContext.toast.showToast(app.globalData.userInfo.nickName);
          //评论成功
          //收起键盘，表情
          that.onTouchHiddenEmoji();
          //刷新界面,
          that.data.currentContext.data.pldata.items.unshift({
            PLID: res.data.plid,
            CONTENT: decodeURIComponent(content),
            ZANCNT: 0,
            DLEVEL: 1,
            ZANSTATUS: 0,
            USERID: app.globalData.requestParams.userid,
            NICKNAME: app.globalData.userInfo.nickName,
            HEADURL: app.globalData.userInfo.avatarUrl,
            likepic: '../imgs/content_btn_like.png',
            emojiMsg: that.data.emojiFn.emojiAnalysis([content]),
            clickLikeAnimation: {},
          })

          var plcount = that.data.currentContext.data.artdata.plcnt;
          if (!plcount) {
            plcount = 0;
          }
          that.data.currentContext.setData({
            inputvalue: "", //清空输入框
            ['pldata.items']: that.data.currentContext.data.pldata.items,
            plcount: parseInt(plcount) + 1,
            ['artdata.plcnt']: parseInt(plcount) + 1
          });

          // console.log(that.data.pldata.items[0]);

          //拿到栈页面
          var arrPages = getCurrentPages();
          if (-1 != that.data.currentContext.data.dataIndex && arrPages.length > 1 && (arrPages[arrPages.length - 2].route == 'pages/index/index' || arrPages[arrPages.length - 2].route == 'pages/myzancollectioncomments/myzancollectioncomments')) {
            //从首页列表页打开的详情页,刷新首页数据
            var plcount = arrPages[arrPages.length - 2].data.CurListData.items[that.data.currentContext.data.dataIndex].plcnt;
            arrPages[arrPages.length - 2].setData({
              ['CurListData.items[' + that.data.currentContext.data.dataIndex + '].plcnt']: parseInt(plcount) + 1,
              ['CurListData.items[' + that.data.currentContext.data.dataIndex + '].commentstatus']: 1,
            });
          }



        },
        complete: function() {
          that.data.currentContext.data.isSendPl = false;
        }
      });


    },

    //举报的点击
    onJbClick: function() {

      var that = this;
      //弹出举报层
      wx.showActionSheet({
        itemList: ['色情', '广告', '抄袭', '侵权', '政治', '其他'],
        success(res) {
          var index = res.tapIndex;

          var type;
          if (index == 0) {
            type = 1;
          } else if (index == 1) {
            type = 2
          } else if (index == 2) {
            type = 3
          } else if (index == 3) {
            type = 4
          } else if (index == 4) {
            type = 5
          } else if (index == 5) {
            type = 9
          }


          if (that.data.currentContext.data.isJb) {
            return;
          }
          that.data.currentContext.data.isJb = true;



          app.requestWithSessionId({
            url: 'https://app.xiaogechui.cn/webservice/article/articles.ashx?action=JuBaoArt&artid=' + that.data.currentContext.data.artid + "&plid=0&type=" + type,
            needlogin: true,
            data: {

            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              // console.log(res.data);
              if (res.data.status != 0) {
                //接口状态码错误
                wx.showModal({
                  title: '请求异常',
                  content: '服务器繁忙，请稍后访问',
                });
                return;
              }

              var msg = res.data.msg;
              if (msg) {
                that.data.currentContext.toast.showToast(decodeURIComponent(msg));
              }
            },
            complete: function() {
              that.data.currentContext.data.isJb = false;
            }
          });
        },
        fail(res) {

        }
      })

    },


    //点击评论删除自己的评论
    onPlClick: function(event) {
      var item = event.currentTarget.dataset.item;
      if (!item) {
        return;
      }
      var userid = app.globalData.requestParams.userid;
      var pluserid = item.USERID;
      if (!userid || !pluserid || userid != pluserid) {
        return;
      }
      //弹出删除浮层
      var that = this;
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          var index = res.tapIndex;
          if (0 == index) {
            var plid = item.PLID;
            if (!plid) {
              return;
            }

            if (that.data.currentContext.data.isDel) {
              return;
            }
            that.data.currentContext.data.isDel = true;
            app.requestWithSessionId({
              url: 'https://app.xiaogechui.cn/webservice/article/comment.ashx?action=RemoveComment',
              data: {
                plid: plid
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function(res) {
                console.log(res.data);
                if (res.data.status != 0) {
                  //接口状态码错误
                  wx.showModal({
                    title: '请求异常',
                    content: '服务器繁忙，请稍后访问',
                  });
                  return;
                }

                var msg = res.data.msg;
                if (msg) {
                  that.data.currentContext.toast.showToast(decodeURIComponent(msg));
                }

                //刷新界面,

                var plcount = that.data.currentContext.data.artdata.plcnt;
                if (!plcount) {
                  plcount = 0;
                }
                that.data.currentContext.setData({

                  plcount: parseInt(plcount) - 1,
                  ['artdata.plcnt']: parseInt(plcount) - 1
                });

                //拿到栈页面（不改变外层状态）
                // var arrPages = getCurrentPages();
                // if (-1 != that.data.currentContext.data.dataIndex && arrPages.length > 1 && (arrPages[arrPages.length - 2].route == 'pages/index/index' || arrPages[arrPages.length - 2].route == 'pages/myzancollectioncomments/myzancollectioncomments')) {
                //   //从首页列表页打开的详情页,刷新首页数据
                //   var plcount = arrPages[arrPages.length - 2].data.CurListData.items[that.data.currentContext.data.dataIndex].plcnt;
                //   var plstatus = item.plstatus;
                //   var count = parseInt(plcount);
                //   if (plstatus == '1') {
                //     //已审核。外面的评论数减一
                //     count = count - 1;
                //   }

                //   arrPages[arrPages.length - 2].setData({
                //     ['CurListData.items[' + that.data.currentContext.data.dataIndex + '].plcnt']: count,
                //     ['CurListData.items[' + that.data.currentContext.data.dataIndex + '].commentstatus']: 0,
                //   });
                // }

                that.data.currentContext.getPLData(false);


              },
              complete: function(res) {
                that.data.currentContext.data.isDel = false;
              },
            });


          }

        }
      });

    }


  }
}