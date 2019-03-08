// components/errorRecovery/errorRecovery.js
let newAni = require('../../common/newAnimate.js');
let time  = require('../../common/time.js');
const app = getApp()
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight: {
      type: Number,
      value: 1333
    },
    windowWidth:{
      type:Number,
      value:300
    }
  },

  lifetimes: {
    attached() {
    
    },
    detached() {
      console.log('haha')
    },
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
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: false
      })
    },
    //展示弹框
    showDialog() {
      let self = this;
      this.setData({
        isShow: true,
      })

    },
    //toogle展示
    toogleDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //点击了空地,让蒙版消失
    tapBlank: function (e) {
      this.setData({
        isShow: false
      })
    },
    //阻止事件冒泡
    stopBubbling: function (e) { },

    //开始绘图
    draw: function (num){
      let self = this;
      let num2 =100;

      let windowWidth = this.data.windowWidth;
      let user = wx.getStorageSync('user');
      let nickname = user.Nickname ? user.Nickname:'';
      let mypic = user.Pic;

      self.setData({
        isShow:true
      })
      //绘制背景
      let context = wx.createCanvasContext('mycanvas', this);

      //下载头像
      wx.downloadFile({
        url: mypic,
        success: (res) => {
            self.setData({
              headPic: res.tempFilePath
            })
        }
      })


      wx.showLoading({
        title: '生成中',
      })
      app.post(API_URL, "action=getSignPic",false,false,"","",false,self).then(res=>{
        let picUrl = res.data.data[0];//从服务器获取背景图
        //画背景
        wx.downloadFile({
          url: picUrl,
          success: (res) => {
            console.log(res)
            if (res.statusCode === 200) {
              
              context.drawImage(res.tempFilePath, 0, 0, 905 * windowWidth / 750, 1237 * windowWidth / 750);
              context.draw();

              //画日期
              context.setFontSize(40 * windowWidth / 750);
              context.setFillStyle('white');
              context.fillText(time.getDateToday(), 80 * windowWidth / 750, 180 * windowWidth / 750);
              //画'我在导游考试通连续学习多少天'
              context.setFontSize(40 * windowWidth / 750);
              context.fillText('我在导游考试通', 70 * windowWidth / 750, 300 * windowWidth / 750);
              context.fillText('连续学习第', 70 * windowWidth / 750, 370 * windowWidth / 750);
              context.setFillStyle('#06b034');
              context.fillText(num, 270 * windowWidth / 750, 370 * windowWidth / 750);
              context.setFillStyle('white');
              let sub = 0;
              if(num < 10){
                sub = 25
              }else if(num > 99){
                sub = -25
              }
              context.fillText('天', (330-sub) * windowWidth / 750, 370 * windowWidth / 750);
              // 画昵称
              context.setFontSize(45 * windowWidth / 750);
              context.setFillStyle('black');
              context.fillText(nickname, 70 * windowWidth / 750, 1100 * windowWidth / 750);
              context.setFontSize(40 * windowWidth / 750);
              context.setFillStyle('#979797');
              context.fillText("在导游考试通累计学习", 70 * windowWidth / 750, 1160 * windowWidth / 750);
              context.setFillStyle('#06b034');
              context.fillText(num2, 465 * windowWidth / 750, 1160 * windowWidth / 750);
  
              let sub2 = 0;
              if (num2 < 10) {
                sub = 25
              } else if (num2 > 99) {
                sub2 = -25
              }
              context.setFillStyle('#979797');
              context.fillText('天', (525 - sub2) * windowWidth / 750, 1160 * windowWidth / 750);

              context.arc(120 * windowWidth / 750, 1150 * windowWidth / 750, 50 * windowWidth / 750, 0, 2 * Math.PI) //画出圆
              context.strokeStyle = "red";
              context.clip(); //裁剪上面的圆形
              context.drawImage(self.data.headPic, 70 * windowWidth / 750, 1100 * windowWidth / 750, 100, 100); // 在刚刚裁剪的园上画图
              context.draw(true);

              //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
              setTimeout(function () {
                wx.canvasToTempFilePath({
                  canvasId: 'mycanvas',
                  success: function (res) {
                    let tempFilePath = res.tempFilePath;
                    self.setData({
                      imageUrl: tempFilePath,
                      isShow: true
                    })

                    wx.hideLoading();
                  },
                  fail: function (res) {
                    wx.hideLoading();
                    console.log('haha')
                    self.setData({
                      isShow: true
                    });
                  }
                }, self);
              }, 100);
            }
          }
        })
      })
    }


  }

})