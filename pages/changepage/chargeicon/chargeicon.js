import { deviceCharge } from '/require/charge-api'
Page({
  data: {
    defaultIndex: 0, //默认索引
    paytype: 1, //支付方式 1、支付宝 2、钱包  3、包月  如果ifwallet == 1 时 paytype = 2
    temList: [],
    phonenum: "", //商户手机号
    ifwallet: 2, //是否强制钱包支付
  },
  onLoad(options) {
    my.hideBackHome();
    this.handleInit(options.code)
  },

  // 初始化数据
  async handleInit(code){
    try{
      let info= await deviceCharge({code})
      if(info.code === 200){ //成功
        this.setData({
          defaultIndex: info.defaultindex,
          temList: info.templatelist,
          phonenum: info.phonenum,
          ifwallet: info.ifwallet,
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
  //设置支付方式
  handleSetPayType(paytype){
    this.setData({
      paytype
    })
  },
  // 
  // 选择模板
  selectTem(item,index){
    this.setData({
      defaultIndex: index
    })
  },
  // 点击开始充电
  handleSubmit(){
    my.alert({
      title: '提示',
      content: JSON.stringify({
        paytype: this.data.paytype,
        selectTem: this.data.temList[this.data.defaultIndex]
      })
    });
  },
  //获取 关闭小程序弹框实例
  handleGetCloseMini(ref){
     this.closeMiniPro= ref
  }
});
