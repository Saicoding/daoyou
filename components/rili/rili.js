// components/errorRecovery/errorRecovery.js
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    first:true,
    icons:[
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+EDc2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjgyNTc2NThFMzhDOTExRTlCNkIxQzExMkI5NzdBQTFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc4MjQ5NjQ4NDA3ODExRTlBQjc3OTg1QzhBOTEwQUYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc4MjQ5NjQ3NDA3ODExRTlBQjc3OTg1QzhBOTEwQUYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE0M0IxRDlGNDA3NzExRTk5OEU2Q0E3NkFCRTJFQkJCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE0M0IxREEwNDA3NzExRTk5OEU2Q0E3NkFCRTJFQkJCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAZABVAwERAAIRAQMRAf/EAJcAAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIIAQEAAgMBAQAAAAAAAAAAAAAABAUBAwYCBxAAAgECAgYGCAYDAAAAAAAAAAECEQMxBEFRYRITBSGBkSIyFHGhscHRYnKyQiNDY3MGJDQVEQEAAQMCAwYFAwUAAAAAAAAAARECAyEEMRIFQVFxMkITYZHBIgbwgdHhYrIzFP/aAAwDAQACEQMRAD8A+nr1+UpNRdIr1gaQAAAAAAAAGU2nVOjA3eZlwvnrSuwDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPMrkI4vqIGfqOPHpWstluKZeZX4xVZUitcnQgX9WnspDbGBrjncu3RXLbepTXxNcdXnvh7nbT3S28aP4lTaSLOrR6oa5w9z0mmqp1RaYdxZkitstN1sxxZNzyAAAACFmc8otwg8PFI43rHXvunFinSOMp2Db6VlS3+b37rcMk92ODvtVb+hP2spLL77lnbt7bdb/AJfyivKcSW/elK7N4ym3L2m2MNeLZ71NI0ZeRsU8C7EZ9iGPfuZt+cyrrlrsox025d6D6meJx3W8JZmbL/NCyyXN+K91rh5iKrK3imtcdZ4t3uTDdzRNEXLtqR32rjL5iF6NV4lijuOldUs3dlfXHGFVmwzZPwbS1aQABF5hmODl20+9LoiUf5Bv52+3nl81+kfVJ2uLnu+EOazl2dyay0X0PvXfRoifPNlh5p5pXuOIiOb5NluMYKiRe2WUabpq9nt5AAoI+Zst0uQe7cg6xktDI2fFExq3Y7+yeCby7PtOF7CvRcjtWKKzYbq7Z7mLuzt+MNO4wRMTa6JNNJrB4H1q26LoiY4SoZhkyAFLzy6/MW7ehRr2tr3HAfl+SZzWW9kW1+c/0Wuwt+2Z+Kmy3elcuvGUn8CDs7KWwssukRCUlRE9GZMAAAxLChi6NGYRbEty9dhodJL04FDv7NYlJu1iJdVy6455K1J6qdjaPpPQ8k37THM91PlMx9HPbm2mSUktWgA5/wDsEqZ6H8a+6RwH5ZZXcWz/AGfWVx0/yT4qzJPuNam/aRdrP2p2bilkpHAAAAxIguX+TN/LT1lNvdZhL9MOp5O68tsv6vuZ9A6BbTZ2fv8A5S5/ef7Z/XYmlwjMyi4yaeKAo/7NYfDtZlYQe5P0SwfajmPyba8+O3JHp0nwlZdOyazb3qHL3Ny808J9PXpOV219NFvdbW3wWCdUWUSiyyGAAB4u3FCDbPGS6kPdltZV0HKUqpVncaUVtfRFFXNk5L4iOM6JN8xHhDt8rYVjLWrK/Tio12pdJ9P22GMWO2yPTFHMZb+a6Z727de7vaK0N7wk5nhafHs94Fdn/LeSv+Z/19x8TXTZt1GjdcntXe55KatmHm545fNVwve3VXxaNdT5nNK6Oot4rPLcXcW8TMVaI+WldG/oJDSwAewxNSFfneLVb3g0kLNXtS8VKacUnkPA/wCpa42p8LVxNFeqtCy6F7f/AERzcfT4/rgib7m9qafv4Owju171abDu1CmfkcH9sD//2Q==',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+EDc2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhDREI1QTg4MzhDOTExRTk4RjZFQUE0ODUzOTEyMDU2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyQjI3NkRFNDA3ODExRTlCRERFQUE3NTQ5N0ZCNDZEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyQjI3NkRENDA3ODExRTlCRERFQUE3NTQ5N0ZCNDZEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkExMDAwQUMzNDA3NzExRTk5MjJEOUIxNEM3MDJDMTlBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkExMDAwQUM0NDA3NzExRTk5MjJEOUIxNEM3MDJDMTlBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAZABVAwERAAIRAQMRAf/EAG0AAQADAQEBAAAAAAAAAAAAAAABAwQFAggBAQAAAAAAAAAAAAAAAAAAAAAQAAIBAgMFBgQHAAAAAAAAAAABAhEDIRIEMUFRYRORscEiMgVxgaEU8UJicoIjYxEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+nr1+UpNRdIr6gUgAAAAAAAAJTadU6MC77mXS/XWleQFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlR4uiA9pW0se14ARnscY9oEtW3y+oHhxpjtXECAAAAAApvamFt02y7gKfubs8Ibd8mA6Lk63G5Pm/AB9vb4LsAdKcMbcnHlu7AC1U4uk8JcdzA0Wr8LqwwktqAsAAAK791WrUp71s+IHKtqV2423zYHQhBRQHoAAA8XbalFgYFOdi8mns7gOxCSlFSWxqoEgAMPukmoW47m2+z8QK9FHy14gawAAAAAwa2NGmBs9um5afH8ra8QNQADB7qq9L+XgB50T8iA1AAAAABi1rwpzA0+2Kmnl+59yA1gTKLjJp7UBl19vNYzb4Ovy2MDHp55JU4gbk6oAAAARJ0QGC9LPOu5AdLS2+nYjF7dr+LxAuyvLm3VoBp1PS3+vl4gZJZaOvp314Ach5avL6avLxpuA12M+XEC4AAAo1GemGzeBRZ6fVhn9FcfADrRy181acgNn9HR/zA//2Q=='
    ],
    qiandaos:new Array(30),
    SignDays:0,
    SignHeadImgs: [
      '/images/avatar.png',
      '/images/avatar.png',
      '/images/avatar.png',
      '/images/avatar.png',
      '/images/avatar.png',
      '/images/avatar.png'
    ],
    ksDate:0//还剩多少天
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
      let user = wx.getStorageSync('user');
      let zcode = user.zcode?user.zcode:'';
      let token = user.token?user.token:'';
      let self = this;
      let qiandaos = this.data.qiandaos;

      self.setData({
        isShow: true,
      })

      wx.showShareMenu({
        withShareTicket:true,
        success:function(e){
          console.log('ok')
        }
      })

      this.initQiandao();

      app.post(API_URL,"action=QianDao&zcode="+zcode+"&token="+token,false,false,"","",false,self).then(res=>{
        let result = res.data.data[0];
        console.log(result)
        let SignDays = result.SignDays;
        SignDays = 10;
        let SignHeadImgs = result.SignHeadImg;
        let SignNums = result.SignNums;
        let SendJifen = result.SendJifen;
        let current = SignDays - 3 <= 0 ? 0 : SignDays - 3;

        if (!SendJifen){
          this.daka = this.selectComponent("#daka");
          this.daka.setData({
            jifen:8
          })
          this.daka.showDialog();
        }


        self.setData({
          SignDays: SignDays,
          SignHeadImgs: SignHeadImgs,
          SignNums: SignNums,
          current: current
        })
      })

    },
    //根据连续签到天数和积分初始化签到数组
    initQiandao(){
      let qiandaos = this.data.qiandaos;
      for (let i = 0; i < qiandaos.length;i++){
        qiandaos[i] = {};

        if((i+1)%7 == 1){
          qiandaos[i].jifen = 5;
        } else if ((i + 1) % 7 == 2){
          qiandaos[i].jifen = 10;
        } else if ((i + 1) % 7 == 3) {
          qiandaos[i].jifen = 20;
        } else if ((i + 1) % 7 == 4) {
          qiandaos[i].jifen = 30;
        } else if ((i + 1) % 7 == 5) {
          qiandaos[i].jifen = 50;
        } else if ((i + 1) % 7 == 6) {
          qiandaos[i].jifen = 100;
        } else if ((i + 1) % 7 == 0) {
          qiandaos[i].jifen = 200;
        }
      }

      this.setData({
        qiandaos: qiandaos
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

    //点击海报按钮
    getHaibao:function(e){
      console.log('开发中')
    }
  }

})