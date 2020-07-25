Page({
  data: {
    defaultIndex: 0,
    paytype: 1, //支付方式 1、支付宝 2、钱包  3、包月  如果ifwallet == 1 时 paytype = 2
    temList: [
      { id: 1,name: '一元一个币', money: 1  },
      { id: 2,name: '一元一个币', money: 1  },
      { id: 3,name: '一元一个币', money: 1  },
      { id: 4,name: '一元一个币', money: 1  },
      { id: 5,name: '一元一个币', money: 1  },
    ]
  },
  onLoad() {},
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
  }
});
