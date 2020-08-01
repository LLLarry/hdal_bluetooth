const app = getApp();
var utils = require('/utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      subq: options.deviceCode,
      port: options.port,
      systemType : options.systemType
    })
    my.setStorage({
      key: 'loaddata', // 缓存数据的key
      data: {
        subq: options.deviceCode,
        port: options.port,
        systemType : options.systemType
      }, // 要缓存的数据
      success: (res) => {
        
      },
    });
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
    var that = this;
    my.stopBluetoothDevicesDiscovery({
      success: (res) => { },
    })
    my.closeBluetoothAdapter({
      success: (res) => { },
    })
    my.getStorage({
      key: 'loaddata', // 缓存数据的key
      success: (res) => {
        console.log(res);
        var code = res.data.subq;
        var systemType = res.data.systemType;
        var port = res.data.port;
        console.log('code===' + res.data.subq);
        console.log('systemType2===' + res.data.systemType);
        my.request({
          url: 'https://www.tengfuchong.cn/applet/findDeviceId',
          headers: {'content-type': 'application/x-www-form-urlencoded'},
          data: {
            code: code,
            systemType: systemType
          },
          dataType: 'json',
          method: "POST",
          success: (res) => {
            console.log('res'+res);
            var dataval = res.data.deviceid;
            var merid = 0;
            merid = res.data.merid;
            my.openBluetoothAdapter({
              success: (res) => {
                console.log('初始化蓝牙适配器成功');
                my.startBluetoothDevicesDiscovery({
                  // services: ['FFE0'],
                  allowDuplicatesKey: false,
                  success: (res) => {
                    console.log('这里是开始搜索附近设备', res);
                    my.onBluetoothDeviceFound(function (res) {
                      dataval = res.devices[0].deviceId;
                      if (res.devices[0].name != undefined && (res.devices[0].name.indexOf('HD-' + that.data.subq) != -1
                  || res.devices[0].name.indexOf('JDY-08') != -1)) {
                        my.stopBluetoothDevicesDiscovery({
                          success: (res) => {
                            console.log("停止搜索附近设备");
                            my.offBluetoothDeviceFound();
                          },
                        });
                        my.request({
                          url: 'https://www.tengfuchong.cn/applet/queryCodeBindPhone?code=' + that.data.subq,
                          success: (res) => {
                            console.log(
                              '手机号码===' + res.data
                            )
                            my.redirectTo({
                              url: '/pages/bluetooth/incoins/incoins?id=' + dataval + '&name=' + code + '&port=' + port + '&phonenum=' + res.data + '&merid=' + merid
                            })
                          }
                        })
                      }
                    });
                  },
                });
              },
              fail: function () {
                my.closeBluetoothAdapter({
                  success: (res) => {
                    my.redirectTo({
                      url: '/pages/bluetooth/warn/warn',
                    })
                  },
                })
              }
            })
          },
          fail: function (err) {
            console.log('服务器异常!!!' + JSON.stringify(err))
          }
        })
      },
    });
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    my.stopBluetoothDevicesDiscovery({
      success: function(res) {
      },
    })
    my.closeBluetoothAdapter({
      success: function(res) {},
    })
    that.loadBletooth();
  },
  loadBletooth: function() {
    var that = this;
    var code = that.data.subq;
    var systemType = that.data.systemType;
    console.log('code===' + that.data.subq);
    console.log('code===' + that.data.systemType);
    my.request({
      url: 'https://www.tengfuchong.cn/applet/findDeviceId',
      data: {
        code: code,
        systemType: systemType
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: (res) => {
        var dataval = res.data;
        console.log('dataval === ' + dataval);
        my.openBluetoothAdapter({
          success: (res) => {
            console.log('初始化蓝牙适配器成功');
            my.startBluetoothDevicesDiscovery({
              services: ['ffe0'],
              allowDuplicatesKey: false,
              success: (res) => {
                console.log('这里是开始搜索附近设备', res);
                my.onBluetoothDeviceFound(function (res) {
                  console.log("成功", res);

                  if (res.devices[0].deviceId.indexOf(dataval) != -1) {
                    my.stopBluetoothDevicesDiscovery({
                      success: (res) => {
                        console.log("停止搜索附近设备");
                        my.offBluetoothDeviceFound();
                      },
                    });
                    my.stopPullDownRefresh();
                    my.request({
                      url: 'https://www.tengfuchong.cn/applet/queryCodeBindPhone?code=' + that.data.subq,
                      success: (res) => {
                        my.redirectTo({
                          url: '/pages/bluetooth/incoins/incoins?id=' + dataval + '&name=' + that.data.subq + '&port=' + that.data.port + '&phonenum=' + res.data
                        })
                      }
                    })
                  }
                });
              },
            });
          },
        })
      },
      fail: function () {
        my.closeBluetoothAdapter({
          success: (res) => {
            my.redirectTo({
              url: '/pages/bluetooth/warn/warn',
            })
          },
        })
      }
    })
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
  }
})