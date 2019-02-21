//index.js
//获取应用实例
const app = getApp()
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址

Page({
  data: {
    barUrls: [ //轮播图
      "/images/index/title.png",
      "/images/index/title.png"
    ],

    catalogs1: [ //首页目录名称1
      {
        name: "实时考讯",
        id: '10004'
      },
      {
        name: "考试大纲",
        id: '10005'
      },
      {
        name: "报名审核",
        id: '10001'
      },
      {
        name: "疑难解答",
        id: '10006'
      }
    ],
    catalogs2: [ //首页目录名称2
      {
        name: "笔试指南",
        id: '10000'
      },
      {
        name: "面试指南",
        id: '10002'
      },
      {
        name: "成绩领证",
        id: '10003'
      },
      {
        name: "学习计划",
        id: '0'
      }
    ],
    icons: [
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
    let self = this;
    this.setData({ //设置第一次载入参数,用于onshow只载入一次
      first: true
    })

    // 请求banner图
    app.post(API_URL,"action=getIndex_AD",false,false,"","").then(res=>{
      let banners = res.data.data;
      self.setData({
        banners: banners
      })
    })
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
    let first = this.data.first;

    this.setData({ //设置已经载入一次
      first: false
    })

    if (user) { //如果已经登录
      if(user.buy == 0){//未加入学习计划
        user.text = "你尚未加入学习计划,去加入>>";
        user.loginIcon = "/images/index/danger.png";
      }else{
        user.text = "你已加入学习计划,快去学习吧!"
        user.loginIcon = "/images/index/vip.png";
      }
      self.setData({
        user: user
      })
    } else { //如果没有登录
      let user = {};
      user.Pic = '/images/avatar.png'
      user.Nickname = '未登录'
      user.loginIcon = "/images/index/login.png";
      user.text  = "点此登录"
      self.setData({
        user: user
      })
    }

    if (first) { //如果第一次载入

    }
  },

  /**
   * 导航到页面
   */
  GOpage: function(e) {
    let index = e.currentTarget.dataset.index; //页面标识
    let id = e.currentTarget.dataset.id

    if(index <= 6){//点击除学习计划外
      wx.navigateTo({
        url: '/pages/index/navigation/navigation?index=' + index,
      })
    }else if(index == 7 ){//点击学习计划
      wx.navigateTo({
        url: '/pages/index/xuexijihua/xuexijihua',
      })
    }
  },

  /**
   * 导航到学习计划
   */
  GOxuexijihua:function(e){
    let user = this.data.user;
    let from = e.currentTarget.dataset.from;

    if(user.buy ==0 || from == "banner"){
      wx.navigateTo({
        url: '/pages/index/xuexijihua/xuexijihua',
      })
    }
  },

  /**
   * 调起客户端扫码界面进行扫码
   */
  scan:function(){
    wx.scanCode({
      success:function(e){
        let code = e.result.substring(6);
        let user = wx.getStorageSync('user');
        if(!user){
          wx.showToast({
            title: '',
            icon:'none',
            duration:'您还没有登录'
          })
        }
        
        app.post(API_URL,"action=APPLogin&zcode="+zcode+"&token="+token+"&t="+code,false,false,"","").then(res=>{

        })
      },
      fail:function(){
        wx.showToast({
          icon:'none',
          title: '扫描失败',
          duration:3000
        })
      }
    })
  }
})