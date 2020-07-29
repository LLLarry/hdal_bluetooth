import api from '../api'

export const getUserid= (data)=>{
  return api({
    url: '/alipay/appletgetuid ',
    data,
    hideLoading: true
  })
}