//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: my.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        console.log(res);
        my.getAuthUserInfo({
          success: (res) => {
            console.log('111--' + res);
            that.setData({
              userInfo: res,
              hasUserInfo: true
            })
          },
        });
      },
      fail: (res) => {
        my.showToast({
            type: 'fail',
            content: '获取失败'
        });
      }
    });
  },
  getUserinfo: function() {
    var that = this;
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        console.log(res);
        my.getAuthUserInfo({
          success: (res) => {
            that.setData({
              userInfo: res,
              hasUserInfo: true
            })
          },
        });
      },
      fail: (res) => {
        my.showToast({
            type: 'fail',
            content: '获取失败'
        });
      }
    });
  }
})
