// components/count/count.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isMark: {
      type: Number,
      value: 0
    },
    px: {
      type: Number,
      value: 0
    },
    all_nums:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //切换是否收藏的状态
    _toogleMark: function () {
      this.triggerEvent('toogleMark');
    },
    _toggleMarkAnswer: function () {
      this.triggerEvent('toogleMarkAnswer')
    },

    /**
     *点击笔记按钮
     */
    _note:function(){
      this.triggerEvent('note');
    },

    /**
     * 点击教程按钮
     */
    _jiaocheng:function(){
      this.triggerEvent('jiaocheng');
    }
  }
})
