Page({
  data: {
    userInfo: {}
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    this._init()
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  _init(){ //初始化函数
      // 获取用户的基础信息
     this.setUserInfo()
  },
  onGetAuthorize(){ //获取用户的信息
    console.log('点击确定')
    this.setUserInfo()
  },
  onAuthError(){ //获取用户信息错误捕获
  console.log('点击取消')
  },
  // 设置用户信息
  setUserInfo(){
    // 获取用户的基础信息
      my.getOpenUserInfo({ 
        fail: (res) => {
          console.log(res)
        },
        success: (res) => {
          let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
          const {avatar,nickName}= userInfo
          console.log(userInfo)
          if(userInfo.code == 10000){
              this.setData({
                userInfo: {
                  avatar,
                  nickName
                }
              })
          }
        }
      });
  },
  // 跳转到充电详情页面
  handleGoChargeList(){
    my.navigateTo({
      url: '/pages/chargelist/chargelist'
    });
  }
});
