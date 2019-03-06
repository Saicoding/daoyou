let common = require('shiti.js');
let animate = require('animate.js')

/**
 * 练习题
 */
function zuotiOnload(options, px, circular, myFavorite, shitiArray, user, page, all_nums, pageall, self) {
  let zcode = user.zcode == undefined ? '' : user.zcode;
  //得到swiper数组
  let preShiti = undefined; //前一题
  let nextShiti = undefined; //后一题
  let midShiti = shitiArray[px - 1]; //中间题

  let sliderShitiArray = [];
  let lastSliderIndex = 0;

  common.initShiti(midShiti); //初始化试题对象

  if (px != 1 && px != shitiArray.length) { //如果不是第一题也是不是最后一题
    preShiti = shitiArray[px - 2];
    common.initShiti(preShiti); //初始化试题对象
    nextShiti = shitiArray[px];
    common.initShiti(nextShiti); //初始化试题对象
  } else if (px == 1) { //如果是第一题
    if (shitiArray.length != 1) {
      nextShiti = shitiArray[px];
      common.initShiti(nextShiti); //初始化试题对象
    }
  } else {
    preShiti = shitiArray[px - 2];
    common.initShiti(preShiti); //初始化试题对象
  }

  //对是否是已答试题做处理
  wx.getStorage({
    key: "doneArray" + options.f_id + "0" + zcode,
    success: function(res1) {
      //根据章是否有子节所有已经回答的题
      let doneAnswerArray = res1.data;
      doneAnswerArray = common.setMarkAnswerItems(doneAnswerArray, self.data.isModelReal, self.data.isSubmit, options, self); //设置答题板数组 

      if (options.selected == 'false') {
        //映射已答题目的已作答的答案到shitiArray
        for (let i = 0; i < doneAnswerArray.length; i++) {
          let doneAnswer = doneAnswerArray[i];

          if (options.leibie == '2') { //多选
            doneAnswer.px = doneAnswer.px - options.num_dan;
          } else if (options.leibie == "3") { //判断
            doneAnswer.px = doneAnswer.px - options.num_dan - options.num_duo;
          }

          shitiArray[doneAnswer.px - 1].done_daan = doneAnswer.done_daan; //设置已答试题的答案
          shitiArray[doneAnswer.px - 1].isAnswer = true;
        }

        //先处理是否是已经回答的题,渲染3个
        if (preShiti != undefined) common.processDoneAnswer(preShiti.done_daan, preShiti, self);
        common.processDoneAnswer(midShiti.done_daan, midShiti, self);
        if (nextShiti != undefined) common.processDoneAnswer(nextShiti.done_daan, nextShiti, self);

        //根据已答试题库得到正确题数和错误题数
        let rightAndWrongObj = common.setRightWrongNums(doneAnswerArray);
        //如果已答试题数目大于0才更新shiti
        if (doneAnswerArray.length > 0) {
          self.setData({
            sliderShitiArray: sliderShitiArray,
            doneAnswerArray: doneAnswerArray, //获取该节所有的已做题目
            rightNum: rightAndWrongObj.rightNum,
            wrongNum: rightAndWrongObj.wrongNum
          })
        }
      }else{
        self.setData({
          lastDoneAnswerArray: doneAnswerArray//如果是覆盖答题模式记录一开始的已做题
        })
      }
    },
  })

  circular = px == 1 || px == shitiArray.length ? false : true //如果滑动后编号是1,或者最后一个就禁止循环滑动
  myFavorite = midShiti.favorite;

  if (px != 1 && px != shitiArray.length) { //如果不是第一题也不是最后一题
    sliderShitiArray[0] = midShiti;
    sliderShitiArray[1] = nextShiti;
    sliderShitiArray[2] = preShiti;
  } else if (px == 1) { //如果是第一题
    if (shitiArray.length != 1) {
      sliderShitiArray[0] = midShiti;
      sliderShitiArray[1] = nextShiti;
    } else {
      sliderShitiArray[0] = midShiti;
    }

  } else { //如果是最后一题
    sliderShitiArray[0] = preShiti;
    sliderShitiArray[1] = midShiti;
    lastSliderIndex = 1;
    self.setData({
      myCurrent: 1
    })
  }

  self.setData({
    options: options,
    px: px,
    user: user,
    circular: circular,
    myFavorite: myFavorite, //是否收藏

    nums: all_nums, //题数
    pageall: pageall, //总页数

    shitiArray: shitiArray, //整节的试题数组
    sliderShitiArray: sliderShitiArray, //滑动数组
    lastSliderIndex: lastSliderIndex, //默认滑动条一开始是0
    isLoaded: true, //是否已经载入完毕,用于控制过场动画
  });
}

/**
 * 收藏题
 */
