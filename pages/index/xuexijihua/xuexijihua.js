// pages/index/xuexijihua/xuexijihua.js
let animate = require('../../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation(300);
let easeInAnimation = animate.easeInAnimation(300);

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
    wx.setNavigationBarTitle({//设置标题
      title: '学习计划',
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
    this.setData({
      nodes:"网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容网页内容"
    })
    animate.tiaoAnimation(easeOutAnimation,self);
  },

  /**
   * 导航到首页
   */
  GOindex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 单独购买
   */
  buy:function(){
    wx.showToast({
      icon:'none',
      title: '开发中',
      duration:3000
    })
  },

  /**
   * 发起团购
   */
  GOtuangou:function(){
    wx.showToast({
      icon: 'none',
      title: '开发中',
      duration: 3000
    })
  }

})