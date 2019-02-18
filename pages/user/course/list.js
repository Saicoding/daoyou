// pages/hasNoErrorShiti/hasNoErrorShiti.js
const API_URL = 'https://xcx2.chinaplat.com/'; //接口地址
const app = getApp();
let animate = require('../../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation();
let easeInAnimation = animate.easeInAnimation();
let buttonClicked = false;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //获取是否有登录权限
    // return;
    let self = this;

    self.setData({
      product: "jjr",
    })

    let url = encodeURIComponent('/pages/video/videoIndex/videoIndex');

    let user = wx.getStorageSync('user');

    wx.removeStorageSync('page');

    if (user) {
      self.setData({
        user: user
      })
    } else {
      wx.navigateTo({
        url: '/pages/login1/login1?url=' + url + '&ifGoPage=false',
      })
    }
  },

  /**
   * 生命周期事件
   */
  onReady: function () {
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;

        windowHeight = (windowHeight * (750 / windowWidth));

        self.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
        })
      }
    });
  },

  /**
   * 在返回页面的时候
   */
  onShow: function () {
    // return;
    let self = this;
    let user = wx.getStorageSync('user');

    buttonClicked = false;

    if (user != "") {
      let LoginRandom = user.Login_random;
      let zcode = user.zcode;
      let url = encodeURIComponent('/pages/video/videoIndex/videoIndex');

      let moveData = undefined;
      let product = wx.getStorageSync('page');

      let types = "";
      if (product == "xl") {
        types = "xl"
      } else {
        types = "jjr"
      }

      self.setData({
        user: user,
        product: types
      })

      app.post(API_URL, "action=GetCourseList&types=" + types + "&LoginRandom=" + LoginRandom + "&zcode=" + zcode, false, true, "", url).then((res) => {
        let videoList = res.data.list;
        self.setData({
          videoList: videoList,
          loaded: true
        })

        //得到消息数目
        let url = encodeURIComponent('/pages/videoIndex/videoIndex');
        app.post(API_URL, "action=GetNoticesNums&LoginRandom=" + LoginRandom + "&zcode=" + zcode, false, true, "", url).then((res) => {
          let nums = res.data.nums;

          if (nums > 0) {
            nums = nums.toString();
            wx.setTabBarBadge({
              index: 3,
              text: nums,
            })
          } else {
            wx.removeTabBarBadge({
              index: 3,
            })
          }
        })
      })
    }
  },

  
  /**
   * 观看视频
   */
  watch: function (e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let product = self.data.product;

    let kc_id = e.currentTarget.dataset.kc_id;
    let title = e.currentTarget.dataset.title;
    let img = e.currentTarget.dataset.img

    
    wx.navigateTo({
      url: '/pages/video/videoDetail/videoDetail?kc_id=' + kc_id + '&img=' + img + "&product=" + product + "&title=" + title,
    })
  }
})