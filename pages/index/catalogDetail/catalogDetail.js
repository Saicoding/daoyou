// pages/index/catalogDetail/catalogDetail.js
const app = getApp()
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;//点击的栏目id
    let title = options.title;//上个页面带过来的title

    wx.setNavigationBarTitle({
      title: title,
    })

    this.setData({
      id:id
    })
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
    let self = this;
    let id = self.data.id;//栏目详情id

    self.setData({
      isLoaded:false
    })
    app.post(API_URL,"action=getLcShow&id="+id,false,false,"","").then(res=>{
      let content = res.data.data[0].content;
     

      self.setData({
        isLoaded:true,
        nodes: content 
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

  }
})