import api from '../api'
// 获取通过设备号硬件版本号
export const getHardversionByCode= (data)=>{
  return api({
    url: "/appletAlipay/getHardversion",
    hideLoading: true,
    data: data,
  })
}

// 获取通过设备号获取充电信息
export const deviceCharge= (data)=>{
  return api({
    url:  "/appletAlipay/deviceCharge",
    data: data,
  })
}

// 通过设备号获取设备端口状态
export const getPortStatus= (data)=>{
  return api({
    url: "/portstate1",
    data: data,
  })
}


//通过设备号、端口号获取端口状态
export const getPortStatusByPort= (data)=>{
  return api({
    url: "/portstate2",
    data: data,
  })
}

// 获取离线充值机的充值卡号
export const getOfflinedeviceToCradID= (data)=>{
  return api({
    url:  "/queryOfflineCard",
    data: data,
  })
}


// 十路智慧款获取trade_no
export const getTradeNoFormchargeport= (data)=>{
   return api({
    url:  "/alipay/newUserChargePay",
    data: data,
  })
}


// 脉冲、离线卡获取trade_no
export const getTradeNoFormScancharge= (data)=>{
   return api({
    url:  "/alipay/scanAlipayPayment",
    data: data,
  })
}

