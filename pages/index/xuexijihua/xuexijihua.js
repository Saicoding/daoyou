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
    let self = this;

    this.pindanSend = this.selectComponent("#pindanSend");
    this.buyTaocan = this.selectComponent("#buyTaocan");
    this.shareSuccessModel = this.selectComponent("#shareSuccessModel");//测试

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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    if(self.data.ifShare){
      self.shareSuccessModel.showDialog();
    }
    this.setData({
      nodes:"<div style = 'text-align:center;font-size:14px;font-weight:bolder;margin-top:100px;'>网页内容</div>"
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
    this.buyTaocan.showDialog();
  },

  /**
   * 发起团购
   */
  GOtuangou:function(){
    this.pindanSend.showDialog();
  },

  //点击分享
  onShareAppMessage: function (e) {
    let self = this;
    self.setData({
      ifShare:true
    })
    return {
      title: '我在本次测试中击败全国%的用户',
      path: '/pages/index/index', //这里设定都是以"/page"开头,并拼接好传递的参数
      imageUrl: '/images/denglu@3x.jpg',
      success: (res) => {
        console.log('转发成功')
      },
      fail: (res) => {
        console.log('转发失败')
      }
    }
  },

})