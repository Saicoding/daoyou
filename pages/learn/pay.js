// pages/learn/pay.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();
let md5 = require('../../common/MD5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    danke: false,
    title: "",
    product: "", //套餐类型（基础套餐、冲刺套餐、豪华套餐、题库-60、题库-108）
    num: "",
    name: "",
    time: "1年",
    region: ['广东省', '广州市', '海珠区'],
    sh_name: "游客",
    sh_number: "13333333333",
    sh_dizhi: "",
    sh_beizhu: "",
    sh_show: false,
    dizhiList: "广东省 广州市 海珠区 人民广场386号",
    dizhiok: false,
    mymoney: "0",
    youhuiquan: "0",
    money_zong: "0",
    guoqi: false,
    tuan_id: "" //团购id 发起时没有
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    wx.setNavigationBarTitle({ //设置标题
      title: '支付',
    })
    var danke = options.danke;

    var id = "";
    var product = "";
    var title = "";
    var keshi = "";
    var teacher = "";
    var tuan_id = ""; //团购id 发起时没有
    title = options.title;
    //购买单课
    if (danke) {
      id = options.id;

      keshi = options.keshi;
      teacher = options.teacher;
    } else {
    //购买套餐
      product = options.product; //套餐名称
      tuan_id = options.tuan_id; //拼团id 发起时没有
      if (tuan_id) { tuan_id = tuan_id } else { tuan_id=""}
      this.setData({
        tuan_id: tuan_id,
      })
    }
    
    var money_zong = Number(options.money_zong);
    var mymoney = 0;
    var mymoney2 = 0;
    var youhuiquan = 0;

    //判断账户余额
    var user = wx.getStorageSync("user");
    if (user) {
      mymoney = user.Money * 1;
      if (mymoney >= money_zong) {
        mymoney2 = "-" + money_zong;
        //money_zong = 0
        money_zong = 0.01 //下单测试
      } else {
        mymoney2 = "-" + mymoney;
        // money_zong = money_zong - mymoney
        money_zong = 0.01 //下单测试
      }
    } else {
      wx.navigateTo({
        url: '../login/login',
      })

    }

    //判断优惠券是否存在、是否过期
    var guoqi = false;
    if (user.YHQ == 1) {
      var time2 = this.dateAdd(user.yhq_time);
      if (new Date(time2) < new Date()) {
        guoqi = true;
      } else {
        if (money_zong != 0) {
          money_zong = money_zong - 100
        }
      }
    }


    if (money_zong < 0) {
      money_zong = 0
    }
    money_zong = Number(money_zong).toFixed(2);
    this.setData({
      danke: danke,
      id: id,

      mymoney: mymoney,
      mymoney2: mymoney2,
      title: title,
      num: keshi,
      name: teacher,
      youhuiquan: "0",
      guoqi: guoqi,
      money_zong: money_zong
    })
    if (!danke) {
      this.setData({
        product: product
      })
    }
  },
  dateAdd: function(startDate) {
    startDate = new Date(startDate);
    startDate = +startDate + 3000 * 60 * 60 * 24;
    startDate = new Date(startDate);

    var nextStartDate = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " " + startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds();
    return nextStartDate;

  },
  dizhi: function(e) {
    this.setData({
      sh_show: true
    })
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  sh_name: function(e) {
    this.setData({
      sh_name: e.detail.value
    })
  },
  sh_number: function(e) {
    this.setData({
      sh_number: e.detail.value
    })
  },
  sh_dizhi: function(e) {
    this.setData({
      sh_dizhi: e.detail.value
    })
  },
  sh_beizhu: function(e) {
    this.setData({
      sh_beizhu: e.detail.value
    })
  },
  //地址
  dizhibtn: function(e) {
    let user = wx.getStorageSync('user');
    let zcode = user.zcode; //客户端id号
    let token = user.token;
    if (this.data.sh_number && this.data.sh_dizhi && this.data.sh_name){
      var that=this;
      var address = that.data.region[0] + " " + that.data.region[1] + " " + that.data.region[2] + ", " + that.data.sh_dizhi;
      
      app.post(API_URL, "action=saveDyAdress&token=" + token + "&zcode=" + zcode + "&mobile=" + this.data.sh_number + "&address=" + address + "&uname=" + this.data.sh_name + "&beizhu=" + this.data.sh_beizhu, false, false, "", "", "", self).then(res => {

      that.setData({
        dizhiList: that.data.region[0] + " " + that.data.region[1] + " " + that.data.region[2] + ", " + that.data.sh_dizhi,
        dizhiok: true,
        address: address,
        daoyouci: false,
        sh_show: false,
        
      });
    });
    }else{
      wx.showToast({
        title: '请将您的信息填写完成',
        icon: 'none',
        duration: 2000
      })

    }
  },
  close: function(e) {
    this.setData({
      sh_show: false
    })
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
    let product = this.data.product;
    let money_zong = this.data.money_zong;
    if (self.data.danke==false && self.data.dizhiok==false) {
      wx.showToast({
        title: '请填写收货地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (money_zong > 0) {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          code = res.code;
          app.post(API_URL, "action=getSessionKey&code=" + code, true, false, "购买中").then((res) => {
            let openid = res.data.data[0].openid;

            app.post(API_URL, "action=unifiedorder&zcode=" + zcode + "&token=" + token + "&openid=" + openid + "&product=" + product + "&money_zong=" + money_zong, true, false, "购买中").then((res) => {

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
                      self.goumai();
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
      self.goumai();
    }
  },

  goumai: function() {
    let self = this;
    let code = "";
    let user = wx.getStorageSync('user');
    let zcode = user.zcode; //客户端id号
    let token = user.token;
    let product = this.data.product;
    if (self.data.danke) {
      //购买单课
      var id = self.data.id;
      app.post(API_URL, "action=BuyCourse&token=" + token + "&zcode=" + zcode + "&cid=" + id + "&buy=1", true, false, "购买中").then((res) => {
        wx.showToast({
          title: '购买成功',
          icon: 'none',
          duration: 3000
        })

        wx.setStorage({
          key: 'user',
          data: {
            Money: res.data.data[0].xuebi
          }
        })
        //进入我的课程页
        wx.navigateTo({
          url: '../user/course/list',
        })
      })
    } else {
      //发起拼单

      var address = this.data.region[0] + this.data.region[1] + this.data.region[2] + this.data.sh_dizhi;
     

      app.post(API_URL, "action=saveTuangouInfo&token=" + token + "&zcode=" + zcode + "&mobile=" + this.data.sh_number + "&address=" + this.data.address + "&tname=" + this.data.sh_name + "&tuan_id=" + this.data.tuan_id, false, false, "", "", "", self).then(res => {

        if (self.data.tuan_id!=""){
          wx.navigateTo({ //拼单完成自动购买 进入我的课程
            url: "/user/course/list"
          });
        }else{
          wx.navigateTo({ //进入拼单页
            url: "pindan?tuan_id=" + res.data.data[0].tuan_id
          });
        }
        

      });



      //购买套餐  先注释，拼单成功再购买
      // app.post(API_URL, "action=buyCourseBao&token=" + token + "&zcode=" + zcode + "&types=" + product + "&jiaocai=1", true, false, "购买中").then((res) => {

      //   wx.showToast({
      //     title: '购买成功',
      //     icon: 'none',
      //     duration: 3000
      //   })
      //   wx.setStorage({
      //     key: 'user',
      //     data: { Money: res.data.data[0].xuebi }
      //   })
      //   if (product =="豪华套餐"){
      //     wx.navigateBack({});

      //   }else{
      //     //进入我的课程页
      //     wx.navigateTo({
      //       url: '../user/course/list',
      //     })

      //   }
      // })
    }

  },
  youhuiquan: function() {
    wx.navigateTo({
      url: '../user/coupon/coupon',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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