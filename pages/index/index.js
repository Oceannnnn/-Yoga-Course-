//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    manList: [],
    imgUrls: [],
    storeList: [],
    adList: []
  },
  onLoad(op) {
    this.scene(op); //分销二维码扫描进入
    this.getCompanyConfig();
    if (app.globalData.identity == 2) { //(1普通会员，2老师，3区域代理，4股东，5级差会员，6门店管理员，7门店推广员),其中你只要用到1,2,7这三个身份，id是会员ID
      wx.redirectTo({
        url: '../teaMy/teaMy',
      })
      return
    } else if (app.globalData.identity == 6) {
      wx.redirectTo({
        url: '../storeMy/storeMy',
      })
      return
    }
    this.initPage()
  },
  scene(op) {
    let scene = '';
    if (op.scene) {
      scene = decodeURIComponent(op.scene);
    }
    if (op.invite_code) {
      scene = op.invite_code
    }
    wx.setStorage({
      key: 'scene',
      data: scene
    })
  },
  initPage() {
    util.http('index/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    util.http('index/nav', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          course: res.data.course,
          store: res.data.store,
          student: res.data.student,
          teacher: res.data.teacher
        })
      }
    })
    util.http('course/recommend', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          storeList: res.data
        })
      }
    })
    util.http('teacher/recommend', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          manList: res.data
        })
      }
    })
    util.getTokenFromServer()
  },
  bindtapStore(e) {
    util.toDetails(e, "courseDetails")
  },
  manList(e) {
    util.toDetails(e, "teacherDetails")
  },
  getCompanyConfig() {
    util.http('sms/index', {}, 'get').then(res => {
      if (res.code == 200) {
        let info = res.data;
        app.globalData.address = info.address;
        app.globalData.latitude = info.latitude;
        app.globalData.longitude = info.longitude;
        app.globalData.name = info.company;
        app.globalData.phone = info.user_phone;
        app.globalData.bg = info.bg;
      }
    })
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