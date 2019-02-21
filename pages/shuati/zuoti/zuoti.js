// pages/shuati/zuoti/zuoti.js
let common = require('../../../common/shiti.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shitiArray: [

      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "多选",
        TX: 2,
        answer: "ABCDE",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "",
        TX: 1,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "",
        TX: 1,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "",
        TX: 1,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "",
        TX: 1,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "",
        TX: 1,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "",
        TX: 1,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "多选",
        TX: 2,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      },
      {
        A: "第一产业",
        B: "第二产业",
        C: "第三产业",
        D: "第四产业",
        E: "多选",
        TX: 2,
        answer: "C",
        done_daan: "",
        favorite: 0,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      }
    ],
    markAnswerItems: [], //设置一个空答题板数组
    doneAnswerArray: [], //已做答案数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.title //设置标题
    })
    this.setData({
      options: options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    //获得dialog组件
    this.markAnswer = this.selectComponent("#markAnswer");//答题板
    this.errorRecovery = this.selectComponent("#errorRecovery");//纠错板
    this.tongji = this.selectComponent('#tongji');//统计面板
    this.jiaocheng = this.selectComponent('#jiaocheng');//教程板
    this.jiesuo = this.selectComponent('#jiesuo');//解锁板

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
    let user = wx.getStorageSync('user');

    let username = user.username;//用户名称(测试)

    let options = self.data.options;
    let shitiArray = self.data.shitiArray;
    let circular = false;

    let last_view = wx.getStorageSync('测试'); //得到最后一次的题目
    let px = last_view.px; //最后一次浏览的题的编号
    let myFavorite = 0;
    if (px == undefined) {
      px = 1 //如果没有这个px说明这个章节首次访问
      circular: false
    }

    setTimeout(res => {
      self.setData({
        isLoaded: true
      })
      common.initShitiArrayDoneAnswer(shitiArray); //将试题的所有done_daan置空
      common.initMarkAnswer(shitiArray.length, self); //初始化答题板数组

      //得到swiper数组
      let preShiti = undefined; //前一题
      let nextShiti = undefined; //后一题
      let midShiti = shitiArray[px - 1]; //中间题

      let sliderShitiArray = [];
      let lastSliderIndex = 0;

      common.initShiti(midShiti, self); //初始化试题对象(初始化图标和选中状态)

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

      //对是否是已答试题做处理
      wx.getStorage({
        key: "shiti" + options.zhangjie_id + username,
        success: function(res1) {
          //根据章是否有子节所有已经回答的题
          let doneAnswerArray = self.data.jieIdx != "undefined" ? res1.data[self.data.zhangIdx][self.data.jieIdx] : res1.data[self.data.zhangIdx]
          common.setMarkAnswerItems(doneAnswerArray, options.nums, self.data.isModelReal, self.data.isSubmit, self); //设置答题板数组     

          //映射已答题目的已作答的答案到shitiArray
          for (let i = 0; i < doneAnswerArray.length; i++) {
            let doneAnswer = doneAnswerArray[i];
            shitiArray[doneAnswer.px - 1].done_daan = doneAnswer.done_daan; //设置已答试题的答案
          }

          //先处理是否是已经回答的题,渲染3个
          if (preShiti != undefined) common.processDoneAnswer(preShiti.done_daan, preShiti, self);
          common.processDoneAnswer(midShiti.done_daan, midShiti, self);
          if (nextShiti != undefined) common.processDoneAnswer(nextShiti.done_daan, nextShiti, self);

          //根据已答试题库得到正确题数和错误题数
          let rightAndWrongObj = common.setRightWrongNums(doneAnswerArray);


          //如果已答试题数目大于0才更新shiti
          if (doneAnswerArray.length > 0) {
            self.setData({
              sliderShitiArray: sliderShitiArray,
              doneAnswerArray: doneAnswerArray, //获取该节所有的已做题目
              rightNum: rightAndWrongObj.rightNum,
              wrongNum: rightAndWrongObj.wrongNum
            })
          }
        },
      })

      circular = px == 1 || px == shitiArray.length ? false : true //如果滑动后编号是1,或者最后一个就禁止循环滑动
      myFavorite = midShiti.favorite;

      if (px != 1 && px != shitiArray.length) { //如果不是第一题也不是最后一题
        sliderShitiArray[0] = midShiti;
        sliderShitiArray[1] = nextShiti;
        sliderShitiArray[2] = preShiti;
      } else if (px == 1) { //如果是第一题
        sliderShitiArray[0] = midShiti;
        sliderShitiArray[1] = nextShiti;
      } else { //如果是最后一题

        sliderShitiArray[0] = preShiti;
        sliderShitiArray[1] = midShiti;
        lastSliderIndex = 1;
        self.setData({
          myCurrent: 1
        })
      }

      self.setData({
        // z_id: options.z_id, //点击组件的id编号
        // zhangjie_id: options.zhangjie_id, //章节的id号，用于本地存储的key
        // zhangIdx: options.zhangIdx, //章的id号
        // jieIdx: options.jieIdx, //节的id号

        px: px,
        user: user,
        circular: circular,
        myFavorite: myFavorite, //是否收藏
        nums: shitiArray.length, //题数
        shitiArray: shitiArray, //整节的试题数组
        sliderShitiArray: sliderShitiArray, //滑动数组
        lastSliderIndex: lastSliderIndex, //默认滑动条一开始是0
        isLoaded: true, //是否已经载入完毕,用于控制过场动画
      });

    }, 500)
  },

  /**
   * 问题回答
   */
  _answerSelect:function(e){
    let self = this;
    let px = self.data.px;
    let done_daan = "";
    let shitiArray = self.data.shitiArray;

    let sliderShitiArray = self.data.sliderShitiArray;
    let current = self.data.lastSliderIndex//当前滑动编号
    let currentShiti = sliderShitiArray[current];//当前滑块试题

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
  _checkVal: function (e) {
    let self = this;
    let done_daan = e.detail.done_daan.sort();
    let px = self.data.px;
    let shitiArray = self.data.shitiArray;

    let sliderShitiArray = self.data.sliderShitiArray;
    let current = self.data.lastSliderIndex//当前滑动编号
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
  _toggleErrorRecovery: function (e) {
    this.markAnswer.hideDialog();
    this.errorRecovery.toogleDialog();
  },

  /**
   * 生命周期事件
   */
  onUnload:function(e){
    this.tongji.showDialog();
  },

  /**
   * 点击返回按钮，这时弹出统计页面model
   */
  back:function(){
    this.tongji.showDialog();
  },

  /**
   * 模板点击返回按钮
   */
  _toBack:function(){
    wx.navigateBack({    })
  },

  /**
   * 点击笔记按钮
   */
  _note:function(){
    let self = this;
    this.setData({
      showbiji:true
    })

    setTimeout(function(){
      self.setData({
        focus: true
      })
    },200)
  },

  /**
   * 点击教程按钮
   */
  _jiaocheng:function(e){
    this.jiaocheng.toogleShow();
  },

  /**
   * 点击解锁按钮
   */
  _jiesuo:function(e){
    this.jiesuo.showDialog();
  },

  /**
   * 购买解析包
   */
  _buyJiexi:function(){
    this.jiesuo.hideDialog();
    wx.showToast({
      title: '购买解锁开发中',
      icon:'none',
      duration:3000
    })
  },

  /**
   * 购买全部
   */
  _buyAll:function(){
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
  blur:function(){
    this.setData({
      showbiji: false
    })
  },

  /**
   * 笔记输入框输入文字
   */
  textareaInput:function(e){
    let text = e.detail.value;
    this.setData({
      noteText:text
    })
  },

  /**
   * 发表笔记
   */
  noteFabiao:function(){
    this.setData({
      noteShow:true
    })
  }
})