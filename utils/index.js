import Qs from 'qs'
import { getUserid } from '/require/home'
/**
 * @param {string} base_url //扫码基础路径，在app.js中配置的全局变量
 * @param {string} url //要检测的地址
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
      regexp: /^\d{6}$/,
      key: 'code'
    },
    {
      path: '/oauth2Portpay',
      regexp: /^\d{7,8}$/,
      key: 'codeAndPort'
    },
    {
      path: '/oauth2online',
      regexp: /^[0-9A-F]{8}$/i,
      key: 'cardNumber'
    }
  ]
  for(let {path,regexp,key} of checkState){
      const url1= `${base_url}.cn${path}`
      const url2= `${base_url}.com.cn${path}`
      if((c_url.indexOf(url1) != -1) || (c_url.indexOf(url2) != -1)){
        return {
          status: regexp.test(c_data[key]) ? 200 : 201, //200检验成功,201、设备号或在线卡检验不通过
          type: key === 'code' ? 1 : key === 'codeAndPort' ? 2 : key === 'cardNumber' ? 3 : 0, // 1扫设备号、2扫端口号、3扫在线卡
          ...c_data
        }
    }
  }
  const bluetooth_reg= new RegExp('https://www.tengfuchong.cn/applet/\(\\d+\)','i')
  if(bluetooth_reg.test(url)){ //检测蓝牙设备二维码地址
     const regexp= /^\d{7,8}$/
     const code= url.match(bluetooth_reg)[1] != void 0 ? url.match(bluetooth_reg)[1] : ''
     return {
      status: regexp.test(code) ? 200 : 201,
      type: 4,
      code: code.substr(0,6),
      port: code.substring(6)
    }
  }
   return{
    status: 400, //地址不匹配
    ...c_data
  }
  // if(c_url.includes(base_url+checkState[0].path)){ //扫设备二维码
  //   return{
  //      status: checkState[0].regexp.test(c_data[checkState[0].key]) ? 200 : 201, //200检验成功,201、设备号或在线卡检验不通过
  //      type: 1,
  //      ...c_data
  //   }
  // }if(c_url.includes(base_url+checkState[1].path)){ //扫端口二维码
  //   return{
  //      status: checkState[1].regexp.test(c_data[checkState[1].key]) ? 200 : 201, //200检验成功,201、设备号或在线卡检验不通过
  //      type: 2,
  //      ...c_data
  //   }
  // }else if(c_url.includes(base_url+checkState[2].path)){ //扫在线卡二维码
  //    return{
  //      status: checkState[2].regexp.test(c_data[checkState[2].key]) ? 200 : 201, //200检验成功,201、设备号或在线卡检验不通过
  //      type: 3,
  //      ...c_data
  //   }
  // }else {
  //   return{
  //      status: 400, //地址不匹配
  //      ...c_data
  //   }
  // }
}

/**
 * 兼容低版本浏览器不支持ref获取组件的问题
 * @param {string} tipMessage 提示信息
 * @param {string} type showToast提示类型
 */ 
export const compatibleCloseMiniPro= function(tipMessage,type='fail'){
  if(this && this.closeMiniPro){
    if(tipMessage){
      this.setData({
        tipMessage
      })
    }
    this.closeMiniPro.setData({isshow: true})
  }else{
    my.showToast({
      type,
      content: tipMessage || '异常错误',
      duration: 2000,
      success: () => {
        my.reLaunch({
          url: "/pages/wantcharge/wantcharge"
        });
      },
    });
  }
}

/**
 * 获取用户id
 */
export const asyGetUserId= function(app){
  return new Promise((resolve,reject)=>{
    my.getAuthCode({
      scopes: ['auth_base'],
      success: async (res) => {
        try{
          let info= await getUserid({authCode: res.authCode})
          if(info.code == 200){
            app.globalData.userid= info.userid
          }
          resolve(info.userid)
        }catch(err){
          reject(err)
        }
      },
    });
  })
  
}