function markOnload(options, px, circular, myFavorite, shitiArray, user, page, all_nums, pageall, self) {
  let zcode = user.zcode == undefined ? '' : user.zcode;
  //得到swiper数组
  let preShiti = undefined; //前一题
  let nextShiti = undefined; //后一题
  let midShiti = shitiArray[px - 1]; //中间题

  let sliderShitiArray = [];
  let lastSliderIndex = 0;

  common.initShiti(midShiti); //初始化试题对象

  if (px != 1 && px != shitiArray.length) { //如果不是第一题也是不是最后一题
    preShiti = shitiArray[px - 2];
    common.initShiti(preShiti); //初始化试题对象
    nextShiti = shitiArray[px];
    common.initShiti(nextShiti); //初始化试题对象
  } else if (px == 1) { //如果是第一题
    if (shitiArray.length != 1) {
      nextShiti = shitiArray[px];
      common.initShiti(nextShiti); //初始化试题对象
    }
  } else {
    preShiti = shitiArray[px - 2];
    common.initShiti(preShiti); //初始化试题对象
  }

  circular = px == 1 || px == shitiArray.length ? false : true //如果滑动后编号是1,或者最后一个就禁止循环滑动
  myFavorite = midShiti.favorite ? midShiti.favorite : '1';

  if (px != 1 && px != shitiArray.length) { //如果不是第一题也不是最后一题
    sliderShitiArray[0] = midShiti;
    sliderShitiArray[1] = nextShiti;
    sliderShitiArray[2] = preShiti;
  } else if (px == 1) { //如果是第一题
    if (shitiArray.length != 1) {
      sliderShitiArray[0] = midShiti;
      sliderShitiArray[1] = nextShiti;
    } else {
      sliderShitiArray[0] = midShiti;
    }

  } else { //如果是最后一题
    sliderShitiArray[0] = preShiti;
    sliderShitiArray[1] = midShiti;
    lastSliderIndex = 1;
    self.setData({
      myCurrent: 1
    })
  }

  console.log(sliderShitiArray)

  self.setData({
    options: options,
    px: px,
    user: user,
    circular: circular,
    myFavorite: myFavorite, //是否收藏
    nums: all_nums, //题数
    pageall: pageall, //总页数
    T: options.type == "note" ? 'test_notes' : 'test_ErrorShiti', //请求数据的参数
    shitiArray: shitiArray, //整节的试题数组
    sliderShitiArray: sliderShitiArray, //滑动数组
    lastSliderIndex: lastSliderIndex, //默认滑动条一开始是0
    isLoaded: true, //是否已经载入完毕,用于控制过场动画
  });
}


/**
 * 错题
 */

function wrongOnload(options, px, circular, myFavorite, res, user, requesttime, self) {
  let shitiArray = res.data.shiti;
  let all_nums = res.data.all_nums;
  let pageall = res.data.pageall;

  let username = user.username;
  let LoginRandom = user.Login_random;
  let zcode = user.zcode;


  common.initShitiArrayDoneAnswer(shitiArray); //将试题的所有done_daan置空

  common.initMarkAnswer(all_nums, self); //初始化答题板数组

  shitiArray = common.initShitiArray(shitiArray, all_nums, 1);


  //得到swiper数组
  let nextShiti = undefined; //后一题
  let midShiti = shitiArray[0]; //中间题
  let sliderShitiArray = [];

  common.initShiti(midShiti); //初始化试题对象

  if (shitiArray.length != 1) {
    nextShiti = shitiArray[1];
    common.initShiti(nextShiti); //初始化试题对象
  }

  circular = false //如果滑动后编号是1,或者最后一个就禁止循环滑动
  myFavorite = midShiti.favorite;

  if (nextShiti != undefined) sliderShitiArray[1] = nextShiti;
  sliderShitiArray[0] = midShiti;

  self.setData({
    //设置过场动画
    winH: wx.getSystemInfoSync().windowHeight,
    opacity: 1,
    px: px,

    kid: options.kid, //题库编号
    nums: all_nums, //题数
    shitiArray: shitiArray, //整节的试题数组
    sliderShitiArray: sliderShitiArray, //滑动数组
    circular: circular,
    pageall: pageall, //总页数
    pageArray: [1], //当前所有已经渲染的页面数组
    myFavorite: myFavorite, //是否收藏
    lastSliderIndex: 0, //默认滑动条一开始是0
    isLoaded: true, //是否已经载入完毕,用于控制过场动画
    user: user,
    requesttime: requesttime, //第一次请求的时间
  });

  wx.hideLoading();
}

/**
 * 练习题
 */
