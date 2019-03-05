// pages/video/videoDetail/videoDetail.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();
let md5 = require('../../common/MD5.js');
let animate = require('../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation();
let easeInAnimation = animate.easeInAnimation();
let myanimation = animate.easeOutAnimation();
let buttonClicked = false;
let changeVideo = false; //是否是通过点击更换的video
let changeType = false; //网络类型是否更改

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
    product: 'option',
    pl: "",
    page_all: '2',
    page_now: '1',
    text: "",
    infowidth:"",
    //meuntop: "",//获取菜单高度
    mybar:"",
    playbackRate: 1,//播放速率  0.5、0.8、1.0、1.25、1.5
    currentTime: 0//当前播放时间
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var kcid = options.kc_id;
    var renshu = options.renshu;
    
    this.setData({
      kcid: kcid,
      renshu: renshu
    })
    changeVideo = true; //防止视频结束时自动播放到下一个视频
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    this.payDetail = this.selectComponent("#payDetail");
    //self.myVideo = wx.createVideoContext('myVideo');

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
  //改变视频速率
  beisu: function (e) {
    var beisu = e.currentTarget.dataset.su*1;
    this.setData({ playbackRate: beisu });
    this.videoContext.playbackRate(beisu)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


    let self = this;

    let windowWidth = wx.getSystemInfoSync().windowWidth;

    let kcid = self.data.kcid;

    let img = "";
    let loaded = self.data.loaded;
    let px = 1;
    let user = wx.getStorageSync('user');
   
    let zcode = user.zcode; //客户端id号
    let token = user.token;
    

    if (loaded == undefined) return;

    loaded = false;
    app.post(API_URL, "action=getCourseShow&cid=" + kcid + "&token=" + token + "&zcode=" + zcode, false, false, "", "", "", self).then((res) => {
      console.log(res.data)
      let files = res.data.data[0].files; //视频列表
      let currentVideo = files[px - 1];
      
      let buy = res.data.data[0].buy; //是否已经开通
      let kc_money = res.data.data[0].money; //价格 
      if (res.data.data[0].kc_info) {
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/g;
        var info3 = res.data.data[0].kc_info.match(srcReg) + "";
        var info = info3.replace(/src=/i, "").replace(/[\'\"]?/g, "");
        var infowidth ="94"
      }else{
        var info = "/images/hasNopage/hasNopage.png"
        var infowidth = "40"
      }
      
      self.initfiles(files, px)
      self.setData({
        files: files,
        kc_name: res.data.data[0].kc_name,
        teacher: res.data.data[0].teacher,
        zi: res.data.data[0].kc_name.substr(res.data.data[0].kc_name.length - 2, 2),
        info: info,
        kc_money: kc_money,
        loaded: true,
        img: res.data.data[0].kc_img,
        kcid: kcid,
        px: px,
        buy: buy,
        infowidth: infowidth
        //user: user,
        //scroll: scroll
      });
      // setTimeout(() => { //获取菜单高度
      //   wx.createSelectorQuery().selectAll('.mybar').boundingClientRect(function (rect) {
      //     var meuntop = rect[0].top;
      //     self.setData({ meuntop: meuntop});
      //   }).exec()
      // }, 1000)

      //最后播放视频索引
      let lastpx = wx.getStorageSync('lastVideo' + kcid + user.zcode);
      let scroll = lastpx * 100 * windowWidth / 750;
      if (lastpx != "") {
        px = lastpx.px;
        //videoID 最后播放视频id
        //initialTime 最后播放视频时间
        let lasttime = wx.getStorageSync('kesub' + kcid + "_" + lastpx.videoID + "_" + user.zcode);
        if (lasttime) { this.videoContext.seek(lasttime / 1000) }
      }
    })


    //获取评论列表
    self.getPL();

  },
  
  
  getPL: function() {
    //获取评论列表
    if (this.data.page_now < this.data.page_all) {
      var self = this;

      app.post(API_URL, "action=getCoursePL&cid=" + this.data.kcid + "&page=" + this.data.page_now, false, false, "", "").then((res) => {
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
   * 输入文字
   */
  typing: function(e) {

    let text = e.detail.value;
    this.setData({
      text: text

    })
  },
  /**
   * 发送信息
   */
  sendMessage: function() {
    buttonClicked = false;
    let self = this;
    
    let user = wx.getStorageSync('user');
   
    if (user) {
      let zcode = user.zcode;
      let token = user.token;
      let kcid = self.data.kcid;
      let content = self.data.text;
      app.post(API_URL, "action=saveCoursePL&token=" + token + "&zcode=" + zcode + "&cid=" + kcid + "&plcontent=" + content + "&page=1", false, false, "", "", "", self).then(res => {

        self.setData({
          text: ''
        })
        self.getPL();
        wx.pageScrollTo({
          scrollTop: 0
        })
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })


    }
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


    let kcid = self.data.kcid;


    changeVideo = false;

    let files = self.data.files; //当前所有视频

    let px = self.data.px; //当前视频编号
    let isPlaying = true; //是否正在播放视频

    let index = e.currentTarget.dataset.index; //点击的视频编号

    if (index == px - 1) return; //如果点击的是同一个视频就不做任何操作

    let lastVideo = files[px - 1]; //上一个视频
    let videoID = lastVideo.id; //上一个视频id
    let flag = self.ifEnd(lastVideo) ? 2 : 1; //判断是否看完;
    let currentVideo = files[index]; //点击的这个视频

    if (currentVideo.files == "") {
      let user = wx.getStorageSync('user');
      if (user) {
        wx.showToast({
          title: '您还没有开通此课程',
          icon: 'none',
          duration: 3000
        })
        return;
      } else {
        wx.navigateTo({
          url: '../login/login',
        })
      }
    }

    let playTime = 0;
    let currentTime=self.data.currentTime;
    if (currentTime > 10 && currentTime < lastVideo.time_length - 10) { //播放时间)
      playTime = currentTime - 10;
    } else if (currentTime > lastVideo.time_length - 10) {
      playTime = currentTime;
    } else {
      playTime = 0;
    }
    
    console.log(lastVideo.time_length+"_"+currentTime+"_"+playTime)

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


    //let angle = currentTime / lastVideo.time_length * 2 * Math.PI;



    //let currentAngle = currentVideo.lastViewLength / currentVideo.time_length * 2 * Math.PI;



    

    if (currentVideo.lastViewLength >= currentVideo.time_length - 3) {
      changeVideo = true;
      self.videoContext.stop();
      isPlaying = false;
    }

    self.setData({
      files: files,
      isPlaying: isPlaying,
      px: index + 1,
      currentTime : currentVideo.lastViewLength //将当前播放时间置为该视频的播放进度
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    let user = wx.getStorageSync('user');
    if (user) {
      let zcode = user.zcode;
      let token = user.token;

      wx.setStorage({
        key: 'kesub' + kcid + "_" + videoID + "_" +zcode,
        data: playTime,
        success: function () {
          console.log('kesub' + kcid + "_" + videoID + "_" + zcode + "_" + playTime)
        },
        fail: function () {
          console.log('存储失败')
        }
      })

      app.post(API_URL, "action=savePlayTime&zcode=" + zcode + "&token=" + token + "&videoid=" + videoID + "&playTime=" + playTime + "&kcid=" + kcid + "&flag=" + flag + "&playCourseArr=" + playCourseStr, false, true, "").then((res) => { })
    }
    //videoID 缓存的视频id
    //initialTime 缓存的视频时间
    let hctime = wx.getStorageSync('kesub' + kcid + "_" + files[index].videoID + "_" + user.zcode);
    if (hctime) { this.videoContext.seek(hctime / 1000) }
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
  timeupdate: function (e) {
    let self = this;
    let px = self.data.px;
    let files = self.data.files;
    let video = files[px - 1];

    let m = parseInt(e.detail.currentTime / 60);
    //let angle = currentTime / video.length * 2 * Math.PI;

    if (video.playCourseArr[m]==0 ){
      video.playCourseArr[m] = 1;
    }


    if (e.detail.currentTime % 10 >= 0 && e.detail.currentTime % 10 <= 1) {
      //self.drawPlay(cv, angle, px - 1, files);
      self.setData({
        files: files,
        currentTime: e.detail.currentTime
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

    if (currentVideo.files == "") {
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

    let kcid = self.data.kcid;

    let files = self.data.files; //当前所有视频

    let px = self.data.px; //当前视频编号
    let isPlaying = true; //是否在播放

    if (px == files.length) return; //如果点击的是同一个视频就不做任何操作

    let lastVideo = files[px - 1]; //上一个视频
    let flag = self.ifEnd(lastVideo) ? 2 : 1; //判断是否看完;
    let videoID = lastVideo.id; //视频id


    let currentVideo = files[px]; //当前视频

    if (currentVideo.files == "") {
      let user = wx.getStorageSync('user');
      if (user) {
        wx.showToast({
          title: '您还没有开通此课程',
          icon: 'none',
          duration: 3000
        })
        return;
      } else {
        wx.navigateTo({
          url: '../login/login',
        })
      }
    }



    let playTime = 0;
    let currentTime = self.data.currentTime;
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

    let currentAngle = currentVideo.lastViewLength / currentVideo.time_length * 2 * Math.PI;

    

    if (currentVideo.lastViewLength >= currentVideo.time_length - 3) {
      changeVideo = true;
      isPlaying = false;
    }

    self.setData({
      files: files,
      isPlaying: isPlaying,
      px: px + 1,
      currentTime : currentVideo.lastViewLength //将当前播放时间置为该视频的播放进度
    })

    let user = wx.getStorageSync('user');
    if (user) {
      let zcode = user.zcode;
      let token = user.token;
      wx.setStorage({
        key: 'kesub' + kcid + "_" + videoID + "_" + zcode,
        data: playTime,
        success: function () {
          console.log('kesub' + kcid + "_" + videoID + "_" + zcode + "_" + playTime)
        },
        fail: function () {
          console.log('存储失败')
        }
      })
      app.post(API_URL, "action=savePlayTime&zcode=" + zcode + "&token=" + token + "&videoid=" + videoID + "&playTime=" + playTime + "&kcid=" + kcid + "&flag=" + flag + "&playCourseArr=" + playCourseStr, false, true, "").then((res) => { })
    }


  },

  /**
   * 切换播放状态
   */
  tooglePlay: function() {
    let self = this;
    console.log('ok')

    let px = self.data.px; //当前视频编号
    let files = self.data.files; //当前所有视频
    let currentVideo = files[px - 1];

    if (currentVideo.files == "") {
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.videoContext.pause();
    let self = this;
    let user = self.data.user;

    if (user != undefined) {
      let kcid = self.data.kcid;
      let px = self.data.px;
      //wx.setStorageSync('lastVideo' + kcid + user.zcode, px);
      let onVideo = files[px]; 
      let videoID = onVideo.id; 
      wx.setStorage({
        key: 'lastVideo' + kcid + user.zcode,
        data: {
          px:px,
          videoID: videoID
        },
        success: function () {
          console.log('lastVideo' + kcid + user.zcode + "_" + px + "_" + videoID)
        },
        fail: function () {
          console.log('存储失败')
        }
      })

    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let self = this;

    let kcid = self.data.kcid;
    let px = self.data.px;
    let files = self.data.files; //当前所有视频
    let lastVideo = files[px]; 
    let flag = self.ifEnd(lastVideo) ? 2 : 1; //判断是否看完;
    let videoID = lastVideo.orderid; 



    let playCourseArr = lastVideo.playCourseArr;
    let playCourseStr = "";
    for (let i = 0; i < playCourseArr.length; i++) {
      if (i < playCourseArr.length - 1) {
        playCourseStr += playCourseArr[i] + ",";
      } else {
        playCourseStr += playCourseArr[i];
      }
    }


    let playTime = 0;
    let currentTime = self.data.currentTime;
    if (currentTime > 10 && currentTime < lastVideo.time_length - 10) { //播放时间)
      playTime = currentTime - 10;
    } else if (currentTime > lastVideo.time_length - 10) {
      playTime = currentTime;
    } else {
      playTime = 0;
    }

  
    
    //wx.setStorageSync('lastVideo' + kcid + user.zcode, px);
    
    clearInterval(self.data.interval);
    let user = wx.getStorageSync('user');
    if (user) {


      let zcode = user.zcode;
      let token = user.token;
      wx.setStorage({
        key: 'lastVideo' + kcid + zcode,
        data: {
          px: px,
          videoID: videoID
        },
        success: function () {
          console.log('lastVideo' + kcid + zcode + "_" + px + "_" + videoID)
        },
        fail: function () {
          console.log('存储失败')
        }
      })


      wx.setStorage({
        key: 'kesub' + kcid + "_" + videoID + "_" + zcode,
        data: playTime,
        success: function () {
          console.log('kesub' + kcid + "_" + videoID + "_" + zcode + "_" + playTime)
        },
        fail: function () {
          console.log('存储失败')
        }
      })
      app.post(API_URL, "action=savePlayTime&zcode=" + zcode + "&token=" + token + "&videoid=" + videoID + "&playTime=" + playTime + "&kcid=" + kcid + "&flag=" + flag + "&playCourseArr=" + playCourseStr, false, true, "").then((res) => { })
    }
  },
  /**
         * 初始化视频信息
         */
  initfiles: function (files, px) {
    for (let i = 0; i < files.length; i++) {
      let video = files[i];
      video.show = true;
      let flag = video.Flag;

      //处理时间
      let length = Math.ceil(video.time_length);
      let m = parseInt(length / 60);
      let s = length % 60 < 10 ? '0' + length % 60 - 1 : length % 60 - 1;
      video.time = m + '分' + s + '秒';
      video.playCourseArr=[];
      //初始化已观看视频的时间数组
      if (video.playCourseArr=="") { //如果是空数组，说明是首次观看
        if (s !== "00") {
          for (let i = 0; i < m + 1; i++) {
            video.playCourseArr.push(0);
          }
        }
      }
    }
  },
  /**
   * 是否真正看完
   */
  ifEnd: function (video) {
    let end = true;
    if (video.playCourseArr){
    for (let i = 0; i < video.playCourseArr.length; i++) {
      let playCourse = video.playCourseArr[i];
      if (playCourse == 0) {
        end = false;
        break;
      }
    }
    return end;
    }else{
      end =false
    }
  },
  //滚动屏幕时菜单浮动  有延迟  不好用
  // onPageScroll: function (e) {

  //   if (e.scrollTop> this.data.meuntop){
  //      this.setData({
  //        mybar:"on"
  //      })
  //   }else{
  //     this.setData({
  //       mybar: ""
  //     })
  //   }
  // },
  //滚动屏幕时出现返回顶部  有延迟  不好用
  onPageScroll: function (e) {

    if (e.scrollTop> 400){
       this.setData({
         mybar:"on"
       })
    }else{
      this.setData({
        mybar: ""
      })
    }
  },
  /**
   * 改变产品时
   */
  scrolltop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  changeOption: function(e) {
    let self = this;
    let currentProduct = self.data.product; //当前种类
    let product = e.currentTarget.dataset.product; //点击的视频种类
    if (product == currentProduct) return; //如果没有改变就不作任何操作

    let windowWidth = self.data.windowWidth; //窗口宽度
    let moveData = undefined; //动画
    if (product == "introduction") {
      moveData = animate.moveX(easeOutAnimation, -250 * (windowWidth / 750));
    } else if (product == "option") {
      moveData = animate.moveX(easeOutAnimation, 0);
    } else {
      moveData = animate.moveX(easeOutAnimation, 250 * (windowWidth / 750));
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
      url: 'pay?danke=true&id=' + this.data.kcid + '&money_zong=' + this.data.kc_money + '&title=' + this.data.kc_name + '&keshi=' + this.data.files.length + '&teacher=' + this.data.teacher
    })
  }
  
})