// components/jiesuo/jiesuo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight: {
      type: Number,
      value: 1333
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    downShow: true,
    user: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: false
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: true,
        downShow: true
      })
    },
    //toogle展示
    toogleDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //阻止事件冒泡
    stopBubbling: function(e) {},

    //点击了空地,让蒙版消失
    tapBlank: function(e) {
      this.setData({
        isShow: false
      })
    },

    //点击关闭按钮
    close: function() {
      this.setData({
        downShow: false
      })
    },


    //得到海报
    //点击海报按钮
    _createHaibao: function(e) {
      let self = this;

      wx.showLoading({
        title: '生成中',
        mask: true
      })
      self.triggerEvent("createHaibao");
    }
  },
})