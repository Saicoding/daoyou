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
    currentIndex:0,//当前套餐编号
    taocans:[
      {
        title:"导游全陪学习计划套餐",
        price_tuan:499,
        price_old:599,
        info:"贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!贼哇!"
      },
      {
        title: "导游基础学习套餐",
        price_tuan: 399,
        price_old: 569,
        info:"哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞哇塞"
      },
      {
        title: "导游冲刺学习套餐",
        price_tuan: 299,
        price_old: 888,
        info: "买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷买个佛冷"
      },

    ]
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
      let product = "";
      switch (currentIndex){
        case 0:
          product = "基础套餐"
        break;
        case 1:
          product = "冲刺套餐"
          break;
        case 2:
          product = "豪华套餐"
          break;
      }
      
      this.triggerEvent('confirm', { 'money_zong': money_zong, 'product': product});
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
