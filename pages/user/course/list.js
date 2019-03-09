// pages/hasNoErrorShiti/hasNoErrorShiti.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    loadingMore: false,
    videoList:[],
    page_all: 1,
    page_now: 0,
    user:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //获取是否有登录权限
    // return;
    let self = this;
    let user = wx.getStorageSync('user');
    if (user) {
      self.setData({
        user: user
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    this.getlist()
  },
  
  getlist: function(){
    let self = this;
    var user = wx.getStorageSync("user");
    var token = "";
    var zcode = "";
    if (user) {
      token = user.token;
      zcode = user.zcode;
      if (this.data.page_all > this.data.page_now) {
        this.setData({ loadingMore: true });
        
        app.post(API_URL, "action=getBuyCourse&token=" + token + "&zcode=" + zcode + "&page=" + (this.data.page_now * 1 + 1), false, false, "", "", "", self).then((res) => {
          
          let videoList = res.data.data[0].Course;
          let videoLists = self.data.videoList.concat(videoList);

          
          let page_all = res.data.data[0].page_all*1;
          let page_now = res.data.data[0].page_now*1;
          
          self.setData({
            videoList: videoLists,
            page_all: page_all,
            page_now: page_now,
            loadingMore:false,
            loaded: true
          });
          
        });
      }
    }

  },
  watch: function (e) {
    var kc_id = e.currentTarget.dataset.kc_id;
    var renshu = e.currentTarget.dataset.renshu;
    wx.navigateTo({
      url: '/pages/learn/play?kc_id=' + kc_id + '&renshu=' + renshu,
    })
  },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    if (this.data.page_now >= this.data.page_all) {
      self.setData({ //正在载入
        loadingText: "别扯了,我是有底线的..."
      })
      return;
    }
    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "正在载入..."
    })

    this.getlist()
    
  },
})