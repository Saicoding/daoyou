// pages/shuati/zuoti/zuoti.js
let common = require('../../../common/shiti.js');
let time1 = require('../../../common/time.js');
let animate = require('../../../common/animate.js');
let post = require('../../../common/post.js');
let easeOutAnimation = animate.easeOutAnimation(500);
let easeInAnimation = animate.easeInAnimation(500);
let share = require('../../../common/share.js');
const util = require('../../../utils/util.js')
//把winHeight设为常量，不要放在data里（一般来说不用于渲染的数据都不能放在data里）
const winHeight = wx.getSystemInfoSync().windowHeight
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0, //书的编号,默认为0
    rightNum: 0, //正确答案数
    wrongNum: 0, //错误答案数
    isLoaded: false, //是否已经载入完毕,用于控制过场动画
    checked: false, //选项框是否被选择
    doneAnswerArray: [], //已做答案数组
    markAnswerItems: [], //设置一个空数组
    isModelReal: true, //是不是真题或者押题
    isSubmit: false, //是否已提交答卷
    circular: true, //默认slwiper可以循环滚动
    shitiNum: 1, //默认试题编号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.title //设置标题
    })

    this.setData({
      options: options,
      times: options.times, //考试时间
      first: true,//首次载入
      text: "立即交卷", //按钮文字
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    //获得dialog组件
    this.markAnswer = this.selectComponent("#markAnswer"); //答题板
    this.moniBottom = this.selectComponent('#moniBottom'); //最下面的bar

    this.moniBottom.setData({
      time: time1.getTime(self.data.times)
    })

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
    let self = this;
    let options = this.data.options;
    console.log(options)
    let first = this.data.first;
    let isReLoad = this.data.isReLoad;
    let user = wx.getStorageSync('user');

    if (first && user || isReLoad) {//首次登陆,并且登陆

      let zcode = user.zcode ? user.zcode : '';
      let token = user.token ? user.token : '';

      let test_score = options.test_score;
      let page = 1; //默认是第一页

      let id = options.f_id;
      let pageArray = []; //页面缓存数组

      let circular = false;
      let lastSliderIndex = 0;

      //根据真题定制最后一次访问的key
      let last_view_key = 'lastModelReal' + id + zcode;

      let last_model_real = wx.getStorageSync(last_view_key); //得到最后一次的题目

      let px = last_model_real.px; //最后一次浏览的题的编号

      if (px == undefined) {
        px = 1 //如果没有这个px说明这个章节首次访问
        circular: false
      } else {
        page = ((px - 1) - (px - 1) % 10) / 10 + 1;
      }

      app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + id + "&page=" + page, false, true, "", "", true, self).then((res) => {
        
        let result = res.data.data[0];

        console.log(result)
        let shitiArray = result.list;
        let all_nums = options.nums;

        let pageall = result.page_all;
        let prepage = page - 1; //上一页
        let nextPage = page + 1; //下一页

        pageArray.push(page);

        common.initNewWrongArrayDoneAnswer(shitiArray, page - 1); //将试题的所有done_daan置空

        shitiArray = common.initShitiArray(shitiArray, all_nums, page);

        common.initMarkAnswer(all_nums, self); //初始化答题板数组

        //得到swiper数组
        let preShiti = undefined; //前一题
        let nextShiti = undefined; //后一题
        let midShiti = shitiArray[px - 1]; //中间题

        let sliderShitiArray = [];

        common.initShiti(midShiti, self); //初始化试题对象
        if (px != 1 && px != shitiArray.length) { //如果不是第一题也是不是最后一题
          preShiti = shitiArray[px - 2];
          common.initShiti(preShiti, self); //初始化试题对象
          nextShiti = shitiArray[px];
          common.initShiti(nextShiti, self); //初始化试题对象
        } else if (px == 1) { //如果是第一题
          nextShiti = shitiArray[px];
          common.initShiti(nextShiti, self); //初始化试题对象
        } else {
          preShiti = shitiArray[px - 2];
          common.initShiti(preShiti, self); //初始化试题对象
        }

        circular = px == 1 || px == shitiArray.length ? false : true //如果滑动后编号是1,或者最后一个就禁止循环滑动

        common.initModelRealMarkAnswer(shitiArray, self); //初始化答题板数组

        let isSubmit = wx.getStorageSync('modelRealIsSubmit' + options.f_id + zcode);

        //开始计时
        let interval = "";
        if (!isSubmit) { //如果没提交
          let second = wx.getStorageSync('last_time' + options.f_id + zcode);
          if (second) {
            interval = common.startWatch(second, self);
          } else {
            interval = common.startWatch(options.times * 60, self);
          }
        } else { //如果已提交
          let last_gone_time_str = wx.getStorageSync("last_gone_time" + options.f_id + zcode);
          self.moniBottom.setData({
            timeStr: last_gone_time_str
          })
        }

        if (px % 10 >= 1 && px % 10 <= 4 && prepage >= 1) { //px为前半部分并且有上一页时，请求上一页
          app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + id + "&page=" + prepage, false, true, "", "", true, self).then((res) => {
            pageArray.push(prepage);

            self.setData({
              pageArray: pageArray
            })

            let newWrongShitiArray = res.data.data[0].list;
            common.initNewWrongArrayDoneAnswer(newWrongShitiArray, prepage - 1); //将试题的所有done_daan置空
            for (let i = 0; i < newWrongShitiArray.length; i++) { //更新shitiArray
              shitiArray[i + (prepage - 1) * 10] = newWrongShitiArray[i];
            }

            post.moniOnload(options, result, px, circular, user, page, all_nums, pageall, interval, isSubmit,self) //对数据进行处理和初始化
          })
        } else if ((px % 10 >= 6 || px % 10 == 0) && nextPage <= pageall) {
          app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + id + "&page=" + nextPage, false, true, "", "", true, self).then((res) => {
            pageArray.push(nextPage);

            self.setData({
              pageArray: pageArray
            })

            let newWrongShitiArray = res.data.data[0].list;
            common.initNewWrongArrayDoneAnswer(newWrongShitiArray, nextPage - 1); //将试题的所有done_daan置空
            for (let i = 0; i < newWrongShitiArray.length; i++) { //更新shitiArray
              shitiArray[i + (nextPage - 1) * 10] = newWrongShitiArray[i];
            }
            post.moniOnload(options, result, px, circular, user, page, all_nums, pageall, interval, isSubmit, self) //对数据进
          })
        } else {
          self.setData({
            pageArray: pageArray
          })
          post.moniOnload(options, result, px, circular, user, page, all_nums, pageall, interval,isSubmit,self )//对数据进
        }
     
      })
    }
  },

  /**
     * slider改变事件
     */
  sliderChange: function (e) {
    let self = this;
    let lastSliderIndex = self.data.lastSliderIndex;
    let current = e.detail.current;
    let source = e.detail.source;
    if (source != "touch") return;
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
    } else {
      px--;
    }

    let preShiti = undefined; //前一题
    let nextShiti = undefined; //后一题
    let midShiti = shitiArray[px - 1]; //中间题

    common.processModelRealDoneAnswer(midShiti.done_daan, midShiti, self);

    //每次滑动结束后初始化前一题和后一题
    if (direction == "左滑") {
      if (px < shitiArray.length) { //如果还有下一题
        nextShiti = shitiArray[px];
        common.initShiti(nextShiti, self); //初始化试题对象

        //先处理是否是已经回答的题    
        common.processModelRealDoneAnswer(nextShiti.done_daan, nextShiti, self);
      }
      preShiti = shitiArray[px - 2]; //肯定会有上一题
    } else { //右滑
      if (px > 1) { //如果还有上一题
        preShiti = shitiArray[px - 2];
        common.initShiti(preShiti, self); //初始化试题对象
        common.processModelRealDoneAnswer(preShiti.done_daan, preShiti, self);
      }
      nextShiti = shitiArray[px];
    }

    common.storeModelRealLastShiti(px, self); //存储最后一题的状态

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
      xiaotiCurrent: 0,
      px: px,
      shitiNum: shitiNum,
      checked: false
    })
  },


  /**
   * 问题回答
   */
  _answerSelect: function(e) {
    let self = this;
    let px = self.data.px;
    let done_daan = "";
    let shitiArray = self.data.shitiArray;

    let sliderShitiArray = self.data.sliderShitiArray;
    let current = self.data.lastSliderIndex //当前滑动编号
    let currentShiti = sliderShitiArray[current]; //当前滑块试题

    let shiti = shitiArray[px - 1]; //本试题对象

    done_daan = shiti.TX == 1 ? e.detail.done_daan : shiti.selectAnswer; //根据单选还是多选得到done_daan

    if (shiti.TX == 2 && shiti.selectAnswer == undefined) {
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
      sliderShitiArray: sliderShitiArray
    })

    // common.postAnswerToServer(self.data.acode, self.data.username, shiti.id, shiti.flag, shiti.done_daan, app, API_URL); //向服务器提交答题结果
    // common.storeAnswerStatus(shiti, self); //存储答题状态

    common.setMarkAnswer(shiti, self.data.isModelReal, self.data.isSubmit, self) //更新答题板状态

    common.ifDoneAll(shitiArray, self.data.doneAnswerArray); //判断是不是所有题已经做完
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
   * 切换纠错面板
   */
  _toggleErrorRecovery: function(e) {
    this.markAnswer.hideDialog();
    this.errorRecovery.toogleDialog();
  },

  /**
 * 切换答题板
 */
  _toogleMarkAnswer: function () {
    this.markAnswer.toogleDialog();
  },

  /**
   * 生命周期事件
   */
  onUnload: function(e) {
    this.tongji.showDialog();
  },

  /**
   * 点击返回按钮，这时弹出统计页面model
   */
  back: function() {
    this.tongji.showDialog();
  },

  /**
   * 模板点击返回按钮
   */
  _toBack: function() {
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
  }
})