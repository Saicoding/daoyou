// components/errorRecovery/errorRecovery.js
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
    types:[
      { 
        title: "全部"
      },
      {
        title: "单选"
      },
      {
        title: "多选"
      },
      {
        title: "判断"
      }
    ],
    currentIndex:0,
    num:0,
    donenum:0,
    rightrate:0,

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
      let user = wx.getStorageSync('user');
      let zcode = user.zcode?user.zcode:'';
      let num = 0;

      let doneArray = wx.getStorageSync("doneArray" + this.data.f_id + "0" + zcode);//本地的所有题的缓存

      let tongji = this.getRightRateAndNum(doneArray, currentIndex)//得到对应题型正确率和已答题数量

      switch (currentIndex){
        case 0://所有题数
        num = this.data.num_dan+this.data.num_duo+this.data.num_pan;
        break;
        case 1://单选
        num = this.data.num_dan;
        break;
        case 2://多选
        num = this.data.num_duo;
        break;
        case 3://判断
        num = this.data.num_pan;
        break;
      }


      this.setData({
        currentIndex: currentIndex,
        donenum: tongji.num,
        num: num,
        rightrate: tongji.rightrate
      })
    },

    //设置数量
    setNum: function () {
      let currentIndex = this.data.currentIndex;//点击的类别
      let user = wx.getStorageSync('user');
      let zcode = user.zcode ? user.zcode : '';
      let num = 0;

      let doneArray = wx.getStorageSync("doneArray" + this.data.f_id + "0" + zcode);//本地的所有题的缓存

      let tongji = this.getRightRateAndNum(doneArray, currentIndex)//得到对应题型正确率和已答题数量

      switch (currentIndex) {
        case 0://所有题数
          num = this.data.num_dan + this.data.num_duo + this.data.num_pan;
          break;
        case 1://单选
          num = this.data.num_dan;
          break;
        case 2://多选
          num = this.data.num_duo;
          break;
        case 3://判断
          num = this.data.num_pan;
          break;
      }

      this.setData({
        currentIndex: currentIndex,
        donenum: tongji.num,
        num: num,
        rightrate: tongji.rightrate
      })
    },

    //计算正确率
    getRightRateAndNum: function (doneArray, currentIndex){
      let obj = {rightrate:0,num:0};
      let rightNum = 0;
      for (let i = 0; i < doneArray.length;i++){
        let done = doneArray[i];
        if (parseInt(done.select) == parseInt(currentIndex) || currentIndex == 0){
          obj.num++;
          if (done.isRight == 0) {
            rightNum++;
          }
        }
      }
      if(obj.num !=0){
        obj.rightrate = ((rightNum / obj.num) * 100).toFixed(2);
      }
      return obj;
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
      this.triggerEvent('GOzuoti', { currentSelectIndex: this.data.currentIndex, selected: this.data.selected == undefined ? false : this.data.selected, f_id: this.data.f_id, title: this.data.title, all_nums: this.data.num, donenum: this.data.donenum,num_dan:this.data.num_dan,num_duo:this.data.num_duo,num_pan:this.data.num_pan});//传三个参数,1.当前选择的题型(全部、单选、多选、判断).2.已做的题还是未做的题(默认是未做的题).3.章节id 
    }
  }

})