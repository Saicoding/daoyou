const app = getApp();

const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
let WXBizDataCrypt = require('../../utils/cryptojs/RdWXBizDataCrypt.js');
let appId = "wx274bc5c5c5ce0434";
let md5 = require('../../common/MD5.js')
let buttonClicked = false;

// pages/login1/login1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码', //按钮文字
    currentTime: 30, //倒计时
    disabled: false, //按钮是否禁用
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
      code: 0,
      title: '帐号登录',
      ph_user: '请输入手机帐号',
      ph_user2: '请输入登录密码',
      confirm_text: '登录'
    },
    status: [ //三种登录状态
      {
        code: 0,
        title: '帐号登录',
        ph_user: '请输入手机帐号',
        ph_user2: '请输入登录密码',
        confirm_text: '登录'
      },
      {
        code: 1,
        title: '手机短信登录',
        ph_user: '请输入手机号码',
        confirm_text: '登录'
      },
      {
        code: 2,
        title: '注册帐号',
        ph_user: '请输入手机帐号',
        ph_user2: '设置登录密码',
        confirm_text: '立即注册'
      },
      {
        code: 3,
        title: '找回密码',
        ph_user: '请输入找回密码的手机帐号',
        ph_user2: '设置新密码',
        confirm_text: '确定'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    let redirect = options.redirect == undefined ? "" : options.redirect; //是否直接转 测试
    let showToast = options.showToast ? true : false
    let title = options.title ? options.title : "";
    let status = this.data.status;
    let url1 = "";
    let ifGoPage = "";
    this.setData({
      url: decodeURIComponent(options.url),
      redirect: redirect,
      statu: status[0]
    });
    if (options.url) {
      this.setData({
        url: options.url
      });
    }
    if (options.ifGoPage) {
      this.setData({
        ifGoPage: options.ifGoPage
      });
    }

    if (showToast) { //如果有吐司要求
      wx.showToast({
        title: title,
        duration: 3000,
        icon: 'none'
      })
    }
  },


  /**
   * 生命周期事件
   */
  onShow: function() {
    buttonClicked = false
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    //获得dialog组件
    this.bindPhoneModel = this.selectComponent("#bindPhoneModel");

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

  back: function() {
    wx.navigateBack({});
  },
  /**
   * 改变登录方式
   */
  changeLoginType: function(e) {
    let toStatu = e.currentTarget.dataset.statu;
    let status = this.data.status;
    let interval = this.data.interval;
    let submit_disabled;

    clearInterval(interval);
    if (toStatu == 1) {
      this.setData({
        statu: status[1],
        currentTime: 61,
        disabled: false,
        color: '#388ff8',
        text: '获取验证码',
      })
    } else if (toStatu == 2) { //注册帐号
      this.setData({
        statu: status[2],
        phoneText: "",
        pwdText: '',
        phone: "",
        pwd: "",
        currentTime: 61,
        disabled: false,
        color: '#388ff8',
        text: '获取验证码',
        code: ''
      })
    } else if (toStatu == 0) {
      this.setData({
        statu: status[0]
      })
    } else if (toStatu == 3) { //找回密码
      this.setData({
        statu: status[3],
        phoneText: "",
        pwdText: '',
        phone: "",
        pwd: "",
        currentTime: 61,
        disabled: false,
        color: '#388ff8',
        text: '获取验证码',
        code: ''
      })
    }

    //设置按钮状态
    let phone = this.data.phone;
    if (phone.trim().length == 11 || /^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      submit_disabled = false;
    } else {
      submit_disabled = true;
    }

    this.setData({
      submit_disabled: submit_disabled
    })
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
        console.log(identifyCode)
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
   * 验证码登录
   */
  codeLogin: function() {
    let self = this;
    let code = self.data.code;
    let identifyCode = self.data.identifyCode;
    let ifGoPage = self.data.ifGoPage;
    let url = self.data.url;

    if (code == identifyCode && code != undefined) { //如果相等
      //开始登录
      app.post(API_URL, "action=Login&mobile=" + self.data.phone + "&yzm=" + code, true, true, "登录中").then((res) => {

        let user = res.data.data[0];

        wx.setStorage({
          key: 'user',
          data: user,
          success: function() {
            wx.navigateBack({})

            if (ifGoPage == "true") {
              wx.navigateTo({
                url: url,
              })
            }
          },
          fail: function() {
            console.log('存储失败')
          }
        })
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
   * 帐号密码登录
   */
  userPwdLogin: function(e) {
    let self = this;
    let phone = self.data.phone;
    let pwd = self.data.pwd;
    let ifGoPage = self.data.ifGoPage;
    let url = self.data.url;

    let warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空

    if (phone == '') {
      warn = "号码不能为空";
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      warn = "手机号格式不正确";
    } else if (pwd == '' || pwd == undefined) {
      warn = "密码不能为空";
    } else if (!/^(\w){6,20}$/.test(pwd)) {
      warn = "只能输入6-20个字母、数字、下划线";
    } else {
      //开始登录
      pwd = md5.md5(pwd).toLowerCase();
      app.post(API_URL, "action=Login&user=" + self.data.phone + "&pwd=" + pwd, true, true, "登录中").then((res) => {


        let user = res.data.data[0];

        wx.setStorage({
          key: 'user',
          data: user,
          success: function() {

            wx.navigateBack({})

            if (ifGoPage == "true") {
              wx.navigateTo({
                url: url,
              })
            }
          },
          fail: function() {
            console.log('存储失败')
          }
        })
      })
    }

    if (warn != null) {
      wx.showToast({
        icon: 'none',
        title: warn,
        duration: 3000
      })
      return;
    };
  },

  /**
   * 帐号注册
   */
  sign: function() {
    let self = this;
    let code = self.data.code;
    let identifyCode = self.data.identifyCode;
    let ifGoPage = self.data.ifGoPage;
    let pwd = self.data.pwd;
    let url = self.data.url;
    let warn;

    if (pwd == '' || undefined) {
      warn = "密码不能为空";
    } else if (!/^(\w){6,20}$/.test(pwd)) {
      warn = "只能输入6-20个字母、数字、下划线";
    }
    pwd = md5.md5(pwd).toLowerCase();
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
      app.post(API_URL, "action=SaveReg&mobile=" + self.data.phone + "&code=" + code + "&pwd=" + pwd, true, true, "注册中").then((res) => {

        let user = res.data.list[0];

        wx.showToast({
          icon: 'none',
          title: '注册成功',
          duration: 3000
        })
        console.log(user)
        wx.setStorage({
          key: 'user',
          data: user,
          success: function() {
            console.log(wx.getStorageSync("user"))
            wx.navigateBack({})

            if (ifGoPage == "true") {
              wx.navigateTo({
                url: url,
              })
            }
          },
          fail: function() {
            console.log('存储失败')
          }
        })
      })
    } else if (code == undefined) {
      console.log('heihei')
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      console.log('lele')
      wx.showToast({
        title: '验证码不正确',
        icon: 'none',
        duration: 2000
      });
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

      pwd = md5.md5(pwd).toLowerCase();
      app.post("https://xcx2.chinaplat.com/", "action=GetPwd&mobile=" + self.data.phone + "&yzm=" + code + "&pwd=" + pwd, true, true, "修改密码中...").then((res) => {
        if (res.data.status == '1') {
          self.setData({
            statu: status[0],
            pwd: '',
            pwdText: ''
          })
          wx.showToast({
            icon: 'none',
            title: '密码修改成功',
            duration: 3000
          })
        }
      })
    } else if (code == undefined) {
      console.log('heihei')
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      console.log('lele')
      wx.showToast({
        title: '验证码不正确',
        icon: 'none',
        duration: 2000
      });
    }
  },
  /**
   * 微信授权登录
   */
  wxLogin: function(e) {
    let self = this;
    //限制连续点击
    if (buttonClicked) return;
    buttonClicked = true;

    wx.login({
      success: res => {
        let code = res.code;
        console.log("action=getSessionKey&code=" + code)
        app.post(API_URL, "action=getSessionKey&code=" + code, true, false, "登录中").then((res) => {
          let sesstion_key = res.data.data[0].sessionKey;
          let openid = res.data.data[0].openid;
          console.log(res)
          wx.getUserInfo({
            success: function(res) {
              let wxid = ""; //openId
              let session_key = ""; //

              let encryptedData = res.encryptedData;
              let iv = res.iv;
              let signature = res.signature; //签名
              let nickname = res.userInfo.nickName; //昵称
              let headurl = res.userInfo.avatarUrl; //头像
              let sex = res.userInfo.gender //性别

              //拿到session_key实例化WXBizDataCrypt（）这个函数在下面解密用
              let pc = new WXBizDataCrypt(appId, sesstion_key);
              let data = pc.decryptData(encryptedData, iv);
              let unionid = data.unionId;

              let ifGoPage = self.data.ifGoPage //是否返回上一级菜单
              let url = self.data.url; //需要导航的url

              //监测微信是否有新号
              app.post(API_URL, "action=ChkUnionId&unionid=" + unionid, false, false, "").then(res => {
                //存储本地变量
                if (res.data.status == -2012) { //如果没有绑定
                  self.bindPhoneModel.showDialog();
                  console.log(openid)
                  self.setData({
                    unionid: unionid,
                    wxid: openid,
                    nickname: nickname,
                    headurl: headurl,
                    sex: sex
                  })
                } else {//如果已经绑定了
                  let user = res.data.data[0];
                  wx.setStorage({
                    key: 'user',
                    data: user
                  })
                  buttonClicked = false;
                  wx.navigateBack({}) //先回到登录前的页面
                  if (ifGoPage == 'true') {
                    if (redirect == 'true') {
                      wx.redirectTo({ //是直接跳转
                        url: url,
                      })
                    } else {
                      wx.navigateTo({
                        url: url,
                      })
                    }
                  }
                }
              })
            },
            fail: function(res1) {
              console.log(res1)
            }
          })
        })
      },
      fail: function() {

      }
    })
  },

  /**
   * 绑定手机页面点击绑定
   */
  _confirm: function(e) {
    let phone = e.detail.phone; //手机号
    let code = e.detail.code; //验证码
    let pwd = e.detail.pwd; //密码
    let unionid = this.data.unionid;
    let wxid = this.data.wxid;
    let nickname = this.data.nickname;
    let headurl = this.data.headurl;
    let sex = this.data.sex;
    let ifGoPage = this.data.ifGoPage;
    let redirect = this.data.redirect;
    pwd = md5.md5(pwd).toLowerCase();

    console.log("action=Login_wx&unionId=" + unionid + "&wxid=" + wxid + "&nickname=" + nickname + "&headurl=" + headurl + "&sex=" + sex + "&mobile=" + phone + "&pwd=" + pwd + "&code=" + code)
    app.post(API_URL, "action=Login_wx&unionId=" + unionid + "&wxid=" + wxid + "&nickname=" + nickname + "&headurl=" + headurl + "&sex=" + sex + "&mobile="+phone+"&pwd="+pwd+"&code="+code, true, false, "绑定中").then((res) => {
      let user = res.data.data[0];
      console.log(user)
      wx.setStorage({
        key: 'user',
        data: user
      })
      buttonClicked = false;
      wx.navigateBack({}) //先回到登录前的页面
      if (ifGoPage == 'true') {
        if (redirect == 'true') {
          wx.redirectTo({ //是直接跳转
            url: url,
          })
        } else {
          wx.navigateTo({
            url: url,
          })
        }
      }
    })
  },

  /**
   * 跳过绑定
   */
  _ignore:function(){
    let unionid = this.data.unionid;
    let wxid = this.data.wxid;
    let nickname = this.data.nickname;
    let headurl = this.data.headurl;
    let ifGoPage = this.data.ifGoPage;
    let redirect = this.data.redirect;
    let sex = this.data.sex;

    console.log("action=Login_wx&unionId=" + unionid + "&wxid=" + wxid + "&nickname=" + nickname + "&headurl=" + headurl + "&sex=" + sex)
    app.post(API_URL, "action=Login_wx&unionId=" + unionid + "&wxid=" + wxid + "&nickname=" + nickname + "&headurl=" + headurl + "&sex=" + sex , true, false, "登录中").then((res) => {
      let user = res.data.data[0];
      wx.setStorage({
        key: 'user',
        data: user
      })
      buttonClicked = false;
      wx.navigateBack({}) //先回到登录前的页面
      if (ifGoPage == 'true') {
        if (redirect == 'true') {
          wx.redirectTo({ //是直接跳转
            url: url,
          })
        } else {
          wx.navigateTo({
            url: url,
          })
        }
      }
    })
  }
})