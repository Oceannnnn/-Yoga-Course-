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
  onShow() {
    if (app.globalData.state == 0) {
      this.setData({
        balance: 0
      })
    } else {
      this.member();
    }
  },
  init() {
    if (app.globalData.state == 1) {
      this.setData({
        state: app.globalData.state,
        userInfo: app.globalData.userInfo,
        balance: app.globalData.member
      })
    }
  },
  getUserInfo(e) {
    let that = this;
    let scene = '';
    if (wx.getStorageSync('scene')) {
      scene = wx.getStorageSync('scene')
    }
    wx.login({
      success: function(res) {
        let code = res.code
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  let encryptedData = msg.encryptedData;
                  let iv = msg.iv;
                  let token = '';
                  let json = {
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv,
                    invite_code: scene
                  }
                  json = JSON.stringify(json)
                  util.http('login/login', json, 'post', token).then(data => {
                    if (data.code == 200) {
                      util.getTokenFromServer();
                      let identity = data.data.identity;
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.distributor = data.data.distributor;
                      app.globalData.invite_code = data.data.invite_code;
                      app.globalData.identity = identity;
                      app.globalData.state = 1;
                      that.setData({
                        state: 1,
                        hasUserInfo: true,
                        userInfo: e.detail.userInfo
                      })
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          state: 1,
                          userInfo: e.detail.userInfo,
                          identity: identity
                        }
                      })
                      wx.setStorage({
                        key: "invite",
                        data: {
                          distributor: data.data.distributor,
                          invite_code: data.data.invite_code
                        }
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.member();
                      if (identity == 2) { //(1普通会员，2老师，3区域代理，4股东，5级差会员，6门店管理员，7门店推广员),其中你只要用到1,2,7这三个身份，id是会员ID
                        wx.redirectTo({
                          url: '../teaMy/teaMy',
                        })
                        return
                      } else if (identity == 6) {
                        wx.redirectTo({
                          url: '../storeMy/storeMy',
                        })
                        return
                      }
                      setTimeout(() => {
                        wx.switchTab({
                          url: '../index/index'
                        })
                      }, 500)
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '授权才能登录哦！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  member() {
    let token = app.globalData.token;
    util.http('member/info', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          balance: res.data.balance
        })
        app.globalData.member = res.data.balance;
        wx.setStorage({
          key: "member",
          data: res.data.balance
        })
      }
    })
  },
  out() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认退出吗？',
      success(res) {
        if (res.confirm) {
          wx.clearStorage();
          that.setData({
            state: 0,
            balance: 0
          })
          app.globalData.state = 0;
          app.globalData.member = 0;
        }
      }
    })
  },
  team() {
    if (this.data.state == 1) {
      if (app.globalData.distributor == 1) {
        wx.navigateTo({
          url: '../distribution/distribution'
        })
      } else {
        let that = this;
        wx.showModal({
          title: '提示',
          content: '确认申请吗？',
          success(res) {
            if (res.confirm) {
              that.bindtapUp()
            } else if (res.cancel) {}
          }
        })
      }
    }
  },
  bindtapUp() {
    let token = app.globalData.token;
    util.http('distributor/register', {}, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '申请成功',
          icon: 'success',
          duration: 1000
        })
        wx.setStorage({
          key: "invite",
          data: {
            distributor: 1,
            invite_code: res.data
          }
        })
        app.globalData.distributor = 1;
        app.globalData.invite_code = res.data;
        setTimeout(() => {
          wx.navigateTo({
            url: '../distribution/distribution'
          })
        }, 500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
})