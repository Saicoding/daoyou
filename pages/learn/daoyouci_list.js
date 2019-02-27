// pages/learn/daoyouci_list.js
const app = getApp()
var API_URL = "https://xcx2.chinaplat.com/daoyou/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:"",
    loaded: false,
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
    list:[],
    page_all: "1",
    page_now: "0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var val = options.val;
    if(!val){val="北京"}
    this.setData({
      val: val
    });
    this.getList()
  },

  
  getList: function () {
    var that = this;
    if (this.data.page_now < this.data.page_all){
    app.post(API_URL, "action=getDaoyouciList&page=" + (this.data.page_now*1+1) + "&province=" + this.data.val, false, false, "", "", "", self).then(res => {

      let newcourse = res.data.data[0].list;
      let list = that.data.list.concat(newcourse);

      that.setData({
        
        list: list,
        page_all: res.data.data[0].page_all,
        page_now: res.data.data[0].page_now,
        loaded: true,
        showLoadingGif: false,
        loadingMore: false,
        loadingText: ""
      });

    
    });
    }
  },
  info: function (e) {
    var id = e.currentTarget.dataset.id;
    var img = e.currentTarget.dataset.img;
    wx.navigateTo({
      url: 'daoyouci_info?id=' + id+"&img="+img,
    })
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
      loadingText: "载入更多列表 ..."
    })

    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})