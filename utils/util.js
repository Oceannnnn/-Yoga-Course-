import md5 from 'md5.js';
const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const makeSign = (timesp) => {
  if (!timesp) {
    console.log('timestep 时间戳未获取')
  }
  var post_data = new Object();
  var key = app.globalData.appkey;
  var secret = app.globalData.appSecret;
  if (!key || !secret) {
    console.log('密匙或密钥获取失败');
  }
  var sign = md5(key + timesp + secret);
  post_data.sign = sign;
  post_data.timesp = timesp;
  return post_data; // 直接传给后台验证
}
const u = "https://yoga.fqwlkj.cn/api/"
const http = (url, data = {}, method = 'get', token = '') => {
  let timestamp = Date.parse(new Date());
  let post_data = makeSign(timestamp);
  post_data = JSON.stringify(post_data);
  const allUrl = u + url;
  return new Promise(function(resolve, reject) {
    wx.request({
      url: allUrl,
      data: data,
      method: method ? method : 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token,
        post_data: post_data
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
}
// 带参数跳转到对应页面
const toDetails = (e, url) => {
  let id = e.currentTarget.dataset.id;
  let type = e.currentTarget.dataset.type;
  wx.navigateTo({
    url: '../' + url + '/' + url + '?id=' + id + '&type=' + type
  })
}
const getTokenFromServer = (callBack) => {
  var that = this;
  let token = "";
  wx.login({
    success: function(res) {
      wx.setStorageSync('code', res.code);
      http('login/token', {
        code: res.code
      }, 'post').then(data => {
        wx.setStorageSync('token', data.data);
        callBack && callBack(data.data);
        app.globalData.token = data.data;
      })
    }
  })
}
module.exports = {
  http: http,
  u: u,
  formatTime: formatTime,
  makeSign: makeSign,
  toDetails: toDetails,
  getTokenFromServer: getTokenFromServer
}