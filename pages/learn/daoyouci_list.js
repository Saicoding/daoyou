// pages/learn/daoyouci_list.js
const app = getApp()
var API_URL = "https://xcx2.chinaplat.com/daoyou/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:"河北",
    loaded: false,
    list:"",
    page_all: "1",
    page_now: "0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var val = options.val;
    // this.setData({
    //   val: val
    // });
    this.getList()
  },

  
  getList: function () {
    var that = this;
    if (this.data.page_now < this.data.page_all){
    app.post(API_URL, "action=getDaoyouciList&page=" + (this.data.page_now*1+1) + "&province=" + this.data.val, false, false, "", "", "", self).then(res => {
      let newcourse = res.data.data[0].list;
      that.setData({
        list: newcourse,
        page_all: res.data.data[0].page_all,
        page_now: res.data.data[0].page_now,
        loaded: true
      });
    });
    }
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