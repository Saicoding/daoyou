
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight: {
      type: Number,
      value: 1333,
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    downShow: false,
    currentIndex:0,//当前套餐编号
    taocans:[],
    buy:0
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
        isShow: true
      })
    },
    //toogle展示
    toogleDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //阻止事件冒泡
    stopBubbling: function (e) {
    },

    //点击了空地,让蒙版消失
    tapBlank: function (e) {
      this.setData({
        isShow: false
      })
    },

    //点击关闭按钮
    close: function () {
      this.setData({
        downShow: false
      })
    },

    //关闭所有
    closeAll:function(){
      this.setData({
        isShow: false
      })
    },

    //点击分享按钮
    share: function () {
      wx.showToast({
        title: '开发中',
        icon: 'none',
        duration: 3000
      })
    },

    //确定按钮点击
    _confirm:function(){
      this.hideDialog();
      let currentIndex = this.data.currentIndex;
      let money_zong = this.data.taocans[currentIndex].price_tuan;
      let product = this.data.taocans[currentIndex].typesname;
      let title = this.data.taocans[currentIndex].title;
      let buy = this.data.taocans[currentIndex].buy;
      let buy0 = this.data.taocans[0].buy;
      this.triggerEvent('confirm', { 'money_zong': money_zong,'title':title, 'product': product, 'buy': buy, 'buy0': buy0});
    },
   
    //改变套餐
    changeTaocan:function(e){
      let index = e.currentTarget.dataset.index;
      this.setData({
        currentIndex:index
      })
    }
  }
})
