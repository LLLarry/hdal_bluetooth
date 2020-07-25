Page({
  data: {
    result: {
      money: '3.00',
      status: 1,
      items: [
        {name: '订单编号',value: '14556456231123134564'},
        {name: '支付方式',value: '支付宝支付'},
        {name: '结束原因',value: '充电完成'},
        {name: '设备编号',value: '002253'},
        {name: '充电端口',value: '03'},
        {name: '开始时间',value: '2020-07-20 02:05:45'},
        {name: '结束时间',value: '结束时间'}
      ]
    },
  },
  onLoad() {},
  handleGoHome(){
    my.switchTab({
      url: '/pages/nowCharge/nowCharge'
    });
  }
});
