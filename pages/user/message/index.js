// pages/user/message/index.js

let API_URL = "https://xcx2.chinaplat.com/daoyou/";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: true,
    title: "",
    placeholder: "",
    user:"",
    userInfo: "111",
    value: "",
    inputtype: "",
    region: ['广东省', '广州市', '海珠区'],
    sh_dizhi: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    
    let that = this;
    let user = wx.getStorageSync('user');
   
    if (user) {
      let zcode = user.zcode;
      let token = user.token;

      this.setData({
        user: user,
        random: new Date().getTime()
      })
    
      app.post(API_URL, "action=getUserInfo&zcode=" + zcode + "&token=" + token, true, false, "", "", self).then((res) => {
        var userInfo = res.data.data[0];
        var address = userInfo.Address.split(",");
        let region = [];
        let hasDizhi = false;
        if (address[0]){
          region = [address[0], address[1], address[2]];
          hasDizhi = true;
        }

        that.setData({
          userInfo: userInfo,
          hasDizhi: hasDizhi,
          region: region,
          sh_dizhi: address[3] ? address[3]:''
        })
      

      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    this.myinput = this.selectComponent('#myinput');
    this.singleSelect = this.selectComponent('#singleSelect');
  },


  /**
   * 弹出模板
   */
  showModel: function(e) {
    let title = e.currentTarget.dataset.title;
    let placeholder = e.currentTarget.dataset.placeholder;
    let inputtype = e.currentTarget.dataset.inputtype;
    let info = e.currentTarget.dataset.info;
    let value = info ? info : "";

    this.setData({
      title: title,
      placeholder: placeholder
    })

    this.myinput.setData({
      value: value,
      inputtype: inputtype
    })

    this.myinput.showDialog();
  },

  /**
   * 弹出选择窗口
   */
  showSingleSelect: function(e) {
    let title = e.currentTarget.dataset.title;
    let info = !e.currentTarget.dataset.info ? '保密' : e.currentTarget.dataset.info;
    let datas = [];
    let myindex = [];

    datas = ['保密', '男', '女'];
    myindex = datas.indexOf(info);
    this.singleSelect.setData({
      datas: datas,
      title: title,
      myindex: myindex
    })

    this.singleSelect.showDialog();
  },

  /**
   * 保存输入信息
   */
  _inputText: function(e) {
    let text = e.detail.text; //输入框的内容
    let title = e.detail.title; //输入框的种类

    this.setData({
      text: text,
    })
  },

  /**
   * 改变选项
   */
  _changeSelect: function(e) {
    let title = this.singleSelect.data.title;
    let index = e.detail.myindex;
    let userInfo = this.data.userInfo;

    let datas = [];

    datas = ['保密', '男', '女'];
    userInfo.Sex = datas[index]


    this.setData({
      userInfo: userInfo
    })
  },

  /**
   * 在model框按了确认按钮
   */
  _confirm: function(e) {
    let title = e.detail.title;
    let text = this.data.text;
    let userInfo = this.data.userInfo;
    switch (title) {
      case '昵称':
        userInfo.Nicename = text
        break;
      case '手机号':
        userInfo.Mobile = text
        break;
      case '邮箱':
        userInfo.Email = text
        break;
    }

    this.setData({
      userInfo: userInfo,
      text: ""
    })
  },

  /**
   * 在model框按了取消按钮
   */
  _cancel: function(e) {
    this.setData({
      text: ""
    })
  },
  //地址
  sh_dizhi: function (e) {
    this.setData({
      sh_dizhi: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },
  /**
   * 保存信息
   */
  save: function() {
    let that = this;
    var address = that.data.region[0] + "," + that.data.region[1] + "," + that.data.region[2] + "," + that.data.sh_dizhi;


    //{ "Nicename": "游客", "Sex": "男", "Address": "测试", "Mobile": "13292374292", "Email": "", "Jifen": "5", "Money": "19185.60", "xueshi": 618523 }
    let user = wx.getStorageSync('user');
    let token = user.token;
    let zcode = user.zcode;
    let userInfo = that.data.userInfo;
    let nickname = userInfo.Nicename;
    let sex = userInfo.Sex;
    let mobile = userInfo.Mobile;
    let Email = userInfo.Email;
   
    app.post(API_URL, "action=saveUserInfo" +
      "&token=" + token +
      "&zcode=" + zcode +
      "&nickname=" + nickname +
      "&sex=" + sex +
      "&mobile=" + mobile + "&address=" + address + "&email=" + Email, true, true, "保存中", "", "", self).then(res => {
      
      wx.showToast({
        icon: 'none',
        title: '保存成功',
        duration: 3000
      })
    })
  },

  /**
   * 导航到设置头像页面
   */
  GOavatarUpload: function() {
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success: function (res) {
        const src = res.tempFilePaths[0]

        wx.navigateTo({
          url: `/pages/user/avatarUpload/avatarUpload?src=${src}`
        })
      },
      fail: function () {
        buttonClicked = false
      }
    })
  }

})