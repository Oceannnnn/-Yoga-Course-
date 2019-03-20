//app.js
// const util = require('utils/util.js');
App({
  onLaunch: function() {
    if (wx.getStorageSync('degree')) {
      this.globalData.latitude = wx.getStorageSync('degree').latitude;
      this.globalData.longitude = wx.getStorageSync('degree').longitude;
    }
    if (wx.getStorageSync('member')) {
      this.globalData.member = wx.getStorageSync('member')
    }
    if (wx.getStorageSync('token')) {
      this.globalData.token = wx.getStorageSync('token')
    }
    if (wx.getStorageSync('httpClient')) {
      this.globalData.state = wx.getStorageSync('httpClient').state;
      this.globalData.userInfo = wx.getStorageSync('httpClient').userInfo;
      let identity = wx.getStorageSync('httpClient').identity;
      this.globalData.identity = identity;
    }
    if (wx.getStorageSync('invite')) {
      this.globalData.distributor = wx.getStorageSync('invite').distributor;
      this.globalData.invite_code = wx.getStorageSync('invite').invite_code;
    }
  },
  globalData: {
    member: 0,
    token: '',
    latitude: "",
    longitude: "",
    state: 0,
    userInfo: null,
    appkey: 'FqHIfof446551JKj', // 密匙    
    appSecret: '95efa4a367649eea7f8f7947fe33706e', // 密钥
  },
})