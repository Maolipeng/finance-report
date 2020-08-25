import { handleFetchQueue } from './handleFetchQueue.js'

/**
 *字节转换
 *
 * @param {*} bytes 字节大小
 * @param {*} byteType 传入的固定转换单位，不会再转成其他单位
 * @param {*} isRender false的话返回的是数值用于比大小的场景，true的话返回的是字符串，如 “1 MB” 这种形式，用于页面渲染
 * @returns 返回如isRender描述那样
 */
function byteToSize(bytes, byteType, isRender) {
  if (!bytes || typeof Number(bytes) != 'number') return
  bytes = Number(bytes)
  if (bytes === 0) return '0 B'
  if (typeof byteType === 'boolean' && isRender === undefined)
    isRender = byteType
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i =
    byteType && sizes.includes(byteType)
      ? sizes.indexOf(byteType)
      : Math.floor(Math.log(bytes) / Math.log(k))
  const resultSize = bytes / Math.pow(k, i)
  return isRender ? `${resultSize.toPrecision(3)}${sizes[i]}` : resultSize
}

function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export { handleFetchQueue, byteToSize, parseTime }
