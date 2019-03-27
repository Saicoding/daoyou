// pages/shuati/mynote/mynote.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_nums:0,//题总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;

    wx.setNavigationBarTitle({//设置标题
      title: type=='note'?'我的笔记':'我的错题',
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

      let action = options.type == 'note' ? 'getMyNoteType' :'getErrTypeList';

      app.post(API_URL, "action=" + action+"&token="+token+"&zcode="+zcode+"&typesid="+typesid,false,false,"","",false,self).then(res=>{
        let tis = res.data.data;//题列表
       
        let all_nums = self.getNumOfTi(tis)//得到题数量

        self.setData({
          tis:tis,//题列表
          isLoaded:true,//已经载入完毕
          first:false,//首次载入已被污染
          all_nums:all_nums,//题总数
        })
      })
    }
  },

/**
 * 得到题数量
 */
  getNumOfTi:function(tis){
    let nums = 0;
    for(let i = 0 ; i < tis.length;i++){
      let ti = tis[i];
      nums+=ti.nums;
    }

    return nums;
  },

  /**
   * 导航到试题页面
   */
  GOnoteAndErr:function(e){
    let typesid = this.data.options.typesid;
    let type = this.data.options.type;
    let title =  e.currentTarget.dataset.title;
    let index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: '/pages/shuati/noteAndErrList/noteAndErr/noteAndErr?title=' + title + "&typesid=" + typesid + "&type=" + type+"&index="+index,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})