import api from '../api'
// 获取通过设备号硬件版本号
export const getHardversionByCode= (data)=>{
  return api({
    url: "/appletAlipay/getHardversion",
    hideLoading: true,
    data: data,
  })
}

// 获取通过设备号硬件版本号
export const deviceCharge= (data)=>{
  return api({
    url:  "/appletAlipay/deviceCharge",
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
