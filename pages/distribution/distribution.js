// pages/distribution/distribution.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {

  },
  onShow() {
    this.init()
  },
  init() {
    let token = app.globalData.token;
    util.http('distributor/index', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          userInfo: app.globalData.userInfo,
          can_money: res.data.can_money,
          num: res.data.num,
          un_money: res.data.un_money,
          yet_money: res.data.yet_money,
          money: res.data.money
        })
      }
    })
  },
  toMoney() {
    wx.navigateTo({
      url: '../distributionMoney/distributionMoney?money=' + this.data.money + '&can_money=' + this.data.can_money + '&yet_money=' + this.data.yet_money,
    })
  },
  goCommission(e) {
    util.toDetails(e, "distributionCommission")
  },
  toExpressive(e) {
    util.toDetails(e, "distributionExpressive")
  },
  onShareAppMessage() {
    let invite_code = ""
    if (wx.getStorageSync("invite_code")) {
      invite_code = wx.getStorageSync("invite_code");
    }
    return {
      title: '分享不仅仅是一种生活，更是收获',
      path: '/pages/index/index?invite_code=' + invite_code
    }
  }
})