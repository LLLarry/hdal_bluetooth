import { deviceCharge } from '/require/charge-api'
Page({
  data: {
      code: '', //设备号
      paytypeShow: false, //支付方式弹出层
      chargeInfoShow: false, //充电信息弹框
      selectPort: null, //默认选中端口
      defaultIndex: 1, //默认选中模板索引
      paytype: 1, //支付方式 1、支付宝 2、钱包  3、包月  如果ifwallet == 1 时 paytype = 2
      result: null,
    },
        onLoad(options) {
          my.hideBackHome();
          my.setNavigationBar({
            title: '测试品牌名称'
          })
          this.setData({
            code: options.code
          })
          this.handleInit(options.code)
        },
        // 初始化获取数据
        async handleInit(code){
          try{
            let info=  await deviceCharge({code})
            if(info.code === 200){
              this.setData({
                defaultIndex: info.defaultindex,
                result: info
              })
            }else{
              my.alert({
                title: '提示',
                content: '相应失败，请稍后再试！'
              })
            }
          }catch(e){
            my.alert({
              title: '提示',
              content: '<navigator open-type="exit" target="miniProgram">Navigate</navigator>',
            })
          }
        },
        // 关掉支付方式弹出层
        onPopupClose(){
          this.setData({
            paytypeShow: false
          })
        },
        // 关闭充电信息弹框
        handleCloseChargeInfo(){
          this.setData({
            chargeInfoShow: false
          })
        },
         // 打开充电信息弹框
        handleOpenChargeInfo(){
          this.setData({
            chargeInfoShow: true
          })
        },
        // 设置选中端口号
        handleSetSelectPort(port){
          this.setData({
            selectPort: port,
            paytypeShow: true
          })
        },
        // 设置选中模板
        handleSelectTem(index){
          this.setData({
            defaultIndex: index
          })
        },
        //设置支付方式
        handleSetPayType(paytype){
          this.setData({
            paytype
          })
        },
        // 点击开始充电按钮
        handleSubmit(){
          my.alert({
            title: '选中信息',
            content: JSON.stringify({
              paytype: this.data.paytype,
              selectPort: this.data.selectPort,
              defaultIndex: this.data.defaultIndex,
              tem: this.data.result.templatelist[this.data.defaultIndex]
            })
          })
        }
      });
