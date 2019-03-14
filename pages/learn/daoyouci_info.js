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
    pl: [],
    text: "",
    infos: "hide",
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
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
  infos: function() {
    let self = this;
    if (this.data.infos == "hide") {
      this.setData({
        infos: "show"
      })
    } else {
      this.setData({
        infos: "hide"
      })
      wx.pageScrollTo({
        scrollTop: 0
      })
    }

    //获取高度内容高度
    var query = wx.createSelectorQuery();
    query.select('#content').boundingClientRect(function (rect) {
      self.setData({
        contentHeight: rect.height//单位px
      })
    }).exec();


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;

        windowHeight = (windowHeight * (750 / windowWidth));

        self.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth
        })
      }
    });

    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
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
    let pl = self.data.pl;

    if (self.data.text == ''){
      wx.showToast({
        title: '评论内容不能为空',
      })
      return;
    }

    let user = wx.getStorageSync('user');
    if (user) {
      let content = self.data.text;
      // 本地先更新
      let obj = {};
      obj.hf = "";
      obj.nickname = user.Nickname;
      obj.pc_content = content;
      obj.pl_time = "刚刚";
      obj.userimg = user.Pic;

      pl.unshift(obj);

      self.setData({
        pl: pl,
        text: '',
        value: '',
        toView: self.data.fixed?'blank':'pl0'
      })

      console.log(pl)

      let zcode = user.zcode;
      let token = user.token;
      let kcid = self.data.id;


      app.post(API_URL, "action=saveCoursePL&token=" + token + "&zcode=" + zcode + "&cid=" + kcid + "&plcontent=" + content + "&page=1", false, false, "", "", "", self).then(res => {
        console.log('保存评论成功')
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  /**
   * 获取评论信息
   */
  getPL: function() {
    let self = this;
    let kcid = this.data.id;
    let pl = this.data.pl;

    //获取评论列表
    let page_all = this.data.page_all ? this.data.page_all : 1000; //如果有page_all说明已经请求过,如果没有,说明第一次，默认为1000
    let page_now = this.data.page_now ? this.data.page_now : 0; //当前页默认为0

    self.setData({
      loadingMore: true
    })

    app.post(API_URL, "action=getCoursePL&cid=" + kcid + "&page=" + page_now + 1, false, false, "", "").then((res) => {
      console.log(res)
      var page_all = res.data.data[0].page_all;
      var page_now = res.data.data[0].page_now;
      let newpl = res.data.data[0].pllist;
      page_now = page_all == 0 ? 0 : page_now; //如果当前页总数为0,那么就把当前页设为0

      pl = pl.concat(newpl); //连接数组

      let info = "";

      if (!self.data.plfirst) { //如果第一次载入
        self.setData({
          page_all: page_all,
          page_now: page_now,
          loadingMore: false,
          plfirst: true,
          pl: pl,
        })
        //获取高度内容高度
        var query = wx.createSelectorQuery();
        query.select('#content').boundingClientRect(function (rect) {
          self.setData({
            contentHeight:rect.height//单位px
          })
        }).exec();

        if (page_now == page_all) { //说明已经最后一页
          self.setData({
            plAllDone: true,
            loadingText: "别扯了,我是有底线的..."
          })
        }
      } else { //如果第N次载入
        self.setData({
          showLoadingGif: false,
          loadingText: "载入完成"
        })

        setTimeout(function() {
          self.setData({
            page_all: page_all,
            page_now: page_now,
            loadingMore: false,
            pl: pl,
            loadingText: ""
          })

          if (page_now == page_all) { //说明已经最后一页
            self.setData({
              plAllDone: true,
              loadingText: "别扯了,我是有底线的..."
            })
          }
        }, 200)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    myaudio.destroy()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 如何自己写导游词
   */
  writeSelf: function() {
    wx.navigateTo({
      url: '/pages/index/catalogDetail/catalogDetail?id=10016&title=如何自己写导游词',
    })
  },

  /**
   * 滚动事件
   */
  scroll:function(e){
    let scroll = e.detail.scrollTop;
    let contentHeight = this.data.contentHeight;

    if(scroll >= contentHeight){
      this.setData({
        fixed:true,
        showBlank:true
      })
    }else{
      this.setData({
        fixed:false,
        showBlank: false
      })
    }
  },

  /**
   * 滚动条滑动到底
   */
  scrolltolower: function() {
    let self = this;
    let loadingMore = self.data.loadingMore;

    if (loadingMore || self.data.plAllDone || self.data.page_all == 0) return; //如果还在载入中或者都载入完成或者没有评论,就不继续执行

    let product = this.data.product;

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多资讯 ..."
    })
    self.getPL();

  },

})