const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    comhidden: true,
    adList: [],
    keywords: '',
    page: 1,
    onBottom: true
  },
  onLoad() {
    this.adList(1)
  },
  onShow() {
    let that = this;
    if (!wx.getStorageSync('degree')) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          console.log(longitude)
          app.globalData.lat1 = latitude;
          app.globalData.lng1 = longitude;
          wx.setStorage({
            key: "degree",
            data: {
              latitude: latitude,
              longitude: longitude
            },
          })
          that.setData({
            latitude: latitude,
            longitude: longitude,
            page: 1,
            onBottom: true,
            adList: []
          })
          that.adList(1)
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
  bindconfirm(e) {
    this.setData({
      keywords: e.detail.value
    })
    this.setData({
      page: 1,
      onBottom: true,
      adList: []
    })
    this.adList(1)
  },
  adList(page) {
    let lat = app.globalData.latitude;
    let lng = app.globalData.longitude;
    let json = {
      size: 10,
      page: page,
      lat: lat,
      lng: lng,
      keywords: this.data.keywords
    }
    let list = this.data.adList;
    let token = app.globalData.token;
    util.http('course/search', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            adList: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.adList(page)
    }
  },
  courseDetails(e) {
    util.toDetails(e, "courseDetails")
  }
})