// pages/index/navaigation/navigation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos:[
      {
        title:'2018导游考试大纲公布',
        content:'2018导游考试大纲公布2018导游考试大纲公布'
      },
      {
        title: '2018导游考试大纲公布',
        content: '2018导游考试大纲公布2018导游考试大纲公布'
      },
      {
        title: '2018导游考试大纲公布',
        content: '2018导游考试大纲公布2018导游考试大纲公布2018导游考试大纲公布2018导游考试大纲公布2018导游考试大纲公布2018导游考试大纲公布2018导游考试大纲公布2018导游考试大纲公布'
      },
      {
        title: '2018导游考试大纲公布',
        content: '2018导游考试大纲公布2018导游考试大纲公布'
      },
      {
        title: '2018导游考试大纲公布',
        content: '2018导游考试大纲公布2018导游考试大纲公布'
      },
      {
        title: '2018导游考试大纲公布',
        content: '2018导游考试大纲公布2018导游考试大纲公布'
      }
    ],
    icons:[
      "/images/icon1.png",
      "/images/icon2.png",
      "/images/icon3.png",
      "/images/icon4.png",
      "/images/icon5.png",
      "/images/icon6.png"
    ],
    catalogs1: [//首页目录名称1
      "实时考讯",
      "考试大纲",
      "报名审核",
      "疑难解答"
    ],
    catalogs2: [//首页目录名称2
      "笔试指南",
      "面试指南",
      "成绩领证",
      "学习计划"
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
  onLoad: function (options) {
    let currentIndex = options.index;//当前页面标识

    this.setData({
      currentIndex: currentIndex
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this;

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 改变目录
   */
  changeCatalog:function(e){
    let currentIndex = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: currentIndex
    })
  },

  /**
   * 返回上一页面
   */
  back:function(){
    wx.navigateBack({});
  }
})