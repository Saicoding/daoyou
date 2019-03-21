function t(t, e) {
  this.appId = t, this.sessionKey = e;
}

var e = require("cryptojs.js").Crypto;

getApp();

t.prototype.decryptData = function (t, s) {
  var t = e.util.base64ToBytes(t), p = e.util.base64ToBytes(this.sessionKey), s = e.util.base64ToBytes(s), o = new e.mode.CBC(e.pad.pkcs7);
  try {
    var r = e.AES.decrypt(t, p, {
      asBpytes: !0,
      iv: s,
      mode: o
    }), a = JSON.parse(r);
  } catch (t) {
    console.log(t);
  }

  if(a){
    return a.watermark.appid, this.appId, a;
  }else{
    return null;
  }

}, module.exports = t;