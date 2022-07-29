/*
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-19 11:30:55
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-06-19 11:44:21
 */
export const dateStrByDate = function (excludeFutureDates) {
  let time = excludeFutureDates
  let seperator = '-'
  let month = time.getMonth() + 1
  let strDate = time.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  let currentdate = time.getFullYear() + seperator + month + seperator + strDate
  return currentdate
}

// export const getFormatTime = function (time) {
//   let date = new Date(time.replace(/-/g, '/'))
//   let seperator1 = '-'
//   let seperator2 = ':'
//   let month = date.getMonth() + 1
//   let strDate = date.getDate()
//   if (month >= 1 && month <= 9) {
//     month = '0' + month
//   }
//   if (strDate >= 0 && strDate <= 9) {
//     strDate = '0' + strDate
//   }
//   let setdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes()
//   return setdate
// }

export const getNumber = function (num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}
export const getFormatDate = function (o, seperator = '/') {
  const date = new Date(o)
  let dateTime = date.getFullYear() + seperator + getNumber(Number(date.getMonth() + 1)) + seperator + getNumber(date.getDate())
  return dateTime
}

export const getFormatTime = function (o, seperator = '-') {
  let date = new Date(o)
  let seperator1 = seperator
  let seperator2 = ':'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds()
  return currentdate
}

