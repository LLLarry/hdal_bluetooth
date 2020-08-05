import { getOnlinecardNumData,bindPhone } from '/require/onlinecard-api'
import { getTradeNoFormScancharge } from '/require/charge-api'
import { compatibleCloseMiniPro,asyGetUserId } from '/utils/index'
import pay from '/utils/pay';
const app= getApp()
let getOptions= null
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
    cardstatus: 0 //卡状态
  },
  onLoad(options) {
    getOptions= options
  },
  onReady(){
    setTimeout(()=>{
      my.hideBackHome();
      this.handleInit(getOptions.cardNumber)
      this.setData({
        onlinecardNum:getOptions.cardNumber
      })
    },300)
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
          carduid: info.carduid,
          cardstatus: info.cardstatus,
          tipMessage: '获取数据异常', //提示信息
        })
        if(info.brandname){
          my.setNavigationBar({
            title: info.brandname
          })
        }
      }else if(info.code === 2010){ //在线卡绑定手机号
          // this.setData({
          //   tipMessage: info.message
          // })
          // this.closeMiniPro.setData({isshow: true})
          compatibleCloseMiniPro.call(this,info.message)
      }else {
        // this.setData({
        //   tipMessage: info.message
        // })
        // this.closeMiniPro.setData({isshow: true})
        compatibleCloseMiniPro.call(this,info.message)
      }
    } catch (error) {
      // this.setData({
      //     tipMessage: '异常错误'
      //   })
      // this.closeMiniPro.setData({isshow: true})
      compatibleCloseMiniPro.call(this,'异常错误')
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
          // this.setData({
          //   tipMessage: info.code === 200 ? '绑定成功' : '绑定失败'
          // })
          // this.closeMiniPro.setData({isshow: true})
          compatibleCloseMiniPro.call(this,info.code === 200 ? '绑定成功' : '绑定失败')
        }else{
          // this.setData({
          //     tipMessage: '关闭此页面'
          // })
          // this.closeMiniPro.setData({isshow: true})
          compatibleCloseMiniPro.call(this,'关闭此页面')
        }
      },
    });
  },
  // 点击充值
  async handleSubmit(){
    let userid= app.globalData.userid
    if(!userid){
      userid= await asyGetUserId(app)
    }
    const checkList= [
      {
        check: !!userid,
        content: '为获取到用户id',
      },
      {
        check: this.data.temList.length > 0,
        content: '模板数据为空',
      },
      {
        check: !!this.data.onlinecardNum,
        content: '未获取到在线卡号',
      },
    ]
    pay.call(this,checkList,()=>(
      getTradeNoFormScancharge({
        userid,
        tempid: this.data.temList[this.data.defaultIndex].id,
        param: this.data.onlinecardNum,
        hardversion: '在线卡'
      })
    ))
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
