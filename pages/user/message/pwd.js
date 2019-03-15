const app = getApp();

const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
let md5 = require('../../../common/MD5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码', //按钮文字
    currentTime: 30, //倒计时

    submit_disabled: true, //默认提交按钮禁用
    phone: '', //获取到的手机栏中的值
    openId: '', //用户唯一标识  
    unionId: '',
    encryptedData: '',
    url: '',
    ifGoPage: '',
    phoneText: "",
    pwdText: '',
   
    statu: {
      code: 3,
      title: '找回密码',
      ph_user: '请输入找回密码的手机帐号',
      ph_user2: '设置新密码',
      confirm_text: '确定'
    },


    pwd: "",


    color: '#388ff8',

    code: ''
  },
  /**
   * 获取验证码input中的值
   */
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  /**
   * 验证码发送
   */
  codeButtonTap: function(e) {
    let self = this;

    self.setData({
      disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#ccc',
    })

    let phone = self.data.phone;
    let currentTime = self.data.currentTime //把手机号跟倒计时值变例成js值

    let warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空


    if (phone == '') {
      warn = "号码不能为空";
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      warn = "手机号格式不正确";
    } else {
      let Sign = md5.md5(phone + "ChinaplatSms").toLowerCase();
      //当手机号正确的时候提示用户短信验证码已经发送
      app.post("https://xcx2.chinaplat.com/", "action=SendSms&mobile=" + self.data.phone + "&Sign=" + Sign, true, true, "发送中").then((res) => {
        wx.showToast({
          title: '短信验证码已发送',
          icon: 'none',
          duration: 2000
        });
        let identifyCode = res.data.data[0].yzm;
      
        self.setData({
          identifyCode: identifyCode
        })
      })

      //设置一分钟的倒计时
      var interval = setInterval(function() {
        currentTime--; //每执行一次让倒计时秒数减一
        self.setData({
          text: currentTime + 's', //按钮文字变成倒计时对应秒数
        })
        //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
        if (currentTime <= 0) {
          clearInterval(interval)
          self.setData({
            text: '重新发送',
            currentTime: 61,
            disabled: false,
            color: '#388ff8'
          })
        }
      }, 1000);

      self.setData({
        interval: interval
      })

    };

    //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
    if (warn != null) {
      wx.showToast({
        icon: 'none',
        title: warn,
        duration: 3000
      })

      self.setData({
        disabled: false,
        color: '#388ff8'
      })
      return;
    };
  },

  /**
   * 手机号输入框
   */
  phoneInput: function(e) {
    let phone = e.detail.value;
    let submit_disabled = null;
    //校验手机号码
    if (phone.trim().length == 11 || /^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      submit_disabled = false;
    } else {
      submit_disabled = true;
    }

    this.setData({
      phone: e.detail.value,
      submit_disabled: submit_disabled
    })
  },

  /**
   * 密码输入框
   */
  pwdInput: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },

  /**
   * 点击提交
   */
  submit: function(e) {
    let statu = this.data.statu;
    switch (statu.code) {
      case 0:
        this.userPwdLogin(); //帐号密码登录
        break;
      case 1:
        this.codeLogin(); //验证码登录
        break;
      case 2:
        this.sign(); //注册
        break;
      case 3:
        this.findPwd(); //找回密码
        break;
    }
  },
  /**
   * 找回密码
   */
  findPwd: function() {
    let self = this;
    let code = self.data.code;
    let identifyCode = self.data.identifyCode;
    let ifGoPage = self.data.ifGoPage;
    let pwd = self.data.pwd;
    let url = self.data.url;
    let status = self.data.status;
    let warn;

    if (pwd == '' || undefined) {
      warn = "新密码不能为空";
    } else if (!/^(\w){6,20}$/.test(pwd)) {
      warn = "只能输入6-20个字母、数字、下划线";
    }

    if (warn) {
      wx.showToast({
        icon: 'none',
        title: warn,
        duration: 3000
      })
      return;
    }

    if (code == identifyCode && code != undefined) { //如果相等
      //开始登录
      pwd = md5.md5(pwd).toLowerCase();
      app.post("https://xcx2.chinaplat.com/", "action=GetPwd&mobile=" + self.data.phone + "&yzm=" + code + "&pwd=" + pwd, true, true, "修改密码中...").then((res) => {
        
          wx.showToast({
            icon: 'none',
            title: '密码修改成功',
            duration: 2000
          })
          setTimeout(function() {
            wx.navigateBack({})

            wx.navigateTo({
              url: '../../login/login',
            })
          }, 2000);

      })
    } else if (code == undefined) {

      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {

      wx.showToast({
        title: '验证码不正确',
        icon: 'none',
        duration: 2000
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '修改密码',
    }); 
    var user = wx.getStorageSync("user");
    
      this.setData({
        phone: user.username

      })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})