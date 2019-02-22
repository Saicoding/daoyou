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
        favorite: 1,
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
        favorite: 1,
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
        favorite: 1,
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
        favorite: 1,
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
        favorite: 1,
        id: 154174,
        isAnswer: false,
        jiexi: "房地产业是从事房地产投资、开发、经营、服务和管理的行业，包括房地产开发经营、物业管理、房地产中介服务、房地产租赁经营和其他房地产活动。在国民经济产业分类中，房地产业属于第三产业，是为生产和生活服务的部门。",
        question: "在国民经济产业分类中,房地产属于()。【2012年真题】"
      }
    ],
    markAnswerItems: [], //设置一个空答题板数组
    doneAnswerArray: [], //已做答案数组
    checked: false, //选项框是否被选择

    isModelReal: false, //是不是真题或者押题
    isSubmit: false, //是否已提交答卷
    circular: true, //默认slwiper可以循环滚动
    myFavorite: 0, //默认收藏按钮是0
    isHasShiti: true, //是否有试题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    wx.setNavigationBarTitle({
      title: options.title //设置标题
    })
    this.setData({
      options: options,
      first:true
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
    let first = self.data.first;//只有首次载入或者重复登录才重新请求
    let options = self.data.options;//上个页面传过来的参数

    if(first){//如果首次载入
      let page = 1; //默认是第一页
      let pageArray = []; //页面缓存数组
      let LoginRandom = user.Login_random == undefined ? "" : user.Login_random;
      let zcode = user.zcode == undefined ? "" : user.zcode;
      let username = user.username == undefined?"":user.username;
      let circular = false;
      let myFavorite = 0;

      let last_view_key = 'last_view' +  options.tikuId + zcode;
      let last_view = wx.getStorageSync(last_view_key); //得到最后一次的题目

      let px = last_view.px; //最后一次浏览的题的编号

      if (px == undefined) {
        px = 1 //如果没有这个px说明这个章节首次访问
        circular: false
      } else {
        page = ((px - 1) - (px - 1) % 10) / 10 + 1;
      }

    }
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