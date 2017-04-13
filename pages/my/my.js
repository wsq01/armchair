var app = getApp()
var param={
  data: {
    userInfo: {},
    message:""
  },
  // 订单
  toMyOrder:function(){
    wx.navigateTo({
      url:'../order/order'
    })
  },
  // 活动
  toAct:function(){
    wx.showModal({
      title:'提示',
      content:'暂无优惠活动！',
      showCancel:false
    })
  },
  // 问题
  toIssue:function(){
    wx.navigateTo({
      url: '../issue/issue',
      success: function(res){
        // success
      }
    })
  },
  // 客服
  toCall:function(){
    wx.makePhoneCall({
      phoneNumber: '400-999-556',
      success: function(res) {
        // success
      }
    })
  },
  // 反馈
  feedback:function(){
    wx.navigateTo({
      url: '../opinion/opinion',
      success: function(res){
        // success
      }
    })
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
}
Page(param)