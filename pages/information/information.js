// pages/information/information.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    comhidden: true

  },
  onLoad() {
    let token = app.globalData.token;
    util.http('member/infoEdit', {}, 'get', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        this.setData({
          id: info.id,
          name: info.user_name,
          phone: info.mobile,
          address: info.address
        })
      }
    })

  },
  onShow() {
    let that = this;
    if (!wx.getStorageSync('degree')) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          app.globalData.latitude = latitude;
          app.globalData.longitude = longitude;
          wx.setStorage({
            key: "degree",
            data: {
              latitude: latitude,
              longitude: longitude
            }
          })
        }
      })
      return
    }
    this.getSetting();
  },
  getSetting() { //判断是否获得了用户地理位置授权
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation'])
          that.openConfirm()
      }
    })
  },
  openConfirm() {
    this.setData({
      comhidden: false
    })
  },
  bindopensetting(e) {
    this.setData({
      comhidden: true
    })
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  location() {
    this.getSetting();
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          address: res.address
        })
      }
    })
  },
  bindtap() {
    let token = app.globalData.token;
    var name = this.data.name,
      phone = this.data.phone,
      address = this.data.address,
      id = this.data.id;
    if (name == '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }
    if (phone == '') {
      wx.showToast({
        title: '请输入电话',
        icon: 'none'
      })
      return
    }
    if (address == '') {
      wx.showToast({
        title: '请输入地址',
        icon: 'none'
      })
      return
    }

    let json = {
      mobile: phone,
      user_name: name,
      address: address,
      id: id,
    }
    util.http("member/infoEdit", json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        wx.navigateBack();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
})