
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    tuan_id: "",
    video: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tuan_id = options.tuan_id;
    var user = wx.getStorageSync("user");
    var token = "";
    var zcode = "";
    if (user) {
      this.setData({
        user: user
      })
      token = user.token;
      zcode = user.zcode;
    } else {
      wx.navigateTo({
        url: '/login/login',
      })
    }
    let that = this;
    app.post(API_URL, "action=getCourseBao&token=" + user.token + '&zcode=' + user.zcode, false, false, "", "").then((res) => {
      var list = res.data.data[0].list;
      that.setData({

        title: list[0].biecheng,
        price_tuan: list[0].money,
        num: list[0].buy_nums,
        typesname: list[0].typesname,
        url: list[0].url,
        buy: list[0].buy,
        img: "http://www.chinaplat.com/CourseImg/IMG-20160414/217_156_20160414133690609060.jpg",
        infos: ['适用于期望一次通关拿证考生。包含内容：', '① 笔试四科基础精讲、习题提升、考前冲刺视频课程，共计12门，预计230课时。', '② 章节习题+10套全真模拟+3套核心密卷。', ' 额外赠送：', '① 2019新版教材   ② 面试指导课  ③ 各省导游词 ', '邮寄教材'],
        loaded: true,
      })
    });



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

  }
})