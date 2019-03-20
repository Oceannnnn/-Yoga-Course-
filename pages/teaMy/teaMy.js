// pages/my/my.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    balance: 0,
    state: 0
  },
  onLoad: function(options) {
    this.init()
  },
  init() {
    this.setData({
      state: 1,
      userInfo: app.globalData.userInfo,
      balance: app.globalData.member
    })
  },
  out() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认退出吗？',
      success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../my/my',
          })
          wx.clearStorage();
          that.setData({
            state: 0,
            balance: 0
          })
          app.globalData.state = 0;
          app.globalData.member = 0;
          app.globalData.identity = 0;
        }
      }
    })
  }
})