
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    kong:"",
    tuan_id: "",
    user: "",//判断是否登录
    video: "",
    maxtime: "",
    endtime: 0,
    tuanzhuImg: "",//拼主头像
    pin_img: "",//已拼网友头像
    guoqi: false,//是否过期
    pindan:false,//拼单是否成功
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var user = wx.getStorageSync("user");
    var token = "";
    var zcode = "";
    if (user) {
      this.setData({
        user: user
      })
      token = user.token;
      zcode = user.zcode;
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    let that = this;
    app.post(API_URL, "action=getMyTuangouInfo&token=" + user.token + '&zcode=' + user.zcode, false, false, "", "").then((res) => {
      var list = res.data.data[0];
      
      if(list){
        var endtime = Date.parse(new Date(list.endtime)) / 1000;
        that.setData({
          tuan_id:list.id,
          title: list.title,
          price_tuan: list.money,
          endtime: endtime,
          tuanzhuImg: list.tuanzhuImg,
          pin_img: list.pin_img,
          loaded: true,
        });
        that.time();
      }else{
        that.setData({ kong: 'kong', loaded: true,});

      }
    });



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  time: function () {
    var totalSecond = this.data.endtime - (Date.parse(new Date()) / 1000);

    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;

      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '拼单已结束',
          icon: 'none',
          duration: 2000
        })

        this.setData({
          guoqi: true,
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var user = wx.getStorageSync("user");
    if (user) {
      this.setData({
        ifShare: true
      });
      var userid = user.zcode;
      var img = '/images/avatar.png';
      if (user.Pic) { img = user.Pic }
      
      return {
        title: '我发起拼单啦，导游全套视频课程+全套教材+全套试题库，两年超长课程保质期',
        path: '/pages/learn/pindan?tuan_id=' + this.data.tuan_id + '&img=' + img + '&userid=' + userid,
        imageUrl: 'http://www.chinaplat.com/daoyou/images/quanpei.jpg',
      }
    }else{
      wx.navigateTo({
        url: '../../login/login',
      })

    }
  }
})