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
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title //设置标题
    })

    this.setData({
      options: options,
      times: options.times, //考试时间
      first: true, //首次载入
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
    this.jiesuo = this.selectComponent('#jiesuo'); //解锁板

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

    let first = this.data.first;
    let isReLoad = this.data.isReLoad;
    let user = wx.getStorageSync('user');

    if (first || isReLoad) { //首次登陆,并且登陆

      let zcode = user.zcode ? user.zcode : '';
      let token = user.token ? user.token : '';

      let test_score = options.text_score;
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

      
      app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + id + "&page=" + page, false, true, "", "", false, self).then((res) => {
       
        let result = res.data.data[0];

        let shitiArray = result.list;

        let all_nums = options.nums;

        let pageall = result.page_all;
        let prepage = page - 1; //上一页
        let nextPage = page + 1; //下一页

        pageArray.push(page);

        common.initNewWrongArrayDoneAnswer(shitiArray, page - 1); //将试题的所有done_daan置空

        shitiArray = common.initShitiArray(shitiArray, all_nums, page);

        //得到swiper数组
        let preShiti = undefined; //前一题
        let nextShiti = undefined; //后一题
        let midShiti = shitiArray[px - 1]; //中间题
        console.log(midShiti.answer);

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
          app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + id + "&page=" + prepage, false, true, "", "", false, self).then((res) => {
            pageArray.push(prepage);

            self.setData({
              pageArray: pageArray
            })

            let newWrongShitiArray = res.data.data[0].list;
            common.initNewWrongArrayDoneAnswer(newWrongShitiArray, prepage - 1); //将试题的所有done_daan置空
            for (let i = 0; i < newWrongShitiArray.length; i++) { //更新shitiArray
              shitiArray[i + (prepage - 1) * 10] = newWrongShitiArray[i];
            }

            post.moniOnload(options, shitiArray,result, px, circular, user, page, all_nums, pageall, interval, isSubmit, self) //对数据进行处理和初始化
          })
        } else if ((px % 10 >= 6 || px % 10 == 0) && nextPage <= pageall) {
          app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + id + "&page=" + nextPage, false, true, "", "", false, self).then((res) => {
            pageArray.push(nextPage);

            self.setData({
              pageArray: pageArray
            })

            let newWrongShitiArray = res.data.data[0].list;
            common.initNewWrongArrayDoneAnswer(newWrongShitiArray, nextPage - 1); //将试题的所有done_daan置空

            for (let i = 0; i < newWrongShitiArray.length; i++) { //更新shitiArray
              shitiArray[i + (nextPage - 1) * 10] = newWrongShitiArray[i];
            }
            post.moniOnload(options, shitiArray,result, px, circular, user, page, all_nums, pageall, interval, isSubmit, self) //对数据进
          })
        } else {
          self.setData({
            pageArray: pageArray
          })
          post.moniOnload(options, shitiArray,result, px, circular, user, page, all_nums, pageall, interval, isSubmit, self) //对数据进
        }

      })
    }

  },

  /**
   * slider改变事件
   */
  sliderChange: function(e) {

    //***********************定义参数***********************************/  */
    let self = this;
    let lastSliderIndex = self.data.lastSliderIndex; //上次滑块index
    let options = self.data.options; //上个页面传过来的参数
    let current = e.detail.current; //当前滑块index
    let source = e.detail.source; //滑动方式（被动滑动还是主动）
    if (source != "touch") return; //如果是被动滑动就不执行
    let px = self.data.px; //当前试题编号
    let direction = ""; //滑动方向
    let shitiArray = self.data.shitiArray; //当前试题数组
    let doneAnswerArray = self.data.doneAnswerArray; //已做数组
    let circular = self.data.circular; //是否循环
    let f_id = options.f_id; //题库id
    // let user = self.data.user; //用户信息
    let user = wx.getStorageSync('user');
    let zcode = user.zcode == undefined ? '' : user.zcode;
    let token = user.token == undefined?"":user.token;
    let pageArray = self.data.pageArray; //当前所有已经渲染的页面数组
    let pageall = self.data.pageall; //当前题库错题页总页数
    //********************************************************************/  */
    
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
 
          app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + f_id + "&page=" + nextPage, false, true, "", "", false, self).then((res) => {

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

          app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + f_id + "&page=" + prePage, false, true, "", "", false, self).then((res) => {

            let newWrongShitiArray = res.data.data[0].list;

            common.initNewWrongArrayDoneAnswer(newWrongShitiArray, prePage - 1); //将试题的所有done_daan置空

            for (let i = 0; i < newWrongShitiArray.length; i++) {
              let isAnswer = shitiArray[i + (prePage - 1) * 10].isAnswer ? true : false;
              let done_daan = shitiArray[i + (prePage - 1) * 10].done_daan ? shitiArray[i + (prePage - 1) * 10].done_daan : '';
              shitiArray[i + (prePage - 1) * 10] = newWrongShitiArray[i];
              shitiArray[i + (prePage - 1) * 10].isAnswer = isAnswer;
              shitiArray[i + (prePage - 1) * 10].done_daan = done_daan;
            }

            self.setData({
              shitiArray: shitiArray,
            })
            wx.hideLoading();
          })
        }
      }
    }

    let preShiti = undefined; //前一题
    let nextShiti = undefined; //后一题
    let midShiti = shitiArray[px - 1]; //中间题
    console.log(midShiti.answer);

    common.processModelRealDoneAnswer(midShiti.done_daan, midShiti, self);

    //每次滑动结束后初始化前一题和后一题
    if (direction == "左滑") {
      if (px < shitiArray.length) { //如果还有下一题
        nextShiti = shitiArray[px];
        common.initShiti(nextShiti, self); //初始化试题对象
        //先处理是否是已经回答的题    
        common.processModelRealDoneAnswer(nextShiti.done_daan, nextShiti, self);
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
        common.processModelRealDoneAnswer(preShiti.done_daan, preShiti, self);
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
      xiaotiCurrent: 0, //没滑动一道题都将材料题小题的滑动框index置为0
      px: px,
      checked: false
    })
  },


  /**
   * 问题回答
   */
  _answerSelect: function(e) {
    let self = this;

    if (self.data.isSubmit) return

    let px = self.data.px;
    let done_daan = "";
    let shitiArray = self.data.shitiArray;
    let user = self.data.user;

    let sliderShitiArray = self.data.sliderShitiArray;
    let current = self.data.lastSliderIndex //当前滑动编号
    let currentShiti = sliderShitiArray[current];
    let options = self.data.options;
    let typesid = options.typesid;

    let shiti = shitiArray[px - 1]; //本试题对象

    done_daan = shiti.leibie != '2' ? e.detail.done_daan : e.detail.done_daan.sort(); //根据单选还是多选得到done_daan

    common.changeModelRealSelectStatus(done_daan, currentShiti, false); //改变试题状态
    common.changeModelRealSelectStatus(done_daan, shiti, false); //改变试题状态

    this.setData({
      shitiArray: shitiArray,
      sliderShitiArray: sliderShitiArray
    })


    common.postAnswerToServer(user, shiti.beizu, shiti.id, shiti.flag, shiti.done_daan, typesid, app, API_URL);

    common.storeModelRealAnswerStatus(shiti, self); //存储答题状态

    common.setMarkAnswer(shiti, self.data.isModelReal, self.data.isSubmit, self) //更新答题板状态(单个)

    common.ifDoneAll(shitiArray, self.data.doneAnswerArray); //判断是不是所有题已经做完
  },

  /**
   * 多选题选一个选项
   */
  _checkVal: function(e) {
    let self = this;
    if (self.data.isSubmit) return
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

    this.setData({
      sliderShitiArray: sliderShitiArray,
      shitiArray: shitiArray
    })

    common.changeModelRealSelectStatus(done_daan, currentShiti, false); //改变试题状态
    common.changeModelRealSelectStatus(done_daan, shiti, false); //改变试题状态

    this.setData({
      shitiArray: shitiArray,
      sliderShitiArray: sliderShitiArray
    })

    common.storeModelRealAnswerStatus(shiti, self); //存储答题状态

    common.setMarkAnswer(shiti, self.data.isModelReal, self.data.isSubmit, self) //更新答题板状态(单个)

    common.ifDoneAll(shitiArray, self.data.doneAnswerArray); //判断是不是所有题已经做完
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
    this.markAnswer.toogleDialog();
  },

  /**
   * 生命周期事件
   */
  onUnload: function(e) {
    let self = this;
    let isLoaded = self.data.isLoaded;
    if (!isLoaded) return;

    let user = wx.getStorageSync("user");
    let zcode = user.zcode?user.zcode:"";

    let moniBottom = self.moniBottom;

    if (!self.data.isSubmit) {
      let time = moniBottom.data.time;

      let second = time.h * 3600 + time.m * 60 + time.s;

      clearInterval(self.data.interval); //停止计时器

      wx.setStorage({
        key: 'last_time' + self.data.id + zcode,
        data: second,
      })
    }
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
    * 答题板点击编号事件,设置当前题号为点击的题号
    */
  _tapEvent: function (e) {
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

        self.getNewShiti(page, midShiti, preShiti, nextShiti, px, current, circular);
        self.getNewShiti(prepage, midShiti, preShiti, nextShiti, px, current, circular);

      } else if ((px % 10 >= 6 || px % 10 == 0) && nextPage <= pageall && pageArray.indexOf(nextPage) == -1) { //如果是页码的最后一题,并且有下一页，并且不在已渲染数组中
        pageArray.push(nextPage);
        self.setData({
          pageArray: pageArray
        })

        self.getNewShiti(page, midShiti, preShiti, nextShiti, px, current, circular);
        self.getNewShiti(nextPage, midShiti, preShiti, nextShiti, px, current, circular);

      } else {
        self.setData({
          pageArray: pageArray,
          allLoaded: [1], //设置正在载入的page个数 0 1 2,只请求一个页面，这时把allLoaded长度直接设为1
        })
        self.getNewShiti(page, midShiti, preShiti, nextShiti, px, current, circular);
      }

    } else if (px % 10 >= 1 && px % 10 <= 4 && prepage >= 1 && pageArray.indexOf(prepage) == -1) { //如果本页已经渲染，但上一页没有渲染
      pageArray.push(prepage);
      self.setData({
        isLoaded: false,
        pageArray: pageArray,
        allLoaded: [1], //设置正在载入的page个数 0 1 2,只请求一个页面，这时把allLoaded长度直接设为1
      })
      self.getNewShiti(prepage, midShiti, preShiti, nextShiti, px, current, circular);
    } else if ((px % 10 >= 6 || px % 10 == 0) && nextPage <= pageall && pageArray.indexOf(nextPage) == -1) { ////如果本页已经渲染，但上一页没有渲染
      pageArray.push(nextPage);
      self.setData({
        isLoaded: false,
        pageArray: pageArray,
        allLoaded: [1], //设置正在载入的page个数 0 1 2,只请求一个页面，这时把allLoaded长度直接设为1
      })
      self.getNewShiti(nextPage, midShiti, preShiti, nextShiti, px, current, circular);
    } else {
      common.processTapModelRealAnswer(midShiti, preShiti, nextShiti, px, current, circular, shitiArray, self);
    }
  },

  /**
   * 得到新一组试题
   */
  getNewShiti: function (page, midShiti, preShiti, nextShiti, px, current, circular) {
    let self = this;
    let shitiArray = self.data.shitiArray;
    let f_id = self.data.id;//试卷id

    //用户信息
    let user = wx.getStorageSync('user');
    let token = user.token?user.token:"";
    let zcode = user.zcode?user.zcode:"";

    app.post(API_URL, "action=getShijuanShow&token=" + token + "&zcode=" + zcode + "&id=" + f_id + "&page=" + page, false, true, "", "", false, self).then((res) => {
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
        console.log(midShiti.answer);
        common.processTapModelRealAnswer(midShiti, preShiti, nextShiti, px, current, circular, shitiArray, self);
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
   * 隐藏答题板
   */
  _hideMarkAnswer: function () {
    this.markAnswer.hideDialog();
  },

  /**
  * 点击立即交卷后
  */
  _submit: function () {
    let self = this;
    let shitiArray = self.data.shitiArray; //所有试题
    let id = self.data.id; //真题的id号
    let doneAnswerArray = self.data.doneAnswerArray; //已经回答的试题
    let times = self.data.times; //考试总时间
    let totalscore = self.data.totalscore //总分
    let allNums = self.data.nums; //题的总数
    let rightNums = 0; //正确题数
    let wrongNums = 0; //错误题数
    let score = 0; //分数
    let undone = 0; //未做题数
    let time = self.moniBottom.data.time; //当前时间,对象格式
    let gone_time = 0; //花费时间
    let result = self.data.result;//试卷分数页数等信息
    let danxuan_fen = parseFloat("0"+result.danxuan_fen);//单选分数
    let duoxuan_fen = parseFloat("0" + result.duoxuan_fen);//多选分数
    let panduan_fen = parseFloat("0" + result.panduan_fen);//判断分数
    let user = wx.getStorageSync('user');
    let zcode = user.zcode?user.zcode:"";
    let token = user.token?user.token:"";


    let doneUserAnswer = common.getDoneAnswers(shitiArray);

    //得到花费的时间
    gone_time = times * 60 - (time.h * 3600 + time.m * 60 + time.s);

    //得到正确数和错误数
    for (let i = 0; i < doneAnswerArray.length; i++) {
      let doneAnswer = doneAnswerArray[i]; //单个已经回答的试题
      let px = doneAnswer.px;

      //计算正确与错误数
      if (doneAnswer.isRight == 0) { //正确
        rightNums += 1;
      } else {
        wrongNums += 1;
      }

      switch (doneAnswer.select) {
        case "1"://单选
          score += !doneAnswer.isRight?danxuan_fen:0;
        case "2"://多选
          score += !doneAnswer.isRight?duoxuan_fen:0;
        case "3"://判断
          score += !doneAnswer.isRight?panduan_fen:0;
      }
    }

    clearInterval(self.data.interval); //停止计时

    undone = allNums - rightNums - wrongNums; //计算出未做题数
    //提交结果
    app.post(API_URL, "action=saveTestResult" +
      "&token=" + token +
      "&zcode=" + zcode +
      "&sjid=" + id +
      "&testTime=" + gone_time +
      "&testScore=" +score+
      "&TrueTid=" + doneUserAnswer.TrueTid, true, true, "计算中").then((res) => {

        if (score > self.data.test_score) { //如果比历史分数高就更新
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2]; //上一个页面
          let modelList = prevPage.data.modelList;
          for (let i = 0; i < modelList.length; i++) {
            let model = modelList[i];
            if (id == model.id) {
              model.test_score = score;
              prevPage.setData({
                modelList: modelList
              })
            }
          }
        }

        //设置已经提交
        self.setData({
          isSubmit: true,
          text: "重新评测",
        })
        wx.setStorage({
          key: 'modelRealIsSubmit' + self.data.id + zcode,
          data: true,
        })

        //设置用时
        wx.setStorage({
          key: "last_gone_time" + self.data.id + zcode,
          data: "用时" + time1.getGoneTimeStr(gone_time)
        })
        //设置答题板的显示文字
        self.moniBottom.setData({ //设置时间显示为花费时间
          timeStr: "用时" + time1.getGoneTimeStr(gone_time)
        })

        let jibai = res.data.data[0].jibai;
        wx.navigateTo({
          url: '/pages/shuati/moni/modelRealScore/modelRealScore?score=' + score + "&rightNums=" + rightNums + "&wrongNums=" + wrongNums + "&undone=" + undone + "&totalscore=" + totalscore + "&id=" + id + "&gone_time=" + gone_time + "&jibai=" + jibai
        })
      })

  },

  /**
 * 重新评测
 */
  _restart: function () {
    let self = this;
    common.restartModelReal(self);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})