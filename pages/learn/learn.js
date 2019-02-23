// pages/learn/learn.js
const app = getApp()
var API_URL = "https://xcx2.chinaplat.com/daoyou/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: "笔试",
    barUrls: [],
    videoList: "",
    loaded: false,
    page:"0",
    diqus: [['安徽', '北京', '重庆', '福建'], ['河南', '河北', '湖北', '湖南', '海南', '黑龙江'], ['青海', '山东', '陕西', '四川', '山西', '上海', '深圳'], ['广东', '甘肃', '广西', '贵州'], ['江西', '辽宁', '江苏', '吉林', '宁夏', '内蒙古'], ['浙江', ' 天津', '新疆', '云南', '西藏']],
    diqu:"北京",
    daoyouci:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    //获取顶部图
    app.post(API_URL, "action=getCourseAD", false, false, "", "", "", self).then(res => {
      let barUrls = res.data.data[0].pic.split(",");
      self.setData({
        barUrls: barUrls
      });
      if (self.data.barUrls.length>1){
        self.bindPhoneModel = self.selectComponent("#bindPhoneModel");
      }
    });

    
    if (this.data.types != "导游词") { this.getCourse() } else {
      this.setData({
        daoyouci: true,
        loaded: true,
      })
    }
    
  },
  //获取课程列表
  getCourse: function() {
    this.setData({
      loaded: false,
      daoyouci: false,
    });
    app.post(API_URL, "action=getCourseList&types=" + this.data.types, false, false, "", "", "", self).then(res => {
      let newcourse = res.data.data[0].list;
      this.setData({
        videoList: newcourse,
        loaded: true
      });
    });
  },
  watch: function (e) {
    var kc_id = e.currentTarget.dataset.kc_id;
    wx.navigateTo({
      url: 'play?kc_id=' + kc_id,
    })
  },
  //切换菜单
  getList: function(e) {
    var val = e.currentTarget.dataset.val;
    if (this.data.types != val) {
      this.setData({
        types: val,
        daoyouci:false
      })
      this.getCourse()
    }
  },
  //导游词菜单
  getList2: function (e) {
    var val = e.currentTarget.dataset.val;
    if (this.data.types != val) {
      this.setData({
        types: val,
        daoyouci:true
      })
    }
  },
  //点击导游词
  diqu: function (e) {
    var val = e.currentTarget.dataset.diqu;
    wx.navigateTo({
      url: 'daoyouci_list?val=' + val,
    })

  },
})