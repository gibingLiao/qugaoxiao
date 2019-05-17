//解析表情
function emojiAnalysis(arr) {
  //arr: 传入的消息数组

  // emoji对象
  var __emojiObjs = {
    '[呲牙]': '13',
    '[调皮]': '12',
    '[汗]': '27',
    '[偷笑]': '20',
    '[拜拜]': '39',
    '[打你]': '38',
    '[擦汗]': '40',
    '[猪头]': '62',
    '[玫瑰]': '63',
    '[流泪]': '09',
    '[快哭了]': '50',
    '[嘘]': '33',
    '[酷]': '16',
    '[抓狂]': '18',
    '[委屈]': '49',
    '[屎]': '74',
    '[炸弹]': '70',
    '[菜刀]': '55',
    '[可爱]': '21',
    '[色]': '02',
    '[害羞]': '06',
    '[得意]': '04',
    '[吐]': '19',
    '[微笑]': '00',
    '[发火]': '11',
    '[尴尬]': '10',
    '[惊恐]': '26',
    '[冷汗]': '17',
    '[心]': '66',
    '[嘴唇]': '116',
    '[白眼]': '22',
    '[傲慢]': '23',
    '[难过]': '15',
    '[惊讶]': '14',
    '[疑问]': '32',
    '[睡]': '08',
    '[亲亲]': '52',
    '[憨笑]': '28',
    '[爱情]': '90',
    '[衰]': '36',
    '[撇嘴]': '01',
    '[奸笑]': '51',
    '[奋斗]': '30',
    '[发呆]': '03',
    '[右哼哼]': '46',
    '[抱抱]': '78',
    '[坏笑]': '44',
    '[企鹅亲]': '91',
    '[鄙视]': '48',
    '[晕]': '34',
    '[大兵]': '29',
    '[拜托]': '54',
    '[强]': '79',
    '[垃圾]': '80',
    '[握手]': '81',
    '[胜利]': '82',
    '[抱拳]': '83',
    '[枯萎]': '64',
    '[米饭]': '61',
    '[蛋糕]': '68',
    '[西瓜]': '56',
    '[啤酒]': '57',
    '[瓢虫]': '73',
    '[勾引]': '84',
    '[哦了]': '89',
    '[手势]': '87',
    '[咖啡]': '60',
    '[月亮]': '75',
    '[匕首]': '71',
    '[发抖]': '93',
    '[菜]': '86',
    '[拳头]': '85',
  };

  var objList = [];

  for (var i = 0; i < arr.length; i++) {

    objList.push(preData(arr[i]));
  }


  return objList;

  // 解析字符串 创建对象 储存 分解后的 字符串，把 ‘表情代码’ 和 ‘文本’ 分解
  function preData(str) {
    // 提取表情编号 的 正则
    // var reg = new RegExp(/[\'\[]?([^\[\[\]\]]*)[\'\]]?/i);   
    // var arr = str.split(reg);

    var arr = str.split(/(?=\[[A-Za-z\u4E00-\u9FA5\uF900-\uFA2D]+?])/).reduce(function(prev, curr) {
      let index = curr.indexOf(']')
      let first = curr.substr(0, index + 1)
      let last = curr.substr(index + 1)
      return prev.concat([first, last])
    }, [])


    var emojiObj; // 分解后的 对象
    var emojiObjList = []; // 分解后对象的集合----数组形式 
    for (var i = 0; i < arr.length; i++) {
      //过滤集合空元素
      if (!arr[i]) {
        continue;
      }

      var ele = arr[i];
      emojiObj = {};
      if (__emojiObjs[ele]) {
        emojiObj.tag = "emoji";
        emojiObj.node = 'element';
        emojiObj.baseClass = "face";
        emojiObj.txt = __emojiObjs[ele];
        emojiObj.src = "../../utils/wxParse/emojis/" + __emojiObjs[ele] + ".gif";
      } else {
        emojiObj.node = 'text';
        emojiObj.txt = ele;
      }
      emojiObjList.push(emojiObj);
    }

    return emojiObjList;
  }
}

module.exports = {
  emojiAnalysis: emojiAnalysis
}