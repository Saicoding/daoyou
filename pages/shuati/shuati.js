// pages/shuati/shuati.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bars:[
      {
        title1:"科一",
        title2:"政策法规",
        title3:"政策与法律法规"
      },
      {
        title1: "科二",
        title2: "导游业务",
        title3: "导游业务"
      },
      {
        title1: "科三",
        title2: "全国导基",
        title3: "全国导基"
      },
      {
        title1: "科四",
        title2: "地方导基",
        title3: "地方导基"
      },
      {
        title1: "面试",
        title2: "面试", 
        title3: "面试"
      },
    ],
    currentMidIndex: 0,//当前试题种类
    zhangjies:[
      {
        title:'旅游业发展概况',
        num:'84',
        doneNum:32,
        rightRate:35,
        jies:[
          {
            title:'旅游市场',
            num:18,
            doneNum: 32,
            rightRate: 35,
          },
          {
            title: '旅游组织',
            num: 66,
            doneNum: 12,
            rightRate: 35,
          }
        ]
      },
      {
        title: '中国历史文化',
        num: '85',
        doneNum: 52,
        rightRate: 65,
        jies: [
          {
            title: '中国',
            num: 32,
            doneNum: 22,
            rightRate: 55,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 42,
            rightRate: 82,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 32,
            rightRate: 81,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 32,
            rightRate: 82,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 32,
            rightRate: 85,
          }
        ]
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentIndex = 0;//当前bar的标识
    this.setData({
      currentIndex:currentIndex
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this;

    this.goAnswerModel = this.selectComponent("#goAnswerModel");

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        //最上面标题栏不同机型的高度不一样(单位PX)
        let statusBarHeight = res.statusBarHeight * (750 / windowWidth);

        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          statusBarHeight: statusBarHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 改变科目
   */
  changeBar:function(e){
    let self = this;
    let currentIndex = e.currentTarget.dataset.index;
    self.setData({
      currentIndex:currentIndex
    })
  },

  /**
   * 改变试题类型
   */
  changeMidBar:function(e){
    let currentMidIndex = e.currentTarget.dataset.index;
    this.setData({
      currentMidIndex:currentMidIndex
    })
  },

  /**
   * 切换试题折叠状态
   */
  toogleFolder:function(e){
    let zhangIdx = e.currentTarget.dataset.index;//点击的题的id
    let zhangjies = this.data.zhangjies;//当前所有题
    zhangjies[zhangIdx].unfolding = zhangjies[zhangIdx].unfolding ? false : true
    this.setData({
      zhangjies: zhangjies
    })
  },

  /**
   * 答题弹窗提示
   */
  showAnswerModel:function(e){
    let num = e.currentTarget.dataset.num;//总题数
    let donenum = e.currentTarget.dataset.donenum;//已答数目
    let rightrate = e.currentTarget.dataset.rightrate;//正确率
    let title = e.currentTarget.dataset.title;//点击的标题

    this.goAnswerModel.setData({
      num:num,
      donenum:donenum,
      rightrate:rightrate,
      title:title
    })

    this.goAnswerModel.showDialog();
  },

  /**
   * 导航到做题页面
   */
  _GOzuoti:function(e){
    let currentSelectIndex = e.detail.currentSelectIndex;//选择做题的题型
    let title = "";
    let selected = e.detail.selected;//已做题还是未做题
    let currentMidIndex = this.data.currentMidIndex;//当前试卷类型(章节练习、全镇模拟、核心密卷)

    switch (currentMidIndex){//根据index得到标题字符串
      case 0:
      title= "章节练习";
      break;
      case 1:
      title = "全真模拟";
      break;
      case 2:
      title = "核心密卷";
      break;
    }

    wx.navigateTo({
      url: '/pages/shuati/zuoti/zuoti?currentSelectIndex=' + currentSelectIndex + "&selected=" + selected + "&title=" + title,
    })
  }
})