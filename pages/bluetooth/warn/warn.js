const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    senceimg: '/assets/bluetooth/image/scansence.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    that.aaa();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /* 下拉刷新页面 */
  onPullDownRefresh: function (event) {
  },
  aaa: function () {
    var that = this;
    my.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        console.log('res===' + res);
        if (res.platform == "devtools") {
          console.log('访问来源' + res.platform);
        } else if (res.platform == "iOS") {
          that.setData({
            systemType: 1
          })
          console.log('访问来源' + res.platform);
        } else if (res.platform == "Android") {
          that.setData({
            systemType: 2
          })
          console.log('访问来源' + res.platform);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /** 扫描二维码 */
  scanQrcodeConnect: function () {
    var that = this;
    my.openBluetoothAdapter({
      success: function (res) {
        my.scan({
          success: function (res) {
            var q = res.code;
            console.log(q);
            var checkQrcode = q.indexOf('https://www.tengfuchong.cn/applet');
            if (checkQrcode != -1) {
              var urlLen = q.length;
              var i = q.lastIndexOf('/');
              var subq = q.substr(i + 1, 6);
              var port = q.substr(urlLen - 1);
              console.log("index" + i + "---截取字符串===" + subq);
              console.log("xitong==" + that.data.systemType);
              my.request({
                url: 'https://www.tengfuchong.cn/applet/findDeviceId',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                data: {
                  code: subq,
                  systemType: that.data.systemType
                },
                dataType: 'json',
                method: "POST",
                success: (res) => {
                  var dataval = res.data;
                  if (dataval == 0) {
                    my.alert({
                      title: '提示',
                      content: '设备不存在',
                      buttonText: '我知道了'
                    });
                  } else {
                    my.redirectTo({
                      url: '/pages/bluetooth/loading2/loading2?deviceCode=' + subq + '&port=' + port + '&systemType=' + that.data.systemType
                    })
                  }
                },

                fail: function (err) {
                  console.log(err.data);
                  my.showToast({
                    type: 'exception',
                    content: '服务器异常，清稍候再试'
                  })
                },
                complete: function () {
                  my.hideLoading();
                },
              })
            } else {
              my.showToast({
                type: 'fail',
                content: '二维码不正确',
                duration: 1000
              });
            }
          }
        });
      },
      fail: function() {
        my.showToast({
          type: 'fail',
          content: '系统检测到未打开蓝牙',
          duration: 1000
        });
      }
    })
  },
})