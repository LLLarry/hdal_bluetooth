Page({
  data: {
    defaultIndex: 0, //默认索引
    temList: [
      { id:1,name: '充50送10',money: 50 },
      { id:2,name: '充200送40',money: 200 },
      { id:3,name: '充300送60',money: 300 },
      { id:4,name: '充400送80',money: 400 },
      { id:5,name: '充500送100',money: 500 },
      { id:6,name: '充600送120',money: 600 },
    ]
  },
  onLoad() {},
  // 选择模板
  selectTem(item,index){
    this.setData({
      defaultIndex: index
    })
  },
});
