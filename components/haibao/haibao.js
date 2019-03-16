// components/errorRecovery/errorRecovery.js
let newAni = require('../../common/newAnimate.js');
let time = require('../../common/time.js');
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
    windowWidth: {
      type: Number,
      value: 300
    }
  },

  lifetimes: {
    attached() {

    },
    detached() {

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
    tapBlank: function(e) {

      this.setData({
        isShow: false
      })
    },
    //阻止事件冒泡
    stopBubbling: function(e) {},

    //开始绘图
    draw: function(num, SignTotalDays, pre) {
      let self = this;
      let num2 = SignTotalDays;
      //绘制背景
      let context = wx.createCanvasContext('mycanvas', this);
      let windowWidth = this.data.windowWidth;
      let user = wx.getStorageSync('user');
      let nickname = user.Nickname ? user.Nickname : '';
      let mypic = user.Pic;

      self.setData({
        isShow: true
      })

      //下载头像
      wx.downloadFile({
        url: mypic,
        success: (res) => {
          self.setData({
            headPic: res.tempFilePath
          })
        }
      })

      app.post(API_URL, "action=getSignPic", false, false, "", "", false, self).then(res => {
        let picUrl = res.data.data[0]; //从服务器获取背景图
        //画背景,下载网络图片
        wx.downloadFile({
          url: picUrl,
          success: (res) => {

            if (res.statusCode === 200) {
              //得到图片信息
              context.drawImage(res.tempFilePath, 0, 0, 600, 820);

              //画日期
              context.setFontSize(25);
              context.setFillStyle('white');
              context.fillText(time.getDateToday(), 50, 120);
              //画'我在导游考试通连续学习多少天'
              context.setFontSize(25);
              context.setFillStyle('white');
              context.fillText('我在导游考试通', 40, 200);
              context.fillText('连续学习第', 40, 230);

              context.setFillStyle('#1fcd74');

              context.fillText(num, 170, 230);

              context.setFillStyle('white');
              let sub = 0;
              if (num < 10) {
                sub = 15
              } else if (num > 99) {
                sub = -15
              }
              context.fillText('天', (210 - sub), 230);
              // 画昵称
              context.setFontSize(30);
              context.setFillStyle('black');
              context.fillText(nickname, 40, 750);
              context.setFontSize(25);
              context.setFillStyle('#979797');
              context.fillText("在导游考试通累计学习", 40, 790);
              context.setFillStyle('#06b034');
              context.fillText(num2, 290, 790);

              let sub2 = 0;
              if (num2 < 10) {
                sub2 = 15
              } else if (num2 > 99) {
                sub2 = -15
              }
              context.setFillStyle('#979797');
              context.fillText('天', (327 - sub2), 790);

              // 画头像
              context.arc(90, 650, 50, 0, 2 * Math.PI) //画出圆
              context.strokeStyle = "red";
              context.clip(); //裁剪上面的圆形
              context.drawImage(self.data.headPic, 40, 600, 100, 100); // 在刚刚裁剪的园上画图
              context.draw(true, function(res) {
                wx.canvasToTempFilePath({
                  canvasId: 'mycanvas',
                  success: function(res) {
                    let tempFilePath = res.tempFilePath;
                    self.setData({
                      imageUrl: tempFilePath,
                      isShow: true
                    })
                    pre.rili.setData({ //日历页面隐藏
                      isShow: false
                    })

                    wx.hideLoading();
                  },
                  fail: function(res) {

                    self.setData({
                      isShow: true
                    });
                    pre.rili.setData({ //日历页面隐藏
                      isShow: false
                    })
                    wx.hideLoading();
                  }
                }, self);
              });

            }
          }
        })
      })
    },

    //开始绘图
    draw2: function(tuan_id, img, userid) {
      let self = this;
      //绘制背景
      let context = wx.createCanvasContext('mycanvas', this);
      let user = wx.getStorageSync('user');
      let nickname = user.Nickname ? user.Nickname : '';
      let mypic = user.Pic;

      self.setData({
        isShow: true
      })

      // 下载头像
      wx.downloadFile({
        url: mypic,
        success: (res) => {
          self.setData({
            headPic: res.tempFilePath
          })
        }
      })


      let picUrl = 'https://xcx2.chinaplat.com/daoyou/images/fengmian.png?tdsourcetag=s_pcqq_aiomsg';

      // 获取access_token
      app.post(API_URL, "action=getWXToken", false, false, "").then(res => {
        let access_token = res.data.data[0].access_token; //接口调用凭证
        let scene = encodeURIComponent(tuan_id);
        let page = 'pages/learn/pindan';

        // 获取二维码

        let dataObj = {
          scene: scene,
          page: page
        };

        console.log(JSON.stringify(dataObj))
        wx.request({
          url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token,
          data: JSON.stringify(dataObj),
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) { //服务器返回数据
            app.post(API_URL,"action=test&a="+res.data,false,false,"").then(res=>{
              console.log('jj')
              console.log(res)
            })
            let filePath = wx.env.USER_DATA_PATH + '/wareInfoShareimg.jpg';

            let fsm = wx.getFileSystemManager();
            fsm.writeFile({
              filePath: filePath,
              data: res.data,
              encoding: 'binary',
              success(res1) {
                console.log(res1)
                wx.getImageInfo({
                  src: filePath,
                  success: function(e) {
                    console.log(e)
                  }
                })
              },
              fail(e) {
                console.log(e)
              },
            });

            //画背景,下载网络图片
            wx.downloadFile({
              url: picUrl,
              success: (res) => {
                if (res.statusCode === 200) {
                  context.drawImage(res.tempFilePath, 0, 0, 600, 820);
                  // 画昵称
                  context.setFontSize(30);
                  context.setFillStyle('white');
                  context.setTextAlign('center');
                  context.fillText(nickname, 300, 180);
                  context.setFontSize(25);
                  context.fillText("「我正在学习导游考试课程,一起学习吧！」", 300, 230);

                  //画中间的文字
                  context.setFontSize(26);
                  context.setFillStyle('black');
                  context.setTextAlign('left');
                  context.fillText('2019导游考试【全陪学习计划】', 225, 310);

                  context.setFontSize(19);
                  context.setFillStyle('black');
                  context.fillText('主讲老师：陈龙\陈晓华\杨红 有效期:2年', 235, 345);

                  context.setFontSize(18);
                  context.setFillStyle('#797979');
                  context.fillText('全套章节试题\模拟试卷\核心密卷', 250, 393);
                  context.fillText('全套基础\提升\冲刺\面试指导课', 250, 419);

                  // 画最下面的字
                  context.setFontSize(26);
                  context.setFillStyle('white');
                  context.setTextAlign('center');
                  context.fillText('扫码和我一起学习吧', 300, 790);

                  //画二维码框
                  context.beginPath();
                  context.arc(300, 610, 130, 0, 2 * Math.PI) //画出外圆
                  context.lineWidth = 8;
                  context.strokeStyle = "#d3452f";
                  context.stroke();

                  context.beginPath();
                  context.arc(300, 610, 50, 0, 2 * Math.PI) //内圆
                  context.fillStyle = "white"
                  context.fill();
                  context.save();
                  context.clip(); //裁剪上面的圆形
                  context.drawImage(self.data.headPic, 250, 560, 100, 100); // 在刚刚裁剪的园上画图

                  context.restore()

                  // 画头像
                  context.beginPath();
                  context.arc(300, 80, 53, 0, 2 * Math.PI) //画出外圆
                  context.lineWidth = 3;
                  context.strokeStyle = "#cfcfcf";
                  context.stroke();
                  context.beginPath();
                  context.arc(300, 80, 50, 0, 2 * Math.PI) //内圆
                  context.fillStyle = "white"
                  context.fill();

                  context.clip(); //裁剪上面的圆形

                  context.drawImage(self.data.headPic, 250, 30, 100, 100); // 在刚刚裁剪的园上画图


 
 

                  context.draw(true, function(res) {
                    console.log('ok')
                    wx.canvasToTempFilePath({
                      canvasId: 'mycanvas',
                      success: function(res) {
                        let tempFilePath = res.tempFilePath;
                        self.setData({
                          imageUrl: tempFilePath,
                          isShow: true
                        })

                        wx.hideLoading();
                      },
                      fail: function(res) {
                        self.setData({
                          isShow: true
                        });
                        wx.hideLoading();
                      }
                    }, self);

                  })
                }
              },
              fail: function(res) {
                console.log(res)
              }
            })
          },
          fail: function() {
            console.log('失败')
          }
        })
      })
    },
    /**
     * 保存到相册
     */
    baocun: function() {
      var that = this
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imageUrl,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，赶紧晒一下吧~',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#333',
            success: function(res) {
              if (res.confirm) {
                /* 该隐藏的隐藏 */
                that.setData({
                  isShow: false
                })
              }
            },
            fail: function(res) {

            }
          })
        },
        fail(e) {
          wx.showModal({
            title: '提示',
            content: '您拒绝授权,图片无法存储,请删除小程序或设置授权',
            confirmText: '去设置',
            success: res => {
              if (res.confirm) {
                wx.openSetting({

                })
              }
            }
          })
        }

      })
    },
  },

})