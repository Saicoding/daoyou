//app.js
App({
  /** 
   * 自定义post函数，返回Promise
   * +-------------------
   * author: Saicoding<g6666g@163.com>
   * +-------------------
   * @param {String}      url 接口网址
   * @param {arrayObject} data 要传的数组对象 例如: {name: 'Saicoding', age: 32}
   * +-------------------
   * @return {Promise}    promise 返回promise供后续操作
   */
  post: function(url, data, ifShow, ifCanCancel, title, pageUrl, ifGoPage, self) {
    if (ifShow) {
      wx.showLoading({
        title: title,
        mask: !ifCanCancel
      })
    }

    var promise = new Promise((resolve, reject) => {
      //init
      var that = this;
      var postData = data;
      /*
      //自动添加签名字段到postData，makeSign(obj)是一个自定义的生成签名字符串的函数
      postData.signature = that.makeSign(postData);
      */
      //网络请求

      wx.request({
        url: url,
        data: postData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) { //服务器返回数据
          if (ifShow) { //隐藏载入
            wx.hideLoading();
          }
          let status = res.data.status;
          let message = res.data.message ? res.data.message : res.data.Message;

          if (status == 1) { //请求成功
            resolve(res);
          } else if (status == -2) { //没有权限
            console.log(res);
            wx.showToast({
              icon: 'none',
              title: message,
              duration: 3000
            })
          } else if (status == -101) { //没有试题
            console.log('没有试题')
            self.setData({
              isHasShiti: false,
              isLoaded: true,
              message: message
            })

          } else if (status == -2010) { //重复登录
            wx.removeStorageSync('user');
            console.log(message)
            if (self) { //如果传了这个参数
              self.setData({
                isReLoad: true,
                isShow: false,
                isDaka:true
              })
            }
            wx.navigateTo({
              url: '/pages/login/login?showToast=true&title=登录已失效,请重新登录'
            })


          } else if (status == -404) { //没有对应视频教程
            if (self) { //如果传了这个参数
              wx.showToast({
                icon: 'none',
                title: message,
                duration: 3000
              })
              self.setData({
                hasNoVideo: true,
                first: false
              })
            }

          } else if (status == -201) { //没有对应视频教程
            if (self) { //如果传了这个参数

              self.setData({
                notBuy: true, //设置成没有购买
                first: false,
                show: true,
                showPrompt: true //显示购买信息
              })
            }

          } else if (status == -2012) { //微信未绑定手机号
            resolve(message);
          } else {
            console.log(res);
            wx.showToast({
              icon: 'none',
              title: message,
              duration: 3000
            })
          }
        },
        error: function(e) {
          reject('网络出错');
        }
      })
    });
    return promise;
  },

  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())

    // wx.clearStorage();
    // wx.clearStorage("user")
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //   wx.getUserInfo({
        //     success: res => {
        //       // 可以将 res 发送给后台解码出 unionId
        //       this.globalData.userInfo = res.userInfo

        //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //       // 所以此处加入 callback 以防止这种情况
        //       if (this.userInfoReadyCallback) {
        //         this.userInfoReadyCallback(res)
        //       }
        //     }
        //   })
        // }
      }
    })
  },
  globalData: {
    userInfo: null,
    isLogin: false,
  }
})