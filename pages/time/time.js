var param = {
    data: {
        clock: '',
        avatar:'',
        total_pay:0,
        discount:0,
        address:'',
        duringMs:6,
        time_pay:'',
        did:'',
        token:'',
        channelId:'',
        mode:'',
        setTime:''
    },
    onLoad: function (option) {
        console.log(option);
        var that=this;
        that.setData({
            avatar:wx.getStorageSync('avatarUrl'),
            address:option.address,
            total_pay:option.price,
            token:option.token,
            did:option.did,
            time_pay:option.time_pay,
            channelId:option.channelId,
            mode:option.mode,
            setTime:option.duringMs,
            duringMs:option.duringMs*60*1000-1*1000
        });
        that.control();
    },
    /* 毫秒级倒计时 */
    count_down: function () {
        var that = this;
        // 渲染倒计时时钟  
        that.setData({
            clock: that.date_format(that.data.duringMs)
        });
        if (that.data.duringMs <= 0) {
            that.setData({
                clock: "已完成"
            });
            return;
        }
        setTimeout(function () {
            that.data.duringMs -= 1000;
            that.count_down();
        }
            , 1000)
    },
     // 数据点远程控制
    control: function () {
        var that = this;
        // var startTime = new Date();
        // var start1_hour = startTime.getHours();
        // var start1_min = startTime.getMinutes();
        // startTime.setMinutes(startTime.getMinutes() + that.data.pattern_time);
        // var stop1_hour = startTime.getHours();
        // var stop1_min = startTime.getMinutes();
        // var start_time = that.formatDateTime(startTime);
        // that.setData({
        //     time_pay: start_time
        // })
        wx.request({
            url: 'https://washer.mychaochao.cn/db/armchair/db/gizwit.php',
            data: {
                cmd: 'control',
                product_key: '68badfdc59634329b3c4be931d7322cb',
                token: that.data.token,
                did: that.data.did,
                attrs: JSON.stringify({
                     ["ac" + that.data.channelId]: true,
                    ['countdown' + that.data.channelId]: parseInt(that.data.setTime),
                })
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res3) {
                console.log(res3);
        that.count_down();            
            }
        })
    },
    /* 格式化倒计时 */
    date_format: function (micro_second) {
        var that = this;
        // 秒数  
        var second = Math.floor(micro_second / 1000);
        // 小时位  
        var hr = Math.floor(second / 3600);
        // 分钟位  
        var min = that.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
        // 秒位  
        var sec = that.fill_zero_prefix(second % 60);
        return hr + ":" + min + ":" + sec + " ";
    },
    /* 分秒位数补0 */
    fill_zero_prefix: function (num) {
        return num < 10 ? "0" + num : num
    },
}
Page(param)