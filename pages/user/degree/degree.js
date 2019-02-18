// pages/hasNoErrorShiti/hasNoErrorShiti.js


const API_URL = 'https://xcx2.chinaplat.com/'; //接口地址
const app = getApp();

// start雷达图初始化数据
let numCount = 5; //元素个数
let numSlot = 5; //一条线上的总节点数
let windowWidth = wx.getSystemInfoSync().windowWidth; //窗口高度

let mW = wx.getSystemInfoSync().windowWidth; //Canvas的宽度

let mCenter = mW / 2 - 25 * (windowWidth / 750); //中心点
let mAngle = Math.PI * 2 / numCount; //角度
let mRadius = mCenter - 40 * (750 / windowWidth); //半径(减去的值用于给绘制的文本留空间)
//获取指定的Canvas
let radCtx = wx.createCanvasContext("radarCanvas")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepText: 5,
    chanelArray: [
      ["政策法规", "20"],
      ["导游业务", "20"],
      ["全国导游基础", "80"],
      ["地方导游基础", "20"],
      ["服务能力", "60"]
    ],
    loaded: false,
  
    startYear: 2018,
    endYear: new Date().getFullYear()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //获取是否有登录权限
    let self = this;
    let user = wx.getStorageSync('user');
    self.setData({
      user: user
    })

  },

  onReady: function () {
    let self = this;
    this.getStudyRate();
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
        })
      }
    });
  },

  getStudyRate(user, kmid, date_j) {
    let self = this;
    self.drawRadar(self.data.chanelArray)
      self.setData({
        loaded: true
       
      })
    // let str = encodeURI("action=MyLearningProSin&username=" + user.username + "&acode=" + user.acode + "&kmid=" + kmid + "&date_j=" + date_j)

    // console.log("action=MyLearningProSin&username=" + user.username + "&acode=" + user.acode + "&kmid=" + kmid + "&date_j=" + date_j)

    // app.post(API_URL, "action=MyLearningProSin&username=" + user.username + "&acode=" + user.acode + "&kmid=" + kmid + "&date_j=" + date_j, false, false, "").then((res) => {
    //   console.log(res)
    //   let chanelArray = self.data.chanelArray;
    //   let rate = res.data.data[0];
    //   chanelArray[0][1] = rate.zhangjie;
    //   chanelArray[1][1] = rate.shijuan;
    //   chanelArray[2][1] = rate.shipin;
    //   chanelArray[3][1] = rate.miji;
    //   chanelArray[4][1] = rate.kaodian;

    //   //雷达图
    //   self.drawRadar(chanelArray)
    //   self.setData({
    //     loaded: true,
    //     chanelArray: chanelArray
    //   })
    //})
  },

  /**
   * 在返回页面的时候
   */
  onShow: function () {

  },

  // 雷达图
  drawRadar: function (chanelArray) {
    let sourceData = chanelArray

    //调用
    this.drawEdge()
    this.drawLinePoint()
    //设置数据
    this.drawRegion(sourceData, 'rgba(255, 0, 0, 0.4)') //第一个人的
    //设置文本数据
    this.drawTextCans(sourceData)
    //设置节点
    this.drawCircle(sourceData, '#0197f6')
    //开始绘制
    radCtx.draw()
  },
  // 绘制5条边
  drawEdge: function () {
    radCtx.setStrokeStyle("#d6d6d6")
    radCtx.setLineWidth(1) //设置线宽
    for (let i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      let rdius = mRadius / numSlot * (i + 1)
      //画6条线段
      for (let j = 0; j < numCount; j++) {
        //坐标
        let x = mCenter + rdius * Math.cos(mAngle * j - 18 * Math.PI / 180);
        let y = mCenter - 30 + rdius * Math.sin(mAngle * j - 18 * Math.PI / 180);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function () {
    radCtx.beginPath();
    for (let k = 0; k < numCount; k++) {
      let x = mCenter + mRadius * Math.cos(mAngle * k - 18 * Math.PI / 180);
      let y = mCenter - 30 + mRadius * Math.sin(mAngle * k - 18 * Math.PI / 180);

      radCtx.moveTo(mCenter, mCenter - 30);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function (mData, color) {

    radCtx.beginPath();
    for (let m = 0; m < numCount; m++) {
      let x = mCenter + mRadius * Math.cos(mAngle * m - 18 * Math.PI / 180) * mData[m][1] / 100;
      let y = mCenter - 30 + mRadius * Math.sin(mAngle * m - 18 * Math.PI / 180) * mData[m][1] / 100;

      radCtx.lineTo(x, y);
    }
    radCtx.closePath();
    radCtx.setFillStyle(color)
    radCtx.fill();
  },

  //绘制文字
  drawTextCans: function (mData) {

    radCtx.setFillStyle("black")
    radCtx.font = 'bold 15px' //设置字体
    for (let n = 0; n < numCount; n++) {
      let x = mCenter + mRadius * Math.cos(mAngle * n - 18 * Math.PI / 180);
      let y = mCenter - 30 + mRadius * Math.sin(mAngle * n - 18 * Math.PI / 180);
      //通过不同的位置，调整文本的显示位置
      switch (n) {
        case 0:
          radCtx.fillText(mData[0][0], x + 5, y - 5); //右上
          break;
        case 1:
          radCtx.fillText(mData[1][0], x, y + 15); //右下
          break;
        case 2:
          radCtx.fillText(mData[2][0], x - radCtx.measureText(mData[2][0]).width, y + 15); //左下
          break;
        case 3:
          radCtx.fillText(mData[3][0], x - radCtx.measureText(mData[3][0]).width - 5, y - 5); //左上
          break;
        case 4:
          radCtx.fillText(mData[4][0], x - (radCtx.measureText(mData[4][0]).width) / 2, y - 20); //上
          break;
      }
    }

    radCtx.font = 'bold 12px' //设置字体
    for (let n = 0; n < numCount; n++) {
      let x = mCenter + mRadius * Math.cos(mAngle * n - 18 * Math.PI / 180);
      let y = mCenter - 30 + mRadius * Math.sin(mAngle * n - 18 * Math.PI / 180);
      //通过不同的位置，调整文本的显示位置
      switch (n) {
        case 0:
          radCtx.fillText(mData[0][1] + "%", x + 25, y + 11); //右上
          break;
        case 1:
          radCtx.fillText(mData[1][1] + "%", x + 10, y + 30); //右下
          break;
        case 2:
          radCtx.fillText(mData[2][1] + "%", x - radCtx.measureText(mData[2][0]).width - 5, y + 30); //左下
          break;
        case 3:
          radCtx.fillText(mData[3][1] + "%", x - radCtx.measureText(mData[3][0]).width - 15, y + 11); //左上
          break;
        case 4:
          radCtx.fillText(mData[4][1] + "%", x - (radCtx.measureText(mData[4][0]).width) / 2, y - 5); //上
          break;
      }
    }
  },
  //画点
  drawCircle: function (mData, color) {
    let r = 3; //设置节点小圆点的半径
    for (let i = 0; i < numCount; i++) {
      let x = mCenter + mRadius * Math.cos(mAngle * i - 18 * Math.PI / 180) * mData[i][1] / 100;
      let y = mCenter - 30 + mRadius * Math.sin(mAngle * i - 18 * Math.PI / 180) * mData[i][1] / 100;

      radCtx.beginPath();
      radCtx.arc(x, y, r, 0, Math.PI * 2);
      radCtx.fillStyle = color;
      radCtx.fill();
    }

  }
})
  