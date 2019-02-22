// pages/shuati/shuati.js
const app = getApp()
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bars: [{
        title1: "科一",
        title2: "政策法规",
        title3: "政策与法律法规"
      },
      {
        title1: "科二",
        title2: "导游业务",
        title3: "导游业务"
      },
      {
        title1: "科三",
        title2: "全国导基",
        title3: "全国导基"
      },
      {
        title1: "科四",
        title2: "地方导基",
        title3: "地方导基"
      },
      {
        title1: "面试",
        title2: "面试",
        title3: "面试"
      },
    ],

    midHeight: 430, //中间条的高度
    lastScrollTop: 0, //上次滚动条的位置
    opacity: 1, //banner透明度
    showTiBlock: true, //题的占位框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    let currentIndex = wx.getStorageSync('currentIndex') ? wx.getStorageSync('currentIndex') : 0; //如果有本地缓存就用本地缓存,没有就设置默认0
    let currentMidIndex = wx.getStorageSync('currentMidIndex') ? wx.getStorageSync('currentMidIndex') : 0; //当前试题种类(如果有本地缓存就用本地缓存,没有就设置默认0)
    this.setData({
      currentIndex: currentIndex,
      currentMidIndex: currentMidIndex,
    })

    // 获取banner图,此请求适合放在onLoad周期函数中
    app.post(API_URL, "action=getTestAD", false, false, "", "").then(res => {
      let banners = res.data.data;
      self.setData({
        banners: banners
      })
    })

    let types = self.getkemuIDByindex(currentIndex); //科目id

    let tiku = {}; //声明所有题库，用于存储所有已载入题

    self.setData({ //默认没有载入完毕
      isLoaded: false
    })

    let zhangjieLoadedStrArray = []; //已载入的科目id和题型标识数组，用于控制如果已经载入一次就不再重新载入

    let zhangjieLoadedStr = '' + currentIndex + currentMidIndex;

    zhangjieLoadedStrArray.push(zhangjieLoadedStr);

    // 获取章节列表
    if (currentMidIndex == 0) { //默认目录是章节列表时才去请求

      app.post(API_URL, "action=getKeMuTestType&types=" + types, false, false, "", "").then(res => {
        let zhangjies = res.data.data;

        self.initZhangjie(zhangjies); //初始化章节信息

        tiku[zhangjieLoadedStr] = zhangjies;

        self.setData({
          zhangjies: zhangjies,
          tiku: tiku,
          zhangjieLoadedStrArray: zhangjieLoadedStrArray,
          isLoaded: true
        })
      })
    } else { //模拟 & 核心
      let keys = currentMidIndex == 1 ? 0 : 1

      app.post(API_URL, "action=getShijuanList&types=" + types + "&keys=" + keys, false, false, "", "").then(res => {
        let zhangjies = res.data.data;

        tiku[zhangjieLoadedStr] = zhangjies;

        self.setData({
          tiku: tiku,
          zhangjieLoadedStrArray: zhangjieLoadedStrArray,
          isLoaded: true,
          zhangjies: zhangjies
        })
      })
    }
  },

  /**
   * 初始化章节信息
   */
  initZhangjie: function(zhangjies) {
    let user = wx.getStorageSync('user');
    let zcode = user.zcode == undefined ? '' : user.zcode; //本地缓存标识,如果登陆就是唯一，如果是游客就公用本地缓存

    for (let i = 0; i < zhangjies.length; i++) { //遍历所有数组
      let zhangjie = zhangjies[i];
      zhangjie.donenum = 0; //默认章已做题目为0
      zhangjie.rightNum = 0;

      for (let j = 0; j < zhangjie.list.length; j++) {
        let jie = zhangjie.list[j];
        let doneArray = wx.getStorageSync('doneArray' + jie.id + zcode); //寻找本地节的缓存

        if (doneArray) { //如果有本地缓存,就计算已做数组的长度
          jie.donenum = doneArray.length;
          zhangjie.donenum += doneArray.length;

          let rightNum = 0;
          // 计算正确率
          for (let k = 0; k < doneArray.length; k++) {
            let done = doneArray[k];
            if (done.flag == 1) { //正确
              rightNum++;
              zhangjie.rightNum++;
            }
            jie.rightrate = ((rightNum / doneArray.length) * 100).toFixed(2);
          }
        } else {
          jie.donenum = 0;
          jie.rightrate = 0;
        }
      }
      zhangjie.rightrate = zhangjie.donenum == 0 ? 0 : ((zhangjie.rightNum / zhangjie.donenum) * 100).toFixed(2);
    }

  },

  /**
   * 根据currentIndex得到科目ID(页面最上面的bar)
   */
  getkemuIDByindex: function(currentIndex) {
    let id = null;
    switch (currentIndex) {
      case 0: //法律法规
        id = 239;
        break;
      case 1: //导游业务
        id = 240;
        break;
      case 2: //全国导基
        id = 241;
        break;
      case 3: //地方导基
        id = 242;
        break;
      case 4: //面试
        id = 255;
        break;
    }
    return id;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;

    this.goAnswerModel = this.selectComponent("#goAnswerModel");
    this.jiesuoti = this.selectComponent("#jiesuoti");
    this.ti = wx.createSelectorQuery(); //题组件dom对象

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        //最上面标题栏不同机型的高度不一样(单位PX)
        let statusBarHeight = res.statusBarHeight * (750 / windowWidth);
        let jiaonang = wx.getMenuButtonBoundingClientRect(); //胶囊位置及尺寸

        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          statusBarHeight: statusBarHeight,
          jiaonang: jiaonang
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 改变科目
   */
  changeBar: function(e) {
    let self = this;
    let type = e.currentTarget.dataset.type;
    let currentIndex = null;
    let currentMidIndex  = null;

    if(type == 1){//点击科目
      currentIndex = e.currentTarget.dataset.index; //点击的科目id
      currentMidIndex = self.data.currentMidIndex; //当前题型index
      self.setData({
        currentIndex: currentIndex
      })
      wx.setStorage({ //设置本地缓存
        key: 'currentIndex',
        data: currentIndex,
        fail: function () {
          wx.showToast({
            title: '设置currentIndex失败',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }else{//点击题型
      currentIndex = self.data.currentIndex;//点击的科目id
      currentMidIndex = e.currentTarget.dataset.index;//当前题型index
      self.setData({
        currentMidIndex: currentMidIndex
      })

      wx.setStorage({ //设置本地缓存
        key: 'currentMidIndex',
        data: currentMidIndex,
        fail: function () {
          wx.showToast({
            title: '设置currentMidIndex失败',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }

    let currentLoadedStr = "" + currentIndex + currentMidIndex;
    let zhangjieLoadedStrArray = self.data.zhangjieLoadedStrArray; //已载入的科目id和题型标识数组，用于控制如果已经载入一次就不再重新载入
    let tiku = this.data.tiku;

    if (zhangjieLoadedStrArray.indexOf(currentLoadedStr) != -1) { //如果包含,就使用本地tiku数组
      this.setData({
        zhangjies: tiku[currentLoadedStr]
      })
    } else {
      let types = self.getkemuIDByindex(currentIndex); //科目id
      let zhangjieLoadedStrArray = self.data.zhangjieLoadedStrArray;//本地所有已载入标识数组

      self.setData({
        isLoaded:false
      })

      // 获取章节列表
      if (currentMidIndex == 0) { //默认目录是章节列表时才去请求

        app.post(API_URL, "action=getKeMuTestType&types=" + types, false, false, "", "").then(res => {
          let zhangjies = res.data.data;

          self.initZhangjie(zhangjies); //初始化章节信息

          tiku[currentLoadedStr] = zhangjies;
          zhangjieLoadedStrArray.push(currentLoadedStr);

          self.setData({
            zhangjies: zhangjies,
            tiku: tiku,
            zhangjieLoadedStrArray: zhangjieLoadedStrArray,
            isLoaded: true
          })
        })
      } else { //模拟 & 核心
        let keys = currentMidIndex == 1 ? 0 : 1

        app.post(API_URL, "action=getShijuanList&types=" + types + "&keys=" + keys, false, false, "", "").then(res => {
          let zhangjies = res.data.data;

          tiku[currentLoadedStr] = zhangjies;
          zhangjieLoadedStrArray.push(currentLoadedStr);

          self.setData({
            tiku: tiku,
            zhangjieLoadedStrArray: zhangjieLoadedStrArray,
            isLoaded: true,
            zhangjies: zhangjies
          })
        })
      }
    }
  },

  /**
   * 切换试题折叠状态
   */
  toogleFolder: function(e) {
    let zhangIdx = e.currentTarget.dataset.index; //点击的题的id
    let zhangjies = this.data.zhangjies; //当前所有题
    zhangjies[zhangIdx].unfolding = zhangjies[zhangIdx].unfolding ? false : true
    this.setData({
      zhangjies: zhangjies
    })
  },

  /**
   * 答题弹窗提示
   */
  showAnswerModel: function(e) {
    let num = e.currentTarget.dataset.num; //总题数
    let donenum = e.currentTarget.dataset.donenum; //已答数目
    let rightrate = e.currentTarget.dataset.rightrate; //正确率
    let title = e.currentTarget.dataset.title; //点击的标题

    this.goAnswerModel.setData({
      num: num,
      donenum: donenum,
      rightrate: rightrate,
      title: title
    })

    this.goAnswerModel.showDialog();
  },

  /**
   * 导航到做题页面
   */
  _GOzuoti: function(e) {
    let currentSelectIndex = e.detail.currentSelectIndex; //选择做题的题型
    let title = "";
    let selected = e.detail.selected; //已做题还是未做题
    let currentMidIndex = this.data.currentMidIndex; //当前试卷类型(章节练习、全镇模拟、核心密卷)

    switch (currentMidIndex) { //根据index得到标题字符串
      case 0:
        title = "章节练习";
        break;
      case 1:
        title = "全真模拟";
        break;
      case 2:
        title = "核心密卷";
        break;
    }

    wx.navigateTo({
      url: '/pages/shuati/zuoti/zuoti?currentSelectIndex=' + currentSelectIndex + "&selected=" + selected + "&title=" + title,
    })
  },

  /**
   * 导航到购买页面
   */
  _buyAll: function() {
    this.jiesuoti.hideDialog();
    wx.showToast({
      icon: 'none',
      title: '购买开发中',
      duration: 3000
    })
  },

  /**
   * 导航到笔记页面
   */
  GOnote: function() {
    wx.navigateTo({
      url: '/pages/shuati/mynote/mynote',
    })
  },

  /**
   * 导航到错题按钮
   */
  GOcuoti: function() {
    wx.navigateTo({
      url: '/pages/shuati/cuoti/cuoti',
    })
  },

  /**
   * 导航到模拟
   */
  GOmoni: function(e) {
    let free = e.currentTarget.dataset.free;
    let title = e.currentTarget.dataset.title;
    if (free == '1') { //免费
      wx.navigateTo({
        url: '/pages/shuati/moni/moni?title=' + title,
      })
    } else { //不免费
      this.jiesuoti.showDialog();
    }
  },

  /**
   * 监测滚动条滚动
   */
  onPageScroll: function(e) {
    let self = this;
    this.ti.select('.container').boundingClientRect()
    let windowWidth = this.data.windowWidth;
    let windowHeight = this.data.windowHeight;
    let scrollTop = e.scrollTop * (750 / windowWidth);
    let lastScrollTop = this.data.lastScrollTop; //上一次滑动的高度
    let opacity = this.data.opacity; //当前页面透明度
    let jiaonang = this.data.jiaonang; //胶囊高度
    let showBlock = null; //是否显示空白框
    let unit = 1 / 100;
    let showTiBlock = this.data.showTiBlock;



    if (scrollTop > 130) { //滑动超过200时开始透明变色
      opacity = 1 - (scrollTop - 130) * unit;
    } else {
      opacity = 1;
    }

    let subHeight = (lastScrollTop - scrollTop) * 1.5; //高度差
    let midHeight = this.data.midHeight + subHeight;

    // if (containerHeight + subHeight < windowHeight + scrollTop){
    //   midHeight = this.data.midHeight;
    // }

    let midHeight2 = midHeight < 0 ? 0 : midHeight; //中间组件的高度

    let fixed = scrollTop > 262 ? "fixed" : "";

    if (scrollTop > 262) {
      showBlock = true;
    } else {
      showBlock = false;
      showTiBlock = true;
    }
    let fixedTop = (jiaonang.top + jiaonang.height) * (750 / windowWidth); //定位高度 单位rpx

    this.setData({
      midHeight: midHeight,
      midHeight2: midHeight2,
      lastScrollTop: scrollTop,
      fixed: fixed,
      showBlock: showBlock,
      showTiBlock: showTiBlock,
      fixedTop: fixedTop,
      opacity: opacity
    })
  }
})