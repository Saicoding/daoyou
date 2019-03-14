// pages/user/coupon/coupon.js
const app = getApp()
var API_URL = "https://xcx2.chinaplat.com/daoyou/";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    user:"",
    time2:"",
    guoqi: 'true',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = wx.getStorageSync("user");
    var time2 = this.dateAdd(user.yhq_time);
    
    var guoqi = 'true';
    if (new Date(time2) < new Date()) { guoqi = 'true' } else { guoqi = 'false'}
    this.setData({
     user:user,
     time2:time2,
     guoqi:guoqi,
     loaded: true
    })
  },
  dateAdd: function (startDate) {
    startDate = new Date(startDate);
    startDate = +startDate + 3000 * 60 * 60 * 24;
    startDate = new Date(startDate);

    var nextStartDate = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " " + startDate.getHours() + ":"+ startDate.getMinutes() + ":" + startDate.getSeconds();
    return nextStartDate;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})