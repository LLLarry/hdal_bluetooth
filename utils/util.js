function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

let getQueryString = function (url, name) {
  console.log("url = " + url)
  console.log("name = " + name)
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    console.log("r = " + r)
    console.log("r[2] = " + r[2])
    return r[2]
  }
  return null;
}
module.exports = {
  getQueryString: getQueryString,
}