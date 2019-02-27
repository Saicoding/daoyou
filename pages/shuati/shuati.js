// pages/shuati/shuati.js
const app = getApp();
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
    folder_object: [], //展开字节的对象,用于判断点击的章之前有多少个字节被展开
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
   * 
   */
  test:function(){
    this.shareSuccessModel.showDialog();
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
      zhangjie.isFolder = true; //设置展开初始值

      for (let j = 0; j < zhangjie.list.length; j++) {
        let jie = zhangjie.list[j];
        let doneArray = wx.getStorageSync('doneArray' + jie.id + '0' + zcode) ? wx.getStorageSync('doneArray' + jie.id + '0' + zcode) : [];

        if (doneArray.length != 0) { //如果有本地缓存,就计算已做数组的长度
          jie.donenum = doneArray.length;
          zhangjie.donenum += doneArray.length;
          let rightNum = 0;

          jie.rateWidth = 490 * (jie.donenum / parseInt(jie.all_num));
          // 计算正确率
          for (let k = 0; k < doneArray.length; k++) {
            let done = doneArray[k];

            if (done.isRight == 0) { //正确
              rightNum++;
              zhangjie.rightNum++;
            }

            jie.rightrate = ((rightNum / doneArray.length) * 100).toFixed(2);
          }
        } else {
          jie.donenum = 0;
          jie.rightrate = 0;
          jie.rateWidth = 0;
        }
      }

      zhangjie.rateWidth = 490 * zhangjie.donenum / parseInt(zhangjie.all_num); //绿条宽度
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
    this.shareSuccessModel = this.selectComponent("#shareSuccessModel");//测试
    this.ti = wx.createSelectorQuery(); //题组件dom对象

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
    let currentMidIndex = null;

    if (type == 1) { //点击科目
      currentIndex = e.currentTarget.dataset.index; //点击的科目id
      currentMidIndex = self.data.currentMidIndex; //当前题型index
      self.setData({
        currentIndex: currentIndex
      })
      wx.setStorage({ //设置本地缓存
        key: 'currentIndex',
        data: currentIndex,
        fail: function() {
          wx.showToast({
            title: '设置currentIndex失败',
            icon: 'none',
            duration: 3000
          })
        }
      })
    } else { //点击题型
      currentIndex = self.data.currentIndex; //点击的科目id
      currentMidIndex = e.currentTarget.dataset.index; //当前题型index
      self.setData({
        currentMidIndex: currentMidIndex
      })

      wx.setStorage({ //设置本地缓存
        key: 'currentMidIndex',
        data: currentMidIndex,
        fail: function() {
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
      let zhangjieLoadedStrArray = self.data.zhangjieLoadedStrArray; //本地所有已载入标识数组

      self.setData({
        isLoaded: false
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
    let self = this;
    let index = e.currentTarget.dataset.index; //选择章节的index
    let zhangjie = self.data.zhangjies; //取得章节对象

    let windowWidth = self.data.windowWidth;
    let num = zhangjie[index].list.length //取得有多少个章节

    //开始动画
    this.step(index, num, windowWidth, zhangjie);

    self.setData({
      zhangjies: zhangjie,
    })
  },

  /**
   * 实现展开折叠效果
   */
  step: function(index, num, windowWidth, zhangjie) {
    let self = this;
    let isFolder = zhangjie[index].isFolder; //取得现在是什么状态
    let folder_object = self.data.folder_object //取得展开章节的对象
    let jie_num = 0;

    for (let i = 0; i < folder_object.length; i++) {
      if (folder_object[i].index < index) { //如果在点击选项前面有展开字节
        jie_num += folder_object[i].num //有几个节点就加几个节点
      }
    }

    let height = 121 * num; //上下边框2px 转化为rpx

    // let scroll = (index * 80 + jie_num * (68 + 2 * 750 / windowWidth)) * (windowWidth / 750);


    if (isFolder) { //展开
      let spreadAnimation = wx.createAnimation({
        duration: 500,
        delay: 0,
        timingFunction: "ease-in"
      })

      spreadAnimation.height(height + "rpx", 0).opacity(1).step({

      })

      zhangjie[index].isFolder = false;
      zhangjie[index].height = height;
      zhangjie[index].spreadData = spreadAnimation.export()

      //添加对象到折叠数组
      folder_object.push({
        index: index,
        num: num
      })

      self.setData({
        zhangjies: zhangjie,
        // scroll: scroll,
        folder_object: folder_object
      })

    } else { //折叠
      zhangjie[index].display = true;

      self.setData({
        zhangjies: zhangjie
      })

      let foldAnimation = wx.createAnimation({
        duration: 500,
        delay: 0,
        timingFunction: "ease-out"
      })

      foldAnimation.height(0, height + "rpx").opacity(0).step(function() {})
      //把折叠对象从折叠对象数组中去除
      for (let i = 0; i < folder_object.length; i++) {
        if (folder_object[i].index == index) {
          folder_object.splice(i, 1)
        }
      }
      zhangjie[index].height = 0;
      zhangjie[index].isFolder = true;
      zhangjie[index].folderData = foldAnimation.export();

      setTimeout(function() {
        zhangjie[index].display = false;
        self.setData({
          zhangjies: zhangjie,
        })
      }, 500)

      self.setData({
        zhangjies: zhangjie,
        folder_object: folder_object
      })
    }
  },


  /**
   * 答题弹窗提示
   */
  showAnswerModel: function(e) {
    let self = this;
    let num = e.currentTarget.dataset.num; //总题数
    let donenum = e.currentTarget.dataset.donenum; //已答数目
    let rightrate = e.currentTarget.dataset.rightrate; //正确率
    let title = e.currentTarget.dataset.title; //点击的标题
    let f_id = e.currentTarget.dataset.f_id; //章节id
    let currentIndex = this.data.currentIndex;
    let modelIndex = this.goAnswerModel.data.currentIndex;
    let typesid = this.getkemuIDByindex(currentIndex);

    if (this.goAnswerModel.data.currentIndex != 0) {
      this.goAnswerModel.setData({
        num: num,
        donenum: donenum,
        rightrate: rightrate,
        title: title,
        f_id: f_id
      })

      this.goAnswerModel.showDialog();
      app.post(API_URL, "action=getTestTypeNums&typesid=" + typesid + "&f_id=" + f_id, false, false, "", "").then(res => {
        let result = res.data.data[0];
        let types = self.goAnswerModel.data.types;

        if (result.num_dan == 0) {
          modelIndex = 0;
          types[1].none = true;
        } else {
          types[1].none = false;
        }

        if (result.num_duo == 0) {
          types[2].none = true;
          modelIndex = 0;
        } else {
          types[2].none = false;
        }

        if (result.num_pan == 0) {
          types[3].none = true;
          modelIndex = 0;
        } else {
          types[3].none = false;
        }

        self.goAnswerModel.setData({
          num_dan: result.num_dan,
          num_duo: result.num_duo,
          num_pan: result.num_pan,
          types: types,
          currentIndex: modelIndex
        })

        self.goAnswerModel.setNum();
      })
    } else {
      this.goAnswerModel.setData({
        num: num,
        donenum: donenum,
        rightrate: rightrate,
        title: title,
        f_id: f_id
      })

      this.goAnswerModel.showDialog();

      app.post(API_URL, "action=getTestTypeNums&typesid=" + typesid + "&f_id=" + f_id, false, false, "", "").then(res => {
        let result = res.data.data[0];
        let types = self.goAnswerModel.data.types;

        if (result.num_dan == 0) {
          modelIndex = 0;
          types[1].none = true;
        } else {
          types[1].none = false;
        }

        if (result.num_duo == 0) {
          types[2].none = true;
          modelIndex = 0;
        } else {
          types[2].none = false;
        }

        if (result.num_pan == 0) {
          types[3].none = true;
          modelIndex = 0;
        } else {
          types[3].none = false;
        }


        self.goAnswerModel.setData({
          num_dan: result.num_dan,
          num_duo: result.num_duo,
          num_pan: result.num_pan,
          types: types,
          currentIndex: modelIndex
        })

      })
    }
  },

  /**
   * 导航到做题页面
   */
  _GOzuoti: function(e) {
    let currentSelectIndex = e.detail.currentSelectIndex; //选择做题的题型
    let currentIndex = this.data.currentIndex; //当前科目index
    let title = e.detail.title;
    let selected = e.detail.selected; //已做题还是全部试题
    let donenum = e.detail.donenum; //已做的题数
    let currentMidIndex = this.data.currentMidIndex; //当前试卷类型(章节练习、全镇模拟、核心密卷)
    let types = this.getkemuIDByindex(currentIndex); //科目ID
    let f_id = e.detail.f_id; //章节id
    let all_nums = e.detail.all_nums; //点击章节的题数
    let num_dan = e.detail.num_dan; //单选题数量
    let num_duo = e.detail.num_duo; //多选题数量
    let num_pan = e.detail.num_pan; //判断题数量

    wx.navigateTo({
      url: '/pages/shuati/zuoti/zuoti?leibie=' + currentSelectIndex + "&selected=" + selected + "&title=" + title + "&f_id=" + f_id + "&types=" + types + "&all_nums=" + all_nums + "&donenum=" + donenum + "&num_dan=" + num_dan + "&num_duo=" + num_duo + "&num_pan=" + num_pan,
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
   * 导航到收藏
   */
  GOmark:function(e){
    let index = e.currentTarget.dataset.index;
    let types = this.getkemuIDByindex(index); //科目id
    wx.navigateTo({
      url: '/pages/shuati/mark/mark?types=' + types,
    })
  },

  /**
   * 导航到随机练习
   */
  GORandom: function(e) {
    let index = e.currentTarget.dataset.index;
    let types = this.getkemuIDByindex(index); //科目id
    wx.navigateTo({
      url: '/pages/shuati/random/random?types=' + types,
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

    let windowWidth = this.data.windowWidth;
    let scrollTop = e.scrollTop * (750 / windowWidth);
    let opacity = this.data.opacity; //当前页面透明度
    let jiaonang = this.data.jiaonang; //胶囊高度
    let showBlock = null; //是否显示空白框
    let unit = 1 / 200;
    let showTiBlock = this.data.showTiBlock;

    if (scrollTop > 200) { //滑动超过200时开始透明变色
      opacity = 1 - (scrollTop - 200) * unit;
    } else {
      opacity = 1;
    }

    if (scrollTop > 642) {
      self.setData({
        fixed: "fixed",
        showBlock: true,
        opacity: opacity
      })
    } else {
      self.setData({
        fixed: "",
        showBlock: false,
        showTiBlock:true,
        opacity: opacity
      })
    }
  }
})