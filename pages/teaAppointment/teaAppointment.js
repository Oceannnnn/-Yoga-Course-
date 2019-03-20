// pages/teaAppointment/teaAppointment.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    currentId: 0,
    page: 1,
    onBottom: true,
    type: 1,
    orderList: [],
  },
  onLoad: function(options) {
    this.init()
  },
  init() {
    let HeaderList = [{
      name: "待上课",
      id: 0,
      type: "1"
    }, {
      name: "已结课",
      id: 1,
      type: "2"
    }]
    this.setData({
      HeaderList: HeaderList
    })
    this.orderList(1,1)
  },
  orderList(type, page) {
    let json = {
      type: type,
      size: 10,
      page: page,
    }
    let list = this.data.orderList;
    let token = app.globalData.token;
    util.http('teacher/orderList', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            orderList: list
          })
        } else {
          if (page > 1) {
            wx.showToast({
              title: '没有数据啦！',
              icon: 'none',
              duration: 2000
            })
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
      this.orderList(this.data.type, page);
    }
  },
  toList(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    this.setData({
      currentId: id,
      type: type,
      page: 1,
      onBottom: true,
      orderList: []
    })
    this.orderList(type, 1)
  },
  bindDetails(e) {
    util.toDetails(e, "appointmentDetails");
  }
})