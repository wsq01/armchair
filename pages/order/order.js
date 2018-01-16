var app=getApp();
var param = {
    data: {
        myOrders: [{
            address: '大地影城一层大厅',
            startTime: '2017-01-06  14:25',
            pattern: '通行气血',
            status: '订单已完成',
            price: '￥ 10.00',
        }]
    },
    onLoad: function () {
        var that=this;
        // 获取洗衣订单接口
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/order.php',
            data: {
                sid: app.globalData.sid,
                cmd: 'get_orders',
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "PHPSESSID=" + app.globalData.sid
            },
            success: function (res) {
                console.log(res);
                if (res.data.errno == "1") {
                    if(res.data.orders.length==0){
                        wx.showModal({
                            content:'无订单',
                            title:'提示',
                            showCancel:false
                        })
                    }
                    var order = res.data.orders;
                    for (var i = 0; i < order.length; i++) {
                        if (order[i].status == "0") {
                            order[i].status = "订单未付款"
                        } else if (order[i].status == "1") {
                            order[i].status = "订单已付款"
                        } else {
                            order[i].status = "订单已完成"
                        }


                        if (order[i].mode == "3") {
                            order[i].mode = "舒张筋骨"
                        } else if (order[i].mode == "2") {
                            order[i].mode = "通行气血"
                        } else {
                            order[i].mode = "唤醒身体"
                        }
                    }
                }
                that.setData({
                    myOrders:order
                })
            }
        })
    }
}
Page(param)