// pages/index/xuexijihua/xuexijihua.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();
let animate = require('../../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation(700);
let easeInAnimation = animate.easeInAnimation(700);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    list: "",
    money_zong: "",
    product: "", //基础套餐、冲刺套餐、豪华套餐
    webind: 0,
    web: [],
    mine: true, //确认身份
    tuan_id:"", //团购id，如果是好友进来的id存在
    pindan_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var that = this;
    wx.setNavigationBarTitle({ //设置标题
      title: '学习计划',
    });
    var mine = options.mine;
    
    if (mine){
      that.setData({
        mine: mine
      })
    }
    var tuan_id = options.tuan_id;
    if (tuan_id) {
      that.setData({
        tuan_id: tuan_id
      })
    }

    //拼单列表
    app.post(API_URL, "action=getTuangouList", false, false, "", "").then((res) => {
      var list = res.data.data[0];
      if (list.length==undefined){
        list=[list]
      }
      that.setData({
        pindan_list:list
      })
    })
    var user = wx.getStorageSync("user")
    if (user) {
      
      //获取套餐包列表
      app.post(API_URL, "action=getCourseBao&token=" + user.token + '&zcode=' + user.zcode, false, false, "", "").then((res) => {
        var list = res.data.data[0].list;
        that.setData({
          loaded: true,
          list: list,
          web: [list[0].url, list[1].url, list[2].url]
        })
        that.pindanSend.setData({
          user: user
        });
        that.buyTaocan.setData({
          taocans: [{
              title: list[0].biecheng,
              price_tuan: list[0].money,
              num: list[0].buy_nums,
              typesname: list[0].typesname,
              url: list[0].url,
              buy: list[0].buy,
              price_old: 2499,
              info: ['适用于期望一次通关拿证考生。包含内容：', '① 笔试四科基础精讲、习题提升、考前冲刺视频课程，共计12门，预计230课时。', '② 章节习题+10套全真模拟+3套核心密卷。', ' 额外赠送：', '① 2019新版教材   ② 面试指导课  ③ 各省导游词 ', '邮寄教材']
            },
            {
              title: list[1].biecheng,
              price_tuan: list[1].money,
              num: list[1].buy_nums,
              typesname: list[1].typesname,
              url: list[1].url,
              buy: list[1].buy,
              price_old: 1664,
              info: ['适用于本身做题能力较强的学霸型学员。包含内容:', '① 笔试四科基础精讲、考前冲刺视频课程，共计8门，预计180课时。', '② 章节习题+10套全真模拟+3套核心密卷 。', '额外赠送：', '① 2019新版教材   ② 各省导游词 ', '邮寄教材']
            },
            {
              title: list[2].biecheng,
              price_tuan: list[2].money,
              num: list[2].buy_nums,
              typesname: list[2].typesname,
              url: list[2].url,
              buy: list[2].buy,
              price_old: 1664,
              info: ['适用于已经有一定学习基础的学员。包含内容:', '① 笔试四科习题提升、考前冲刺视频课程 ，共计8门，预计160课时。', '② 章节习题+10套全真模拟+3套核心密卷 。', '额外赠送：', '① 2019新版教材   ② 各省导游词 ', '邮寄教材']
            },
          ]

        })
      })
    } else {
      app.post(API_URL, "action=getCourseBao", false, false, "", "").then((res) => {
        var list = res.data.data[0].list;
        that.setData({
          loaded: true,
          list: list,
        })
        that.buyTaocan.setData({
          taocans: [{
              title: list[0].biecheng,
              price_tuan: list[0].money,
              num: list[0].buy_nums,
              typesname: list[0].typesname,
              url: list[0].url,

              price_old: 2499,
              info: ['适用于期望一次通关拿证考生。包含内容：', '① 笔试四科基础精讲、习题提升、考前冲刺视频课程，共计12门，预计230课时。', '② 章节习题+10套全真模拟+3套核心密卷。', ' 额外赠送：', '① 2019新版教材   ② 面试指导课  ③ 各省导游词 ', '邮寄教材']
            },
            {
              title: list[1].biecheng,
              price_tuan: list[1].money,
              num: list[1].buy_nums,
              typesname: list[1].typesname,
              url: list[1].url,

              price_old: 1664,
              info: ['适用于本身做题能力较强的学霸型学员。包含内容:', '① 笔试四科基础精讲、考前冲刺视频课程，共计8门，预计180课时。', '② 章节习题+10套全真模拟+3套核心密卷 。', '额外赠送：', '① 2019新版教材   ② 各省导游词 ', '邮寄教材']
            },
            {
              title: list[2].biecheng,
              price_tuan: list[2].money,
              num: list[2].buy_nums,
              typesname: list[2].typesname,
              url: list[2].url,

              price_old: 1664,
              info: ['适用于已经有一定学习基础的学员。包含内容:', '① 笔试四科习题提升、考前冲刺视频课程 ，共计8门，预计160课时。', '② 章节习题+10套全真模拟+3套核心密卷 。', '额外赠送：', '① 2019新版教材   ② 各省导游词 ', '邮寄教材']
            },
          ]

        })


      })

    }

    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;

    this.pindanSend = this.selectComponent("#pindanSend");
    this.buyTaocan = this.selectComponent("#buyTaocan");
    this.shareSuccessModel = this.selectComponent("#shareSuccessModel"); //测试

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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    if (self.data.ifShare) {
      self.shareSuccessModel.showDialog();
    }

    animate.tiaoAnimation(easeOutAnimation, self);
  },

  /**
   * 导航到首页
   */
  GOindex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 单独购买
   */
  buy: function() {
    this.buyTaocan.showDialog();
  },

  /**
   * 发起团购
   */
  GOtuangou: function(e) {
    var user = wx.getStorageSync("user");
    //拼团id 要么与随机网友拼单  要么与邀请我的好友拼单， 要么发起拼单
    var tuan_id = e.currentTarget.dataset.id;
    if (tuan_id) { tuan_id = tuan_id } else { tuan_id = this.data.tuan_id}
    if (user) {
      let buy = this.buyTaocan.data.taocans[0].buy;
      //登陆并且未购买
      if (buy == 0) {
        let money_zong = this.buyTaocan.data.taocans[0].price_tuan;
        let product = this.buyTaocan.data.taocans[0].typesname;
        let title = this.buyTaocan.data.taocans[0].title;

        wx.navigateTo({
          url: '/pages/learn/pay?danke=&title=' + title + '&money_zong=' + (money_zong - 50) + '&product=' + product + '&tuan_id=' + tuan_id
        })
        wx.showLoading({
          title: '正在跳转',
          duration: 800
        })
        setTimeout(() => {
          this.pindanSend.showDialog();
        }, 3000)

      } else {
        //登陆并且已购买
        wx.showToast({
          title: '您已经购买本套餐',
          icon: 'none',
          duration: 3000
        })

      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })

    }

  },




  //点击分享
  onShareAppMessage: function(e) {
    let self = this;
    
    var user = wx.getStorageSync("user");
    if (user) {
      self.setData({
        ifShare: true
      });
    return {
      title: '我发起拼单啦，导游全套视频课程+全套教材+全套试题库，两年超长课程保质期',
      path: '', //这里设定都是以"/page"开头,并拼接好传递的参数
      imageUrl: 'http://www.chinaplat.com/daoyou/images/quanpei.jpg',
      success: (res) => {
        console.log('转发成功')
      },
      fail: (res) => {
        console.log('转发失败')
      }
      }
    }
  },
  
  /**
   * 购买套餐点击确定
   */
  _confirm: function(e) {
    var user = wx.getStorageSync("user");
    if (user) {
      let buy = e.detail.buy;
      let buy0 = e.detail.buy0;
      let title = e.detail.title;
      if (buy0 == 1) {
        wx.showToast({
          title: '您已经购买全陪套餐，无需再次购买',
          icon: 'none',
          duration: 3000
        })

      } else {
        if (buy == 0) {
          wx.showLoading({
            title: '正在跳转',
            duration: 800
          })
          let money_zong = e.detail.money_zong;
          let product = e.detail.product;

          wx.navigateTo({
            url: '/pages/learn/pay?danke=&title=' + title + '&money_zong=' + money_zong + '&product=' + product
          })
        } else {
          wx.showToast({
            title: '您已经购买本套餐',
            icon: 'none',
            duration: 3000
          })

        }
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })

    }
  },
  getYouhui: function() {
    wx.navigateTo({
      url: '/pages/learn/pay?danke=&title=' + title + '&money_zong=' + money_zong + '&product=' + product
    })

  }

})