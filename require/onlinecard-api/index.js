import api from '../api'

//获取在线充值页面数据
export const getOnlinecardNumData= (data)=>{
  return api({
    url: '/appletAlipay/scanOnlinCard',
    data
  })
}

//在线卡绑定手机号
export const bindPhone= (data)=>{
  return api({
    url: '/appletAlipay/bindingPhone',
    data
  })
}
