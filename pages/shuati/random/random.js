// pages/shuati/zuoti/zuoti.js
let common = require('../../../common/shiti.js');
const app = getApp();
let post = require('../../../common/post.js');
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
let time = require('../../../common/time.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightNum: 0, //正确答案数
    wrongNum: 0, //错误答案数
    markAnswerItems: [], //设置一个空答题板数组
    doneAnswerArray: [], //已做答案数组
    checked: false, //选项框是否被选择

    isModelReal: false, //是不是真题或者押题
    isSubmit: false, //是否已提交答卷
    circular: true, //默认slwiper可以循环滚动
    myFavorite: 0, //默认收藏按钮是0
    isHasShiti: true, //是否有试题
    isLoaded: false, //默认没有载入完毕
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: '随机练习'
    })
    let self = this;
    let user = wx.getStorageSync('user'); //本地用户信息
    let zcode = user.zcode == undefined ? "" : user.zcode; //缓存标识
    let page = 1; //默认是第一页
    let pageArray = []; //页面缓存数组
    let circular = false;
    let myFavorite = 0;
    let px = 1

    app.post(API_URL, "action=getKeMuTestshow&types=" + options.types + "&leibie=0&random=1", false, false, "", "", false, self).then((res) => {
      let result = res.data.data[0];
      let shitiArray = result.list;
      let all_nums = 10;

      let pageall = 1;
      let prepage = page - 1; //上一页
      let nextPage = page + 1; //下一页
      pageArray.push(page);

      let beginTimestamp = Date.parse(new Date());
      self.setData({
        beginTimestamp: beginTimestamp
      })

      common.initNewWrongArrayDoneAnswer(shitiArray, page - 1); //将试题的所有done_daan置空

      shitiArray = common.initShitiArray(shitiArray, all_nums, page);

      common.initMarkAnswer(all_nums, self); //初始化答题板数组

      if (px % 10 >= 1 && px % 10 <= 4 && prepage >= 1) { //px为前半部分并且有上一页时，请求上一页
        app.post(API_URL, "action=getKeMuTestshow&types=" + options.types + "&f_id=" + options.f_id + "&leibie=" + options.leibie + "&page=" + prepage, false, false, "", "", false, self).then((res) => {
          pageArray.push(prepage);

          self.setData({
            pageArray: pageArray
          })

          let newWrongShitiArray = res.data.data[0].list;
          common.initNewWrongArrayDoneAnswer(newWrongShitiArray, prepage - 1); //将试题的所有done_daan置空
          for (let i = 0; i < newWrongShitiArray.length; i++) { //更新shitiArray
            shitiArray[i + (prepage - 1) * 10] = newWrongShitiArray[i];
          }

          post.zuotiOnload(options, px, circular, myFavorite, shitiArray, user, page, all_nums, pageall, self) //对数据进行处理和初始化
        })
      } else if ((px % 10 >= 6 || px % 10 == 0) && nextPage <= pageall) {
        app.post(API_URL, "action=getKeMuTestshow&types=" + options.types + "&f_id=" + options.f_id + "&leibie=" + options.leibie + "&page=" + nextPage, false, false, "", "", false, self).then((res) => {
          pageArray.push(nextPage);

          self.setData({
            pageArray: pageArray
          })

          let newWrongShitiArray = res.data.data[0].list;
          common.initNewWrongArrayDoneAnswer(newWrongShitiArray, nextPage - 1); //将试题的所有done_daan置空
          for (let i = 0; i < newWrongShitiArray.length; i++) { //更新shitiArray
            shitiArray[i + (nextPage - 1) * 10] = newWrongShitiArray[i];
          }
          post.zuotiOnload(options, px, circular, myFavorite, shitiArray, user, page, all_nums, pageall, self) //对数据进
        })
      } else {
        self.setData({
          pageArray: pageArray
        })
        post.zuotiOnload(options, px, circular, myFavorite, shitiArray, user, page, all_nums, pageall, self) //对数据进
      }
    })

    this.setData({
      options: options,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    //获得dialog组件
    this.markAnswer = this.selectComponent("#markAnswer"); //答题板
    this.errorRecovery = this.selectComponent("#errorRecovery"); //纠错板
    this.tongji = this.selectComponent('#tongji'); //统计面板
    this.jiaocheng = this.selectComponent('#jiaocheng'); //教程板
    this.jiesuo = this.selectComponent('#jiesuo'); //解锁板
    this.shuatiBottom = this.selectComponent('#shuatiBottom'); //解锁板

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
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
  onShow: function() {
    if (this.data.isReLoad || this.data.isSingin) {//重复登录或者登录
      this._answerSelect(undefined);
    }

  },

  /**
   * 问题回答
   */
  _answerSelect: function(e) {
    let self = this;
    let px = self.data.px;
    let done_daan = "";

    let huidiaoDaan = null;

    if (e == undefined) {//回调回来的  
      huidiaoDaan = self.data.huidiaoDaan;
    } else {
      huidiaoDaan = e.detail.done_daan ? e.detail.done_daan : '';
    }

    let shitiArray = self.data.shitiArray;

    let sliderShitiArray = self.data.sliderShitiArray;
    let current = self.data.lastSliderIndex //当前滑动编号
    let currentShiti = sliderShitiArray[current]; //当前滑块试题
    let user = wx.getStorageSync('user');
    let typesid = this.data.options.types;

    this.setData({
      huidiaoDaan: huidiaoDaan
    })

    if (!user) {
      self.setData({
        isSingin: true
      })
      wx.navigateTo({
        url: '/pages/login/login?showToast=true&title=您需要登录',
      })
      return
    }

    let shiti = shitiArray[px - 1]; //本试题对象

    if (shiti.leibie == '1' || shiti.leibie == '3') {//单选和判断
      done_daan = huidiaoDaan;
    } else if (shiti.leibie == '2') {//多选
      done_daan = shiti.selectAnswer;
    } else {//面试
      done_daan = "mianshi";
    }

    if (shiti.leibie == '2' && shiti.selectAnswer == undefined) {
      wx.showToast({
        title: '还没有作答 !',
        icon: 'none',
      })
      return;
    }

    if (shiti.isAnswer) return;

    common.changeSelectStatus(done_daan, shiti, false); //改变试题状态
    common.changeSelectStatus(done_daan, currentShiti, false); //改变试题状态

    this.setData({
      shitiArray: shitiArray,
      sliderShitiArray: sliderShitiArray,
      restart: false,
      isReLoad: false,
      isSingin: false
    })

    common.changeNum(shiti.flag, self); //更新答题的正确和错误数量

    common.postAnswerToServer(user, shiti.beizhu, shiti.id, shiti.flag, shiti.done_daan, typesid, app, API_URL);

    common.storeRandomAnswerStatus(shiti, self); //存储答题状态

    common.setMarkAnswer(shiti, self.data.isModelReal, self.data.isSubmit, self) //更新答题板状态

    common.ifDoneAll(shitiArray, self.data.doneAnswerArray); //判断是不是所有题已经做完
  },

  /**
   * 点击在来一组的回调函数
   */
  aginCallback: function() {
    let self = this;
    self.setData({
      doneAnswerArray: [],
      markAnswerItems: [],
      checked: false, //选项框是否被选择
      circular: true, //默认slwiper可以循环滚动
      isLoaded: false,
      myCurrent: 0,
      myFavorite: 0, //默认收藏按钮是0
    })

    let options = self.data.options;
    let user = wx.getStorageSync('user'); //本地用户信息
    let zcode = user.zcode == undefined ? "" : user.zcode; //缓存标识
    let page = 1; //默认是第一页
    let pageArray = []; //页面缓存数组
    let circular = false;
    let myFavorite = 0;
    let px = 1

    app.post(API_URL, "action=getKeMuTestshow&types=" + options.types + "&leibie=0&random=1", false, false, "", "", false, self).then((res) => {
      let result = res.data.data[0];
      let shitiArray = result.list;
      let all_nums = 10;

      let pageall = 1;
      let prepage = page - 1; //上一页
      let nextPage = page + 1; //下一页
      pageArray.push(page);

      let beginTimestamp = Date.parse(new Date());
      self.setData({
        beginTimestamp: beginTimestamp
      })

      common.initNewWrongArrayDoneAnswer(shitiArray, page - 1); //将试题的所有done_daan置空

      shitiArray = common.initShitiArray(shitiArray, all_nums, page);

      common.initMarkAnswer(all_nums, self); //初始化答题板数组

      post.zuotiOnload(options, px, circular, myFavorite, shitiArray, user, page, all_nums, pageall, self) //对数据进

    })

    this.setData({
      options: options
    })
  },


  /**
   * 多选题选一个选项
   */
  _checkVal: function(e) {
    let self = this;
    let done_daan = e.detail.done_daan.sort();
    let px = self.data.px;
    let shitiArray = self.data.shitiArray;

    let sliderShitiArray = self.data.sliderShitiArray;
    let current = self.data.lastSliderIndex //当前滑动编号
    let currentShiti = sliderShitiArray[current];

    let shiti = shitiArray[px - 1];
    //初始化多选的checked值
    // common.initMultiSelectChecked(shiti);
    common.initMultiSelectChecked(currentShiti);
    //遍历这个答案，根据答案设置shiti的checked属性

    done_daan = common.changeShitiChecked(done_daan, currentShiti);
    common.changeMultiShiti(done_daan, currentShiti);
    common.changeMultiShiti(done_daan, shiti);
    this.setData({
      sliderShitiArray: sliderShitiArray,
      shitiArray: shitiArray
    })
  },

  /**
   * slider改变事件
   */
  sliderChange: function(e) {
    let source = e.detail.source;
    if (source != "touch") return;

    let self = this;
    let options = self.data.options;
    let lastSliderIndex = self.data.lastSliderIndex;
    let current = e.detail.current;

    let myFavorite = 0;
    let pageArray = self.data.pageArray; //当前所有已经渲染的页面数组
    let pageall = self.data.pageall; //当前题库错题页总页数

    let f_id = options.f_id;

    let user = self.data.user;
    let zcode = user.zcode == undefined ? '' : user.zcode;

    let px = self.data.px;
    let direction = "";
    let shitiArray = self.data.shitiArray;
    let doneAnswerArray = self.data.doneAnswerArray;
    let circular = self.data.circular;

    //判断滑动方向
    if ((lastSliderIndex == 0 && current == 1) || (lastSliderIndex == 1 && current == 2) || (lastSliderIndex == 2 && current == 0)) { //左滑
      direction = "左滑";
    } else {
      direction = "右滑";
    }

    if (direction == "左滑") {
      px++;
      if (px % 10 >= 6) { //滑动到号大于7，这时判断有没有下一个page
        let nextPage = ((px - 1) - (px - 1) % 10) / 10 + 2;

        if (pageArray.indexOf(nextPage) == -1 && nextPage <= pageall) { //已渲染数组不包含下一页面

          pageArray.push(nextPage); //请求后就添加到已渲染数组
          self.setData({
            pageArray: pageArray,
          })

          app.post(API_URL, "action=getKeMuTestshow&types=" + options.types + "&f_id=" + options.f_id + "&leibie=" + options.leibie + "&page=" + nextPage, false, true, "", true, self).then((res) => {

            let newWrongShitiArray = res.data.data[0].list;

            common.initNewWrongArrayDoneAnswer(newWrongShitiArray, nextPage - 1); //将试题的所有done_daan置空

            for (let i = 0; i < newWrongShitiArray.length; i++) {
              let isAnswer = shitiArray[i + (nextPage - 1) * 10].isAnswer ? true : false;
              let done_daan = shitiArray[i + (nextPage - 1) * 10].done_daan ? shitiArray[i + (nextPage - 1) * 10].done_daan : '';
              shitiArray[i + (nextPage - 1) * 10] = newWrongShitiArray[i];
              shitiArray[i + (nextPage - 1) * 10].isAnswer = isAnswer;
              shitiArray[i + (nextPage - 1) * 10].done_daan = done_daan;
            }

            self.setData({
              shitiArray: shitiArray,
            })
            wx.hideLoading();
          })
        }
      }
    } else {
      px--;
      if (px % 10 <= 4) { //滑动到小于等于3时，这时判断有没有上一个page

        let prePage = ((px - 1) - (px - 1) % 10) / 10;

        if (pageArray.indexOf(prePage) == -1 && prePage >= 1) { //已渲染数组不包含下一页面
          pageArray.push(prePage); //请求后就添加到已渲染数组
          self.setData({
            pageArray: pageArray,
          })

          app.post(API_URL, "action=getKeMuTestshow&types=" + options.types + "&f_id=" + options.f_id + "&leibie=" + options.leibie + "&page=" + prePage, false, true, "", true, self).then((res) => {

            let newWrongShitiArray = res.data.data[0].list;

            common.initNewWrongArrayDoneAnswer(newWrongShitiArray, prePage - 1); //将试题的所有done_daan置空

            for (let i = 0; i < newWrongShitiArray.length; i++) {
              let isAnswer = shitiArray[i + (prePage - 1) * 10].isAnswer ? true : false;
              let done_daan = shitiArray[i + (prePage - 1) * 10].done_daan ? shitiArray[i + (prePage - 1) * 10].done_daan : '';
              shitiArray[i + (prePage - 1) * 10] = newWrongShitiArray[i];
              shitiArray[i + (nextPage - 1) * 10].isAnswer = isAnswer;
              shitiArray[i + (nextPage - 1) * 10].done_daan = done_daan;
            }

            self.setData({
              shitiArray: shitiArray,
            })
            wx.hideLoading();
          })
        }
      }
    }
    let midShiti = shitiArray[px - 1];
    myFavorite = midShiti.favorite == undefined ? '0' : midShiti.favorite;
    let preShiti = undefined; //前一题
    let nextShiti = undefined; //后一题

    //每次滑动结束后初始化前一题和后一题
    if (direction == "左滑") {
      if (px < shitiArray.length) { //如果还有下一题
        nextShiti = shitiArray[px];
        common.initShiti(nextShiti, self); //初始化试题对象
        //先处理是否是已经回答的题    
        common.processDoneAnswer(nextShiti.done_daan, nextShiti, self);
      }
      if (px + 1 < shitiArray.length) { //如果有下下题
        if (shitiArray[px + 1].id == undefined) {
          wx.showToast({
            title: '载入试题中...',
            icon: 'none',
            mask: true
          })
        }
      }
      preShiti = shitiArray[px - 2]; //肯定会有上一题
    } else { //右滑
      if (px > 1) { //如果还有上一题
        preShiti = shitiArray[px - 2];
        common.initShiti(preShiti, self); //初始化试题对象
        common.processDoneAnswer(preShiti.done_daan, preShiti, self);
      }
      if (px > 2) { //如果有上上题
        if (shitiArray[px - 3].id == undefined) {
          wx.showToast({
            title: '载入试题中...',
            icon: 'none',
            mask: true
          })
        }
      }
      nextShiti = shitiArray[px];
    }

    common.storeLastShiti(px, self); //存储最后一题的状态

    //滑动结束后,更新滑动试题数组
    let sliderShitiArray = [];

    if (px != 1 && px != shitiArray.length) {
      if (current == 1) {
        if (nextShiti != undefined) sliderShitiArray[2] = nextShiti;
        sliderShitiArray[1] = midShiti;
        if (preShiti != undefined) sliderShitiArray[0] = preShiti;
      } else if (current == 2) {
        if (nextShiti != undefined) sliderShitiArray[0] = nextShiti;
        sliderShitiArray[2] = midShiti;
        if (preShiti != undefined) sliderShitiArray[1] = preShiti;

      } else {
        if (nextShiti != undefined) sliderShitiArray[1] = nextShiti;
        sliderShitiArray[0] = midShiti;
        if (preShiti != undefined) sliderShitiArray[2] = preShiti;
      }
    } else if (px == 1) {
      sliderShitiArray[0] = midShiti;
      sliderShitiArray[1] = nextShiti;
      current = 0;
      self.setData({
        myCurrent: 0
      })
    } else if (px == shitiArray.length) {
      sliderShitiArray[0] = preShiti;
      sliderShitiArray[1] = midShiti;
      current = 1;
      self.setData({
        myCurrent: 1
      })
    }
    circular = px == 1 || px == shitiArray.length ? false : true //如果滑动后编号是1,或者最后一个就禁止循环滑动

    self.setData({ //每滑动一下,更新试题
      shitiArray: shitiArray,
      sliderShitiArray: sliderShitiArray,
      circular: circular,
      lastSliderIndex: current,
      xiaotiCurrent: 0, //没滑动一道题都将材料题小题的滑动框index置为0
      myFavorite: myFavorite,
      px: px,
      checked: false
    })

  },

  /**
   * 答题板点击编号事件,设置当前题号为点击的题号
   */
  _tapEvent: function(e) {
    let self = this;
    let px = e.detail.px;

    let shitiArray = self.data.shitiArray;
    let options = self.data.options;

    let user = self.data.user;
    let zcode = user.zcode == undefined ? '' : user.zcode;

    let pageArray = self.data.pageArray; //当前所有已经渲染的页面数组
    let pageall = self.data.pageall; //当前题库错题页总页数

    let current = self.data.lastSliderIndex; //当前swiper的index
    let circular = self.data.circular;

    //得到swiper数组
    let preShiti = undefined; //前一题
    let nextShiti = undefined; //后一题
    let midShiti = shitiArray[px - 1]; //中间题

    let page = ((px - 1) - (px - 1) % 10) / 10 + 1; //当前页

    let prepage = page - 1; //上一页
    let nextPage = page + 1; //下一页

    self._hideMarkAnswer(); //隐藏答题板

    //如果渲染数组不包含当前页面
    if (pageArray.indexOf(page) == -1) {
      pageArray.push(page);
      self.setData({
        allLoaded: [], //设置正在载入的page个数 0 1 2 ，当个数为2时说明已经载入完毕
        isLoaded: false,
      })

      if (px % 10 >= 1 && px % 10 <= 4 && prepage >= 1 && pageArray.indexOf(prepage) == -1) { //如果是页码的第一题,并且有上一页,并且不在已渲染数组中
        pageArray.push(prepage);
        self.setData({
          pageArray: pageArray
        })

        self.getNewShiti(options, page, midShiti, preShiti, nextShiti, px, current, circular);
        self.getNewShiti(options, prepage, midShiti, preShiti, nextShiti, px, current, circular);

      } else if ((px % 10 >= 6 || px % 10 == 0) && nextPage <= pageall && pageArray.indexOf(nextPage) == -1) { //如果是页码的最后一题,并且有下一页，并且不在已渲染数组中
        pageArray.push(nextPage);
        self.setData({
          pageArray: pageArray
        })

        self.getNewShiti(options, page, midShiti, preShiti, nextShiti, px, current, circular);
        self.getNewShiti(options, nextPage, midShiti, preShiti, nextShiti, px, current, circular);

      } else {
        self.setData({
          pageArray: pageArray,
          allLoaded: [1], //设置正在载入的page个数 0 1 2,只请求一个页面，这时把allLoaded长度直接设为1
        })
        self.getNewShiti(options, page, midShiti, preShiti, nextShiti, px, current, circular);
      }

    } else if (px % 10 >= 1 && px % 10 <= 4 && prepage >= 1 && pageArray.indexOf(prepage) == -1) { //如果本页已经渲染，但上一页没有渲染
      pageArray.push(prepage);
      self.setData({
        isLoaded: false,
        pageArray: pageArray,
        allLoaded: [1], //设置正在载入的page个数 0 1 2,只请求一个页面，这时把allLoaded长度直接设为1
      })
      self.getNewShiti(options, prepage, midShiti, preShiti, nextShiti, px, current, circular);
    } else if ((px % 10 >= 6 || px % 10 == 0) && nextPage <= pageall && pageArray.indexOf(nextPage) == -1) { ////如果本页已经渲染，但上一页没有渲染
      pageArray.push(nextPage);
      self.setData({
        isLoaded: false,
        pageArray: pageArray,
        allLoaded: [1], //设置正在载入的page个数 0 1 2,只请求一个页面，这时把allLoaded长度直接设为1
      })
      self.getNewShiti(options, nextPage, midShiti, preShiti, nextShiti, px, current, circular);
    } else {
      common.processTapLianxiAnswer(midShiti, preShiti, nextShiti, px, current, circular, shitiArray, self);
    }
  },

  /**
   * 得到新一组试题
   */
  getNewShiti: function(options, page, midShiti, preShiti, nextShiti, px, current, circular) {
    let self = this;
    let shitiArray = self.data.shitiArray;

    app.post(API_URL, "action=getKeMuTestshow&types=" + options.types + "&f_id=" + options.f_id + "&leibie=" + options.leibie + "&page=" + page, false, false, "", true, self).then((res) => {
      let newWrongShitiArray = res.data.data[0].list;

      common.initNewWrongArrayDoneAnswer(newWrongShitiArray, page - 1); //将试题的所有done_daan置空

      for (let i = 0; i < newWrongShitiArray.length; i++) {
        let isAnswer = shitiArray[i + (page - 1) * 10].isAnswer ? true : false;
        let done_daan = shitiArray[i + (page - 1) * 10].done_daan ? shitiArray[i + (page - 1) * 10].done_daan : '';
        shitiArray[i + (page - 1) * 10] = newWrongShitiArray[i];
        shitiArray[i + (page - 1) * 10].isAnswer = isAnswer;
        shitiArray[i + (page - 1) * 10].done_daan = done_daan;
      }

      let allLoaded = self.data.allLoaded;

      if (allLoaded.length == 1) { //说明已经载入完毕一个
        midShiti = shitiArray[px - 1];
        common.processTapLianxiAnswer(midShiti, preShiti, nextShiti, px, current, circular, shitiArray, self);
        allLoaded = [];
      } else {
        allLoaded.push(1);
      }

      self.setData({
        allLoaded: allLoaded,
        shitiArray: shitiArray
      })
    })
  },

  /**
   * 切换纠错面板
   */
  _toggleErrorRecovery: function(e) {
    this.markAnswer.hideDialog();
    this.errorRecovery.toogleDialog();
  },

  /**
   * 切换答题板
   */
  _toogleMarkAnswer: function() {
    this.errorRecovery.hideDialog();
    this.markAnswer.toogleDialog();
  },

  /**
   * 切换收藏
   */
  _toogleMark: function (e) {
    let self = this;
    let user = wx.getStorageSync('user');
    let shitiArray = self.data.shitiArray; //当前的所有试题数组
    let px = self.data.px; //当前的试题编号
    let shiti = shitiArray[px - 1]; //当前试题

    if (user) {
      let zcode = user.zcode;
      let token = user.token;
      let beizhu = shiti.beizhu;
      let t_id = shiti.id;
      app.post(API_URL, "action=FavoriteShiti&zcode=" + zcode + "&token=" + token + "&beizhu=" + beizhu + "&t_id=" + t_id, false, false, "", "", false, self).then(res => {
        self.shuatiBottom.setData({
          isMark: !self.shuatiBottom.data.isMark
        })
      })
    } else {

      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * 隐藏答题板
   */
  _hideMarkAnswer: function() {
    this.markAnswer.hideDialog();
  },

  /**
   * 重新开始练习
   */
  _restart: function() {
    let self = this;
    self._hideMarkAnswer();
    common.lianxiRestart(self); //重新开始作答
  },

  /**
   * 点击返回按钮，这时弹出统计页面model
   */
  back: function() {
    // let rightNum = this.data.rightNum; //正确数
    // let wrongNum = this.data.wrongNum; //错误数
    // let beginDonenum = this.data.options.donenum; //进入页面时的已做题数
    // let doneAnswerArray = this.data.doneAnswerArray; //已做题数组
    // let rightRate = doneAnswerArray.length == 0 ? 0 : ((rightNum / doneAnswerArray.length) * 100).toFixed(2); //正确率
    // let donenum = doneAnswerArray.length - beginDonenum < 0 ? 0 : doneAnswerArray.length - beginDonenum; //本次做题数

    // let all_nums = this.options.all_nums; //题总数
    // let rateWidth = 600 * doneAnswerArray.length / parseInt(all_nums); //完成进度
    // let beginTimestamp = this.data.beginTimestamp; //开始答题时的时间戳
    // let timestamp = Date.parse(new Date()); //当前是时间戳
    // let subSecond = (timestamp - beginTimestamp) / 1000; //用时(秒数)
    // let timeStr = time.formatTimeBySecond1(subSecond); //根据过去的秒数得到做题用时

    // this.tongji.setData({
    //   rightRate: rightRate, //正确率
    //   donenum: donenum, //本次做题数
    //   allDoneNum: doneAnswerArray.length, //累计答题
    //   undonenum: all_nums - doneAnswerArray.length, //未做题数
    //   wrongNum: wrongNum, //错误数
    //   rateWidth: rateWidth,
    //   timeStr,
    //   timeStr
    // })

    // this.tongji.showDialog();
    wx.navigateBack({

    })
  },

  /**
   * 模板点击返回按钮
   */
  _toBack: function() {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    let doneAnswerArray = this.data.doneAnswerArray; //所有已答数组
    let tiku = prePage.data.tiku; //上个页面的题库对象
    let options = this.data.options;
    let currentIndex = prePage.data.currentIndex;
    let currentMidIndex = prePage.data.currentMidIndex;
    let zhangjieLoadedStr = '' + currentIndex + currentMidIndex; //当前题库标识
    let donenum = this.data.options.donenum; //进入页面时的已做题数

    //找到对应的题库
    let mytikuArray = tiku[zhangjieLoadedStr];
    for (let i = 0; i < mytikuArray.length; i++) {
      let mytiku = mytikuArray[i];
      for (let j = 0; j < mytiku.list.length; j++) {
        let jie = mytiku.list[j];
        if (jie.id == options.f_id) { //找到对应章节
          jie.donenum += doneAnswerArray.length - donenum;
          jie.donenum = this.data.restart ? 0 : jie.donenum;
          jie.rateWidth = 490 * jie.donenum / parseInt(jie.all_num);
          mytiku.donenum += doneAnswerArray.length - donenum;
          if (this.data.restart) {
            mytiku.donenum = 0;
          }
          mytiku.rateWidth = 490 * mytiku.donenum / parseInt(mytiku.all_num);
          prePage.setData({
            zhangjies: mytikuArray,
            tiku: tiku
          })
          break;
        }
      }
    }

    wx.navigateBack({})
  },

  /**
   * 点击笔记按钮
   */
  _note: function() {
    let self = this;
    this.setData({
      showbiji: true
    })

    setTimeout(function() {
      self.setData({
        focus: true
      })
    }, 200)
  },

  /**
   * 点击教程按钮
   */
  _jiaocheng: function(e) {
    this.jiaocheng.toogleShow();
  },

  /**
   * 点击解锁按钮
   */
  _jiesuo: function(e) {
    this.jiesuo.showDialog();
  },

  /**
   * 购买解析包
   */
  _buyJiexi: function() {
    this.jiesuo.hideDialog();
    wx.showToast({
      title: '购买解锁开发中',
      icon: 'none',
      duration: 3000
    })
  },

  /**
   * 购买全部
   */
  _buyAll: function() {
    this.jiesuo.hideDialog();
    wx.showToast({
      title: '购买全部课程开发中',
      icon: 'none',
      duration: 3000
    })
  },

  /**
   * 笔记输入框失去焦点
   */
  blur: function() {
    this.setData({
      showbiji: false
    })
  },

  /**
   * 笔记输入框输入文字
   */
  textareaInput: function(e) {
    let text = e.detail.value;
    this.setData({
      noteText: text
    })
  },

  /**
   * 发表笔记
   */
  noteFabiao: function() {
    this.setData({
      noteShow: true
    })
  },

  /**
   * 导航到学习计划
   */
  _GOxuexijihua: function() {
    wx.navigateTo({
      url: '/pages/index/xuexijihua/xuexijihua',
    })
  },

  /**
   * 显示错题
   */
  _viewWrong: function() {
    this.tongji.hideDialog();
    this.markAnswer.showDialog();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})