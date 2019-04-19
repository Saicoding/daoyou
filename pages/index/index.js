//index.js
//获取应用实例
const app = getApp()
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
let newAni = require('../../common/newAnimate.js');

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
    ],
    midtext: "开始刷题",
    midtitle: "暂无刷题记录",
    ketext: "开始看课",
    ketitle: "暂无看课记录",
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
    app.post(API_URL, "action=getIndex_AD", false, false, "", "").then(res => {
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
    this.rili = this.selectComponent("#rili");
    this.haibao = this.selectComponent("#haibao");

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
    let zcode = user.zcode == undefined ? "" : user.zcode; //缓存标识
    let token = user.token;
    let first = this.data.first;

    let todayDaka = wx.getStorageSync('todayDaka' + zcode);
    let myDate = new Date(); //获取系统当前时间
    let year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    let interval = this.data.interval;

    //请求学习天数
    app.post(API_URL, "action=getStudyDays&zcode=" + zcode, false, false, "").then(res => {
      let QDdays = res.data.data[0].QDdays;
      self.setData({
        QDdays: QDdays,
        random: wx.getStorageSync('random') ? wx.getStorageSync('random') : new Date().toLocaleDateString() 
      })
    })

    //若有新消息出现红点
    if (user) { //有用户信息时才请求
      app.post(API_URL, "action=GetNoticesNums&zcode=" + zcode + "&token=" + token, false, false, "", "", true, self).then((res) => {
        var news_num = res.data.data[0].nums;
        if (news_num > 0) {
          wx.setTabBarBadge({
            index: 3,
            text: news_num+""
          })
        } else {
          wx.removeTabBarBadge({
            index: 3,
          })
        }
      })
    }

    myDate = "" + year + month + day; //得到当前答题字符串

    if (todayDaka != myDate && !interval) {    
      self.riliAnimate(); //日历动画
    }

    if (this.rili) { //如果有弹出日历信息
      let isDaka = this.rili.data.isDaka; //是否是重复登录后回来的
      if (isDaka) {
        this.rili.showDialog();
      }
    }

    wx.getStorage({ //今日看课数
      key: "todayKe" + myDate + user.zcode,
      success: function (res) {
        self.setData({
          todayKeNum: res.data.length
        })
      },
    })


    wx.getStorage({ //今日刷题数
      key: "today" + myDate + zcode,
      success: function(res) {
        self.setData({
          todayNum: res.data.length
        })
      },
    })

    wx.getStorage({
      key: 'lastShuati' + zcode,
      success: function(res) {
        let lastShuati = res.data;
        self.setData({
          midtext: "继续刷题",
          midtitle: lastShuati.title,
          lastShuati: lastShuati
        })
      },
    })


    wx.getStorage({
      key: 'lastkesub' + zcode,
      success: function(res) {
        let lastKe = res.data;
      
        self.setData({
          ketext: "继续看课",
          ketitle: lastKe.options.title,
          lastKe: lastKe
        })
      },
      fail: function(res) {
       
      }
    })

    this.setData({ //设置已经载入一次
      first: false
    })

    if (user) { //如果已经登录
      if (user.taocan == '0') { //未加入学习计划
        user.text = "你尚未加入学习计划,去加入>>";
        user.loginIcon = "/images/index/danger.png";
      } else {
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
      user.text = "点此登录"
      self.setData({
        user: user
      })
    }

  },
  /**
   * 日历动画
   */
  riliAnimate: function() {
    let self = this;
    let obj = {
      transformOrigin: '10% 10% 0',
      delay: 0,
      duration: 1000,
    }

    let obj2 = {
      transformOrigin: '50% 50% 0',
      delay: 0,
      duration: 2000,
    }

    let dakaAnimate = null;
    let next = true;
    dakaAnimate = newAni.rate2(obj2, 360);
    self.setData({
      dakaAnimate: dakaAnimate
    })

    let interval = setInterval(res => {
      let num = Math.round(Math.random());
      if (num == 0) {
        dakaAnimate = newAni.rate1(obj, 40);
      } else {
        dakaAnimate = newAni.rate2(obj2, 360);
      }
      self.setData({
        dakaAnimate: dakaAnimate
      })
    }, 5000);

    self.setData({
      interval: interval
    })
  },

  clear:function(){
    let interval = this.data.interval;
    clearInterval(interval);
  },

  /**
   * 创建海报
   */
  _createHaibao: function(e) {
    let self = this;
    let SignDays = e.detail.SignDays;
    let SignTotalDays = e.detail.SignTotalDays;
    this.haibao.setData({
      imageUrl:false
    })
    this.haibao.draw(SignDays, SignTotalDays,self);
  },

  /**
   * 继续刷题
   */
  continiueShuati: function() {
    let lastShuati = this.data.lastShuati;
    if (lastShuati) { //如果有最后一次刷题
      wx.navigateTo({
        url: '/pages/shuati/zuoti/zuoti?leibie=' + lastShuati.leibie + "&selected=" + lastShuati.selected + "&title=" + lastShuati.title + "&f_id=" + lastShuati.f_id + "&types=" + lastShuati.types + "&all_nums=" + lastShuati.all_nums + "&donenum=" + lastShuati.donenum + "&num_dan=" + lastShuati.num_dan + "&num_duo=" + lastShuati.num_duo + "&num_pan=" + lastShuati.num_pan + "&currentIndex=" + lastShuati.currentIndex + "&currentMidIndex=" + lastShuati.currentMidIndex + "&from=shouye" + "&zhangIdx=" + lastShuati.zhangIdx + "&jieIdx=" + lastShuati.jieIdx
      })
    } else {
      wx.navigateTo({
        url: '/pages/shuati/zuoti/zuoti?leibie=0&selected=false&title=概述&f_id=10420&types=239&all_nums=56&donenum=0&num_dan=24&num_duo=10&num_pan=22&currentIndex=0&currentMidIndex=0&from=shouye&zhangIdx=0&jieIdx=0'
      })
    }
  },

  /**
   * 继续看课
   */
  continiueKanke: function() {

    let lastKe = this.data.lastKe
    if (lastKe) { //如果有最后一次看课
      lastKe = lastKe.options;
      wx.navigateTo({
        url: '/pages/learn/play?title=' + lastKe.title + "&renshu=" + lastKe.renshu + "&types=" + lastKe.types + "&index=" + lastKe.index + "&kc_id=" + lastKe.kc_id + "&fromIndex=true"
      })
    } else {
      wx.navigateTo({
        url: '/pages/learn/play?title=2018导游考试「政策与法律法规」基础精讲&renshu=6267&types=0&index=0&kc_id=141920&fromIndex=true'
      })
    }
  },

  /**
   * 导航到页面
   */
  GOpage: function(e) {
    let index = e.currentTarget.dataset.index; //页面标识
    let id = e.currentTarget.dataset.id

    if (index <= 6) { //点击除学习计划外
      wx.navigateTo({
        url: '/pages/index/navigation/navigation?index=' + index,
      })
    } else if (index == 7) { //点击学习计划
      wx.navigateTo({
        url: '/pages/index/xuexijihua/xuexijihua',
      })
    }
  },

  /**
   * 导航到学习计划
   */
  GOxuexijihua: function(e) {
    let user = this.data.user;
    let from = e.currentTarget.dataset.from;

    if (user.buy == 0 || from == "banner") {
      wx.navigateTo({
        url: '/pages/index/xuexijihua/xuexijihua',
      })
    }
  },

  /**
   * 点击“点此登录”或者“学习计划”等信息
   */
  tapInfo: function(e) {
    let user = this.data.user;
    switch (user.text) {
      case "你尚未加入学习计划,去加入>>":
        wx.navigateTo({
          url: '/pages/index/xuexijihua/xuexijihua',
        })
        break;
      case "点此登录":
        wx.navigateTo({
          url: '/pages/login/login',
        })
        break;
    }
  },

  /**
   * 调起客户端扫码界面进行扫码
   */
  scan: function() {
    wx.scanCode({
      success: function(e) {
        let code = e.result.substring(6);
        let user = wx.getStorageSync('user');
        if (!user) {
          wx.navigateTo({
            url: '/pages/login/login?showToast=true&title=您还没有登录',
          })
        } else {
          let zcode = user.zcode;
          let token = user.token;
          app.post(API_URL, "action=APPLogin&zcode=" + zcode + "&token=" + token + "&t=" + code, false, false, "", "").then(res => {
            wx.showToast({
              title: '网页已登录成功!',
              duration: 4000,
              icon: 'none'
            })
          })
        }
      },
      fail: function() {
        wx.showToast({
          icon: 'none',
          title: '扫描失败',
          duration: 3000
        })
      }
    })
  },

  /**
   * 打开打卡页面
   */
  attendance: function() {
    let user = wx.getStorageSync('user');
    let self = this;
    if (user) {
      wx.vibrateShort({})

      this.rili.showDialog(self);
    } else {
      wx.navigateTo({
        url: '/pages/login/login?showToast=true&title=您还没有登录',
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})