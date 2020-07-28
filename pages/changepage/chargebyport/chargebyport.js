import { deviceCharge } from '/require/charge-api'
Page({
  data: {
    code: '', //设备号
    paytypeShow: true, //支付方式弹出层
    chargeInfoShow: false, //充电信息弹框
    selectPort: '', //默认选中端口
    defaultIndex: 1, //默认选中索引
    paytype: 1, //支付方式 1、支付宝 2、钱包  3、包月  如果ifwallet == 1 时 paytype = 2
    result: null,
    // result: {
    //     "code": "000001",
    //     "equname": "测试名称",
    //     "phonenum": "15538065635",
    //     "areaname": "测试小区",
    //     "chargeInfo": "功率区间 0-200w 1元1小时\n 功率区间 200-400w 2元1小时\n 功率区间 400-600w 3元1小时\n 功率区间 600-800w 4元1小时\n",
    //     "defaultIndex": 1,  //默认选中模板索引
    //     "ifwallet": 2, //是否强制钱包支付
    //     "sendmoney": 15.00, //钱包赠送
    //     "balance": 12.00, //钱包充值
    //     "portList": [ //端口list
    //       {
    //         "port": 1, //端口号
    //         "status": 1 //端口状态 1 空闲 、 2、占用  3、损坏
    //       },
    //       {
    //         "port": 2,
    //         "status": 2
    //       },
    //       {
    //         "port": 3,
    //         "status": 3
    //       },
    //       {
    //         "port": 4,
    //         "status": 3
    //       },
    //       {
    //         "port": 5,
    //         "status": 1
    //       },
    //       {
    //         "port": 6,
    //         "status": 1
    //       },
    //       {
    //         "port": 7,
    //         "status": 1
    //       },
    //       {
    //         "port": 8,
    //         "status": 1
    //       },
    //       {
    //         "port": 9,
    //         "status": 1
    //       },
    //        {
    //         "port": 10,
    //         "status": 1
    //       },
    //     ],
    //     "templatelist": [
    //       {
    //         "id": 556,
    //         "money": 1.00,
    //         "name": "1元1小时"
    //       },
    //       {
    //         "id": 557,
    //         "money": 2.00,
    //         "name": "2元2小时"
    //       },
    //       {
    //         "id": 558,
    //         "money": 3.00,
    //         "name": "3元3小时"
    //       }
    //     ]
    //   }
        },
        onLoad(options) {
          my.hideBackHome();
          my.setNavigationBar({
            title: '测试品牌名称'
          })
          const code= options.code.substr(0,6)
          const selectPort= options.code.substr(6)
           this.setData({
            code,
            selectPort
          })
          this.handleInit(options.code)
        },
        async handleInit(code){
          try{
            let info=  await deviceCharge({code: code})
            if(info.code === 200){
              this.setData({
                defaultIndex: info.defaultindex,
                result: info
              })
            }else{
             this.closeMiniPro.setData({isshow: true})
            }
          }catch(e){
            console.log(e)
            this.closeMiniPro.setData({isshow: true})
          }
        },
        // 关掉支付方式弹出层
        onPopupClose(){
          this.setData({
            paytypeShow: false,
            chargeInfoShow: true
          })
        },
        // 关闭充电信息弹框
        handleCloseChargeInfo(){
          this.setData({
            chargeInfoShow: false,
            paytypeShow: true
          })
        },
         // 打开充电信息弹框
        handleOpenChargeInfo(){
          this.setData({
            chargeInfoShow: true,
            paytypeShow: false
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
        //获取 关闭小程序弹框实例
        handleGetCloseMini(ref){
          this.closeMiniPro= ref
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
