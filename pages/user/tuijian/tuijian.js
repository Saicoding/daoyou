// pages/user/tuijian/tuijian.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/daoyou/";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded: false,
    list:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
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
    var that = this;
    app.post(API_URL, "action=getTuijianXCX", false, false, "", "", "", self).then(res => {
      
      var list = res.data.data[0];
      if (list.length == undefined) {
        list = [list]
      }
      that.setData({
        list: list,
        isLoaded: true
      })
      
    })
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

  },
  toapp: function (e) {

    wx.navigateToMiniProgram({
      appId: '',
      path: '',
      extraData: {},
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  
})