// pages/prompt/modelRealScore/modelRealScore.js
let common = require('../../../../common/shiti.js');
let time = require('../../../../common/time.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "考试成绩" })  //设置标题
    let self = this;
    let user = wx.getStorageSync('user');
    let id = options.id;//试题的id号，用于本地存储的key
    let pic = user.Pic;//头像
    let nickName = user.Nickname;//昵称
    let score = options.score;//得分
    let gone_time = options.gone_time;//花费时间
    let rightNums = options.rightNums;//正确数
    let wrongNums = options.wrongNums;//错误数
    let undone = options.undone;//未做
    let totalscore = parseInt(options.totalscore);//总分
    let ifGood = "";
    let jibai = options.jibai;//击败用户

    let timeStr = time.getGoneTimeStr(gone_time);//时间字符串

    let textColor = null;//显示及格状态的文字
    console.log(score)
    console.log(totalscore)
    console.log(score / totalscore)
    if (score / totalscore < 0.3) {//不及格
      ifGood = '糟糕透了!';
      textColor = "red";
    } else if (score / totalscore >= 0.3 && score / totalscore < 0.6 ){
      ifGood = '不及格';
      textColor = "#ff6053";
    } else if (score / totalscore >= 0.6 && score / totalscore < 0.8 ){
      ifGood = '良好';
      textColor = "#faa23a";
    } else if (score / totalscore >= 0.8 && score / totalscore < 0.9){
      ifGood = '很好';
      textColor = "#6adc9e";
    } else if (score / totalscore >= 0.9 && score / totalscore < 1) {
      ifGood = '真哇';
      textColor = "#15d439";
    } else if (score / totalscore ==1) {
      ifGood = '哇塞';
      textColor = "rgb(255, 0, 149);";
    }


    self.setData({
      pic: pic,
      nickName: nickName,
      score: score,
      rightNums: rightNums,
      wrongNums: wrongNums,
      undone: undone,
      id: id,
      timeStr: timeStr,
      totalscore: totalscore,
      ifGood: ifGood,
      jibai: jibai,
      textColor: textColor
    })
  },
  /**
   * 当点击分享按钮
   */
  onShareAppMessage: function (res1) {
    return {
      title: '我在本次测试中击败全国' + this.data.jibai + '%的用户',
      path: '/pages/index/index', //这里设定都是以"/page"开头,并拼接好传递的参数
      imageUrl: '/images/denglu@3x.jpg',
      success: (res) => {
        console.log('分享成功')
        // 转发成功
      },
      fail: (res) => {
        console.log('分享失败')
        // 转发失败
      }
    }
  },

  restart: function () {
    let pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    common.restartModelReal(prevPage);
    wx.navigateBack({})

  },

  viewWrong: function () {
    let pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    let doneAnswerArray = prevPage.data.doneAnswerArray;
    let nums = prevPage.data.nums;
    let isModelReal = prevPage.data.isModelReal;

    let lastSliderIndex = prevPage.data.lastSliderIndex;
    let sliderShitiArray = prevPage.data.sliderShitiArray;
    let shiti = sliderShitiArray[lastSliderIndex];

    common.processModelRealDoneAnswer(shiti.done_daan, shiti, prevPage);

    common.setModelRealMarkAnswerItems(doneAnswerArray, nums, isModelReal, true, prevPage); //更新答题板状态 

    prevPage.setData({
      sliderShitiArray: sliderShitiArray
    })

    wx.navigateBack({})
  },

})