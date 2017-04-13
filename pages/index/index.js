var app = getApp();
var param = {
  // 扫码
  scanCode: function () {
    wx.scanCode({
      success: function (res) {
        console.log(res);
        wx.request({
          url: 'https://washer.mychaochao.cn/db/armchair/db/socket.php',
          data: {
            sid: app.sid,
            cmd: 'get',
            num: res.result
          },
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': "PHPSESSID=" + app.sid
          },
          success: function (res1) {
            console.log(res1);
            if (res1.data.sockets.length == 0) {
              wx.showModal({
                title: '提示',
                content: '非法二维码！',
                showCancel: false
              })
            } else {
              wx.setStorageSync('manId', res.result);
              wx.navigateTo({
                url: "../pattern/pattern?manId=" + res.result,
                success: function (res) {

                }
              })
            }
          }
        })
      }
    })
  },
  onShareAppMessage:function(){
    return {
      title:"按摩椅",
      path:"/pages/index/index"
    }
  }
}
Page(param)