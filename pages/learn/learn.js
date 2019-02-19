// pages/learn/learn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:"0",
    barUrls: [//轮播图
      "/images/course/201902181101.jpg",
      "/images/course/201902181101.jpg"
    ],
    videoList: [{ "kc_id": "141962", "title": "房地产经纪人 交易制度政策", "img": "http://www.chinaplat.com/CourseImg/IMG-20180901/20180901145335073507.png", "viewNums": "2147", "videoNums": "12", "jindu": "0.00" }, { "kc_id": "142022", "title": "房地产经纪人 业务操作", "img": "http://www.chinaplat.com/CourseImg/IMG-20180901/20180901145337253725.png", "viewNums": "1123", "videoNums": "13", "jindu": "0.00" }, { "kc_id": "142023", "title": "房地产经纪人 职业导论", "img": "http://www.chinaplat.com/CourseImg/IMG-20180901/20180901145372207220.png", "viewNums": "1168", "videoNums": "11", "jindu": "0.00" }, { "kc_id": "142024", "title": "房地产经纪人 专业基础", "img": "http://www.chinaplat.com/CourseImg/IMG-20180901/20180901145382608260.png", "viewNums": "2467", "videoNums": "18", "jindu": "0.00" }],
    loaded:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this;

    this.bindPhoneModel = this.selectComponent("#bindPhoneModel");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 当滚动页面时
   */
  onPageScroll: function (e) {
    let windowWidth = this.data.windowWidth;
    console.log(e.scrollTop * (750 / windowWidth))
    if (e.scrollTop * (750 / windowWidth) > 440) {
      this.setData({
        className: true
      })
    } else {
      this.setData({
        className: false
      })
    }
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

    // let self = this;
    // let loadingMore = self.data.loadingMore;
    // if (loadingMore) return; //如果还在载入中,就不继续执行

    // let types = self.data.types;
    // let index = self.data.index;

    // let page_all = "";
    // let page = "";
    // let typesid = "";

    // if (index == -1) {//如果是最新活动
    //   page = self.data.page;
    //   page_all = self.data.page_all;
    // } else {//其他分类
    //   typesid = types[index].id;
    //   page_all = types[index].page_all;
    //   page = types[index].page;
    // }

    // if (page >= page_all) {
    //   self.setData({ //正在载入
    //     loadingText: "----------------别扯了，我是有底线的----------------"
    //   })
    //   return;
    // }

    // self.setData({ //正在载入
    //   showLoadingGif: true,
    //   loadingText: "载入更多活动..."
    // })

    // //用户信息
    // let user = wx.getStorageSync('user');
    // let loginrandom = user.Login_random;
    // let zcode = user.zcode;

    // let course = self.data.course;
    // page++;

    // app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=" + page + "&typesid=" + typesid, false, false, "", "", "", self).then(res => {
    //   let newcourse = res.data.data[0].list;
    //   self.initcourse(newcourse);//初始化活动信息

    //   course = course.concat(newcourse);

    //   wx.setStorageSync('type' + zcode, course);//本地缓存
    //   self.setData({
    //     showLoadingGif: false,
    //     loadingText: "载入完成"
    //   })

    //   setTimeout(function () {
    //     self.setData({
    //       loadingMore: false,
    //       course: course,
    //       loadingText: ""
    //     })
    //   }, 200)

    //   if (index == -1) {
    //     self.setData({
    //       page: page
    //     })
    //   } else {
    //     types[index].page = page;
    //     self.setData({
    //       types: types
    //     })
    //   }
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})