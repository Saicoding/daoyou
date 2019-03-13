// pages/mine/message/message.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();

let animate = require('../../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation();
let easeInAnimation = animate.easeInAnimation();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_now: 0,
    isHasShiti: true//是否有消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的消息',
    })

    let self = this;
    let user = wx.getStorageSync('user');
  
    let zcode = user.zcode;
    let token = user.token;
    let page_now = self.data.page_now;
    

    app.post(API_URL, "action=GetNotices&zcode=" + zcode + "&token=" + token + "&page=" + (page_now*1+1), true, false, "载入中", "", true, self).then((res) => {
                    
      let messages = res.data.data[0].list;
      let page_now = res.data.data[0].page_now;
      let page_all = res.data.data[0].page_all;
      //消除红点
      wx.hideTabBarRedDot({ index: 3 });
      self.setData({
        messages: messages,
        user: user,
        page_now: page_now,
        page_all: page_all//总页数
      })
    })

  },


  /**
   * 切换是否显示信息
   */
  toogleShowMessage: function (e) {
    let self = this;

    let user = wx.getStorageSync('user');
    let token = user.token;
    let zcode = user.zcode;
    let index = e.currentTarget.dataset.index;
    let messages = self.data.messages;
    let message = messages[index];
    let id = message.id;
   
    if (message.show == undefined || message.show == false) {
      message.style = "background:#f9f9f9;height:auto;";
      message.show = true;
      let flag = message.flag;

      if (flag == 0) {
        //更新服務器已讀
        app.post(API_URL, "action=ChangeNoticeFlag&zcode=" + zcode + "&token=" + token+"&id=" + id, false, true, "").then((res) => {
          if (res.data.status == 1) {
            let news_num = prePage.data.news_num*1;
            news_num--;
            prePage.setData({
              news_num: nums
            })
          }
        })
      }

    } else {
      message.show = false;
      message.flag = 1;//每次折叠后才判定为已读
      message.style = "background:white;height:100rpx;";
    }

    self.setData({
      messages: messages
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
        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
        })
      }
    });
  },

  /**
   * 滑动刷新
   */
  scrolltolower: function () {
    let self = this;
    let user = wx.getStorageSync('user');
    let token = user.token;
    let zcode = user.zcode;


    let page_all = self.data.page_all;
    let page_now = self.data.page_now;
    
    let messages = self.data.messages;

    page_now++;

    if (page_now > page_all) return;//如果大于总页数就返回
    
    app.post(API_URL, "action=GetNotices&zcode=" + zcode + "&token=" + token+"&page=" + (page_now * 1 + 1), false, false, "").then((res) => {
      let newMessages = res.data.data[0].list;

      messages.push.apply(messages, newMessages);

      self.setData({
        messages: messages,
        page_now: page_now
      })
    })
  },

  
})