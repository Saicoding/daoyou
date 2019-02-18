//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    barUrls: [//轮播图
      "/images/index/title.png",
      "/images/index/title.png"
    ],

    catalogs1:[//首页目录名称1
      "实时考讯",
      "考试大纲",
      "报名审核",
      "疑难解答"
    ],
    catalogs2: [//首页目录名称2
      "笔试指南",
      "面试指南",
      "成绩领证",
      "学习计划"
    ],
    icons:[
      "/images/index/item1.png",
      "/images/index/item2.png",
      "/images/index/item3.png",
      "/images/index/item4.png",
      "/images/index/item5.png",
      "/images/index/item6.png",
      "/images/index/item7.png",
      "/images/index/item8.png"
    ]
  },

  /**
   * 生命周期函数
   */
  onLoad: function() {

  },

  /**
   * 生命周期函数
   */
  onReady: function() {
    let self = this;

    this.bindPhoneModel = this.selectComponent("#bindPhoneModel");

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
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
   * 生命周期事件
   */
  onShow: function() {
    let self = this;
    let user = wx.getStorageSync('user'); //获取本地用户缓存

    if (user) { //如果已经登录
      self.setData({
        user: user
      })
    } else { //如果没有登录
      let user = {};
      user.Pic = '/images/avatar.png'
      user.Nickname = '未登录'
      self.setData({
        user: user
      })
    }

    setTimeout(function(){
      self.bindPhoneModel.showDialog();
    },3000)
  },

  /**
   * 导航到页面
   */
  GOpage: function(e) {
    let index = e.currentTarget.dataset.index;//页面标识
   
    wx.navigateTo({
      url: '/pages/index/navigation/navigation?index='+index,
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})