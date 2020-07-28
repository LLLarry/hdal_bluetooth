/**
 * 格式化时间 
 * */
export const format =  function (value,type="yyyy-MM-DD hh:mm:ss") {
  let fmtVal= value
  if(typeof value === 'string'){
    // fmtVal= value.replace(getRegExp("-","g"),'/').replace(getRegExp("[.][0-9]+([+][0-9]+[ZT]?)?","g"), '')
     fmtVal= value.replace(getRegExp("-","g"),'/').replace(getRegExp("[.].+","g"), '')
    if(getRegExp('[0-9][TZ][0-9]').test(value)){
      let val= fmtVal.replace(getRegExp("[TZ]","g")," ")
      fmtVal= getDate(val).getTime()+8*60*60*1000
    }else{
      fmtVal= getDate(fmtVal).getTime()
    }
  }
  const date= getDate(fmtVal)
  const year= date.getFullYear()
  const month= (date.getMonth()+1) >= 10 ? (date.getMonth()+1) : '0'+(date.getMonth()+1)
  const day= date.getDate() >= 10 ? date.getDate() : '0'+date.getDate()
  const ho= date.getHours() >= 10 ? date.getHours() : '0'+date.getHours()
  const min= date.getMinutes() >= 10 ? date.getMinutes() : '0'+date.getMinutes()
  const sec= date.getSeconds() >= 10 ? date.getSeconds() : '0'+date.getSeconds()
  return type == 1 ? `${year}-${month}-${day}` :  `${year}-${month}-${day} ${ho}:${min}:${sec}`
}

