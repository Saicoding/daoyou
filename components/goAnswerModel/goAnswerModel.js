// components/errorRecovery/errorRecovery.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    types:[
      "全部",
      "单选",
      "多选",
      "判断"
    ],
    currentIndex:0

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
    stopBubbling: function (e) { },

    //点击了空地,让蒙版消失
    tapBlank: function (e) {
      this.setData({
        isShow: false
      })
    },

    //改变类别
    changeType:function(e){
      let currentIndex = e.currentTarget.dataset.index;//点击的类别
      this.setData({
        currentIndex: currentIndex
      })
    },

    //改变回答已做还是未做
    switchChange:function(e){
      this.setData({
        selected:this.data.selected?false:true
      })
    },

    //点击开始刷题按钮
    _GOzuoti:function(e){
      this.hideDialog();
      this.triggerEvent('GOzuoti', { currentSelectIndex: this.data.currentIndex, selected: this.data.selected == undefined ? false : this.data.selected});//传两个参数,1.当前选择的题型(全部、单选、多选、判断).2.已做的题还是未做的题(默认是未做的题)
    }
  }

})