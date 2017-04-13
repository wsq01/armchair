var app = getApp();
var param = {
    data: {
        pattern1: null,
        pattern2: null,
        pattern3: null,
        selected: 1,
        sid: '',
        ID: '', //订单id
        manId: '', //num标识
        mac: '',
        mode: 1, //模式
        turnMode:'', //模式名
        address: '',//地址
        token: '',
        time_pay: '0000-00-00 00:00:00',
        price: '', //价格
        channelId: '',
        did: '',
        floor: '', //地区
        building: '',//详细地址
        socketName: '',
        pattern_time: 1 //时长 分钟

    },
    chosePtn1: function () {
        var that = this;
        that.setData({
            selected: 1,
            mode: 1,
            turnMode:that.data.pattern1.name,
            price:that.data.pattern1.amount,
            pattern_time:that.data.pattern1.duration
        })
    },
    chosePtn2: function () {
        var that = this;
        that.setData({
            selected: 2,
            mode: 2,
            turnMode:that.data.pattern2.name,
            price:that.data.pattern2.amount,
            pattern_time:that.data.pattern2.duration
        })
    },
    chosePtn3: function () {
        var that = this;
        that.setData({
            selected: 3,
            mode: 3,
            turnMode:that.data.pattern3.name,
            price:that.data.pattern3.amount,
            pattern_time:that.data.pattern3.duration
        })
    },


    // 模式选择确认
    toPay: function () {
        var that = this;
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 50000
        })
        that.device_detail();
    },
    // 查询设备状态
    device_detail: function () {
        var that = this;
        // 先获取token
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/gizwit.php',
            data: {
                cmd: 'get_token',
                product_key: '68badfdc59634329b3c4be931d7322cb',
                enterprise_id: 'c82feec27e5f4a2e94c23da4a4027cf0',
                enterprise_secret: 'd03ac997f4dd46a097f02edd7081b488',
                product_secret: 'fc5b0892db8a458e8f2881dff5aeabb8'
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res);
                that.setData({
                    token: res.data.token
                })
                wx.request({
                    url: 'https://washer.mychaochao.cn/db/armchair/db/gizwit.php',
                    data: {
                        cmd: 'device_detail',
                        product_key: '68badfdc59634329b3c4be931d7322cb',
                        token: res.data.token,
                        mac: that.data.mac
                    },
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': "PHPSESSID=" + that.data.sid
                    },
                    success: function (res) {
                        console.log(res);
                        if (res.data.re.is_online == false) {
                            wx.hideToast();
                            wx.showModal({
                                content: '设备未开启，请联系管理员!',
                                title: '提示',
                                showCancel: false
                            })
                        } else if (res.data.re.is_online == true) {
                            that.add_order();
                        } else if (res.data.re.error_code == '5301') {
                            wx.hideToast();
                            wx.showModal({
                                content: 'device not exist',
                                title: '提示',
                                showCancel: false
                            })
                        }
                    }
                })
            }
        })
    },
    // 添加订单接口
    add_order: function () {
        var that = this;
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/order.php',
            data: {
                cmd: 'add_order',
                sid: that.data.sid,
                duration: that.data.pattern_time,
                socket: that.data.manId,
                amount: that.data.price,
                addr: that.data.address,
                mode: that.data.mode,
                uid: wx.getStorageSync('uid')
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "PHPSESSID=" + that.data.sid
            },
            success: function (res) {
                that.setData({
                    ID: res.data.id
                });
                that.resPayment();
            }
        })
    },
    //发起订单付款接口
    resPayment: function () {
        var that = this;
        var price=(that.data.price*100).toString();
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/order.php',
            data: {
                openid: wx.getStorageSync('openid'),
                sid: that.data.sid,
                cmd: 'payJoinfee',
                attach:'man奢',
                body:that.data.address,
                fee:price
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "PHPSESSID=" + that.data.sid
            },
            success: function (res) {
                wx.hideToast();
                var data = res.data.split("[")[0];
                data = JSON.parse(data);
                // 发起支付
                wx.requestPayment({
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': data.signType,
                    'paySign': data.paySign,
                    'success': function (res) {
                        that.confirm_pay();
                    }
                });
            }
        })
    },
    // 确认订单付款接口
    confirm_pay: function () {
        var that = this;
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/order.php',
            data: {
                cmd: 'confirm_pay',
                sid: that.data.sid,
                id: that.data.ID,
                openid: wx.getStorageSync('openid')
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "PHPSESSID=" + that.data.sid
            },
            success: function (res) {
                var startTime = new Date();
                var start_time = that.formatDateTime(startTime);
                that.setData({
                    time_pay: start_time
                })
                //跳转页面
                wx.redirectTo({
                    url: '../time/time?address=' + that.data.address + '&price=' + that.data.price + '&time_pay=' + that.data.time_pay + '&channelId=' + that.data.channelId + '&duringMs=' + that.data.pattern_time + '&token=' + that.data.token + '&did=' + that.data.did + '&mode=' + that.data.turnMode,
                    success: function (res) {
                        // success
                    }
                })
            }
        })
    },
    // 获取洗衣机id设置mac
    get_washer: function () {
        var that = this;
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/socket.php',
            data: {
                cmd: 'get',
                sid: that.data.sid,
                num: that.data.manId
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "PHPSESSID=" + that.data.sid
            },
            success: function (res) {
                console.log(res);
                that.setData({
                    price: res.data.sockets[0].price,
                    channelId: res.data.sockets[0].index,
                    floor: res.data.sockets[0].floor,
                    socketName: res.data.sockets[0].socketname
                })
                var device = res.data.sockets[0].device; //洗衣机控制器ID
                // 获取洗衣机控制器
                wx.request({
                    url: 'https://washer.mychaochao.cn/db/armchair/db/socket.php',
                    data: {
                        cmd: 'get_device',
                        sid: that.data.sid,
                        id: device
                    },
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': "PHPSESSID=" + that.data.sid
                    },
                    success: function (res) {
                        console.log(res);
                        that.setData({
                            mac: res.data.devices[0].mac,
                            did: res.data.devices[0].did
                        })
                        wx.request({
                            url: 'https://washer.mychaochao.cn/db/armchair/db/floor.php',
                            data: {
                                cmd: 'get',
                                sid: that.data.sid,
                                id: res.data.devices[0].floor
                            },
                            method: 'POST',
                            header: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Cookie': "PHPSESSID=" + that.data.sid
                            },
                            success: function (res1) {
                                console.log(res1);
                                wx.request({
                                    url: 'https://washer.mychaochao.cn/db/armchair/db/building.php',
                                    data: {
                                        cmd: 'get',
                                        sid: that.data.sid,
                                        id: res1.data.floors[0].building
                                    },
                                    method: 'POST',
                                    header: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Cookie': "PHPSESSID=" + that.data.sid
                                    },
                                    success: function (res2) {
                                        console.log(res2)
                                        var address = res2.data.buildings[0].name + res1.data.floors[0].name;
                                        that.setData({
                                            address: address
                                        })
                                    }
                                })

                            }
                        })
                    }
                })
            }
        })
    },
    // 设置模式
    get_mode: function () {
        var that=this;
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/socket.php',
            data: {
                cmd: "get_mode",
                sid: that.data.sid,
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "PHPSESSID=" + that.data.sid
            },
            success: function (res) {
                console.log(res);
                that.setData({
                    pattern1:res.data.modes[0],
                    pattern2:res.data.modes[1],
                    pattern3:res.data.modes[2],
                    price:res.data.modes[0].amount,
                    pattern_time:res.data.modes[0].duration,
                    turnMode:res.data.modes[0].name
                })
            }
        })
    },
    onLoad: function (option) {
        this.setData({
            sid: app.globalData.sid,
            manId: option.manId,
        })
        this.get_washer();
        this.get_mode();
    },
    formatDateTime: function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        var ms = date.getSeconds()
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + ms;
    }
}
Page(param)