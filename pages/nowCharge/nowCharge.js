Page({
  data: {
    list: [
          {
            id: 1,
            time: '2020-05-23 16:22:45',
            status: 1,
            chargetime: '04:23',
            money: 1
          },
          {
            id: 2,
            time: '2020-05-23 16:22:45',
            status: 1,
            chargetime: '04:23',
            money: 1
          },
          {
            id: 3,
            time: '2020-05-23 16:22:45',
            status: 1,
            chargetime: '04:23',
            money: 1
          }
        ],
    result: {
      money: '4.00',
      status: 1,
      items: [
        {name: '订单编号',value: '14556456231123134564'},
        {name: '支付方式',value: '支付宝支付'},
        {name: '结束原因',value: '充电完成'},
        {name: '设备编号',value: '002253'},
        {name: '充电端口',value: '03'},
        {name: '预计剩余时间',value: '173分钟'},
        {name: '充电更新时间',value: '2020-07-21 15:39:04'}
      ]
    },
  },
 
  onLoad() {},
});
