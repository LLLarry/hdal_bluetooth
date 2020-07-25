import api from '../api'

// 获取通过设备号硬件版本号
export const getHardversionByCode= (data)=>{
  return api({
    url: "/alipayOrigin/getHardversion",
    hideLoading: true,
    data: data,
  })
}

// 获取通过设备号硬件版本号
export const deviceCharge= (data)=>{
  return api({
    url: "/alipayOrigin/deviceCharge",
    data: data,
  })
}