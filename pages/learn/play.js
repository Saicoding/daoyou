// pages/video/videoDetail/videoDetail.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();
let md5 = require('../../common/MD5.js');
let animate = require('../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation();
let easeInAnimation = animate.easeInAnimation();


let changeVideo = false; //是否是通过点击更换的video

let changeType = false; //网络类型是否更改


let currentTime = 1;

let icon = { //图标高度宽度
  'width': 38,
  'height': 38
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    isPlaying: false, //是否在播放
    useFlux: false, //是否使用流量观看
    isWifi: true, //默认有wifi
    lastType: "first",
    product: 'introduction',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var kcid = options.kc_id

    this.setData({
      //kcid: kc_id, 
      kcid: "141908"
    })
    changeVideo = true; //防止视频结束时自动播放到下一个视频
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    this.payDetail = this.selectComponent("#payDetail");
    self.myVideo = wx.createVideoContext('myVideo');

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let platform = res.platform;
        console.log(platform)

        windowHeight = (windowHeight * (750 / windowWidth));

        self.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
          platform: platform
        })
      }
    });

    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    

    let self = this;

    let windowWidth = wx.getSystemInfoSync().windowWidth;
    let user = wx.getStorageSync('user');
    let LoginRandom = user.Login_random;
    let zcode = user.zcode;

    let kcid = self.data.kcid;

    let img = "";
    let loaded = self.data.loaded;
    let px = 1;
    let buied = self.data.buied;

    self.videoContext = wx.createVideoContext('myVideo');


    let lastpx = wx.getStorageSync('lastVideo' + kcid + user.username);
    let scroll = lastpx * 100 * windowWidth / 750;

    if (lastpx != "") {
      px = lastpx;
    }

    if (loaded && buied == undefined) return;

    loaded = false;
    app.post(API_URL, "action=getCourseShow&cid=" + kcid, false, false, "", "").then((res) => {

      let files = res.data.data[0].files; //视频列表
      let currentVideo = files[px - 1];
      // if (currentVideo.videoUrl == "") {
      //   wx.showToast({
      //     title: '您还没有开通此课程',
      //     icon: 'none',
      //     duration: 3000
      //   })
      // }
      let my_canvas = [];

      for (let i = 0; i < files.length; i++) {
        let cv = wx.createCanvasContext('myCanvas' + i, self)
        my_canvas.push(cv);
      }

      self.initfiles(files, px, my_canvas); //初始化video的图片信息

      let buy = res.data.data[0].buy; //是否已经开通
      //let kc_money = res.data.data[0].kc_money; //价格  
      var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/g;
      var info3 = res.data.data[0].kc_info.match(srcReg) + "";
      var info = info3.replace(/src=/i, "").replace(/[\'\"]?/g, "");
     
      self.setData({
        files: files,
        kc_name: res.data.data[0].kc_name,
        info: info,
        my_canvas: my_canvas,
        //kc_money: kc_money,
        loaded: true,
        img: res.data.data[0].kc_img,
        kcid: kcid,
        px: px,
        buy: buy,
        user: user,
        scroll: scroll
      })


    })

  },
  /**
   * 使用流量继续观看
   */
  continueWatch: function() {
    this.videoContext.play();
    this.setData({
      isPlaying: true,
      autoplay: true,
      useFlux: true
    })
  },



  /**
   * 换视频时
   */
  changeVideo: function(e) {
    let self = this;
    let windowWidth = self.data.windowWidth;

    let user = self.data.user;
    let kcid = self.data.kcid;
    let LoginRandom = user.Login_random;
    let zcode = user.zcode;
    changeVideo = false;

    let files = self.data.files; //当前所有视频
    let my_canvas = self.data.my_canvas; //当前所有画布
    let px = self.data.px; //当前视频编号
    let isPlaying = true; //是否正在播放视频

    let index = e.currentTarget.dataset.index; //点击的视频编号

    if (index == px - 1) return; //如果点击的是同一个视频就不做任何操作

    let lastVideo = files[px - 1]; //上一个视频
    let flag = self.ifEnd(lastVideo) ? 2 : 1; //判断是否看完;

    let lastCv = my_canvas[px - 1]; //上一个画布
    let videoID = lastVideo.id; //视频id

    let currentVideo = files[index]; //点击的这个视频

    if (currentVideo.videoUrl == "") {
      wx.showToast({
        title: '您还没有开通此课程',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    let currentCv = my_canvas[index]; //当前画布

    let playTime = 0;
    if (currentTime > 10 && currentTime < lastVideo.time_length - 10) { //播放时间)
      playTime = currentTime - 10;
    } else if (currentTime > lastVideo.time_length - 10) {
      playTime = currentTime;
    } else {
      playTime = 0;
    }

    let playCourseArr = lastVideo.playCourseArr;
    let playCourseStr = "";
    for (let i = 0; i < playCourseArr.length; i++) {
      if (i < playCourseArr.length - 1) {
        playCourseStr += playCourseArr[i] + ",";
      } else {
        playCourseStr += playCourseArr[i];
      }
    }

    lastVideo.lastViewLength = currentTime; //设置上一个视频的播放时间


    let angle = currentTime / lastVideo.time_length * 2 * Math.PI;



    let currentAngle = currentVideo.lastViewLength / currentVideo.length * 2 * Math.PI;



    currentTime = currentVideo.lastViewLength; //将当前播放时间置为该视频的播放进度

    if (currentTime >= currentVideo.length - 3) {
      changeVideo = true;
      self.videoContext.stop();
      isPlaying = false;
    }

    self.setData({
      files: files,
      isPlaying: isPlaying,
      px: index + 1,
    })

    //app.post(API_URL, "action=savePlayTime&LoginRandom=" + LoginRandom + "&zcode=" + zcode + "&videoID=" + videoID + "&playTime=" + playTime + "&kcid=" + kcid + "&flag=" + flag + "&playCourseArr=" + playCourseStr, false, true, "").then((res) => { })

  },

  /**
   * 视频缓冲时
   */
  waiting: function(e) {
    let self = this;
    this.setData({
      isPlaying: true,
    })
  },


  /**
   * 播放进度改变时
   */
  timeupdate: function(e) {
    let self = this;
    let px = self.data.px;
    let files = self.data.files;
    let video = files[px - 1];

    let my_canvas = self.data.my_canvas;
    let cv = my_canvas[px - 1];
    currentTime = e.detail.currentTime; //当前播放进度(秒)

    let m = parseInt(currentTime / 60);
    let angle = currentTime / video.length * 2 * Math.PI;

    if (video.playCourseArr[m] == 0) {
      video.playCourseArr[m] = 1;
    }


    if (currentTime % 10 >= 0 && currentTime % 10 <= 1) {

      self.setData({
        files: files
      })
    }
  },

  /**
   * 点击开始播放
   */
  play: function() {
    let self = this;
    let px = self.data.px; //当前视频编号
    let files = self.data.files; //当前所有视频
    let currentVideo = files[px - 1];

    if (currentVideo.videoUrl == "") {
      wx.showToast({
        title: '您还没有开通此课程',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    this.setData({
      isPlaying: true,
    })
  },

  /**
   * 点击暂停播放
   */
  pause: function() {
    this.setData({
      isPlaying: false
    })
  },

  /**
   * 视频播放结束后
   */
  end: function(e) {
    let self = this;
    let windowWidth = self.data.windowWidth;
    if (changeVideo) { //如果点击的视频时结尾状态就暂停
      self.videoContext.stop();
      return; //如果是通过点击更换的video
    }

    let user = self.data.user;
    let kcid = self.data.kcid;
    let LoginRandom = user.Login_random;
    let zcode = user.zcode;

    let files = self.data.files; //当前所有视频
    let my_canvas = self.data.my_canvas; //当前所有画布
    let px = self.data.px; //当前视频编号
    let isPlaying = true; //是否在播放

    if (px == files.length) return; //如果点击的是同一个视频就不做任何操作

    let lastVideo = files[px - 1]; //上一个视频
    let lastCv = my_canvas[px - 1]; //上一个画布
    let videoID = lastVideo.id; //视频id

    let flag = self.ifEnd(lastVideo) ? 2 : 1; //判断是否看完;

    let currentVideo = files[px]; //当前视频

    if (currentVideo.videoUrl == "") {
      wx.showToast({
        title: '您还没有开通此课程',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    let currentCv = my_canvas[px]; //当前画布

    let playTime = 0;
    if (currentTime > 10 && currentTime < lastVideo.time_length - 10) { //播放时间)
      playTime = currentTime - 10;
    } else if (currentTime >= lastVideo.time_length - 10) {
      playTime = currentTime;
    } else {
      playTime = 0;
    }

    lastVideo.lastViewLength = currentTime; //设置上一个视频的播放时间

    let playCourseArr = lastVideo.playCourseArr;
    let playCourseStr = "";
    for (let i = 0; i < playCourseArr.length; i++) {
      if (i < playCourseArr.length - 1) {
        playCourseStr += playCourseArr[i] + ",";
      } else {
        playCourseStr += playCourseArr[i];
      }
    }


    let currentAngle = currentVideo.lastViewLength / currentVideo.length * 2 * Math.PI;

    currentTime = currentVideo.lastViewLength; //将当前播放时间置为该视频的播放进度
    if (currentTime >= currentVideo.length - 3) {
      changeVideo = true;
      isPlaying = false;
    }

    self.setData({
      files: files,
      isPlaying: isPlaying,
      px: px + 1,
    })


    //app.post(API_URL, "action=savePlayTime&LoginRandom=" + LoginRandom + "&zcode=" + zcode + "&videoID=" + videoID + "&playTime=" + playTime + "&kcid=" + kcid + "&flag=" + flag + "&playCourseArr=" + playCourseStr, false, true, "").then((res) => {

    //})
  },

  /**
   * 切换播放状态
   */
  tooglePlay: function() {
    let self = this;

    let px = self.data.px; //当前视频编号
    let files = self.data.files; //当前所有视频
    let currentVideo = files[px - 1];

    if (currentVideo.videoUrl == "") {
      wx.showToast({
        title: '您还没有开通此课程',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    let isPlaying = self.data.isPlaying;
    if (currentVideo.lastViewLength == "0") { //如果没有播放过,就
      currentVideo.lastViewLength = "0.1";
      self.setData({
        files: files
      })
    }
    isPlaying = !isPlaying;
    changeVideo = false; //防止视频到最后时自动播放

    isPlaying ? this.videoContext.play() : this.videoContext.pause();

    self.setData({
      isPlaying: isPlaying,
    })
  },

  /**
   * 初始化视频信息
   */
  initfiles: function(files, px, my_canvas) {
    for (let i = 0; i < files.length; i++) {
      let video = files[i];
      // "orderid": "0",
      //   "filesname": "0_揭秘！导游业务科目如何学！.",
      //     "files": "http://test-xiaoyi-2017-4.oss-cn-qingdao.aliyuncs.com/2018daoyou/2018.6.26daoyouyewu_jingjiang_chenlong/0_34143141908206780jsudh.mp4",
      //       "time_length": "400.940567"


      video.show = true;
      let flag = video.Flag;
      let cv = my_canvas[i];

      //处理时间
      let length = Math.ceil(video.time_length);
      let m = parseInt(length / 60);
      let s = length % 60 < 10 ? '0' + length % 60 - 1 : length % 60 - 1;
      video.time_length = m + '分' + s + '秒';

      //初始化已观看视频的时间数组
      // if (video.playCourseArr.length == 0) { //如果是空数组，说明是首次观看
      //   if (s !== "00") {
      //     for (let i = 0; i < m + 1; i++) {
      //       video.playCourseArr.push(0);
      //     }
      //   }
      // }

      // let angle = video.lastViewLength / video.length * 2 * Math.PI;

    }
  },

  /**
   * 生命周期函数
   */
  onHide: function() {
    this.videoContext.pause();
    let self = this;
    let user = self.data.user;

    if (user != undefined) {
      let kcid = self.data.kcid;
      let px = self.data.px;
      wx.setStorageSync('lastVideo' + kcid + user.username, px);
    }
  },

  /**
   * 生命周期函数
   */
  onUnload: function() {
    let self = this;
    let user = self.data.user;
    let kcid = self.data.kcid;
    let px = self.data.px;

    let LoginRandom = user.Login_random;
    let zcode = user.zcode;

    let files = self.data.files; //当前所有视频

    let lastVideo = files[px - 1]; //上一个视频
    let flag = self.ifEnd(lastVideo) ? 2 : 1; //判断是否看完;

    // let playCourseArr = lastVideo.playCourseArr;
    // let playCourseStr = "";
    // for (let i = 0; i < playCourseArr.length; i++) {
    //   if (i < playCourseArr.length - 1) {
    //     playCourseStr += playCourseArr[i] + ",";
    //   } else {
    //     playCourseStr += playCourseArr[i];
    //   }
    // }

    let videoID = lastVideo.orderid; //视频id

    let playTime = 0;
    if (currentTime > 10 && currentTime < lastVideo.time_length - 10) { //播放时间)
      playTime = currentTime - 10;
    } else if (currentTime > lastVideo.time_length - 10) {
      playTime = currentTime;
    } else {
      playTime = 0;
    }


    wx.setStorageSync('lastVideo' + kcid + user.username, px);

    clearInterval(self.data.interval);

    ////app.post(API_URL, "action=savePlayTime&LoginRandom=" + LoginRandom + "&zcode=" + zcode + "&videoID=" + videoID + "&playTime=" + playTime + "&kcid=" + kcid + "&flag=" + flag + "&playCourseArr=" + playCourseStr, false, true, "").then((res) => { })
  },

  /**
   * 是否真正看完
   */
  ifEnd: function(video) {
    let end = true;
    for (let i = 0; i < video.playCourseArr.length; i++) {
      let playCourse = video.playCourseArr[i];
      if (playCourse == 0) {
        end = false;
        break;
      }
    }
    return end;
  },

  /**
   * 开通课程
   */
  // buy: function (e) {
  //   let self = this;
  //   let kcid = self.data.kcid;
  //   let px = self.data.px;
  //   let product = self.data.kcid;
  //   let code = "";
  //   let user = wx.getStorageSync('user');
  //   let Login_random = user.Login_random; //用户登录随机值
  //   let zcode = user.zcode; //客户端id号

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       code = res.code;
  //       app.post(API_URL, "action=getSessionKey&code=" + code, true, false, "开通中").then((res) => {
  //         let openid = res.data.openid;

  //         console.log("action=unifiedorder&LoginRandom=" + Login_random + "&zcode=" + zcode + "&product=" + product + "&openid=" + openid)
  //         app.post(API_URL, "action=unifiedorder&LoginRandom=" + Login_random + "&zcode=" + zcode + "&product=" + product + "&openid=" + openid, true, false, "开通中").then((res) => {

  //           let status = res.data.status;
  //           console.log(status)

  //           if (status == 1) {
  //             let timestamp = Date.parse(new Date());
  //             timestamp = timestamp / 1000;
  //             timestamp = timestamp.toString();
  //             let nonceStr = "TEST";
  //             let prepay_id = res.data.prepay_id;
  //             let appId = "wxf90a298a65cfaca8";
  //             let myPackage = "prepay_id=" + prepay_id;
  //             let key = "e625b97ae82c3622af5f5a56d1118825";

  //             let str = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + myPackage + "&signType=MD5&timeStamp=" + timestamp + "&key=" + key;
  //             let paySign = md5.md5(str).toUpperCase();

  //             let myObject = {
  //               'timeStamp': timestamp,
  //               'nonceStr': nonceStr,
  //               'package': myPackage,
  //               'paySign': paySign,
  //               'signType': "MD5",
  //               success: function (res) {
  //                 if (res.errMsg == "requestPayment:ok") { //成功付款后
  //                   app.post(API_URL, "action=BuyTC&LoginRandom=" + Login_random + "&zcode=" + zcode + "&product=" + product, true, false, "开通中").then((res) => {

  //                     wx.showToast({
  //                       title: '开通成功',
  //                       icon: 'none',
  //                       duration: 3000
  //                     })

  //                     self.setData({
  //                       loaded: false,
  //                     })

  //                     app.post(API_URL, "action=getCourseShow&LoginRandom=" + Login_random + "&zcode=" + zcode + "&kcid=" + kcid, false, false, "", "").then((res) => {

  //                       let files = res.data.data[0].files; //视频列表
  //                       let my_canvas = self.data.my_canvas;
  //                       self.initfiles(files, px, my_canvas); //初始化video的图片信息
  //                       self.setData({
  //                         files: files,
  //                         loaded: true,
  //                       })
  //                     })
  //                   })
  //                 }
  //               },
  //               fail: function (res) { }
  //             }
  //             wx.requestPayment(myObject)
  //           }
  //         })

  //       })
  //     }
  //   })
  // },
  /**
   * 弹出支付详细信息
   */
  showPayDetail: function(e) {
    let product = e.currentTarget.dataset.product;

    if (product == "DB16") {
      this.payDetail.setData({
        product: "jjr"
      })
      this.payDetail.showDialog();
    } else {
      this.payDetail.setData({
        product: "xl"
      })
      this.payDetail.showDialog();
    }
  },

  /**
   * 提交支付
   */
  // _submit: function (e) {
  //   let self = this;

  //   let product = e.detail.product;
  //   let kcid = self.data.kcid;
  //   let px = self.data.px;
  //   let code = "";
  //   let user = wx.getStorageSync('user');
  //   let Login_random = user.Login_random; //用户登录随机值
  //   let zcode = user.zcode; //客户端id号

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       code = res.code;
  //       app.post(API_URL, "action=getSessionKey&code=" + code, true, false, "开通中").then((res) => {
  //         let openid = res.data.openid;

  //         app.post(API_URL, "action=unifiedorder&LoginRandom=" + Login_random + "&zcode=" + zcode + "&product=" + product + "&openid=" + openid, true, false, "开通中").then((res) => {

  //           let status = res.data.status;

  //           if (status == 1) {
  //             let timestamp = Date.parse(new Date());
  //             timestamp = timestamp / 1000;
  //             timestamp = timestamp.toString();
  //             let nonceStr = "TEST";
  //             let prepay_id = res.data.prepay_id;
  //             let appId = "wxf90a298a65cfaca8";
  //             let myPackage = "prepay_id=" + prepay_id;
  //             let key = "e625b97ae82c3622af5f5a56d1118825";

  //             let str = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + myPackage + "&signType=MD5&timeStamp=" + timestamp + "&key=" + key;
  //             let paySign = md5.md5(str).toUpperCase();

  //             let myObject = {
  //               'timeStamp': timestamp,
  //               'nonceStr': nonceStr,
  //               'package': myPackage,
  //               'paySign': paySign,
  //               'signType': "MD5",
  //               success: function (res) {
  //                 if (res.errMsg == "requestPayment:ok") { //成功付款后
  //                   app.post(API_URL, "action=BuyTC&LoginRandom=" + Login_random + "&zcode=" + zcode + "&product=" + product, true, false, "开通中").then((res) => {
  //                     self.setData({ //设置已经开通
  //                       buy: 1
  //                     })
  //                     wx.showToast({
  //                       title: '开通成功',
  //                       icon: 'none',
  //                       duration: 3000
  //                     })

  //                     self.setData({
  //                       loaded: false,
  //                     })

  //                     app.post(API_URL, "action=getCourseShow&LoginRandom=" + Login_random + "&zcode=" + zcode + "&kcid=" + kcid, false, false, "", "").then((res) => {
  //                       let files = res.data.data[0].files; //视频列表

  //                       let my_canvas = self.data.my_canvas;
  //                       self.initfiles(files, px, my_canvas); //初始化video的图片信息

  //                       self.setData({
  //                         files: files,
  //                         loaded: true,
  //                       })
  //                     })
  //                   })
  //                 }
  //               },
  //               fail: function (res) { }
  //             }
  //             wx.requestPayment(myObject)
  //           }
  //         })
  //       })
  //     }
  //   })
  // },
  /**
   * 改变产品时
   */
  changeOption: function(e) {
    let self = this;
    let currentProduct = self.data.product; //当前种类
    let product = e.currentTarget.dataset.product; //点击的视频种类
    if (product == currentProduct) return; //如果没有改变就不作任何操作

    let windowWidth = self.data.windowWidth; //窗口宽度
    let moveData = undefined; //动画
    if (product == "introduction") {
      moveData = animate.moveX(easeOutAnimation, 0);
    } else if (product == "option") {
      moveData = animate.moveX(easeOutAnimation, 250 * (windowWidth / 750));
    } else {
      moveData = animate.moveX(easeOutAnimation, 500 * (windowWidth / 750));
    }

    self.setData({
      product: product,
      moveData: moveData
    })
  },

  /**
   * 导航到套餐页面
   */
  goPay: function() {

    wx.navigateTo({
      url: ''
    })
  }
})