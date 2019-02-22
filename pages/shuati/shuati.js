// pages/shuati/shuati.js
const app = getApp()
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bars:[
      {
        title1:"科一",
        title2:"政策法规",
        title3:"政策与法律法规"
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
    zhangjies:[
      {
        title:'旅游业发展概况',
        num:'84',
        doneNum:32,
        rightRate:35,
        jies:[
          {
            title:'旅游市场',
            num:18,
            doneNum: 32,
            rightRate: 35,
          },
          {
            title: '旅游组织',
            num: 66,
            doneNum: 12,
            rightRate: 35,
          }
        ]
      },
      {
        title: '中国历史文化',
        num: '85',
        doneNum: 52,
        rightRate: 65,
        jies: [
          {
            title: '中国',
            num: 32,
            doneNum: 22,
            rightRate: 55,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 42,
            rightRate: 82,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 32,
            rightRate: 81,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 32,
            rightRate: 82,
          },
          {
            title: '历史文化',
            num: 67,
            doneNum: 32,
            rightRate: 85,
          }
        ]
      },
    ],
    monis:[
      {
        free:1,
        title:'2018导游考试模拟试卷(科目1、2) (一)',
        num:165,
        time:90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (二)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (三)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (四)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (五)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (六)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (七)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (八)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (九)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (十)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (十)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (十)',
        num: 165,
        time: 90
      },
      {
        free: 0,
        title: '2018导游考试模拟试卷(科目1、2) (十)',
        num: 165,
        time: 90
      }
    ],
    midHeight:430,//中间条的高度
    lastScrollTop:0,//上次滚动条的位置
    opacity:1//banner透明度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let currentIndex = wx.getStorageSync('currentIndex') ? wx.getStorageSync('currentIndex'):0;//如果有本地缓存就用本地缓存,没有就设置默认0
    let currentMidIndex = wx.getStorageSync('currentMidIndex') ? wx.getStorageSync('currentMidIndex') : 0;//当前试题种类(如果有本地缓存就用本地缓存,没有就设置默认0)
    this.setData({
      currentIndex:currentIndex,
      currentMidIndex: currentMidIndex 
    })

    // 获取banner图,此请求适合放在onLoad周期函数中
    app.post(API_URL,"action=getTestAD",false,false,"","").then(res=>{
      console.log(res.data.data)
      let banners = res.data.data;
      self.setData({
        banners: banners
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this;

    this.goAnswerModel = this.selectComponent("#goAnswerModel");
    this.jiesuoti = this.selectComponent("#jiesuoti");

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        //最上面标题栏不同机型的高度不一样(单位PX)
        let statusBarHeight = res.statusBarHeight * (750 / windowWidth);
        let jiaonang = wx.getMenuButtonBoundingClientRect();//胶囊位置及尺寸

        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          statusBarHeight: statusBarHeight,
          jiaonang:jiaonang
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self =  this;

  },

  /**
   * 改变科目
   */
  changeBar:function(e){
    console.log(e)
    let self = this;
    let currentIndex = e.currentTarget.dataset.index;
    self.setData({
      currentIndex:currentIndex
    })

    wx.setStorage({//设置本地缓存
      key: 'currentIndex',
      data: currentIndex,
      fail:function(){
        wx.showToast({
          title: '设置currentIndex失败',
          icon:'none',
          duration:3000
        })
      }
    })
  },

  /**
   * 改变试题类型
   */
  changeMidBar:function(e){
    let currentMidIndex = e.currentTarget.dataset.index;
    this.setData({
      currentMidIndex:currentMidIndex
    })

    wx.setStorage({//设置本地缓存
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
  },

  /**
   * 切换试题折叠状态
   */
  toogleFolder:function(e){
    let zhangIdx = e.currentTarget.dataset.index;//点击的题的id
    let zhangjies = this.data.zhangjies;//当前所有题
    zhangjies[zhangIdx].unfolding = zhangjies[zhangIdx].unfolding ? false : true
    this.setData({
      zhangjies: zhangjies
    })
  },

  /**
   * 答题弹窗提示
   */
  showAnswerModel:function(e){
    let num = e.currentTarget.dataset.num;//总题数
    let donenum = e.currentTarget.dataset.donenum;//已答数目
    let rightrate = e.currentTarget.dataset.rightrate;//正确率
    let title = e.currentTarget.dataset.title;//点击的标题

    this.goAnswerModel.setData({
      num:num,
      donenum:donenum,
      rightrate:rightrate,
      title:title
    })

    this.goAnswerModel.showDialog();
  },

  /**
   * 导航到做题页面
   */
  _GOzuoti:function(e){
    let currentSelectIndex = e.detail.currentSelectIndex;//选择做题的题型
    let title = "";
    let selected = e.detail.selected;//已做题还是未做题
    let currentMidIndex = this.data.currentMidIndex;//当前试卷类型(章节练习、全镇模拟、核心密卷)

    switch (currentMidIndex){//根据index得到标题字符串
      case 0:
      title= "章节练习";
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
  _buyAll:function(){
    this.jiesuoti.hideDialog();
    wx.showToast({
      icon:'none',
      title: '购买开发中',
      duration:3000
    })
  },

  /**
   * 导航到笔记页面
   */
  GOnote:function(){
    wx.navigateTo({
      url: '/pages/shuati/mynote/mynote',
    })
  },

  /**
   * 导航到错题按钮
   */
  GOcuoti:function(){
    wx.navigateTo({
      url: '/pages/shuati/cuoti/cuoti',
    })
  },

  /**
   * 导航到模拟
   */
  GOmoni:function(e){
    let free = e.currentTarget.dataset.free;
    let title = e.currentTarget.dataset.title;
    if(free == 1){//免费
      wx.navigateTo({
        url: '/pages/shuati/moni/moni?title='+title,
      })
    }else{//不免费
      this.jiesuoti.showDialog();
    }
  },

  /**
   * 监测滚动条滚动
   */
  onPageScroll: function (e) {
    let windowWidth = this.data.windowWidth;
    let scrollTop = e.scrollTop * (750 / windowWidth);
    let lastScrollTop = this.data.lastScrollTop;//上一次滑动的高度
    let opacity = this.data.opacity;//当前页面透明度
    let unit = 1/100;

    if (scrollTop >150){//滑动超过200时开始透明变色
      opacity = 1 - (scrollTop-150) * unit;
    } else{
      opacity = 1;
    }

    
    let subHeight = (lastScrollTop - scrollTop)*1.5;//高度差
    let midHeight = this.data.midHeight + subHeight;
    let midHeight2 = midHeight < 0 ? 0 : midHeight;//中间组件的高度
    let fixed = scrollTop > 340 ? "fixed":"";
    
    this.setData({
      midHeight: midHeight,
      midHeight2: midHeight2,
      lastScrollTop: scrollTop,
      fixed: fixed,
      opacity: opacity
    })
  }
})