// pages/learn/pay.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();
let md5 = require('../../../common/MD5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "1年",
    region: ['广东省', '广州市', '海珠区'],
    sh_name: "游客",
    sh_number: "",
    dizhitype: "", //添加地址方式
    sh_dizhi: "",
    sh_beizhu: "",
    sh_show: false,
    address: "广东省 广州市 海珠区 人民广场386号",
    dizhiok: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
  },

  dateAdd: function(startDate) {
    startDate = new Date(startDate);
    startDate = +startDate + 3000 * 60 * 60 * 24;
    startDate = new Date(startDate);

    var nextStartDate = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " " + startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds();
    return nextStartDate;

  },

  /**
   * 提交支付
   */
  _submit: function(e) {
    let self = this;
    let code = "";
    let user = wx.getStorageSync('user');
    let zcode = user.zcode; //客户端id号
    let token = user.token;
    let money_zong = this.data.money_zong;
    let product = this.data.product;
    console.log(user)

    if (money_zong > 0) {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          code = res.code;
          console.log("action=getSessionKey&code=" + code)
          app.post(API_URL, "action=getSessionKey&code=" + code, true, false, "购买中").then((res) => {
            let openid = res.data.data[0].openid;
            console.log("action=unifiedorder&zcode=" + zcode + "&token=" + token + "&openid=" + openid + "&money_zong=" + money_zong + "&product=" + product)
            app.post(API_URL, "action=unifiedorder&zcode=" + zcode + "&token=" + token + "&openid=" + openid + "&money_zong=" + money_zong + "&product=" + product, true, false, "购买中").then((res) => {

              let status = res.data.status;

              if (status == 1) {
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                timestamp = timestamp.toString();
                let nonceStr = "TEST";
                let prepay_id = res.data.data[0].prepay_id;
                let appId = "wx274bc5c5c5ce0434";
                let myPackage = "prepay_id=" + prepay_id;
                let key = "e625b97ae82c3622af5f5a56d1118825";

                let str = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + myPackage + "&signType=MD5&timeStamp=" + timestamp + "&key=" + key;
                let paySign = md5.md5(str).toUpperCase();

                let myObject = {
                  'timeStamp': timestamp,
                  'nonceStr': nonceStr,
                  'package': myPackage,
                  'paySign': paySign,
                  'signType': "MD5",
                  success: function(res) {
                    if (res.errMsg == "requestPayment:ok") { //成功付款后
                      self.goumai(product, zcode, token);
                    }
                  },
                  fail: function(res) {}
                }
                wx.requestPayment(myObject)
              }
            })
          })
        }
      })
    } else {
      self.goumai(product, zcode, token);
    }
  },

  goumai: function(product, zcode, token) {
    let action = product == '题库-60' ? 'buyshiti' : '	buytiku';
    let self = this;

    app.post(API_URL, "action=" + action+"&token=" + token + "&zcode=" + zcode, true, false, "购买中").then((res) => {
      let pages = getCurrentPages();
      let prepage = pages[pages.length-2];//上一页
      console.log(prepage)
      let user = prepage.data.user;

      user.TKflag = 1;
      user.mymoney = self.data.mymoney - self.data.xuqiu >= 0?self.data.mymoney - self.data.xuqiu:0;//更新钱数

      wx.setStorageSync('user', user);

      prepage.setData({
        user:user
      })

      if(self.data.page == 'shuati'){
        prepage.setData({
          jiesuoall: true
        })
      }

      wx.navigateBack({
        success:function(){
          wx.showToast({
            title: '购买成功',
            icon: 'none',
            duration: 3000
          })
        }
      })
    })
  },
  youhuiquan: function() {
    wx.navigateTo({
      url: '/pages/user/coupon/coupon',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 导航到学习计划
   */
  GOxuexijihua:function(){
    wx.navigateTo({
      url: '/pages/index/xuexijihua/xuexijihua',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    let options = self.data.options;
    let product = options.product == '60' ? '题库-60' : '题库-108';
    let money_zong = options.product == '60' ? 60 : 108;
    let xuqiu = money_zong;
    let title = options.product == '60' ? '解析包套餐' : '全题库解锁套餐'
    let page = options.page ? options.page : '';

    wx.setNavigationBarTitle({ //设置标题
      title: '支付',
    })

    let mymoney = 0;
    let mymoney2 = "0";
    //判断账户余额
    var user = wx.getStorageSync("user");
    console.log(user)
    if (user) {
      mymoney = user.Money * 1;
      console.log(user)
      console.log(mymoney)
      if (mymoney >= money_zong) {//如果零钱大于需要金额
        mymoney2 = "-" + money_zong;
        money_zong = 0
      } else {//如果零钱小于需要金额
        mymoney2 = "-" + mymoney;
        money_zong = money_zong - mymoney;
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })

    }

    if (money_zong < 0) {
      money_zong = 0
    }

    money_zong = Number(money_zong).toFixed(2);

    this.setData({
      mymoney: mymoney,
      mymoney2: mymoney2,
      youhuiquan: "0",
      product: product,
      money_zong: money_zong,
      page: page,
      xuqiu: xuqiu,
      title: title
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})