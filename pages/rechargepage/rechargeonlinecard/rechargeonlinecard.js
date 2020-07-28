import { getOnlinecardNumData,bindPhone } from '/require/onlinecard-api'
Page({
  data: {
    defaultIndex: 0, //默认索引
    temList: [],
    onlinecardNum: '', //在线卡号
    tournick: '', //持卡人
    tourphone: '', //持卡人手机号
    areaname: '', //所属小区
    cardtopupmoney: 0, //在线卡充值金额
    cardsendmoney: 0, //在线卡赠送金额
    servephone: '', //服务电话
    tipMessage: '异常错误', //提示信息
    carduid: '', //在线卡绑定用户的id
  },
  onLoad(options) {
    my.hideBackHome();
    this.handleInit(options.cardNumber)
    this.setData({
      onlinecardNum:options.cardNumber
    })
  },
  // 获取初始化数据
  async handleInit(cardNum){
    try {
      let info= await getOnlinecardNumData({cardNum})
      if(info.code === 200){
        this.setData({
          tournick: info.tournick,
          tourphone: info.tourphone,
          areaname: info.areaname,
          cardtopupmoney: info.cardtopupmoney,
          cardsendmoney: info.cardsendmoney,
          temList: info.tempsonlist,
          servephone: info.servephone,
          carduid: info.carduid
        })
        if(info.brandname){
          my.setNavigationBar({
            title: info.brandname
          })
        }
      }else if(info.code === 2010){ //在线卡绑定手机号
          
      }else {
        this.setData({
          tipMessage: info.message
        })
        this.closeMiniPro.setData({isshow: true})
      }
    } catch (error) {
      this.setData({
          tipMessage: '异常错误'
        })
      this.closeMiniPro.setData({isshow: true})
    }
  },
  //在线卡绑定手机号
  handleBindPhone(){
    my.prompt({
      title: '提示',
      message: '在线卡未绑定手机号，请输入手机号进行绑定',
      placeholder: '输入手机号',
      okButtonText: '绑定',
      cancelButtonText: '取消',
      success: async (result) => {
        if(result.ok){
          let info= await bindPhone({uid: this.data.carduid,phone: result.inputValue})
          this.setData({
            tipMessage: info.code === 200 ? '绑定成功' : '绑定失败'
          })
          this.closeMiniPro.setData({isshow: true})
        }else{
          this.setData({
              tipMessage: '关闭此页面'
          })
          this.closeMiniPro.setData({isshow: true})
        }
      },
    });
  },
  // 点击充值
  handleSubmit(){
    my.alert({
      title: '提示',
      content: JSON.stringify({
        onlinecardNum: this.data.onlinecardNum,
        selectTem: this.data.temList[this.data.defaultIndex]
      })
    });
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
