// pages/opinion/opinion.js
Page({
  data:{
    descript:''
  },
  descript:function(e){
      this.setData({
      descript:e.detail.value
    })
  },
  sendMsg:function(){
    if(this.data.descript){
      wx.showToast({
      title:"提交成功",
      icon:"success",
      duration:5000
    })
    setTimeout(function(){
      wx.hideToast()
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function(res){
          // success
        }
      })
    },2000)
    }
    
  }
})