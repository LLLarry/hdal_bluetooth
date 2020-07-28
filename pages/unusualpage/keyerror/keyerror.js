Page({
  data: {
    statuscode: 0
  },
  onLoad(options) {
    my.hideBackHome();
    let statuscode 
    if(options.status == 201){
      if(options.type == 1){ //设备
        statuscode= 2001 //设备号错误
      }else if(options.type == 2){ //在线卡
        statuscode= 3001 //在线卡号错误
      }
    }else if(options.status == 400){
      statuscode= 4001 //路径错误
    }
    this.setData({
      statuscode
    })
    my.setNavigationBar({
      title: statuscode == 2001 ? '设备号错误' :  statuscode == 3001 ? '在线卡号错误' : statuscode == 4001 ? '路径错误' :  '异常错误'
    })
  },
});
