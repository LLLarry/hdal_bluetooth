/**
 * @param {Array} checkList 待检验数据，成功执行下面，否则弹框 （必填）
 * @param {Function} callback 回调函数，目的时获取支付宝订单号 （必填）
 */

export default async function (checkList,callback){
  try{
    if(this.isPaying) return //不能重复提交
    if(checkList && Object.keys(checkList).length > 0){
      for(let {check,content} of checkList){
        if(!check){
          return  my.alert({
            title: '提示',
            content
          })
        }
      }
    }
    this.isPaying= true
    let info= await callback()
    if(info.code === 200){
        my.tradePay({
          // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          tradeNO: info.trade_no,
          success: (res) => {
            if(res.resultCode == 9000){
                this.setData({
                  tipMessage: '支付成功'
                })
                this.closeMiniPro.setData({isshow: true})
            }else if(res.resultCode == 6001){
              my.alert({
                title: '提示',
                content: res.memo
              })
              this.isPaying= false
            }
          },
          fail: (res) => {
            this.setData({
              tipMessage: '调用失败'
            })
            this.closeMiniPro.setData({isshow: true});
          }
        });
      }else{
        my.alert({
          title: '提示',
          content: info.message
        })
        this.isPaying= false
      }
  }catch(err){
    this.setData({
      tipMessage: '支付异常'
    })
    this.closeMiniPro.setData({isshow: true})
  }
}