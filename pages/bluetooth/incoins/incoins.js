const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '1元', money: '1', remark: '1' },
      { name: '2元', money: '2', remark: '2' },
      { name: '3元', money: '3', remark: '3' },
      { name: '4元', money: '4', remark: '4' },
      { name: '5元', money: '5', remark: '5' },
      { name: '6元', money: '6', remark: '6' },
    ],
    val: 2,
    money_value: 2,
    openid: null,
    merid: 0,
    adimg: '/assets/bluetooth/image/ad1.png',
    uid: null,
    disabled: false
  },
  handle(e) {
    var that = this;
    that.setData({
      val: e.target.dataset.money,
      money_value: e.target.dataset.value,
      tempid: e.target.dataset.id
    })
    console.log('money===' + e.target.dataset.value)
  },
  // radioChange(e) {
  //   that.setData ({
  //     money_value: e.detail.value
  //   })
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getTemp(options.name);
    console.log("options===" + JSON.stringify(options))
    const uid= app.globalData.userid
    that.setData({
      deviceId: options.id,
      deviceName: options.name,
      port: options.port,
      adimg: '/assets/bluetooth/image/ad1.png',
      phonenum: options.phonenum,
      merid: options.merid,
      uid: uid
    });
    my.onSocketClose(function(res) {
      console.log('socket连接已关闭');
      my.offSocketOpen();
    });
  },

  /**
   * 获取设备相对应的模板
   */
  getTemp: function (code) {
    var that = this;
    console.log("设备号===" + code);
    my.request({
      url: 'https://www.tengfuchong.cn/applet/getTemps?code=' + code,
      method: 'POST',
      success: (res) => {
        console.log(res.data);
        if (res.data.length == 0) {
          that.setData({
            money_value: 2,
            val: 2
          })
        }
        if (res.data.length == 1) {
          that.setData({
            items: res.data,
            money_value: res.data[0].remark,
            val: res.data[0].money,
            tempid: res.data[0].id
          })
        } else {
          for (var index in res.data) {
            console.log(index + "=" + res.data[index].name);
            that.setData({
              items: res.data,
              money_value: res.data[1].remark,
              val: res.data[1].money,
              tempid: res.data[1].id
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    /* 初始化蓝牙适配器 */
    my.openBluetoothAdapter({
      success: (res) => {
        console.log('初始化蓝牙适配器成功');
        console.log('MAC===' + that.data.deviceId);
        /* 开始连接蓝牙设备 */
        my.showLoading({
          content: '连接中...',
        })
        my.connectBLEDevice({
          deviceId: that.data.deviceId,
          success: (res) => {
            console.log('连接成功', JSON.stringify(res));
            console.log('连接deviceId', that.data.deviceId);
            my.hideLoading();
            my.showToast({
              content: '连接成功',
              type: 'success',
              duration: 1000
            })
            /* 获取设备的服务UUID */
            my.getBLEDeviceServices({
              deviceId: that.data.deviceId,
              success: service => {
                console.log("service===" + JSON.stringify(service))
                // var all_UUID = service.services;    //取出所有的服务
                // console.log('所有的服务', all_UUID);
                // var UUID_lenght = all_UUID.length;  //获取到服务数组的长度
                /* 遍历服务数组 */
                // var serviceId = '';
                // for (var index = 0; index < UUID_lenght; index++) {
                  // var ergodic_UUID = all_UUID[index].serviceId;    //取出服务里面的UUID
                  // var UUID_slice = ergodic_UUID.slice(4, 8);   //截取4到8位
                  /* 判断是否是我们需要的FEE0 */
                  // console.log('uuid长度' + UUID_slice);
                  // console.log('uuid判别' + (UUID_slice == 'FEE0' || UUID_slice == 'ffe0'));
                  // if (UUID_slice == 'FFE0' || UUID_slice == 'ffe0') {
                  //   var index_uuid = index;
                  //   serviceId = all_UUID[index_uuid].serviceId;
                    // that.setData({
                    //   serviceId: all_UUID[index_uuid].serviceId    //确定需要的服务UUID
                    // });
                    // console.log('uuid' + all_UUID[index_uuid].uuid)
                  // };
                // };
                // console.log('连接deviceId', that.data.deviceId);
                that.setData({
                  serviceId: service.services[0].serviceId    //确定需要的服务UUID
                });
                that.Characteristics(that.data.deviceId,service.services[0].serviceId);     //调用获取特征值函数
              },
              fail: error => {
                my.alert({ content: JSON.stringify(error) });
              },
            });
          },
          fail: error => {
            my.hideLoading();
            my.alert({
              title: '提示',
              content: '连接失败，请确认设备是否在线',
              buttonText: '我知道了',
              success: () => {
                my.navigateTo({
                  url: '/pages/bluetooth/device/device',
                });
              }
            });
          }
        })
      },
    })
  },

  Characteristics: function (deviceId,serviceId) {
    var that = this;
    // console.log('this===' + that);
    console.log("deviceId" + deviceId)
    console.log("serviceId" + serviceId)
    var device_characteristics = '';
    var characteristics_uuid = '';
    my.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success: (res) => {
        console.log("使能res===" + JSON.stringify(res))
        var characteristics = res.characteristics;      //获取到所有特征值
        // var characteristics_length = characteristics.length;    //获取到特征值数组的长度
        // console.log('获取到特征值', characteristics);
        // console.log('获取到特征值数组长度', characteristics_length);
        /* 遍历数组获取notycharacteristicsId */
        // for (var index = 0; index < characteristics_length; index++) {
          // var noty_characteristics_UUID = characteristics[index].characteristicId;    //取出特征值里面的UUID
          // var characteristics_slice = noty_characteristics_UUID.slice(4, 8);   //截取4到8位
          /* 判断是否是我们需要的FEE1 */
          // if (characteristics_slice == 'FFE1' || characteristics_slice == 'ffe1') {
          //   var index_uuid = index;
          //   device_characteristics = characteristics[index_uuid].characteristicId;
          //   characteristics_uuid = characteristics[index_uuid].characteristicId;
            that.setData({
              notycharacteristicsId: characteristics[0].characteristicId,    //需确定要的使能UUID
              characteristicsId: characteristics[0].characteristicId         //暂时确定的写入UUID
            });
          // };
        // };
        // console.log('使能characteristicsId', that.data.notycharacteristicsId);
        // console.log('写入characteristicsId', that.data.characteristicsId);
        that.notycharacteristicsId(deviceId,serviceId,device_characteristics);       //使能事件

      },
    })
  },

  /* 使能函数 */
  notycharacteristicsId: function (deviceId,serviceId,device_characteristics) {
    var that = this;
    var recv_value_ascii = "";
    var string_value = "";
    var recve_value = "";
    my.notifyBLECharacteristicValueChange({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: device_characteristics,
      state: true,
      success: (res) => {
        // console.log('使能成功', res);
        /* 设备返回值 */
        my.onBLECharacteristicValueChange(function (res) {
          var length_hex = [];
          var turn_back = "";
          var turn_back_hex = "";
          var result = res.value;
          var hex = that.buf2hex(result);
          // console.log('返回的值', hex);
          // console.log('设备返回来的值', hex);
            var f_hex = hex;
            var length_soy = f_hex.length / 2;
            var length = Math.round(length_soy);
            for (var i = 0; i < length; i++) {
              var hex_spalit = f_hex.slice(0, 2);
              length_hex.push(hex_spalit);
              f_hex = f_hex.substring(2);
            }
            // console.log('length_hex', length_hex);

            for (var j = 0; j < length_hex.length; j++) {

              var integar = length_hex[j];    //十六进制
              recve_value = parseInt(integar, 16);    //十进制
              // console.log('recve_value', recve_value);

              turn_back = turn_back + String.fromCharCode(recve_value);
              turn_back_hex = turn_back_hex + integar;
              // console.log('turn_back', integar);
            }
            // console.log('返回值hex' + turn_back_hex);
            if (turn_back_hex == '5504830100d2') {
              my.hideLoading();
              my.showToast({
                title: '投币成功',
              })
            }
            // console.log('最终转回来的值', turn_back);
            var recv_number_1 = that.data.recv_number + turn_back.length;
            var recv_number = Math.round(recv_number_1);
            that.setData({
              recv_number: recv_number,
              recv_value: that.data.recv_value + turn_back
            })
        });
      },

      fail: function (res) {
        // console.log('使能失败', res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    my.disconnectBLEDevice({
      deviceId: that.data.deviceId, // 蓝牙设备id
      success: (res) => {
        console.log('断开连接：' + res);
        my.navigateTo({
          url: '/pages/bluetooth/device/device'
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    my.disconnectBLEDevice({
      deviceId: that.data.deviceId, // 蓝牙设备id
      success: (res) => {
        console.log('断开连接：' + res);
      },
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   
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

  Sendincoins : function () {
    var that = this;
    my.showLoading({
      content: '投币中...',
      delay: 1000,
    });
    setTimeout(() => {
      my.hideLoading();
    }, 5000);
    my.openBluetoothAdapter({
      success: (res) => {
        var send1 = 'aa';
        var send2 = '83';
        var send3 = '04';
        var send4 = '01';
        var send5 = '0' + that.data.port;
        var send6 = that.data.money_value + '' || '02';
        var valSize = send6.length;
        if (valSize < 2 && valSize > 0) {
          send6 = '0' + send6;
        }
        var send7 = send2 ^ send3 ^ send4 ^ send5 ^ send6;
        // console.log("拼凑值===" + send1 + '' + send2 + '' + send3 + '' + send4 + '' + send5 + '' + send6 + '' + send7)
        // var value_initial = 'aa830401010186';
        var value_initial = send1 + '' + send2 + '' + send3 + '' + send4 + '' + send5 + '' + send6 + '' + send7;
        console.log('发送数据===' + value_initial);
        
        /* 判断字节是否超过20字节 */
        if (value_initial.length > 20) {     //当字节超过20的时候，采用分段发送
          if (that.data.send_string == true) {    //选择16进制发送时
            var value_initial_exceed = value_initial;       //将输入框的值取过来，方便循环
            var value_initial_average = Math.ceil(value_initial_exceed.length / 20);        //将value_initial_exceed的长度除以20，余数再向上取一，确定循环几次
            // console.log('需要循环的次数', value_initial_average);
            for (var i = 0; i < value_initial_average; i++) {
              if (value_initial_exceed.length > 20) {
                var value_initial_send = value_initial_exceed.slice(0, 20);      //截取前20个字节
                // console.log('截取到的值', value_initial_send);
                value_initial_exceed = value_initial_exceed.substring(20);      //value_initial_exceed替换为取掉前20字节后的数据
                write_array.push(value_initial_send);       //将所有截取的值放在一个数组
              } else {
                write_array.push(value_initial_exceed);
              }
            }
            // console.log('write_array数组', write_array);
            write_array.map(function (val, index) {
              setTimeout(function () {
                var value_set = val;
                // console.log('value_set', value_set);
                var write_function = that.write(value_set);       //调用数据发送函数
              }, index * 100)
            });
            /* 发送的值的字节 */
            var send_number_1 = that.data.send_number + value_initial.length / 2;
            var send_number = Math.floor(send_number_1);
            that.setData({
              send_number: send_number
            });
          } else {      //选择Ascii码发送

            /* 当选择以Ascii字符发送的时候 */
            var value_split = value_initial.split('');  //将字符一个一个分开
            // console.log('value_split', value_split);
            for (var i = 0; i < value_split.length; i++) {
              value_ascii = value_ascii + value_split[i].charCodeAt().toString(16);     //转为Ascii字符后连接起
            }
            var Ascii_value = value_ascii;
            // console.log('转为Ascii码值', Ascii_value);
            // console.log('Ascii_value的长度', Ascii_value.length)
            var Ascii_send_time = Math.ceil(Ascii_value.length / 20);
            // console.log('Ascii发送的次数', Ascii_send_time);
            for (var i = 0; i < Ascii_send_time; i++) {
              if (Ascii_value.length > 20) {
                var value = Ascii_value.slice(0, 20);
                // console.log('截取到的值', value);
                Ascii_value = Ascii_value.substring(20);
                // console.log('此时剩下的Ascii_value', Ascii_value);
                write_array.push(value);        //放在数组里面
              } else {
                var value = Ascii_value;
                write_array.push(Ascii_value);        //放在数组里面
              }
            }
            // console.log('数组write_array', write_array);
            write_array.map(function (val, index) {
              setTimeout(function () {
                var value_set = val;
                // console.log('value_set', value_set);
                var write_function = that.write(value_set);       //调用数据发送函数
              }, index * 100)
            });
            /* 发送的值的字节 */
            var send_number_1 = that.data.send_number + value_initial.length;
            var send_number = Math.round(send_number_1);
            that.setData({
              send_number: send_number
            });
          }
        } else {
          /* 当选择了以Hex十六进制发送的时候 */
          var value = value_initial;
          var write_function = that.write(value);     //调用数据发送函数
          /* 成功发送的值的字节 */
          var send_number_1 = that.data.send_number + value_initial.length / 2;
          var send_number = Math.floor(send_number_1);
          that.setData({
            send_number: send_number
          });
        }
      },
      fail: function (res) {
        my.alert({
          title: '提示' ,
          content: '请开启手机蓝牙后再试',
          buttonText: '我知道了',
          success: (res) => {
            my.navigateTo({
              url: '/pages/bluetooth/device/device',
              success: function () {
                // console.log("success");
              },
              fail: function (res) {
                // console.log("fail" + res);
              }
            });
          }
        });
      }
    })
  },
  write: function (str) {
    var that = this;
    console.log("deviceId=" + that.data.deviceId);
    console.log("serviceId=" + that.data.serviceId);
    console.log("characteristicsId=" + that.data.characteristicsId);
    var value = str;
    console.log('value===' + value);
    var valSize = value.length;
    if (valSize < 2 && valSize > 0) {
      value = '0' + value;
    }
    my.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicsId,
      value: value,
      success: (res) => {
        console.log('数据发送成功', res);
        my.hideLoading();
        my.showToast({
          type: 'success',
          content: '投币成功',
          duration: 100,
          success: () => {
            my.navigateTo({
              url: '/pages/bluetooth/device/device',
            });
          }
        });
        return true;
      },
      fail: function (res) {
        console.log('调用失败', res);
        /* 调用失败时，再次调用 */
        my.writeBLECharacteristicValue({
          deviceId: that.data.deviceId,
          serviceId: that.data.serviceId,
          characteristicId: that.data.characteristicsId,
          value: value,
          success: (res) => {
            // console.log('第2次数据发送成功', res);
            my.hideLoading();
            my.showToast({
              type: 'success',
              content: '投币成功',
              duration: 100,
              success: () => {
                my.navigateTo({
                  url: '/pages/bluetooth/device/device',
                });
              }
            });
            return true;
          },
          fail: function (res) {
            console.log('第2次调用失败', res);
            /* 调用失败时，再次调用 */
            my.writeBLECharacteristicValue({
              deviceId: that.data.deviceId,
              serviceId: that.data.serviceId,
              characteristicId: that.data.characteristicsId,
              value: value,
              success: (res) => {
                my.hideLoading();
                my.showToast({
                  type: 'success',
                  content: '投币成功',
                  duration: 100,
                  success: () => {
                    my.navigateTo({
                      url: '/pages/bluetooth/device/device',
                    });
                  }
                });
                return true;
                // console.log('第3次数据发送成功', res);
              },
              fail: function (res) {
                // my.showToast({
                //   title: '设备不在线或距离较远',
                //   success: function() {
                //     my.navigateTo({
                //       url: '../device/device',
                //     });
                //   }
                // })
                my.alert({
                  title: '提示',
                  content: '设备不在线或距离较远',
                  buttonText: '我知道了',
                  success: () => {
                    my.navigateTo({
                      url: '/pages/bluetooth/device/device',
                    });
                  }
                });
                my.showToast({
                  title: '提示',
                  content: '设备不在线或距离较远',
                  showCancel: false,
                  success: (res) => {
                    if (res.confirm) {
                      my.navigateTo({
                        url: '/pages/bluetooth/device/device',
                      });
                    };
                  }
                })
                return false;
                // console.log('第3次调用失败', res);
              }
            });
          }
        });
      }
    });
  },
  Payincoins: function () {
    var that = this;
    console.log('uid===' + that.data.uid);
    that.setData({
      disabled: true
    })
    my.connectSocket({
      url: 'wss://www.tengfuchong.cn/websocket',
      success: function(res) {
        console.log('socket连接打开===' + JSON.stringify(res));
      }
    });
    var uid = that.data.uid;
    if (uid == null || uid == undefined) {
      console.log('uid is undefined or null');
      my.getAuthCode({
        success: (res) => {
          console.log(res);
          console.log('authCode===' + res.authCode);
          my.request({
            url: 'https://www.tengfuchong.cn/alipay/getuid',
            data: {
              authCode: res.authCode,
            },
            success: (res) => {
              console.log('授权===' + res);
              that.setData({
                uid: res.data
              })
              uid = res.data;
              that.wolfturnpay(res.data);
            },
          });
        },
      });
    } else {
      that.wolfturnpay(uid);
    }
  },
  wolfturnpay:function(uid) {
    var that = this;
    my.onSocketMessage(function(res) {
      console.log('接收socket连接消息' + JSON.stringify(res));
      var status = res.data;
      if (status == "1") {
        that.senddata();
        my.offSocketMessage();
        my.closeSocket();
      }
    });
    my.openBluetoothAdapter({
      success: (res) => {
          my.request({
            url: 'https://www.tengfuchong.cn/alipay/pay',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            data: {
              tempid: that.data.tempid,
              code: that.data.deviceName,
              port: that.data.port,
              uid: uid
            },
            dataType: 'text',
            method: "POST",
            success: (res) => {
              console.log('数据：' + res.data);
              my.tradePay({
                tradeNO: res.data, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
                success: (res) => {
                  console.log(res.resultCode);
                  var resultCode = res.resultCode;
                  if (resultCode == '6001') {
                    my.showToast({
                      type: 'fail',
                      content: '支付取消'
                    });
                    that.setData({
                      disabled: false
                    });
                    my.offSocketMessage();
                    my.closeSocket();
                  } else if (resultCode == '9000') {
                    my.showToast({
                      type: 'success',
                      content: '支付成功',
                      duration: 500,
                      success: function() {
                        my.disconnectBLEDevice({
                          deviceId: that.data.deviceId, // 蓝牙设备id
                          success: (res) => {
                            console.log('断开连接：' + res);
                            my.navigateTo({
                              url: '/pages/bluetooth/device/device'
                            });
                          },
                        });
                      }
                    });
                  }
                },
                fail: (res) => {
                  console.log('------' + res.resultCode);
                },
              });
            },
          });
      },
      fail: function() {
        my.showToast({
          content: '请开启手机蓝牙后再试',
          success: function () {
            my.navigateTo({
              url: '/pages/bluetooth/device/device',
              success: function () {
              },
              fail: function (res) {
              }
            });
          }
        });
      }
    })
  },
  checkBluetoothIfOpen:function () {
    my.openBluetoothAdapter({
      success: (res) => {
      },
      fail: function (res) {
        my.showToast({
          content: '请开启手机蓝牙后再试'
        });
        my.navigateTo({
          url: '/pages/bluetooth/device/device'
        })
      }
    })
  },
  senddata() {
    var that = this;
    var send1 = 'aa';
    var send2 = '83';
    var send3 = '04';
    var send4 = '01';
    var send5 = '0' + that.data.port;
    var send6 = that.data.money_value + '' || '02';
    var valSize = send6.length;
    if (valSize < 2 && valSize > 0) {
      send6 = '0' + send6;
    }
    var send7 = send2 ^ send3 ^ send4 ^ send5 ^ send6;
    var value_initial = send1 + '' + send2 + '' + send3 + '' + send4 + '' + send5 + '' + send6 + '' + send7;
    /* 判断字节是否超过20字节 */
    if (value_initial.length > 20) {     //当字节超过20的时候，采用分段发送
      if (that.data.send_string == true) {    //选择16进制发送时
        var value_initial_exceed = value_initial;       //将输入框的值取过来，方便循环
        var value_initial_average = Math.ceil(value_initial_exceed.length / 20);        //将value_initial_exceed的长度除以20，余数再向上取一，确定循环几次
        // console.log('需要循环的次数', value_initial_average);
        for (var i = 0; i < value_initial_average; i++) {
          if (value_initial_exceed.length > 20) {
            var value_initial_send = value_initial_exceed.slice(0, 20);      //截取前20个字节
            // console.log('截取到的值', value_initial_send);
            value_initial_exceed = value_initial_exceed.substring(20);      //value_initial_exceed替换为取掉前20字节后的数据
            write_array.push(value_initial_send);       //将所有截取的值放在一个数组
          } else {
            write_array.push(value_initial_exceed);
          }
        }
        // console.log('write_array数组', write_array);
        write_array.map(function (val, index) {
          setTimeout(function () {
            var value_set = val;
            // console.log('value_set', value_set);
            var write_function = that.write(value_set);       //调用数据发送函数
          }, index * 100)
        });
        /* 发送的值的字节 */
        var send_number_1 = that.data.send_number + value_initial.length / 2;
        var send_number = Math.floor(send_number_1);
        that.setData({
          send_number: send_number
        });
      } else {      //选择Ascii码发送

        /* 当选择以Ascii字符发送的时候 */
        var value_split = value_initial.split('');  //将字符一个一个分开
        // console.log('value_split', value_split);
        for (var i = 0; i < value_split.length; i++) {
          value_ascii = value_ascii + value_split[i].charCodeAt().toString(16);     //转为Ascii字符后连接起
        }
        var Ascii_value = value_ascii;
        // console.log('转为Ascii码值', Ascii_value);
        // console.log('Ascii_value的长度', Ascii_value.length)
        var Ascii_send_time = Math.ceil(Ascii_value.length / 20);
        // console.log('Ascii发送的次数', Ascii_send_time);
        for (var i = 0; i < Ascii_send_time; i++) {
          if (Ascii_value.length > 20) {
            var value = Ascii_value.slice(0, 20);
            // console.log('截取到的值', value);
            Ascii_value = Ascii_value.substring(20);
            // console.log('此时剩下的Ascii_value', Ascii_value);
            write_array.push(value);        //放在数组里面
          } else {
            var value = Ascii_value;
            write_array.push(Ascii_value);        //放在数组里面
          }
        }
        // console.log('数组write_array', write_array);
        write_array.map(function (val, index) {
          setTimeout(function () {
            var value_set = val;
            // console.log('value_set', value_set);
            var write_function = that.write(value_set);       //调用数据发送函数
          }, index * 100)
        });
        /* 发送的值的字节 */
        var send_number_1 = that.data.send_number + value_initial.length;
        var send_number = Math.round(send_number_1);
        that.setData({
          send_number: send_number
        });
      }
    } else {
      /* 当选择了以Hex十六进制发送的时候 */
      var value = value_initial;
      var write_function = that.write(value);     //调用数据发送函数
      /* 成功发送的值的字节 */
      var send_number_1 = that.data.send_number + value_initial.length / 2;
      var send_number = Math.floor(send_number_1);
      that.setData({
        send_number: send_number
      });
    }
  },
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  base64_encode: function (str) { // 编码，配合encodeURIComponent使用
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVmyYZabcdefghijklmnopqrstuvmyyz0123456789+/=";
    var i = 0, len = str.length, strin = '';
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
        strin += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
        strin += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin
  },
  callPhone: function() {
    var that = this;
    console.log('商家手机号码==' + that.data.phonenum);
    my.makePhoneCall({
      number: that.data.phonenum,
      success: (res_makephone) => {
        console.log("呼叫电话返回：", res_makephone)
      }
    })
  },
  Backhome: function() {
    var that = this;
    my.disconnectBLEDevice({
      deviceId: that.data.deviceId, // 蓝牙设备id
      success: (res) => {
        console.log('断开连接：' + res);
        my.navigateTo({
          url: '/pages/bluetooth/device/device'
        });
      },
    });
  },
  inadver: function() {
    my.navigateTo({
      url: '/pages/bluetooth/ad/ad',
    })
  }
})