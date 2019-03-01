// pages/shuati/mynote/mynote.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_nums:0,//笔记总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({//设置标题
      title: '我的笔记',
    })

    this.setData({
      options: options,//上个页面的参数
      first:true//默认首次载入
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    let first = self.data.first;//是否首次载入参数
    let options = self.data.options;//上个页面传过来的参数
    let typesid = options.typesid;//科目id

    if(first){//如果首次载入

      //********个人信息*********
      let user = wx.getStorageSync('user');
      let zcode = user.zcode?user.zcode:'';
      let token = user.token?user.token:'';
      //************************

      self.setData({//默认没有载入
        isLoaded:false
      })

      app.post(API_URL,"action=getMyNoteType&token="+token+"&zcode="+zcode+"&typesid="+typesid,false,false,"","",false,self).then(res=>{
        let notes = res.data.data;//笔记列表
        console.log(notes)
        let all_nums = self.getNumOfNote(notes)//得到笔记数量

        self.setData({
          notes:notes,//笔记列表
          isLoaded:true,//已经载入完毕
          first:false,//首次载入已被污染
          all_nums:all_nums,//笔记总数
        })
      })
    }
  },

/**
 * 得到笔记数量
 */
  getNumOfNote:function(notes){
    let nums = 0;
    for(let i = 0 ; i < notes.length;i++){
      let note = notes[i];
      nums+=note.nums;
    }

    return nums;
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})