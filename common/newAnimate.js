/**
 * 我的方法  
 * timingFunction:
 *1.linear 动画从头到尾的速度是相同的 
 *2.ease 动画以低速开始，然后加快，在结束前变慢
 *3.ease-in 动画以低速开始
 *4.ease-in-out 动画以低速开始和结束
 *5.ease-out 动画以低速结束
 *6.step-start 动画第一帧就跳至结束状态直到结束
 *7.step-end 动画一直保持开始状态，最后一帧跳到结束状态
 */
function myAnimation(obj){
  let ani = wx.createAnimation({
    duration: obj.duration ? obj.duration:400,
    timingFunction: obj.timingFunction ? obj.timingFunction:'ease',
    delay: obj.delay ? obj.delay:0,
    transformOrigin: obj.transformOrigin ? obj.transformOrigin :'50% 50%'
  })
  return ani
}

/**
 * 变大动画
 */
function big1(obj,num){
  let ani = myAnimation(obj);
  ani.scaleY(num).step().scaleY(1).step();

  return ani.export();
}

/**
 * 旋转
 */
function rate1(obj,num){
  let ani = myAnimation(obj);
  ani.rotate(num).step().rotate(0).step();
  return ani.export();
}

/**
 * Y轴旋转
 */
function rate2(obj,num){
  let ani = myAnimation(obj);
  ani.rotateY(num).step().rotateY(0).step();;
  return ani.export();
}

module.exports = {
  big1: big1,
  rate1: rate1,
  rate2: rate2
}