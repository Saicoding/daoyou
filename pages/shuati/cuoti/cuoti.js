// pages/shuati/cuoti/cuoti.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhangjies: [
      {
        title: '旅游业发展概况',
        num: '84',
        doneNum: 32,
        rightRate: 35,
        num1:'40',
        num2:'60',
        num3:'90',
        jies: [
          {
            title: '旅游市场',
            num: 18,
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
        num1: '140',
        num2: '160',
        num3: '290',
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
    wx.setNavigationBarTitle({
      title: '我的错题',
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
   * 切换试题折叠状态
   */
  toogleFolder: function (e) {
    let zhangIdx = e.currentTarget.dataset.index;//点击的题的id
    let zhangjies = this.data.zhangjies;//当前所有题
    zhangjies[zhangIdx].unfolding = zhangjies[zhangIdx].unfolding ? false : true
    this.setData({
      zhangjies: zhangjies
    })
  },

  /**
    * 导航到做题页面
    */
  _GOzuoti: function (e) {
    let currentSelectIndex = e.detail.currentSelectIndex;//选择做题的题型

    wx.navigateTo({
      url: '/pages/shuati/zuoti/zuoti?currentSelectIndex=' + currentSelectIndex + "&selected=" + selected + "&title=我的错题" ,
    })
  },

  /**
   * 答题弹窗提示
   */
  showAnswerModel: function (e) {
    let num = e.currentTarget.dataset.num;//总题数
    let donenum = e.currentTarget.dataset.donenum;//已答数目
    let rightrate = e.currentTarget.dataset.rightrate;//正确率
    let title = e.currentTarget.dataset.title;//点击的标题

    this.goAnswerModel.setData({
      num: num,
      donenum: donenum,
      rightrate: rightrate,
      title: title
    })

    this.goAnswerModel.showDialog();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})