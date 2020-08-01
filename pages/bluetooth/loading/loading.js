const app = getApp();
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
    //在此函数中获取扫描普通链接二维码参数
    let q = JSON.stringify(my.getStorageSync({ key: 'scanUrl' }).data);
    var urlLen = q.length;
    var checkQrcode = q.indexOf('https://www.tengfuchong.cn/applet');
    if (checkQrcode != -1) {
      var i = q.lastIndexOf('/');
      var subq = q.substr(i + 1, 6);
      var port = q.substr(i + 7, 1);
      console.log("index" + i + "---截取字符串===" + subq);
      console.log("端口号===" + port);
      that.setData({
        subq : subq,
        port : port
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var systemType = null;
    my.getSystemInfo({
      success: (res) => {
        console.log('res===' + res);
        that.setData({
          systemInfo: res,
        })
        if (res.platform == "devtools") {
        console.log('访问来源1' + res.platform);
        } else if (res.platform == "iOS") {
          that.setData({
            systemType: '1'
          })
          systemType = 1;
          console.log('访问来源' + res.platform);
        } else if (res.platform == "Android") {
          that.setData({
            systemType: '2'
          })
          systemType = 2
        }
        my.request({
          url: 'https://www.tengfuchong.cn/applet/findDeviceId',
          headers: {'content-type': 'application/x-www-form-urlencoded'},
          data: {
            code: that.data.subq,
            systemType: systemType
          },
          dataType: 'json',
          method: "POST",
          success: (res) => {
            console.log('res'+res);
            var dataval = res.data.deviceid;
            if (dataval != undefined) {
              var merid = 0;
              merid = res.data.merid;
              my.openBluetoothAdapter({
                success: (res) => {
                  my.startBluetoothDevicesDiscovery({
                    // services: ['FFE0'],
                    allowDuplicatesKey: false,
                    success: (res) => {
                      my.onBluetoothDeviceFound(function (res) {
                        if (res.devices[0].name != undefined && (res.devices[0].name.indexOf('HD-' + that.data.subq) != -1
                    || res.devices[0].name.indexOf('JDY-08') != -1)) {
                          my.offBluetoothDeviceFound();
                          my.stopBluetoothDevicesDiscovery();
                          dataval = res.devices[0].deviceId;
                          my.request({
                            url: 'https://www.tengfuchong.cn/applet/queryCodeBindPhone?code=' + that.data.subq,
                            success: (res) => {
                              console.log(
                                '手机号码===' + res.data
                              )
                              my.redirectTo({
                                url: '/pages/bluetooth/incoins/incoins?id=' + dataval + '&name=' + that.data.subq + '&port=' + that.data.port + '&phonenum=' + res.data + '&merid=' + merid
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
            } else {
              my.showToast({
                content: '设备不存在',
                type:'fail',
                success: (res) => {
                  my.navigateTo({
                    url: '/pages/bluetooth/device/device'
                  });
                }
              })
            }
          },
          fail: function () {
            my.showToast({
                content: '服务器异常，请重新扫码进行连接',
                type:'fail',
                success: (res) => {
                  my.navigateTo({
                    url: '/pages/bluetooth/device/device'
                  });
                }
              })
            console.log('服务器异常!!!')
          }
        })
      },
      fail: (res) => {
        console.log('获取系统失败')
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    my.request({
      url: 'https://www.tengfuchong.cn/applet/findDeviceId',
      data: {
        code: that.data.subq,
        systemType: that.data.systemType
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: (res) => {
        var dataval = res.data;
        my.openBluetoothAdapter({
          success: (res) => {
            console.log('初始化蓝牙适配器成功');
            my.startBluetoothDevicesDiscovery({
              // services: ['ffe0'],
              allowDuplicatesKey: false,
              success: (res) => {
                console.log('这里是开始搜索附近设备', res);
                my.onBluetoothDeviceFound(function (res) {
                  console.log("成功", res);
                  console.log("-------" + that.data.systemType);
                  if (that.data.systemType == 1) {
                        dataval = res.devices[0].deviceId;
                        console.log('deviceid' + dataval);
                      }
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
                      success: function(res) {
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
      fail: function () {
        console.log('服务器异常')
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