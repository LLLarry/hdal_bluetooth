/**
 * url: {string} 请求地址
 * method: {method} 请求类型 default post
 * data: {object} 请求参数
 * url: {string} 加载loading框文字
 * hideLoading: {boolean} 是否隐藏加载框
 */
 import Qs from 'qs'
// const BASE_URL= 'http://localhost/'
//  const BASE_URL= 'http://192.168.3.45'
// const BASE_URL= 'http://tengfuchong.com.cn' //测试服务器后台域名
const BASE_URL= 'https://www.tengfuchong.cn' //正式服务器后台域名
export default ({url="",method="post",data={},loadText="加载中...",hideLoading=false})=>{
  return new Promise((resolve,reject)=>{
      if(!hideLoading){
        my.showLoading({
          content: loadText
        })
      }
      my.request({
        url: BASE_URL+url,
        method,
        data: method=== 'post' ? Qs.stringify(data) : data,
        headers:{
          'content-type':'application/x-www-form-urlencoded'  //默认值
        },
        dataType: 'json',
        success: (result) => {
          resolve(result.data)
        },
        fail:(error)=>{
          reject(error)
        },
        complete: (res)=>{
          my.hideLoading()
        }
      });
  })
}