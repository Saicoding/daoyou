// pages/learn/daoyouci_info.js
const app = getApp()
var API_URL = "https://xcx2.chinaplat.com/daoyou/";
const myaudio = wx.createInnerAudioContext();

let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    id: "",
    img: "",
    play: "zanting",
    bofang: false,
    time: "00.00",
    timeon: "00.00",
    time2: 0,
    timeon2: 0,
    daoyouci: "",
    nodes: "",
    nodes2: "",
    pl: "",
    page_all: '2',
    page_now: '1',
    text: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var img = options.img;
    this.setData({
      id: id,
      img: img
    });

    var that = this;

    app.post(API_URL, "action=getDaoyouciShow&id=" + this.data.id, false, false, "", "", "", self).then(res => {
      let daoyouci = res.data.data[0];
      that.setData({
        daoyouci: daoyouci,
        nodes: daoyouci.content,
        nodes2: daoyouci.info,
        loaded: true
      });
      if (that.data.daoyouci.mp3) {
        myaudio.src = this.data.daoyouci.mp3;


        setTimeout(() => {
          console.log(myaudio.duration)
          var time = that.s_to_hs(myaudio.duration);
          this.setData({
            time: time,
            time2: myaudio.duration,
            loaded: true,
          })
        }, 2000)

        myaudio.onPlay(() => {

          that.setData({
            bofang: true
          })
          setTimeout(() => {
            myaudio.currentTime;
            myaudio.onTimeUpdate(() => {
              var timeon = that.s_to_hs(myaudio.currentTime)
              that.setData({
                timeon: timeon,
                timeon2: myaudio.currentTime
              })
            })
          }, 1000)
        });


        myaudio.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })

      }

      that.getPL()
    });




  },

  s_to_hs: function(s) {
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    s = s.toFixed(0)
    h = Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s = s % 60;
    //将变量转换为字符串
    h += '';
    s += '';
    //如果只有一位数，前面增加一个0
    h = (h.length == 1) ? '0' + h : h;
    s = (s.length == 1) ? '0' + s : s;
    return h + ':' + s;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {


  },
  audioPlay() {
    myaudio.play();
    this.setData({
      play: "bofang"
    })
  },
  audioPause() {
    myaudio.pause();
    this.setData({
      play: "zanting"
    })
  },
  
  /**
   * 输入文字
   */
  typing: function (e) {

    let text = e.detail.value;
    this.setData({
      text: text

    })
  },
  /**
   * 发送信息
   */
  sendMessage: function () {
    buttonClicked = false;
    let self = this;

    let user = wx.getStorageSync('user');
    console.log(user)
    if (user) {
      let zcode = user.zcode;
      let token = user.token;
      let kcid = self.data.id;
      let content = self.data.text;
      app.post(API_URL, "action=saveCoursePL&token=" + token + "&zcode=" + zcode + "&cid=" + kcid + "&plcontent=" + content + "&page=1", false, false, "", "", "", self).then(res => {

        self.setData({
          text: ''
        })
        self.getPL();
        
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })


    }
  },
  getPL: function () {
    //获取评论列表
   
    if (this.data.page_now < this.data.page_all) {
     
      var self = this;

      app.post(API_URL, "action=getCoursePL&cid=" + this.data.id + "&page=" + this.data.page_now, false, false, "", "").then((res) => {
        var page_all = res.data.data[0].page_all;
        var page_now = res.data.data[0].page_now;
        if (page_all == 0) { page_all = 2 }
        if (page_now > page_all) { page_all = page_now }
        
        self.setData({
          page_all: page_all,
          page_now: page_now,
          pl: res.data.data[0].pllist
        })

      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    myaudio.destroy()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})