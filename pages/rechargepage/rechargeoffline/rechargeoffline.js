import { deviceCharge,getOfflinedeviceToCradID } from '/require/charge-api'
Page({
  data: {
    code: '', //设备号
    cardID: '', //离线卡号
    balance: 0,//卡余额
    defaultIndex: 0, //默认索引
    temList: [],
    phonenum: '',
    tipMessage: '获取数据异常', //提示信息
  },
  onLoad(options) {
    console.log('options',options)
    my.hideBackHome();
    this.handleGetCardID(options.code)
    this.setData({
      code: options.code
    })
  },
  // 获取设备上的充电卡
  async handleGetCardID(code){
    try {
      let info= await getOfflinedeviceToCradID({code,openid: '',nowtime: new Date().getTime()})
      if(info.code == 0){ //获取卡号成功
        this.setData({
          cardID: info.card_id,
          balance: info.card_surp / 10
        })
        this.handleInit(code)
      }else{ //获取失败
          this.setData({
            tipMessage: info.errinfo
          })
          return this.closeMiniPro.setData({isshow: true})
      }
      my.hideLoading()
    }catch(err){
       my.hideLoading()
        this.setData({
          tipMessage: '异常出错'
        })
        return this.closeMiniPro.setData({isshow: true})
    }
  },
  // 初始化数据
  async handleInit(code){
    try{
      let info= await deviceCharge({code})
      if(info.code === 200){ //成功
        if(!info.cardID){ //未查询到充电卡，提示，并退出
            this.setData({
              tipMessage: '未检测到充电卡'
            })
            return this.closeMiniPro.setData({isshow: true})
        }
        this.setData({
          defaultIndex: info.defaultindex,
          temList: info.templatelist,
          phonenum: info.phonenum,
        })
        //设置品牌名称
        if(info.brandname){
          my.setNavigationBar({
            title: info.brandname
          })
        }
      }else{ //失败
         this.closeMiniPro.setData({isshow: true})
      }
    }catch(e){ //出错
      this.closeMiniPro.setData({isshow: true})
    }
  },
  // 选择模板
  selectTem(item,index){
    this.setData({
      defaultIndex: index
    })
  },
   //获取 关闭小程序弹框实例
  handleGetCloseMini(ref){
     this.closeMiniPro= ref
  }
});
