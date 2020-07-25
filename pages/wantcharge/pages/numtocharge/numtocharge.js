Page({
  data: {
    inputVal: '', //输入框的值
    check: false, //检验输入的设备号是否合法
  },
  onLoad() {},
  changeInput(e){ //输入框中的值发生变化
    let val= e.detail.value 
    this.setData({
     inputVal: val,
     check: val.length === 6 
    })
  },
  // 点击常用电站
  onItemClick(e){
    var code = e.target.dataset.code
     this.setData({
     inputVal: code,
     check: true
    })
  },
  // 开始充电
  handleCharge(){
    my.reLaunch({
      url: `/pages/loading/loading?code=${this.data.inputVal}`
    });
  }
});
