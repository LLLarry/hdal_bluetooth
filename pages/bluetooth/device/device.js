const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    senceimg: '/assets/bluetooth/image/scansence.jpg',
    uid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    //调用应用实例的方法获取全局数据
    that.aaa();
    // var uid = that.data.uid;
    // if (uid == null) {
    //   my.getAuthCode({
    //     success: (res) => {
    //       console.log(res);
    //       console.log(res.authCode);
    //       my.request({
    //         url: 'https://www.tengfuchong.cn/alipay/getuid',
    //         data: {
    //           authCode: res.authCode,
    //         },
    //         success: (res) => {
    //           console.log(res);
    //           that.setData({
    //             uid: res.data
    //           })
    //         },
    //       });
    //     },
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /* 初始化蓝牙适配器 */
    my.openBluetoothAdapter({
      success: (res) => {
        console.log('初始化蓝牙适配器成功' + res);
      },
      fail:(res) => {
        console.log('初始化蓝牙适配器失败' + res.errorMessage);
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var device = [];
  },

  /* 下拉刷新页面 */
  onPullDownRefresh: function (event) {
    var that = this;
    console.log('开始下拉刷新事件');
    my.showNavigationBarLoading();  //加载动画开始
    that.again_search();
  },
  again_search: function () {
    var that = this;
    var device = [];
    my.closeBluetoothAdapter({
      success:(res) => {
        console.log('关闭蓝牙模块');
      }
    });
    /* 初始化蓝牙适配器 */
    my.openBluetoothAdapter({
      success:(res) => {
        console.log('初始化蓝牙适配器成功');
        my.stopPullDownRefresh();
      },
      fail:(res) => {
        console.log('初始化蓝牙适配器失败' + res.errorMessage);
        my.stopPullDownRefresh();
      }
    })
  },
  aaa: function () {
    console.log("调用aaa");
    var that = this;
    my.getSystemInfo({
      success: (res) => {
        console.log('res===' + res);
        that.setData({
          systemInfo: res,
        })
        if (res.platform == "devtools") {
          console.log('访问来源' + res.platform);
        } else if (res.platform == "iOS") {
          that.setData({
            systemType: '1'
          })
          console.log('访问来源' + res.platform);
        } else if (res.platform == "Android") {
          that.setData({
            systemType: '2'
          })
          console.log('访问来源' + res.platform);
        }
      },
      fail: (res) => {
        console.log('获取系统失败')
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

  /**获取输入框中的值 */
  Sendval: function (e) {
    var that = this;
    that.setData({
      send_value: e.detail.value
    });
  },

  /**
   * 通过设备编号查询设备id（MAC）
   */
  findDevice : function () {
    var that = this;
    var sendval = that.data.send_value;
    my.navigateTo({
      // url: '../loading2/loading2?deviceCode=' + sendval
      url: '/pages/bluetooth/error/error'
    })
    console.log('code===' + sendval);
    console.log('systemType===' + that.data.systemType);
    my.openBluetoothAdapter({
      success: function(res) {
        my.showLoading({
          content: '正在连接',
        })
        my.request({
          url: 'https://www.tengfuchong.cn/applet/findDeviceId',
          data: {
            code: sendval,
            systemType: that.data.systemType
          },
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
              my.navigateTo({
                // url: '../loading2/loading2?deviceCode=' + sendval
                url: '/pages/bluetooth/error/error'
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
      },
      fail: function (res) {
        console.log(res)
      }
    })
    
  },
  /** 扫描二维码 */
  scanQrcodeConnect: function() {
    var that = this;
    // my.navigateTo({
    //   url: '../error/error'
    // })
    // return;
    my.scan({
      success: (res) => {
        var q = res.code;
        console.log(q);
        var checkQrcode = q.indexOf('https://www.tengfuchong.cn/applet');
        if (checkQrcode != -1) {
          var urlLen = q.length;
          var i = q.lastIndexOf('/');
          var subq = q.substr(i + 1, 6);
          var port = q.substr(urlLen - 1);
          console.log("index" + i + "---截取字符串===" + subq);
          my.showLoading({
            content: '查找设备...',
          })
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
              my.hideLoading();
              console.log('-=-' + JSON.stringify(res))
              if (res.data.deviceid == undefined) {
                my.showToast({
                  content: '设备不存在',
                  type:'fail'
                })
              } else {
                my.navigateTo({
                  url: '/pages/bluetooth/loading2/loading2?deviceCode=' + subq + '&port=' + port + '&systemType=' + that.data.systemType
                })
              }
            },

            fail: function (err) {
              console.log('err:' + JSON.stringify(err));
              my.showToast({
                content: '服务器异常，清稍候再试',
                type:'fail'
              })
            },
            complete: function () {
              my.hideLoading();
            },
            error: (res) => {
              console.log(res.data);
            }
          })
        } else {
          my.alert({
            title: '提示' ,
            content: '系统识别此二维码不可用',
            buttonText: '我知道了'
          });
        }
      },
      fail: (res) => {
        console.log('调起扫码失败===' + JSON.stringify(res));
      }
    });
  },
})