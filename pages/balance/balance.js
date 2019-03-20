// pages/balance/balance.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    balance: "0.00",
    type: 1
  },
  onLoad(op) {
    if (op.type) {
      this.setData({
        type: op.type
      })
      wx.setNavigationBarTitle({
        title: '收益',
      })
    }
  },
  onShow() {
    this.setData({
      balance: app.globalData.member
    })
  },
  toExpressive(e) {
    util.toDetails(e, "distributionExpressive")
  },
  goCommission(e) {
    util.toDetails(e, "distributionCommission")
  },
  recharge(e) {
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  }
})