// components/jiaocheng/jiaocheng.js
const API_URL = 'https://xcx2.chinaplat.com/daoyou/'; //接口地址
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: 1333
    },
    videoid: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loaded: false,
    useFlux: false, //是否使用流量观看
    isWifi: true, //默认有wifi
    lastType: "first",
    show:false,
    first: true //第一次播放
  },

  ready: function() {
    this.video = wx.createVideoContext('myVideo', this);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //阻止事件冒泡
    stopBubbling: function(e) {

    },

    //点击了空地,让蒙版消失
    tapBlank: function(e) {
      this.video.pause();//停止播放
      this.setData({
        show: false,
      })
    },
    //显示模板
    show: function() {
      this.setData({
        show: true,
      })
    },

    //关闭模板
    hide: function() {
      this.setData({
        show: false
      })
    },

    //切换模板
    toogleShow: function() {
      let self = this;
      let first = this.data.first;
      let user = wx.getStorageSync('user');
      let video_id = this.data.videoid; //视频id
      let zcode = user.zcode ? user.zcode : '';
      let token = user.token ? user.token : '';

      if (!this.data.show) {//如果目前是隐藏状态就显示
        if (first) { //如果第一次展示,并且是隐藏状态
          console.log("action=getTestVideo&token=" + token + "&zcode=" + zcode + "&video_id=" + video_id)
          app.post(API_URL, "action=getTestVideo&token=" + token + "&zcode=" + zcode + "&video_id=" + video_id, false, false, "", "", false, self).then(res => {
            let videoUrl = res.data.data[0].files_url;

            self.setData({
              first: false,
              videoUrl: videoUrl,
              show: true,
            })
            
            self.video.play();
          })
        }else if(this.data.hasNoVideo){//如果没有视频信息
          wx.showToast({
            title: '没有对应视频教程',
            icon:'none',
            duration:3000
          })
        }else{
          self.video.play();
          self.setData({
            show: true,
          })
        }
      }
    },

    //关闭提示
    closePrompt: function() {
      this.setData({
        showPrompt: false
      })
    },

    //播放
    play:function(){
      if(this.data.notBuy){
        wx.showModal({
          content: '购买学习计划或本课程后,可直接进行观看,是否加入?',
          confirmColor:'#1acc76',
          confirmText:'加入',
          success:function(e){
            if(e.confirm){
              wx.navigateTo({
                url: '/pages/index/xuexijihua/xuexijihua',
              })
            }
          }
        })
      }else{
        this.video.play();
      }
    },

    //切换播放状态
    tooglePlay: function() {

    }
  }
})