// pages/learn/learn.js
const app = getApp()
var API_URL = "https://xcx2.chinaplat.com/daoyou/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: "0",
    barUrls: [],
    videoList: "",
    loaded: false,
    page: "0",
    diqus: [
      ['安徽', '北京', '重庆', '福建'],
      ['河南', '河北', '湖北', '湖南', '海南', '黑龙江'],
      ['青海', '山东', '陕西', '四川', '山西', '上海', '深圳'],
      ['广东', '甘肃', '广西', '贵州'],
      ['江西', '辽宁', '江苏', '吉林', '宁夏', '内蒙古'],
      ['浙江', ' 天津', '新疆', '云南', '西藏']
    ],
    diqu: "北京",
    daoyouci: false,
    opacity: 1, //banner透明度
    loadedList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    let user = wx.getStorageSync('user');
    let zcode = user.zcode ? user.zcode : '';
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        //最上面标题栏不同机型的高度不一样(单位PX)
        let statusBarHeight = res.statusBarHeight * (750 / windowWidth);
        let jiaonang = wx.getMenuButtonBoundingClientRect(); //胶囊位置及尺寸

        let fixedTop = (jiaonang.top + jiaonang.height) * (750 / windowWidth); //定位高度 单位rpx

        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          statusBarHeight: statusBarHeight,
          jiaonang: jiaonang,
          fixedTop: fixedTop
        })
      }
    });
    //获取顶部图
    app.post(API_URL, "action=getCourseAD", false, false, "", "", "", self).then(res => {
      let barUrls = res.data.data[0].pic.split(",");
      self.setData({
        barUrls: barUrls
      });
      if (self.data.barUrls.length > 1) {
        self.bindPhoneModel = self.selectComponent("#bindPhoneModel");
      }
    });

    wx.getStorage({
      key: 'lastkesub' + zcode,
      success: function(res) {
        console.log(res)
        let lastKe = res.data.options;
        if (self.data.types != "导游词") {
          self.setData({
            types: lastKe.index,
          })
          self.getCourse(lastKe.index)
        } else {
          self.setData({
            daoyouci: true,
            loaded: true,
          })
        }

      },
      fail: function(res) {
        if (self.data.types != "导游词") {
          self.getCourse('0')
        } else {
          self.setData({
            daoyouci: true,
            loaded: true,
          })
        }
      }
    })

  },
  //获取课程列表
  getCourse: function(index) {
    let self = this;
    let loadedList = self.data.loadedList; //已载入列表数组

    console.log(loadedList)
    if (loadedList[index]) { //说明已经载入过
      this.setData({ //先设置还没有载入
        loaded: false
      });
      self.setData({
        videoList: loadedList[index],
        loaded: true,
        daoyouci: false,
      });
    } else { //如果没有载入过
      this.setData({
        loaded: false,
        daoyouci: false,
      });

      let types = "";
      switch (index) {
        case "0":
          types = '笔试';
          break;
        case "1":
          types = '面试';
          break;
        case "2":
          types = '导考套餐';
          break;
      }

      console.log("action=getCourseList&types=" + types)
      app.post(API_URL, "action=getCourseList&types=" + types, false, false, "", "", "", self).then(res => {
        let newcourse = res.data.data[0].list;
        loadedList[index] = newcourse;
        self.setData({
          videoList: newcourse,
          loaded: true,
          loadedList: loadedList
        });
      });
    }

  },
  watch: function(e) {
    var kc_id = e.currentTarget.dataset.kc_id;
    var renshu = e.currentTarget.dataset.renshu;
    let index = e.currentTarget.dataset.index;
    let types = this.data.types;
    let title = e.currentTarget.dataset.title;

    wx.navigateTo({
      url: 'play?kc_id=' + kc_id + '&renshu=' + renshu + '&types=' + types + "&index=" + index + '&title=' + title,
    })
  },
  //切换菜单
  getList: function(e) {
    var val = e.currentTarget.dataset.val;

    if (this.data.types != val) {
      this.setData({
        types: val,
        daoyouci: false
      })
      this.getCourse(val)
    }
  },
  //导游词菜单
  getList2: function(e) {
    var val = e.currentTarget.dataset.val;
    if (this.data.types != val) {
      this.setData({
        types: val,
        daoyouci: true
      })
    }
  },
  //点击导游词
  diqu: function(e) {
    var val = e.currentTarget.dataset.diqu;
    wx.navigateTo({
      url: 'daoyouci_list?val=' + val,
    })
  },

  //页面滚动
  onPageScroll: function(e) {
    let self = this;
    let windowWidth = this.data.windowWidth;
    let scrollTop = e.scrollTop * (750 / windowWidth);
    let fixedTop = this.data.fixedTop;
    let opacity = this.data.opacity; //当前页面透明度
    let jiaonang = this.data.jiaonang; //胶囊高度
    let showBlock = null; //是否显示空白框
    let unit = 1 / 290;

    if (scrollTop > 10) { //滑动超过200时开始透明变色
      opacity = 1 - (scrollTop - 10) * unit;
    } else {
      opacity = 1;
    }

    if (scrollTop > 300 - fixedTop) {
      console.log('jjd')
      self.setData({
        fixed: "fixed",
        opacity: opacity,
        showBlock: true,
      })
    } else {
      self.setData({
        fixed: "",
        opacity: opacity,
        showBlock: false
      })
    }
  }
})