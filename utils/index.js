import Qs from 'qs'
/**
 * 
 * @param {string} base_url //扫码基础路径，在app.js中配置的全局变量
 * @param {string} url //要检测的地址
 * @param {number} type // 检测的类型 1、设备   2、在线卡
 * 返回值 {object} status：400 检验地址不通过，201 检验在线卡/设备号不通过 200是校验成功
 * type：1、校验设备地址 2、检验在线卡地址
 */
export const checkURL= (base_url,url)=>{
  const list= url.split('?')
  const c_url= list[0]
  const c_data= Qs.parse(list[1])
  const checkState= [
    {
      path: '/oauth2pay',
      regexp: /^\d{6,8}$/,
      key: 'code'
    },
    {
      path: '/oauth2online',
      regexp: /^[0-9A-F]{8}$/i,
      key: 'cardNumber'
    }
  ]
  if(c_url.includes(base_url+checkState[0].path)){
    return{
       status: checkState[0].regexp.test(c_data[checkState[0].key]) ? 200 : 201, //200检验成功,201、设备号或在线卡检验不通过
       type: 1,
       ...c_data
    }
  }else if(c_url.includes(base_url+checkState[1].path)){
     return{
       status: checkState[1].regexp.test(c_data[checkState[1].key]) ? 200 : 201, //200检验成功,201、设备号或在线卡检验不通过
       type: 2,
       ...c_data
    }
  }else {
    return{
       status: 400, //地址不匹配
       ...c_data
    }
  }
}