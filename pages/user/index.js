// pages/user/index.js

const app = getApp();

const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //获取到的手机栏中的值
    openId: '', //用户唯一标识  
    unionId: '',
    encryptedData: '',
    news_num: 0,
    isnum:false //是否是手机号登陆
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;

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
  logout: function() {
    wx.removeStorageSync('user');
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let user = wx.getStorageSync('user');
    let that = this;
    if (user) {
      let zcode = user.zcode;
      let token = user.token;
      let isnum = false;
      if (/^1[3|4|5|6|7|8|9]\d{9}$/.test(user.username)){
        isnum =true;
      }
      var time2 = this.dateAdd(user.yhq_time);

      var guoqi = 'true';
      if (new Date(time2) < new Date()) { guoqi = 'true' } else { guoqi = 'false' }
      // { "Message": "请求成功", "status": 1, "data": [{ "Nicename": "屌丝洋", "Sex": "男", "Address": "北京市,北京市,东城区,人民广场", "Mobile": "13292374292", "Email": "819992797@qq.com", "Jifen": "0", "Money": "15907.54", "xueshi": 618523 }] }
      // { "Message": "请求成功", "status": 1, "data": [{ "token": "e37658e391e4194a22008f4dea71e50f", "Mycode": "111562", "username": "13292374292", "Nickname": "屌丝洋", "Jifen": "0", "Money": "15907.54", "xueshi": "618523", "Vip": "0", "Ktime": "", "Jtime": "", "zcode": 11562, "Pic": "http://www.chinaplat.com/user/UserHeadImg/11562.jpg", "TKflag": 0, "YHQ": 0, "taocan": "1", "yhq_time": "" }] }
  
      app.post(API_URL, "action=getUserInfo&zcode=" + zcode + "&token=" + token, false, false, "", "", true, self).then((res) => {
        user.Money = res.data.data[0].Money;
        user.Nicename = res.data.data[0].Nicename;
        wx.setStorage({
          key: 'user',
          data:user
        }) 

      })
      this.setData({
        user: user,
        isnum :true,
        guoqi: guoqi
      })
      app.post(API_URL, "action=GetNoticesNums&zcode=" + zcode + "&token=" + token, false, false, "", "", true, self).then((res) => {
        var news_num = res.data.data[0].nums;
        that.setData({
          news_num: news_num
        })
      })


    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  dateAdd: function (startDate) {
    startDate = new Date(startDate);
    startDate = +startDate + 3000 * 60 * 60 * 24;
    startDate = new Date(startDate);

    var nextStartDate = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " " + startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds();
    return nextStartDate;

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

  },

  calling: function(e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel + ""
    })
  },

  /**
   * 导航到消息界面
   */
  GOnews:function(){
    wx.navigateTo({
      url: 'message/news',
    })
  },

  /**
   * 导航到优惠券
   */
  GOcoupon:function(){
    wx.navigateTo({
      url: 'coupon/coupon',
    })
  },

  /**
   * 导航到修改密码
   */
  GOpwd:function(){
    wx.navigateTo({
      url: 'message/pwd',
    })
  },

  /**
   * 导航到拼单界面
   */
  GOpindan:function(){
    wx.navigateTo({
      url: '../user/course/pindan_list',
    })
  },

  /**
   * 导航到精品推荐
   */
  GOtuijian:function(){
    wx.navigateTo({
      url: '../user/tuijian/tuijian',
    })
  }
})