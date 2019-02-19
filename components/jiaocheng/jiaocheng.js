// components/jiaocheng/jiaocheng.js
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
    loaded: false,
    isPlaying: false, //是否在播放
    useFlux: false, //是否使用流量观看
    isWifi: true, //默认有wifi
    lastType: "first",
    showPrompt:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //阻止事件冒泡
    stopBubbling: function (e) {
    },

    //点击了空地,让蒙版消失
    tapBlank: function (e) {
      this.setData({
        show: false
      })
    },
    //显示模板
    show:function(){
      this.setData({
        show:true
      })
    },

    //关闭模板
    hide:function(){
      this.setData({
        show:false
      })
    },

    //切换模板
    toogleShow:function(){
      this.setData({
        show:this.data.show?false:true
      })
    },

    //关闭提示
    closePrompt:function(){
      this.setData({
        showPrompt:false
      })
    }
  }
})
