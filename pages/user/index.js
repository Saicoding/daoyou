// pages/user/index.js

const app = getApp();

const API_URL = 'https://xcx2.chinaplat.com/'; //接口地址
let appId = "wx274bc5c5c5ce0434";
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //获取到的手机栏中的值
    openId: '', //用户唯一标识  
    unionId: '',
    encryptedData: '',
   
    user:{
      username:"臭不要脸的管子",
      Pic:"../../images/user/img.png"
    }
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
  calling: function (e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel + ""
    })
  },
})