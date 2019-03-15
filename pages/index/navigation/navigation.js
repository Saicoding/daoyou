// pages/index/navaigation/navigation.js
const app = getApp()
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icons: [
      "/images/icon1.png",
      "/images/icon2.png",
      "/images/icon3.png",
      "/images/icon4.png",
      "/images/icon5.png",
      "/images/icon6.png"
    ],
    catalogs1: [ //首页目录名称1
      {
        name: "实时考讯",
        id: '10004'
      },
      {
        name: "考试大纲",
        id: '10005'
      },
      {
        name: "报名审核",
        id: '10001'
      },
      {
        name: "疑难解答",
        id: '10006'
      }
    ],
    catalogs2: [ //首页目录名称2
      {
        name: "笔试指南",
        id: '10000'
      },
      {
        name: "面试指南",
        id: '10002'
      },
      {
        name: "成绩领证",
        id: '10003'
      },
      {
        name: "学习计划",
        id: '0'
      }
    ],
    cataLogIcons: [
      "/images/index/item1.png",
      "/images/index/item2.png",
      "/images/index/item3.png",
      "/images/index/item4.png",
      "/images/index/item5.png",
      "/images/index/item6.png",
      "/images/index/item7.png",
      "/images/index/item8.png"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let currentIndex = parseInt(options.index); //当前栏目标识(字符串转成数字)

    this.setTitleDescribe(currentIndex);

    this.setData({
      first:true,//设置首次载入参数
      currentIndex: currentIndex//当前栏目index
    })
  },

  /**
   * 根据当前currentIndex得到栏目标题和描述
   */
  setTitleDescribe: function(currentIndex) {
    let self = this;
    switch (currentIndex) {
      case 0:
        self.setData({
          title: "实时考讯",
          describe: '导游要想考得好，关注时讯少不了。'
        })
        break;
      case 1:
        self.setData({
          title: "考试大纲",
          describe: '重中之重！一定要看！'
        })
        break;
      case 2:
        self.setData({
          title: "报名审核",
          describe: '一个好的开始，就是成功的一半。'
        })
        break;
      case 3:
        self.setData({
          title: "疑难解答",
          describe: '快来看看这里有没有你遇到的问题吧！'
        })
        break;
      case 4:
        self.setData({
          title: "笔试指南",
          describe: '导游考试中最重要的一个环节。'
        })
        break;
      case 5:
        self.setData({
          title: "面试指南",
          describe: '面试不只时背导游词那么简单哦！'
        })
        break;
      case 6:
        self.setData({
          title: "成绩领证",
          describe: '祝你拿高分，祝你领证书，么么哒！'
        })
        break;
      default:
        wx.showToast({
          duration:3000,
          icon:'none',
          title: '出错',
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        //最上面标题栏不同机型的高度不一样(单位PX)
        let statusBarHeight = res.statusBarHeight * (750 / windowWidth);

        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          statusBarHeight: statusBarHeight
        })
      }
    });
  },

  /**
   *  根据当前currentIndex得到流程分类ID号
   */
  getTid: function (currentIndex){
    let self = this;
    let tid = null; //流程分类ID号
    if (currentIndex <= 3) { //第一组栏目
      tid = self.data.catalogs1[currentIndex].id;
    } else if (currentIndex > 3 && currentIndex <= 6) { //第二组栏目
      tid = self.data.catalogs2[currentIndex-4].id;
    }
    return tid;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    let currentIndex = self.data.currentIndex; //当前点击的id
    let tid = self.getTid(currentIndex)//流程分类ID号
    let first = self.data.first//首次载入

    if(first){//只执行一次
      self.setData({
        isLoaded:false
      })
      app.post(API_URL, "action=getLcList&tid=" + tid, false, false, "").then(res => {
        let infos = res.data.data;
        self.setData({
          infos: infos,//列表信息
          first:false,//设置首次载入已被污染
          isLoaded:true//设置已经载入完毕
        })
      })
    }
  },

  /**
   * 改变目录
   */
  changeCatalog: function(e) {
    let self =  this;
    let currentIndex = e.currentTarget.dataset.index;
    
    if (currentIndex <=6){//点击除学习计划外的栏目
      let tid = self.getTid(currentIndex)//流程分类ID号
      self.setTitleDescribe(currentIndex);
      self.setData({
        isLoaded: false
      })
      app.post(API_URL, "action=getLcList&tid=" + tid, false, false, "").then(res => {
        let infos = res.data.data;
      
        self.setData({
          infos: infos,
          isLoaded:true
        })
      })
    } else if(currentIndex == 7){//点击了学习计划
      wx.navigateTo({
        url: '/pages/index/xuexijihua/xuexijihua',
      })
    }

    if (currentIndex !=7){
      this.setData({
        currentIndex: currentIndex
      })
    }
  },

  /**
   * 返回上一页面
   */
  back: function() {
    wx.navigateBack({});
  },

  /**
   * 导航到详情页
   */
  GOdetail:function(e){
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;

    wx.navigateTo({
      url: '/pages/index/catalogDetail/catalogDetail?id='+id+"&title="+title,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})