function moniOnload(options, shitiArray, result, px, circular, user, page, all_nums, pageall, interval, isSubmit, self) {
  let zcode = user.zcode == undefined ? '' : user.zcode;
  //得到swiper数组
  let preShiti = undefined; //前一题
  let nextShiti = undefined; //后一题
  let midShiti = shitiArray[px - 1]; //中间题

  let sliderShitiArray = [];
  let lastSliderIndex = 0;

  common.initShiti(midShiti); //初始化试题对象

  if (px != 1 && px != shitiArray.length) { //如果不是第一题也是不是最后一题
    preShiti = shitiArray[px - 2];
    common.initShiti(preShiti); //初始化试题对象
    nextShiti = shitiArray[px];
    common.initShiti(nextShiti); //初始化试题对象
  } else if (px == 1) { //如果是第一题
    if (shitiArray.length != 1) {
      nextShiti = shitiArray[px];
      common.initShiti(nextShiti); //初始化试题对象
    }
  } else {
    preShiti = shitiArray[px - 2];
    common.initShiti(preShiti); //初始化试题对象
  }

  //对是否是已答试题做处理
  wx.getStorage({
    key: "modelReal" + options.f_id + zcode,
    success: function(res1) {
      //根据章是否有子节所有已经回答的题
      let doneAnswerArray = res1.data;

      if (isSubmit == true) { //说明是已经是提交过答案的题
        self.setData({
          text: "重新评测",
          isSubmit: true
        })
      }

      // doneAnswerArray = common.setMarkAnswerItems(doneAnswerArray, self.data.isModelReal, self.data.isSubmit, options, self); //设置答题板数组 
      common.setModelRealMarkAnswerItems(doneAnswerArray, self.data.nums, self.data.isModelReal, self.data.isSubmit, self); //更新答题板状态

      //映射已答题目的已作答的答案到shitiArray
      for (let i = 0; i < doneAnswerArray.length; i++) {
        let doneAnswer = doneAnswerArray[i];

        shitiArray[doneAnswer.px - 1].done_daan = doneAnswer.done_daan; //设置已答试题的答案
        shitiArray[doneAnswer.px - 1].isAnswer = true;
      }

      //先处理是否是已经回答的题,渲染3个
      if (preShiti != undefined) common.processModelRealDoneAnswer(preShiti.done_daan, preShiti, self);
      common.processModelRealDoneAnswer(midShiti.done_daan, midShiti, self);

      if (nextShiti != undefined) common.processModelRealDoneAnswer(nextShiti.done_daan, nextShiti, self);

      //根据已答试题库得到正确题数和错误题数
      let rightAndWrongObj = common.setRightWrongNums(doneAnswerArray);

      //如果已答试题数目大于0才更新shiti
      if (doneAnswerArray.length > 0) {
        self.setData({
          sliderShitiArray: sliderShitiArray,
          doneAnswerArray: doneAnswerArray, //获取该节所有的已做题目
          rightNum: rightAndWrongObj.rightNum,
          wrongNum: rightAndWrongObj.wrongNum
        })
      }
    },
    fail: function() {
      wx.setStorage({
        key: "modelReal" + options.f_id + zcode,
        data: [],
      })
    }
  })

  circular = px == 1 || px == shitiArray.length ? false : true //如果滑动后编号是1,或者最后一个就禁止循环滑动

  if (px != 1 && px != shitiArray.length) { //如果不是第一题也不是最后一题
    sliderShitiArray[0] = midShiti;
    sliderShitiArray[1] = nextShiti;
    sliderShitiArray[2] = preShiti;
  } else if (px == 1) { //如果是第一题
    if (shitiArray.length != 1) {
      sliderShitiArray[0] = midShiti;
      sliderShitiArray[1] = nextShiti;
    } else {
      sliderShitiArray[0] = midShiti;
    }

  } else { //如果是最后一题
    sliderShitiArray[0] = preShiti;
    sliderShitiArray[1] = midShiti;
    lastSliderIndex = 1;
    self.setData({
      myCurrent: 1
    })
  }

  self.setData({
    id: options.f_id, //真题编号
    times: options.times, //考试时间
    pageall: result.page_all, //总页数
    interval: interval, //计时器
    result: result, //请求结果
    totalscore: options.totalscore, //总分数
    test_score: options.text_score, //最高分
    title: options.title, //标题
    text: "立即交卷", //按钮文字
    nums: options.nums, //题数
    shitiArray: shitiArray, //整节的试题数组
    px: px,
    circular: circular, //是否循环
    user: user,
    first: false,
    isLoaded: true, //是否已经载入完毕,用于控制过场动画
    sliderShitiArray: sliderShitiArray, //滑动数组
    lastSliderIndex: lastSliderIndex, //默认滑动条一开始是0
    isReLoad: false,
  });
}

module.exports = {
  zuotiOnload: zuotiOnload,
  wrongOnload: wrongOnload,
  markOnload: markOnload,
  moniOnload: moniOnload
}