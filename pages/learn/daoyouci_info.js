// pages/learn/daoyouci_info.js
const app = getApp()
var API_URL = "https://xcx2.chinaplat.com/daoyou/";
const myaudio = wx.createInnerAudioContext();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded:true,
    play:"zanting",
    bofang:false,
    time:"00.00",
    timeon:"00.00",
    time2: 0,
    timeon2: 0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var id = options.id;
    var that= this;
    myaudio.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
   
    setTimeout(() => {
      console.log(myaudio.duration)
      var time = that.s_to_hs(myaudio.duration);
      this.setData({
        time: time,
        time2: myaudio.duration
      })
    }, 2000)
    
    myaudio.onPlay(() => {
     
      that.setData({
        bofang:true
      })
      setTimeout(() => {
        myaudio.currentTime;
        myaudio.onTimeUpdate(() => {
          var timeon = that.s_to_hs(myaudio.currentTime)
          that.setData({
            timeon: timeon,
            timeon2: myaudio.currentTime
          })
      })  }, 1000)
    });
   

    myaudio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    
  },
  s_to_hs: function(s){
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    s = s.toFixed(0)
    h  =   Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s  =   s % 60;
    //将变量转换为字符串
    h    += '';
    s    += '';
    //如果只有一位数，前面增加一个0
    h  =   (h.length == 1) ? '0' + h : h;
    s  =   (s.length == 1) ? '0' + s : s;
    return h + ':' + s;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
    
  },
  audioPlay() {
    myaudio.play();
    this.setData({ play:"bofang"})
  },
  audioPause() {
    myaudio.pause();
    this.setData({ play: "zanting" })
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
    myaudio.destroy()
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